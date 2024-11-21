import { $, getMode, getTime } from "../../assets/js/common_utils.js";

export let progressBarInner;
export let progressBarLabel;

export let loadProgress = 0;
export let encoderFetchProgress = 0;
export let decoderFetchProgress = 0;
export let decoderCachedFetchProgress = 0;
export let encoderCompileProgress = 0;
export let decoderCompileProgress = 0;
export let decoderCachedCompileProgress = 0;

export const updateEncoderCompileProgress = value => {
    encoderCompileProgress = value;
};
export const updateDecoderCompileProgress = value => {
    decoderCompileProgress = value;
};
export const updateDecoderCachedCompileProgress = value => {
    decoderCachedCompileProgress = value;
};
export const updateLoadProgress = value => {
    loadProgress = value;
};

progressBarInner = $("#p-bar-inner");
progressBarLabel = $("#p-bar-label");

export const updateProgressBar = progress => {
    progressBarInner.style.width = `${progress}%`;
};

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
            if (name.toLowerCase().indexOf("decoder_cached_") > -1) {
                decoderCachedFetchProgress = 40.0;
                loadProgress =
                    encoderFetchProgress +
                    decoderFetchProgress +
                    encoderCompileProgress +
                    decoderCompileProgress +
                    decoderCachedFetchProgress +
                    decoderCachedCompileProgress;
                updateProgressBar(loadProgress.toFixed(2));
                progressBarLabel.innerHTML = `Loading Whisper Base Decoder (KV-Cache) · ${loadProgress.toFixed(2)}%`;
            } else if (name.toLowerCase().indexOf("decoder_") > -1) {
                decoderFetchProgress = 40.0;
                loadProgress =
                    encoderFetchProgress +
                    decoderFetchProgress +
                    encoderCompileProgress +
                    decoderCompileProgress +
                    decoderCachedFetchProgress +
                    decoderCachedCompileProgress;
                updateProgressBar(loadProgress.toFixed(2));
                progressBarLabel.innerHTML = `Loading Whisper Base Decoder · ${loadProgress.toFixed(2)}%`;
            } else if (name.toLowerCase().indexOf("encoder_") > -1) {
                encoderFetchProgress = 10.0;
                loadProgress =
                    encoderFetchProgress +
                    decoderFetchProgress +
                    encoderCompileProgress +
                    decoderCompileProgress +
                    decoderCachedFetchProgress +
                    decoderCachedCompileProgress;
                updateProgressBar(loadProgress.toFixed(2));
                progressBarLabel.innerHTML = `Loading Whisper Base Encoder · ${loadProgress.toFixed(2)}%`;
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
        let fetchProgress = (newLoaded / contentLength) * 100;

        if (name.toLowerCase().indexOf("decoder_cached_") > -1) {
            decoderCachedFetchProgress = 0.4 * fetchProgress;
            loadProgress =
                encoderFetchProgress +
                decoderFetchProgress +
                encoderCompileProgress +
                decoderCompileProgress +
                decoderCachedFetchProgress +
                decoderCachedCompileProgress;
            updateProgressBar(loadProgress.toFixed(2));
            progressBarLabel.innerHTML = `Loading Whisper Base Decoder (KV-Cache) · ${loadProgress.toFixed(2)}%`;
        } else if (name.toLowerCase().indexOf("decoder_") > -1) {
            decoderFetchProgress = 0.4 * fetchProgress;
            loadProgress =
                encoderFetchProgress +
                decoderFetchProgress +
                encoderCompileProgress +
                decoderCompileProgress +
                decoderCachedFetchProgress +
                decoderCachedCompileProgress;
            updateProgressBar(loadProgress.toFixed(2));
            progressBarLabel.innerHTML = `Loading Whisper Base Decoder · ${loadProgress.toFixed(2)}%`;
        } else if (name.toLowerCase().indexOf("encoder") > -1) {
            encoderFetchProgress = 0.1 * fetchProgress;
            loadProgress =
                encoderFetchProgress +
                decoderFetchProgress +
                encoderCompileProgress +
                decoderCompileProgress +
                decoderCachedFetchProgress +
                decoderCachedCompileProgress;
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
    if (getMode()) {
        $("#log").innerHTML =
            `
        <div class="item app">
            <div class="head">
                <div><span>App</span></div>
                <div>${getTime()}</div>
            </div>
            <div class="info">${i}</div>
        </div>
        ` + $("#log").innerHTML;
    } else {
        $("#log").innerHTML =
            `
        <div class="item app">
            <div class="head">
                <div><span>App</span></div>
                <div></div>
            </div>
            <div class="info">${i}</div>
        </div>
        ` + $("#log").innerHTML;
    }
}

export const logError = i => {
    console.error(i);
    if (getMode()) {
        $("#log").innerHTML =
            `
    <div class="item app">
        <div class="head">
            <div><span>App</span></div>
            <div>${getTime()}</div>
        </div>
        <div class="info">${i}</div>
    </div>
    ` + $("#log").innerHTML;
    } else {
        $("#log").innerHTML =
            `
        <div class="item app">
            <div class="head">
                <div><span>App</span></div>
                <div></div>
            </div>
            <div class="info">${i}</div>
        </div>
        ` + $("#log").innerHTML;
    }
};

export function logUser(i) {
    console.log(i);
    if (getMode()) {
        $("#log").innerHTML =
            `
        <div class="item user">
            <div class="head">
                <div><span>User</span></div>
                <div>${getTime()}</div>
            </div>
            <div class="info">${i}</div>
        </div>
        ` + $("#log").innerHTML;
    } else {
        $("#log").innerHTML =
            `
        <div class="item user">
            <div class="head">
                <div><span>User</span></div>
                <div></div>
            </div>
            <div class="info">${i}</div>
        </div>
        ` + $("#log").innerHTML;
    }
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
