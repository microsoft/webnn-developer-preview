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

const config = getConfig();
let numInferenceSteps = 9;
let timesteps = null;
const dataType = "float32";

const maxSequenceLength = 512;
const batchSize = 1;
let resolution = 512;
let currentResolution = resolution;
let imageHeight = resolution;
let imageWidth = resolution;

// Currently only WebGPU is available for this demo, not WebNN which depends dynamic shape support still in development.
// So set the sequence length to a fixed value for now for internal testing.
// TODO: Once WebNN supports dynamic shapes, we can remove this and use the actual sequence length from the text encoder inputs.
let sequenceLength = 113;

const models = {
    text_encoder: {
        name: "Text Encoder",
        url: "text_encoder_model_q4f16.onnx",
        externalDataUrl: "text_encoder_model_q4f16.onnx_data",
        size: "2.06GB",
    },
    transformer: {
        name: "Transformer",
        url: "transformer_model_q4f16.onnx",
        externalDataUrl: "transformer_model_q4f16.onnx_data",
        size: "3.44GB",
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
        size: "580MB",
    },
};

function updateModelDimensions(resolution) {
    imageHeight = resolution;
    imageWidth = resolution;

    if (config.provider === "webnn") {
        models["text_encoder"].opt = {
            freeDimensionOverrides: {
                batch_size: batchSize,
                sequence_length: sequenceLength,
                total_sequence_length: sequenceLength,
            },
        };
        models["transformer"].opt = {
            freeDimensionOverrides: {
                batch_size: batchSize,
                num_frames: 1,
                height: imageHeight / 8,
                width: imageWidth / 8,
                seq_len: sequenceLength,
            },
        };
        models["scheduler_step"].opt = {
            freeDimensionOverrides: {
                batch: batchSize,
                height: imageHeight / 8,
                width: imageWidth / 8,
            },
        };
        models["vae_pre_process"].opt = {
            freeDimensionOverrides: {
                batch: batchSize,
                height: imageHeight / 8,
                width: imageWidth / 8,
            },
        };
        models["vae_decoder"].opt = {
            freeDimensionOverrides: {
                batch_size: batchSize,
                latent_height: imageHeight / 8,
                latent_width: imageWidth / 8,
            },
        };
        if (config.safetyChecker) {
            models["sc_prep"].opt = {
                freeDimensionOverrides: {
                    batch: batchSize,
                    channels: 3,
                    height: imageHeight,
                    width: imageWidth,
                },
            };
            models["safety_checker"].opt = {
                freeDimensionOverrides: {
                    batch: batchSize,
                    channels: 3,
                    height: 224,
                    width: 224,
                },
            };
        }
    }

    models["text_encoder"].inputInfo = {};
    models["text_encoder"].outputInfo = {};

    models["transformer"].inputInfo = {
        hidden_states: {
            dataType: dataType,
            dims: [batchSize, 16, 1, imageHeight / 8, imageWidth / 8],
            writable: true,
        },
        timestep: { dataType: dataType, dims: [batchSize], writable: true },
    };
    models["transformer"].outputInfo = {
        unified_results: { dataType: dataType, dims: [16, 1, imageHeight / 8, imageWidth / 8] },
    };

    models["scheduler_step"].inputInfo = {
        noise_pred: { dataType: "float32", dims: [16, 1, imageHeight / 8, imageWidth / 8] },
        latents: { dataType: "float32", dims: [batchSize, 16, 1, imageHeight / 8, imageWidth / 8] },
        step_info: { dataType: "float32", dims: [2], writable: true },
    };
    models["scheduler_step"].outputInfo = {
        latents_out: {
            dataType: "float32",
            dims: [batchSize, 16, 1, imageHeight / 8, imageWidth / 8],
        },
    };

    models["vae_pre_process"].inputInfo = {
        latents: { dataType: "float32", dims: [batchSize, 16, 1, imageHeight / 8, imageWidth / 8] },
    };
    models["vae_pre_process"].outputInfo = {
        scaled_latents: { dataType: "float32", dims: [batchSize, 16, imageHeight / 8, imageWidth / 8] },
    };

    models["vae_decoder"].inputInfo = {
        latent_sample: { dataType: dataType, dims: [batchSize, 16, imageHeight / 8, imageWidth / 8] },
    };
    models["vae_decoder"].outputInfo = {
        sample: { dataType: dataType, dims: [batchSize, 3, imageHeight, imageWidth], readable: true },
    };

    if (config.safetyChecker) {
        models["sc_prep"].inputInfo = {
            sample: { dataType: dataType, dims: [batchSize, 3, imageHeight, imageWidth] },
        };
        models["sc_prep"].outputInfo = {
            clip_input: { dataType: dataType, dims: [batchSize, 3, 224, 224] },
        };
        models["safety_checker"].inputInfo = {
            clip_input: { dataType: dataType, dims: [batchSize, 3, 224, 224], writable: true },
        };
        models["safety_checker"].outputInfo = {
            has_nsfw_concepts: { dataType: "bool", dims: [batchSize], readable: true },
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
            if (models[key] && models[key].externalDataUrl) {
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
/*
 * load models used in the pipeline
 */
async function loadModels(models) {
    log("[Load] ONNX Runtime Execution Provider: " + config.provider);
    log("[Load] ONNX Runtime EP device type: " + config.deviceType);
    WebNNPerf.configure({ device: config.deviceType, provider: config.provider });
    updateLoadWave(0.0);
    load.disabled = true;

    // Apply dimensions and inputs/outputs metadata before session creation
    updateModelDimensions(resolution);

    try {
        for (const [name, model] of Object.entries(models)) {
            const modelNameInLog = model.name;
            let start = performance.now();
            let modelUrl = `${config.model}/onnx/${model.url}`;
            if (modelUrl.includes("huggingface.co")) {
                await getHuggingFaceDomain().then(domain => {
                    modelUrl = modelUrl.replace("huggingface.co", domain);
                });
            }
            log(`[Load] Loading model ${modelNameInLog} · ${model.size}`);
            const modelBuffer = await WebNNPerf.time(
                "webnn.model.fetch",
                () =>
                    getModelOPFS(`zimage-${modelUrl.replace(/\//g, "_")}`, modelUrl, false, p =>
                        progressManager.update(name, "fetch_base", p),
                    ),
                { model: name },
            );
            if (model.externalDataUrl) {
                const externalDataBytes = await WebNNPerf.time(
                    "webnn.model.fetch",
                    () =>
                        getModelOPFS(
                            `zimage-${modelUrl.replace(/\//g, "_")}.data`,
                            modelUrl.replace(".onnx", ".onnx_data"),
                            false,
                            p => progressManager.update(name, "fetch_data", p),
                        ),
                    { model: `${name}-data` },
                );
                model.opt = model.opt || {};
                model.opt.externalData = [
                    {
                        data: externalDataBytes,
                        path: model.externalDataUrl,
                    },
                ];
            }

            const modelFetchTime = (performance.now() - start).toFixed(2);
            if (dom[name]) {
                dom[name].fetch.innerHTML = modelFetchTime;
            }

            log(`[Load] ${modelNameInLog} loaded · ${modelFetchTime}ms`);
            log(`[Session Create] Beginning ${modelNameInLog}`);

            const sessOpt = {
                executionProviders: [
                    {
                        name: config.provider,
                        deviceType: config.deviceType,
                        context: mlContext,
                    },
                ],
                logSeverityLevel: config.verbose ? 0 : 3, // 0: verbose, 1: info, 2: warning, 3: error
                ...model.opt,
            };
            start = performance.now();
            console.log(sessOpt);
            models[name].sess = await ort.InferenceSession.create(modelBuffer, sessOpt);
            const sessionCreationTime = (performance.now() - start).toFixed(2);

            if (dom[name]) {
                dom[name].create.innerHTML = sessionCreationTime;
                progressManager.update(name, "compile", 100);
            }

            if (isNormalMode()) {
                log(`[Session Create] Create ${modelNameInLog} completed · ${sessionCreationTime}ms`);
            } else {
                log(`[Session Create] Create ${modelNameInLog} completed`);
            }
        }

        if (config.provider === "webgpu") {
            gpuDevice = ort.env.webgpu.device;
        }
        const startInitTensors = performance.now();
        await initializeTensors();
        currentResolution = resolution;

        log(`[Session Create] Initialize tensors completed · ${(performance.now() - startInitTensors).toFixed(2)}ms`);
    } catch (e) {
        logError(`[Load] failed, ${e}`);
        return;
    }
    updateLoadWave(100.0);
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
    if (!config.useIOBinding) {
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
    if (!config.useIOBinding) {
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
    if (!config.useIOBinding) {
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

function disposeTensors() {
    // Release tensors
    for (const model of Object.values(models)) {
        const tensors = [...Object.values(model.feed), ...Object.values(model.fetches)];
        for (const tensor of tensors) {
            if (tensor) {
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
    }
}

async function initializeTensors() {
    // text_encoder
    // Delay the creation of this tensor until needed, as the sequence length may change.
    models["text_encoder"].feed = {
        // "input_ids": await createTensor(models["text_encoder"].inputInfo.input_ids),
        // "attention_mask": await createTensor(models["text_encoder"].inputInfo.attention_mask),
    };
    models["text_encoder"].fetches = {
        // "encoder_hidden_state": await createTensor(models["text_encoder"].outputInfo["encoder_hidden_state"]),
    };

    // transformer
    models["transformer"].feed = {
        hidden_states: await createTensor(models["transformer"].inputInfo.hidden_states),
        timestep: await createTensor(models["transformer"].inputInfo.timestep),
        // Delay the creation of this tensor until needed, as the sequence length may change
        // encoder_hidden_states: await createTensor(models["transformer"].inputInfo.encoder_hidden_states),
    };
    models["transformer"].fetches = {
        unified_results: await createTensor(models["transformer"].outputInfo.unified_results),
    };

    // scheduler_step
    models["scheduler_step"].feed = {
        noise_pred: models["transformer"].fetches.unified_results,
        latents: models["transformer"].feed.hidden_states,
        step_info: await createTensor(models["scheduler_step"].inputInfo.step_info),
    };
    models["scheduler_step"].fetches = {
        latents_out: await createTensor(models["scheduler_step"].outputInfo.latents_out),
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

async function runModel(model) {
    if (config.useIOBinding) {
        await WebNNPerf.time("webnn.inference", () => model.sess.run(model.feed, model.fetches), {
            model: model.name || "unknown",
        });
    } else {
        const results = await WebNNPerf.time("webnn.inference", () => model.sess.run(model.feed), {
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

async function generateImage() {
    generate.disabled = true;
    prompt.disabled = true;
    $("#resolution-select").disabled = true;
    $("#seed-input").disabled = true;
    $("#random-seed").disabled = true;
    const imgDivs = $$("#image_area > div");
    imgDivs.forEach(div => div.setAttribute("class", "frame"));

    try {
        dom["runTotal"].innerHTML = "";
        dom["safety_checker"].run.innerHTML = "";

        progressStatus.style.display = "flex";
        progressText.innerHTML = "generating ...";
        finalTime.style.display = "none";
        totalData.setAttribute("class", "show");

        log(`[Session Run] Beginning`);

        await loading;

        if (currentResolution !== resolution) {
            log(`[Session Run] Re-initializing tensors for resolution ${resolution}x${resolution}...`);
            let initStart = performance.now();
            disposeTensors();
            updateModelDimensions(resolution);
            await initializeTensors();
            currentResolution = resolution;
            log(`[Session Run] Re-initialized tensors in ${(performance.now() - initStart).toFixed(2)}ms`);
        }

        $("#img_div").setAttribute("class", "frame inferncing");

        // Inference prepare for Text Encoders
        let start = performance.now();
        const startTotal = start;

        // Run Text Encoder
        const promptInputs = await getTextEncoderInputs(prompt.value, maxSequenceLength);
        sequenceLength = promptInputs.sequenceLength;

        console.log("Sequence Length:", sequenceLength);
        // Since the tensors of Text Encoder dynamically allocated according to the effective sequence length,
        // we need to create the tensor here.
        models["text_encoder"].feed = {
            input_ids: await createTensor({ dataType: "int64", dims: [batchSize, sequenceLength], writable: true }),
            attention_mask: await createTensor({
                dataType: "int64",
                dims: [batchSize, sequenceLength],
                writable: true,
            }),
        };
        models["text_encoder"].fetches = {
            encoder_hidden_state: await createTensor({
                dataType: dataType,
                dims: [batchSize, sequenceLength, 2560],
            }),
        };

        writeTensor(models["text_encoder"].feed.input_ids, promptInputs.inputIds);
        writeTensor(models["text_encoder"].feed.attention_mask, promptInputs.attentionMask);

        await runModel(models["text_encoder"]);

        const sessionRunTimeTextEncode = (performance.now() - start).toFixed(2);

        if (isNormalMode()) {
            log(`[Session Run] Text Encoder execution time: ${sessionRunTimeTextEncode}ms`);
        } else {
            log(`[Session Run] Text Encoder completed`);
        }

        // Use JS to generate latents (faster for simple random generation)
        const latents = createLatents(models["transformer"].inputInfo.hidden_states.dims, $("#seed-input").value).data;

        // Capture original tensors to restore later
        const tensorA = models["transformer"].feed.hidden_states;
        const tensorB = models["scheduler_step"].fetches.latents_out;

        writeTensor(tensorA, latents);

        for (let i = 0; i < numInferenceSteps; i++) {
            if (config.useIOBinding && config.provider === "webnn") {
                progressText.innerHTML = "generating ...";
                totalData.setAttribute("class", "show");
            } else {
                progressText.innerHTML = `${i + 1} / ${numInferenceSteps} steps`;
                totalData.setAttribute("class", "show steps-progress");
                totalData.style.setProperty("--progress", `${((i + 1) / numInferenceSteps) * 100}%`);
            }
            start = performance.now();
            // Prepare inference for VAE Decoder
            models["transformer"].feed.encoder_hidden_states = models["text_encoder"].fetches["encoder_hidden_state"];
            writeTensor(models["transformer"].feed.timestep, new Float32Array([timesteps[i]]));

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
            writeTensor(models["scheduler_step"].feed.step_info, new Float32Array([i, numInferenceSteps]));

            await runModel(models["scheduler_step"]);

            // Ping-pong buffer swap to avoid using same tensor as input and output
            const nextInput = models["scheduler_step"].fetches.latents_out;
            const nextOutput = models["scheduler_step"].feed.latents;

            models["scheduler_step"].feed.latents = nextInput;
            models["scheduler_step"].fetches.latents_out = nextOutput;

            models["transformer"].feed.hidden_states = nextInput;

            const schedulerRunTime = (performance.now() - start).toFixed(2);
            if (isNormalMode()) {
                log(`[Session Run] Scheduler step execution time ${i}: ${schedulerRunTime}ms`);
            } else {
                log(`[Session Run] Scheduler step completed`);
            }
        }

        // Inference prepare for VAE Decoder
        models["vae_pre_process"].feed.latents = models["transformer"].feed.hidden_states;

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

        const pixelsSize = sizeOfShape(models["vae_decoder"].outputInfo.sample.dims);
        const pixels = new Float32Array(pixelsSize);
        await readTensor(models["vae_decoder"].fetches.sample, pixels);

        let vaeRunTime = (performance.now() - start).toFixed(2);

        if (isNormalMode()) {
            log(`[Session Run] VAE Decoder execution time: ${vaeRunTime}ms`);
        } else {
            log(`[Session Run] VAE Decoder completed`);
        }

        start = performance.now();
        drawImage(pixels, imageHeight, imageWidth, $(`#img_canvas`));
        const imageDrawTime = (performance.now() - start).toFixed(2);
        log(`[Image Drawing] drawing image time: ${imageDrawTime}ms`);

        const totalRunTime = (performance.now() - startTotal).toFixed(2);
        if (isNormalMode()) {
            log(`[Total] Total image generation time: ${totalRunTime}ms`);
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
            let nsfwBuffer = new Uint8Array(batchSize);
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

        totalData.setAttribute("class", "show");
        progressStatus.style.display = "none";
        finalTime.style.display = "block";
        finalTime.innerHTML = `${totalRunTime}ms`;

        // Restore original tensors for next run
        models["transformer"].feed.hidden_states = tensorA;
        models["scheduler_step"].feed.latents = tensorA;
        models["scheduler_step"].fetches.latents_out = tensorB;

        // Dispose intermediate tensors to free memory
        const tensorsToDispose = [
            ...Object.values(models["text_encoder"].feed),
            ...Object.values(models["text_encoder"].fetches),
        ];
        for (const tensor of tensorsToDispose) {
            if (tensor) {
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
        generate.disabled = false;
        prompt.disabled = false;
        $("#resolution-select").disabled = false;
        $("#seed-input").disabled = false;
        $("#random-seed").disabled = false;
        log("[Info] Image generation completed");
    } catch (e) {
        logError("[Error] " + e);
        return;
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
    const links = `· <a href="./?devicetype=gpu">GPU</a>`;
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

    await setupORT("z-image-turbo", "stable");
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
        if (val > 9) val = 9;
        e.target.value = val;
        numInferenceSteps = val;
        timesteps = updateScheduler(numInferenceSteps);
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
    const promptInputs = await getTextEncoderInputs(prompt.value, maxSequenceLength);
    $("#token-info").innerHTML = `${maxSequenceLength - promptInputs.sequenceLength}/${maxSequenceLength} tokens left`;

    prompt.addEventListener("input", async () => {
        const promptInputs = await getTextEncoderInputs(prompt.value, maxSequenceLength);
        const leftTokenLength = maxSequenceLength - promptInputs.sequenceLength;
        $("#token-info").innerHTML = `${leftTokenLength <= 0 ? 0 : leftTokenLength}/${maxSequenceLength} tokens left`;
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
                models["text_encoder"]?.sess,
                models["transformer"]?.sess,
                models["scheduler_step"]?.sess,
                models["vae_pre_process"]?.sess,
                models["vae_decoder"]?.sess,
                models["sc_prep"]?.sess,
                models["safety_checker"]?.sess,
            ];

            Promise.allSettled(sessions.filter(session => session).map(session => session?.release())).catch(error =>
                console.error("Session release error:", error),
            );

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
