/* eslint-disable no-undef */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
//
// An example how to run stable diffusion 1.5 with webnn in onnxruntime-web.
//

import * as Utils from "./utils.js";
import {
    $,
    isFloat16ArrayAvailable,
    convertToFloat16OrUint16Array,
    log,
    logError,
    getMode,
    getQueryValue,
    getQueryVariable,
    getWebnnStatus,
    randomNumber,
    setupORT,
    showCompatibleChromiumVersion,
} from "../../assets/js/common_utils.js";

// Configuration...
let device = "gpu";
let badge;
const pixelWidth = 512;
const pixelHeight = 512;
const latentWidth = pixelWidth / 8;
const latentHeight = pixelHeight / 8;
const latentChannelCount = 4;
const unetBatch = 2;
const unetChannelCount = 4;
const textEmbeddingSequenceLength = 77;
const textEmbeddingSequenceWidth = 768;
const unetIterationCount = 25; // Hard-coded number of samples, since the denoising weight ramp is constant.
let seed = BigInt(123465);
let performanceData = {
    loadtime: {
        textencoder: 0,
        unet: 0,
        vaedecoder: 0,
        sc: 0,
        total: 0,
    },
    modelfetch: {
        textencoder: 0,
        unet: 0,
        vaedecoder: 0,
        sc,
    },
    sessioncreate: {
        textencoder: 0,
        unet: 0,
        vaedecoder: 0,
        sc,
    },
    sessionrun: {
        textencoder: 0,
        unet: [],
        unettotal: 0,
        vaedecoder: 0,
        sc,
        total: 0,
    },
};

function resize_image(targetWidth, targetHeight) {
    const canvas = $(`#img_canvas_test`);
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    let ctx = canvas.getContext("2d");
    let canvas_source = $(`#canvas`);
    ctx.drawImage(canvas_source, 0, 0, canvas_source.width, canvas_source.height, 0, 0, targetWidth, targetHeight);
    let imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);

    return imageData;
}

function normalizeImageData(imageData) {
    const mean = [0.48145466, 0.4578275, 0.40821073];
    const std = [0.26862954, 0.26130258, 0.27577711];
    const { data, width, height } = imageData;
    const numPixels = width * height;

    let array = new Float32Array(numPixels * 4).fill(0);

    for (let i = 0; i < numPixels; i++) {
        const offset = i * 4;
        for (let c = 0; c < 3; c++) {
            const normalizedValue = (data[offset + c] / 255 - mean[c]) / std[c];
            // data[offset + c] = Math.round(normalizedValue * 255);
            array[offset + c] = normalizedValue * 255;
        }
    }

    // return imageData;
    return { data: array, width: width, height: height };
}

function get_tensor_from_image(imageData, format) {
    const { data, width, height } = imageData;
    const numPixels = width * height;
    const channels = 3;
    const rearrangedData = new Float32Array(numPixels * channels);
    let destOffset = 0;

    for (let i = 0; i < numPixels; i++) {
        const srcOffset = i * 4;
        const r = data[srcOffset] / 255;
        const g = data[srcOffset + 1] / 255;
        const b = data[srcOffset + 2] / 255;

        if (format === "NCHW") {
            rearrangedData[destOffset] = r;
            rearrangedData[destOffset + numPixels] = g;
            rearrangedData[destOffset + 2 * numPixels] = b;
            destOffset++;
        } else if (format === "NHWC") {
            rearrangedData[destOffset] = r;
            rearrangedData[destOffset + 1] = g;
            rearrangedData[destOffset + 2] = b;
            destOffset += channels;
        } else {
            throw new Error("Invalid format specified.");
        }
    }

    const tensorShape = format === "NCHW" ? [1, channels, height, width] : [1, height, width, channels];
    let tensor = new ort.Tensor("float16", convertToFloat16OrUint16Array(rearrangedData), tensorShape);

    return tensor;
}

let progress = 0;
let fetchProgress = 0;
let textEncoderFetchProgress = 0;
let unetFetchProgress = 0;
let vaeDecoderFetchProgress = 0;
let scFetchProgress = 0;
let textEncoderCompileProgress = 0;
let unetCompileProgress = 0;
let vaeDecoderCompileProgress = 0;
let scCompileProgress = 0;

const updateProgress = () => {
    progress =
        textEncoderFetchProgress +
        unetFetchProgress +
        scFetchProgress +
        vaeDecoderFetchProgress +
        textEncoderCompileProgress +
        unetCompileProgress +
        vaeDecoderCompileProgress +
        scCompileProgress;
};

// Get model via Origin Private File System
async function getModelOPFS(name, url, updateModel) {
    const root = await navigator.storage.getDirectory();
    let fileHandle;

    async function updateFile() {
        const response = await fetch(url);
        const buffer = await readResponse(name, response);
        fileHandle = await root.getFileHandle(name, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(buffer);
        await writable.close();
        return buffer;
    }

    if (updateModel) {
        return await updateFile();
    }

    try {
        fileHandle = await root.getFileHandle(name);
        const blob = await fileHandle.getFile();
        let buffer = await blob.arrayBuffer();
        if (buffer) {
            if (Utils.getSafetyChecker()) {
                if (name == "sd_1.5_text-encoder") {
                    textEncoderFetchProgress = 7;
                } else if (name == "sd_1.5_unet") {
                    unetFetchProgress = 48;
                } else if (name == "sd_1.5_vae-decoder") {
                    vaeDecoderFetchProgress = 3;
                } else if (name == "sd_1.5_safety-checker") {
                    scFetchProgress = 12;
                }
            } else {
                if (name == "sd_1.5_text-encoder") {
                    textEncoderFetchProgress = 7;
                } else if (name == "sd_1.5_unet") {
                    unetFetchProgress = 60;
                } else if (name == "sd_1.5_vae-decoder") {
                    vaeDecoderFetchProgress = 3;
                }
            }

            updateProgress();
            progressBarInner.style.width = progress + "%";

            if (name == "sd_1.5_text-encoder") {
                progressBarLabel.textContent = "Loading Text Encoder model · 235MB · " + progress.toFixed(2) + "%";
            } else if (name == "sd_1.5_unet") {
                progressBarLabel.textContent = "Loading UNet model · 1.60GB · " + progress.toFixed(2) + "%";
            } else if (name == "sd_1.5_vae-decoder") {
                progressBarLabel.textContent = "Loading VAE Decoder model · 94.5MB · " + progress.toFixed(2) + "%";
            } else if (name == "sd_1.5_safety-checker") {
                "Loading Safety Checker model · 580MB · " + progress.toFixed(2) + "%";
            }

            return buffer;
        }
    } catch (e) {
        console.log(e.message);
        return await updateFile();
    }
}

async function readResponse(name, response) {
    const contentLength = response.headers.get("Content-Length");
    let total = parseInt(contentLength ?? "0");
    let buffer = new Uint8Array(total);
    let loaded = 0;

    const reader = response.body.getReader();
    async function read() {
        const { done, value } = await reader.read();
        if (done) return;

        let newLoaded = loaded + value.length;
        fetchProgress = (newLoaded / contentLength) * 100;

        if (Utils.getSafetyChecker()) {
            if (name == "sd_1.5_text-encoder") {
                textEncoderFetchProgress = 0.07 * fetchProgress;
            } else if (name == "sd_1.5_unet") {
                unetFetchProgress = 0.48 * fetchProgress;
            } else if (name == "sd_1.5_vae-decoder") {
                vaeDecoderFetchProgress = 0.03 * fetchProgress;
            } else if (name == "sd_1.5_safety-checker") {
                scFetchProgress = 0.12 * fetchProgress;
            }
        } else {
            if (name == "sd_1.5_text-encoder") {
                textEncoderFetchProgress = 0.07 * fetchProgress;
            } else if (name == "sd_1.5_unet") {
                unetFetchProgress = 0.6 * fetchProgress;
            } else if (name == "sd_1.5_vae-decoder") {
                vaeDecoderFetchProgress = 0.03 * fetchProgress;
            }
        }

        updateProgress();
        progressBarInner.style.width = progress + "%";

        if (name == "sd_1.5_text-encoder") {
            progressBarLabel.textContent = "Loading Text Encoder model · 235MB · " + progress.toFixed(2) + "%";
        } else if (name == "sd_1.5_unet") {
            progressBarLabel.textContent = "Loading UNet model · 1.60GB · " + progress.toFixed(2) + "%";
        } else if (name == "sd_1.5_vae-decoder") {
            progressBarLabel.textContent = "Loading VAE Decoder model · 94.5MB · " + progress.toFixed(2) + "%";
        } else if (name == "sd_1.5_safety-checker") {
            progressBarLabel.textContent = "Loading Safety Checker model · 580MB · " + progress.toFixed(2) + "%";
        }

        if (newLoaded > total) {
            total = newLoaded;
            let newBuffer = new Uint8Array(total);
            newBuffer.set(buffer);
            buffer = newBuffer;
        }
        buffer.set(value, loaded);
        loaded = newLoaded;
        return read();
    }

    await read();
    return buffer;
}

log("[Load] Loading ONNX Runtime");
const progressBarInner = $("#progress-bar-inner");
const progressBarLabel = $("#progress-bar-label");
const progressBarInnerInference = $("#progress-bar-inner-inference");
const progressBarLabelInference = $("#progress-bar-label-inference");

const startButton = $("#generate_next_image");
const loadButton = $("#load_models");
const memoryReleaseSwitch = $("#memory_release");
const positiveInput = $("#positive_prompt");
const negativeInput = $("#negative_prompt");
const positiveTokenInfo = $("#positive_token_info");
const negativeTokenInfo = $("#negative_token_info");
const error = $("#error");
const userSeed = $("#user_seed");
const changeSeed = $("#change_seed");
const title = $("#title");
const data = $("#data");
const textEncoderLoad = $("#textencoderload");
const textEncoderFetch = $("#textencoderfetch");
const textEncoderCreate = $("#textencodercreate");
const textEncoderRun = $("#textencoderrun");
const unetLoad = $("#unetload");
const unetFetch = $("#unetfetch");
const unetCreate = $("#unetcreate");
const unetRun = $("#unetrun");
const vaeDecoderLoad = $("#vaedecoderload");
const vaeDecoderFetch = $("#vaedecoderfetch");
const vaeDecoderCreate = $("#vaedecodercreate");
const vaeDecoderRun = $("#vaedecoderrun");
const scTr = $("#sc");
const scLoad = $("#scload");
const scFetch = $("#scfetch");
const scCreate = $("#sccreate");
const scRun = $("#scrun");
const totalLoad = $("#totalload");
const totalRun = $("#totalrun");
let inferenceProgress = 0;

loadButton.onclick = async () => {
    progress = 0;
    fetchProgress = 0;
    textEncoderFetchProgress = 0;
    unetFetchProgress = 0;
    vaeDecoderFetchProgress = 0;
    scFetchProgress = 0;
    textEncoderCompileProgress = 0;
    unetCompileProgress = 0;
    vaeDecoderCompileProgress = 0;
    scCompileProgress = 0;

    data.removeAttribute("class");
    data.setAttribute("class", "hide");

    performanceData.loadtime.textencoder = 0;
    performanceData.loadtime.unet = [];
    performanceData.loadtime.vaedecoder = 0;
    performanceData.loadtime.sc = 0;
    performanceData.loadtime.total = 0;

    performanceData.modelfetch.textencoder = 0;
    performanceData.modelfetch.unet = 0;
    performanceData.modelfetch.vaedecoder = 0;
    performanceData.modelfetch.sc = 0;

    performanceData.sessioncreate.textencoder = 0;
    performanceData.sessioncreate.unet = 0;
    performanceData.sessioncreate.vaedecoder = 0;
    performanceData.sessioncreate.sc = 0;

    loadButton.disabled = true;
    startButton.disabled = true;
    await loadStableDiffusion(executionProvider);
    startButton.disabled = false;

    if (performanceData.loadtime.total) {
        textEncoderLoad.innerHTML = performanceData.loadtime.textencoder;
        textEncoderFetch.innerHTML = performanceData.modelfetch.textencoder;
        textEncoderCreate.innerHTML = performanceData.sessioncreate.textencoder;
        textEncoderRun.innerHTML = "-";

        unetLoad.innerHTML = performanceData.loadtime.unet;
        unetFetch.innerHTML = performanceData.modelfetch.unet;
        unetCreate.innerHTML = performanceData.sessioncreate.unet;
        unetRun.innerHTML = "-";

        vaeDecoderLoad.innerHTML = performanceData.loadtime.vaedecoder;
        vaeDecoderFetch.innerHTML = performanceData.modelfetch.vaedecoder;
        vaeDecoderCreate.innerHTML = performanceData.sessioncreate.vaedecoder;
        vaeDecoderRun.innerHTML = "-";

        scLoad.innerHTML = performanceData.loadtime.sc;
        scFetch.innerHTML = performanceData.modelfetch.sc;
        scCreate.innerHTML = performanceData.sessioncreate.sc;
        scRun.innerHTML = "-";

        totalLoad.innerHTML = performanceData.loadtime.total;
        totalRun.innerHTML = "-";
    }

    if (getMode()) {
        data.setAttribute("class", "show");
    }
};

startButton.onclick = async () => {
    textEncoderRun.innerHTML = "";
    unetRun.innerHTML = "";
    vaeDecoderRun.innerHTML = "";
    scRun.innerHTML = "";
    performanceData.sessionrun.textencoder = 0;
    performanceData.sessionrun.unet = [];
    performanceData.sessionrun.unettotal = 0;
    performanceData.sessionrun.vaedecoder = 0;
    performanceData.sessionrun.sc = 0;
    performanceData.sessionrun.total = 0;

    startButton.disabled = true;
    await generateNextImage();
    inferenceProgress = 0;
};

positiveInput.addEventListener("input", async e => {
    const inputValue = e.target.value;
    const ids = await Utils.getTokenizers(inputValue);
    // Max token length is 75.
    const left_tokens_length = 75 - ids.length;
    positiveTokenInfo.innerHTML = `${left_tokens_length <= 0 ? 0 : left_tokens_length}/75`;
});

negativeInput.addEventListener("input", async e => {
    const inputValue = e.target.value;
    const ids = await Utils.getTokenizers(inputValue);
    // Max token length is 75.
    const left_tokens_length = 75 - ids.length;
    negativeTokenInfo.innerHTML = `${left_tokens_length <= 0 ? 0 : left_tokens_length}/75`;
});

async function getTextTokens() {
    const positiveText = positiveInput.value;
    const negativeText = negativeInput.value;

    // A string like 'a cute magical flying ghost dog, fantasy art, golden color, high quality, highly detailed, elegant, sharp focus, concept art, character concepts, digital painting, mystery, adventure'
    // becomes a 1D tensor of {49406, 320, 2242, 7823, 4610, 7108, 1929, 267, 5267, 794, 267, 3878, 3140, 267, 1400, 3027, ...}
    // padded with blanks (id 49407) up to the maximum sequence length of the text encoder (typically 77).
    // So the text encoder can't really handle more than 75 words (+1 start, +1 stop token),
    // not without some extra tricks anyway like calling it multiple times and combining the embeddings.
    let positive_token_ids = [49406]; // Inits with start token
    let negative_token_ids = [49406];
    const positive_text_ids = await Utils.getTokenizers(positiveText);
    positive_token_ids = positive_token_ids.concat(positive_text_ids);
    if (positive_text_ids.length > textEmbeddingSequenceLength - 2) {
        // Max inputs ids should be 75
        positive_token_ids = positive_token_ids.slice(0, textEmbeddingSequenceLength - 1);
        positive_token_ids.push(49407);
    } else {
        const fillerArray = new Array(textEmbeddingSequenceLength - positive_token_ids.length).fill(49407);
        positive_token_ids = positive_token_ids.concat(fillerArray);
    }

    let negative_text_ids = await Utils.getTokenizers(negativeText);
    negative_token_ids = negative_token_ids.concat(negative_text_ids);
    if (negative_text_ids.length > textEmbeddingSequenceLength - 2) {
        negative_token_ids = negative_token_ids.slice(0, textEmbeddingSequenceLength - 1);
        negative_token_ids.push(49407);
    } else {
        const fillerArray = new Array(textEmbeddingSequenceLength - negative_token_ids.length).fill(49407);
        negative_token_ids = negative_token_ids.concat(fillerArray);
    }

    const token_ids = positive_token_ids.concat(negative_token_ids);
    return token_ids;
}

log("[Load] ONNX Runtime loaded");

function convertPlanarFloat16RgbToUint8Rgba(input /*Uint16Array*/, width, height) {
    let totalPixelCount = width * height;
    let totalOutputBytes = totalPixelCount * 4;

    let redInputOffset = 0;
    let greenInputOffset = redInputOffset + totalPixelCount;
    let blueInputOffset = greenInputOffset + totalPixelCount;

    const rgba = new Uint8ClampedArray(totalOutputBytes);
    for (let i = 0, j = 0; i < totalPixelCount; i++, j += 4) {
        rgba[j + 0] = (Utils.decodeFloat16(input[redInputOffset + i]) + 1.0) * (255.0 / 2.0);
        rgba[j + 1] = (Utils.decodeFloat16(input[greenInputOffset + i]) + 1.0) * (255.0 / 2.0);
        rgba[j + 2] = (Utils.decodeFloat16(input[blueInputOffset + i]) + 1.0) * (255.0 / 2.0);
        rgba[j + 3] = 255;
    }
    return rgba;
}

function convertPlanarUint8RgbToUint8Rgba(input /*Uint16Array*/, width, height) {
    let totalPixelCount = width * height;
    let totalOutputBytes = totalPixelCount * 4;

    let redInputOffset = 0;
    const rgba = new Uint8ClampedArray(totalOutputBytes);
    for (let i = 0, j = 0; i < totalPixelCount; i++, j += 4) {
        let inputValue = input[redInputOffset + i];
        rgba[j + 0] = inputValue;
        rgba[j + 1] = inputValue;
        rgba[j + 2] = inputValue;
        rgba[j + 3] = 255;
    }
    return rgba;
}

function convertPlanarFloat32RgbToUint8Rgba(input /*Uint16Array*/, width, height) {
    let totalPixelCount = width * height;
    let totalOutputBytes = totalPixelCount * 4;

    let redInputOffset = 0;
    let greenInputOffset = redInputOffset + totalPixelCount;
    let blueInputOffset = greenInputOffset + totalPixelCount;

    const rgba = new Uint8ClampedArray(totalOutputBytes);
    for (let i = 0, j = 0; i < totalPixelCount; i++, j += 4) {
        rgba[j + 0] = (input[redInputOffset + i] + 1.0) * (255.0 / 2.0);
        rgba[j + 1] = (input[greenInputOffset + i] + 1.0) * (255.0 / 2.0);
        rgba[j + 2] = (input[blueInputOffset + i] + 1.0) * (255.0 / 2.0);
        rgba[j + 3] = 255;
    }
    return rgba;
}

async function loadModel(modelName /*:String*/, executionProvider /*:String*/) {
    let modelPath;
    let modelSession;
    let freeDimensionOverrides;
    let modelSize;

    if (modelName == "text-encoder") {
        modelSize = "235MB";
    } else if (modelName == "unet") {
        modelSize = "1.60GB";
    } else if (modelName == "vae-decoder") {
        modelSize = "94.5MB";
    } else if (modelName == "safety-checker") {
        modelSize = "580MB";
    }

    log(`[Load] Loading model ${modelName} · ${modelSize}`);
    const modelPathFromUtils = await Utils.modelPath();
    if (modelName == "text-encoder") {
        //  Inputs:
        //    int32 input_ids[batch,sequence]
        //    batch: 2
        //    sequence: 77
        //  Outputs:
        //    float16 last_hidden_state[Addlast_hidden_state_dim_0,Addlast_hidden_state_dim_1,768]
        //    float16 pooler_output[Addlast_hidden_state_dim_0,768] We don't care about this ignorable output.
        //    Addlast_hidden_state_dim_0: 2
        //    Addlast_hidden_state_dim_1: 77
        // modelPath = 'models/Stable-Diffusion-v1.5-text-encoder-float16.onnx';
        modelPath = modelPathFromUtils + "text-encoder.onnx";
        freeDimensionOverrides = {
            batch: unetBatch,
            sequence: textEmbeddingSequenceLength,
        };
    } else if (modelName == "unet") {
        //  Typical shapes (some models may vary, like inpainting have 9 channels or single batch having 1 batch)...
        //
        //  Inputs:
        //    float16 sample[2, 4, 64, 64]
        //    int64 timestep[2]
        //    float16 encoder_hidden_states[2, 77, 768]
        //  Outputs:
        //    float16 out_sample[2, 4, 64, 64]
        modelPath = modelPathFromUtils + "sd-unet-v1.5-model-b2c4h64w64s77-float16-compute-and-inputs-layernorm.onnx";

        freeDimensionOverrides = {
            batch: unetBatch,
            channels: unetChannelCount,
            height: latentHeight,
            width: latentWidth,
            sequence: textEmbeddingSequenceLength,
            unet_sample_batch: unetBatch,
            unet_sample_channels: unetChannelCount,
            unet_sample_height: latentHeight,
            unet_sample_width: latentWidth,
            unet_time_batch: unetBatch,
            unet_hidden_batch: unetBatch,
            unet_hidden_sequence: textEmbeddingSequenceLength,
        };
    } else if (modelName == "vae-decoder") {
        //  Inputs:
        //    float16 latent_sample[1, 4, 64, 64]
        //  Outputs:
        //    float16 sample[1, 3, 512, 512]
        modelPath = modelPathFromUtils + "Stable-Diffusion-v1.5-vae-decoder-float16-fp32-instancenorm.onnx";
        freeDimensionOverrides = {
            batch: 1,
            channels: latentChannelCount,
            height: latentHeight,
            width: latentWidth,
        };
    } else if (modelName == "safety-checker") {
        //  Inputs:
        //    float16 clip_input[1, 3, 224, 224]
        //    float16 images[1, 224, 224, 3]
        //  Outputs:
        //    float16 out_images
        //    bool has_nsfw_concepts
        modelPath = modelPathFromUtils + "safety_checker_int32_reduceSum.onnx";
        freeDimensionOverrides = {
            batch: 1,
            channels: 3,
            height: 224,
            width: 224,
        };
    } else {
        throw new Error(`Model ${modelName} is unknown`);
    }

    const options = {
        executionProviders: [
            {
                name: executionProvider,
                deviceType: getQueryVariable("devicetype", "gpu"),
            },
        ],
    };

    if (freeDimensionOverrides != undefined) {
        options.freeDimensionOverrides = freeDimensionOverrides;
    }

    options.logSeverityLevel = 0;

    log("[Load] Model path = " + modelPath);
    let modelBuffer;

    let fetchStartTime = performance.now();
    modelBuffer = await getModelOPFS(`sd_1.5_${modelName}`, modelPath, false);
    let fetchTime = (performance.now() - fetchStartTime).toFixed(2);

    if (modelName == "text-encoder") {
        performanceData.modelfetch.textencoder = fetchTime;
        updateProgress();
        progressBarLabel.textContent = `Loaded Text Encoder · ${(fetchTime / 1000).toFixed(2)}s · ${progress}%`;
        log(`[Load] Text Encoder loaded · ${(fetchTime / 1000).toFixed(2)}s`);

        progressBarLabel.textContent = `Creating session for Text Encoder · ${progress}%`;
        log("[Session Create] Beginning text encode");
    } else if (modelName == "unet") {
        performanceData.modelfetch.unet = fetchTime;
        updateProgress();
        progressBarLabel.textContent = `Loaded UNet · ${(fetchTime / 1000).toFixed(2)}s · ${progress}`;
        log(`[Load] UNet loaded · ${(fetchTime / 1000).toFixed(2)}s`);

        progressBarLabel.textContent = `Creating session for UNet · ${progress}%`;
        log("[Session Create] Beginning UNet");
    } else if (modelName == "vae-decoder") {
        performanceData.modelfetch.vaedecoder = fetchTime;
        updateProgress();
        progressBarLabel.textContent = `Loaded VAE Decoder · ${(fetchTime / 1000).toFixed(2)}s · 81%`;
        log(`[Load] VAE Decoder loaded · ${(fetchTime / 1000).toFixed(2)}s`);

        progressBarLabel.textContent = `Creating session for VAE Decoder · ${progress}%`;
        log("[Session Create] Beginning VAE decode");
    } else if (modelName == "safety-checker") {
        performanceData.modelfetch.sc = fetchTime;
        updateProgress();
        progressBarLabel.textContent = `Loaded Safety Checker · ${(fetchTime / 1000).toFixed(2)}s · ${progress}%`;
        log(`[Load] Safety Checker loaded · ${(fetchTime / 1000).toFixed(2)}s`);

        progressBarLabel.textContent = `Creating session for Safety Checker · ${progress}%`;
        log("[Session Create] Beginning Safety Checker");
    }

    let createStartTime = performance.now();
    modelSession = await ort.InferenceSession.create(modelBuffer, options);

    if (modelName == "text-encoder") {
        let textencoderCreateTime = (performance.now() - createStartTime).toFixed(2);
        performanceData.sessioncreate.textencoder = textencoderCreateTime;
        textEncoderCompileProgress = 3;
        updateProgress();
        if (getMode()) {
            progressBarLabel.textContent = `Text Encoder session created · ${textencoderCreateTime}ms · ${progress}%`;
            log(`[Session Create] Text Encoder completed · ${textencoderCreateTime}ms`);
        } else {
            progressBarLabel.textContent = `Text Encoder session created · ${progress}%`;
            log(`[Session Create] Text Encoder completed`);
        }
    } else if (modelName == "unet") {
        let unetCreateTime = (performance.now() - createStartTime).toFixed(2);
        performanceData.sessioncreate.unet = unetCreateTime;
        if (Utils.getSafetyChecker()) {
            unetCompileProgress = 20;
        } else {
            unetCompileProgress = 25;
        }
        updateProgress();
        if (getMode()) {
            progressBarLabel.textContent = `UNet session created · ${unetCreateTime}ms · ${progress}%`;
            log(`[Session Create] UNet Completed · ${unetCreateTime}ms`);
        } else {
            progressBarLabel.textContent = `UNet session created · ${progress}%`;
            log(`[Session Create] UNet Completed`);
        }
    } else if (modelName == "vae-decoder") {
        let vaedecoderCreateTime = (performance.now() - createStartTime).toFixed(2);
        performanceData.sessioncreate.vaedecoder = vaedecoderCreateTime;
        vaeDecoderCompileProgress = 2;
        updateProgress();
        if (getMode()) {
            progressBarLabel.textContent = `VAE Decoder session created · ${vaedecoderCreateTime}ms · ${progress}%`;
            log(`[Session Create] VAE Decoder completed · ${vaedecoderCreateTime}ms`);
        } else {
            progressBarLabel.textContent = `VAE Decoder session created · ${progress}%`;
            log(`[Session Create] VAE Decoder completed`);
        }
    } else if (modelName == "safety-checker") {
        let scCreateTime = (performance.now() - createStartTime).toFixed(2);
        performanceData.sessioncreate.sc = scCreateTime;
        scCompileProgress = 5;
        updateProgress();
        if (getMode()) {
            progressBarLabel.textContent = `Safety Checker session created · ${scCreateTime}ms · ${progress}%`;
            log(`[Session Create] Safety Checker completed · ${scCreateTime}ms`);
        } else {
            progressBarLabel.textContent = `Safety Checker session created · ${progress}%`;
            log(`[Session Create] Safety Checker completed`);
        }
    }
    return modelSession;
}

function displayEmptyCanvasPlaceholder() {
    const canvas = $("#canvas");
    const context = canvas.getContext("2d");
    context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.strokeStyle = "rgba(255, 255, 255, 0.0)";
    context.lineWidth = 0;
    //context.fillRect(0, 0, pixelWidth, pixelHeight);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "300px sans-serif";
    context.fillText("🖼️", canvas.width / 2, canvas.height / 2);
    context.strokeRect(0, 0, pixelWidth, pixelHeight);
}

function displayPlanarRGB(planarPixelData /*: Float32Array or Uint16Array as float16 or Uint8Array*/) {
    const canvas = $("#canvas");
    const context = canvas.getContext("2d");

    // TODO: See if ORT's toImageData() is flexible enough to handle this instead.
    // It doesn't appear work correctly, just returning all white (shrug, maybe I'm passing the wrong values).
    // https://onnxruntime.ai/docs/api/js/interfaces/Tensor-1.html#toImageData
    // https://github.com/microsoft/onnxruntime/blob/5228332/js/common/lib/tensor-conversion.ts#L33
    // https://github.com/microsoft/onnxruntime/blob/main/js/common/lib/tensor-factory.ts#L147
    //
    // let imageData = planarPixelTensor.toImageData({format: 'RGB', tensorLayout: 'NCHW', norm:{bias: 1, mean: 128}});

    let conversionFunction =
        planarPixelData instanceof Float32Array
            ? convertPlanarFloat32RgbToUint8Rgba
            : planarPixelData instanceof Uint16Array
              ? convertPlanarFloat16RgbToUint8Rgba
              : convertPlanarUint8RgbToUint8Rgba;

    let rgbaPixels = conversionFunction(planarPixelData, pixelWidth, pixelHeight);

    let imageData = new ImageData(rgbaPixels, pixelWidth, pixelHeight);
    context.putImageData(imageData, 0, 0);
}

let textEncoderSession;
let vaeDecoderModelSession;
let unetModelSession;
let scModelSession;

// Hard-coded values for 25 iterations (the standard).
const defaultSigmas /*[25 + 1]*/ = [
    14.614647, 11.435942, 9.076809, 7.3019943, 5.9489183, 4.903778, 4.0860896, 3.4381795, 2.9183085, 2.495972,
    2.1485956, 1.8593576, 1.6155834, 1.407623, 1.2280698, 1.0711612, 0.9323583, 0.80802417, 0.695151, 0.5911423,
    0.49355352, 0.3997028, 0.30577788, 0.20348993, 0.02916753, 0.0,
];
const defaultTimeSteps /*[25]*/ = [
    999.0, 957.375, 915.75, 874.125, 832.5, 790.875, 749.25, 707.625, 666.0, 624.375, 582.75, 541.125, 499.5, 457.875,
    416.25, 374.625, 333.0, 291.375, 249.75, 208.125, 166.5, 124.875, 83.25, 41.625, 0.0,
];

async function initializeOnnxRuntime() {
    // Global singletons -_-. Initialize ORT's global singleton.
    ort.env.wasm.numThreads = 1; // 4
    ort.env.wasm.simd = true;
    ort.env.wasm.proxy = false;
}

async function loadStableDiffusion(executionProvider) {
    try {
        // Release sessions if load models again.
        if (textEncoderSession) {
            try {
                await unetModelSession.release();
                await textEncoderSession.release();
                await vaeDecoderModelSession.release();
                if (Utils.getSafetyChecker()) {
                    await scModelSession.release();
                }
            } catch (e) {
                logError(e.message);
            }
        }

        error.removeAttribute("class");
        error.innerHTML = "";

        const loadStartTime = performance.now();
        textEncoderSession = await loadModel("text-encoder", executionProvider);
        performanceData.loadtime.textencoder = (performance.now() - loadStartTime).toFixed(2);

        const unetLoadStartTime = performance.now();
        unetModelSession = await loadModel("unet", executionProvider);
        performanceData.loadtime.unet = (performance.now() - unetLoadStartTime).toFixed(2);

        const vaeDecoderLoadStartTime = performance.now();
        vaeDecoderModelSession = await loadModel("vae-decoder", executionProvider);
        performanceData.loadtime.vaedecoder = (performance.now() - vaeDecoderLoadStartTime).toFixed(2);

        if (Utils.getSafetyChecker()) {
            const scLoadStartTime = performance.now();
            scModelSession = await loadModel("safety-checker", executionProvider);
            performanceData.loadtime.sc = (performance.now() - scLoadStartTime).toFixed(2);
        }

        progressBarInner.style.width = progress + "%";
        progressBarLabel.textContent = "Models loaded and sessions created · " + progress.toFixed(2) + "%";
        const loadTime = performance.now() - loadStartTime;
        if (getMode()) {
            log(`[Total] Total load time (models load and sessions creation): ${(loadTime / 1000).toFixed(2)}s`);
        }
        performanceData.loadtime.total = loadTime.toFixed(2);
        startButton.removeAttribute("disabled");
    } catch (e) {
        console.log("Exception: ", e);
        error.setAttribute("class", "error");
        error.innerHTML = e.message;
    }
}

function practRandSimpleFastCounter32(a, b, c, d) {
    // https://pracrand.sourceforge.net/
    // Using this as a substitute for std::minstd_rand instead.
    // (std::linear_congruential_engine<std::uint_fast32_t, 48271, 0, 2147483647>).
    return function () {
        a >>>= 0;
        b >>>= 0;
        c >>>= 0;
        d >>>= 0;
        var t = (a + b) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        d = (d + 1) | 0;
        t = (t + d) | 0;
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
    };
}

function generateNoise(/*out*/ latentSpace /*: Uint16Array*/, seed /*: BigInt*/) {
    // Don't know nearly equivalent to .

    let randomGenerator = practRandSimpleFastCounter32(
        Number(seed >> 0n) & 0xffffffff,
        Number(seed >> 32n) & 0xffffffff,
        Number(seed >> 64n) & 0xffffffff,
        Number(seed >> 96n) & 0xffffffff,
    );

    const elementCount = latentSpace.length;
    for (let i = 0; i < elementCount; ++i) {
        const u1 = randomGenerator();
        const u2 = randomGenerator();
        const radius = Math.sqrt(-2.0 * Math.log(u1));
        const theta = 2.0 * Math.PI * u2;
        const standardNormalRand = radius * Math.cos(theta);
        const newValue = standardNormalRand;
        latentSpace[i] = Utils.encodeFloat16(newValue);
    }
}

function prescaleLatentSpace(/*inout*/ latentSpace /*: Uint16Array*/, initialSigma /*: float*/) {
    const elementCount = latentSpace.length;
    for (let i = 0; i < elementCount; ++i) {
        latentSpace[i] = Utils.encodeFloat16(Utils.decodeFloat16(latentSpace[i]) * initialSigma);
    }
}

function scaleLatentSpaceForPrediction(/*inout*/ latentSpace /*: Uint16Array*/, iterationIndex /*: int*/) {
    console.assert(iterationIndex < defaultSigmas.length);

    // sample = sample / ((sigma**2 + 1) ** 0.5)
    let sigma = defaultSigmas[iterationIndex];
    let inverseScale = 1 / Math.sqrt(sigma * sigma + 1);

    const elementCount = latentSpace.length;
    for (let i = 0; i < elementCount; ++i) {
        latentSpace[i] = Utils.encodeFloat16(Utils.decodeFloat16(latentSpace[i]) * inverseScale);
    }
}

// Adjusts the latent space in-place by the predicted noise, weighted for the current iteration.
// This version takes two batches, with the positive prediction in batch 0, negative in batch 1.
function denoiseLatentSpace(
    /*inout*/ latentSpace /*: Uint16Array*/,
    iterationIndex /*: Number*/,
    predictedNoise /*: Uint16Array*/,
) {
    console.assert(latentSpace.length === predictedNoise.length);

    const elementCount = latentSpace.length; // Given [2, 4, 64, 64], count of all elements.
    const singleBatchElementCount = elementCount / 2; // Given [2, 4, 64, 64], we want only the first batch.

    // Prompt strength scale.
    const defaultPromptStrengthScale = 7.5;
    const positiveWeight = defaultPromptStrengthScale;
    const negativeWeight = 1 - positiveWeight;

    // Add predicted noise (scaled by current iteration weight) to latents.
    const sigma = defaultSigmas[iterationIndex];
    const sigmaNext = defaultSigmas[iterationIndex + 1];
    const dt = sigmaNext - sigma;

    for (let i = 0; i < singleBatchElementCount; ++i) {
        // Fold 2 batches into one, weighted by positive and negative weights.
        const weightedPredictedNoise =
            Utils.decodeFloat16(predictedNoise[i]) * positiveWeight +
            Utils.decodeFloat16(predictedNoise[i + singleBatchElementCount]) * negativeWeight;

        // The full formula:
        //
        //  // 1. Compute predicted original sample from sigma-scaled predicted noise.
        //  float sample = latentSpace[i];
        //  float predictedOriginalSample = sample - sigma * predictedNoiseData[i];
        //
        //  // 2. Convert to an ODE derivative
        //  float derivative = (sample - predictedOriginalSample) / sigma;
        //  float previousSample = sample + derivative * dt;
        //  latentSpace[i] = previousSample;
        //
        // Simplifies to:
        //
        //  updatedSample = sample + ((sample - (sample - sigma * predictedNoiseData[i])) / sigma  * dt);
        //  updatedSample = sample + ((sample - sample + sigma * predictedNoiseData[i]) / sigma  * dt);
        //  updatedSample = sample + ((sigma * predictedNoiseData[i]) / sigma  * dt);
        //  updatedSample = sample + (predictedNoiseData[i] * dt);

        latentSpace[i] = Utils.encodeFloat16(Utils.decodeFloat16(latentSpace[i]) + weightedPredictedNoise * dt);
    }
}

function applyVaeScalingFactor(latentSpace /*: Uint16Array as float16*/) {
    const /*float*/ defaultVaeScalingFactor = 0.18215; // Magic constants for default VAE :D (used in Huggingface pipeline).
    const /*float*/ inverseScalingFactor = 1.0 / defaultVaeScalingFactor;
    latentSpace.forEach((e, i, a) => (a[i] = Utils.encodeFloat16(Utils.decodeFloat16(e) * inverseScalingFactor)));
}

async function executeStableDiffusion() {
    /*: ort.Tensor*/
    // Implicit inputs:
    // - unetModelSession
    // - unetInputs
    // - vaeDecoderInputs
    // - scInputs
    log("[Session Run] Beginning text encode");
    let token_ids = await getTextTokens();
    const startTextEncoder = performance.now();
    const textEncoderInputs = {
        input_ids: Utils.generateTensorFromValues("int32", [unetBatch, textEmbeddingSequenceLength], token_ids),
    };
    const textEncoderOutputs = await textEncoderSession.run(textEncoderInputs);

    let textEncoderExecutionTime = (performance.now() - startTextEncoder).toFixed(2);
    performanceData.sessionrun.textencoder = textEncoderExecutionTime;
    if (getMode()) {
        log(`[Session Run] Text encode execution time: ${textEncoderExecutionTime}ms`);
    } else {
        log(`[Session Run] Text encode completed`);
    }

    inferenceProgress += 1;
    progressBarInnerInference.style.width = inferenceProgress + "%";
    progressBarLabelInference.textContent = "Text encoded · " + inferenceProgress.toFixed(2) + "%";

    log("[Session Run] Beginning UNet loop execution for 25 iterations");

    let latentSpace = new Uint16Array(latentWidth * latentHeight * unetChannelCount);
    generateNoise(/*inout*/ latentSpace, seed);
    // Duplicate the input data, once for each batch (only supports unetBatch == 2).
    latentSpace = new Uint16Array([...latentSpace, ...latentSpace]);

    const latentsTensor = Utils.generateTensorFromBytes(
        "float16",
        [unetBatch, unetChannelCount, latentHeight, latentWidth],
        latentSpace,
    );

    const halfLatentElementCount = latentsTensor.size / 2; // Given [2, 4, 64, 64], we want only the first batch.
    let latents = await latentsTensor.getData();
    if (isFloat16ArrayAvailable) {
        // If Float16Array is available, convert latents back to Uint16Array for post-processing.
        latents = new Uint16Array(latents.buffer, latents.byteOffset, latents.length);
    }
    let halfLatents = latents.subarray(0, halfLatentElementCount); // First batch only.
    prescaleLatentSpace(/*inout*/ halfLatents, defaultSigmas[0]);

    const unetInputs = {
        encoder_hidden_states: Utils.generateTensorFromBytes(
            "float16",
            [unetBatch, textEmbeddingSequenceLength, textEmbeddingSequenceWidth],
            textEncoderOutputs["last_hidden_state"].data,
        ),
    };

    const startUnet = performance.now();
    // Repeat unet detection and denosing until convergence (typically 25 iterations).
    for (var i = 0; i < unetIterationCount; ++i) {
        // Update time step.
        let startUnetIteration = performance.now();
        const timeStepValue = BigInt(Math.round(defaultTimeSteps[i])); // Round, because this ridiculous language throws an exception otherwise.
        unetInputs["timestep"] = Utils.generateTensorFillValue("int64", [unetBatch], timeStepValue);

        // Prescale the latent values.
        // Copy first batch to second batch, duplicating latents for positive and negative prompts.
        let nextLatents = latents.slice(0);
        let halfNextLatents = nextLatents.subarray(0, halfLatentElementCount);
        scaleLatentSpaceForPrediction(/*inout*/ halfNextLatents, i);
        nextLatents.copyWithin(halfLatentElementCount, 0, halfLatentElementCount); // Copy lower half to upper half.

        unetInputs["sample"] = Utils.generateTensorFromBytes(
            "float16",
            [unetBatch, unetChannelCount, latentHeight, latentWidth],
            nextLatents,
        );
        const unetOutputs = await unetModelSession.run(unetInputs);

        let predictedNoise = new Uint16Array(unetOutputs["out_sample"].cpuData.buffer);
        denoiseLatentSpace(/*inout*/ latents, i, predictedNoise);

        let time = (performance.now() - startUnetIteration).toFixed(2);
        performanceData.sessionrun.unet.push(time);
        // log(`UNet loop ${i + 1} execution time: ${time}ms`);

        inferenceProgress += 3.8;
        progressBarInnerInference.style.width = inferenceProgress + "%";
        progressBarLabelInference.textContent = `UNet iteration ${i + 1} completed · ${inferenceProgress.toFixed(2)}%`;
    }

    let unetExecutionTime = (performance.now() - startUnet).toFixed(2);
    performanceData.sessionrun.unettotal = unetExecutionTime;

    if (getMode()) {
        log(`[Session Run] UNet loop execution time: ${unetExecutionTime}ms`);
    } else {
        log(`[Session Run] UNet loop completed`);
    }

    log("[Session Run] Beginning VAE decode");
    // Decode from latent space.
    applyVaeScalingFactor(/*inout*/ halfLatents);
    let dimensions = latentsTensor.dims.slice(0);
    dimensions[0] = 1; // Set batch size to 1, ignore the 2nd batch for the negative prediction.

    const startVaeDecoder = performance.now();
    const vaeDecoderInputs = {
        latent_sample: Utils.generateTensorFromBytes("float16", dimensions, halfLatents.slice(0)),
    };
    const decodedOutputs = await vaeDecoderModelSession.run(vaeDecoderInputs);
    let vaeDecoderExecutionTime = (performance.now() - startVaeDecoder).toFixed(2);

    if (getMode()) {
        log(`[Session Run] VAE decode execution time: ${vaeDecoderExecutionTime}ms`);
    } else {
        log(`[Session Run] VAE decode completed`);
    }
    performanceData.sessionrun.vaedecoder = vaeDecoderExecutionTime;

    if (Utils.getSafetyChecker()) {
        inferenceProgress += 3;
    } else {
        inferenceProgress += 4;
    }
    progressBarInnerInference.style.width = inferenceProgress + "%";
    progressBarLabelInference.textContent = "VAE decoded · " + inferenceProgress.toFixed(2) + "%";

    return decodedOutputs["sample"];
}

async function executeStableDiffusionAndDisplayOutput() {
    try {
        error.removeAttribute("class");
        error.innerHTML = "";
        displayEmptyCanvasPlaceholder();

        const executionStartTime = performance.now();
        let rgbPlanarPixels = await executeStableDiffusion();
        const executionTime = performance.now() - executionStartTime;
        performanceData.sessionrun.total = executionTime.toFixed(2);
        let planarPixelData = await rgbPlanarPixels.getData();
        if (isFloat16ArrayAvailable) {
            // If Float16Array is available, convert Float16Array to Float32Array directly.
            planarPixelData = Float32Array.from(planarPixelData, v => v);
        }
        displayPlanarRGB(planarPixelData);

        if (Utils.getSafetyChecker()) {
            // safety_checker
            let resized_image_data = resize_image(224, 224);
            let normalized_image_data = normalizeImageData(resized_image_data);

            log("[Session Run] Beginning Safety Checker");
            const startSc = performance.now();
            let safety_checker_feed = {
                clip_input: get_tensor_from_image(normalized_image_data, "NCHW"),
                images: get_tensor_from_image(resized_image_data, "NHWC"),
            };
            const { has_nsfw_concepts } = await scModelSession.run(safety_checker_feed);
            // const { out_images, has_nsfw_concepts } = await models.safety_checker.sess.run(safety_checker_feed);
            let scExecutionTime = (performance.now() - startSc).toFixed(2);
            if (getMode()) {
                log(`[Session Run] Safety Checker execution time: ${scExecutionTime}ms`);
            } else {
                log(`[Session Run] Safety Checker completed`);
            }
            performanceData.sessionrun.sc = scExecutionTime;

            inferenceProgress += 1;
            progressBarInnerInference.style.width = inferenceProgress + "%";
            progressBarLabelInference.textContent = "Completed Safety Checker · " + inferenceProgress.toFixed(2) + "%";

            let nsfw = false;
            has_nsfw_concepts.data[0] ? (nsfw = true) : (nsfw = false);
            log(`[Session Run] Safety Checker - not safe for work (NSFW) concepts: ${nsfw}`);
            if (has_nsfw_concepts.data[0]) {
                $(`#canvas`).setAttribute("class", "canvas nsfw");
                $(`#canvas`).setAttribute("title", "Not safe for work (NSFW) content");
                $(`#nsfw`).innerHTML = "Not safe for work (NSFW) content";
                $(`#nsfw`).setAttribute("class", "nsfw");
            } else {
                $(`#canvas`).setAttribute("class", "canvas");
                $(`#canvas`).setAttribute("title", "");
                $(`#nsfw`).setAttribute("class", "");
            }
        } else {
            $(`#canvas`).setAttribute("class", "canvas");
            $(`#canvas`).setAttribute("title", "");
            $(`#nsfw`).setAttribute("class", "");
        }
    } catch (e) {
        error.setAttribute("class", "error");
        error.innerHTML = e.message;
        console.log("Exception: ", e);
    }
}

async function generateNextImage() {
    await executeStableDiffusionAndDisplayOutput();
    // seed++;
    console.log(seed);
    startButton.disabled = false;

    if (performanceData.sessionrun.total) {
        textEncoderLoad.innerHTML = performanceData.loadtime.textencoder;
        textEncoderFetch.innerHTML = performanceData.modelfetch.textencoder;
        textEncoderCreate.innerHTML = performanceData.sessioncreate.textencoder;
        textEncoderRun.innerHTML = performanceData.sessionrun.textencoder;

        unetLoad.innerHTML = performanceData.loadtime.unet;
        unetFetch.innerHTML = performanceData.modelfetch.unet;
        unetCreate.innerHTML = performanceData.sessioncreate.unet;
        unetRun.innerHTML =
            performanceData.sessionrun.unet.toString().replaceAll(",", " ") +
            "<br/>25 Iterations: " +
            performanceData.sessionrun.unettotal;

        vaeDecoderLoad.innerHTML = performanceData.loadtime.vaedecoder;
        vaeDecoderFetch.innerHTML = performanceData.modelfetch.vaedecoder;
        vaeDecoderCreate.innerHTML = performanceData.sessioncreate.vaedecoder;
        vaeDecoderRun.innerHTML = performanceData.sessionrun.vaedecoder;

        scLoad.innerHTML = performanceData.loadtime.sc;
        scFetch.innerHTML = performanceData.modelfetch.sc;
        scCreate.innerHTML = performanceData.sessioncreate.sc;
        scRun.innerHTML = performanceData.sessionrun.sc;

        totalLoad.innerHTML = performanceData.loadtime.total;
        totalRun.innerHTML = performanceData.sessionrun.total;
    }

    if (getMode()) {
        data.setAttribute("class", "show");
    }
}

const executionProvider = getQueryVariable("provider", "webnn");
log("[Load] Execution Provider: " + executionProvider);
log("[Load] EP device type: " + getQueryVariable("devicetype", "gpu"));

const checkWebNN = async () => {
    let status = $("#webnnstatus");
    let info = $("#info");
    let webnnStatus = await getWebnnStatus();

    if (webnnStatus.webnn) {
        status.setAttribute("class", "green");
        info.innerHTML = "WebNN supported";
        updateDeviceTypeLinks();
        loadButton.disabled = false;
    } else {
        loadButton.disabled = true;
        if (webnnStatus.error) {
            status.setAttribute("class", "red");
            info.innerHTML = `WebNN not supported: ${webnnStatus.error} <a id="webnn_na" href="../../install.html" title="WebNN Installation Guide">Set up WebNN</a>`;
            logError(`[Error] ${webnnStatus.error}`);
        } else {
            status.setAttribute("class", "red");
            info.innerHTML = "WebNN not supported";
            logError("[Error] WebNN not supported");
        }
    }

    if (getQueryValue("provider")?.toLowerCase() === "webgpu") {
        status.innerHTML = "";
    }
};

const updateDeviceTypeLinks = () => {
    let info = $("#info");
    const links = `· <a href="./?devicetype=gpu">GPU</a> · <a id="npu_link" href="./?devicetype=npu">NPU</a>`;
    info.innerHTML = `${info.innerHTML} ${links}`;
};

const ui = async () => {
    device = $("#device");
    badge = $("#badge");
    const provider = getQueryValue("provider")?.toLowerCase();
    const deviceType = getQueryVariable("devicetype", "gpu")?.toLowerCase();
    await setupORT("stable-diffusion-1.5", "dev");
    showCompatibleChromiumVersion("stable-diffusion-1.5");
    if (provider === "webgpu") {
        title.innerHTML = "WebGPU";
    }
    await checkWebNN();
    if (deviceType === "cpu" || provider === "wasm") {
        device.innerHTML = "CPU";
        badge.setAttribute("class", "cpu");
        document.body.setAttribute("class", "cpu");
    } else if (deviceType === "gpu" || provider === "webgpu") {
        device.innerHTML = "GPU";
        badge.setAttribute("class", "");
        document.body.setAttribute("class", "gpu");
    } else if (deviceType === "npu") {
        device.innerHTML = "NPU";
        badge.setAttribute("class", "npu");
        document.body.setAttribute("class", "npu");
    }
    initializeOnnxRuntime();
    displayEmptyCanvasPlaceholder();
    if (Utils.getSafetyChecker()) {
        scTr.setAttribute("class", "");
    } else {
        scTr.setAttribute("class", "hide");
    }
};

document.addEventListener("DOMContentLoaded", ui, false);

const updateSeed = () => {
    userSeed.value = randomNumber();
    seed = BigInt(userSeed.value);
};

changeSeed.addEventListener("click", updateSeed, false);

memoryReleaseSwitch.addEventListener("change", () => {
    if (memoryReleaseSwitch.checked) {
        memoryReleaseSwitch.setAttribute("checked", "");
    } else {
        memoryReleaseSwitch.removeAttribute("checked");
    }
});

window.addEventListener("beforeunload", () => {
    if (memoryReleaseSwitch.checked) {
        const sessions = [scModelSession, vaeDecoderModelSession, unetModelSession, textEncoderSession];
        Promise.allSettled(sessions.filter(session => session).map(session => session.release())).catch(error =>
            console.error("Session release error:", error),
        );
        startButton.disabled = true;
        loadButton.disabled = false;
        progressBarInner.style.width = "0%";
        progressBarLabel.textContent = "0%";
        progressBarInnerInference.style.width = "0%";
        progressBarLabelInference.textContent = "0%";
    }
});
