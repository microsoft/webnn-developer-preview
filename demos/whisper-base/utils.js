export const loadScript = async (id, url) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.onload = resolve;
        script.onerror = reject;
        script.id = id;
        script.src = url;
        if (url.startsWith('http')) {
            script.crossOrigin = 'anonymous';
        }
        document.body.append(script);
    })
}

export const removeElement = async (id) => {
    let el = document.querySelector(id);
    if (el) {
        el.parentNode.removeChild(el);
    }
}

export const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getQueryValue = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

export const getQueryVariable = (name, defaults) => {
    const query = window.location.search.substring(1);
    let vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        if (pair[0] == name) {
            return pair[1];
        }
    }
    return defaults;
}

export const randomNumber = () => {
    // generate 6 digital random number between 100, 000 and 999,999
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
}

const padNumber = (num, fill) => {
    let len = ('' + num).length;
    return Array(fill > len ? fill - len + 1 || 0 : 0).join(0) + num;
};

const getDateTime = () => {
    let date = new Date(),
        m = padNumber(date.getMonth() + 1, 2),
        d = padNumber(date.getDate(), 2),
        hour = padNumber(date.getHours(), 2),
        min = padNumber(date.getMinutes(), 2),
        sec = padNumber(date.getSeconds(), 2);
    return `${m}/${d} ${hour}:${min}:${sec}`;
};

const getTime = () => {
    let date = new Date(),
        hour = padNumber(date.getHours(), 2),
        min = padNumber(date.getMinutes(), 2),
        sec = padNumber(date.getSeconds(), 2);
    return `${hour}:${min}:${sec}`;
};

export const getOrtDevVersion = async () => {
    const response = await fetch('https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/');
    const htmlString = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    let selectElement = doc.querySelector('.path li');
    selectElement = doc.querySelector('select.versions.select-css');
    const options = Array.from(selectElement.querySelectorAll('option')).map(
        (option) => option.value
    );
    return options[0].replace('onnxruntime-web@', '');
};

export const webNnStatus = async () => {
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

export let progressBarInner;
export let progressBarLabel;

export let loadProgress = 0;
export let encoderFetchProgress = 0;
export let decoderFetchProgress = 0;
export let decoderCachedFetchProgress = 0;
export let encoderCompileProgress = 0;
export let decoderCompileProgress = 0;
export let decoderCachedCompileProgress = 0;

export const updateEncoderCompileProgress = (value) => { encoderCompileProgress = value; }
export const updateDecoderCompileProgress = (value) => { decoderCompileProgress = value; }
export const updateDecoderCachedCompileProgress = (value) => { decoderCachedCompileProgress = value; }
export const updateLoadProgress = (value) => { loadProgress = value; }

progressBarInner = document.getElementById("p-bar-inner");
progressBarLabel = document.getElementById("p-bar-label");

export const updateProgressBar = (progress) => {
    progressBarInner.style.width = `${progress}%`;
}

// Get model via Origin Private File System
export async function getModelOPFS(name, url, updateModel) {
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
            if (name.toLowerCase().indexOf('decoder_cached_') > -1) {
                decoderCachedFetchProgress = 40.00;
                loadProgress = encoderFetchProgress + decoderFetchProgress + encoderCompileProgress + decoderCompileProgress + decoderCachedFetchProgress + decoderCachedCompileProgress;
                updateProgressBar(loadProgress.toFixed(2));
                progressBarLabel.innerHTML = `Loading Whisper Base Decoder (KV-Cache) · ${loadProgress.toFixed(2)}%`;
            } else if (name.toLowerCase().indexOf('decoder_') > -1) {
                decoderFetchProgress = 40.00;
                loadProgress = encoderFetchProgress + decoderFetchProgress + encoderCompileProgress + decoderCompileProgress + decoderCachedFetchProgress + decoderCachedCompileProgress;
                updateProgressBar(loadProgress.toFixed(2));
                progressBarLabel.innerHTML = `Loading Whisper Base Decoder · ${loadProgress.toFixed(2)}%`;
            } else if (name.toLowerCase().indexOf('encoder_') > -1) {
                encoderFetchProgress = 10.00;
                loadProgress = encoderFetchProgress + decoderFetchProgress + encoderCompileProgress + decoderCompileProgress + decoderCachedFetchProgress + decoderCachedCompileProgress;
                updateProgressBar(loadProgress.toFixed(2));
                progressBarLabel.innerHTML = `Loading Whisper Base Encoder · ${loadProgress.toFixed(2)}%`;
            }

        return buffer;
        }
    } catch (e) {
        return await updateFile();
    }
}

async function readResponse(name, response) {
    const contentLength = response.headers.get('Content-Length');
    let total = parseInt(contentLength ?? '0');
    let buffer = new Uint8Array(total);
    let loaded = 0;

    const reader = response.body.getReader();
    async function read() {
        const { done, value } = await reader.read();
        if (done) return;

        let newLoaded = loaded + value.length;
        let fetchProgress = (newLoaded / contentLength) * 100;

        if (name.toLowerCase().indexOf('decoder_cached_') > -1) {
            decoderCachedFetchProgress = 0.40 * fetchProgress;
            loadProgress = encoderFetchProgress + decoderFetchProgress + encoderCompileProgress + decoderCompileProgress + decoderCachedFetchProgress + decoderCachedCompileProgress;
            updateProgressBar(loadProgress.toFixed(2));
            progressBarLabel.innerHTML = `Loading Whisper Base Decoder (KV-Cache) · ${loadProgress.toFixed(2)}%`;
        } else if (name.toLowerCase().indexOf('decoder_') > -1) {
            decoderFetchProgress = 0.40 * fetchProgress;
            loadProgress = encoderFetchProgress + decoderFetchProgress + encoderCompileProgress + decoderCompileProgress + decoderCachedFetchProgress + decoderCachedCompileProgress;
            updateProgressBar(loadProgress.toFixed(2));
            progressBarLabel.innerHTML = `Loading Whisper Base Decoder · ${loadProgress.toFixed(2)}%`;
        } else if (name.toLowerCase().indexOf('encoder') > -1) {
            encoderFetchProgress = 0.10 * fetchProgress;
            loadProgress = encoderFetchProgress + decoderFetchProgress + encoderCompileProgress + decoderCompileProgress + decoderCachedFetchProgress + decoderCachedCompileProgress;
            updateProgressBar(loadProgress.toFixed(2));
            progressBarLabel.innerHTML = `Loading Whisper Base Encoder · ${loadProgress.toFixed(2)}%`;
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

export function log(i) {
    console.log(i); 
    document.getElementById('status').innerHTML = 
    `
    <div class="item app">
        <div class="head">
            <div><span>App</span></div>
            <div>${getTime()}</div>
        </div>
        <div class="info">${i}</div>
    </div>
    ` +
    document.getElementById('status').innerHTML;
}

export function logUser(i) {
    console.log(i); 
    document.getElementById('status').innerHTML = 
    `
    <div class="item user">
        <div class="head">
            <div><span>User</span></div>
            <div>${getTime()}</div>
        </div>
        <div class="info">${i}</div>
    </div>
    ` +
    document.getElementById('status').innerHTML;
}

// ref: http://stackoverflow.com/questions/32633585/how-do-you-convert-to-half-floats-in-javascript
const toHalf = (function () {
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
            bits |= ((e == 255) ? 0 : 1) && (x & 0x007fffff);
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

export function float16ToNumber(input) {
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
    rest = (exponent === 0 ? 0 : rest);
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
    const fp32_array = new Float32Array(fp16_array.length);
    for (let i = 0; i < fp32_array.length; i++) {
        fp32_array[i] = float16ToNumber(fp16_array[i]);
    }
    return fp32_array;
}

// convert Float32Array to Uint16Array
export function convertToUint16Array(fp32_array) {
    const fp16_array = new Uint16Array(fp32_array.length);
    for (let i = 0; i < fp16_array.length; i++) {
        fp16_array[i] = toHalf(fp32_array[i]);
    }
    return fp16_array;
}

export function concatBuffer(buffer, newBuffer) {
    if (buffer == null) {
        return newBuffer;
    }
    let nextBuffer = new Float32Array(buffer.length + newBuffer.length);
    nextBuffer.set(buffer);
    nextBuffer.set(newBuffer, buffer.length);
    return nextBuffer;
}

export function concatBufferArray(bufferArray) {
    let concatedBuffer = null;
    for (let i = 0; i < bufferArray.length; i++) {
        concatedBuffer = concatBuffer(concatedBuffer, bufferArray[i]);
    }
    return concatedBuffer;
}