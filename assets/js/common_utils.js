export const $ = s => document.querySelector(s);
export const $$ = s => [...document.querySelectorAll(s)];
export const isFloat16ArrayAvailable = typeof Float16Array !== "undefined" && Float16Array.from;

const KNOWN_COMPATIBLE_CHROMIUM_VERSION = {
    "stable-diffusion-1.5": "136.0.7051.0",
    "sd-turbo": "136.0.7051.0",
    "segment-anything": "136.0.7051.0",
    "whisper-base": "136.0.7051.0",
    "image-classification": "136.0.7051.0",
    "text-generation": "136.0.7051.0",
};

export const showCompatibleChromiumVersion = key => {
    const version = KNOWN_COMPATIBLE_CHROMIUM_VERSION[key];
    if (version) {
        const chromiumVersionElement = $("#chromiumversion");
        chromiumVersionElement.innerHTML = `Known compatible Chromium version: 
      <a href="https://github.com/microsoft/webnn-developer-preview#breaking-changes" title="Known compatible Chromium version">
        ${version}
      </a>
    `;
    }
};

export const loadScript = async (id, url) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.onload = resolve;
        script.onerror = reject;
        script.id = id;
        script.src = url;
        if (url.startsWith("http")) {
            script.crossOrigin = "anonymous";
        }
        document.body.append(script);
    });
};

export const removeElement = async id => {
    let el = $(id);
    if (el) {
        el.parentNode.removeChild(el);
    }
};

export const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const getQueryValue = name => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

export const getQueryVariable = (name, defaults) => {
    const query = window.location.search.substring(1);
    let vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == name) {
            return pair[1];
        }
    }
    return defaults;
};

export const updateQueryStringParameter = (uri, key, value) => {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf("?") !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, "$1" + key + "=" + value + "$2");
    } else {
        return uri + separator + key + "=" + value;
    }
};

export const convertToSnakeCase = str => {
    return str.toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");
};

export const log = i => {
    console.log(i);
    if (getMode()) {
        $("#log").innerText += `\n[${getTime()}] ${i}`;
    } else {
        $("#log").innerText += `\n${i}`;
    }
};

export const logError = i => {
    console.error(i);
    if (getMode()) {
        $("#log").innerText += `\n[${getTime()}] ${i}`;
    } else {
        $("#log").innerText += `\n${i}`;
    }
};

export const randomNumber = () => {
    // generate 6 digital random number between 100, 000 and 999,999
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
};

export const padNumber = (num, fill) => {
    let len = ("" + num).length;
    return Array(fill > len ? fill - len + 1 || 0 : 0).join(0) + num;
};

export const getDateTime = () => {
    let date = new Date(),
        m = padNumber(date.getMonth() + 1, 2),
        d = padNumber(date.getDate(), 2),
        hour = padNumber(date.getHours(), 2),
        min = padNumber(date.getMinutes(), 2),
        sec = padNumber(date.getSeconds(), 2);
    return `${m}/${d} ${hour}:${min}:${sec}`;
};

export const getTime = () => {
    let date = new Date(),
        hour = padNumber(date.getHours(), 2),
        min = padNumber(date.getMinutes(), 2),
        sec = padNumber(date.getSeconds(), 2);
    return `${hour}:${min}:${sec}`;
};

const DEV_ORT_VERSION = "1.23.0-dev.20250429-a9a3ad2e0c";
const STABLE_ORT_VERSION = "";
const TEST_ORT_VERSION = "test";

const KNOWN_COMPATIBLE_ORT_VERSION = {
    "stable-diffusion-1.5": {
        dev: DEV_ORT_VERSION,
        stable: STABLE_ORT_VERSION,
        test: TEST_ORT_VERSION,
    },
    "sd-turbo": {
        dev: DEV_ORT_VERSION,
        stable: STABLE_ORT_VERSION,
        test: TEST_ORT_VERSION,
    },
    "segment-anything": {
        dev: DEV_ORT_VERSION,
        stable: STABLE_ORT_VERSION,
        test: TEST_ORT_VERSION,
    },
    "whisper-base": {
        dev: DEV_ORT_VERSION,
        stable: STABLE_ORT_VERSION,
        test: TEST_ORT_VERSION,
    },
    "phi-3-mini": {
        dev: DEV_ORT_VERSION,
        stable: STABLE_ORT_VERSION,
        test: TEST_ORT_VERSION,
    },
    "text-generation": {
        dev: DEV_ORT_VERSION,
        stable: STABLE_ORT_VERSION,
        test: TEST_ORT_VERSION,
    },
};

const ORT_BASE_URL = "https://www.npmjs.com/package/onnxruntime-web/v/";
const ORT_CDN_URL = "https://cdn.jsdelivr.net/npm/onnxruntime-web@";
const ORT_CDN_DATA_URL = "https://data.jsdelivr.com/v1/packages/npm/onnxruntime-web";
const ortLink = version => `${ORT_BASE_URL}${version}?activeTab=versions`;

// Get the latest dev version of ONNX Runtime Web dists
const getLatestOrtWebDevVersion = async () => {
    try {
        const response = await fetch(ORT_CDN_DATA_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.tags && data.tags.dev) {
            return data.tags.dev;
        } else {
            console.error("Latest dev version of ONNX Runtime Web not found in the response");
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
};

const loadScriptWithMessage = async version => {
    try {
        if (version === "test") {
            await loadScript("onnxruntime-web", "../../assets/dist/ort.webgpu.min.js");
            return "ONNX Runtime Web: Test version";
        } else {
            if (version === "latest") {
                version = await getLatestOrtWebDevVersion();
            }
            await loadScript("onnxruntime-web", `${ORT_CDN_URL}${version}/dist/ort.webgpu.min.js`);
            return `ONNX Runtime Web: <a href="${ortLink(version)}">${version}</a>`;
        }
    } catch (error) {
        console.error("Failed to load ORT script:", error);
        return "Failed to load ONNX Runtime Web";
    }
};

export const setupORT = async (key, branch) => {
    const version = KNOWN_COMPATIBLE_ORT_VERSION[key][branch];
    const ortVersionElement = $("#ortversion");
    removeElement("onnxruntime-web");
    const queryOrt = getQueryValue("ort")?.toLowerCase();
    let versionHtml;
    if (queryOrt) {
        versionHtml = await loadScriptWithMessage(queryOrt);
    } else {
        versionHtml = await loadScriptWithMessage(version);
    }
    ortVersionElement.innerHTML = versionHtml;
};

export const getWebnnStatus = async () => {
    let result = {};
    try {
        const context = await navigator.ml.createContext();
        if (context) {
            try {
                // eslint-disable-next-line no-undef
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

export const random = () => {
    return (Math.random() * (1000 - 1) + 1).toFixed(2);
};

export const getMedian = arr => {
    const sorted = arr.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2.0);

    if (sorted.length % 2 === 0) {
        return (parseFloat(sorted[middle - 1]) + parseFloat(sorted[middle])) / 2.0;
    } else {
        return parseFloat(sorted[middle].toFixed(2));
    }
};

export const getAverage = arr => {
    const avg = arr.reduce((a, b) => a + b) / arr.length;
    return parseFloat(avg).toFixed(2);
};

export const getMinimum = arr => {
    const minimum = Math.min(...arr);
    return parseFloat(minimum).toFixed(2);
};

export const asyncErrorHandling = (promise, errorExt) => {
    return promise
        .then(data => [null, data])
        .catch(err => {
            if (errorExt) {
                const parsedError = Object.assign({}, err, errorExt);
                return [parsedError, undefined];
            }

            return [err, undefined];
        });
};

export const getMode = () => {
    return getQueryValue("mode") === "normal" ? false : true;
};

// ref: http://stackoverflow.com/questions/32633585/how-do-you-convert-to-half-floats-in-javascript
export const toHalf = (function () {
    var floatView = new Float32Array(1);
    var int32View = new Int32Array(floatView.buffer);

    /* This method is faster than the OpenEXR implementation (very often
     * used, eg. in Ogre), with the additional benefit of rounding, inspired
     * by James Tursa?s half-precision code. */
    return function toHalf(val) {
        floatView[0] = val;
        var x = int32View[0];

        var bits = (x >> 16) & 0x8000; /* Get the sign */
        var m = (x >> 12) & 0x07ff; /* Keep one extra bit for rounding */
        var e = (x >> 23) & 0xff; /* Using int is faster here */

        /* If zero, or denormal, or exponent underflows too much for a denormal
         * half, return signed zero. */
        if (e < 103) {
            return bits;
        }

        /* If NaN, return NaN. If Inf or exponent overflow, return Inf. */
        if (e > 142) {
            bits |= 0x7c00;
            /* If exponent was 0xff and one mantissa bit was set, it means NaN,
             * not Inf, so make sure we set one mantissa bit too. */
            bits |= (e == 255 ? 0 : 1) && x & 0x007fffff;
            return bits;
        }

        /* If exponent underflows but not too much, return a denormal */
        if (e < 113) {
            m |= 0x0800;
            /* Extra rounding may overflow and set mantissa to 0 and exponent
             * to 1, which is OK. */
            bits |= (m >> (114 - e)) + ((m >> (113 - e)) & 1);
            return bits;
        }

        bits |= ((e - 112) << 10) | (m >> 1);
        /* Extra rounding. An overflow will set mantissa to 0 and increment
         * the exponent, which is OK. */
        bits += m & 1;
        return bits;
    };
})();

// This function converts a Float16 stored as the bits of a Uint16 into a Javascript Number.
// Adapted from: https://gist.github.com/martinkallman/5049614
// input is a Uint16 (eg, new Uint16Array([value])[0])

function float16ToNumber(input) {
    // Create a 32 bit DataView to store the input
    const arr = new ArrayBuffer(4);
    const dv = new DataView(arr);

    // Set the Float16 into the last 16 bits of the dataview
    // So our dataView is [00xx]
    dv.setUint16(2, input, false);

    // Get all 32 bits as a 32 bit integer
    // (JS bitwise operations are performed on 32 bit signed integers)
    const asInt32 = dv.getInt32(0, false);

    // All bits aside from the sign
    let rest = asInt32 & 0x7fff;
    // Sign bit
    let sign = asInt32 & 0x8000;
    // Exponent bits
    const exponent = asInt32 & 0x7c00;

    // Shift the non-sign bits into place for a 32 bit Float
    rest <<= 13;
    // Shift the sign bit into place for a 32 bit Float
    sign <<= 16;

    // Adjust bias
    // https://en.wikipedia.org/wiki/Half-precision_floating-point_format#Exponent_encoding
    rest += 0x38000000;
    // Denormals-as-zero
    rest = exponent === 0 ? 0 : rest;
    // Re-insert sign bit
    rest |= sign;

    // Set the adjusted float32 (stored as int32) back into the dataview
    dv.setInt32(0, rest, false);

    // Get it back out as a float32 (which js will convert to a Number)
    const asFloat32 = dv.getFloat32(0, false);

    return asFloat32;
}

// convert Uint16Array to Float32Array
export function convertToFloat32Array(fp16_array) {
    // It is real Float16Array
    if (isFloat16ArrayAvailable && fp16_array instanceof Float16Array) {
        return Float32Array.from(fp16_array, v => v);
    }
    // It is Uint16Array that represents Float16Array
    const fp32_array = new Float32Array(fp16_array.length);
    for (let i = 0; i < fp32_array.length; i++) {
        fp32_array[i] = float16ToNumber(fp16_array[i]);
    }
    return fp32_array;
}

// convert Float32Array to Uint16Array or Float16Array
export function convertToFloat16OrUint16Array(fp32_array) {
    if (isFloat16ArrayAvailable) {
        // Float16Array is available - use it
        return Float16Array.from(fp32_array, v => v);
    }
    const fp16_array = new Uint16Array(fp32_array.length);
    for (let i = 0; i < fp16_array.length; i++) {
        fp16_array[i] = toHalf(fp32_array[i]);
    }
    return fp16_array;
}

// Create a new ORT ML Tensor from the given parameters.
export async function createMlTensor(mlContext, dataType, dims, writable, readable) {
    const mlTensor = await mlContext.createTensor({ dataType, shape: dims, writable, readable });
    // eslint-disable-next-line no-undef
    return ort.Tensor.fromMLTensor(mlTensor, { dataType, dims });
}

// Normalize the buffer size so that it fits the 128-bits (16 bytes) alignment.
const calcNormalizedBufferSize = size => Math.ceil(Number(size) / 16) * 16;

// Create a new ORT GPU Tensor from the given parameters.
export function createGpuTensor(device, dataType, dims, bufferSize) {
    const gpuBuffer = device.createBuffer({
        usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
        size: calcNormalizedBufferSize(bufferSize),
    });
    // eslint-disable-next-line no-undef
    return ort.Tensor.fromGpuBuffer(gpuBuffer, { dataType, dims });
}

// Download an ML tensor into a pre-allocated target buffer.
export async function downloadMlTensor(mlContext, mlTensor, targetBuffer) {
    await mlContext.readTensor(mlTensor, targetBuffer);
}

// Dynamically handle arrayBuffer based on the type of targetBuffer
function setBufferData(targetBuffer, arrayBuffer, originalSize) {
    // Determine the constructor of the target buffer (e.g., Float32Array, Int32Array, etc.)
    const TargetType = targetBuffer.constructor;

    // Create a new TypedArray of the same type as targetBuffer from the arrayBuffer
    const sourceBuffer = new TargetType(arrayBuffer, 0, originalSize / TargetType.BYTES_PER_ELEMENT);

    // Copy the data into the targetBuffer
    targetBuffer.set(sourceBuffer);
}

// Download a gpu tensor into a pre-allocated target buffer.
export async function downloadGpuTensor(device, gpuBuffer, originalSize, targetBuffer) {
    const bufferSize = calcNormalizedBufferSize(originalSize);
    const gpuReadBuffer = device.createBuffer({
        size: bufferSize,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    try {
        const commandEncoder = device.createCommandEncoder();

        commandEncoder.copyBufferToBuffer(
            gpuBuffer /* source buffer */,
            0 /* source offset */,
            gpuReadBuffer /* destination buffer */,
            0 /* destination offset */,
            bufferSize /* size */,
        );
        device.queue.submit([commandEncoder.finish()]);
        await gpuReadBuffer.mapAsync(GPUMapMode.READ);

        const arrayBuffer = gpuReadBuffer.getMappedRange();
        setBufferData(targetBuffer, arrayBuffer, originalSize);
    } finally {
        gpuReadBuffer.destroy();
    }
}
