// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
//
// An example how to run Image Classification with webnn in onnxruntime-web.
//

import * as transformers from "../../assets/dist_transformers/1.22.0-dev.20250325/transformers.js";
import {
    $,
    $$,
    log,
    logError,
    getQueryValue,
    getWebnnStatus,
    updateQueryStringParameter,
    getMedian,
    getAverage,
    getMinimum,
    asyncErrorHandling,
    getMode,
    showCompatibleChromiumVersion,
} from "../../assets/js/common_utils.js";

transformers.env.backends.onnx.wasm.proxy = false;
transformers.env.backends.onnx.wasm.simd = true;
transformers.env.backends.onnx.wasm.numThreads = 1;
transformers.env.backends.onnx.wasm.wasmPaths = "../../assets/dist_transformers/1.22.0-dev.20250325/";

const useRemoteModels = location.hostname.includes("github.io");
transformers.env.allowRemoteModels = useRemoteModels;
transformers.env.allowLocalModels = !useRemoteModels;
log("[Transformer.js] env.allowRemoteModels: " + transformers.env.allowRemoteModels);
log("[Transformer.js] env.allowLocalModels: " + transformers.env.allowLocalModels);

let provider = "webnn";
let deviceType = "gpu";
let dataType = "fp16";
let modelId = "resnet-50";
let modelPath = "xenova/resnet-50";
let runs = 1;
let range, rangeValue, runSpan;
let backendLabels, modelLabels;
let label_webgpu, label_webnn_gpu, label_webnn_npu, label_mobilenetV2, label_resnet50, label_efficientnetLite4;
let uploadImage, label_uploadImage;
let imageUrl, image;
let classify;
let fullResult;
let first, average, median, best, throughput;
let status, circle, info;

let result;
let label1, label2, label3;
let score1, score2, score3;
let dataTypeSpan;
let modelIdSpan;
let latency, latencyDiv, indicator;
let title, device, badge;

const main = async () => {
    // xenova/resnet-50
    // webnn/mobilenet-v2
    // webnn/squeezenet-1.0
    // webnn/efficientnet-lite4

    fullResult.setAttribute("class", "none");
    result.setAttribute("class", "none");
    latencyDiv.setAttribute("class", "latency none");
    label_uploadImage.setAttribute("class", "disabled");
    uploadImage.disabled = true;
    classify.disabled = true;

    if (getQueryValue("model")) {
        modelId = getQueryValue("model");
        switch (modelId) {
            case "mobilenet-v2":
                modelPath = "webnn/mobilenet-v2";
                break;
            case "resnet-50":
                modelPath = "xenova/resnet-50";
                break;
            case "efficientnet-lite4":
                modelPath = "webnn/efficientnet-lite4";
                break;
            default:
                modelPath = "xenova/resnet-50";
                break;
        }
    }

    let device = "webnn-gpu";
    if (provider.toLowerCase() === "webnn") {
        device = `${provider}-${deviceType}`;
    } else {
        device = provider;
    }

    let options = {
        dtype: dataType,
        device: device, // 'webnn-gpu' and 'webnn-npu'
        session_options: {
            freeDimensionOverrides: {},
            context: {},
        },
    };

    if (modelId === "resnet-50") {
        options.session_options.freeDimensionOverrides = {
            batch_size: 1,
            num_channels: 3,
            height: 224,
            width: 224,
        };
    }

    modelIdSpan.innerHTML = dataType;
    dataTypeSpan.innerHTML = modelPath;

    try {
        log("[ONNX Runtime] Options: " + JSON.stringify(options));
        log(`[Transformer.js] Loading ${modelPath} and running image-classification pipeline`);

        const classifier = await transformers.pipeline("image-classification", modelPath, options);

        let [err, output] = await asyncErrorHandling(classifier(imageUrl, { topk: 3 }));

        if (err) {
            status.setAttribute("class", "red");
            info.innerHTML = err.message;
            logError(err.message);
        } else {
            if (getMode()) {
                log(JSON.stringify(transformers.getPerf()));
                let warmUp = transformers.getPerf().warmup;
                let averageInference = getAverage(transformers.getPerf().inference);
                let medianInference = getMedian(transformers.getPerf().inference);
                latency.innerHTML = medianInference.toFixed(2);
                first.innerHTML = warmUp.toFixed(2);
                average.innerHTML = averageInference;
                median.innerHTML = medianInference.toFixed(2);
                best.innerHTML = getMinimum(transformers.getPerf().inference);
                throughput.innerHTML = `${transformers.getPerf().throughput} FPS`;
                fullResult.setAttribute("class", "");
                latencyDiv.setAttribute("class", "latency");
            }

            label1.innerHTML = output[0].label;
            score1.innerText = output[0].score;
            label2.innerText = output[1].label;
            score2.innerText = output[1].score;
            label3.innerText = output[2].label;
            score3.innerText = output[2].score;
            result.setAttribute("class", "");
            label_uploadImage.setAttribute("class", "");
            uploadImage.disabled = false;
            classify.disabled = false;
            log(JSON.stringify(output));
            log(`[Transformer.js] Classifier completed`);
        }
    } catch (error) {
        log(`[Error] ${error}`);

        status.setAttribute("class", "red");
        info.innerHTML = `
            ${error}<br>
            Your device probably doesn't have a supported GPU.`;
        label_uploadImage.setAttribute("class", "disabled");
        uploadImage.disabled = true;
        classify.disabled = true;
        log(`[Error] ${error}`);
        log(`[Error] Your device probably doesn't have a supported GPU`);
    }
};

const checkWebNN = async () => {
    let webnnStatus = await getWebnnStatus();

    if (getQueryValue("provider")?.toLowerCase() === "webgpu") {
        circle.setAttribute("class", "none");
        info.innerHTML = "";
    }

    if (getQueryValue("provider")?.toLowerCase() === "webnn") {
        circle.setAttribute("class", "");
        if (webnnStatus.webnn) {
            status.setAttribute("class", "green");
            info.innerHTML = "WebNN supported";

            if (deviceType.toLowerCase() === "npu") {
                try {
                    await navigator.ml.createContext({ deviceType: "npu" });
                } catch (error) {
                    status.setAttribute("class", "red");
                    info.innerHTML = `
            ${error}<br>
            Your device probably doesn't have an AI processor (NPU) or the NPU driver is not successfully installed.`;
                    label_uploadImage.setAttribute("class", "disabled");
                    uploadImage.disabled = true;
                    classify.disabled = true;
                    log(`[Error] ${error}`);
                    log(
                        `[Error] Your device probably doesn't have an AI processor (NPU) or the NPU driver is not successfully installed`,
                    );
                }
            } else {
                label_uploadImage.setAttribute("class", "");
                uploadImage.disabled = false;
                classify.disabled = false;
            }
        } else {
            if (webnnStatus.error) {
                status.setAttribute("class", "red");
                info.innerHTML = `WebNN not supported: ${webnnStatus.error} <a id="webnn_na" href="../../install.html" title="WebNN Installation Guide">WebNN Installation Guide</a>`;
                logError(`[Error] ${webnnStatus.error}`);
                indicator.innerHTML = `<a href="../../install.html" title="WebNN Installation Guide">Please set up WebNN at first</a>`;
            } else {
                status.setAttribute("class", "red");
                info.innerHTML = "WebNN not supported";
                logError(`[Error] WebNN not supported`);
            }
            label_uploadImage.setAttribute("class", "disabled");
            uploadImage.disabled = true;
            classify.disabled = true;
        }
    }
};

const initModelSelector = () => {
    provider = getQueryValue("provider").toLowerCase();
    deviceType = getQueryValue("devicetype").toLowerCase();
    if (provider && deviceType) {
        backendLabels.forEach(label => {
            label.setAttribute("class", "btn");
        });
        if (provider === "webgpu" && deviceType === "gpu") {
            label_webgpu.setAttribute("class", "btn active");
        } else if (provider === "webnn" && deviceType === "gpu") {
            label_webnn_gpu.setAttribute("class", "btn active");
        } else if (provider === "webnn" && deviceType === "npu") {
            label_webnn_npu.setAttribute("class", "btn active");
        }
    }

    if (getQueryValue("model")) {
        modelLabels.forEach(label => {
            label.setAttribute("class", "btn");
        });
        if (getQueryValue("model").toLowerCase() === "mobilenet-v2") {
            label_mobilenetV2.setAttribute("class", "btn active");
        } else if (getQueryValue("model").toLowerCase() === "resnet-50") {
            label_resnet50.setAttribute("class", "btn active");
        } else if (getQueryValue("model").toLowerCase() === "efficientnet-lite4") {
            label_efficientnetLite4.setAttribute("class", "btn active");
        }
    }
};

const controls = async () => {
    const getRange = () => {
        rangeValue.innerHTML = range.value;
        runs = parseInt(range.value);
        if (runs > 1) {
            runSpan.innerHTML = "runs";
        } else {
            runSpan.innerHTML = "run";
        }
        let currentUrl = window.location.href;
        let updatedUrl = updateQueryStringParameter(currentUrl, "run", runs);
        window.history.pushState({}, "", updatedUrl);
    };

    range.addEventListener("input", getRange, false);

    let backendBtns = $("#backendBtns");
    let modelBtns = $("#modelBtns");

    const updateBackend = e => {
        backendLabels.forEach(label => {
            label.setAttribute("class", "btn");
        });
        e.target.parentNode.setAttribute("class", "btn active");
        if (e.target.id.trim() === "webgpu") {
            let currentUrl = window.location.href;
            let updatedUrl = updateQueryStringParameter(currentUrl, "provider", "webgpu");
            window.history.pushState({}, "", updatedUrl);
            currentUrl = window.location.href;
            updatedUrl = updateQueryStringParameter(currentUrl, "devicetype", "gpu");
            window.history.pushState({}, "", updatedUrl);
            provider = "webgpu";
            deviceType = "gpu";
        } else if (e.target.id.trim() === "webnn_gpu") {
            let currentUrl = window.location.href;
            let updatedUrl = updateQueryStringParameter(currentUrl, "provider", "webnn");
            window.history.pushState({}, "", updatedUrl);
            currentUrl = window.location.href;
            updatedUrl = updateQueryStringParameter(currentUrl, "devicetype", "gpu");
            window.history.pushState({}, "", updatedUrl);
            provider = "webnn";
            deviceType = "gpu";
        } else if (e.target.id.trim() === "webnn_npu") {
            let currentUrl = window.location.href;
            let updatedUrl = updateQueryStringParameter(currentUrl, "provider", "webnn");
            window.history.pushState({}, "", updatedUrl);
            currentUrl = window.location.href;
            updatedUrl = updateQueryStringParameter(currentUrl, "devicetype", "npu");
            window.history.pushState({}, "", updatedUrl);
            provider = "webgpu";
            deviceType = "npu";
        }

        updateUi();
    };

    const updateModel = e => {
        modelLabels.forEach(label => {
            label.setAttribute("class", "btn");
        });
        e.target.parentNode.setAttribute("class", "btn active");
        if (e.target.id.trim() === "mobilenet-v2") {
            let currentUrl = window.location.href;
            let updatedUrl = updateQueryStringParameter(currentUrl, "model", "mobilenet-v2");
            window.history.pushState({}, "", updatedUrl);
            modelId = "mobilenet-v2";
        } else if (e.target.id.trim() === "resnet-50") {
            let currentUrl = window.location.href;
            let updatedUrl = updateQueryStringParameter(currentUrl, "model", "resnet-50");
            window.history.pushState({}, "", updatedUrl);
            modelId = "resnet-50";
        } else if (e.target.id.trim() === "efficientnet-lite4") {
            let currentUrl = window.location.href;
            let updatedUrl = updateQueryStringParameter(currentUrl, "model", "efficientnet-lite4");
            window.history.pushState({}, "", updatedUrl);
            modelId = "efficientnet-lite4";
        }
        updateUi();
    };

    backendBtns.addEventListener("change", updateBackend, false);
    modelBtns.addEventListener("change", updateModel, false);
};

const badgeUpdate = () => {
    if (getQueryValue("provider")?.toLowerCase() === "webgpu") {
        title.innerHTML = "WebGPU";
        provider = "webgpu";
        deviceType = "gpu";
        device.innerHTML = "GPU";
        badge.setAttribute("class", "gpu");
    } else if (getQueryValue("provider")?.toLowerCase() === "wasm") {
        title.innerHTML = "Wasm";
        provider = "wasm";
        deviceType = "cpu";
        device.innerHTML = "CPU";
        badge.setAttribute("class", "cpu");
    } else {
        title.innerHTML = "WebNN";
        provider = "webnn";
        deviceType = "gpu";
        device.innerHTML = "GPU";
        badge.setAttribute("class", "gpu");
        if (getQueryValue("devicetype")?.toLowerCase() === "cpu") {
            deviceType = "cpu";
            device.innerHTML = "CPU";
            badge.setAttribute("class", "cpu");
        } else if (getQueryValue("devicetype")?.toLowerCase() === "npu") {
            deviceType = "npu";
            device.innerHTML = "NPU";
            badge.setAttribute("class", "npu");
        } else {
            deviceType = "gpu";
            device.innerHTML = "GPU";
            badge.setAttribute("class", "gpu");
        }
    }
};

const updateUi = async () => {
    if (getQueryValue("run")) {
        runs = parseInt(getQueryValue("run"));
        range.value = runs;
        rangeValue.innerHTML = runs;
    } else {
        runs = 1;
        range.value = 1;
        rangeValue.innerHTML = "1";
    }

    if (runs > 1) {
        runSpan.innerHTML = "runs";
    } else {
        runSpan.innerHTML = "run";
    }

    if (getQueryValue("model")) {
        modelId = getQueryValue("model");
    }

    initModelSelector();
    badgeUpdate();
    log(`[Config] Demo config updated · ${modelId} · ${provider} · ${deviceType}`);
    await checkWebNN();
    console.log(provider);
    console.log(deviceType);
    console.log(modelId);
    console.log(runs);
};

const changeImage = async () => {
    let file = uploadImage.files[0];
    if (file) {
        image.src = URL.createObjectURL(file);
        imageUrl = URL.createObjectURL(file);
    }
    await main();
};

const ui = async () => {
    imageUrl = "./static/tiger.jpg";
    if (!(getQueryValue("provider") && getQueryValue("model") && getQueryValue("devicetype") && getQueryValue("run"))) {
        let url = "?provider=webnn&devicetype=gpu&model=resnet-50&run=5";
        location.replace(url);
    }

    status = $("#webnnstatus");
    circle = $("#circle");
    info = $("#info");
    range = $("#range");
    rangeValue = $(".rangevalue");
    runSpan = $("#run-span");
    backendLabels = $$(".backends label");
    modelLabels = $$(".models label");
    label_webgpu = $("#label_webgpu");
    label_webnn_gpu = $("#label_webnn_gpu");
    label_webnn_npu = $("#label_webnn_npu");
    label_mobilenetV2 = $("#label_mobilenet-v2");
    label_resnet50 = $("#label_resnet-50");
    label_efficientnetLite4 = $("#label_efficientnet-lite4");
    image = $("#image");
    uploadImage = $("#upload-image");
    label_uploadImage = $("#label_upload-image");
    classify = $("#classify-image");
    fullResult = $("#full-result");
    first = $("#first");
    average = $("#average");
    median = $("#median");
    best = $("#best");
    throughput = $("#throughput");
    label1 = $("#label1");
    label2 = $("#label2");
    label3 = $("#label3");
    score1 = $("#score1");
    score2 = $("#score2");
    score3 = $("#score3");
    result = $("#result");
    title = $("#title");
    device = $("#device");
    badge = $("#badge");
    indicator = $("#indicator");
    modelIdSpan = $("#data-type");
    dataTypeSpan = $("#model-id");
    latency = $("#latency");
    latencyDiv = $(".latency");
    fullResult.setAttribute("class", "none");
    result.setAttribute("class", "none");
    latencyDiv.setAttribute("class", "latency none");
    controls();
    updateUi();
    showCompatibleChromiumVersion("image-classification");
    const transformersJs = $("#ortversion");
    transformersJs.innerHTML = `<a href="https://huggingface.co/docs/transformers.js/en/index">Transformer.js</a>`;

    console.log(`${provider} ${deviceType} ${modelId} ${runs}`);

    classify.addEventListener(
        "click",
        async () => {
            await main();
        },
        false,
    );

    uploadImage.addEventListener(
        "change",
        async () => {
            await changeImage();
        },
        false,
    );
};

document.addEventListener("DOMContentLoaded", ui, false);
