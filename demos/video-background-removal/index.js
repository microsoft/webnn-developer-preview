// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
//
// An example how to run Video Background Removal with webnn in onnxruntime-web.
//
import {
  env,
  AutoModel,
  AutoProcessor,
  RawImage,
} from "../../assets/dist_transformers/transformers.js";
import {
  setupORT,
  log,
  getQueryValue,
  webNnStatus,
} from "../../assets/js/common_utils.js";

env.allowRemoteModels = true;
env.backends.onnx.wasm.proxy = false;
env.backends.onnx.wasm.simd = true;
env.backends.onnx.wasm.numThreads = 1;

let provider = "webnn";
let deviceType = "gpu";
let dataType = "fp32";

let latency;
let container;
let dataTypeSpan;
let canvas;
let outputCanvas;
let video;
let sizeSlider;
let sizeLabel;
let scaleSlider;
let scaleLabel;

const setStreamSize = (width, height) => {
  video.width = canvas.width = Math.round(width);
  video.height = canvas.height = Math.round(height);
};

const main = async () => {
  // Load model and processor
  const model_id = "Xenova/modnet";
  let model;
  let options = {
    device: provider,
    dtype: dataType,
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
      freeDimensionOverrides: { batch_size: 1, height: 256, width: 320 },
      logSeverityLevel: 0,
    };
  }
  
  try {
    log("[ONNX Runtime] Options: " + JSON.stringify(options));
    log("[Load] Loading model and run processor");
    model = await AutoModel.from_pretrained(model_id, options);
  } catch (err) {
    log(`[Error] ${err}`);
  }

  const processor = await AutoProcessor.from_pretrained(model_id);

  // Set up controls
  let size = 256;
  processor.feature_extractor.size = { shortest_edge: size };
  sizeSlider.addEventListener("input", () => {
    size = Number(sizeSlider.value);
    processor.feature_extractor.size = { shortest_edge: size };
    sizeLabel.textContent = size;
  });
  sizeSlider.disabled = false;

  let scale = 0.5;
  scaleSlider.addEventListener("input", () => {
    scale = Number(scaleSlider.value);
    setStreamSize(video.videoWidth * scale, video.videoHeight * scale);
    scaleLabel.textContent = scale;
  });
  scaleSlider.disabled = false;

  log("[Processor] Ready to process video stream");

  let isProcessing = false;
  let previousTime;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const outputContext = outputCanvas.getContext("2d", {
    willReadFrequently: true,
  });

  function updateCanvas() {
    const { width, height } = canvas;

    if (!isProcessing) {
      isProcessing = true;
      (async function () {
        // Read the current frame from the video
        context.drawImage(video, 0, 0, width, height);
        const currentFrame = context.getImageData(0, 0, width, height);
        const image = new RawImage(currentFrame.data, width, height, 4);

        // Pre-process image
        const inputs = await processor(image);

        // Predict alpha matte
        if(model) {
          const { output } = await model({ input: inputs.pixel_values });

          const mask = await RawImage.fromTensor(
            output[0].mul(255).to("uint8")
          ).resize(width, height);

          // Update alpha channel
          const outPixelData = currentFrame;
          for (let i = 0; i < mask.data.length; ++i) {
            outPixelData.data[4 * i + 3] = mask.data[i];
          }
          outputContext.putImageData(outPixelData, 0, 0);

          if (previousTime !== undefined) {
            const fps = 1000 / (performance.now() - previousTime);
            latency.innerHTML = `${fps.toFixed(2)}`;
          }
          previousTime = performance.now();

          isProcessing = false;
        }
      })();
    }

    window.requestAnimationFrame(updateCanvas);
  }

  // Start the video stream
  navigator.mediaDevices
    .getUserMedia(
      { video: true } // Ask for video
    )
    .then((stream) => {
      // Set up the video and canvas elements.
      video.srcObject = stream;
      video.play();

      const videoTrack = stream.getVideoTracks()[0];
      const { width, height } = videoTrack.getSettings();

      setStreamSize(width * scale, height * scale);

      // Set container width and height depending on the image aspect ratio
      const ar = width / height;
      const [cw, ch] = ar > 720 / 405 ? [720, 720 / ar] : [405 * ar, 405];
      container.style.width = `${cw}px`;
      container.style.height = `${ch}px`;

      // Start the animation loop
      setTimeout(updateCanvas, 50);
    })
    .catch((error) => {
      log(`[Error] ${error.message}`);
    });
};

const checkWebNN = async () => {
  let status = document.querySelector("#webnnstatus");
  let circle = document.querySelector("#circle");
  let info = document.querySelector("#info");
  let webnnStatus = await webNnStatus();

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

  if (
    getQueryValue("provider") &&
    getQueryValue("provider").toLowerCase().indexOf("webnn") == -1
  ) {
    circle.setAttribute("class", "none");
    info.innerHTML = "";
  }
};

const ui = async () => {
  latency = document.getElementById("latency");
  container = document.getElementById("container");
  dataTypeSpan = document.querySelector('#data-type');
  dataTypeSpan.innerHTML = dataType;
  canvas = document.getElementById("canvas");
  video = document.getElementById("video");
  outputCanvas = document.getElementById("output-canvas");
  sizeSlider = document.getElementById("size");
  sizeLabel = document.getElementById("size-value");
  scaleSlider = document.getElementById("scale");
  scaleLabel = document.getElementById("scale-value");
  const title = document.querySelector("#title");

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

  await setupORT();
  log(`[ONNX Runtime] Execution Provider loaded · ${provider.toUpperCase()}`);

  await checkWebNN();
  await main();
};

document.addEventListener("DOMContentLoaded", ui, false);
