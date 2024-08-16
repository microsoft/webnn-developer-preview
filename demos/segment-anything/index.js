// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
//
// An example how to run segment-anything with webnn in onnxruntime-web.
//

// the image size on canvas
const MAX_WIDTH = 480;
const MAX_HEIGHT = 480;

// the image size supported by the model
const MODEL_WIDTH = 1024;
const MODEL_HEIGHT = 1024;

const MODELS = {
  sam_b: [
    {
      name: "SAM ViT-B Encoder (FP16)",
      url: "sam_vit_b_01ec64.encoder-fp16.onnx",
      size: "171MB",
    },
    {
      name: "SAM ViT-B Decoder (FP16)",
      url: "sam_vit_b_01ec64.decoder-fp16.onnx",
      size: "15.7MB",
    },
  ],
  sam_b_int8: [
    {
      name: "SAM ViT-B Encoder (INT8)",
      url: "sam_vit_b-encoder-int8.onnx",
      size: "95.6MB",
    },
    {
      name: "SAM ViT-B Decoder (INT8)",
      url: "sam_vit_b-decoder-int8.onnx",
      size: "4.52MB",
    },
  ],
};

const config = getConfig();

let canvas;
let placeholder;
let actionBar;
let filein;
let cut;
let clear;
let progressBar;
let progressInfo;
let decoder_latency;
let unit;
let samDecoderIndicator;

let progress = 0;
let samEncoderFetchProgress = 0;
let samDecoderFetchProgress = 0;
let samEncoderCompileProgress = 0;
let samDecoderCompileProgress = 0;

let image_embeddings;
let points = [];
let labels = [];
let imageImageData;
let isClicked = false;
let maskImageData;
let num_points = 1;

const log = (i) => {
  console.log(i);
  if(getMode()) {
    document.getElementById("status").innerText += `\n[${getTime()}] ${i}`;
  } else {
    document.getElementById("status").innerText += `\n${i}`;
  }
};

const logError = (i) => {
  console.error(i);
  if(getMode()) {
    document.getElementById("status").innerText += `\n[${getTime()}] ${i}`;
  } else {
    document.getElementById("status").innerText += `\n${i}`;
  }
};

/**
 * create config from url
 */
function getConfig() {
  const query = window.location.search.substring(1);
  const config = {
    host: location.href.includes("github.io")
      ? "https://huggingface.co/microsoft/segment-anything-model-webnn/resolve/main"
      : "models",
    mode: "none",  
    model: "sam_b",
    provider: "webnn",
    device: "gpu",
    threads: "1",
    ort: "test"
  };
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (pair[0] in config) {
      config[pair[0]] = decodeURIComponent(pair[1]);
    } else if (pair[0].length > 0) {
      throw new Error("unknown argument: " + pair[0]);
    }
  }
  config.threads = parseInt(config.threads);
  config.local = parseInt(config.local);
  return config;
}

/**
 * clone tensor
 */
function cloneTensor(t) {
  return new ort.Tensor(t.type, Float32Array.from(t.data), t.dims);
}

/*
 * create feed for the original facebook model
 */
function feedForSam(emb, points, labels) {
  const maskInput = new ort.Tensor(
    new Float32Array(256 * 256),
    [1, 1, 256, 256]
  );
  const hasMask = new ort.Tensor(new Float32Array([0]), [1]);
  const origianlImageSize = new ort.Tensor(
    new Float32Array([MODEL_HEIGHT, MODEL_WIDTH]),
    [2]
  );
  const pointCoords = new ort.Tensor(new Float32Array(points), [
    1,
    points.length / 2,
    2,
  ]);
  const pointLabels = new ort.Tensor(new Float32Array(labels), [
    1,
    labels.length,
  ]);

  return {
    image_embeddings: cloneTensor(emb.image_embeddings),
    point_coords: pointCoords,
    point_labels: pointLabels,
    mask_input: maskInput,
    has_mask_input: hasMask,
    orig_im_size: origianlImageSize,
  };
}

/*
 * Handle cut-out event
 */
async function handleCut(event) {
  if (points.length == 0) {
    return;
  }

  const [w, h] = [canvas.width, canvas.height];

  // canvas for cut-out
  const cutCanvas = new OffscreenCanvas(w, h);
  const cutContext = cutCanvas.getContext("2d");
  const cutPixelData = cutContext.getImageData(0, 0, w, h);

  // need to rescale mask to image size
  const maskCanvas = new OffscreenCanvas(w, h);
  const maskContext = maskCanvas.getContext("2d");
  maskContext.drawImage(await createImageBitmap(maskImageData), 0, 0);
  const maskPixelData = maskContext.getImageData(0, 0, w, h);

  // copy masked pixels to cut-out
  for (let i = 0; i < maskPixelData.data.length; i += 4) {
    if (maskPixelData.data[i] > 0) {
      for (let j = 0; j < 4; ++j) {
        const offset = i + j;
        cutPixelData.data[offset] = imageImageData.data[offset];
      }
    }
  }
  cutContext.putImageData(cutPixelData, 0, 0);

  // Download image
  const link = document.createElement("a");
  link.download = "image.png";
  link.href = URL.createObjectURL(await cutCanvas.convertToBlob());
  link.click();
  link.remove();
}

async function decoder(points, labels) {
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = imageImageData.width;
  canvas.height = imageImageData.height;
  ctx.putImageData(imageImageData, 0, 0);

  try {
    if (points.length > 0) {
      // need to wait for encoder to be ready
      if (image_embeddings === undefined) {
        await MODELS[config.model][0].sess;
      }

      // wait for encoder to deliver embeddings
      const emb = await image_embeddings;

      // the decoder
      let session = MODELS[config.model][1].sess;

      const feed = feedForSam(emb, points, labels);

      if (labels.length != num_points && config.provider == "webnn") {
        // update num_points and re-create ort session for WebNN provider
        // as WebNN doesn't support the dynamic shape model.
        num_points = labels.length;
        await session.release();
        await load_models([MODELS[config.model][1]]);
        session = MODELS[config.model][1].sess;
      }

      const start = performance.now();
      const res = await session.run(feed);

      if(getMode()){
        decoder_latency.innerText = `${(performance.now() - start).toFixed(2)}`;
        unit.innerText = "ms";
      } else {

      }

      samDecoderIndicator.setAttribute("class", "title");

      for (let i = 0; i < points.length; i += 2) {
        ctx.fillStyle = "blue";
        ctx.fillRect(points[i], points[i + 1], 10, 10);
      }
      const mask = res.masks;
      maskImageData = mask.toImageData();
      ctx.globalAlpha = 0.3;
      ctx.drawImage(await createImageBitmap(maskImageData), 0, 0);
    }
  } catch (ex) {
    console.log(ex.message);
  }
}

function getPoint(event) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.trunc(event.clientX - rect.left);
  const y = Math.trunc(event.clientY - rect.top);
  return [x, y];
}

/**
 * handler mouse move event
 */
async function handleMouseMove(event) {
  if (isClicked) {
    return;
  }
  try {
    isClicked = true;
    canvas.style.cursor = "wait";
    const point = getPoint(event);
    await decoder([...points, point[0], point[1]], [...labels, 1]);
  } finally {
    canvas.style.cursor = "default";
    isClicked = false;
  }
}

/**
 * handler to handle click event on canvas
 */
async function handleClick(event) {
  if (isClicked) {
    return;
  }
  try {
    isClicked = true;
    canvas.style.cursor = "wait";

    const point = getPoint(event);
    const label = 1;
    points.push(point[0]);
    points.push(point[1]);
    labels.push(label);
    await decoder(points, labels);
  } finally {
    canvas.style.cursor = "default";
    isClicked = false;
  }
}

/**
 * handler called when image available
 */
async function handleImage(img) {
  points = [];
  labels = [];
  filein.disabled = true;
  cut.disabled = true;
  clear.disabled = true;
  actionBar.setAttribute("class", "disable");
  decoder_latency.innerText = "";
  unit.innerText = "";
  samDecoderIndicator.setAttribute("class", "none");
  canvas.style.cursor = "wait";
  image_embeddings = undefined;

  let width = img.width;
  let height = img.height;
  if (width > height) {
    if (width > MAX_WIDTH) {
      height = height * (MAX_WIDTH / width);
      width = MAX_WIDTH;
    }
  } else {
    if (height > MAX_HEIGHT) {
      width = width * (MAX_HEIGHT / height);
      height = MAX_HEIGHT;
    }
  }
  width = Math.round(width);
  height = Math.round(height);
  canvas.width = width;
  canvas.height = height;

  let ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);

  imageImageData = ctx.getImageData(0, 0, width, height);

  const t = await ort.Tensor.fromImage(imageImageData, {
    resizedWidth: MODEL_WIDTH,
    resizedHeight: MODEL_HEIGHT,
  });
  const feed = config.isSlimSam ? { pixel_values: t } : { input_image: t };
  const session = await MODELS[config.model][0].sess;

  const start = performance.now();
  image_embeddings = session.run(feed);
  image_embeddings.then(() => {
    if(getMode()) {
      log(
        `[Session Run] Encoder execution time: ${(
          performance.now() - start
        ).toFixed(2)}ms`
      );
    } else {
      log(`[Session Run] Encoder completed`);
    }

    log(`[Session Run] Ready to segment image`);
    log(`[Session Run] Please move the mouse to a random spot of the image`);
    canvas.style.cursor = "default";
  });
  filein.disabled = false;
  cut.disabled = false;
  clear.disabled = false;
  actionBar.setAttribute("class", "");
}

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
      if (name.toLowerCase().indexOf("encoder") > -1) {
        samEncoderFetchProgress = 70.0;
        progress =
          samEncoderFetchProgress +
          samDecoderFetchProgress +
          samEncoderCompileProgress +
          samDecoderCompileProgress;
        updateProgressBar(progress.toFixed(2));
        progressInfo.innerHTML = `Loading SAM Encoder model · ${progress.toFixed(
          2
        )}%`;
      } else if (name.toLowerCase().indexOf("decoder") > -1) {
        samDecoderFetchProgress = 10.0;
        progress =
          samEncoderFetchProgress +
          samDecoderFetchProgress +
          samEncoderCompileProgress +
          samDecoderCompileProgress;
        updateProgressBar(progress.toFixed(2));
        progressInfo.innerHTML = `Loading SAM Decoder model · ${progress.toFixed(
          2
        )}%`;
      }
      return buffer;
    }
  } catch (e) {
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

    if (name.toLowerCase().indexOf("encoder") > -1) {
      samEncoderFetchProgress = 0.7 * fetchProgress;
      progress =
        samEncoderFetchProgress +
        samDecoderFetchProgress +
        samEncoderCompileProgress +
        samDecoderCompileProgress;
      updateProgressBar(progress.toFixed(2));
      progressInfo.innerHTML = `Loading SAM Encoder model · ${progress.toFixed(
        2
      )}%`;
    } else if (name.toLowerCase().indexOf("decoder") > -1) {
      samDecoderFetchProgress = 0.1 * fetchProgress;
      progress =
        samEncoderFetchProgress +
        samDecoderFetchProgress +
        samEncoderCompileProgress +
        samDecoderCompileProgress;
      updateProgressBar(progress.toFixed(2));
      progressInfo.innerHTML = `Loading SAM Decoder model · ${progress.toFixed(
        2
      )}%`;
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

const getMode = () => {
  return (getQueryValue("mode") === "normal") ? false : true;
};

/*
 * load models one at a time
 */
async function load_models(models) {
  log("[Load] ONNX Runtime Execution Provider: " + config.provider);

  for (const [id, model] of Object.entries(models)) {
    let start;
    let name = models[id].name;
    try {
      start = performance.now();
      const opt = {
        executionProviders: [config.provider],
        enableMemPattern: false,
        enableCpuMemArena: false,
        extra: {
          session: {
            disable_prepacking: "1",
            use_device_allocator_for_initializers: "1",
            use_ort_model_bytes_directly: "1",
            use_ort_model_bytes_for_initializers: "1",
          },
        },
        logSeverityLevel: 0,
      };
      // sam-b-encoder for WebNN is slow, as which contains 24 Einsum nodes,
      // WebNN EP is working on Einsum op implementation at https://github.com/microsoft/onnxruntime/pull/19558.
      if (config.provider == "webnn") {
        opt.executionProviders = [
          {
            name: "webnn",
            deviceType: "gpu",
          },
        ];
        opt.freeDimensionOverrides = {
          num_points: num_points,
        };
      }

      let modelUrl = `${config.host}/${models[id].url}`;
      log(`[Load] Loading ${name} · ${models[id].size}`);

      let modelBuffer = await getModelOPFS(`segment_anything_${name}`, modelUrl, false);
      log(
        `[Load] ${name} load time: ${(performance.now() - start).toFixed(2)}ms`
      );
      log(`[Session Create] Creating ${name}`);
      start = performance.now();
      const extra_opt = model.opt || {};
      const sess_opt = { ...opt, ...extra_opt };
      model.sess = await ort.InferenceSession.create(modelBuffer, sess_opt);

      if(getMode()){
        log(
          `[Session Create] ${name} create time: ${(
            performance.now() - start
          ).toFixed(2)}ms`
        );
      } else {
        log(`[Session Create] ${name} completed`);
      }

      if (name.toLowerCase().indexOf("encoder") > -1) {
        samEncoderCompileProgress = 15;
        progress =
          samEncoderFetchProgress +
          samDecoderFetchProgress +
          samEncoderCompileProgress +
          samDecoderCompileProgress;
        updateProgressBar(progress.toFixed(2));
        progressInfo.innerHTML = `SAM Encoder model compiled · ${progress.toFixed(
          2
        )}%`;
      } else if (name.toLowerCase().indexOf("decoder") > -1) {
        samDecoderCompileProgress = 5;
        progress =
          samEncoderFetchProgress +
          samDecoderFetchProgress +
          samEncoderCompileProgress +
          samDecoderCompileProgress;
        updateProgressBar(progress.toFixed(2));
        progressInfo.innerHTML = `SAM Decoder model compiled · ${progress.toFixed(
          2
        )}%`;
      }
    } catch (e) {
      log(`[Session Create] ${name} failed, ${e.message}`);
    }
  }
  placeholder.setAttribute("class", "none");
  canvas.setAttribute("class", "");
}

async function main() {
  const model = MODELS[config.model];
  canvas.style.cursor = "wait";
  clear.addEventListener("click", () => {
    points = [];
    labels = [];
    decoder(points, labels);
  });

  let img = document.getElementById("original-image");

  await load_models(MODELS[config.model]).then(
    () => {
      canvas.addEventListener("click", handleClick);
      canvas.addEventListener("mousemove", handleMouseMove);
      cut.addEventListener("click", handleCut);

      // image upload
      filein.onchange = function (evt) {
        let target = evt.target || window.event.src,
          files = target.files;
        if (FileReader && files && files.length) {
          let fileReader = new FileReader();
          fileReader.onload = () => {
            img.onload = () => handleImage(img);
            img.src = fileReader.result;
          };
          fileReader.readAsDataURL(files[0]);
        }
      };
      handleImage(img);
    },
    (e) => {
      log(e);
    }
  );
}

async function hasFp16() {
  try {
    const adapter = await navigator.gpu.requestAdapter();
    return adapter.features.has("shader-f16");
  } catch (e) {
    return false;
  }
}

const padNumber = (num, fill) => {
  let len = ("" + num).length;
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

const checkWebNN = async () => {
  let status = document.querySelector("#webnnstatus");
  let circle = document.querySelector("#circle");
  let info = document.querySelector("#info");
  let webnnStatus = await webNnStatus();

  if (webnnStatus.webnn) {
    status.setAttribute("class", "green");
    info.innerHTML = "WebNN supported";
    await main();
  } else {
    if (webnnStatus.error) {
      status.setAttribute("class", "red");
      info.innerHTML = `WebNN not supported: ${webnnStatus.error} <a id="webnn_na" href="../../install.html" title="WebNN Installation Guide">WebNN Installation Guide</a>`;
      logError(`[Error] ${webnnStatus.error}`);
    } else {
      status.setAttribute("class", "red");
      info.innerHTML = "WebNN not supported";
      logError(`[Error] WebNN not supported`);
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

const webNnStatus = async () => {
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

const setupORT = async () => {
  const ortversion = document.querySelector("#ortversion");
  removeElement("onnxruntime-web");
  await loadScript("onnxruntime-web", "../../assets/dist/ort.all.min.js");
  ortversion.innerHTML = `ONNX Runtime Web: Test version`;
};

const loadScript = async (id, url) => {
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

const removeElement = async (id) => {
  let element = document.querySelector(id);
  if (element) {
    element.parentNode.removeChild(element);
  }
};

const getQueryValue = (name) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
};

const updateProgressBar = (progress) => {
  progressBar.style.width = `${progress}%`;
};

const ui = async () => {
  placeholder = document.querySelector("#placeholder div");
  canvas = document.querySelector("#img_canvas");
  filein = document.querySelector("#file-in");
  clear = document.querySelector("#clear-button");
  cut = document.querySelector("#cut-button");
  actionBar = document.querySelector("#action-bar");
  progressBar = document.querySelector("#progress-bar");
  progressInfo = document.querySelector("#progress-info");
  decoder_latency = document.querySelector("#decoder_latency");
  unit = document.querySelector("#unit");
  samDecoderIndicator = document.querySelector("#sam-decoder-indicator");

  canvas.setAttribute("class", "none");
  await setupORT();

  // ort.env.wasm.wasmPaths = 'dist/';
  ort.env.wasm.numThreads = config.threads;
  // ort.env.wasm.proxy = config.provider == "wasm";

  const title = document.querySelector("#title");
  const backends = document.querySelector("#backends");
  // if (getQueryValue('provider') && getQueryValue('provider').toLowerCase().indexOf('webgpu') > -1) {
  //     title.innerHTML = 'WebGPU';
  //     backends.innerHTML = '<a href="index.html?provider=wasm&model=sam_b_int8" title="Wasm backend">Wasm</a> · <a href="index.html" title="WebNN backend">WebNN</a>';
  // } else if (getQueryValue('provider') && getQueryValue('provider').toLowerCase().indexOf('wasm') > -1){
  //     title.innerHTML = 'Wasm';
  //     samDecoderIndicator.innerHTML = 'SAM Decoder · INT8';
  //     backends.innerHTML = '<a href="index.html?provider=webgpu&model=sam_b" title="WebGPU backend">WebGPU</a> · <a href="index.html" title="WebNN backend">WebNN</a>';
  // } else {
  //     title.innerHTML = 'WebNN';
  //     backends.innerHTML = '· <a href="index.html?provider=wasm&model=sam_b_int8" title="Wasm backend">Wasm</a> · <a href="index.html?provider=webgpu&model=sam_b" title="WebGPU backend">WebGPU</a>';
  // }
  await checkWebNN();
};

document.addEventListener("DOMContentLoaded", ui, false);
