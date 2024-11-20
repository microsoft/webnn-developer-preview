import { $, getMode, getTime } from "../../assets/js/common_utils.js";

export let progressBarInner;
export let progressBarLabel;

export let loadProgress = 0;
export let onnxFetchProgress = 0;
export let onnxDataFetchProgress = 0;
export let onnxCompileProgress = 0;
export let onnxDataCompileProgress = 0;

export const updateOnnxCompileProgress = value => {
    onnxCompileProgress = value;
};
export const updateOnnxDataCompileProgress = value => {
    onnxDataCompileProgress = value;
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
            if (name.toLowerCase().indexOf("onnx.data") > -1) {
                onnxDataFetchProgress = 40.0;
                loadProgress =
                    onnxFetchProgress + onnxDataFetchProgress + onnxCompileProgress + onnxDataCompileProgress;
                updateProgressBar(loadProgress.toFixed(2));
                progressBarLabel.innerHTML = `Loading Phi-3 Mini ONNX data file · ${loadProgress.toFixed(2)}%`;
            } else {
                onnxFetchProgress = 40.0;
                loadProgress =
                    onnxFetchProgress + onnxDataFetchProgress + onnxCompileProgress + onnxDataCompileProgress;
                updateProgressBar(loadProgress.toFixed(2));
                progressBarLabel.innerHTML = `Loading Phi-3 Mini ONNX file · ${loadProgress.toFixed(2)}%`;
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

        if (name.toLowerCase().indexOf("onnx.data") > -1) {
            onnxDataFetchProgress = 0.4 * fetchProgress;
            loadProgress = onnxFetchProgress + onnxDataFetchProgress + onnxCompileProgress + onnxDataCompileProgress;
            updateProgressBar(loadProgress.toFixed(2));
            progressBarLabel.innerHTML = `Loading Phi-3 Mini ONNX data file · ${loadProgress.toFixed(2)}%`;
        } else {
            onnxFetchProgress = 0.4 * fetchProgress;
            loadProgress = onnxFetchProgress + onnxDataFetchProgress + onnxCompileProgress + onnxDataCompileProgress;
            updateProgressBar(loadProgress.toFixed(2));
            progressBarLabel.innerHTML = `Loading Phi-3 Mini ONNX file · ${loadProgress.toFixed(2)}%`;
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
