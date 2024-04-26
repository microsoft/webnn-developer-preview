// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
//
// An example how to run Image Classification with webnn in onnxruntime-web.
//
import {
  env,
  pipeline
} from "../../assets/dist_transformers/original/transformers.js";
import {
  setupORT,
  log,
  getQueryValue,
  webNnStatus,
  updateQueryStringParameter,
  getMedian,
  getAverage
} from "../../assets/js/common_utils.js";

env.allowRemoteModels = true;
env.backends.onnx.wasm.proxy = false;
env.backends.onnx.wasm.simd = true;
env.backends.onnx.wasm.numThreads = 1;

let provider = "webnn";
let deviceType = "gpu";
let dataType = "fp16";
let modelId = "resnet-50";
let modelPath = "Xenova/resnet-50";
let runs = 1;
let range, rangeValue, runSpan;
let backendLabels, modelLabels;
let label_webgpu, label_webnn_gpu, label_webnn_npu, label_mobilenetV2, label_resnet50;
let classify;
let fullResult;
let first, average, median;

let result;
let label1, label2, label3;
let score1, score2, score3;
let dataTypeSpan;
let modelIdSpan;
let latency, latencyDiv;

const main = async () => {
  // Xenova/resnet-50
  // webnn/mobilenet-v2
  // webnn/squeezenet-1.0
  // webnn/efficientnet-lite4

  fullResult.setAttribute("class", "none");
  result.setAttribute("class", "none");
  latencyDiv.setAttribute("class", "latency none");
  classify.disabled = true;

  let options = {
    device: provider,
    dtype: dataType,
    session_options: {
      executionProviders: [
        {
          name: provider,
          deviceType: deviceType,
          powerPreference: "default",
          preferredLayout: "NHWC",
        },
      ],
      freeDimensionOverrides: {},
      logSeverityLevel: 0,
    }
  };
  if (provider === "webnn") {
    options.session_options = {
      executionProviders: [
        {
          name: provider,
          deviceType: deviceType,
          powerPreference: "default",
          preferredLayout: "NHWC",
        },
      ],
      logSeverityLevel: 0,
    };
  }

  if (getQueryValue("model")) {
    modelId = getQueryValue("model");
    switch (modelId) {
      case "mobilenet-v2":
        modelPath = "webnn/mobilenet-v2";
        break;
      case "resnet-50":
        modelPath = "Xenova/resnet-50";
        options.session_options.freeDimensionOverrides = { batch_size: 1, num_channels: 3, height: 224, width: 224 };
        break;
      default:
        modelPath = "Xenova/resnet-50";
        break;
      // webnn/squeezenet-1.0
      // webnn/efficientnet-lite4
    }
  }

  modelIdSpan.innerHTML = ` · ${dataType}`;
  dataTypeSpan.innerHTML = ` · ${modelPath}`;

  try {
    log("[ONNX Runtime] Options: " + JSON.stringify(options));
    log(`[Transformer.js] Loading ${modelPath} and running image-classification pipeline`);
    const classifier = await pipeline("image-classification", modelPath, options);
    const url = "./static/tiger.jpg";
    
    let runFirst = 0;
    let runArray = [];
    let output;
    for(let i=0; i< 1 + runs; i++) { 
      let start = performance.now();
      output = await classifier(url, { topk: 3 });
      let localPerf = performance.now() - start;
      if(i > 0) {
        runArray.push(localPerf);
      } else {
        runFirst = localPerf;
      }
    }

    log(`[Transformer.js] Classifier completed`);
    log(`First run: ${runFirst}ms`);
    log(`${runs} runs: ${runArray}`);
    log(JSON.stringify(output));
    
    latency.innerHTML = getAverage(runArray);
    first.innerHTML = runFirst.toFixed(2);
    average.innerHTML = getAverage(runArray);
    median.innerHTML = getMedian(runArray).toFixed(2);

    fullResult.setAttribute("class", "");
    latencyDiv.setAttribute("class", "latency");

    label1.innerHTML = output[0].label;
    score1.innerText = output[0].score;
    label2.innerText = output[1].label;
    score2.innerText = output[1].score;
    label3.innerText = output[2].label;
    score3.innerText = output[2].score;
    result.setAttribute("class", "");
    classify.disabled = false;
  } catch (err) {
    log(`[Error] ${err}`);
  }
};

const checkWebNN = async () => {
  let status = document.querySelector("#webnnstatus");
  let circle = document.querySelector("#circle");
  let info = document.querySelector("#info");
  let webnnStatus = await webNnStatus();

  if (
    getQueryValue("provider") &&
    getQueryValue("provider").toLowerCase().indexOf("webgpu") > -1
  ) {
    circle.setAttribute("class", "none");
    info.innerHTML = "";
  } 

  if (
    getQueryValue("provider") &&
    getQueryValue("provider").toLowerCase().indexOf("webnn") > -1
  ) {
    circle.setAttribute("class", "");
    if (webnnStatus.webnn) {
      status.setAttribute("class", "green");
      info.innerHTML = "WebNN supported";
    } else {
      if (webnnStatus.error) {
        status.setAttribute("class", "red");
        info.innerHTML = "WebNN not supported: " + webnnStatus.error;
      } else {
        status.setAttribute("class", "red");
        info.innerHTML = "WebNN not supported";
      }
    }
  }
};

const initModelSelector = () => {
  if(getQueryValue("provider") && getQueryValue("devicetype")) {
    backendLabels.forEach((label) => {
      label.setAttribute("class", "btn");
    });
    if(getQueryValue("provider").toLowerCase() === 'webgpu' && getQueryValue("devicetype").toLowerCase() === 'gpu') {
      label_webgpu.setAttribute("class", "btn active");
    } else if(getQueryValue("provider").toLowerCase() === 'webnn' && getQueryValue("devicetype").toLowerCase() === 'gpu') {
      label_webnn_gpu.setAttribute("class", "btn active");
    } else if(getQueryValue("provider").toLowerCase() === 'webnn' && getQueryValue("devicetype").toLowerCase() === 'npu') {
      label_webnn_npu.setAttribute("class", "btn active");
    }
  }

  if(getQueryValue("model")) {
    modelLabels.forEach((label) => {
      label.setAttribute("class", "btn");
    });
    if(getQueryValue("model").toLowerCase() === 'mobilenet-v2') {
      label_mobilenetV2.setAttribute("class", "btn active");
    } else if(getQueryValue("model").toLowerCase() === 'resnet-50') {
      label_resnet50.setAttribute("class", "btn active");
    }
  }
}

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

  let backendBtns = document.querySelector("#backendBtns");
  let modelBtns = document.querySelector("#modelBtns");

  const updateBackend = (e) => {
    backendLabels.forEach((label) => {
      label.setAttribute("class", "btn");
    });
    e.target.parentNode.setAttribute("class", "btn active");
    if (e.target.id.trim() === "webgpu") {
      let currentUrl = window.location.href;
      let updatedUrl = updateQueryStringParameter(
        currentUrl,
        "provider",
        "webgpu"
      );
      window.history.pushState({}, "", updatedUrl);
      currentUrl = window.location.href;
      updatedUrl = updateQueryStringParameter(currentUrl, "devicetype", "gpu");
      window.history.pushState({}, "", updatedUrl);
      provider = "webgpu";
      deviceType = "gpu";
    } else if (e.target.id.trim() === "webnn_gpu") {
      let currentUrl = window.location.href;
      let updatedUrl = updateQueryStringParameter(
        currentUrl,
        "provider",
        "webnn"
      );
      window.history.pushState({}, "", updatedUrl);
      currentUrl = window.location.href;
      updatedUrl = updateQueryStringParameter(currentUrl, "devicetype", "gpu");
      window.history.pushState({}, "", updatedUrl);
      provider = "webnn";
      deviceType = "gpu";
    } else if (e.target.id.trim() === "webnn_npu") {
      let currentUrl = window.location.href;
      let updatedUrl = updateQueryStringParameter(
        currentUrl,
        "provider",
        "webnn"
      );
      window.history.pushState({}, "", updatedUrl);
      currentUrl = window.location.href;
      updatedUrl = updateQueryStringParameter(currentUrl, "devicetype", "npu");
      window.history.pushState({}, "", updatedUrl);
      provider = "webgpu";
      deviceType = "npu";
    }

    console.log(provider);
    console.log(deviceType);
    console.log(modelId);
    console.log(runs);
    updateUi();
  };

  const updateModel = (e) => {
    modelLabels.forEach((label) => {
      label.setAttribute("class", "btn");
    });
    e.target.parentNode.setAttribute("class", "btn active");
    if (e.target.id.trim() === "mobilenet-v2") {
      let currentUrl = window.location.href;
      let updatedUrl = updateQueryStringParameter(
        currentUrl,
        "model",
        "mobilenet-v2"
      );
      window.history.pushState({}, "", updatedUrl);
      modelId = "mobilenet-v2";
    } else if (e.target.id.trim() === "resnet-50") {
      let currentUrl = window.location.href;
      let updatedUrl = updateQueryStringParameter(
        currentUrl,
        "model",
        "resnet-50"
      );
      window.history.pushState({}, "", updatedUrl);
      modelId = "resnet-50";
    }
    updateUi();
  };

  backendBtns.addEventListener("change", updateBackend, false);
  modelBtns.addEventListener("change", updateModel, false);
};

const badgeUpdate = () => {
  if (
    getQueryValue("provider") &&
    getQueryValue("provider").toLowerCase().indexOf("webgpu") > -1
  ) {
    title.innerHTML = "WebGPU";
    provider = "webgpu";
    deviceType = "gpu";
    device.innerHTML = "GPU";
    badge.setAttribute("class", "gpu");
  } else if (
    getQueryValue("provider") &&
    getQueryValue("provider").toLowerCase().indexOf("wasm") > -1
  ) {
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
    if (
      getQueryValue("devicetype") &&
      getQueryValue("devicetype").toLowerCase() === "cpu"
    ) {
      deviceType = "cpu";
      device.innerHTML = "CPU";
      badge.setAttribute("class", "cpu");
    } else if (
      getQueryValue("devicetype") &&
      getQueryValue("devicetype").toLowerCase() === "npu"
    ) {
      deviceType = "npu";
      device.innerHTML = "NPU";
      badge.setAttribute("class", "npu");
    } else {
      deviceType = "gpu";
      device.innerHTML = "GPU";
      badge.setAttribute("class", "gpu");
    }
  }
}

const updateUi = async () => {
  if (getQueryValue("run")) {
    runs = parseInt(getQueryValue("run"));
    range.value = runs;
    rangeValue.innerHTML = runs;
  } else {
    runs = 1;
    range.value = 1;
    rangeValue.innerHTML = '1';
  }

  if (runs > 1) {
    runSpan.innerHTML = "runs";
  } else {
    runSpan.innerHTML = "run";
  }

  initModelSelector();
  badgeUpdate();
  await checkWebNN();
  console.log(provider);
  console.log(deviceType);
  console.log(modelId);
  console.log(runs);
  log(
    `[Config] Demo config updated · ${modelId} · ${provider} · ${deviceType}`
  );
}

const ui = async () => {
  if (
    !(
      getQueryValue("provider") &&
      getQueryValue("model") &&
      getQueryValue("devicetype") &&
      getQueryValue("run")
    )
  ) {
    let url = "?provider=webnn&devicetype=gpu&model=resnet-50&run=5";
    location.replace(url);
  }

  range = document.querySelector('#range');
  rangeValue = document.querySelector(".rangevalue");
  runSpan = document.querySelector("#run-span");
  backendLabels = document.querySelectorAll(".backends label");
  modelLabels = document.querySelectorAll(".models label");
  label_webgpu = document.querySelector('#label_webgpu');
  label_webnn_gpu = document.querySelector('#label_webnn_gpu');
  label_webnn_npu = document.querySelector('#label_webnn_npu');
  label_mobilenetV2 = document.querySelector('#label_mobilenet-v2');
  label_resnet50 = document.querySelector('#label_resnet-50');
  classify = document.querySelector("#classify-image");
  fullResult = document.querySelector("#full-result");
  first = document.querySelector("#first");
  average = document.querySelector("#average");
  median = document.querySelector("#median");
  label1 = document.querySelector("#label1");
  label2 = document.querySelector("#label2");
  label3 = document.querySelector("#label3");
  score1 = document.querySelector("#score1");
  score2 = document.querySelector("#score2");
  score3 = document.querySelector("#score3");
  result = document.querySelector("#result");
  modelIdSpan = document.querySelector("#data-type");
  dataTypeSpan = document.querySelector("#model-id");
  latency = document.querySelector("#latency");
  latencyDiv = document.querySelector(".latency");
  fullResult.setAttribute("class", "none");
  result.setAttribute("class", "none");
  latencyDiv.setAttribute("class", "latency none");
  controls();
  updateUi();
  await setupORT();
  log(
    `[ONNX Runtime] Execution Provider loaded`
  );
  console.log(`${provider} ${deviceType} ${modelId} ${runs}`);

  classify.addEventListener('click', async () => {
    await main();
  }, false);
};

document.addEventListener("DOMContentLoaded", ui, false);
