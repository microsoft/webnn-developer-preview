/* eslint-disable no-undef */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
//
// An example how to run Z-Image Turbo with webnn/webgpu in onnxruntime-web.

import {
    $,
    $$,
    log,
    logError,
    setupORT,
    showCompatibleChromiumVersion,
    getHuggingFaceDomain,
    createMlTensor,
    createGpuTensor,
    readBackMLTensor,
    readBackGpuTensor,
} from "../../assets/js/common_utils.js";
import {
    getTextEncoderInputs,
    drawImage,
    getConfig,
    getModelOPFS,
    isNormalMode,
    sizeOfShape,
    createLatents,
} from "./utils.js";
import { updateScheduler } from "./scheduler.js";
import { WebNNPerf } from "../webnn-perf.js";

let mlContext;
let gpuDevice;
let memoryReleaseSwitch;
const dom = {};
const modelDOMPrefixes = {
    text_encoder: "textEncoder",
    transformer: "transformer",
    vae_decoder: "vae",
    safety_checker: "sc",
};
const buttons = $("#buttons");
const generate = $("#generate");
const load = $("#load");
const prompt = $("#user-input");
const totalData = $("#total_data");
const progressStatus = $("#progress-status");
const progressText = $("#progress-text");
const finalTime = $("#final-time");
/** @type {Promise<void>} Promise that resolves when models are loaded */
let loading;
// Set once the initial load finishes; gates the rebuild hint.
let modelsLoaded = false;

const config = getConfig();
let numInferenceSteps = 9;
let timesteps = null;
const dataType = "float16";

// Upper bound of #steps-input, mirroring its max attribute.
const maxInferenceSteps = 9;
// Pre-allocated latent tensors bound round-robin across the denoising loop: step i reads
// latentRing[i] and writes latentRing[i + 1]. Two is always enough, whatever the step count —
// the loop is a strict serial chain and each preview decodes its latent in the same iteration
// that produced it, so nothing outlives the next rebind.
let latentRing = [];
// Whether the user asked for per-step previews. Flips the IO binding mode, so changing it
// rebuilds tensors.
let showSteps = false;
// Effective IO binding, forced off by step previews: only then is every session.run() a sync point,
// which is what makes total - previewMs exact. It also makes the pipeline slower, so the
// preview-mode total is not comparable to the default one.
let useIOBinding = config.useIOBinding;
// One canvas per step, holding that step's decoded preview at full resolution.
let stepCanvases = [];
// Off-screen copy of the final image, so clicking a thumbnail can swap the main canvas back.
let finalCanvas = null;
// How many trailing previews go through the safety checker. Content only becomes legible in the
// last couple of steps; before that the latent is still mostly noise, which CLIP embeds into a
// meaningless vector and the checker false-positives on. A fixed tail rather than a noise-level
// threshold, because fewer steps mean bigger jumps: this covers 2 of 2 previews at 3 steps and
// 2 of 8 at 9, which is the direction that matches what the frames actually look like.
const screenedPreviews = 2;

const maxSequenceLength = 512;
let resolution = 512;
// Resolution the current sessions were compiled for.
let currentResolution = resolution;
let imageHeight = resolution;
let imageWidth = resolution;

// WebNN needs static shapes, so it also pins the sequence length; WebGPU keeps it dynamic.
// TODO: Drop once WebNN supports dynamic shapes.
const pinsSequenceLength = config.provider === "webnn";

// Bucketing so small prompt edits don't trigger WebNN rebuilds; disable with ?padSequence=false. The
// transformer has no attention mask, so padding changes the generated image.
const sequencePadMultiple = config.padSequence ? 64 : 0;
// Current prompt's token count (padded if enabled), updated as the prompt is edited.
let sequenceLength = 113;
// Sequence length the current sessions were compiled for.
let currentSequenceLength = sequenceLength;
// Sequence length the cached text-encoder I/O tensors were built for (0 = none cached).
let textEncoderSequenceLength = 0;

const models = {
    text_encoder: {
        name: "Text Encoder",
        url: "text_encoder_model_q4f16.onnx",
        externalDataUrls: ["text_encoder_model_q4f16.onnx_data", "text_encoder_model_q4f16.onnx_data_1"],
        size: "2.06GB",
    },
    transformer: {
        name: "Transformer",
        url: "transformer_model_q4f16.onnx",
        externalDataUrls: ["transformer_model_q4f16.onnx_data", "transformer_model_q4f16.onnx_data_1"],
        size: "3.41GB",
    },
    scheduler_step: {
        name: "Scheduler Step",
        url: "scheduler_step_model_f16.onnx",
        size: "4KB",
    },
    vae_pre_process: {
        name: "VAE Pre Process",
        url: "vae_pre_process_model_f16.onnx",
        size: "1KB",
    },
    vae_decoder: {
        name: "VAE Decoder",
        url: "vae_decoder_model_f16.onnx",
        size: "94.6MB",
    },
    sc_prep: {
        name: "Safety Checker Pre-processing",
        url: "sc_prep_model_f16.onnx",
        size: "1KB",
    },
    safety_checker: {
        name: "Safety Checker",
        url: "safety_checker_model_f16.onnx",
        externalDataUrls: ["safety_checker_model_f16.onnx_data"],
        size: "580MB",
    },
};

// Models whose sessions pin height/width and must be re-created on a resolution change.
const resolutionDependentModels = ["transformer", "scheduler_step", "vae_pre_process", "vae_decoder", "sc_prep"];

// Models that also pin the sequence length (WebNN only).
const sequenceLengthDependentModels = ["text_encoder", "transformer"];

// Models a rebuild has started on but not finished. A failed rebuild may leave their sessions
// released or compiled for the attempted dimensions, and the tensors disposed, so they stay stale
// (even if the settings are reverted) until a rebuild or a full load completes.
const dirtyModels = new Set();

// Keeps the other session options, e.g. externalData from the first load.
function setFreeDimensionOverrides(modelName, overrides) {
    const model = models[modelName];
    if (!model) {
        return;
    }
    model.sessionOptions = {
        ...(model.sessionOptions ?? {}),
        freeDimensionOverrides: { ...overrides },
    };
}

// Takes the dimensions explicitly so the caller can record what the sessions were built for.
function updateModelDimensions(resolution, sequenceLength) {
    imageHeight = resolution;
    imageWidth = resolution;

    const latentHeight = imageHeight / 8;
    const latentWidth = imageWidth / 8;

    // Static height/width also helps WebGPU performance, at the cost of a rebuild on resize.
    setFreeDimensionOverrides("transformer", {
        height: latentHeight,
        width: latentWidth,
        ...(pinsSequenceLength && { cap_seq_len: sequenceLength }),
    });
    setFreeDimensionOverrides("scheduler_step", { height: latentHeight, width: latentWidth });
    setFreeDimensionOverrides("vae_pre_process", { height: latentHeight, width: latentWidth });
    setFreeDimensionOverrides("vae_decoder", { latent_height: latentHeight, latent_width: latentWidth });
    if (config.safetyChecker) {
        setFreeDimensionOverrides("sc_prep", { height: imageHeight, width: imageWidth });
    }

    if (pinsSequenceLength) {
        setFreeDimensionOverrides("text_encoder", {
            sequence_length: sequenceLength,
            total_sequence_length: sequenceLength,
        });
    }

    models["text_encoder"].inputInfo = {};
    models["text_encoder"].outputInfo = {};

    models["transformer"].inputInfo = {
        hidden_states: {
            dataType: dataType,
            dims: [1, 16, imageHeight / 8, imageWidth / 8],
            writable: true,
        },
        timestep: { dataType: dataType, dims: [1], writable: true },
    };
    models["transformer"].outputInfo = {
        sample: { dataType: dataType, dims: [1, 16, imageHeight / 8, imageWidth / 8] },
    };

    models["scheduler_step"].inputInfo = {
        noise_pred: { dataType: dataType, dims: [1, 16, imageHeight / 8, imageWidth / 8] },
        latents: { dataType: dataType, dims: [1, 16, imageHeight / 8, imageWidth / 8] },
        step_info: { dataType: dataType, dims: [2], writable: true },
    };
    models["scheduler_step"].outputInfo = {
        latents_out: {
            dataType: dataType,
            dims: [1, 16, imageHeight / 8, imageWidth / 8],
        },
    };

    models["vae_pre_process"].inputInfo = {
        latents: { dataType: dataType, dims: [1, 16, imageHeight / 8, imageWidth / 8] },
    };
    models["vae_pre_process"].outputInfo = {
        scaled_latents: { dataType: dataType, dims: [1, 16, imageHeight / 8, imageWidth / 8] },
    };

    models["vae_decoder"].inputInfo = {
        latent_sample: { dataType: dataType, dims: [1, 16, imageHeight / 8, imageWidth / 8] },
    };
    models["vae_decoder"].outputInfo = {
        sample: { dataType: dataType, dims: [1, 3, imageHeight, imageWidth], readable: true },
    };

    if (config.safetyChecker) {
        models["sc_prep"].inputInfo = {
            sample: { dataType: dataType, dims: [1, 3, imageHeight, imageWidth] },
        };
        models["sc_prep"].outputInfo = {
            clip_input: { dataType: dataType, dims: [1, 3, 224, 224] },
        };
        models["safety_checker"].inputInfo = {
            clip_input: { dataType: dataType, dims: [1, 3, 224, 224], writable: true },
        };
        models["safety_checker"].outputInfo = {
            has_nsfw_concepts: { dataType: "bool", dims: [1], readable: true },
        };
    }
}

class ProgressManager {
    constructor(config) {
        this.config = config;
        this.weights = this.getWeights(config.safetyChecker);
        this.progress = {};
        this.totalProgress = 0;

        // Initialize progress for all models
        for (const key in this.weights) {
            this.progress[key] = { fetch_base: 0, fetch_data: 0, compile: 0 };
        }
    }

    getWeights(safetyChecker) {
        if (safetyChecker) {
            return {
                text_encoder: { fetch: 10, compile: 15 },
                transformer: { fetch: 20, compile: 40 },
                vae_decoder: { fetch: 2, compile: 3 },
                safety_checker: { fetch: 5, compile: 5 },
            };
        } else {
            return {
                text_encoder: { fetch: 10, compile: 20 },
                transformer: { fetch: 25, compile: 40 },
                vae_decoder: { fetch: 2, compile: 3 },
            };
        }
    }

    // Same weights as the initial load, with the models that are not rebuilt counted as done, so the
    // bar starts where the first load had it when it reached the rebuilt models.
    // Nothing resets afterwards, or the loading-progress overlay (the animated "loadwave" over the
    // image frame) would flash 0% on the way out.
    beginRebuild(modelNames) {
        this.weights = this.getWeights(this.config.safetyChecker);
        this.reset();
        for (const key in this.progress) {
            if (!modelNames.includes(key)) {
                this.progress[key] = { fetch_base: 100, fetch_data: 100, compile: 100 };
            }
        }
        this.calculateTotal();
        updateLoadWave(this.totalProgress.toFixed(2));
    }

    update(modelName, stage, percentage) {
        let key = modelName;
        if (modelName.includes("text_encoder")) key = "text_encoder";
        else if (modelName.includes("transformer")) key = "transformer";
        else if (modelName.includes("vae_decoder")) key = "vae_decoder";
        else if (modelName.includes("safety_checker")) key = "safety_checker";

        if (!this.weights[key]) return;

        this.progress[key][stage] = percentage;

        this.calculateTotal();
        updateLoadWave(this.totalProgress.toFixed(2));
    }

    calculateTotal() {
        let total = 0;
        for (const key in this.weights) {
            const w = this.weights[key];
            const p = this.progress[key];

            let fetchProgress = p.fetch_base;
            if (models[key] && models[key].externalDataUrls) {
                fetchProgress = p.fetch_base * 0.1 + p.fetch_data * 0.9;
            }

            total += (fetchProgress * w.fetch) / 100;
            total += (p.compile * w.compile) / 100;
        }
        this.totalProgress = total;
    }

    reset() {
        for (const key in this.progress) {
            this.progress[key] = { fetch_base: 0, fetch_data: 0, compile: 0 };
        }
        this.totalProgress = 0;
        updateLoadWave(0.0);
    }
}
const progressManager = new ProgressManager(config);

// Fetch a model (OPFS-cached) and create its session; shared by loadModels and rebuildSessions.
async function createModelSession(modelName, model) {
    const modelNameInLog = model.name;
    let startTime = performance.now();
    // Base directory shared by the model graph and its sibling external data files.
    let baseUrl = `${config.model}/onnx`;
    if (baseUrl.includes("huggingface.co")) {
        await getHuggingFaceDomain().then(domain => {
            baseUrl = baseUrl.replace("huggingface.co", domain);
        });
    }
    const modelUrl = `${baseUrl}/${model.url}`;
    log(`[Load] Loading model ${modelNameInLog} · ${model.size}`);
    const modelBuffer = await WebNNPerf.time(
        "webnn.model.fetch",
        () =>
            getModelOPFS(`zimage-${modelUrl.replace(/\//g, "_")}`, modelUrl, false, percentage =>
                progressManager.update(modelName, "fetch_base", percentage),
            ),
        { model: modelName },
    );
    if (model.externalDataUrls) {
        model.sessionOptions = model.sessionOptions || {};
        model.sessionOptions.externalData = [];

        // Combine per-file download progress into the single fetch_data percentage.
        const dataProgress = new Array(model.externalDataUrls.length).fill(0);
        const reportDataProgress = () => {
            const averageProgress = dataProgress.reduce((total, progress) => total + progress, 0) / dataProgress.length;
            progressManager.update(modelName, "fetch_data", averageProgress);
        };

        for (let index = 0; index < model.externalDataUrls.length; index++) {
            const dataFileName = model.externalDataUrls[index];
            const dataUrl = `${baseUrl}/${dataFileName}`;
            const externalDataBlob = await WebNNPerf.time(
                "webnn.model.fetch",
                () =>
                    getModelOPFS(`zimage-${dataUrl.replace(/\//g, "_")}`, dataUrl, false, percentage => {
                        dataProgress[index] = percentage;
                        reportDataProgress();
                    }),
                { model: `${modelName}-data-${index}` },
            );
            model.sessionOptions.externalData.push({
                data: externalDataBlob,
                path: dataFileName,
            });
        }
    }

    const modelFetchTime = (performance.now() - startTime).toFixed(2);
    if (dom[modelName]) {
        dom[modelName].fetch.innerHTML = modelFetchTime;
    }

    log(`[Load] ${modelNameInLog} loaded · ${modelFetchTime}ms`);
    log(`[Session Create] Beginning ${modelNameInLog}`);

    const resolvedSessionOptions = {
        executionProviders: [
            {
                name: config.provider,
                deviceType: config.deviceType,
                context: mlContext,
            },
        ],
        logSeverityLevel: config.verbose ? 0 : 3, // 0: verbose, 1: info, 2: warning, 3: error
        ...model.sessionOptions,
    };
    startTime = performance.now();
    console.log(resolvedSessionOptions);
    // InferenceSession.create accepts string | Uint8Array | ArrayBuffer, not a Blob/File,
    // so materialize the (small) model graph here; the large weights stay as Blobs in externalData.
    const modelArrayBuffer = await modelBuffer.arrayBuffer();
    model.session = await ort.InferenceSession.create(modelArrayBuffer, resolvedSessionOptions);
    const sessionCreationTime = (performance.now() - startTime).toFixed(2);

    if (dom[modelName]) {
        dom[modelName].create.innerHTML = sessionCreationTime;
        progressManager.update(modelName, "compile", 100);
    }

    if (isNormalMode()) {
        log(`[Session Create] Create ${modelNameInLog} completed · ${sessionCreationTime}ms`);
    } else {
        log(`[Session Create] Create ${modelNameInLog} completed`);
    }
}

/*
 * load models used in the pipeline
 */
async function loadModels(models) {
    log("[Load] ONNX Runtime Execution Provider: " + config.provider);
    log("[Load] ONNX Runtime EP device type: " + config.deviceType);
    if (sequencePadMultiple > 0) {
        log(
            `[Load] Prompt padding on: sequence length rounded up to a multiple of ${sequencePadMultiple}. ` +
                `Fewer rebuilds, but generated images differ from an unpadded run`,
        );
    }
    WebNNPerf.configure({ device: config.deviceType, provider: config.provider });
    progressManager.reset();
    load.disabled = true;

    // Snapshot the settings: the resolution and prompt can change while the models download.
    const loadResolution = resolution;
    const loadSequenceLength = sequenceLength;
    updateModelDimensions(loadResolution, loadSequenceLength);

    try {
        for (const [modelName, model] of Object.entries(models)) {
            await createModelSession(modelName, model);
        }

        if (config.provider === "webgpu") {
            gpuDevice = ort.env.webgpu.device;
        }
        const startInitTensors = performance.now();
        await initializeTensors();
        currentResolution = loadResolution;
        currentSequenceLength = loadSequenceLength;
        dirtyModels.clear();

        log(`[Session Create] Initialize tensors completed · ${(performance.now() - startInitTensors).toFixed(2)}ms`);
    } catch (e) {
        logError(`[Load] failed, ${e}`);
        return;
    }
    updateLoadWave(100.0);
    modelsLoaded = true;
    // Changing the resolution or the prompt mid-load leaves the sessions on the old settings.
    updateRebuildHint();
    log("[Session Create] Ready to generate image");
    let imageArea = $$("#image_area>div");
    imageArea.forEach(i => {
        i.setAttribute("class", "frame ready");
    });
    buttons.setAttribute("class", "button-group key action-buttons loaded");
    generate.disabled = false;
    $("#user-input").setAttribute("class", "form-control enabled");
}

const getDataTypeSize = dataType => {
    switch (dataType) {
        case "int64":
            return 8;
        case "float32":
        case "int32":
            return 4;
        case "float16":
            return 2;
        case "uint8":
        case "bool":
            return 1;
        default:
            throw new Error(`Unsupported data type: ${dataType}`);
    }
};

async function createTensor(tensorInfo) {
    let tensor;
    const numElements = sizeOfShape(tensorInfo.dims);
    if (!useIOBinding) {
        let data;
        switch (tensorInfo.dataType) {
            case "float32":
                data = new Float32Array(numElements);
                break;
            case "float16":
                data = new Float16Array(numElements);
                break;
            case "int32":
                data = new Int32Array(numElements);
                break;
            case "int64":
                data = new BigInt64Array(numElements);
                break;
            case "bool":
            case "uint8":
                data = new Uint8Array(numElements);
                break;
            default:
                throw new Error(`Unsupported data type: ${tensorInfo.dataType}`);
        }
        return new ort.Tensor(tensorInfo.dataType, data, tensorInfo.dims);
    }
    if (config.provider === "webnn") {
        tensor = await createMlTensor(
            mlContext,
            tensorInfo.dataType,
            tensorInfo.dims,
            tensorInfo.writable ?? false,
            tensorInfo.readable ?? false,
        );
    } else if (config.provider === "webgpu") {
        const bufferSize = numElements * getDataTypeSize(tensorInfo.dataType);
        tensor = await createGpuTensor(gpuDevice, tensorInfo.dataType, tensorInfo.dims, bufferSize);
    } else {
        throw new Error(`Unsupported provider: ${config.provider}`);
    }
    return tensor;
}

function writeTensor(tensor, data) {
    if (!useIOBinding) {
        tensor.data.set(data);
        return;
    }

    if (config.provider === "webnn") {
        mlContext.writeTensor(tensor.mlTensorData, data);
    } else if (config.provider === "webgpu") {
        const size = data.byteLength;
        const alignedSize = Math.ceil(size / 4) * 4;
        const gpuBuffer = tensor.gpuBuffer;
        const commandEncoder = gpuDevice.createCommandEncoder();
        const tempBuffer = gpuDevice.createBuffer({
            size: alignedSize,
            usage: GPUBufferUsage.COPY_SRC,
            mappedAtCreation: true,
        });
        const mapping = tempBuffer.getMappedRange();
        new Uint8Array(mapping).set(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
        tempBuffer.unmap();
        commandEncoder.copyBufferToBuffer(tempBuffer, 0, gpuBuffer, 0, alignedSize);
        const commandBuffer = commandEncoder.finish();
        gpuDevice.queue.submit([commandBuffer]);
    }
}

async function readTensor(tensor, targetBuffer) {
    if (!useIOBinding) {
        targetBuffer.set(tensor.data);
        return;
    }

    if (config.provider === "webnn") {
        await readBackMLTensor(mlContext, tensor.mlTensorData, targetBuffer);
    } else if (config.provider === "webgpu") {
        const bufferSize = sizeOfShape(tensor.dims) * getDataTypeSize(tensor.type);
        await readBackGpuTensor(gpuDevice, tensor.gpuBuffer, bufferSize, targetBuffer);
    }
}

// Release a list of IO-binding tensors, skipping duplicates. Inputs routinely alias another
// model's output (the same GPU buffer / ML tensor), which must not be destroyed twice.
function disposeTensorList(tensors) {
    const seen = new Set();
    for (const tensor of tensors) {
        if (!tensor || seen.has(tensor)) {
            continue;
        }
        seen.add(tensor);
        if (tensor.disposer == undefined) {
            if (tensor.dataLocation == "ml-tensor") {
                tensor.mlTensorData.destroy();
            } else if (tensor.dataLocation == "gpu-buffer") {
                tensor.gpuBufferData.destroy();
            }
        } else {
            tensor.dispose();
        }
    }
}

function disposeTensors() {
    const tensors = [];
    for (const model of Object.values(models)) {
        tensors.push(...Object.values(model.feed ?? {}), ...Object.values(model.fetches ?? {}));
    }
    // Ring members past the two currently bound ones are not reachable from any feed/fetches,
    // so add them explicitly. disposeTensorList skips the duplicates.
    tensors.push(...latentRing);
    disposeTensorList(tensors);
    latentRing = [];
}

// Text encoder I/O tensors are sized by the (prompt-dependent) sequence length and cached across
// runs; release them explicitly when the length changes or on teardown.
function disposeTextEncoderTensors() {
    disposeTensorList([
        ...Object.values(models["text_encoder"].feed ?? {}),
        ...Object.values(models["text_encoder"].fetches ?? {}),
    ]);
}

async function initializeTensors() {
    // text_encoder
    // Delay the creation of this tensor until needed, as the sequence length may change.
    models["text_encoder"].feed = {
        // "input_ids": await createTensor(models["text_encoder"].inputInfo.input_ids),
        // "attention_mask": await createTensor(models["text_encoder"].inputInfo.attention_mask),
    };
    models["text_encoder"].fetches = {
        // "encoder_hidden_states": await createTensor(models["text_encoder"].outputInfo["encoder_hidden_states"]),
    };
    // Any previously cached text-encoder tensors were released by the caller's disposeTensors();
    // invalidate the cache so generateImage rebuilds them for the current sequence length.
    textEncoderSequenceLength = 0;

    // Latent ring — the classic two-tensor ping-pong. Only the first member is written from JS
    // (the initial noise), so it carries the writable flag; the second is a pure scheduler output.
    latentRing = [
        await createTensor(models["transformer"].inputInfo.hidden_states),
        await createTensor(models["scheduler_step"].outputInfo.latents_out),
    ];

    // transformer
    models["transformer"].feed = {
        hidden_states: latentRing[0],
        timestep: await createTensor(models["transformer"].inputInfo.timestep),
        // Delay the creation of this tensor until needed, as the sequence length may change
        // encoder_hidden_states: await createTensor(models["transformer"].inputInfo.encoder_hidden_states),
    };
    models["transformer"].fetches = {
        sample: await createTensor(models["transformer"].outputInfo.sample),
    };

    // scheduler_step
    models["scheduler_step"].feed = {
        noise_pred: models["transformer"].fetches.sample,
        latents: latentRing[0],
        step_info: await createTensor(models["scheduler_step"].inputInfo.step_info),
    };
    models["scheduler_step"].fetches = {
        latents_out: latentRing[1],
    };

    // vae_pre_process
    models["vae_pre_process"].feed = {
        latents: models["scheduler_step"].fetches.latents_out,
    };
    models["vae_pre_process"].fetches = {
        scaled_latents: await createTensor(models["vae_pre_process"].outputInfo.scaled_latents),
    };

    // vae_decoder
    models["vae_decoder"].feed = {
        latent_sample: models["vae_pre_process"].fetches.scaled_latents,
    };
    models["vae_decoder"].fetches = {
        sample: await createTensor(models["vae_decoder"].outputInfo.sample),
    };

    // safety_checker
    if (config.safetyChecker) {
        models["sc_prep"].feed = {
            sample: models["vae_decoder"].fetches.sample,
        };
        models["sc_prep"].fetches = {
            clip_input: await createTensor(models["sc_prep"].outputInfo.clip_input),
        };

        models["safety_checker"].feed = {
            clip_input: models["sc_prep"].fetches.clip_input,
        };
        models["safety_checker"].fetches = {
            has_nsfw_concepts: await createTensor(models["safety_checker"].outputInfo.has_nsfw_concepts),
        };
    }
}

// Stale models, in pipeline order so the progress bar advances monotonically.
function modelsNeedingRebuild() {
    const staleModels = new Set();
    if (currentResolution !== resolution) {
        resolutionDependentModels.forEach(modelName => staleModels.add(modelName));
    }
    if (pinsSequenceLength && currentSequenceLength !== sequenceLength) {
        sequenceLengthDependentModels.forEach(modelName => staleModels.add(modelName));
    }
    dirtyModels.forEach(modelName => staleModels.add(modelName));
    // Also drops the safety checker models, which are deleted from `models` when it is off.
    return Object.keys(models).filter(modelName => staleModels.has(modelName));
}

// State advances only on success; until then the models stay dirty, so a failed rebuild is retried
// on the next Generate even if the settings are reverted.
async function rebuildSessions(modelNames) {
    const startTime = performance.now();
    const targetResolution = resolution;
    const targetSequenceLength = sequenceLength;
    const target = pinsSequenceLength
        ? `${targetResolution}x${targetResolution}, sequence length ${targetSequenceLength}`
        : `${targetResolution}x${targetResolution}`;

    log(`[Session Create] Rebuilding ${modelNames.length} model(s) for ${target}...`);
    $("#img_div").setAttribute("class", "frame loadwave");
    progressManager.beginRebuild(modelNames);

    // Blank the old create times so the table shows which models are being rebuilt; each row refills
    // as its model finishes.
    for (const modelName of modelNames) {
        if (dom[modelName]) {
            dom[modelName].create.innerHTML = "";
        }
    }

    // Mark before releasing anything, so a failure part-way through can't go unnoticed.
    modelNames.forEach(modelName => dirtyModels.add(modelName));

    try {
        disposeTensors();
        updateModelDimensions(targetResolution, targetSequenceLength);

        // Release before create: two live transformer sessions would take several GB.
        for (const modelName of modelNames) {
            const model = models[modelName];
            if (model.session) {
                await model.session.release();
                model.session = undefined;
            }
            await createModelSession(modelName, model);
        }

        await initializeTensors();
        currentResolution = targetResolution;
        currentSequenceLength = targetSequenceLength;
        dirtyModels.clear();
    } finally {
        // Also on failure, so the loading state stops and the hint reflects the dirty models. On
        // success generateImage() sets the next frame state.
        if (dirtyModels.size > 0) {
            $("#img_div").setAttribute("class", "frame");
        }
        updateRebuildHint();
    }

    const elapsedTime = (performance.now() - startTime).toFixed(2);
    log(`[Session Create] Rebuilt models for ${target} · ${elapsedTime}ms`);
}

// Screen whatever the VAE decoder last produced. sc_prep's input is bound to that output, so this
// classifies the current frame — the final image or, during a preview, an intermediate step.
async function checkNsfw(buffer) {
    await runModel(models["sc_prep"]);
    await runModel(models["safety_checker"]);
    await readTensor(models["safety_checker"].fetches.has_nsfw_concepts, buffer);
    return buffer[0] !== 0;
}

async function runModel(model) {
    if (useIOBinding) {
        await WebNNPerf.time("webnn.inference", () => model.session.run(model.feed, model.fetches), {
            model: model.name || "unknown",
        });
    } else {
        const results = await WebNNPerf.time("webnn.inference", () => model.session.run(model.feed), {
            model: model.name || "unknown",
        });
        for (const [name, tensor] of Object.entries(results)) {
            if (model.fetches[name]) {
                model.fetches[name].data.set(tensor.data);
            } else {
                console.warn(`[runModel] Output ${name} not found in fetches for model ${model.name}`);
            }
        }
    }
}

// #img_canvas is a pure display surface: the final image lives in finalCanvas and each step's
// preview in stepCanvases[i], so a thumbnail click swaps what is shown without decoding anything.
function showOnMainCanvas(source) {
    const canvas = $("#img_canvas");
    canvas.width = source.width;
    canvas.height = source.height;
    canvas.getContext("2d").drawImage(source, 0, 0);
}

// Blur and label the main frame when the image it shows was flagged by the safety checker.
function setFrameNsfw(flagged) {
    const frame = $("#img_div");
    frame.classList.toggle("nsfw", flagged);
    if (flagged) {
        frame.setAttribute("title", "Not safe for work (NSFW) content");
    } else {
        frame.removeAttribute("title");
    }
}

// Show a step's preview on the main canvas and mark it as the selected thumbnail. Silently ignores
// steps that have not been decoded yet (their canvas is still zero-sized).
function selectStep(index) {
    const canvas = stepCanvases[index];
    if (!canvas || canvas.width === 0) {
        return;
    }
    showOnMainCanvas(canvas);
    const thumbs = $$("#step_strip .step-thumb");
    thumbs.forEach((thumb, i) => thumb.classList.toggle("active", i === index));
    // Each step carries its own verdict, so switching steps can never unblur a flagged one.
    setFrameNsfw(thumbs[index].classList.contains("nsfw"));
}

// Rebuild the strip to match the current step count. The thumbnails start zero-sized; drawImage
// gives each one the full image resolution, and CSS scales it down for display.
function buildStepStrip() {
    const strip = $("#step_strip");
    strip.classList.toggle("hide", !showSteps);
    strip.replaceChildren();
    stepCanvases = [];

    if (!showSteps) {
        return;
    }

    for (let i = 0; i < numInferenceSteps; i++) {
        const canvas = document.createElement("canvas");
        canvas.width = 0;
        canvas.height = 0;
        const label = document.createElement("span");
        label.textContent = i + 1;

        const thumb = document.createElement("div");
        thumb.className = "step-thumb";
        thumb.title = `Step ${i + 1} of ${numInferenceSteps}`;
        thumb.append(canvas, label);
        thumb.addEventListener("click", () => selectStep(i));

        strip.append(thumb);
        stepCanvases.push(canvas);
    }
}

// Clear the previous run's previews so a new run does not show stale steps.
function resetStepStrip() {
    if (!showSteps) {
        return;
    }
    if (stepCanvases.length !== numInferenceSteps) {
        buildStepStrip();
        return;
    }
    for (const canvas of stepCanvases) {
        canvas.width = 0;
        canvas.height = 0;
        canvas.parentElement.classList.remove("active", "nsfw");
    }
}

// Warn that the next Generate will rebuild sessions for the changed settings.
function updateRebuildHint() {
    const rebuildHint = $("#rebuild-hint");
    const staleSettings = [];
    if (currentResolution !== resolution) {
        staleSettings.push(`${resolution}×${resolution}`);
    }
    if (pinsSequenceLength && currentSequenceLength !== sequenceLength) {
        staleSettings.push(`${sequenceLength} tokens`);
    }

    const rebuildPending = modelsLoaded && (staleSettings.length > 0 || dirtyModels.size > 0);
    // The element stays in the accessibility tree (see #rebuild-hint) and is a live region, so the
    // change in text is what's announced; clear it when there is nothing to warn about.
    if (!rebuildPending) {
        rebuildHint.textContent = "";
    } else if (staleSettings.length > 0) {
        rebuildHint.textContent = `rebuilds models for ${staleSettings.join(" · ")}`;
    } else {
        rebuildHint.textContent = "rebuilds models after a failed rebuild";
    }
    rebuildHint.classList.toggle("hide", !rebuildPending);
}

// Lock the controls that feed a run in progress. Toggling "Steps preview" or the step count
// mid-run would resize the latent ring under the loop, so they are locked alongside the rest.
function setControlsDisabled(disabled) {
    generate.disabled = disabled;
    prompt.disabled = disabled;
    for (const id of ["#resolution-select", "#seed-input", "#random-seed", "#steps-input", "#show-steps"]) {
        $(id).disabled = disabled;
    }
}

async function generateImage() {
    setControlsDisabled(true);
    const imgDivs = $$("#image_area > div");
    imgDivs.forEach(div => div.setAttribute("class", "frame"));
    resetStepStrip();

    try {
        dom["runTotal"].innerHTML = "";
        dom["safety_checker"].run.innerHTML = "";

        progressStatus.style.display = "flex";
        progressText.innerHTML = "generating ...";
        finalTime.style.display = "none";
        totalData.setAttribute("class", "show");

        log(`[Session Run] Beginning`);
        if (showSteps && config.useIOBinding) {
            log(`[Session Run] Step previews run without IO binding; total is not comparable to the default mode`);
        }
        if (showSteps && config.safetyChecker) {
            // The last preview is step numInferenceSteps - 1, so the screened tail starts here.
            const firstScreened = numInferenceSteps - screenedPreviews;
            log(`[Session Run] Step previews screened from step ${firstScreened}; earlier steps are still noise`);
        }

        await loading;

        // Tokenize and rebuild before the timer starts; on WebNN the token count can force a rebuild.
        const promptInputs = await getTextEncoderInputs(prompt.value, maxSequenceLength, sequencePadMultiple);
        sequenceLength = promptInputs.sequenceLength;
        console.log("Sequence Length:", sequenceLength);
        if (sequenceLength > promptInputs.tokenCount) {
            log(
                `[Session Run] Prompt padded ${promptInputs.tokenCount} -> ${sequenceLength} tokens; ` +
                    `the transformer has no attention mask, so this image differs from an unpadded run`,
            );
        }

        const staleModels = modelsNeedingRebuild();
        if (staleModels.length > 0) {
            progressText.innerHTML = "rebuilding models ...";
            try {
                await rebuildSessions(staleModels);
            } finally {
                progressText.innerHTML = "generating ...";
            }
        }

        $("#img_div").setAttribute("class", "frame inferncing");

        // Inference prepare for Text Encoders
        let start = performance.now();
        const startTotal = start;

        // Text encoder I/O tensors are sized by the effective sequence length. Rebuild them only
        // when it changes; otherwise reuse the cached tensors to avoid per-run alloc/free churn.
        if (textEncoderSequenceLength !== sequenceLength) {
            disposeTextEncoderTensors();
            models["text_encoder"].feed = {
                input_ids: await createTensor({ dataType: "int64", dims: [1, sequenceLength], writable: true }),
                attention_mask: await createTensor({ dataType: "int64", dims: [1, sequenceLength], writable: true }),
            };
            models["text_encoder"].fetches = {
                encoder_hidden_states: await createTensor({ dataType: dataType, dims: [1, sequenceLength, 2560] }),
            };
            textEncoderSequenceLength = sequenceLength;
        }

        writeTensor(models["text_encoder"].feed.input_ids, promptInputs.inputIds);
        writeTensor(models["text_encoder"].feed.attention_mask, promptInputs.attentionMask);

        await runModel(models["text_encoder"]);

        const sessionRunTimeTextEncode = (performance.now() - start).toFixed(2);

        if (isNormalMode()) {
            log(`[Session Run] Text Encoder execution time: ${sessionRunTimeTextEncode}ms`);
        } else {
            log(`[Session Run] Text Encoder completed`);
        }

        // Use JS to generate latents (faster for simple random generation).
        const latents = createLatents(models["transformer"].inputInfo.hidden_states.dims, $("#seed-input").value).data;

        writeTensor(latentRing[0], latents);

        // encoder_hidden_states is produced once by the text encoder and unchanged across steps,
        // so bind it before the loop. Reuse small scratch arrays for the per-step scalar writes.
        models["transformer"].feed.encoder_hidden_states = models["text_encoder"].fetches["encoder_hidden_states"];
        const timestepData = new Float16Array(1);
        const stepInfoData = new Float16Array(2);

        // Decoded RGB, shared by the step previews and the final image to avoid per-step allocation.
        const pixels = new Float16Array(sizeOfShape(models["vae_decoder"].outputInfo.sample.dims));
        const nsfwBuffer = new Uint8Array(1);
        // Wall-clock spent decoding and drawing the step previews, subtracted from the total.
        let previewMs = 0;

        for (let i = 0; i < numInferenceSteps; i++) {
            // Previews turn IO binding off, so every step synchronizes and the counter is
            // meaningful; with IO binding on WebNN, session.run() would not synchronize.
            if (useIOBinding && config.provider === "webnn") {
                progressText.innerHTML = "generating ...";
                totalData.setAttribute("class", "show");
            } else {
                progressText.innerHTML = `${i + 1} / ${numInferenceSteps} steps`;
                totalData.setAttribute("class", "show steps-progress");
                totalData.style.setProperty("--progress", `${((i + 1) / numInferenceSteps) * 100}%`);
            }

            // Round-robin over the ring: read latentRing[inputIndex], write latentRing[outputIndex].
            // Rebinding costs nothing — every run rebinds anyway.
            const inputIndex = i % latentRing.length;
            const outputIndex = (i + 1) % latentRing.length;
            models["transformer"].feed.hidden_states = latentRing[inputIndex];
            models["scheduler_step"].feed.latents = latentRing[inputIndex];
            models["scheduler_step"].fetches.latents_out = latentRing[outputIndex];

            start = performance.now();
            timestepData[0] = timesteps[i];
            writeTensor(models["transformer"].feed.timestep, timestepData);

            // Run Transformer
            await runModel(models["transformer"]);
            const transformerRunTime = (performance.now() - start).toFixed(2);

            if (isNormalMode()) {
                log(`[Session Run] Transformer execution time ${i}: ${transformerRunTime}ms`);
            } else {
                log(`[Session Run] Transformer completed`);
            }

            // Use ONNX helper model for the scheduler Euler step
            start = performance.now();
            stepInfoData[0] = i;
            stepInfoData[1] = numInferenceSteps;
            writeTensor(models["scheduler_step"].feed.step_info, stepInfoData);
            await runModel(models["scheduler_step"]);

            const schedulerRunTime = (performance.now() - start).toFixed(2);
            if (isNormalMode()) {
                log(`[Session Run] Scheduler step execution time ${i}: ${schedulerRunTime}ms`);
            } else {
                log(`[Session Run] Scheduler step completed`);
            }

            // Decode this step's latent for the preview. The last step is skipped: its preview is
            // the final image, which the pipeline below decodes anyway. The whole block sits
            // between two step timers, so its cost — including the read back's GPU sync — lands
            // entirely inside previewMs.
            if (showSteps && i < numInferenceSteps - 1) {
                // No fence needed: previews force IO binding off, so the denoising step above has
                // already downloaded its output and nothing of it is left in flight to leak in here.
                const previewStart = performance.now();
                models["vae_pre_process"].feed.latents = latentRing[outputIndex];
                await runModel(models["vae_pre_process"]);
                await runModel(models["vae_decoder"]);
                await readTensor(models["vae_decoder"].fetches.sample, pixels);
                // Screen the frame before it reaches the screen, otherwise the whole generation
                // plays unfiltered and only the final image gets blurred.
                const screen = config.safetyChecker && i >= numInferenceSteps - 1 - screenedPreviews;
                const flagged = screen ? await checkNsfw(nsfwBuffer) : false;
                drawImage(pixels, imageHeight, imageWidth, stepCanvases[i]);
                stepCanvases[i].parentElement.classList.toggle("nsfw", flagged);
                // The frame keeps showing the spinner until the first preview is ready; from here
                // on "previewing" reveals the canvas so each step lands on screen. selectStep then
                // carries this step's verdict onto the frame.
                $("#img_div").setAttribute("class", "frame previewing");
                selectStep(i);
                previewMs += performance.now() - previewStart;
            }
        }

        // Inference prepare for VAE Decoder
        models["vae_pre_process"].feed.latents = latentRing[numInferenceSteps % latentRing.length];

        // Use ONNX helper model for squeeze + VAE scaling
        start = performance.now();
        await runModel(models["vae_pre_process"]);
        const vaePreProcessTime = (performance.now() - start).toFixed(2);
        if (isNormalMode()) {
            log(`[Session Run] VAE pre-processing execution time: ${vaePreProcessTime}ms`);
        } else {
            log(`[Session Run] VAE pre-processing completed`);
        }

        // Run VAE Decoder
        start = performance.now();
        await runModel(models["vae_decoder"]);

        await readTensor(models["vae_decoder"].fetches.sample, pixels);

        let vaeRunTime = (performance.now() - start).toFixed(2);

        if (isNormalMode()) {
            log(`[Session Run] VAE Decoder execution time: ${vaeRunTime}ms`);
        } else {
            log(`[Session Run] VAE Decoder completed`);
        }

        start = performance.now();
        // With previews off the image goes straight to the visible canvas, exactly as before. With
        // previews on it is kept in finalCanvas so a thumbnail click can swap between the steps and
        // the result, and the main canvas becomes a display surface.
        drawImage(pixels, imageHeight, imageWidth, showSteps ? finalCanvas : $("#img_canvas"));
        const imageDrawTime = (performance.now() - start).toFixed(2);
        log(`[Image Drawing] drawing image time: ${imageDrawTime}ms`);

        if (showSteps) {
            // The extra blit exists only because previews are on, so it is charged to previewMs.
            const blitStart = performance.now();
            showOnMainCanvas(finalCanvas);
            previewMs += performance.now() - blitStart;
        }

        const totalRunTime = (performance.now() - startTotal - previewMs).toFixed(2);
        if (isNormalMode()) {
            log(
                showSteps
                    ? `[Total] Total image generation time: ${totalRunTime}ms (previews excluded: ${previewMs.toFixed(2)}ms)`
                    : `[Total] Total image generation time: ${totalRunTime}ms`,
            );
        }
        dom.runTotal.innerHTML = totalRunTime;

        if (config.safetyChecker) {
            // 1. Run Preprocessing Model (VAE Output -> SC Input)
            let start = performance.now();
            await runModel(models["sc_prep"]);

            if (isNormalMode()) {
                log(`[Session Run] Safety Checker input prepared time: ${(performance.now() - start).toFixed(2)}ms`);
            } else {
                log(`[Session Run] Safety Checker input prepared`);
            }

            // 2. Run Safety Checker
            start = performance.now();
            await runModel(models["safety_checker"]);

            // 3. Read Results
            await readTensor(models["safety_checker"].fetches.has_nsfw_concepts, nsfwBuffer);

            const totalScRunTime = (performance.now() - start).toFixed(2);

            // 4. Process Results UI
            log(`[Session Run] Safety Checker - NSFW concepts: ${nsfwBuffer[0] ? "Yes" : "No"}`);

            if (nsfwBuffer[0]) {
                $("#img_div").setAttribute("class", "frame done nsfw");
                $("#img_div").setAttribute("title", "Not safe for work (NSFW) content");
            } else {
                $("#img_div").setAttribute("class", "frame done");
            }

            dom["safety_checker"].run.innerHTML = totalScRunTime;
            if (isNormalMode()) {
                log(`[Session Run] Safety Checker execution time: ${totalScRunTime}ms`);
            }
        } else {
            $("#img_div").setAttribute("class", "frame done");
        }

        if (showSteps) {
            // The last step's preview is the final image; blit it instead of decoding it twice, and
            // give it the verdict the safety checker just produced for that same image.
            const lastThumb = stepCanvases[numInferenceSteps - 1];
            lastThumb.width = finalCanvas.width;
            lastThumb.height = finalCanvas.height;
            lastThumb.getContext("2d").drawImage(finalCanvas, 0, 0);
            lastThumb.parentElement.classList.toggle("nsfw", $("#img_div").classList.contains("nsfw"));
            selectStep(numInferenceSteps - 1);
        }

        totalData.setAttribute("class", "show");
        progressStatus.style.display = "none";
        finalTime.style.display = "block";
        finalTime.innerHTML = showSteps
            ? `${totalRunTime}ms<span class="preview-cost" title="Excludes the ${previewMs.toFixed(2)}ms spent decoding and drawing the ${numInferenceSteps - 1} step previews. Step previews change how the pipeline runs, so this total is not comparable to a run with Steps preview off.">+${previewMs.toFixed(2)}ms previews</span>`
            : `${totalRunTime}ms`;

        // Text encoder tensors are cached and reused across runs (see the sequence-length gate
        // above); they are released when the length changes or on teardown, not every run.
        log("[Info] Image generation completed");
    } catch (e) {
        logError("[Error] " + e);
    } finally {
        // Re-enable on failure too, otherwise a single error leaves the demo permanently locked.
        setControlsDisabled(false);
    }
}

const checkWebNN = async () => {
    const status = $("#webnnstatus");
    const info = $("#info");
    const webnnStatus = await getWebnnStatus();

    if (webnnStatus.webnn) {
        status.setAttribute("class", "green");
        info.innerHTML = "WebNN supported";
        updateDeviceTypeLinks();
        load.disabled = false;
    } else {
        if (webnnStatus.error) {
            status.setAttribute("class", "red");
            info.innerHTML = `WebNN not supported: ${webnnStatus.error} <a id="webnn_na" href="../../install.html" title="WebNN Installation Guide">Set up WebNN</a>`;
            logError(`[Error] ${webnnStatus.error}`);
        } else {
            status.setAttribute("class", "red");
            info.innerHTML = "WebNN not supported";
            logError(`[Error] WebNN not supported`);
        }
    }
};

const getWebnnStatus = async () => {
    let result = {};
    try {
        const context = await navigator.ml.createContext();
        if (context) {
            try {
                const builder = new MLGraphBuilder(context);
                if (builder) {
                    result.webnn = true;
                    return result;
                } else {
                    result.webnn = false;
                    return result;
                }
            } catch (e) {
                result.webnn = false;
                result.error = e.message;
                return result;
            }
        } else {
            result.webnn = false;
            return result;
        }
    } catch (ex) {
        result.webnn = false;
        result.error = ex.message;
        return result;
    }
};

const updateLoadWave = value => {
    const loadwave = $$(".loadwave");
    const loadwaveData = $$(".loadwave-data strong");

    if (loadwave && loadwaveData) {
        loadwave.forEach(l => {
            l.style.setProperty(`--loadwave-value`, value);
        });
        loadwaveData.forEach(data => {
            data.innerHTML = value;
        });

        if (value === 100) {
            loadwave.forEach(l => {
                l.dataset.value = value;
            });
        }
    }
};

const updateDeviceTypeLinks = () => {
    let backendLinks = $("#backend-links");
    // Fix me: Once NPU is supported, uncomment the following line
    // const links = `· <a href="./?devicetype=gpu">GPU</a> · <a id="npu_link" href="./?devicetype=npu">NPU</a>`;
    const links = `· <a href="./?devicetype=gpu&provider=webnn">GPU</a>`;
    backendLinks.innerHTML = `${links}`;
};

const ui = async () => {
    memoryReleaseSwitch = $("#memory_release");
    const device = $("#device");
    const badge = $("#badge");
    const prompt = $("#user-input");
    const title = $("#title");
    const dev = $("#dev");
    const scTr = $("#scTr");

    log("[Load] ONNX Runtime loaded");

    memoryReleaseSwitch.addEventListener("change", () => {
        if (memoryReleaseSwitch.checked) {
            memoryReleaseSwitch.setAttribute("checked", "");
        } else {
            memoryReleaseSwitch.removeAttribute("checked");
        }
    });

    if (!isNormalMode()) {
        dev.setAttribute("class", "mt-1");
    }

    await setupORT("z-image-turbo", "stable", "jspi");
    showCompatibleChromiumVersion("z-image-turbo");

    for (const [modelName, prefix] of Object.entries(modelDOMPrefixes)) {
        dom[modelName] = {
            fetch: $(`#${prefix}Fetch`),
            create: $(`#${prefix}Create`),
            run: $(`#${prefix}Run`),
        };
    }
    dom.runTotal = $("#runTotal");

    switch (config.provider) {
        case "webgpu":
            title.innerHTML = "WebGPU";
            $("#webnnstatus").hidden = true;
            load.disabled = false;
            if (!("gpu" in navigator)) {
                throw new Error("webgpu is NOT supported");
            }
            break;
        case "webnn": {
            await checkWebNN();
            const webnnStatus = await getWebnnStatus();
            if (webnnStatus.webnn) {
                if (config.useIOBinding) {
                    mlContext = await WebNNPerf.time("webnn.context.create", () =>
                        navigator.ml.createContext({ deviceType: config.deviceType }),
                    );
                }
            }
            break;
        }
        default:
            throw new Error(`The provider ${config.provider} is not supported.`);
    }

    if (config.deviceType === "cpu") {
        device.innerHTML = "CPU";
        badge.setAttribute("class", "cpu");
        document.body.setAttribute("class", "cpu");
    } else if (config.deviceType === "gpu" || config.provider === "webgpu") {
        device.innerHTML = "GPU";
        badge.setAttribute("class", "");
        document.body.setAttribute("class", "gpu");
    } else if (config.deviceType === "npu") {
        device.innerHTML = "NPU";
        badge.setAttribute("class", "npu");
        document.body.setAttribute("class", "npu");
    }

    // Initialize inference steps
    const stepsInput = $("#steps-input");
    numInferenceSteps = parseInt(stepsInput.value);
    timesteps = updateScheduler(numInferenceSteps);
    stepsInput.addEventListener("change", e => {
        let val = parseInt(e.target.value);
        if (val < 3) val = 3;
        if (val > maxInferenceSteps) val = maxInferenceSteps;
        e.target.value = val;
        numInferenceSteps = val;
        timesteps = updateScheduler(numInferenceSteps);
        // The latent ring is step-count independent, so only the strip needs to follow.
        buildStepStrip();
    });

    // Step previews. This flag flips the IO binding mode, so toggling it rebuilds the tensors.
    finalCanvas = document.createElement("canvas");
    const showStepsInput = $("#show-steps");
    showStepsInput.addEventListener("change", async () => {
        showSteps = showStepsInput.checked;
        // Previews run without IO binding so that total - previewMs stays exact; see useIOBinding.
        useIOBinding = config.useIOBinding && !showSteps;
        buildStepStrip();
        if (latentRing.length > 0) {
            // Models are already loaded; rebuild every tensor for the new binding mode.
            await loading;
            disposeTensors();
            await initializeTensors();
        }
    });

    // Initialize resolution
    const resolutionSelect = $("#resolution-select");
    resolution = parseInt(resolutionSelect.value);
    resolutionSelect.addEventListener("change", e => {
        resolution = parseInt(e.target.value);
        stepsInput.value = resolution === 512 ? 9 : 3;
        stepsInput.dispatchEvent(new Event("change"));
        const imgDiv = $("#img_div");
        if (resolution === 512) {
            imgDiv.style.maxWidth = "512px";
            imgDiv.style.maxHeight = "512px";
        } else {
            imgDiv.style.maxWidth = "100%";
            imgDiv.style.maxHeight = "100%";
        }
        // Only flag it; the next Generate pays for the rebuild.
        updateRebuildHint();
    });

    // Seed randomize button
    const randomSeedBtn = $("#random-seed");
    randomSeedBtn.addEventListener("click", () => {
        $("#seed-input").value = Math.floor(Math.random() * 2147483647);
    });
    // Initialize with a random seed on load
    $("#seed-input").value = Math.floor(Math.random() * 2147483647);

    if (config.presetPrompt) {
        prompt.value =
            "在宁静的花园里，黄昏时分，一位年轻的中国女性优雅地站着，身穿金线刺绣的红色汉服。她的肤色完美，额头上有红色花纹，衬托出她温暖的微笑和富有表现力的眼睛。她的头发梳成高盘发，装饰着金色凤凰头饰，手中拿着一把描绘自然景象的圆形折扇。四周环绕着樱花树，花瓣在微风中轻轻飘落，远处的西安大雁塔增添了画面的深度，完美融合了传统与现代。";
    } else {
        prompt.value =
            "In a tranquil garden at dusk, a young Chinese woman stands gracefully in a red Hanfu with gold embroidery. Her flawless complexion features a red floral pattern on her forehead, enhancing her warm smile and expressive eyes. With her hair styled in a high bun adorned with a golden phoenix headdress, she holds a round folding fan decorated with nature scenes. Cherry blossom trees surround her, their petals drifting in the breeze, while a silhouetted pagoda (西安大雁塔) adds depth, blending tradition with modernity.";
    }
    // The counter shows real tokens; padding does not consume the prompt budget.
    const promptInputs = await getTextEncoderInputs(prompt.value, maxSequenceLength, sequencePadMultiple);
    sequenceLength = promptInputs.sequenceLength;
    $("#token-info").innerHTML = `${maxSequenceLength - promptInputs.tokenCount}/${maxSequenceLength} tokens left`;

    prompt.addEventListener("input", async () => {
        const promptInputs = await getTextEncoderInputs(prompt.value, maxSequenceLength, sequencePadMultiple);
        sequenceLength = promptInputs.sequenceLength;
        const leftTokenLength = maxSequenceLength - promptInputs.tokenCount;
        $("#token-info").innerHTML = `${leftTokenLength <= 0 ? 0 : leftTokenLength}/${maxSequenceLength} tokens left`;
        updateRebuildHint();
    });

    generate.addEventListener("click", () => {
        generateImage();
    });

    const loadModelUi = () => {
        // Show performance data table when loading starts
        const dataPanel = $("#data");
        if (dataPanel && dataPanel.classList.contains("hide")) {
            dataPanel.classList.remove("hide");
        }

        if (!config.safetyChecker) {
            delete models["safety_checker"];
            delete models["sc_prep"];
        }
        loading = loadModels(models);
        $("#img_div").setAttribute("class", "frame loadwave");
        buttons.setAttribute("class", "button-group key action-buttons loading");
    };

    load.addEventListener("click", () => {
        loadModelUi();
    });

    ort.env.wasm.numThreads = 4;
    ort.env.wasm.simd = true;

    if (config.safetyChecker) {
        scTr.setAttribute("class", "");
    } else {
        scTr.setAttribute("class", "hide");
    }

    window.addEventListener("beforeunload", () => {
        if (memoryReleaseSwitch.checked) {
            disposeTensors();
            const sessions = [
                models["text_encoder"]?.session,
                models["transformer"]?.session,
                models["scheduler_step"]?.session,
                models["vae_pre_process"]?.session,
                models["vae_decoder"]?.session,
                models["sc_prep"]?.session,
                models["safety_checker"]?.session,
            ];

            Promise.allSettled(sessions.filter(session => session).map(session => session?.release())).catch(error =>
                console.error("Session release error:", error),
            );

            modelsLoaded = false;
            updateRebuildHint();
            load.disabled = false;
            buttons.setAttribute("class", "button-group key action-buttons");
            generate.disabled = true;
            $("#user-input").setAttribute("class", "form-control");
            updateLoadWave(0.0);
            $("#img_div").setAttribute("class", "frame");
            progressManager.reset();
            for (const key in dom) {
                if (key === "runTotal") {
                    dom[key].innerHTML = "";
                } else {
                    dom[key].fetch.innerHTML = "";
                    dom[key].create.innerHTML = "";
                    if (dom[key].run) {
                        dom[key].run.innerHTML = "";
                    }
                }
            }
        }
    });
};

if (document.readyState !== "loading") {
    ui();
} else {
    document.addEventListener("DOMContentLoaded", ui, false);
}
