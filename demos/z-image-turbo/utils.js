import { AutoTokenizer, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3/dist/transformers.min.js";

env.localModelPath = "models/";
env.allowRemoteModels = true;
env.allowLocalModels = true;
env.useBrowserCache = false;
// Always use local/relative paths for tokenizers, as they are small enough to be hosted on GitHub Pages
const tokenizer = await AutoTokenizer.from_pretrained("tokenizer");

/**
 * Extracts and prepares input IDs and attention masks for the text encoder from a given prompt.
 *
 * @param {string} prompt - The user input text.
 * @param {number} maxSequenceLength - Maximum token length allowed for the model.
 * @returns {Promise<{inputIds: BigInt64Array, attentionMask: BigInt64Array, sequenceLength: number}>}
 */
async function getTextEncoderInputs(prompt, maxSequenceLength) {
    const messages = [{ role: "user", content: prompt }];
    const promptWithTemplate = tokenizer.apply_chat_template(messages, {
        tokenize: false,
        add_generation_prompt: true,
        enable_thinking: true,
    });

    const promptInputs = tokenizer([promptWithTemplate], {
        padding: false,
        max_length: maxSequenceLength,
        truncation: true,
        return_tensor: false,
    });

    const inputIds = new BigInt64Array(promptInputs.input_ids[0].map(BigInt));
    const attentionMask = new BigInt64Array(promptInputs.attention_mask[0].map(BigInt));

    return { inputIds, attentionMask, sequenceLength: inputIds.length };
}

/**
 * Draw image from pixel data, rescaling data -0.5 to 0.5 into pixels 0 to 255.
 * @param {Float32Array} pixels
 * @param {number} height
 * @param {number} width
 * @param {HTMLCanvasElement} canvas
 */
function drawImage(pixels, height, width, canvas) {
    const channelSize = height * width;
    const rgbaData = new Uint8ClampedArray(channelSize * 4);

    for (let j = 0; j < channelSize; j++) {
        // NCHW layout: R is at 0, G at channelSize, B at 2*channelSize
        let r = pixels[j];
        let g = pixels[j + channelSize];
        let b = pixels[j + 2 * channelSize];

        // Map [-1, 1] to [0, 255]
        rgbaData[j * 4 + 0] = (r / 2 + 0.5) * 255;
        rgbaData[j * 4 + 1] = (g / 2 + 0.5) * 255;
        rgbaData[j * 4 + 2] = (b / 2 + 0.5) * 255;
        rgbaData[j * 4 + 3] = 255; // Alpha
    }

    const imageData = new ImageData(rgbaData, width, height);
    if (canvas) {
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").putImageData(imageData, 0, 0);
    }
}

/*
 * get configuration from url
 */
function getConfig() {
    const queryParams = new URLSearchParams(window.location.search);
    const config = {
        model: location.href.includes("github.io")
            ? "https://huggingface.co/webnn/Z-Image-Turbo/resolve/main"
            : "models",
        mode: "none",
        safetyChecker: true,
        provider: "webgpu",
        deviceType: "gpu",
        useIOBinding: true,
        verbose: false,
        presetPrompt: false,
    };

    for (const key in config) {
        const lowerKey = key.toLowerCase();
        const value = queryParams.get(key) ?? queryParams.get(lowerKey);
        if (value !== null) {
            if (typeof config[key] === "boolean") {
                config[key] = value === "true";
            } else if (typeof config[key] === "number") {
                config[key] = isNaN(parseInt(value)) ? config[key] : parseInt(value);
            } else {
                config[key] = decodeURIComponent(value);
            }
        }
    }

    return config;
}

const getQueryValue = name => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

// Get model via Origin Private File System — returns a File (Blob subclass).
// The download streams network -> OPFS disk without ever holding the whole file
// in memory, and ORT reads bytes from the File on demand (low memory peak).
async function getModelOPFS(name, url, updateModel, onProgress) {
    const root = await navigator.storage.getDirectory();

    async function updateFile() {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`fetch ${url} -> ${response.status}`);
        const total = parseInt(response.headers.get("Content-Length") ?? "0");
        const fileHandle = await root.getFileHandle(name, { create: true });
        const writable = await fileHandle.createWritable();
        // Stream network -> OPFS disk; never hold the whole file in memory.
        await response.body.pipeThrough(progressStream(onProgress, total)).pipeTo(writable);
        if (onProgress) onProgress(100);
        return await fileHandle.getFile();
    }

    if (updateModel) {
        return await updateFile();
    }

    try {
        const fileHandle = await root.getFileHandle(name);
        const blob = await fileHandle.getFile(); // cached: File == Blob, read lazily
        if (onProgress) onProgress(100);
        return blob;
    } catch (e) {
        console.log(e.message);
        return await updateFile();
    }
}

// TransformStream that reports download progress without buffering the payload.
function progressStream(onProgress, total) {
    let loaded = 0;
    return new TransformStream({
        transform(chunk, controller) {
            loaded += chunk.byteLength;
            if (onProgress) {
                // Cap at 99 while streaming; updateFile emits the final 100 once flushed to disk.
                const percent = total > 0 ? (loaded / total) * 100 : 0;
                onProgress(Math.min(99, percent));
            }
            controller.enqueue(chunk);
        },
    });
}

const isNormalMode = () => {
    return getQueryValue("mode") === "normal" ? false : true;
};

const sizeOfShape = shape => shape.reduce((a, b) => a * b, 1);

// Seeded PRNG (mulberry32)
function mulberry32(seed) {
    let t = seed >>> 0;
    return function () {
        t += 0x6d2b79f5;
        let r = Math.imul(t ^ (t >>> 15), t | 1);
        r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}

// Create latents with normal(0,1) samples, returns { data: Float16Array, shape: number[] }.
// float16 matches the transformer's hidden_states input.
function createLatents(shape, seed = 42) {
    const size = shape.reduce((a, b) => a * b, 1);
    const rand = mulberry32(seed);
    const out = new Float16Array(size);

    // Box-Muller transform (generate pairs)
    for (let i = 0; i < size; i += 2) {
        let u = rand();
        let v = rand();
        // avoid log(0)
        if (u === 0) u = Number.EPSILON;
        const mag = Math.sqrt(-2.0 * Math.log(u));
        const z0 = mag * Math.cos(2.0 * Math.PI * v);
        const z1 = mag * Math.sin(2.0 * Math.PI * v);
        out[i] = z0;
        if (i + 1 < size) out[i + 1] = z1;
    }
    return { data: out, shape };
}

export { getTextEncoderInputs, drawImage, getConfig, getModelOPFS, isNormalMode, sizeOfShape, createLatents };
