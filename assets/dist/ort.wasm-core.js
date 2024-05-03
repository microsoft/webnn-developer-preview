/*!
 * ONNX Runtime Web v1.18.0
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
"use strict";
var ort = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // common/dist/esm/backend-impl.js
  var backends, backendsSortedByPriority, registerBackend, tryResolveAndInitializeBackend, resolveBackendAndExecutionProviders;
  var init_backend_impl = __esm({
    "common/dist/esm/backend-impl.js"() {
      "use strict";
      backends = /* @__PURE__ */ new Map();
      backendsSortedByPriority = [];
      registerBackend = (name, backend, priority) => {
        if (backend && typeof backend.init === "function" && typeof backend.createInferenceSessionHandler === "function") {
          const currentBackend = backends.get(name);
          if (currentBackend === void 0) {
            backends.set(name, { backend, priority });
          } else if (currentBackend.priority > priority) {
            return;
          } else if (currentBackend.priority === priority) {
            if (currentBackend.backend !== backend) {
              throw new Error(`cannot register backend "${name}" using priority ${priority}`);
            }
          }
          if (priority >= 0) {
            const i = backendsSortedByPriority.indexOf(name);
            if (i !== -1) {
              backendsSortedByPriority.splice(i, 1);
            }
            for (let i2 = 0; i2 < backendsSortedByPriority.length; i2++) {
              if (backends.get(backendsSortedByPriority[i2]).priority <= priority) {
                backendsSortedByPriority.splice(i2, 0, name);
                return;
              }
            }
            backendsSortedByPriority.push(name);
          }
          return;
        }
        throw new TypeError("not a valid backend");
      };
      tryResolveAndInitializeBackend = async (backendName) => {
        const backendInfo = backends.get(backendName);
        if (!backendInfo) {
          return "backend not found.";
        }
        if (backendInfo.initialized) {
          return backendInfo.backend;
        } else if (backendInfo.aborted) {
          return backendInfo.error;
        } else {
          const isInitializing = !!backendInfo.initPromise;
          try {
            if (!isInitializing) {
              backendInfo.initPromise = backendInfo.backend.init(backendName);
            }
            await backendInfo.initPromise;
            backendInfo.initialized = true;
            return backendInfo.backend;
          } catch (e) {
            if (!isInitializing) {
              backendInfo.error = `${e}`;
              backendInfo.aborted = true;
            }
            return backendInfo.error;
          } finally {
            delete backendInfo.initPromise;
          }
        }
      };
      resolveBackendAndExecutionProviders = async (options) => {
        const eps = options.executionProviders || [];
        const backendHints = eps.map((i) => typeof i === "string" ? i : i.name);
        const backendNames = backendHints.length === 0 ? backendsSortedByPriority : backendHints;
        let backend;
        const errors = [];
        const availableBackendNames = /* @__PURE__ */ new Set();
        for (const backendName of backendNames) {
          const resolveResult = await tryResolveAndInitializeBackend(backendName);
          if (typeof resolveResult === "string") {
            errors.push({ name: backendName, err: resolveResult });
          } else {
            if (!backend) {
              backend = resolveResult;
            }
            if (backend === resolveResult) {
              availableBackendNames.add(backendName);
            }
          }
        }
        if (!backend) {
          throw new Error(`no available backend found. ERR: ${errors.map((e) => `[${e.name}] ${e.err}`).join(", ")}`);
        }
        for (const { name, err } of errors) {
          if (backendHints.includes(name)) {
            console.warn(`removing requested execution provider "${name}" from session options because it is not available: ${err}`);
          }
        }
        const filteredEps = eps.filter((i) => availableBackendNames.has(typeof i === "string" ? i : i.name));
        return [
          backend,
          new Proxy(options, {
            get: (target, prop) => {
              if (prop === "executionProviders") {
                return filteredEps;
              }
              return Reflect.get(target, prop);
            }
          })
        ];
      };
    }
  });

  // common/dist/esm/backend.js
  var init_backend = __esm({
    "common/dist/esm/backend.js"() {
      "use strict";
      init_backend_impl();
    }
  });

  // common/dist/esm/version.js
  var version;
  var init_version = __esm({
    "common/dist/esm/version.js"() {
      "use strict";
      version = "1.18.0";
    }
  });

  // common/dist/esm/env-impl.js
  var logLevelValue, env;
  var init_env_impl = __esm({
    "common/dist/esm/env-impl.js"() {
      "use strict";
      init_version();
      logLevelValue = "warning";
      env = {
        wasm: {},
        webgl: {},
        webgpu: {},
        versions: { common: version },
        set logLevel(value) {
          if (value === void 0) {
            return;
          }
          if (typeof value !== "string" || ["verbose", "info", "warning", "error", "fatal"].indexOf(value) === -1) {
            throw new Error(`Unsupported logging level: ${value}`);
          }
          logLevelValue = value;
        },
        get logLevel() {
          return logLevelValue;
        }
      };
      Object.defineProperty(env, "logLevel", { enumerable: true });
    }
  });

  // common/dist/esm/env.js
  var env2;
  var init_env = __esm({
    "common/dist/esm/env.js"() {
      "use strict";
      init_env_impl();
      env2 = env;
    }
  });

  // common/dist/esm/tensor-conversion-impl.js
  var tensorToDataURL, tensorToImageData;
  var init_tensor_conversion_impl = __esm({
    "common/dist/esm/tensor-conversion-impl.js"() {
      "use strict";
      tensorToDataURL = (tensor, options) => {
        const canvas = typeof document !== "undefined" ? document.createElement("canvas") : new OffscreenCanvas(1, 1);
        canvas.width = tensor.dims[3];
        canvas.height = tensor.dims[2];
        const pixels2DContext = canvas.getContext("2d");
        if (pixels2DContext != null) {
          let width;
          let height;
          if (options?.tensorLayout !== void 0 && options.tensorLayout === "NHWC") {
            width = tensor.dims[2];
            height = tensor.dims[3];
          } else {
            width = tensor.dims[3];
            height = tensor.dims[2];
          }
          const inputformat = options?.format !== void 0 ? options.format : "RGB";
          const norm = options?.norm;
          let normMean;
          let normBias;
          if (norm === void 0 || norm.mean === void 0) {
            normMean = [255, 255, 255, 255];
          } else {
            if (typeof norm.mean === "number") {
              normMean = [norm.mean, norm.mean, norm.mean, norm.mean];
            } else {
              normMean = [norm.mean[0], norm.mean[1], norm.mean[2], 0];
              if (norm.mean[3] !== void 0) {
                normMean[3] = norm.mean[3];
              }
            }
          }
          if (norm === void 0 || norm.bias === void 0) {
            normBias = [0, 0, 0, 0];
          } else {
            if (typeof norm.bias === "number") {
              normBias = [norm.bias, norm.bias, norm.bias, norm.bias];
            } else {
              normBias = [norm.bias[0], norm.bias[1], norm.bias[2], 0];
              if (norm.bias[3] !== void 0) {
                normBias[3] = norm.bias[3];
              }
            }
          }
          const stride = height * width;
          let rTensorPointer = 0, gTensorPointer = stride, bTensorPointer = stride * 2, aTensorPointer = -1;
          if (inputformat === "RGBA") {
            rTensorPointer = 0;
            gTensorPointer = stride;
            bTensorPointer = stride * 2;
            aTensorPointer = stride * 3;
          } else if (inputformat === "RGB") {
            rTensorPointer = 0;
            gTensorPointer = stride;
            bTensorPointer = stride * 2;
          } else if (inputformat === "RBG") {
            rTensorPointer = 0;
            bTensorPointer = stride;
            gTensorPointer = stride * 2;
          }
          for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
              const R = (tensor.data[rTensorPointer++] - normBias[0]) * normMean[0];
              const G = (tensor.data[gTensorPointer++] - normBias[1]) * normMean[1];
              const B = (tensor.data[bTensorPointer++] - normBias[2]) * normMean[2];
              const A = aTensorPointer === -1 ? 255 : (tensor.data[aTensorPointer++] - normBias[3]) * normMean[3];
              pixels2DContext.fillStyle = "rgba(" + R + "," + G + "," + B + "," + A + ")";
              pixels2DContext.fillRect(j, i, 1, 1);
            }
          }
          if ("toDataURL" in canvas) {
            return canvas.toDataURL();
          } else {
            throw new Error("toDataURL is not supported");
          }
        } else {
          throw new Error("Can not access image data");
        }
      };
      tensorToImageData = (tensor, options) => {
        const pixels2DContext = typeof document !== "undefined" ? document.createElement("canvas").getContext("2d") : new OffscreenCanvas(1, 1).getContext("2d");
        let image;
        if (pixels2DContext != null) {
          let width;
          let height;
          let channels;
          if (options?.tensorLayout !== void 0 && options.tensorLayout === "NHWC") {
            width = tensor.dims[2];
            height = tensor.dims[1];
            channels = tensor.dims[3];
          } else {
            width = tensor.dims[3];
            height = tensor.dims[2];
            channels = tensor.dims[1];
          }
          const inputformat = options !== void 0 ? options.format !== void 0 ? options.format : "RGB" : "RGB";
          const norm = options?.norm;
          let normMean;
          let normBias;
          if (norm === void 0 || norm.mean === void 0) {
            normMean = [255, 255, 255, 255];
          } else {
            if (typeof norm.mean === "number") {
              normMean = [norm.mean, norm.mean, norm.mean, norm.mean];
            } else {
              normMean = [norm.mean[0], norm.mean[1], norm.mean[2], 255];
              if (norm.mean[3] !== void 0) {
                normMean[3] = norm.mean[3];
              }
            }
          }
          if (norm === void 0 || norm.bias === void 0) {
            normBias = [0, 0, 0, 0];
          } else {
            if (typeof norm.bias === "number") {
              normBias = [norm.bias, norm.bias, norm.bias, norm.bias];
            } else {
              normBias = [norm.bias[0], norm.bias[1], norm.bias[2], 0];
              if (norm.bias[3] !== void 0) {
                normBias[3] = norm.bias[3];
              }
            }
          }
          const stride = height * width;
          if (options !== void 0) {
            if (options.format !== void 0 && (channels === 4 && options.format !== "RGBA") || channels === 3 && (options.format !== "RGB" && options.format !== "BGR")) {
              throw new Error("Tensor format doesn't match input tensor dims");
            }
          }
          const step = 4;
          let rImagePointer = 0, gImagePointer = 1, bImagePointer = 2, aImagePointer = 3;
          let rTensorPointer = 0, gTensorPointer = stride, bTensorPointer = stride * 2, aTensorPointer = -1;
          if (inputformat === "RGBA") {
            rTensorPointer = 0;
            gTensorPointer = stride;
            bTensorPointer = stride * 2;
            aTensorPointer = stride * 3;
          } else if (inputformat === "RGB") {
            rTensorPointer = 0;
            gTensorPointer = stride;
            bTensorPointer = stride * 2;
          } else if (inputformat === "RBG") {
            rTensorPointer = 0;
            bTensorPointer = stride;
            gTensorPointer = stride * 2;
          }
          image = pixels2DContext.createImageData(width, height);
          for (let i = 0; i < height * width; rImagePointer += step, gImagePointer += step, bImagePointer += step, aImagePointer += step, i++) {
            image.data[rImagePointer] = (tensor.data[rTensorPointer++] - normBias[0]) * normMean[0];
            image.data[gImagePointer] = (tensor.data[gTensorPointer++] - normBias[1]) * normMean[1];
            image.data[bImagePointer] = (tensor.data[bTensorPointer++] - normBias[2]) * normMean[2];
            image.data[aImagePointer] = aTensorPointer === -1 ? 255 : (tensor.data[aTensorPointer++] - normBias[3]) * normMean[3];
          }
        } else {
          throw new Error("Can not access image data");
        }
        return image;
      };
    }
  });

  // common/dist/esm/tensor-factory-impl.js
  var bufferToTensor, tensorFromImage, tensorFromTexture, tensorFromGpuBuffer, tensorFromPinnedBuffer;
  var init_tensor_factory_impl = __esm({
    "common/dist/esm/tensor-factory-impl.js"() {
      "use strict";
      init_tensor_impl();
      bufferToTensor = (buffer, options) => {
        if (buffer === void 0) {
          throw new Error("Image buffer must be defined");
        }
        if (options.height === void 0 || options.width === void 0) {
          throw new Error("Image height and width must be defined");
        }
        if (options.tensorLayout === "NHWC") {
          throw new Error("NHWC Tensor layout is not supported yet");
        }
        const { height, width } = options;
        const norm = options.norm ?? { mean: 255, bias: 0 };
        let normMean;
        let normBias;
        if (typeof norm.mean === "number") {
          normMean = [norm.mean, norm.mean, norm.mean, norm.mean];
        } else {
          normMean = [norm.mean[0], norm.mean[1], norm.mean[2], norm.mean[3] ?? 255];
        }
        if (typeof norm.bias === "number") {
          normBias = [norm.bias, norm.bias, norm.bias, norm.bias];
        } else {
          normBias = [norm.bias[0], norm.bias[1], norm.bias[2], norm.bias[3] ?? 0];
        }
        const inputformat = options.format !== void 0 ? options.format : "RGBA";
        const outputformat = options.tensorFormat !== void 0 ? options.tensorFormat !== void 0 ? options.tensorFormat : "RGB" : "RGB";
        const stride = height * width;
        const float32Data = outputformat === "RGBA" ? new Float32Array(stride * 4) : new Float32Array(stride * 3);
        let step = 4, rImagePointer = 0, gImagePointer = 1, bImagePointer = 2, aImagePointer = 3;
        let rTensorPointer = 0, gTensorPointer = stride, bTensorPointer = stride * 2, aTensorPointer = -1;
        if (inputformat === "RGB") {
          step = 3;
          rImagePointer = 0;
          gImagePointer = 1;
          bImagePointer = 2;
          aImagePointer = -1;
        }
        if (outputformat === "RGBA") {
          aTensorPointer = stride * 3;
        } else if (outputformat === "RBG") {
          rTensorPointer = 0;
          bTensorPointer = stride;
          gTensorPointer = stride * 2;
        } else if (outputformat === "BGR") {
          bTensorPointer = 0;
          gTensorPointer = stride;
          rTensorPointer = stride * 2;
        }
        for (let i = 0; i < stride; i++, rImagePointer += step, bImagePointer += step, gImagePointer += step, aImagePointer += step) {
          float32Data[rTensorPointer++] = (buffer[rImagePointer] + normBias[0]) / normMean[0];
          float32Data[gTensorPointer++] = (buffer[gImagePointer] + normBias[1]) / normMean[1];
          float32Data[bTensorPointer++] = (buffer[bImagePointer] + normBias[2]) / normMean[2];
          if (aTensorPointer !== -1 && aImagePointer !== -1) {
            float32Data[aTensorPointer++] = (buffer[aImagePointer] + normBias[3]) / normMean[3];
          }
        }
        const outputTensor = outputformat === "RGBA" ? new Tensor("float32", float32Data, [1, 4, height, width]) : new Tensor("float32", float32Data, [1, 3, height, width]);
        return outputTensor;
      };
      tensorFromImage = async (image, options) => {
        const isHTMLImageEle = typeof HTMLImageElement !== "undefined" && image instanceof HTMLImageElement;
        const isImageDataEle = typeof ImageData !== "undefined" && image instanceof ImageData;
        const isImageBitmap = typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap;
        const isString = typeof image === "string";
        let data;
        let bufferToTensorOptions = options ?? {};
        const createCanvas = () => {
          if (typeof document !== "undefined") {
            return document.createElement("canvas");
          } else if (typeof OffscreenCanvas !== "undefined") {
            return new OffscreenCanvas(1, 1);
          } else {
            throw new Error("Canvas is not supported");
          }
        };
        const createCanvasContext = (canvas) => {
          if (canvas instanceof HTMLCanvasElement) {
            return canvas.getContext("2d");
          } else if (canvas instanceof OffscreenCanvas) {
            return canvas.getContext("2d");
          } else {
            return null;
          }
        };
        if (isHTMLImageEle) {
          const canvas = createCanvas();
          canvas.width = image.width;
          canvas.height = image.height;
          const pixels2DContext = createCanvasContext(canvas);
          if (pixels2DContext != null) {
            let height = image.height;
            let width = image.width;
            if (options !== void 0 && options.resizedHeight !== void 0 && options.resizedWidth !== void 0) {
              height = options.resizedHeight;
              width = options.resizedWidth;
            }
            if (options !== void 0) {
              bufferToTensorOptions = options;
              if (options.tensorFormat !== void 0) {
                throw new Error("Image input config format must be RGBA for HTMLImageElement");
              } else {
                bufferToTensorOptions.tensorFormat = "RGBA";
              }
              bufferToTensorOptions.height = height;
              bufferToTensorOptions.width = width;
            } else {
              bufferToTensorOptions.tensorFormat = "RGBA";
              bufferToTensorOptions.height = height;
              bufferToTensorOptions.width = width;
            }
            pixels2DContext.drawImage(image, 0, 0);
            data = pixels2DContext.getImageData(0, 0, width, height).data;
          } else {
            throw new Error("Can not access image data");
          }
        } else if (isImageDataEle) {
          let height;
          let width;
          if (options !== void 0 && options.resizedWidth !== void 0 && options.resizedHeight !== void 0) {
            height = options.resizedHeight;
            width = options.resizedWidth;
          } else {
            height = image.height;
            width = image.width;
          }
          if (options !== void 0) {
            bufferToTensorOptions = options;
          }
          bufferToTensorOptions.format = "RGBA";
          bufferToTensorOptions.height = height;
          bufferToTensorOptions.width = width;
          if (options !== void 0) {
            const tempCanvas = createCanvas();
            tempCanvas.width = width;
            tempCanvas.height = height;
            const pixels2DContext = createCanvasContext(tempCanvas);
            if (pixels2DContext != null) {
              pixels2DContext.putImageData(image, 0, 0);
              data = pixels2DContext.getImageData(0, 0, width, height).data;
            } else {
              throw new Error("Can not access image data");
            }
          } else {
            data = image.data;
          }
        } else if (isImageBitmap) {
          if (options === void 0) {
            throw new Error("Please provide image config with format for Imagebitmap");
          }
          const canvas = createCanvas();
          canvas.width = image.width;
          canvas.height = image.height;
          const pixels2DContext = createCanvasContext(canvas);
          if (pixels2DContext != null) {
            const height = image.height;
            const width = image.width;
            pixels2DContext.drawImage(image, 0, 0, width, height);
            data = pixels2DContext.getImageData(0, 0, width, height).data;
            bufferToTensorOptions.height = height;
            bufferToTensorOptions.width = width;
            return bufferToTensor(data, bufferToTensorOptions);
          } else {
            throw new Error("Can not access image data");
          }
        } else if (isString) {
          return new Promise((resolve, reject) => {
            const canvas = createCanvas();
            const context = createCanvasContext(canvas);
            if (!image || !context) {
              return reject();
            }
            const newImage = new Image();
            newImage.crossOrigin = "Anonymous";
            newImage.src = image;
            newImage.onload = () => {
              canvas.width = newImage.width;
              canvas.height = newImage.height;
              context.drawImage(newImage, 0, 0, canvas.width, canvas.height);
              const img = context.getImageData(0, 0, canvas.width, canvas.height);
              bufferToTensorOptions.height = canvas.height;
              bufferToTensorOptions.width = canvas.width;
              resolve(bufferToTensor(img.data, bufferToTensorOptions));
            };
          });
        } else {
          throw new Error("Input data provided is not supported - aborted tensor creation");
        }
        if (data !== void 0) {
          return bufferToTensor(data, bufferToTensorOptions);
        } else {
          throw new Error("Input data provided is not supported - aborted tensor creation");
        }
      };
      tensorFromTexture = (texture, options) => {
        const { width, height, download, dispose } = options;
        const dims = [1, height, width, 4];
        return new Tensor({ location: "texture", type: "float32", texture, dims, download, dispose });
      };
      tensorFromGpuBuffer = (gpuBuffer, options) => {
        const { dataType, dims, download, dispose } = options;
        return new Tensor({ location: "gpu-buffer", type: dataType ?? "float32", gpuBuffer, dims, download, dispose });
      };
      tensorFromPinnedBuffer = (type, buffer, dims) => new Tensor({ location: "cpu-pinned", type, data: buffer, dims: dims ?? [buffer.length] });
    }
  });

  // common/dist/esm/tensor-impl-type-mapping.js
  var NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP, NUMERIC_TENSOR_TYPEDARRAY_TO_TYPE_MAP, isTypedArrayChecked, checkTypedArray;
  var init_tensor_impl_type_mapping = __esm({
    "common/dist/esm/tensor-impl-type-mapping.js"() {
      "use strict";
      NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP = /* @__PURE__ */ new Map([
        ["float32", Float32Array],
        ["uint8", Uint8Array],
        ["int8", Int8Array],
        ["uint16", Uint16Array],
        ["int16", Int16Array],
        ["int32", Int32Array],
        ["bool", Uint8Array],
        ["float64", Float64Array],
        ["uint32", Uint32Array]
      ]);
      NUMERIC_TENSOR_TYPEDARRAY_TO_TYPE_MAP = /* @__PURE__ */ new Map([
        [Float32Array, "float32"],
        [Uint8Array, "uint8"],
        [Int8Array, "int8"],
        [Uint16Array, "uint16"],
        [Int16Array, "int16"],
        [Int32Array, "int32"],
        [Float64Array, "float64"],
        [Uint32Array, "uint32"]
      ]);
      isTypedArrayChecked = false;
      checkTypedArray = () => {
        if (!isTypedArrayChecked) {
          isTypedArrayChecked = true;
          const isBigInt64ArrayAvailable = typeof BigInt64Array !== "undefined" && BigInt64Array.from;
          const isBigUint64ArrayAvailable = typeof BigUint64Array !== "undefined" && BigUint64Array.from;
          const isFloat16ArrayAvailable = typeof Float16Array !== "undefined" && Float16Array.from;
          if (isBigInt64ArrayAvailable) {
            NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP.set("int64", BigInt64Array);
            NUMERIC_TENSOR_TYPEDARRAY_TO_TYPE_MAP.set(BigInt64Array, "int64");
          }
          if (isBigUint64ArrayAvailable) {
            NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP.set("uint64", BigUint64Array);
            NUMERIC_TENSOR_TYPEDARRAY_TO_TYPE_MAP.set(BigUint64Array, "uint64");
          }
          if (isFloat16ArrayAvailable) {
            NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP.set("float16", Float16Array);
            NUMERIC_TENSOR_TYPEDARRAY_TO_TYPE_MAP.set(Float16Array, "float16");
          } else {
            NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP.set("float16", Uint16Array);
          }
        }
      };
    }
  });

  // common/dist/esm/tensor-utils-impl.js
  var calculateSize, tensorReshape;
  var init_tensor_utils_impl = __esm({
    "common/dist/esm/tensor-utils-impl.js"() {
      "use strict";
      init_tensor_impl();
      calculateSize = (dims) => {
        let size = 1;
        for (let i = 0; i < dims.length; i++) {
          const dim = dims[i];
          if (typeof dim !== "number" || !Number.isSafeInteger(dim)) {
            throw new TypeError(`dims[${i}] must be an integer, got: ${dim}`);
          }
          if (dim < 0) {
            throw new RangeError(`dims[${i}] must be a non-negative integer, got: ${dim}`);
          }
          size *= dim;
        }
        return size;
      };
      tensorReshape = (tensor, dims) => {
        switch (tensor.location) {
          case "cpu":
            return new Tensor(tensor.type, tensor.data, dims);
          case "cpu-pinned":
            return new Tensor({
              location: "cpu-pinned",
              data: tensor.data,
              type: tensor.type,
              dims
            });
          case "texture":
            return new Tensor({
              location: "texture",
              texture: tensor.texture,
              type: tensor.type,
              dims
            });
          case "gpu-buffer":
            return new Tensor({
              location: "gpu-buffer",
              gpuBuffer: tensor.gpuBuffer,
              type: tensor.type,
              dims
            });
          default:
            throw new Error(`tensorReshape: tensor location ${tensor.location} is not supported`);
        }
      };
    }
  });

  // common/dist/esm/tensor-impl.js
  var Tensor;
  var init_tensor_impl = __esm({
    "common/dist/esm/tensor-impl.js"() {
      "use strict";
      init_tensor_conversion_impl();
      init_tensor_factory_impl();
      init_tensor_impl_type_mapping();
      init_tensor_utils_impl();
      Tensor = class {
        /**
         * implementation.
         */
        constructor(arg0, arg1, arg2) {
          checkTypedArray();
          let type;
          let dims;
          if (typeof arg0 === "object" && "location" in arg0) {
            this.dataLocation = arg0.location;
            type = arg0.type;
            dims = arg0.dims;
            switch (arg0.location) {
              case "cpu-pinned": {
                const expectedTypedArrayConstructor = NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP.get(type);
                if (!expectedTypedArrayConstructor) {
                  throw new TypeError(`unsupported type "${type}" to create tensor from pinned buffer`);
                }
                if (!(arg0.data instanceof expectedTypedArrayConstructor)) {
                  throw new TypeError(`buffer should be of type ${expectedTypedArrayConstructor.name}`);
                }
                this.cpuData = arg0.data;
                break;
              }
              case "texture": {
                if (type !== "float32") {
                  throw new TypeError(`unsupported type "${type}" to create tensor from texture`);
                }
                this.gpuTextureData = arg0.texture;
                this.downloader = arg0.download;
                this.disposer = arg0.dispose;
                break;
              }
              case "gpu-buffer": {
                if (type !== "float32" && type !== "float16" && type !== "int32" && type !== "int64" && type !== "uint32" && type !== "uint8" && type !== "bool") {
                  throw new TypeError(`unsupported type "${type}" to create tensor from gpu buffer`);
                }
                this.gpuBufferData = arg0.gpuBuffer;
                this.downloader = arg0.download;
                this.disposer = arg0.dispose;
                break;
              }
              default:
                throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`);
            }
          } else {
            let data;
            let maybeDims;
            if (typeof arg0 === "string") {
              type = arg0;
              maybeDims = arg2;
              if (arg0 === "string") {
                if (!Array.isArray(arg1)) {
                  throw new TypeError("A string tensor's data must be a string array.");
                }
                data = arg1;
              } else {
                const typedArrayConstructor = NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP.get(arg0);
                if (typedArrayConstructor === void 0) {
                  throw new TypeError(`Unsupported tensor type: ${arg0}.`);
                }
                if (Array.isArray(arg1)) {
                  if (arg0 === "float16" && typedArrayConstructor === Uint16Array) {
                    throw new TypeError("Creating a float16 tensor from number array is not supported. Please use Uint16Array as data.");
                  } else if (arg0 === "uint64" || arg0 === "int64") {
                    data = typedArrayConstructor.from(arg1, BigInt);
                  } else {
                    data = typedArrayConstructor.from(arg1);
                  }
                } else if (arg1 instanceof typedArrayConstructor) {
                  data = arg1;
                } else {
                  throw new TypeError(`A ${type} tensor's data must be type of ${typedArrayConstructor}`);
                }
              }
            } else {
              maybeDims = arg1;
              if (Array.isArray(arg0)) {
                if (arg0.length === 0) {
                  throw new TypeError("Tensor type cannot be inferred from an empty array.");
                }
                const firstElementType = typeof arg0[0];
                if (firstElementType === "string") {
                  type = "string";
                  data = arg0;
                } else if (firstElementType === "boolean") {
                  type = "bool";
                  data = Uint8Array.from(arg0);
                } else {
                  throw new TypeError(`Invalid element type of data array: ${firstElementType}.`);
                }
              } else {
                const mappedType = NUMERIC_TENSOR_TYPEDARRAY_TO_TYPE_MAP.get(arg0.constructor);
                if (mappedType === void 0) {
                  throw new TypeError(`Unsupported type for tensor data: ${arg0.constructor}.`);
                }
                type = mappedType;
                data = arg0;
              }
            }
            if (maybeDims === void 0) {
              maybeDims = [data.length];
            } else if (!Array.isArray(maybeDims)) {
              throw new TypeError("A tensor's dims must be a number array");
            }
            dims = maybeDims;
            this.cpuData = data;
            this.dataLocation = "cpu";
          }
          const size = calculateSize(dims);
          if (this.cpuData && size !== this.cpuData.length) {
            throw new Error(`Tensor's size(${size}) does not match data length(${this.cpuData.length}).`);
          }
          this.type = type;
          this.dims = dims;
          this.size = size;
        }
        // #endregion
        // #region factory
        static async fromImage(image, options) {
          return tensorFromImage(image, options);
        }
        static fromTexture(texture, options) {
          return tensorFromTexture(texture, options);
        }
        static fromGpuBuffer(gpuBuffer, options) {
          return tensorFromGpuBuffer(gpuBuffer, options);
        }
        static fromPinnedBuffer(type, buffer, dims) {
          return tensorFromPinnedBuffer(type, buffer, dims);
        }
        // #endregion
        // #region conversions
        toDataURL(options) {
          return tensorToDataURL(this, options);
        }
        toImageData(options) {
          return tensorToImageData(this, options);
        }
        // #endregion
        // #region properties
        get data() {
          this.ensureValid();
          if (!this.cpuData) {
            throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");
          }
          return this.cpuData;
        }
        get location() {
          return this.dataLocation;
        }
        get texture() {
          this.ensureValid();
          if (!this.gpuTextureData) {
            throw new Error("The data is not stored as a WebGL texture.");
          }
          return this.gpuTextureData;
        }
        get gpuBuffer() {
          this.ensureValid();
          if (!this.gpuBufferData) {
            throw new Error("The data is not stored as a WebGPU buffer.");
          }
          return this.gpuBufferData;
        }
        // #endregion
        // #region methods
        async getData(releaseData) {
          this.ensureValid();
          switch (this.dataLocation) {
            case "cpu":
            case "cpu-pinned":
              return this.data;
            case "texture":
            case "gpu-buffer": {
              if (!this.downloader) {
                throw new Error("The current tensor is not created with a specified data downloader.");
              }
              if (this.isDownloading) {
                throw new Error("The current tensor is being downloaded.");
              }
              try {
                this.isDownloading = true;
                const data = await this.downloader();
                this.downloader = void 0;
                this.dataLocation = "cpu";
                this.cpuData = data;
                if (releaseData && this.disposer) {
                  this.disposer();
                  this.disposer = void 0;
                }
                return data;
              } finally {
                this.isDownloading = false;
              }
            }
            default:
              throw new Error(`cannot get data from location: ${this.dataLocation}`);
          }
        }
        dispose() {
          if (this.isDownloading) {
            throw new Error("The current tensor is being downloaded.");
          }
          if (this.disposer) {
            this.disposer();
            this.disposer = void 0;
          }
          this.cpuData = void 0;
          this.gpuTextureData = void 0;
          this.gpuBufferData = void 0;
          this.downloader = void 0;
          this.isDownloading = void 0;
          this.dataLocation = "none";
        }
        // #endregion
        // #region tensor utilities
        ensureValid() {
          if (this.dataLocation === "none") {
            throw new Error("The tensor is disposed.");
          }
        }
        reshape(dims) {
          this.ensureValid();
          if (this.downloader || this.disposer) {
            throw new Error("Cannot reshape a tensor that owns GPU resource.");
          }
          return tensorReshape(this, dims);
        }
      };
    }
  });

  // common/dist/esm/tensor.js
  var Tensor2;
  var init_tensor = __esm({
    "common/dist/esm/tensor.js"() {
      "use strict";
      init_tensor_impl();
      Tensor2 = Tensor;
    }
  });

  // common/dist/esm/trace.js
  var TRACE, TRACE_FUNC, TRACE_FUNC_BEGIN, TRACE_FUNC_END;
  var init_trace = __esm({
    "common/dist/esm/trace.js"() {
      "use strict";
      init_env_impl();
      TRACE = (deviceType, label) => {
        if (typeof env.trace === "undefined" ? !env.wasm.trace : !env.trace) {
          return;
        }
        console.timeStamp(`${deviceType}::ORT::${label}`);
      };
      TRACE_FUNC = (msg, extraMsg) => {
        const stack = new Error().stack?.split(/\r\n|\r|\n/g) || [];
        let hasTraceFunc = false;
        for (let i = 0; i < stack.length; i++) {
          if (hasTraceFunc && !stack[i].includes("TRACE_FUNC")) {
            let label = `FUNC_${msg}::${stack[i].trim().split(" ")[1]}`;
            if (extraMsg) {
              label += `::${extraMsg}`;
            }
            TRACE("CPU", label);
            return;
          }
          if (stack[i].includes("TRACE_FUNC")) {
            hasTraceFunc = true;
          }
        }
      };
      TRACE_FUNC_BEGIN = (extraMsg) => {
        if (typeof env.trace === "undefined" ? !env.wasm.trace : !env.trace) {
          return;
        }
        TRACE_FUNC("BEGIN", extraMsg);
      };
      TRACE_FUNC_END = (extraMsg) => {
        if (typeof env.trace === "undefined" ? !env.wasm.trace : !env.trace) {
          return;
        }
        TRACE_FUNC("END", extraMsg);
      };
    }
  });

  // common/dist/esm/inference-session-impl.js
  var InferenceSession;
  var init_inference_session_impl = __esm({
    "common/dist/esm/inference-session-impl.js"() {
      "use strict";
      init_backend_impl();
      init_tensor();
      init_trace();
      InferenceSession = class _InferenceSession {
        constructor(handler) {
          this.handler = handler;
        }
        async run(feeds, arg1, arg2) {
          TRACE_FUNC_BEGIN();
          const fetches = {};
          let options = {};
          if (typeof feeds !== "object" || feeds === null || feeds instanceof Tensor2 || Array.isArray(feeds)) {
            throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");
          }
          let isFetchesEmpty = true;
          if (typeof arg1 === "object") {
            if (arg1 === null) {
              throw new TypeError("Unexpected argument[1]: cannot be null.");
            }
            if (arg1 instanceof Tensor2) {
              throw new TypeError("'fetches' cannot be a Tensor");
            }
            if (Array.isArray(arg1)) {
              if (arg1.length === 0) {
                throw new TypeError("'fetches' cannot be an empty array.");
              }
              isFetchesEmpty = false;
              for (const name of arg1) {
                if (typeof name !== "string") {
                  throw new TypeError("'fetches' must be a string array or an object.");
                }
                if (this.outputNames.indexOf(name) === -1) {
                  throw new RangeError(`'fetches' contains invalid output name: ${name}.`);
                }
                fetches[name] = null;
              }
              if (typeof arg2 === "object" && arg2 !== null) {
                options = arg2;
              } else if (typeof arg2 !== "undefined") {
                throw new TypeError("'options' must be an object.");
              }
            } else {
              let isFetches = false;
              const arg1Keys = Object.getOwnPropertyNames(arg1);
              for (const name of this.outputNames) {
                if (arg1Keys.indexOf(name) !== -1) {
                  const v = arg1[name];
                  if (v === null || v instanceof Tensor2) {
                    isFetches = true;
                    isFetchesEmpty = false;
                    fetches[name] = v;
                  }
                }
              }
              if (isFetches) {
                if (typeof arg2 === "object" && arg2 !== null) {
                  options = arg2;
                } else if (typeof arg2 !== "undefined") {
                  throw new TypeError("'options' must be an object.");
                }
              } else {
                options = arg1;
              }
            }
          } else if (typeof arg1 !== "undefined") {
            throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");
          }
          for (const name of this.inputNames) {
            if (typeof feeds[name] === "undefined") {
              throw new Error(`input '${name}' is missing in 'feeds'.`);
            }
          }
          if (isFetchesEmpty) {
            for (const name of this.outputNames) {
              fetches[name] = null;
            }
          }
          const results = await this.handler.run(feeds, fetches, options);
          const returnValue = {};
          for (const key in results) {
            if (Object.hasOwnProperty.call(results, key)) {
              const result = results[key];
              if (result instanceof Tensor2) {
                returnValue[key] = result;
              } else {
                returnValue[key] = new Tensor2(result.type, result.data, result.dims);
              }
            }
          }
          TRACE_FUNC_END();
          return returnValue;
        }
        async release() {
          return this.handler.dispose();
        }
        static async create(arg0, arg1, arg2, arg3) {
          TRACE_FUNC_BEGIN();
          let filePathOrUint8Array;
          let options = {};
          if (typeof arg0 === "string") {
            filePathOrUint8Array = arg0;
            if (typeof arg1 === "object" && arg1 !== null) {
              options = arg1;
            } else if (typeof arg1 !== "undefined") {
              throw new TypeError("'options' must be an object.");
            }
          } else if (arg0 instanceof Uint8Array) {
            filePathOrUint8Array = arg0;
            if (typeof arg1 === "object" && arg1 !== null) {
              options = arg1;
            } else if (typeof arg1 !== "undefined") {
              throw new TypeError("'options' must be an object.");
            }
          } else if (arg0 instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && arg0 instanceof SharedArrayBuffer) {
            const buffer = arg0;
            let byteOffset = 0;
            let byteLength = arg0.byteLength;
            if (typeof arg1 === "object" && arg1 !== null) {
              options = arg1;
            } else if (typeof arg1 === "number") {
              byteOffset = arg1;
              if (!Number.isSafeInteger(byteOffset)) {
                throw new RangeError("'byteOffset' must be an integer.");
              }
              if (byteOffset < 0 || byteOffset >= buffer.byteLength) {
                throw new RangeError(`'byteOffset' is out of range [0, ${buffer.byteLength}).`);
              }
              byteLength = arg0.byteLength - byteOffset;
              if (typeof arg2 === "number") {
                byteLength = arg2;
                if (!Number.isSafeInteger(byteLength)) {
                  throw new RangeError("'byteLength' must be an integer.");
                }
                if (byteLength <= 0 || byteOffset + byteLength > buffer.byteLength) {
                  throw new RangeError(`'byteLength' is out of range (0, ${buffer.byteLength - byteOffset}].`);
                }
                if (typeof arg3 === "object" && arg3 !== null) {
                  options = arg3;
                } else if (typeof arg3 !== "undefined") {
                  throw new TypeError("'options' must be an object.");
                }
              } else if (typeof arg2 !== "undefined") {
                throw new TypeError("'byteLength' must be a number.");
              }
            } else if (typeof arg1 !== "undefined") {
              throw new TypeError("'options' must be an object.");
            }
            filePathOrUint8Array = new Uint8Array(buffer, byteOffset, byteLength);
          } else {
            throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");
          }
          const [backend, optionsWithValidatedEPs] = await resolveBackendAndExecutionProviders(options);
          const handler = await backend.createInferenceSessionHandler(filePathOrUint8Array, optionsWithValidatedEPs);
          TRACE_FUNC_END();
          return new _InferenceSession(handler);
        }
        startProfiling() {
          this.handler.startProfiling();
        }
        endProfiling() {
          this.handler.endProfiling();
        }
        get inputNames() {
          return this.handler.inputNames;
        }
        get outputNames() {
          return this.handler.outputNames;
        }
      };
    }
  });

  // common/dist/esm/inference-session.js
  var InferenceSession2;
  var init_inference_session = __esm({
    "common/dist/esm/inference-session.js"() {
      "use strict";
      init_inference_session_impl();
      InferenceSession2 = InferenceSession;
    }
  });

  // common/dist/esm/tensor-conversion.js
  var init_tensor_conversion = __esm({
    "common/dist/esm/tensor-conversion.js"() {
      "use strict";
    }
  });

  // common/dist/esm/tensor-factory.js
  var init_tensor_factory = __esm({
    "common/dist/esm/tensor-factory.js"() {
      "use strict";
    }
  });

  // common/dist/esm/onnx-model.js
  var init_onnx_model = __esm({
    "common/dist/esm/onnx-model.js"() {
      "use strict";
    }
  });

  // common/dist/esm/onnx-value.js
  var init_onnx_value = __esm({
    "common/dist/esm/onnx-value.js"() {
      "use strict";
    }
  });

  // common/dist/esm/training-session-impl.js
  var noBackendErrMsg, TrainingSession;
  var init_training_session_impl = __esm({
    "common/dist/esm/training-session-impl.js"() {
      "use strict";
      init_backend_impl();
      init_tensor();
      noBackendErrMsg = "Training backend could not be resolved. Make sure you're using the correct configuration & WebAssembly files.";
      TrainingSession = class _TrainingSession {
        constructor(handler, hasOptimizerModel, hasEvalModel) {
          this.handler = handler;
          this.hasOptimizerModel = hasOptimizerModel;
          this.hasEvalModel = hasEvalModel;
        }
        get trainingInputNames() {
          return this.handler.inputNames;
        }
        get trainingOutputNames() {
          return this.handler.outputNames;
        }
        get evalInputNames() {
          if (this.hasEvalModel) {
            return this.handler.evalInputNames;
          } else {
            throw new Error("This training session has no evalModel loaded.");
          }
        }
        get evalOutputNames() {
          if (this.hasEvalModel) {
            return this.handler.evalOutputNames;
          } else {
            throw new Error("This training session has no evalModel loaded.");
          }
        }
        static async create(trainingOptions, sessionOptions) {
          const evalModel = trainingOptions.evalModel || "";
          const optimizerModel = trainingOptions.optimizerModel || "";
          const options = sessionOptions || {};
          const [backend, optionsWithValidatedEPs] = await resolveBackendAndExecutionProviders(options);
          if (backend.createTrainingSessionHandler) {
            const handler = await backend.createTrainingSessionHandler(trainingOptions.checkpointState, trainingOptions.trainModel, evalModel, optimizerModel, optionsWithValidatedEPs);
            return new _TrainingSession(handler, !!trainingOptions.optimizerModel, !!trainingOptions.evalModel);
          } else {
            throw new Error(noBackendErrMsg);
          }
        }
        /**
         * Helper function for runTrainStep and future runStep methods that handles the type-narrowing conversion from
         * the given parameters to SessionHandler.FetchesType and RunOptions.
         *
         * @param inputNames the feeds object is checked that they contain all input names in the provided list of input
         * names.
         * @param outputNames the fetches object is checked that their keys match up with valid names in the list of output
         * names.
         * @param feeds the required input
         * @param arg1 narrowed & converted into the SessionHandler.FetchesType or RunOptions object
         * @param arg2 optional RunOptions object.
         * @returns
         */
        typeNarrowingForRunStep(inputNames, outputNames, feeds, arg1, arg2) {
          const fetches = {};
          let options = {};
          if (typeof feeds !== "object" || feeds === null || feeds instanceof Tensor2 || Array.isArray(feeds)) {
            throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");
          }
          let isFetchesEmpty = true;
          if (typeof arg1 === "object") {
            if (arg1 === null) {
              throw new TypeError("Unexpected argument[1]: cannot be null.");
            }
            if (arg1 instanceof Tensor2) {
              throw new TypeError("'fetches' cannot be a Tensor");
            }
            if (Array.isArray(arg1)) {
              if (arg1.length === 0) {
                throw new TypeError("'fetches' cannot be an empty array.");
              }
              isFetchesEmpty = false;
              for (const name of arg1) {
                if (typeof name !== "string") {
                  throw new TypeError("'fetches' must be a string array or an object.");
                }
                if (outputNames.indexOf(name) === -1) {
                  throw new RangeError(`'fetches' contains invalid output name: ${name}.`);
                }
                fetches[name] = null;
              }
              if (typeof arg2 === "object" && arg2 !== null) {
                options = arg2;
              } else if (typeof arg2 !== "undefined") {
                throw new TypeError("'options' must be an object.");
              }
            } else {
              let isFetches = false;
              const arg1Keys = Object.getOwnPropertyNames(arg1);
              for (const name of outputNames) {
                if (arg1Keys.indexOf(name) !== -1) {
                  const v = arg1[name];
                  if (v === null || v instanceof Tensor2) {
                    isFetches = true;
                    isFetchesEmpty = false;
                    fetches[name] = v;
                  }
                }
              }
              if (isFetches) {
                if (typeof arg2 === "object" && arg2 !== null) {
                  options = arg2;
                } else if (typeof arg2 !== "undefined") {
                  throw new TypeError("'options' must be an object.");
                }
              } else {
                options = arg1;
              }
            }
          } else if (typeof arg1 !== "undefined") {
            throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");
          }
          for (const name of inputNames) {
            if (typeof feeds[name] === "undefined") {
              throw new Error(`input '${name}' is missing in 'feeds'.`);
            }
          }
          if (isFetchesEmpty) {
            for (const name of outputNames) {
              fetches[name] = null;
            }
          }
          return [fetches, options];
        }
        /**
         * Helper method for runTrainStep and any other runStep methods. Takes the ReturnType result from the SessionHandler
         * and changes it into a map of Tensors.
         *
         * @param results
         * @returns
         */
        convertHandlerReturnTypeToMapOfTensors(results) {
          const returnValue = {};
          for (const key in results) {
            if (Object.hasOwnProperty.call(results, key)) {
              const result = results[key];
              if (result instanceof Tensor2) {
                returnValue[key] = result;
              } else {
                returnValue[key] = new Tensor2(result.type, result.data, result.dims);
              }
            }
          }
          return returnValue;
        }
        async lazyResetGrad() {
          await this.handler.lazyResetGrad();
        }
        async runTrainStep(feeds, arg1, arg2) {
          const [fetches, options] = this.typeNarrowingForRunStep(this.trainingInputNames, this.trainingOutputNames, feeds, arg1, arg2);
          const results = await this.handler.runTrainStep(feeds, fetches, options);
          return this.convertHandlerReturnTypeToMapOfTensors(results);
        }
        async runOptimizerStep(options) {
          if (this.hasOptimizerModel) {
            await this.handler.runOptimizerStep(options || {});
          } else {
            throw new Error("This TrainingSession has no OptimizerModel loaded.");
          }
        }
        async runEvalStep(feeds, arg1, arg2) {
          if (this.hasEvalModel) {
            const [fetches, options] = this.typeNarrowingForRunStep(this.evalInputNames, this.evalOutputNames, feeds, arg1, arg2);
            const results = await this.handler.runEvalStep(feeds, fetches, options);
            return this.convertHandlerReturnTypeToMapOfTensors(results);
          } else {
            throw new Error("This TrainingSession has no EvalModel loaded.");
          }
        }
        async getParametersSize(trainableOnly = true) {
          return this.handler.getParametersSize(trainableOnly);
        }
        async loadParametersBuffer(array, trainableOnly = true) {
          const paramsSize = await this.getParametersSize(trainableOnly);
          if (array.length !== 4 * paramsSize) {
            throw new Error("Size of the buffer passed into loadParametersBuffer must match the number of parameters in the model. Please use getParametersSize method to check.");
          }
          return this.handler.loadParametersBuffer(array, trainableOnly);
        }
        async getContiguousParameters(trainableOnly = true) {
          return this.handler.getContiguousParameters(trainableOnly);
        }
        async release() {
          return this.handler.dispose();
        }
      };
    }
  });

  // common/dist/esm/training-session.js
  var TrainingSession2;
  var init_training_session = __esm({
    "common/dist/esm/training-session.js"() {
      "use strict";
      init_training_session_impl();
      TrainingSession2 = TrainingSession;
    }
  });

  // common/dist/esm/index.js
  var esm_exports = {};
  __export(esm_exports, {
    InferenceSession: () => InferenceSession2,
    TRACE: () => TRACE,
    TRACE_FUNC_BEGIN: () => TRACE_FUNC_BEGIN,
    TRACE_FUNC_END: () => TRACE_FUNC_END,
    Tensor: () => Tensor2,
    TrainingSession: () => TrainingSession2,
    env: () => env2,
    registerBackend: () => registerBackend
  });
  var init_esm = __esm({
    "common/dist/esm/index.js"() {
      "use strict";
      init_backend();
      init_env();
      init_inference_session();
      init_tensor();
      init_tensor_conversion();
      init_tensor_factory();
      init_trace();
      init_onnx_model();
      init_onnx_value();
      init_training_session();
    }
  });

  // nodejs-ignore:node:os
  var cpus;
  var init_node_os = __esm({
    "nodejs-ignore:node:os"() {
      cpus = void 0;
    }
  });

  // nodejs-ignore:fs
  var fs_exports = {};
  __export(fs_exports, {
    createReadStream: () => createReadStream,
    readFile: () => readFile,
    readFileSync: () => readFileSync
  });
  var readFile, readFileSync, createReadStream;
  var init_fs = __esm({
    "nodejs-ignore:fs"() {
      readFile = void 0;
      readFileSync = void 0;
      createReadStream = void 0;
    }
  });

  // nodejs-ignore:path
  var path_exports = {};
  __export(path_exports, {
    join: () => join
  });
  var join;
  var init_path = __esm({
    "nodejs-ignore:path"() {
      join = void 0;
    }
  });

  // web/lib/wasm/binding/ort-wasm.js
  var require_ort_wasm = __commonJS({
    "web/lib/wasm/binding/ort-wasm.js"(exports, module) {
      "use strict";
      var ortWasm = (() => {
        var _scriptDir = typeof document !== "undefined" && document.currentScript ? document.currentScript.src : void 0;
        if (typeof __filename !== "undefined")
          _scriptDir = _scriptDir || __filename;
        return function(moduleArg = {}) {
          var f = moduleArg, k, l;
          f.ready = new Promise((a, b) => {
            k = a;
            l = b;
          });
          var aa = Object.assign({}, f), ba = "./this.program", ca = "object" == typeof window, q = "function" == typeof importScripts, da = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node, v = "", x, z, A;
          if (da) {
            var fs = (init_fs(), __toCommonJS(fs_exports)), B = (init_path(), __toCommonJS(path_exports));
            v = q ? B.dirname(v) + "/" : __dirname + "/";
            x = (a, b) => {
              a = C(a) ? new URL(a) : B.normalize(a);
              return fs.readFileSync(a, b ? void 0 : "utf8");
            };
            A = (a) => {
              a = x(a, true);
              a.buffer || (a = new Uint8Array(a));
              return a;
            };
            z = (a, b, c, e = true) => {
              a = C(a) ? new URL(a) : B.normalize(a);
              fs.readFile(a, e ? void 0 : "utf8", (g, h) => {
                g ? c(g) : b(e ? h.buffer : h);
              });
            };
            !f.thisProgram && 1 < process.argv.length && (ba = process.argv[1].replace(/\\/g, "/"));
            process.argv.slice(2);
            f.inspect = () => "[Emscripten Module object]";
          } else if (ca || q)
            q ? v = self.location.href : "undefined" != typeof document && document.currentScript && (v = document.currentScript.src), _scriptDir && (v = _scriptDir), 0 !== v.indexOf("blob:") ? v = v.substr(0, v.replace(/[?#].*/, "").lastIndexOf("/") + 1) : v = "", x = (a) => {
              var b = new XMLHttpRequest();
              b.open("GET", a, false);
              b.send(null);
              return b.responseText;
            }, q && (A = (a) => {
              var b = new XMLHttpRequest();
              b.open("GET", a, false);
              b.responseType = "arraybuffer";
              b.send(null);
              return new Uint8Array(b.response);
            }), z = (a, b, c) => {
              var e = new XMLHttpRequest();
              e.open("GET", a, true);
              e.responseType = "arraybuffer";
              e.onload = () => {
                200 == e.status || 0 == e.status && e.response ? b(e.response) : c();
              };
              e.onerror = c;
              e.send(null);
            };
          var ea = console.log.bind(console), D = console.error.bind(console);
          Object.assign(f, aa);
          aa = null;
          "object" != typeof WebAssembly && E("no native wasm support detected");
          var F, fa = false, G, H, I, J, ha;
          function ia() {
            var a = F.buffer;
            f.HEAP8 = G = new Int8Array(a);
            f.HEAP16 = new Int16Array(a);
            f.HEAPU8 = H = new Uint8Array(a);
            f.HEAPU16 = new Uint16Array(a);
            f.HEAP32 = I = new Int32Array(a);
            f.HEAPU32 = J = new Uint32Array(a);
            f.HEAPF32 = new Float32Array(a);
            f.HEAPF64 = ha = new Float64Array(a);
          }
          var K = [], L = [], ja = [], M = 0, N = null, O = null;
          function E(a) {
            a = "Aborted(" + a + ")";
            D(a);
            fa = true;
            a = new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
            l(a);
            throw a;
          }
          var ka = (a) => a.startsWith("data:application/octet-stream;base64,"), C = (a) => a.startsWith("file://"), P;
          P = "ort-wasm.wasm";
          if (!ka(P)) {
            var la = P;
            P = f.locateFile ? f.locateFile(la, v) : v + la;
          }
          function ma(a) {
            if (A)
              return A(a);
            throw "both async and sync fetching of the wasm failed";
          }
          function na(a) {
            if (ca || q) {
              if ("function" == typeof fetch && !C(a))
                return fetch(a, { credentials: "same-origin" }).then((b) => {
                  if (!b.ok)
                    throw "failed to load wasm binary file at '" + a + "'";
                  return b.arrayBuffer();
                }).catch(() => ma(a));
              if (z)
                return new Promise((b, c) => {
                  z(a, (e) => b(new Uint8Array(e)), c);
                });
            }
            return Promise.resolve().then(() => ma(a));
          }
          function oa(a, b, c) {
            return na(a).then((e) => WebAssembly.instantiate(e, b)).then((e) => e).then(c, (e) => {
              D(`failed to asynchronously prepare wasm: ${e}`);
              E(e);
            });
          }
          function pa(a, b) {
            var c = P;
            return "function" != typeof WebAssembly.instantiateStreaming || ka(c) || C(c) || da || "function" != typeof fetch ? oa(c, a, b) : fetch(c, { credentials: "same-origin" }).then((e) => WebAssembly.instantiateStreaming(e, a).then(b, function(g) {
              D(`wasm streaming compile failed: ${g}`);
              D("falling back to ArrayBuffer instantiation");
              return oa(c, a, b);
            }));
          }
          var Q, qa = { 791728: (a, b, c, e) => {
            if ("undefined" == typeof f || !f.za)
              return 1;
            a = R(a >>> 0);
            a.startsWith("./") && (a = a.substring(2));
            a = f.za.get(a);
            if (!a)
              return 2;
            b >>>= 0;
            c >>>= 0;
            if (b + c > a.byteLength)
              return 3;
            try {
              return H.set(a.subarray(b, b + c), e >>> 0 >>> 0), 0;
            } catch {
              return 4;
            }
          } };
          function ra(a) {
            this.xa = a - 24;
            this.Ha = function(b) {
              J[this.xa + 4 >>> 2 >>> 0] = b;
            };
            this.Ga = function(b) {
              J[this.xa + 8 >>> 2 >>> 0] = b;
            };
            this.Aa = function(b, c) {
              this.Fa();
              this.Ha(b);
              this.Ga(c);
            };
            this.Fa = function() {
              J[this.xa + 16 >>> 2 >>> 0] = 0;
            };
          }
          var sa = 0, ta = 0, ua = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0, va = (a, b, c) => {
            b >>>= 0;
            var e = b + c;
            for (c = b; a[c] && !(c >= e); )
              ++c;
            if (16 < c - b && a.buffer && ua)
              return ua.decode(a.subarray(b, c));
            for (e = ""; b < c; ) {
              var g = a[b++];
              if (g & 128) {
                var h = a[b++] & 63;
                if (192 == (g & 224))
                  e += String.fromCharCode((g & 31) << 6 | h);
                else {
                  var m = a[b++] & 63;
                  g = 224 == (g & 240) ? (g & 15) << 12 | h << 6 | m : (g & 7) << 18 | h << 12 | m << 6 | a[b++] & 63;
                  65536 > g ? e += String.fromCharCode(g) : (g -= 65536, e += String.fromCharCode(55296 | g >> 10, 56320 | g & 1023));
                }
              } else
                e += String.fromCharCode(g);
            }
            return e;
          }, R = (a, b) => (a >>>= 0) ? va(H, a, b) : "", S = (a) => {
            for (var b = 0, c = 0; c < a.length; ++c) {
              var e = a.charCodeAt(c);
              127 >= e ? b++ : 2047 >= e ? b += 2 : 55296 <= e && 57343 >= e ? (b += 4, ++c) : b += 3;
            }
            return b;
          }, T = (a, b, c, e) => {
            c >>>= 0;
            if (!(0 < e))
              return 0;
            var g = c;
            e = c + e - 1;
            for (var h = 0; h < a.length; ++h) {
              var m = a.charCodeAt(h);
              if (55296 <= m && 57343 >= m) {
                var r = a.charCodeAt(++h);
                m = 65536 + ((m & 1023) << 10) | r & 1023;
              }
              if (127 >= m) {
                if (c >= e)
                  break;
                b[c++ >>> 0] = m;
              } else {
                if (2047 >= m) {
                  if (c + 1 >= e)
                    break;
                  b[c++ >>> 0] = 192 | m >> 6;
                } else {
                  if (65535 >= m) {
                    if (c + 2 >= e)
                      break;
                    b[c++ >>> 0] = 224 | m >> 12;
                  } else {
                    if (c + 3 >= e)
                      break;
                    b[c++ >>> 0] = 240 | m >> 18;
                    b[c++ >>> 0] = 128 | m >> 12 & 63;
                  }
                  b[c++ >>> 0] = 128 | m >> 6 & 63;
                }
                b[c++ >>> 0] = 128 | m & 63;
              }
            }
            b[c >>> 0] = 0;
            return c - g;
          }, U = (a) => 0 === a % 4 && (0 !== a % 100 || 0 === a % 400), wa = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], xa = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], Ca = (a) => {
            var b = S(a) + 1, c = Ba(b);
            c && T(a, H, c, b);
            return c;
          }, V = [], W = {}, Da = () => {
            if (!X) {
              var a = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: ("object" == typeof navigator && navigator.languages && navigator.languages[0] || "C").replace(
                "-",
                "_"
              ) + ".UTF-8", _: ba || "./this.program" }, b;
              for (b in W)
                void 0 === W[b] ? delete a[b] : a[b] = W[b];
              var c = [];
              for (b in a)
                c.push(`${b}=${a[b]}`);
              X = c;
            }
            return X;
          }, X, Ea = [null, [], []], Fa = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], Ga = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          function Ha(a) {
            var b = Array(S(a) + 1);
            T(a, b, 0, b.length);
            return b;
          }
          function Ia(a, b, c, e) {
            function g(d, n, p) {
              for (d = "number" == typeof d ? d.toString() : d || ""; d.length < n; )
                d = p[0] + d;
              return d;
            }
            function h(d, n) {
              return g(d, n, "0");
            }
            function m(d, n) {
              function p(ya) {
                return 0 > ya ? -1 : 0 < ya ? 1 : 0;
              }
              var y;
              0 === (y = p(d.getFullYear() - n.getFullYear())) && 0 === (y = p(d.getMonth() - n.getMonth())) && (y = p(d.getDate() - n.getDate()));
              return y;
            }
            function r(d) {
              switch (d.getDay()) {
                case 0:
                  return new Date(d.getFullYear() - 1, 11, 29);
                case 1:
                  return d;
                case 2:
                  return new Date(d.getFullYear(), 0, 3);
                case 3:
                  return new Date(
                    d.getFullYear(),
                    0,
                    2
                  );
                case 4:
                  return new Date(d.getFullYear(), 0, 1);
                case 5:
                  return new Date(d.getFullYear() - 1, 11, 31);
                case 6:
                  return new Date(d.getFullYear() - 1, 11, 30);
              }
            }
            function w(d) {
              var n = d.ta;
              for (d = new Date(new Date(d.ua + 1900, 0, 1).getTime()); 0 < n; ) {
                var p = d.getMonth(), y = (U(d.getFullYear()) ? Fa : Ga)[p];
                if (n > y - d.getDate())
                  n -= y - d.getDate() + 1, d.setDate(1), 11 > p ? d.setMonth(p + 1) : (d.setMonth(0), d.setFullYear(d.getFullYear() + 1));
                else {
                  d.setDate(d.getDate() + n);
                  break;
                }
              }
              p = new Date(d.getFullYear() + 1, 0, 4);
              n = r(new Date(
                d.getFullYear(),
                0,
                4
              ));
              p = r(p);
              return 0 >= m(n, d) ? 0 >= m(p, d) ? d.getFullYear() + 1 : d.getFullYear() : d.getFullYear() - 1;
            }
            a >>>= 0;
            b >>>= 0;
            c >>>= 0;
            e >>>= 0;
            var t = J[e + 40 >>> 2 >>> 0];
            e = { Da: I[e >>> 2 >>> 0], Ca: I[e + 4 >>> 2 >>> 0], va: I[e + 8 >>> 2 >>> 0], ya: I[e + 12 >>> 2 >>> 0], wa: I[e + 16 >>> 2 >>> 0], ua: I[e + 20 >>> 2 >>> 0], oa: I[e + 24 >>> 2 >>> 0], ta: I[e + 28 >>> 2 >>> 0], Ia: I[e + 32 >>> 2 >>> 0], Ba: I[e + 36 >>> 2 >>> 0], Ea: t ? R(t) : "" };
            c = R(c);
            t = {
              "%c": "%a %b %d %H:%M:%S %Y",
              "%D": "%m/%d/%y",
              "%F": "%Y-%m-%d",
              "%h": "%b",
              "%r": "%I:%M:%S %p",
              "%R": "%H:%M",
              "%T": "%H:%M:%S",
              "%x": "%m/%d/%y",
              "%X": "%H:%M:%S",
              "%Ec": "%c",
              "%EC": "%C",
              "%Ex": "%m/%d/%y",
              "%EX": "%H:%M:%S",
              "%Ey": "%y",
              "%EY": "%Y",
              "%Od": "%d",
              "%Oe": "%e",
              "%OH": "%H",
              "%OI": "%I",
              "%Om": "%m",
              "%OM": "%M",
              "%OS": "%S",
              "%Ou": "%u",
              "%OU": "%U",
              "%OV": "%V",
              "%Ow": "%w",
              "%OW": "%W",
              "%Oy": "%y"
            };
            for (var u in t)
              c = c.replace(new RegExp(u, "g"), t[u]);
            var za = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), Aa = "January February March April May June July August September October November December".split(" ");
            t = {
              "%a": (d) => za[d.oa].substring(0, 3),
              "%A": (d) => za[d.oa],
              "%b": (d) => Aa[d.wa].substring(0, 3),
              "%B": (d) => Aa[d.wa],
              "%C": (d) => h((d.ua + 1900) / 100 | 0, 2),
              "%d": (d) => h(d.ya, 2),
              "%e": (d) => g(d.ya, 2, " "),
              "%g": (d) => w(d).toString().substring(2),
              "%G": (d) => w(d),
              "%H": (d) => h(d.va, 2),
              "%I": (d) => {
                d = d.va;
                0 == d ? d = 12 : 12 < d && (d -= 12);
                return h(d, 2);
              },
              "%j": (d) => {
                for (var n = 0, p = 0; p <= d.wa - 1; n += (U(d.ua + 1900) ? Fa : Ga)[p++])
                  ;
                return h(d.ya + n, 3);
              },
              "%m": (d) => h(d.wa + 1, 2),
              "%M": (d) => h(d.Ca, 2),
              "%n": () => "\n",
              "%p": (d) => 0 <= d.va && 12 > d.va ? "AM" : "PM",
              "%S": (d) => h(d.Da, 2),
              "%t": () => "	",
              "%u": (d) => d.oa || 7,
              "%U": (d) => h(
                Math.floor((d.ta + 7 - d.oa) / 7),
                2
              ),
              "%V": (d) => {
                var n = Math.floor((d.ta + 7 - (d.oa + 6) % 7) / 7);
                2 >= (d.oa + 371 - d.ta - 2) % 7 && n++;
                if (n)
                  53 == n && (p = (d.oa + 371 - d.ta) % 7, 4 == p || 3 == p && U(d.ua) || (n = 1));
                else {
                  n = 52;
                  var p = (d.oa + 7 - d.ta - 1) % 7;
                  (4 == p || 5 == p && U(d.ua % 400 - 1)) && n++;
                }
                return h(n, 2);
              },
              "%w": (d) => d.oa,
              "%W": (d) => h(Math.floor((d.ta + 7 - (d.oa + 6) % 7) / 7), 2),
              "%y": (d) => (d.ua + 1900).toString().substring(2),
              "%Y": (d) => d.ua + 1900,
              "%z": (d) => {
                d = d.Ba;
                var n = 0 <= d;
                d = Math.abs(d) / 60;
                return (n ? "+" : "-") + String("0000" + (d / 60 * 100 + d % 60)).slice(-4);
              },
              "%Z": (d) => d.Ea,
              "%%": () => "%"
            };
            c = c.replace(/%%/g, "\0\0");
            for (u in t)
              c.includes(u) && (c = c.replace(new RegExp(u, "g"), t[u](e)));
            c = c.replace(/\0\0/g, "%");
            u = Ha(c);
            if (u.length > b)
              return 0;
            G.set(u, a >>> 0);
            return u.length - 1;
          }
          var La = { a: function(a, b, c) {
            a >>>= 0;
            new ra(a).Aa(b >>> 0, c >>> 0);
            sa = a;
            ta++;
            throw sa;
          }, e: function() {
            return 0;
          }, H: function() {
          }, x: function() {
          }, z: function() {
          }, J: function() {
            return 0;
          }, F: function() {
          }, A: function() {
          }, E: function() {
          }, g: function() {
          }, y: function() {
          }, v: function() {
          }, G: function() {
          }, w: function() {
          }, k: () => 1, n: function(a, b, c) {
            a = b + 2097152 >>> 0 < 4194305 - !!a ? (a >>> 0) + 4294967296 * b : NaN;
            c >>>= 0;
            a = new Date(1e3 * a);
            I[c >>> 2 >>> 0] = a.getUTCSeconds();
            I[c + 4 >>> 2 >>> 0] = a.getUTCMinutes();
            I[c + 8 >>> 2 >>> 0] = a.getUTCHours();
            I[c + 12 >>> 2 >>> 0] = a.getUTCDate();
            I[c + 16 >>> 2 >>> 0] = a.getUTCMonth();
            I[c + 20 >>> 2 >>> 0] = a.getUTCFullYear() - 1900;
            I[c + 24 >>> 2 >>> 0] = a.getUTCDay();
            I[c + 28 >>> 2 >>> 0] = (a.getTime() - Date.UTC(a.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864e5 | 0;
          }, o: function(a, b, c) {
            a = b + 2097152 >>> 0 < 4194305 - !!a ? (a >>> 0) + 4294967296 * b : NaN;
            c >>>= 0;
            a = new Date(1e3 * a);
            I[c >>> 2 >>> 0] = a.getSeconds();
            I[c + 4 >>> 2 >>> 0] = a.getMinutes();
            I[c + 8 >>> 2 >>> 0] = a.getHours();
            I[c + 12 >>> 2 >>> 0] = a.getDate();
            I[c + 16 >>> 2 >>> 0] = a.getMonth();
            I[c + 20 >>> 2 >>> 0] = a.getFullYear() - 1900;
            I[c + 24 >>> 2 >>> 0] = a.getDay();
            I[c + 28 >>> 2 >>> 0] = (U(a.getFullYear()) ? wa : xa)[a.getMonth()] + a.getDate() - 1 | 0;
            I[c + 36 >>> 2 >>> 0] = -(60 * a.getTimezoneOffset());
            b = new Date(a.getFullYear(), 6, 1).getTimezoneOffset();
            var e = new Date(a.getFullYear(), 0, 1).getTimezoneOffset();
            I[c + 32 >>> 2 >>> 0] = (b != e && a.getTimezoneOffset() == Math.min(e, b)) | 0;
          }, p: function(a) {
            a >>>= 0;
            var b = new Date(I[a + 20 >>> 2 >>> 0] + 1900, I[a + 16 >>> 2 >>> 0], I[a + 12 >>> 2 >>> 0], I[a + 8 >>> 2 >>> 0], I[a + 4 >>> 2 >>> 0], I[a >>> 2 >>> 0], 0), c = I[a + 32 >>> 2 >>> 0], e = b.getTimezoneOffset(), g = new Date(b.getFullYear(), 6, 1).getTimezoneOffset(), h = new Date(b.getFullYear(), 0, 1).getTimezoneOffset(), m = Math.min(h, g);
            0 > c ? I[a + 32 >>> 2 >>> 0] = Number(g != h && m == e) : 0 < c != (m == e) && (g = Math.max(h, g), b.setTime(b.getTime() + 6e4 * ((0 < c ? m : g) - e)));
            I[a + 24 >>> 2 >>> 0] = b.getDay();
            I[a + 28 >>> 2 >>> 0] = (U(b.getFullYear()) ? wa : xa)[b.getMonth()] + b.getDate() - 1 | 0;
            I[a >>> 2 >>> 0] = b.getSeconds();
            I[a + 4 >>> 2 >>> 0] = b.getMinutes();
            I[a + 8 >>> 2 >>> 0] = b.getHours();
            I[a + 12 >>> 2 >>> 0] = b.getDate();
            I[a + 16 >>> 2 >>> 0] = b.getMonth();
            I[a + 20 >>> 2 >>> 0] = b.getYear();
            a = b.getTime();
            isNaN(a) ? (I[Ja() >>> 2 >>> 0] = 61, a = -1) : a /= 1e3;
            return Ka((Q = a, 1 <= +Math.abs(Q) ? 0 < Q ? +Math.floor(Q / 4294967296) >>> 0 : ~~+Math.ceil((Q - +(~~Q >>> 0)) / 4294967296) >>> 0 : 0)), a >>> 0;
          }, l: function() {
            return -52;
          }, m: function() {
          }, t: function(a, b, c) {
            function e(w) {
              return (w = w.toTimeString().match(/\(([A-Za-z ]+)\)$/)) ? w[1] : "GMT";
            }
            c >>>= 0;
            var g = (/* @__PURE__ */ new Date()).getFullYear(), h = new Date(g, 0, 1), m = new Date(g, 6, 1);
            g = h.getTimezoneOffset();
            var r = m.getTimezoneOffset();
            J[a >>> 0 >>> 2 >>> 0] = 60 * Math.max(g, r);
            I[b >>> 0 >>> 2 >>> 0] = Number(g != r);
            a = e(h);
            b = e(m);
            a = Ca(a);
            b = Ca(b);
            r < g ? (J[c >>> 2 >>> 0] = a, J[c + 4 >>> 2 >>> 0] = b) : (J[c >>> 2 >>> 0] = b, J[c + 4 >>> 2 >>> 0] = a);
          }, d: () => {
            E("");
          }, B: function(a, b, c) {
            a >>>= 0;
            b >>>= 0;
            c >>>= 0;
            V.length = 0;
            for (var e; e = H[b++ >>> 0]; ) {
              var g = 105 != e;
              g &= 112 != e;
              c += g && c % 8 ? 4 : 0;
              V.push(112 == e ? J[c >>> 2 >>> 0] : 105 == e ? I[c >>> 2 >>> 0] : ha[c >>> 3 >>> 0]);
              c += g ? 8 : 4;
            }
            return qa[a].apply(null, V);
          }, h: () => Date.now(), u: function() {
            return 4294901760;
          }, b: () => performance.now(), I: function(a, b, c) {
            b >>>= 0;
            return H.copyWithin(a >>> 0 >>> 0, b >>> 0, b + (c >>> 0) >>> 0);
          }, s: function(a) {
            a >>>= 0;
            var b = H.length;
            if (4294901760 < a)
              return false;
            for (var c = 1; 4 >= c; c *= 2) {
              var e = b * (1 + 0.2 / c);
              e = Math.min(e, a + 100663296);
              var g = Math;
              e = Math.max(a, e);
              a: {
                g = (g.min.call(g, 4294901760, e + (65536 - e % 65536) % 65536) - F.buffer.byteLength + 65535) / 65536;
                try {
                  F.grow(g);
                  ia();
                  var h = 1;
                  break a;
                } catch (m) {
                }
                h = void 0;
              }
              if (h)
                return true;
            }
            return false;
          }, C: function(a, b) {
            a >>>= 0;
            b >>>= 0;
            var c = 0;
            Da().forEach((e, g) => {
              var h = b + c;
              g = J[a + 4 * g >>> 2 >>> 0] = h;
              for (h = 0; h < e.length; ++h)
                G[g++ >>> 0 >>> 0] = e.charCodeAt(h);
              G[g >>> 0 >>> 0] = 0;
              c += e.length + 1;
            });
            return 0;
          }, D: function(a, b) {
            a >>>= 0;
            b >>>= 0;
            var c = Da();
            J[a >>> 2 >>> 0] = c.length;
            var e = 0;
            c.forEach((g) => e += g.length + 1);
            J[b >>> 2 >>> 0] = e;
            return 0;
          }, f: () => 52, j: function() {
            return 52;
          }, q: function() {
            return 70;
          }, i: function(a, b, c, e) {
            b >>>= 0;
            c >>>= 0;
            e >>>= 0;
            for (var g = 0, h = 0; h < c; h++) {
              var m = J[b >>> 2 >>> 0], r = J[b + 4 >>> 2 >>> 0];
              b += 8;
              for (var w = 0; w < r; w++) {
                var t = H[m + w >>> 0], u = Ea[a];
                0 === t || 10 === t ? ((1 === a ? ea : D)(va(u, 0)), u.length = 0) : u.push(t);
              }
              g += r;
            }
            J[e >>> 2 >>> 0] = g;
            return 0;
          }, r: Ia, c: function(a, b, c, e) {
            return Ia(a >>> 0, b >>> 0, c >>> 0, e >>> 0);
          } }, Y = function() {
            function a(c) {
              Y = c.exports;
              Y = Ma();
              F = Y.K;
              ia();
              L.unshift(Y.L);
              M--;
              0 == M && (null !== N && (clearInterval(N), N = null), O && (c = O, O = null, c()));
              return Y;
            }
            var b = { a: La };
            M++;
            if (f.instantiateWasm)
              try {
                return f.instantiateWasm(b, a);
              } catch (c) {
                D(`Module.instantiateWasm callback failed with error: ${c}`), l(c);
              }
            pa(b, function(c) {
              a(c.instance);
            }).catch(l);
            return {};
          }();
          f._OrtInit = (a, b) => (f._OrtInit = Y.M)(a, b);
          f._OrtGetLastError = (a, b) => (f._OrtGetLastError = Y.N)(a, b);
          f._OrtCreateSessionOptions = (a, b, c, e, g, h, m, r, w, t) => (f._OrtCreateSessionOptions = Y.O)(a, b, c, e, g, h, m, r, w, t);
          f._OrtAppendExecutionProvider = (a, b) => (f._OrtAppendExecutionProvider = Y.P)(a, b);
          f._OrtAddFreeDimensionOverride = (a, b, c) => (f._OrtAddFreeDimensionOverride = Y.Q)(a, b, c);
          f._OrtAddSessionConfigEntry = (a, b, c) => (f._OrtAddSessionConfigEntry = Y.R)(a, b, c);
          f._OrtReleaseSessionOptions = (a) => (f._OrtReleaseSessionOptions = Y.S)(a);
          f._OrtCreateSession = (a, b, c) => (f._OrtCreateSession = Y.T)(a, b, c);
          f._OrtReleaseSession = (a) => (f._OrtReleaseSession = Y.U)(a);
          f._OrtGetInputOutputCount = (a, b, c) => (f._OrtGetInputOutputCount = Y.V)(a, b, c);
          f._OrtGetInputName = (a, b) => (f._OrtGetInputName = Y.W)(a, b);
          f._OrtGetOutputName = (a, b) => (f._OrtGetOutputName = Y.X)(a, b);
          f._OrtFree = (a) => (f._OrtFree = Y.Y)(a);
          f._OrtCreateTensor = (a, b, c, e, g, h) => (f._OrtCreateTensor = Y.Z)(a, b, c, e, g, h);
          f._OrtGetTensorData = (a, b, c, e, g) => (f._OrtGetTensorData = Y._)(a, b, c, e, g);
          f._OrtReleaseTensor = (a) => (f._OrtReleaseTensor = Y.$)(a);
          f._OrtCreateRunOptions = (a, b, c, e) => (f._OrtCreateRunOptions = Y.aa)(a, b, c, e);
          f._OrtAddRunConfigEntry = (a, b, c) => (f._OrtAddRunConfigEntry = Y.ba)(a, b, c);
          f._OrtReleaseRunOptions = (a) => (f._OrtReleaseRunOptions = Y.ca)(a);
          f._OrtCreateBinding = (a) => (f._OrtCreateBinding = Y.da)(a);
          f._OrtBindInput = (a, b, c) => (f._OrtBindInput = Y.ea)(a, b, c);
          f._OrtBindOutput = (a, b, c, e) => (f._OrtBindOutput = Y.fa)(a, b, c, e);
          f._OrtClearBoundOutputs = (a) => (f._OrtClearBoundOutputs = Y.ga)(a);
          f._OrtReleaseBinding = (a) => (f._OrtReleaseBinding = Y.ha)(a);
          f._OrtRunWithBinding = (a, b, c, e, g) => (f._OrtRunWithBinding = Y.ia)(a, b, c, e, g);
          f._OrtRun = (a, b, c, e, g, h, m, r) => (f._OrtRun = Y.ja)(a, b, c, e, g, h, m, r);
          f._OrtEndProfiling = (a) => (f._OrtEndProfiling = Y.ka)(a);
          var Ja = () => (Ja = Y.la)(), Ba = f._malloc = (a) => (Ba = f._malloc = Y.ma)(a);
          f._free = (a) => (f._free = Y.na)(a);
          var Ka = (a) => (Ka = Y.pa)(a), Na = () => (Na = Y.qa)(), Oa = (a) => (Oa = Y.ra)(a), Pa = (a) => (Pa = Y.sa)(a);
          function Ma() {
            var a = Y;
            a = Object.assign({}, a);
            var b = (e) => () => e() >>> 0, c = (e) => (g) => e(g) >>> 0;
            a.la = b(a.la);
            a.ma = c(a.ma);
            a.qa = b(a.qa);
            a.sa = c(a.sa);
            return a;
          }
          f.stackAlloc = Pa;
          f.stackSave = Na;
          f.stackRestore = Oa;
          f.UTF8ToString = R;
          f.stringToUTF8 = (a, b, c) => T(a, H, b, c);
          f.lengthBytesUTF8 = S;
          var Z;
          O = function Qa() {
            Z || Ra();
            Z || (O = Qa);
          };
          function Ra() {
            if (!(0 < M)) {
              if (f.preRun)
                for ("function" == typeof f.preRun && (f.preRun = [f.preRun]); f.preRun.length; ) {
                  var a = f.preRun.shift();
                  K.unshift(a);
                }
              for (; 0 < K.length; )
                K.shift()(f);
              if (!(0 < M || Z || (Z = true, f.calledRun = true, fa))) {
                for (; 0 < L.length; )
                  L.shift()(f);
                for (k(f); 0 < ja.length; )
                  ja.shift()(f);
              }
            }
          }
          Ra();
          return moduleArg.ready;
        };
      })();
      if (typeof exports === "object" && typeof module === "object")
        module.exports = ortWasm;
      else if (typeof define === "function" && define["amd"])
        define([], () => ortWasm);
    }
  });

  // web/lib/wasm/wasm-factory.ts
  var ortWasmFactory, ortWasmFactoryThreaded, wasm, initialized, initializing, aborted, isMultiThreadSupported, isSimdSupported, getWasmFileName, initializeWebAssembly, getInstance;
  var init_wasm_factory = __esm({
    "web/lib/wasm/wasm-factory.ts"() {
      "use strict";
      if (false) {
        ortWasmFactory = null;
      } else {
        ortWasmFactory = true ? require_ort_wasm() : null;
      }
      ortWasmFactoryThreaded = false ? true ? null : null : ortWasmFactory;
      initialized = false;
      initializing = false;
      aborted = false;
      isMultiThreadSupported = (numThreads) => {
        if (numThreads === 1) {
          return false;
        }
        if (typeof SharedArrayBuffer === "undefined") {
          if (typeof self !== "undefined" && !self.crossOriginIsolated) {
            console.warn(
              "env.wasm.numThreads is set to " + numThreads + ", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."
            );
          }
          return false;
        }
        if (typeof process !== "undefined" && process.versions && process.versions.node) {
          console.warn(
            "env.wasm.numThreads is set to " + numThreads + ", however, currently onnxruntime-web does not support multi-threads in Node.js. Please consider using onnxruntime-node for performance critical scenarios."
          );
        }
        try {
          if (typeof MessageChannel !== "undefined") {
            new MessageChannel().port1.postMessage(new SharedArrayBuffer(1));
          }
          return WebAssembly.validate(new Uint8Array([
            0,
            97,
            115,
            109,
            1,
            0,
            0,
            0,
            1,
            4,
            1,
            96,
            0,
            0,
            3,
            2,
            1,
            0,
            5,
            4,
            1,
            3,
            1,
            1,
            10,
            11,
            1,
            9,
            0,
            65,
            0,
            254,
            16,
            2,
            0,
            26,
            11
          ]));
        } catch (e) {
          return false;
        }
      };
      isSimdSupported = () => {
        try {
          return WebAssembly.validate(new Uint8Array([
            0,
            97,
            115,
            109,
            1,
            0,
            0,
            0,
            1,
            4,
            1,
            96,
            0,
            0,
            3,
            2,
            1,
            0,
            10,
            30,
            1,
            28,
            0,
            65,
            0,
            253,
            15,
            253,
            12,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            253,
            186,
            1,
            26,
            11
          ]));
        } catch (e) {
          return false;
        }
      };
      getWasmFileName = (useSimd, useThreads) => {
        if (useSimd) {
          if (false) {
            return "ort-training-wasm-simd.wasm";
          }
          return useThreads ? "ort-wasm-simd-threaded.wasm" : "ort-wasm-simd.wasm";
        } else {
          return useThreads ? "ort-wasm-threaded.wasm" : "ort-wasm.wasm";
        }
      };
      initializeWebAssembly = async (flags) => {
        if (initialized) {
          return Promise.resolve();
        }
        if (initializing) {
          throw new Error("multiple calls to 'initializeWebAssembly()' detected.");
        }
        if (aborted) {
          throw new Error("previous call to 'initializeWebAssembly()' failed.");
        }
        initializing = true;
        const timeout = flags.initTimeout;
        const numThreads = flags.numThreads;
        const simd = flags.simd;
        const useThreads = isMultiThreadSupported(numThreads);
        const useSimd = simd && isSimdSupported();
        const wasmPaths = flags.wasmPaths;
        const wasmPrefixOverride = typeof wasmPaths === "string" ? wasmPaths : void 0;
        const wasmFileName = getWasmFileName(useSimd, useThreads);
        const wasmPathOverride = typeof wasmPaths === "object" ? wasmPaths[wasmFileName] : void 0;
        let isTimeout = false;
        const tasks = [];
        if (timeout > 0) {
          tasks.push(new Promise((resolve) => {
            setTimeout(() => {
              isTimeout = true;
              resolve();
            }, timeout);
          }));
        }
        tasks.push(new Promise((resolve, reject) => {
          const factory = useThreads ? ortWasmFactoryThreaded : ortWasmFactory;
          const config = {
            locateFile: (fileName, scriptDirectory) => {
              if (false) {
                return URL.createObjectURL(new Blob(
                  [
                    // This require() function is handled by esbuild plugin to load file content as string.
                    // eslint-disable-next-line @typescript-eslint/no-require-imports
                    null
                  ],
                  { type: "text/javascript" }
                ));
              }
              if (fileName.endsWith(".wasm")) {
                if (wasmPathOverride) {
                  return wasmPathOverride;
                }
                const prefix = wasmPrefixOverride ?? scriptDirectory;
                if (false) {
                  if (wasmFileName === "ort-wasm-simd.wasm") {
                    return prefix + "ort-wasm-simd.jsep.wasm";
                  } else if (wasmFileName === "ort-wasm-simd-threaded.wasm") {
                    return prefix + "ort-wasm-simd-threaded.jsep.wasm";
                  }
                }
                return prefix + wasmFileName;
              }
              return scriptDirectory + fileName;
            }
          };
          if (false) {
            config.numThreads = numThreads;
            if (typeof Blob === "undefined") {
              config.mainScriptUrlOrBlob = join(__dirname, "ort-wasm-threaded.js");
            } else {
              const scriptSourceCode = `var ortWasmThreaded=${factory.toString()};`;
              config.mainScriptUrlOrBlob = new Blob([scriptSourceCode], { type: "text/javascript" });
            }
          }
          factory(config).then(
            // wasm module initialized successfully
            (module) => {
              initializing = false;
              initialized = true;
              wasm = module;
              resolve();
            },
            // wasm module failed to initialize
            (what) => {
              initializing = false;
              aborted = true;
              reject(what);
            }
          );
        }));
        await Promise.race(tasks);
        if (isTimeout) {
          throw new Error(`WebAssembly backend initializing failed due to timeout: ${timeout}ms`);
        }
      };
      getInstance = () => {
        if (initialized && wasm) {
          return wasm;
        }
        throw new Error("WebAssembly is not initialized yet.");
      };
    }
  });

  // web/lib/wasm/wasm-utils.ts
  var allocWasmString, iterateExtraOptions, checkLastError;
  var init_wasm_utils = __esm({
    "web/lib/wasm/wasm-utils.ts"() {
      "use strict";
      init_wasm_factory();
      allocWasmString = (data, allocs) => {
        const wasm2 = getInstance();
        const dataLength = wasm2.lengthBytesUTF8(data) + 1;
        const dataOffset = wasm2._malloc(dataLength);
        wasm2.stringToUTF8(data, dataOffset, dataLength);
        allocs.push(dataOffset);
        return dataOffset;
      };
      iterateExtraOptions = (options, prefix, seen, handler) => {
        if (typeof options == "object" && options !== null) {
          if (seen.has(options)) {
            throw new Error("Circular reference in options");
          } else {
            seen.add(options);
          }
        }
        Object.entries(options).forEach(([key, value]) => {
          const name = prefix ? prefix + key : key;
          if (typeof value === "object") {
            iterateExtraOptions(value, name + ".", seen, handler);
          } else if (typeof value === "string" || typeof value === "number") {
            handler(name, value.toString());
          } else if (typeof value === "boolean") {
            handler(name, value ? "1" : "0");
          } else {
            throw new Error(`Can't handle extra config type: ${typeof value}`);
          }
        });
      };
      checkLastError = (message) => {
        const wasm2 = getInstance();
        const stack = wasm2.stackSave();
        try {
          const paramsOffset = wasm2.stackAlloc(8);
          wasm2._OrtGetLastError(paramsOffset, paramsOffset + 4);
          const errorCode = wasm2.HEAP32[paramsOffset / 4];
          const errorMessagePointer = wasm2.HEAPU32[paramsOffset / 4 + 1];
          const errorMessage = errorMessagePointer ? wasm2.UTF8ToString(errorMessagePointer) : "";
          throw new Error(`${message} ERROR_CODE: ${errorCode}, ERROR_MESSAGE: ${errorMessage}`);
        } finally {
          wasm2.stackRestore(stack);
        }
      };
    }
  });

  // web/lib/wasm/run-options.ts
  var setRunOptions;
  var init_run_options = __esm({
    "web/lib/wasm/run-options.ts"() {
      "use strict";
      init_wasm_factory();
      init_wasm_utils();
      setRunOptions = (options) => {
        const wasm2 = getInstance();
        let runOptionsHandle = 0;
        const allocs = [];
        const runOptions = options || {};
        try {
          if (options?.logSeverityLevel === void 0) {
            runOptions.logSeverityLevel = 2;
          } else if (typeof options.logSeverityLevel !== "number" || !Number.isInteger(options.logSeverityLevel) || options.logSeverityLevel < 0 || options.logSeverityLevel > 4) {
            throw new Error(`log serverity level is not valid: ${options.logSeverityLevel}`);
          }
          if (options?.logVerbosityLevel === void 0) {
            runOptions.logVerbosityLevel = 0;
          } else if (typeof options.logVerbosityLevel !== "number" || !Number.isInteger(options.logVerbosityLevel)) {
            throw new Error(`log verbosity level is not valid: ${options.logVerbosityLevel}`);
          }
          if (options?.terminate === void 0) {
            runOptions.terminate = false;
          }
          let tagDataOffset = 0;
          if (options?.tag !== void 0) {
            tagDataOffset = allocWasmString(options.tag, allocs);
          }
          runOptionsHandle = wasm2._OrtCreateRunOptions(
            runOptions.logSeverityLevel,
            runOptions.logVerbosityLevel,
            !!runOptions.terminate,
            tagDataOffset
          );
          if (runOptionsHandle === 0) {
            checkLastError("Can't create run options.");
          }
          if (options?.extra !== void 0) {
            iterateExtraOptions(options.extra, "", /* @__PURE__ */ new WeakSet(), (key, value) => {
              const keyDataOffset = allocWasmString(key, allocs);
              const valueDataOffset = allocWasmString(value, allocs);
              if (wasm2._OrtAddRunConfigEntry(runOptionsHandle, keyDataOffset, valueDataOffset) !== 0) {
                checkLastError(`Can't set a run config entry: ${key} - ${value}.`);
              }
            });
          }
          return [runOptionsHandle, allocs];
        } catch (e) {
          if (runOptionsHandle !== 0) {
            wasm2._OrtReleaseRunOptions(runOptionsHandle);
          }
          allocs.forEach((alloc) => wasm2._free(alloc));
          throw e;
        }
      };
    }
  });

  // web/lib/wasm/session-options.ts
  var getGraphOptimzationLevel, getExecutionMode, appendDefaultOptions, setExecutionProviders, setSessionOptions;
  var init_session_options = __esm({
    "web/lib/wasm/session-options.ts"() {
      "use strict";
      init_wasm_factory();
      init_wasm_utils();
      getGraphOptimzationLevel = (graphOptimizationLevel) => {
        switch (graphOptimizationLevel) {
          case "disabled":
            return 0;
          case "basic":
            return 1;
          case "extended":
            return 2;
          case "all":
            return 99;
          default:
            throw new Error(`unsupported graph optimization level: ${graphOptimizationLevel}`);
        }
      };
      getExecutionMode = (executionMode) => {
        switch (executionMode) {
          case "sequential":
            return 0;
          case "parallel":
            return 1;
          default:
            throw new Error(`unsupported execution mode: ${executionMode}`);
        }
      };
      appendDefaultOptions = (options) => {
        if (!options.extra) {
          options.extra = {};
        }
        if (!options.extra.session) {
          options.extra.session = {};
        }
        const session = options.extra.session;
        if (!session.use_ort_model_bytes_directly) {
          session.use_ort_model_bytes_directly = "1";
        }
        if (options.executionProviders && options.executionProviders.some((ep) => (typeof ep === "string" ? ep : ep.name) === "webgpu")) {
          options.enableMemPattern = false;
        }
      };
      setExecutionProviders = (sessionOptionsHandle, executionProviders, allocs) => {
        for (const ep of executionProviders) {
          let epName = typeof ep === "string" ? ep : ep.name;
          switch (epName) {
            case "webnn":
              epName = "WEBNN";
              if (typeof ep !== "string") {
                const webnnOptions = ep;
                if (webnnOptions?.deviceType) {
                  const keyDataOffset = allocWasmString("deviceType", allocs);
                  const valueDataOffset = allocWasmString(webnnOptions.deviceType, allocs);
                  if (getInstance()._OrtAddSessionConfigEntry(sessionOptionsHandle, keyDataOffset, valueDataOffset) !== 0) {
                    checkLastError(`Can't set a session config entry: 'deviceType' - ${webnnOptions.deviceType}.`);
                  }
                }
                if (webnnOptions?.numThreads) {
                  let numThreads = webnnOptions.numThreads;
                  if (typeof numThreads != "number" || !Number.isInteger(numThreads) || numThreads < 0) {
                    numThreads = 0;
                  }
                  const keyDataOffset = allocWasmString("numThreads", allocs);
                  const valueDataOffset = allocWasmString(numThreads.toString(), allocs);
                  if (getInstance()._OrtAddSessionConfigEntry(sessionOptionsHandle, keyDataOffset, valueDataOffset) !== 0) {
                    checkLastError(`Can't set a session config entry: 'numThreads' - ${webnnOptions.numThreads}.`);
                  }
                }
                if (webnnOptions?.powerPreference) {
                  const keyDataOffset = allocWasmString("powerPreference", allocs);
                  const valueDataOffset = allocWasmString(webnnOptions.powerPreference, allocs);
                  if (getInstance()._OrtAddSessionConfigEntry(sessionOptionsHandle, keyDataOffset, valueDataOffset) !== 0) {
                    checkLastError(
                      `Can't set a session config entry: 'powerPreference' - ${webnnOptions.powerPreference}.`
                    );
                  }
                }
              }
              break;
            case "webgpu":
              epName = "JS";
              if (typeof ep !== "string") {
                const webgpuOptions = ep;
                if (webgpuOptions?.preferredLayout) {
                  if (webgpuOptions.preferredLayout !== "NCHW" && webgpuOptions.preferredLayout !== "NHWC") {
                    throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${webgpuOptions.preferredLayout}`);
                  }
                  const keyDataOffset = allocWasmString("preferredLayout", allocs);
                  const valueDataOffset = allocWasmString(webgpuOptions.preferredLayout, allocs);
                  if (getInstance()._OrtAddSessionConfigEntry(sessionOptionsHandle, keyDataOffset, valueDataOffset) !== 0) {
                    checkLastError(
                      `Can't set a session config entry: 'preferredLayout' - ${webgpuOptions.preferredLayout}.`
                    );
                  }
                }
              }
              break;
            case "wasm":
            case "cpu":
              continue;
            default:
              throw new Error(`not supported execution provider: ${epName}`);
          }
          const epNameDataOffset = allocWasmString(epName, allocs);
          if (getInstance()._OrtAppendExecutionProvider(sessionOptionsHandle, epNameDataOffset) !== 0) {
            checkLastError(`Can't append execution provider: ${epName}.`);
          }
        }
      };
      setSessionOptions = (options) => {
        const wasm2 = getInstance();
        let sessionOptionsHandle = 0;
        const allocs = [];
        const sessionOptions = options || {};
        appendDefaultOptions(sessionOptions);
        try {
          const graphOptimizationLevel = getGraphOptimzationLevel(sessionOptions.graphOptimizationLevel ?? "all");
          const executionMode = getExecutionMode(sessionOptions.executionMode ?? "sequential");
          const logIdDataOffset = typeof sessionOptions.logId === "string" ? allocWasmString(sessionOptions.logId, allocs) : 0;
          const logSeverityLevel = sessionOptions.logSeverityLevel ?? 2;
          if (!Number.isInteger(logSeverityLevel) || logSeverityLevel < 0 || logSeverityLevel > 4) {
            throw new Error(`log serverity level is not valid: ${logSeverityLevel}`);
          }
          const logVerbosityLevel = sessionOptions.logVerbosityLevel ?? 0;
          if (!Number.isInteger(logVerbosityLevel) || logVerbosityLevel < 0 || logVerbosityLevel > 4) {
            throw new Error(`log verbosity level is not valid: ${logVerbosityLevel}`);
          }
          const optimizedModelFilePathOffset = typeof sessionOptions.optimizedModelFilePath === "string" ? allocWasmString(sessionOptions.optimizedModelFilePath, allocs) : 0;
          sessionOptionsHandle = wasm2._OrtCreateSessionOptions(
            graphOptimizationLevel,
            !!sessionOptions.enableCpuMemArena,
            !!sessionOptions.enableMemPattern,
            executionMode,
            !!sessionOptions.enableProfiling,
            0,
            logIdDataOffset,
            logSeverityLevel,
            logVerbosityLevel,
            optimizedModelFilePathOffset
          );
          if (sessionOptionsHandle === 0) {
            checkLastError("Can't create session options.");
          }
          if (sessionOptions.executionProviders) {
            setExecutionProviders(sessionOptionsHandle, sessionOptions.executionProviders, allocs);
          }
          if (sessionOptions.enableGraphCapture !== void 0) {
            if (typeof sessionOptions.enableGraphCapture !== "boolean") {
              throw new Error(`enableGraphCapture must be a boolean value: ${sessionOptions.enableGraphCapture}`);
            }
            const keyDataOffset = allocWasmString("enableGraphCapture", allocs);
            const valueDataOffset = allocWasmString(sessionOptions.enableGraphCapture.toString(), allocs);
            if (wasm2._OrtAddSessionConfigEntry(sessionOptionsHandle, keyDataOffset, valueDataOffset) !== 0) {
              checkLastError(
                `Can't set a session config entry: 'enableGraphCapture' - ${sessionOptions.enableGraphCapture}.`
              );
            }
          }
          if (sessionOptions.freeDimensionOverrides) {
            for (const [name, value] of Object.entries(sessionOptions.freeDimensionOverrides)) {
              if (typeof name !== "string") {
                throw new Error(`free dimension override name must be a string: ${name}`);
              }
              if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
                throw new Error(`free dimension override value must be a non-negative integer: ${value}`);
              }
              const nameOffset = allocWasmString(name, allocs);
              if (wasm2._OrtAddFreeDimensionOverride(sessionOptionsHandle, nameOffset, value) !== 0) {
                checkLastError(`Can't set a free dimension override: ${name} - ${value}.`);
              }
            }
          }
          if (sessionOptions.extra !== void 0) {
            iterateExtraOptions(sessionOptions.extra, "", /* @__PURE__ */ new WeakSet(), (key, value) => {
              const keyDataOffset = allocWasmString(key, allocs);
              const valueDataOffset = allocWasmString(value, allocs);
              if (wasm2._OrtAddSessionConfigEntry(sessionOptionsHandle, keyDataOffset, valueDataOffset) !== 0) {
                checkLastError(`Can't set a session config entry: ${key} - ${value}.`);
              }
            });
          }
          return [sessionOptionsHandle, allocs];
        } catch (e) {
          if (sessionOptionsHandle !== 0) {
            wasm2._OrtReleaseSessionOptions(sessionOptionsHandle);
          }
          allocs.forEach((alloc) => wasm2._free(alloc));
          throw e;
        }
      };
    }
  });

  // web/lib/wasm/wasm-common.ts
  var tensorDataTypeStringToEnum, tensorDataTypeEnumToString, getTensorElementSize, tensorTypeToTypedArrayConstructor, logLevelStringToEnum, isGpuBufferSupportedType, dataLocationStringToEnum;
  var init_wasm_common = __esm({
    "web/lib/wasm/wasm-common.ts"() {
      "use strict";
      tensorDataTypeStringToEnum = (type) => {
        switch (type) {
          case "int8":
            return 3 /* int8 */;
          case "uint8":
            return 2 /* uint8 */;
          case "bool":
            return 9 /* bool */;
          case "int16":
            return 5 /* int16 */;
          case "uint16":
            return 4 /* uint16 */;
          case "int32":
            return 6 /* int32 */;
          case "uint32":
            return 12 /* uint32 */;
          case "float16":
            return 10 /* float16 */;
          case "float32":
            return 1 /* float */;
          case "float64":
            return 11 /* double */;
          case "string":
            return 8 /* string */;
          case "int64":
            return 7 /* int64 */;
          case "uint64":
            return 13 /* uint64 */;
          default:
            throw new Error(`unsupported data type: ${type}`);
        }
      };
      tensorDataTypeEnumToString = (typeProto) => {
        switch (typeProto) {
          case 3 /* int8 */:
            return "int8";
          case 2 /* uint8 */:
            return "uint8";
          case 9 /* bool */:
            return "bool";
          case 5 /* int16 */:
            return "int16";
          case 4 /* uint16 */:
            return "uint16";
          case 6 /* int32 */:
            return "int32";
          case 12 /* uint32 */:
            return "uint32";
          case 10 /* float16 */:
            return "float16";
          case 1 /* float */:
            return "float32";
          case 11 /* double */:
            return "float64";
          case 8 /* string */:
            return "string";
          case 7 /* int64 */:
            return "int64";
          case 13 /* uint64 */:
            return "uint64";
          default:
            throw new Error(`unsupported data type: ${typeProto}`);
        }
      };
      getTensorElementSize = (dateType) => [void 0, 4, 1, 1, 2, 2, 4, 8, void 0, 1, 2, 8, 4, 8, void 0, void 0, void 0][dateType];
      tensorTypeToTypedArrayConstructor = (type) => {
        switch (type) {
          case "float16":
            return typeof Float16Array !== "undefined" && Float16Array.from ? Float16Array : Uint16Array;
          case "float32":
            return Float32Array;
          case "uint8":
            return Uint8Array;
          case "int8":
            return Int8Array;
          case "uint16":
            return Uint16Array;
          case "int16":
            return Int16Array;
          case "int32":
            return Int32Array;
          case "bool":
            return Uint8Array;
          case "float64":
            return Float64Array;
          case "uint32":
            return Uint32Array;
          case "int64":
            return BigInt64Array;
          case "uint64":
            return BigUint64Array;
          default:
            throw new Error(`unsupported type: ${type}`);
        }
      };
      logLevelStringToEnum = (logLevel) => {
        switch (logLevel) {
          case "verbose":
            return 0;
          case "info":
            return 1;
          case "warning":
            return 2;
          case "error":
            return 3;
          case "fatal":
            return 4;
          default:
            throw new Error(`unsupported logging level: ${logLevel}`);
        }
      };
      isGpuBufferSupportedType = (type) => type === "float32" || type === "float16" || type === "int32" || type === "int64" || type === "uint32" || type === "uint8" || type === "bool";
      dataLocationStringToEnum = (location) => {
        switch (location) {
          case "none":
            return 0;
          case "cpu":
            return 1;
          case "cpu-pinned":
            return 2;
          case "texture":
            return 3;
          case "gpu-buffer":
            return 4;
          default:
            throw new Error(`unsupported data location: ${location}`);
        }
      };
    }
  });

  // nodejs-ignore:node:fs/promises
  var readFile2;
  var init_promises = __esm({
    "nodejs-ignore:node:fs/promises"() {
      readFile2 = void 0;
    }
  });

  // web/lib/wasm/wasm-utils-load-file.ts
  var loadFile;
  var init_wasm_utils_load_file = __esm({
    "web/lib/wasm/wasm-utils-load-file.ts"() {
      "use strict";
      init_fs();
      init_promises();
      loadFile = async (file) => {
        if (typeof file === "string") {
          if (typeof process !== "undefined" && process.versions && process.versions.node) {
            try {
              return new Uint8Array(await readFile2(file));
            } catch (e) {
              if (e.code === "ERR_FS_FILE_TOO_LARGE") {
                const stream = createReadStream(file);
                const chunks = [];
                for await (const chunk of stream) {
                  chunks.push(chunk);
                }
                return new Uint8Array(Buffer.concat(chunks));
              }
              throw e;
            }
          } else {
            const response = await fetch(file);
            if (!response.ok) {
              throw new Error(`failed to load external data file: ${file}`);
            }
            const contentLengthHeader = response.headers.get("Content-Length");
            const fileSize = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0;
            if (fileSize < 1073741824) {
              return new Uint8Array(await response.arrayBuffer());
            } else {
              if (!response.body) {
                throw new Error(`failed to load external data file: ${file}, no response body.`);
              }
              const reader = response.body.getReader();
              let buffer;
              try {
                buffer = new ArrayBuffer(fileSize);
              } catch (e) {
                if (e instanceof RangeError) {
                  const pages = Math.ceil(fileSize / 65536);
                  buffer = new WebAssembly.Memory({ initial: pages, maximum: pages }).buffer;
                } else {
                  throw e;
                }
              }
              let offset = 0;
              while (true) {
                const { done, value } = await reader.read();
                if (done) {
                  break;
                }
                const chunkSize = value.byteLength;
                const chunk = new Uint8Array(buffer, offset, chunkSize);
                chunk.set(value);
                offset += chunkSize;
              }
              return new Uint8Array(buffer, 0, fileSize);
            }
          }
        } else if (file instanceof Blob) {
          return new Uint8Array(await file.arrayBuffer());
        } else if (file instanceof Uint8Array) {
          return file;
        } else {
          return new Uint8Array(file);
        }
      };
    }
  });

  // web/lib/wasm/wasm-core-impl.ts
  var initOrt, initRuntime, initEp, activeSessions, getSessionInputOutputCount, copyFromExternalBuffer, createSession, releaseSession, prepareInputOutputTensor, run, endProfiling;
  var init_wasm_core_impl = __esm({
    "web/lib/wasm/wasm-core-impl.ts"() {
      "use strict";
      init_run_options();
      init_session_options();
      init_wasm_common();
      init_wasm_factory();
      init_wasm_utils();
      init_wasm_utils_load_file();
      initOrt = (numThreads, loggingLevel) => {
        const errorCode = getInstance()._OrtInit(numThreads, loggingLevel);
        if (errorCode !== 0) {
          checkLastError("Can't initialize onnxruntime.");
        }
      };
      initRuntime = async (env3) => {
        initOrt(env3.wasm.numThreads, logLevelStringToEnum(env3.logLevel));
      };
      initEp = async (env3, epName) => {
        if (false) {
          const initJsep = null.init;
          if (epName === "webgpu") {
            if (typeof navigator === "undefined" || !navigator.gpu) {
              throw new Error("WebGPU is not supported in current environment");
            }
            let adapter = env3.webgpu.adapter;
            if (!adapter) {
              const powerPreference = env3.webgpu.powerPreference;
              if (powerPreference !== void 0 && powerPreference !== "low-power" && powerPreference !== "high-performance") {
                throw new Error(`Invalid powerPreference setting: "${powerPreference}"`);
              }
              const forceFallbackAdapter = env3.webgpu.forceFallbackAdapter;
              if (forceFallbackAdapter !== void 0 && typeof forceFallbackAdapter !== "boolean") {
                throw new Error(`Invalid forceFallbackAdapter setting: "${forceFallbackAdapter}"`);
              }
              adapter = await navigator.gpu.requestAdapter({ powerPreference, forceFallbackAdapter });
              if (!adapter) {
                throw new Error(
                  'Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.'
                );
              }
            } else {
              if (typeof adapter.limits !== "object" || typeof adapter.features !== "object" || typeof adapter.requestDevice !== "function") {
                throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.");
              }
            }
            if (!env3.wasm.simd) {
              throw new Error(
                "Not supported for WebGPU=ON and SIMD=OFF. Please set `env.wasm.simd` to true when using `webgpu` EP"
              );
            }
            await initJsep("webgpu", getInstance(), env3, adapter);
          }
          if (epName === "webnn") {
            if (typeof navigator === "undefined" || !navigator.ml) {
              throw new Error("WebNN is not supported in current environment");
            }
            await initJsep("webnn", getInstance(), env3);
          }
        }
      };
      activeSessions = /* @__PURE__ */ new Map();
      getSessionInputOutputCount = (sessionHandle) => {
        const wasm2 = getInstance();
        const stack = wasm2.stackSave();
        try {
          const dataOffset = wasm2.stackAlloc(8);
          const errorCode = wasm2._OrtGetInputOutputCount(sessionHandle, dataOffset, dataOffset + 4);
          if (errorCode !== 0) {
            checkLastError("Can't get session input/output count.");
          }
          return [wasm2.HEAP32[dataOffset / 4], wasm2.HEAP32[dataOffset / 4 + 1]];
        } finally {
          wasm2.stackRestore(stack);
        }
      };
      copyFromExternalBuffer = (model) => {
        const wasm2 = getInstance();
        const modelDataOffset = wasm2._malloc(model.byteLength);
        if (modelDataOffset === 0) {
          throw new Error(`Can't create a session. failed to allocate a buffer of size ${model.byteLength}.`);
        }
        wasm2.HEAPU8.set(model, modelDataOffset);
        return [modelDataOffset, model.byteLength];
      };
      createSession = async (modelData, options) => {
        let modelDataOffset, modelDataLength;
        const wasm2 = getInstance();
        if (Array.isArray(modelData)) {
          [modelDataOffset, modelDataLength] = modelData;
        } else if (modelData.buffer === wasm2.HEAPU8.buffer) {
          [modelDataOffset, modelDataLength] = [modelData.byteOffset, modelData.byteLength];
        } else {
          [modelDataOffset, modelDataLength] = copyFromExternalBuffer(modelData);
        }
        let sessionHandle = 0;
        let sessionOptionsHandle = 0;
        let ioBindingHandle = 0;
        let allocs = [];
        const inputNamesUTF8Encoded = [];
        const outputNamesUTF8Encoded = [];
        try {
          [sessionOptionsHandle, allocs] = setSessionOptions(options);
          if (options?.externalData && wasm2.mountExternalData) {
            const loadingPromises = [];
            for (const file of options.externalData) {
              const path = typeof file === "string" ? file : file.path;
              loadingPromises.push(loadFile(typeof file === "string" ? file : file.data).then((data) => {
                wasm2.mountExternalData(path, data);
              }));
            }
            await Promise.all(loadingPromises);
          }
          sessionHandle = await wasm2._OrtCreateSession(modelDataOffset, modelDataLength, sessionOptionsHandle);
          if (sessionHandle === 0) {
            checkLastError("Can't create a session.");
          }
          const [inputCount, outputCount] = getSessionInputOutputCount(sessionHandle);
          const enableGraphCapture = !!options?.enableGraphCapture;
          const inputNames = [];
          const outputNames = [];
          const outputPreferredLocations = [];
          for (let i = 0; i < inputCount; i++) {
            const name = wasm2._OrtGetInputName(sessionHandle, i);
            if (name === 0) {
              checkLastError("Can't get an input name.");
            }
            inputNamesUTF8Encoded.push(name);
            inputNames.push(wasm2.UTF8ToString(name));
          }
          for (let i = 0; i < outputCount; i++) {
            const name = wasm2._OrtGetOutputName(sessionHandle, i);
            if (name === 0) {
              checkLastError("Can't get an output name.");
            }
            outputNamesUTF8Encoded.push(name);
            const nameString = wasm2.UTF8ToString(name);
            outputNames.push(nameString);
            if (false) {
              if (enableGraphCapture && options?.preferredOutputLocation === void 0) {
                outputPreferredLocations.push("gpu-buffer");
                continue;
              }
              const location = typeof options?.preferredOutputLocation === "string" ? options.preferredOutputLocation : options?.preferredOutputLocation?.[nameString] ?? "cpu";
              if (location !== "cpu" && location !== "cpu-pinned" && location !== "gpu-buffer") {
                throw new Error(`Not supported preferred output location: ${location}.`);
              }
              if (enableGraphCapture && location !== "gpu-buffer") {
                throw new Error(`Not supported preferred output location: ${location}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);
              }
              outputPreferredLocations.push(location);
            }
          }
          let bindingState = null;
          if (false) {
            ioBindingHandle = wasm2._OrtCreateBinding(sessionHandle);
            if (ioBindingHandle === 0) {
              checkLastError("Can't create IO binding.");
            }
            bindingState = {
              handle: ioBindingHandle,
              outputPreferredLocations,
              outputPreferredLocationsEncoded: outputPreferredLocations.map((l) => dataLocationStringToEnum(l))
            };
          }
          activeSessions.set(
            sessionHandle,
            [sessionHandle, inputNamesUTF8Encoded, outputNamesUTF8Encoded, bindingState, enableGraphCapture, false]
          );
          return [sessionHandle, inputNames, outputNames];
        } catch (e) {
          inputNamesUTF8Encoded.forEach((buf) => wasm2._OrtFree(buf));
          outputNamesUTF8Encoded.forEach((buf) => wasm2._OrtFree(buf));
          if (ioBindingHandle !== 0) {
            wasm2._OrtReleaseBinding(ioBindingHandle);
          }
          if (sessionHandle !== 0) {
            wasm2._OrtReleaseSession(sessionHandle);
          }
          throw e;
        } finally {
          wasm2._free(modelDataOffset);
          if (sessionOptionsHandle !== 0) {
            wasm2._OrtReleaseSessionOptions(sessionOptionsHandle);
          }
          allocs.forEach((alloc) => wasm2._free(alloc));
          wasm2.unmountExternalData?.();
        }
      };
      releaseSession = (sessionId) => {
        const wasm2 = getInstance();
        const session = activeSessions.get(sessionId);
        if (!session) {
          throw new Error(`cannot release session. invalid session id: ${sessionId}`);
        }
        const [sessionHandle, inputNamesUTF8Encoded, outputNamesUTF8Encoded, ioBindingState, enableGraphCapture] = session;
        if (ioBindingState) {
          if (enableGraphCapture) {
            wasm2._OrtClearBoundOutputs(ioBindingState.handle);
          }
          wasm2._OrtReleaseBinding(ioBindingState.handle);
        }
        wasm2.jsepOnReleaseSession?.(sessionId);
        inputNamesUTF8Encoded.forEach((buf) => wasm2._OrtFree(buf));
        outputNamesUTF8Encoded.forEach((buf) => wasm2._OrtFree(buf));
        wasm2._OrtReleaseSession(sessionHandle);
        activeSessions.delete(sessionId);
      };
      prepareInputOutputTensor = (tensor, tensorHandles, allocs, sessionId, index, enableGraphCapture = false) => {
        if (!tensor) {
          tensorHandles.push(0);
          return;
        }
        const wasm2 = getInstance();
        const dataType = tensor[0];
        const dims = tensor[1];
        const location = tensor[3];
        let rawData;
        let dataByteLength;
        if (dataType === "string" && location === "gpu-buffer") {
          throw new Error("String tensor is not supported on GPU.");
        }
        if (enableGraphCapture && location !== "gpu-buffer") {
          throw new Error(
            `External buffer must be provided for input/output index ${index} when enableGraphCapture is true.`
          );
        }
        if (location === "gpu-buffer") {
          const gpuBuffer = tensor[2].gpuBuffer;
          const elementSizeInBytes = getTensorElementSize(tensorDataTypeStringToEnum(dataType));
          dataByteLength = dims.reduce((a, b) => a * b, 1) * elementSizeInBytes;
          const registerBuffer = wasm2.jsepRegisterBuffer;
          if (!registerBuffer) {
            throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');
          }
          rawData = registerBuffer(sessionId, index, gpuBuffer, dataByteLength);
        } else {
          const data = tensor[2];
          if (Array.isArray(data)) {
            dataByteLength = 4 * data.length;
            rawData = wasm2._malloc(dataByteLength);
            allocs.push(rawData);
            let dataIndex = rawData / 4;
            for (let i = 0; i < data.length; i++) {
              if (typeof data[i] !== "string") {
                throw new TypeError(`tensor data at index ${i} is not a string`);
              }
              wasm2.HEAPU32[dataIndex++] = allocWasmString(data[i], allocs);
            }
          } else {
            dataByteLength = data.byteLength;
            rawData = wasm2._malloc(dataByteLength);
            allocs.push(rawData);
            wasm2.HEAPU8.set(new Uint8Array(data.buffer, data.byteOffset, dataByteLength), rawData);
          }
        }
        const stack = wasm2.stackSave();
        const dimsOffset = wasm2.stackAlloc(4 * dims.length);
        try {
          let dimIndex = dimsOffset / 4;
          dims.forEach((d) => wasm2.HEAP32[dimIndex++] = d);
          const tensor2 = wasm2._OrtCreateTensor(
            tensorDataTypeStringToEnum(dataType),
            rawData,
            dataByteLength,
            dimsOffset,
            dims.length,
            dataLocationStringToEnum(location)
          );
          if (tensor2 === 0) {
            checkLastError(`Can't create tensor for input/output. session=${sessionId}, index=${index}.`);
          }
          tensorHandles.push(tensor2);
        } finally {
          wasm2.stackRestore(stack);
        }
      };
      run = async (sessionId, inputIndices, inputTensors, outputIndices, outputTensors, options) => {
        const wasm2 = getInstance();
        const session = activeSessions.get(sessionId);
        if (!session) {
          throw new Error(`cannot run inference. invalid session id: ${sessionId}`);
        }
        const sessionHandle = session[0];
        const inputNamesUTF8Encoded = session[1];
        const outputNamesUTF8Encoded = session[2];
        const ioBindingState = session[3];
        const enableGraphCapture = session[4];
        const inputOutputBound = session[5];
        const inputCount = inputIndices.length;
        const outputCount = outputIndices.length;
        let runOptionsHandle = 0;
        let runOptionsAllocs = [];
        const inputTensorHandles = [];
        const outputTensorHandles = [];
        const inputOutputAllocs = [];
        const beforeRunStack = wasm2.stackSave();
        const inputValuesOffset = wasm2.stackAlloc(inputCount * 4);
        const inputNamesOffset = wasm2.stackAlloc(inputCount * 4);
        const outputValuesOffset = wasm2.stackAlloc(outputCount * 4);
        const outputNamesOffset = wasm2.stackAlloc(outputCount * 4);
        try {
          [runOptionsHandle, runOptionsAllocs] = setRunOptions(options);
          for (let i = 0; i < inputCount; i++) {
            prepareInputOutputTensor(
              inputTensors[i],
              inputTensorHandles,
              inputOutputAllocs,
              sessionId,
              inputIndices[i],
              enableGraphCapture
            );
          }
          for (let i = 0; i < outputCount; i++) {
            prepareInputOutputTensor(
              outputTensors[i],
              outputTensorHandles,
              inputOutputAllocs,
              sessionId,
              inputCount + outputIndices[i],
              enableGraphCapture
            );
          }
          let inputValuesIndex = inputValuesOffset / 4;
          let inputNamesIndex = inputNamesOffset / 4;
          let outputValuesIndex = outputValuesOffset / 4;
          let outputNamesIndex = outputNamesOffset / 4;
          for (let i = 0; i < inputCount; i++) {
            wasm2.HEAPU32[inputValuesIndex++] = inputTensorHandles[i];
            wasm2.HEAPU32[inputNamesIndex++] = inputNamesUTF8Encoded[inputIndices[i]];
          }
          for (let i = 0; i < outputCount; i++) {
            wasm2.HEAPU32[outputValuesIndex++] = outputTensorHandles[i];
            wasm2.HEAPU32[outputNamesIndex++] = outputNamesUTF8Encoded[outputIndices[i]];
          }
          if (false) {
            const { handle, outputPreferredLocations, outputPreferredLocationsEncoded } = ioBindingState;
            if (inputNamesUTF8Encoded.length !== inputCount) {
              throw new Error(`input count from feeds (${inputCount}) is expected to be always equal to model's input count (${inputNamesUTF8Encoded.length}).`);
            }
            for (let i = 0; i < inputCount; i++) {
              const index = inputIndices[i];
              const errorCode2 = await wasm2._OrtBindInput(handle, inputNamesUTF8Encoded[index], inputTensorHandles[i]);
              if (errorCode2 !== 0) {
                checkLastError(`Can't bind input[${i}] for session=${sessionId}.`);
              }
            }
            for (let i = 0; i < outputCount; i++) {
              const index = outputIndices[i];
              const location = outputTensors[i]?.[3];
              if (location) {
                const errorCode2 = wasm2._OrtBindOutput(handle, outputNamesUTF8Encoded[index], outputTensorHandles[i], 0);
                if (errorCode2 !== 0) {
                  checkLastError(`Can't bind pre-allocated output[${i}] for session=${sessionId}.`);
                }
              } else {
                const errorCode2 = wasm2._OrtBindOutput(handle, outputNamesUTF8Encoded[index], 0, outputPreferredLocationsEncoded[index]);
                if (errorCode2 !== 0) {
                  checkLastError(`Can't bind output[${i}] to ${outputPreferredLocations[i]} for session=${sessionId}.`);
                }
              }
            }
            activeSessions.set(
              sessionId,
              [sessionHandle, inputNamesUTF8Encoded, outputNamesUTF8Encoded, ioBindingState, enableGraphCapture, true]
            );
          }
          wasm2.jsepOnRunStart?.(sessionHandle);
          let errorCode;
          if (false) {
            errorCode = await wasm2._OrtRunWithBinding(
              sessionHandle,
              ioBindingState.handle,
              outputCount,
              outputValuesOffset,
              runOptionsHandle
            );
          } else {
            errorCode = await wasm2._OrtRun(
              sessionHandle,
              inputNamesOffset,
              inputValuesOffset,
              inputCount,
              outputNamesOffset,
              outputCount,
              outputValuesOffset,
              runOptionsHandle
            );
          }
          if (errorCode !== 0) {
            checkLastError("failed to call OrtRun().");
          }
          const output = [];
          for (let i = 0; i < outputCount; i++) {
            const tensor = wasm2.HEAPU32[outputValuesOffset / 4 + i];
            if (tensor === outputTensorHandles[i]) {
              output.push(outputTensors[i]);
              continue;
            }
            const beforeGetTensorDataStack = wasm2.stackSave();
            const tensorDataOffset = wasm2.stackAlloc(4 * 4);
            let keepOutputTensor = false;
            let type, dataOffset = 0;
            try {
              const errorCode2 = wasm2._OrtGetTensorData(
                tensor,
                tensorDataOffset,
                tensorDataOffset + 4,
                tensorDataOffset + 8,
                tensorDataOffset + 12
              );
              if (errorCode2 !== 0) {
                checkLastError(`Can't access output tensor data on index ${i}.`);
              }
              let tensorDataIndex = tensorDataOffset / 4;
              const dataType = wasm2.HEAPU32[tensorDataIndex++];
              dataOffset = wasm2.HEAPU32[tensorDataIndex++];
              const dimsOffset = wasm2.HEAPU32[tensorDataIndex++];
              const dimsLength = wasm2.HEAPU32[tensorDataIndex++];
              const dims = [];
              for (let i2 = 0; i2 < dimsLength; i2++) {
                dims.push(wasm2.HEAPU32[dimsOffset / 4 + i2]);
              }
              wasm2._OrtFree(dimsOffset);
              const size = dims.reduce((a, b) => a * b, 1);
              type = tensorDataTypeEnumToString(dataType);
              const preferredLocation = ioBindingState?.outputPreferredLocations[outputIndices[i]];
              if (type === "string") {
                if (preferredLocation === "gpu-buffer") {
                  throw new Error("String tensor is not supported on GPU.");
                }
                const stringData = [];
                let dataIndex = dataOffset / 4;
                for (let i2 = 0; i2 < size; i2++) {
                  const offset = wasm2.HEAPU32[dataIndex++];
                  const maxBytesToRead = i2 === size - 1 ? void 0 : wasm2.HEAPU32[dataIndex] - offset;
                  stringData.push(wasm2.UTF8ToString(offset, maxBytesToRead));
                }
                output.push([type, dims, stringData, "cpu"]);
              } else {
                if (preferredLocation === "gpu-buffer" && size > 0) {
                  const getBuffer = wasm2.jsepGetBuffer;
                  if (!getBuffer) {
                    throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');
                  }
                  const gpuBuffer = getBuffer(dataOffset);
                  const elementSize = getTensorElementSize(dataType);
                  if (elementSize === void 0 || !isGpuBufferSupportedType(type)) {
                    throw new Error(`Unsupported data type: ${type}`);
                  }
                  keepOutputTensor = true;
                  output.push([
                    type,
                    dims,
                    {
                      gpuBuffer,
                      download: wasm2.jsepCreateDownloader(gpuBuffer, size * elementSize, type),
                      dispose: () => {
                        wasm2._OrtReleaseTensor(tensor);
                      }
                    },
                    "gpu-buffer"
                  ]);
                } else {
                  const typedArrayConstructor = tensorTypeToTypedArrayConstructor(type);
                  const data = new typedArrayConstructor(size);
                  new Uint8Array(data.buffer, data.byteOffset, data.byteLength).set(wasm2.HEAPU8.subarray(dataOffset, dataOffset + data.byteLength));
                  output.push([type, dims, data, "cpu"]);
                }
              }
            } finally {
              wasm2.stackRestore(beforeGetTensorDataStack);
              if (type === "string" && dataOffset) {
                wasm2._free(dataOffset);
              }
              if (!keepOutputTensor) {
                wasm2._OrtReleaseTensor(tensor);
              }
            }
          }
          if (ioBindingState && !enableGraphCapture) {
            wasm2._OrtClearBoundOutputs(ioBindingState.handle);
            activeSessions.set(
              sessionId,
              [sessionHandle, inputNamesUTF8Encoded, outputNamesUTF8Encoded, ioBindingState, enableGraphCapture, false]
            );
          }
          return output;
        } finally {
          wasm2.stackRestore(beforeRunStack);
          inputTensorHandles.forEach((v) => wasm2._OrtReleaseTensor(v));
          outputTensorHandles.forEach((v) => wasm2._OrtReleaseTensor(v));
          inputOutputAllocs.forEach((p) => wasm2._free(p));
          if (runOptionsHandle !== 0) {
            wasm2._OrtReleaseRunOptions(runOptionsHandle);
          }
          runOptionsAllocs.forEach((p) => wasm2._free(p));
        }
      };
      endProfiling = (sessionId) => {
        const wasm2 = getInstance();
        const session = activeSessions.get(sessionId);
        if (!session) {
          throw new Error("invalid session id");
        }
        const sessionHandle = session[0];
        const profileFileName = wasm2._OrtEndProfiling(sessionHandle);
        if (profileFileName === 0) {
          checkLastError("Can't get an profile file name.");
        }
        wasm2._OrtFree(profileFileName);
      };
    }
  });

  // web/lib/wasm/proxy-wrapper.ts
  var initializing2, initialized2, aborted2, scriptSrc, initializeWebAssemblyAndOrtRuntime, initializeOrtEp, copyFromExternalBuffer2, createSession2, releaseSession2, run2, endProfiling2;
  var init_proxy_wrapper = __esm({
    "web/lib/wasm/proxy-wrapper.ts"() {
      "use strict";
      init_esm();
      init_wasm_core_impl();
      init_wasm_factory();
      initializing2 = false;
      initialized2 = false;
      aborted2 = false;
      scriptSrc = typeof document !== "undefined" ? document?.currentScript?.src : void 0;
      initializeWebAssemblyAndOrtRuntime = async () => {
        if (initialized2) {
          return;
        }
        if (initializing2) {
          throw new Error("multiple calls to 'initWasm()' detected.");
        }
        if (aborted2) {
          throw new Error("previous call to 'initWasm()' failed.");
        }
        initializing2 = true;
        if (false) {
          if (env2.wasm.wasmPaths === void 0) {
            if (scriptSrc && scriptSrc.indexOf("blob:") !== 0) {
              env2.wasm.wasmPaths = scriptSrc.substr(0, +scriptSrc.lastIndexOf("/") + 1);
            }
          }
          return new Promise((resolve, reject) => {
            proxyWorker?.terminate();
            const workerUrl = URL.createObjectURL(new Blob(
              [
                // This require() function is handled by esbuild plugin to load file content as string.
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                null
              ],
              { type: "text/javascript" }
            ));
            proxyWorker = new Worker(workerUrl, { name: "ort-wasm-proxy-worker" });
            proxyWorker.onerror = (ev) => reject(ev);
            proxyWorker.onmessage = onProxyWorkerMessage;
            URL.revokeObjectURL(workerUrl);
            initWasmCallbacks = [resolve, reject];
            const message = { type: "init-wasm", in: env2 };
            proxyWorker.postMessage(message);
          });
        } else {
          try {
            await initializeWebAssembly(env2.wasm);
            await initRuntime(env2);
            initialized2 = true;
          } catch (e) {
            aborted2 = true;
            throw e;
          } finally {
            initializing2 = false;
          }
        }
      };
      initializeOrtEp = async (epName) => {
        if (false) {
          ensureWorker();
          return new Promise((resolve, reject) => {
            enqueueCallbacks("init-ep", [resolve, reject]);
            const message = { type: "init-ep", in: { epName, env: env2 } };
            proxyWorker.postMessage(message);
          });
        } else {
          await initEp(env2, epName);
        }
      };
      copyFromExternalBuffer2 = async (buffer) => {
        if (false) {
          ensureWorker();
          return new Promise((resolve, reject) => {
            enqueueCallbacks("copy-from", [resolve, reject]);
            const message = { type: "copy-from", in: { buffer } };
            proxyWorker.postMessage(message, [buffer.buffer]);
          });
        } else {
          return copyFromExternalBuffer(buffer);
        }
      };
      createSession2 = async (model, options) => {
        if (false) {
          if (options?.preferredOutputLocation) {
            throw new Error('session option "preferredOutputLocation" is not supported for proxy.');
          }
          ensureWorker();
          return new Promise((resolve, reject) => {
            enqueueCallbacks("create", [resolve, reject]);
            const message = { type: "create", in: { model, options: { ...options } } };
            const transferable = [];
            if (model instanceof Uint8Array) {
              transferable.push(model.buffer);
            }
            proxyWorker.postMessage(message, transferable);
          });
        } else {
          return createSession(model, options);
        }
      };
      releaseSession2 = async (sessionId) => {
        if (false) {
          ensureWorker();
          return new Promise((resolve, reject) => {
            enqueueCallbacks("release", [resolve, reject]);
            const message = { type: "release", in: sessionId };
            proxyWorker.postMessage(message);
          });
        } else {
          releaseSession(sessionId);
        }
      };
      run2 = async (sessionId, inputIndices, inputs, outputIndices, outputs, options) => {
        if (false) {
          if (inputs.some((t) => t[3] !== "cpu")) {
            throw new Error("input tensor on GPU is not supported for proxy.");
          }
          if (outputs.some((t) => t)) {
            throw new Error("pre-allocated output tensor is not supported for proxy.");
          }
          ensureWorker();
          return new Promise((resolve, reject) => {
            enqueueCallbacks("run", [resolve, reject]);
            const serializableInputs = inputs;
            const message = { type: "run", in: { sessionId, inputIndices, inputs: serializableInputs, outputIndices, options } };
            proxyWorker.postMessage(message, extractTransferableBuffers(serializableInputs));
          });
        } else {
          return run(sessionId, inputIndices, inputs, outputIndices, outputs, options);
        }
      };
      endProfiling2 = async (sessionId) => {
        if (false) {
          ensureWorker();
          return new Promise((resolve, reject) => {
            enqueueCallbacks("end-profiling", [resolve, reject]);
            const message = { type: "end-profiling", in: sessionId };
            proxyWorker.postMessage(message);
          });
        } else {
          endProfiling(sessionId);
        }
      };
    }
  });

  // web/lib/wasm/session-handler-inference.ts
  var encodeTensorMetadata, decodeTensorMetadata, OnnxruntimeWebAssemblySessionHandler;
  var init_session_handler_inference = __esm({
    "web/lib/wasm/session-handler-inference.ts"() {
      "use strict";
      init_esm();
      init_proxy_wrapper();
      init_wasm_common();
      init_wasm_utils_load_file();
      encodeTensorMetadata = (tensor, getName) => {
        switch (tensor.location) {
          case "cpu":
            return [tensor.type, tensor.dims, tensor.data, "cpu"];
          case "gpu-buffer":
            return [tensor.type, tensor.dims, { gpuBuffer: tensor.gpuBuffer }, "gpu-buffer"];
          default:
            throw new Error(`invalid data location: ${tensor.location} for ${getName()}`);
        }
      };
      decodeTensorMetadata = (tensor) => {
        switch (tensor[3]) {
          case "cpu":
            return new Tensor2(tensor[0], tensor[2], tensor[1]);
          case "gpu-buffer": {
            const dataType = tensor[0];
            if (!isGpuBufferSupportedType(dataType)) {
              throw new Error(`not supported data type: ${dataType} for deserializing GPU tensor`);
            }
            const { gpuBuffer, download, dispose } = tensor[2];
            return Tensor2.fromGpuBuffer(gpuBuffer, { dataType, dims: tensor[1], download, dispose });
          }
          default:
            throw new Error(`invalid data location: ${tensor[3]}`);
        }
      };
      OnnxruntimeWebAssemblySessionHandler = class {
        async fetchModelAndCopyToWasmMemory(path) {
          return copyFromExternalBuffer2(await loadFile(path));
        }
        async loadModel(pathOrBuffer, options) {
          TRACE_FUNC_BEGIN();
          let model;
          if (typeof pathOrBuffer === "string") {
            if (typeof process !== "undefined" && process.versions && process.versions.node) {
              model = await loadFile(pathOrBuffer);
            } else {
              model = await this.fetchModelAndCopyToWasmMemory(pathOrBuffer);
            }
          } else {
            model = pathOrBuffer;
          }
          [this.sessionId, this.inputNames, this.outputNames] = await createSession2(model, options);
          TRACE_FUNC_END();
        }
        async dispose() {
          return releaseSession2(this.sessionId);
        }
        async run(feeds, fetches, options) {
          TRACE_FUNC_BEGIN();
          const inputArray = [];
          const inputIndices = [];
          Object.entries(feeds).forEach((kvp) => {
            const name = kvp[0];
            const tensor = kvp[1];
            const index = this.inputNames.indexOf(name);
            if (index === -1) {
              throw new Error(`invalid input '${name}'`);
            }
            inputArray.push(tensor);
            inputIndices.push(index);
          });
          const outputArray = [];
          const outputIndices = [];
          Object.entries(fetches).forEach((kvp) => {
            const name = kvp[0];
            const tensor = kvp[1];
            const index = this.outputNames.indexOf(name);
            if (index === -1) {
              throw new Error(`invalid output '${name}'`);
            }
            outputArray.push(tensor);
            outputIndices.push(index);
          });
          const inputs = inputArray.map((t, i) => encodeTensorMetadata(t, () => `input "${this.inputNames[inputIndices[i]]}"`));
          const outputs = outputArray.map(
            (t, i) => t ? encodeTensorMetadata(t, () => `output "${this.outputNames[outputIndices[i]]}"`) : null
          );
          const results = await run2(this.sessionId, inputIndices, inputs, outputIndices, outputs, options);
          const resultMap = {};
          for (let i = 0; i < results.length; i++) {
            resultMap[this.outputNames[outputIndices[i]]] = outputArray[i] ?? decodeTensorMetadata(results[i]);
          }
          TRACE_FUNC_END();
          return resultMap;
        }
        startProfiling() {
        }
        endProfiling() {
          void endProfiling2(this.sessionId);
        }
      };
    }
  });

  // web/lib/backend-wasm.ts
  var initializeFlags, OnnxruntimeWebAssemblyBackend;
  var init_backend_wasm = __esm({
    "web/lib/backend-wasm.ts"() {
      "use strict";
      init_node_os();
      init_esm();
      init_proxy_wrapper();
      init_session_handler_inference();
      initializeFlags = () => {
        if (typeof env2.wasm.initTimeout !== "number" || env2.wasm.initTimeout < 0) {
          env2.wasm.initTimeout = 0;
        }
        if (typeof env2.wasm.simd !== "boolean") {
          env2.wasm.simd = true;
        }
        if (typeof env2.wasm.proxy !== "boolean") {
          env2.wasm.proxy = false;
        }
        if (typeof env2.wasm.trace !== "boolean") {
          env2.wasm.trace = false;
        }
        if (typeof env2.wasm.numThreads !== "number" || !Number.isInteger(env2.wasm.numThreads) || env2.wasm.numThreads <= 0) {
          if (typeof self !== "undefined" && !self.crossOriginIsolated || typeof process !== "undefined" && process.versions && process.versions.node) {
            env2.wasm.numThreads = 1;
          }
          const numCpuLogicalCores = typeof navigator === "undefined" ? cpus().length : navigator.hardwareConcurrency;
          env2.wasm.numThreads = Math.min(4, Math.ceil((numCpuLogicalCores || 1) / 2));
        }
      };
      OnnxruntimeWebAssemblyBackend = class {
        /**
         * This function initializes the WebAssembly backend.
         *
         * This function will be called only once for each backend name. It will be called the first time when
         * `ort.InferenceSession.create()` is called with a registered backend name.
         *
         * @param backendName - the registered backend name.
         */
        async init(backendName) {
          initializeFlags();
          await initializeWebAssemblyAndOrtRuntime();
          await initializeOrtEp(backendName);
        }
        async createInferenceSessionHandler(pathOrBuffer, options) {
          const handler = new OnnxruntimeWebAssemblySessionHandler();
          await handler.loadModel(pathOrBuffer, options);
          return Promise.resolve(handler);
        }
      };
    }
  });

  // web/lib/backend-wasm-inference.ts
  var backend_wasm_inference_exports = {};
  __export(backend_wasm_inference_exports, {
    wasmBackend: () => wasmBackend
  });
  var wasmBackend;
  var init_backend_wasm_inference = __esm({
    "web/lib/backend-wasm-inference.ts"() {
      "use strict";
      init_backend_wasm();
      wasmBackend = new OnnxruntimeWebAssemblyBackend();
    }
  });

  // web/lib/index.ts
  var lib_exports = {};
  __export(lib_exports, {
    InferenceSession: () => InferenceSession2,
    TRACE: () => TRACE,
    TRACE_FUNC_BEGIN: () => TRACE_FUNC_BEGIN,
    TRACE_FUNC_END: () => TRACE_FUNC_END,
    Tensor: () => Tensor2,
    TrainingSession: () => TrainingSession2,
    default: () => lib_default,
    env: () => env2,
    registerBackend: () => registerBackend
  });
  init_esm();
  init_esm();
  init_esm();

  // web/lib/version.ts
  var version2 = "1.18.0";

  // web/lib/index.ts
  var lib_default = esm_exports;
  if (false) {
    const onnxjsBackend = null.onnxjsBackend;
    registerBackend("webgl", onnxjsBackend, -10);
  }
  if (true) {
    const wasmBackend2 = true ? (init_backend_wasm_inference(), __toCommonJS(backend_wasm_inference_exports)).wasmBackend : null.wasmBackend;
    if (false) {
      registerBackend("webgpu", wasmBackend2, 5);
      registerBackend("webnn", wasmBackend2, 5);
    }
    registerBackend("cpu", wasmBackend2, 10);
    registerBackend("wasm", wasmBackend2, 10);
  }
  Object.defineProperty(env2.versions, "web", { value: version2, enumerable: true });
  return __toCommonJS(lib_exports);
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vY29tbW9uL2xpYi9iYWNrZW5kLWltcGwudHMiLCAiLi4vLi4vY29tbW9uL2xpYi9iYWNrZW5kLnRzIiwgIi4uLy4uL2NvbW1vbi9saWIvdmVyc2lvbi50cyIsICIuLi8uLi9jb21tb24vbGliL2Vudi1pbXBsLnRzIiwgIi4uLy4uL2NvbW1vbi9saWIvZW52LnRzIiwgIi4uLy4uL2NvbW1vbi9saWIvdGVuc29yLWNvbnZlcnNpb24taW1wbC50cyIsICIuLi8uLi9jb21tb24vbGliL3RlbnNvci1mYWN0b3J5LWltcGwudHMiLCAiLi4vLi4vY29tbW9uL2xpYi90ZW5zb3ItaW1wbC10eXBlLW1hcHBpbmcudHMiLCAiLi4vLi4vY29tbW9uL2xpYi90ZW5zb3ItdXRpbHMtaW1wbC50cyIsICIuLi8uLi9jb21tb24vbGliL3RlbnNvci1pbXBsLnRzIiwgIi4uLy4uL2NvbW1vbi9saWIvdGVuc29yLnRzIiwgIi4uLy4uL2NvbW1vbi9saWIvdHJhY2UudHMiLCAiLi4vLi4vY29tbW9uL2xpYi9pbmZlcmVuY2Utc2Vzc2lvbi1pbXBsLnRzIiwgIi4uLy4uL2NvbW1vbi9saWIvaW5mZXJlbmNlLXNlc3Npb24udHMiLCAiLi4vLi4vY29tbW9uL2xpYi90ZW5zb3ItY29udmVyc2lvbi50cyIsICIuLi8uLi9jb21tb24vbGliL3RlbnNvci1mYWN0b3J5LnRzIiwgIi4uLy4uL2NvbW1vbi9saWIvb25ueC1tb2RlbC50cyIsICIuLi8uLi9jb21tb24vbGliL29ubngtdmFsdWUudHMiLCAiLi4vLi4vY29tbW9uL2xpYi90cmFpbmluZy1zZXNzaW9uLWltcGwudHMiLCAiLi4vLi4vY29tbW9uL2xpYi90cmFpbmluZy1zZXNzaW9uLnRzIiwgIi4uLy4uL2NvbW1vbi9saWIvaW5kZXgudHMiLCAibm9kZWpzLWlnbm9yZTpub2RlOm9zIiwgIm5vZGVqcy1pZ25vcmU6ZnMiLCAibm9kZWpzLWlnbm9yZTpwYXRoIiwgIi4uL2xpYi93YXNtL2JpbmRpbmcvb3J0LXdhc20uanMiLCAiLi4vbGliL3dhc20vd2FzbS1mYWN0b3J5LnRzIiwgIi4uL2xpYi93YXNtL3dhc20tdXRpbHMudHMiLCAiLi4vbGliL3dhc20vcnVuLW9wdGlvbnMudHMiLCAiLi4vbGliL3dhc20vc2Vzc2lvbi1vcHRpb25zLnRzIiwgIi4uL2xpYi93YXNtL3dhc20tY29tbW9uLnRzIiwgIm5vZGVqcy1pZ25vcmU6bm9kZTpmcy9wcm9taXNlcyIsICIuLi9saWIvd2FzbS93YXNtLXV0aWxzLWxvYWQtZmlsZS50cyIsICIuLi9saWIvd2FzbS93YXNtLWNvcmUtaW1wbC50cyIsICIuLi9saWIvd2FzbS9wcm94eS13cmFwcGVyLnRzIiwgIi4uL2xpYi93YXNtL3Nlc3Npb24taGFuZGxlci1pbmZlcmVuY2UudHMiLCAiLi4vbGliL2JhY2tlbmQtd2FzbS50cyIsICIuLi9saWIvYmFja2VuZC13YXNtLWluZmVyZW5jZS50cyIsICIuLi9saWIvaW5kZXgudHMiLCAiLi4vbGliL3ZlcnNpb24udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQge0JhY2tlbmR9IGZyb20gJy4vYmFja2VuZC5qcyc7XG5pbXBvcnQge0luZmVyZW5jZVNlc3Npb259IGZyb20gJy4vaW5mZXJlbmNlLXNlc3Npb24uanMnO1xuXG5pbnRlcmZhY2UgQmFja2VuZEluZm8ge1xuICBiYWNrZW5kOiBCYWNrZW5kO1xuICBwcmlvcml0eTogbnVtYmVyO1xuXG4gIGluaXRQcm9taXNlPzogUHJvbWlzZTx2b2lkPjtcbiAgaW5pdGlhbGl6ZWQ/OiBib29sZWFuO1xuICBhYm9ydGVkPzogYm9vbGVhbjtcbiAgZXJyb3I/OiBzdHJpbmc7XG59XG5cbmNvbnN0IGJhY2tlbmRzOiBNYXA8c3RyaW5nLCBCYWNrZW5kSW5mbz4gPSBuZXcgTWFwKCk7XG5jb25zdCBiYWNrZW5kc1NvcnRlZEJ5UHJpb3JpdHk6IHN0cmluZ1tdID0gW107XG5cbi8qKlxuICogUmVnaXN0ZXIgYSBiYWNrZW5kLlxuICpcbiAqIEBwYXJhbSBuYW1lIC0gdGhlIG5hbWUgYXMgYSBrZXkgdG8gbG9va3VwIGFzIGFuIGV4ZWN1dGlvbiBwcm92aWRlci5cbiAqIEBwYXJhbSBiYWNrZW5kIC0gdGhlIGJhY2tlbmQgb2JqZWN0LlxuICogQHBhcmFtIHByaW9yaXR5IC0gYW4gaW50ZWdlciBpbmRpY2F0aW5nIHRoZSBwcmlvcml0eSBvZiB0aGUgYmFja2VuZC4gSGlnaGVyIG51bWJlciBtZWFucyBoaWdoZXIgcHJpb3JpdHkuIGlmIHByaW9yaXR5XG4gKiA8IDAsIGl0IHdpbGwgYmUgY29uc2lkZXJlZCBhcyBhICdiZXRhJyB2ZXJzaW9uIGFuZCB3aWxsIG5vdCBiZSB1c2VkIGFzIGEgZmFsbGJhY2sgYmFja2VuZCBieSBkZWZhdWx0LlxuICpcbiAqIEBpZ25vcmVcbiAqL1xuZXhwb3J0IGNvbnN0IHJlZ2lzdGVyQmFja2VuZCA9IChuYW1lOiBzdHJpbmcsIGJhY2tlbmQ6IEJhY2tlbmQsIHByaW9yaXR5OiBudW1iZXIpOiB2b2lkID0+IHtcbiAgaWYgKGJhY2tlbmQgJiYgdHlwZW9mIGJhY2tlbmQuaW5pdCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgYmFja2VuZC5jcmVhdGVJbmZlcmVuY2VTZXNzaW9uSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNvbnN0IGN1cnJlbnRCYWNrZW5kID0gYmFja2VuZHMuZ2V0KG5hbWUpO1xuICAgIGlmIChjdXJyZW50QmFja2VuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBiYWNrZW5kcy5zZXQobmFtZSwge2JhY2tlbmQsIHByaW9yaXR5fSk7XG4gICAgfSBlbHNlIGlmIChjdXJyZW50QmFja2VuZC5wcmlvcml0eSA+IHByaW9yaXR5KSB7XG4gICAgICAvLyBzYW1lIG5hbWUgaXMgYWxyZWFkeSByZWdpc3RlcmVkIHdpdGggYSBoaWdoZXIgcHJpb3JpdHkuIHNraXAgcmVnaXN0ZXJhdGlvbi5cbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKGN1cnJlbnRCYWNrZW5kLnByaW9yaXR5ID09PSBwcmlvcml0eSkge1xuICAgICAgaWYgKGN1cnJlbnRCYWNrZW5kLmJhY2tlbmQgIT09IGJhY2tlbmQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBjYW5ub3QgcmVnaXN0ZXIgYmFja2VuZCBcIiR7bmFtZX1cIiB1c2luZyBwcmlvcml0eSAke3ByaW9yaXR5fWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwcmlvcml0eSA+PSAwKSB7XG4gICAgICBjb25zdCBpID0gYmFja2VuZHNTb3J0ZWRCeVByaW9yaXR5LmluZGV4T2YobmFtZSk7XG4gICAgICBpZiAoaSAhPT0gLTEpIHtcbiAgICAgICAgYmFja2VuZHNTb3J0ZWRCeVByaW9yaXR5LnNwbGljZShpLCAxKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiYWNrZW5kc1NvcnRlZEJ5UHJpb3JpdHkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGJhY2tlbmRzLmdldChiYWNrZW5kc1NvcnRlZEJ5UHJpb3JpdHlbaV0pIS5wcmlvcml0eSA8PSBwcmlvcml0eSkge1xuICAgICAgICAgIGJhY2tlbmRzU29ydGVkQnlQcmlvcml0eS5zcGxpY2UoaSwgMCwgbmFtZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBiYWNrZW5kc1NvcnRlZEJ5UHJpb3JpdHkucHVzaChuYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignbm90IGEgdmFsaWQgYmFja2VuZCcpO1xufTtcblxuLyoqXG4gKiBUcnkgdG8gcmVzb2x2ZSBhbmQgaW5pdGlhbGl6ZSBhIGJhY2tlbmQuXG4gKlxuICogQHBhcmFtIGJhY2tlbmROYW1lIC0gdGhlIG5hbWUgb2YgdGhlIGJhY2tlbmQuXG4gKiBAcmV0dXJucyB0aGUgYmFja2VuZCBpbnN0YW5jZSBpZiByZXNvbHZlZCBhbmQgaW5pdGlhbGl6ZWQgc3VjY2Vzc2Z1bGx5LCBvciBhbiBlcnJvciBtZXNzYWdlIGlmIGZhaWxlZC5cbiAqL1xuY29uc3QgdHJ5UmVzb2x2ZUFuZEluaXRpYWxpemVCYWNrZW5kID0gYXN5bmMoYmFja2VuZE5hbWU6IHN0cmluZyk6IFByb21pc2U8QmFja2VuZHxzdHJpbmc+ID0+IHtcbiAgY29uc3QgYmFja2VuZEluZm8gPSBiYWNrZW5kcy5nZXQoYmFja2VuZE5hbWUpO1xuICBpZiAoIWJhY2tlbmRJbmZvKSB7XG4gICAgcmV0dXJuICdiYWNrZW5kIG5vdCBmb3VuZC4nO1xuICB9XG5cbiAgaWYgKGJhY2tlbmRJbmZvLmluaXRpYWxpemVkKSB7XG4gICAgcmV0dXJuIGJhY2tlbmRJbmZvLmJhY2tlbmQ7XG4gIH0gZWxzZSBpZiAoYmFja2VuZEluZm8uYWJvcnRlZCkge1xuICAgIHJldHVybiBiYWNrZW5kSW5mby5lcnJvciE7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgaXNJbml0aWFsaXppbmcgPSAhIWJhY2tlbmRJbmZvLmluaXRQcm9taXNlO1xuICAgIHRyeSB7XG4gICAgICBpZiAoIWlzSW5pdGlhbGl6aW5nKSB7XG4gICAgICAgIGJhY2tlbmRJbmZvLmluaXRQcm9taXNlID0gYmFja2VuZEluZm8uYmFja2VuZC5pbml0KGJhY2tlbmROYW1lKTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IGJhY2tlbmRJbmZvLmluaXRQcm9taXNlO1xuICAgICAgYmFja2VuZEluZm8uaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIGJhY2tlbmRJbmZvLmJhY2tlbmQ7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKCFpc0luaXRpYWxpemluZykge1xuICAgICAgICBiYWNrZW5kSW5mby5lcnJvciA9IGAke2V9YDtcbiAgICAgICAgYmFja2VuZEluZm8uYWJvcnRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gYmFja2VuZEluZm8uZXJyb3IhO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBkZWxldGUgYmFja2VuZEluZm8uaW5pdFByb21pc2U7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIFJlc29sdmUgZXhlY3V0aW9uIHByb3ZpZGVycyBmcm9tIHRoZSBzcGVjaWZpYyBzZXNzaW9uIG9wdGlvbnMuXG4gKlxuICogQHBhcmFtIG9wdGlvbnMgLSB0aGUgc2Vzc2lvbiBvcHRpb25zIG9iamVjdC5cbiAqIEByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgdHVwbGUgb2YgYW4gaW5pdGlhbGl6ZWQgYmFja2VuZCBpbnN0YW5jZSBhbmQgYSBzZXNzaW9uIG9wdGlvbnMgb2JqZWN0IHdpdGhcbiAqIGZpbHRlcmVkIEVQIGxpc3QuXG4gKlxuICogQGlnbm9yZVxuICovXG5leHBvcnQgY29uc3QgcmVzb2x2ZUJhY2tlbmRBbmRFeGVjdXRpb25Qcm92aWRlcnMgPSBhc3luYyhvcHRpb25zOiBJbmZlcmVuY2VTZXNzaW9uLlNlc3Npb25PcHRpb25zKTpcbiAgICBQcm9taXNlPFtiYWNrZW5kOiBCYWNrZW5kLCBvcHRpb25zOiBJbmZlcmVuY2VTZXNzaW9uLlNlc3Npb25PcHRpb25zXT4gPT4ge1xuICAgICAgLy8gZXh0cmFjdCBiYWNrZW5kIGhpbnRzIGZyb20gc2Vzc2lvbiBvcHRpb25zXG4gICAgICBjb25zdCBlcHMgPSBvcHRpb25zLmV4ZWN1dGlvblByb3ZpZGVycyB8fCBbXTtcbiAgICAgIGNvbnN0IGJhY2tlbmRIaW50cyA9IGVwcy5tYXAoaSA9PiB0eXBlb2YgaSA9PT0gJ3N0cmluZycgPyBpIDogaS5uYW1lKTtcbiAgICAgIGNvbnN0IGJhY2tlbmROYW1lcyA9IGJhY2tlbmRIaW50cy5sZW5ndGggPT09IDAgPyBiYWNrZW5kc1NvcnRlZEJ5UHJpb3JpdHkgOiBiYWNrZW5kSGludHM7XG5cbiAgICAgIC8vIHRyeSB0byByZXNvbHZlIGFuZCBpbml0aWFsaXplIGFsbCByZXF1ZXN0ZWQgYmFja2VuZHNcbiAgICAgIGxldCBiYWNrZW5kOiBCYWNrZW5kfHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IGVycm9ycyA9IFtdO1xuICAgICAgY29uc3QgYXZhaWxhYmxlQmFja2VuZE5hbWVzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgICBmb3IgKGNvbnN0IGJhY2tlbmROYW1lIG9mIGJhY2tlbmROYW1lcykge1xuICAgICAgICBjb25zdCByZXNvbHZlUmVzdWx0ID0gYXdhaXQgdHJ5UmVzb2x2ZUFuZEluaXRpYWxpemVCYWNrZW5kKGJhY2tlbmROYW1lKTtcbiAgICAgICAgaWYgKHR5cGVvZiByZXNvbHZlUmVzdWx0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGVycm9ycy5wdXNoKHtuYW1lOiBiYWNrZW5kTmFtZSwgZXJyOiByZXNvbHZlUmVzdWx0fSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCFiYWNrZW5kKSB7XG4gICAgICAgICAgICBiYWNrZW5kID0gcmVzb2x2ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGJhY2tlbmQgPT09IHJlc29sdmVSZXN1bHQpIHtcbiAgICAgICAgICAgIGF2YWlsYWJsZUJhY2tlbmROYW1lcy5hZGQoYmFja2VuZE5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBpZiBubyBiYWNrZW5kIGlzIGF2YWlsYWJsZSwgdGhyb3cgZXJyb3IuXG4gICAgICBpZiAoIWJhY2tlbmQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBubyBhdmFpbGFibGUgYmFja2VuZCBmb3VuZC4gRVJSOiAke2Vycm9ycy5tYXAoZSA9PiBgWyR7ZS5uYW1lfV0gJHtlLmVycn1gKS5qb2luKCcsICcpfWApO1xuICAgICAgfVxuXG4gICAgICAvLyBmb3IgZWFjaCBleHBsaWNpdGx5IHJlcXVlc3RlZCBiYWNrZW5kLCBpZiBpdCdzIG5vdCBhdmFpbGFibGUsIG91dHB1dCB3YXJuaW5nIG1lc3NhZ2UuXG4gICAgICBmb3IgKGNvbnN0IHtuYW1lLCBlcnJ9IG9mIGVycm9ycykge1xuICAgICAgICBpZiAoYmFja2VuZEhpbnRzLmluY2x1ZGVzKG5hbWUpKSB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICBjb25zb2xlLndhcm4oYHJlbW92aW5nIHJlcXVlc3RlZCBleGVjdXRpb24gcHJvdmlkZXIgXCIke1xuICAgICAgICAgICAgICBuYW1lfVwiIGZyb20gc2Vzc2lvbiBvcHRpb25zIGJlY2F1c2UgaXQgaXMgbm90IGF2YWlsYWJsZTogJHtlcnJ9YCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgZmlsdGVyZWRFcHMgPSBlcHMuZmlsdGVyKGkgPT4gYXZhaWxhYmxlQmFja2VuZE5hbWVzLmhhcyh0eXBlb2YgaSA9PT0gJ3N0cmluZycgPyBpIDogaS5uYW1lKSk7XG5cbiAgICAgIHJldHVybiBbXG4gICAgICAgIGJhY2tlbmQsIG5ldyBQcm94eShvcHRpb25zLCB7XG4gICAgICAgICAgZ2V0OiAodGFyZ2V0LCBwcm9wKSA9PiB7XG4gICAgICAgICAgICBpZiAocHJvcCA9PT0gJ2V4ZWN1dGlvblByb3ZpZGVycycpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlcmVkRXBzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgXTtcbiAgICB9O1xuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQge0luZmVyZW5jZVNlc3Npb259IGZyb20gJy4vaW5mZXJlbmNlLXNlc3Npb24uanMnO1xuaW1wb3J0IHtPbm54VmFsdWV9IGZyb20gJy4vb25ueC12YWx1ZS5qcyc7XG5pbXBvcnQge1RyYWluaW5nU2Vzc2lvbn0gZnJvbSAnLi90cmFpbmluZy1zZXNzaW9uLmpzJztcblxuLyoqXG4gKiBAaWdub3JlXG4gKi9cbmV4cG9ydCBkZWNsYXJlIG5hbWVzcGFjZSBTZXNzaW9uSGFuZGxlciB7XG4gIHR5cGUgRmVlZHNUeXBlID0ge1tuYW1lOiBzdHJpbmddOiBPbm54VmFsdWV9O1xuICB0eXBlIEZldGNoZXNUeXBlID0ge1tuYW1lOiBzdHJpbmddOiBPbm54VmFsdWUgfCBudWxsfTtcbiAgdHlwZSBSZXR1cm5UeXBlID0ge1tuYW1lOiBzdHJpbmddOiBPbm54VmFsdWV9O1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgc2hhcmVkIFNlc3Npb25IYW5kbGVyIGZ1bmN0aW9uYWxpdHlcbiAqXG4gKiBAaWdub3JlXG4gKi9cbmludGVyZmFjZSBTZXNzaW9uSGFuZGxlciB7XG4gIGRpc3Bvc2UoKTogUHJvbWlzZTx2b2lkPjtcblxuICByZWFkb25seSBpbnB1dE5hbWVzOiByZWFkb25seSBzdHJpbmdbXTtcbiAgcmVhZG9ubHkgb3V0cHV0TmFtZXM6IHJlYWRvbmx5IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudCBhIGhhbmRsZXIgaW5zdGFuY2Ugb2YgYW4gaW5mZXJlbmNlIHNlc3Npb24uXG4gKlxuICogQGlnbm9yZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEluZmVyZW5jZVNlc3Npb25IYW5kbGVyIGV4dGVuZHMgU2Vzc2lvbkhhbmRsZXIge1xuICBzdGFydFByb2ZpbGluZygpOiB2b2lkO1xuICBlbmRQcm9maWxpbmcoKTogdm9pZDtcblxuICBydW4oZmVlZHM6IFNlc3Npb25IYW5kbGVyLkZlZWRzVHlwZSwgZmV0Y2hlczogU2Vzc2lvbkhhbmRsZXIuRmV0Y2hlc1R5cGUsXG4gICAgICBvcHRpb25zOiBJbmZlcmVuY2VTZXNzaW9uLlJ1bk9wdGlvbnMpOiBQcm9taXNlPFNlc3Npb25IYW5kbGVyLlJldHVyblR5cGU+O1xufVxuXG4vKipcbiAqIFJlcHJlc2VudCBhIGhhbmRsZXIgaW5zdGFuY2Ugb2YgYSB0cmFpbmluZyBpbmZlcmVuY2Ugc2Vzc2lvbi5cbiAqXG4gKiBAaWdub3JlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVHJhaW5pbmdTZXNzaW9uSGFuZGxlciBleHRlbmRzIFNlc3Npb25IYW5kbGVyIHtcbiAgcmVhZG9ubHkgZXZhbElucHV0TmFtZXM6IHJlYWRvbmx5IHN0cmluZ1tdO1xuICByZWFkb25seSBldmFsT3V0cHV0TmFtZXM6IHJlYWRvbmx5IHN0cmluZ1tdO1xuXG4gIGxhenlSZXNldEdyYWQoKTogUHJvbWlzZTx2b2lkPjtcbiAgcnVuVHJhaW5TdGVwKFxuICAgICAgZmVlZHM6IFNlc3Npb25IYW5kbGVyLkZlZWRzVHlwZSwgZmV0Y2hlczogU2Vzc2lvbkhhbmRsZXIuRmV0Y2hlc1R5cGUsXG4gICAgICBvcHRpb25zOiBJbmZlcmVuY2VTZXNzaW9uLlJ1bk9wdGlvbnMpOiBQcm9taXNlPFNlc3Npb25IYW5kbGVyLlJldHVyblR5cGU+O1xuICBydW5PcHRpbWl6ZXJTdGVwKG9wdGlvbnM6IEluZmVyZW5jZVNlc3Npb24uUnVuT3B0aW9ucyk6IFByb21pc2U8dm9pZD47XG4gIHJ1bkV2YWxTdGVwKFxuICAgICAgZmVlZHM6IFNlc3Npb25IYW5kbGVyLkZlZWRzVHlwZSwgZmV0Y2hlczogU2Vzc2lvbkhhbmRsZXIuRmV0Y2hlc1R5cGUsXG4gICAgICBvcHRpb25zOiBJbmZlcmVuY2VTZXNzaW9uLlJ1bk9wdGlvbnMpOiBQcm9taXNlPFNlc3Npb25IYW5kbGVyLlJldHVyblR5cGU+O1xuXG4gIGdldFBhcmFtZXRlcnNTaXplKHRyYWluYWJsZU9ubHk6IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj47XG4gIGxvYWRQYXJhbWV0ZXJzQnVmZmVyKGJ1ZmZlcjogVWludDhBcnJheSwgdHJhaW5hYmxlT25seTogYm9vbGVhbik6IFByb21pc2U8dm9pZD47XG4gIGdldENvbnRpZ3VvdXNQYXJhbWV0ZXJzKHRyYWluYWJsZU9ubHk6IGJvb2xlYW4pOiBQcm9taXNlPE9ubnhWYWx1ZT47XG59XG5cbi8qKlxuICogUmVwcmVzZW50IGEgYmFja2VuZCB0aGF0IHByb3ZpZGVzIGltcGxlbWVudGF0aW9uIG9mIG1vZGVsIGluZmVyZW5jaW5nLlxuICpcbiAqIEBpZ25vcmVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBCYWNrZW5kIHtcbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGJhY2tlbmQgYXN5bmNocm9ub3VzbHkuIFNob3VsZCB0aHJvdyB3aGVuIGZhaWxlZC5cbiAgICovXG4gIGluaXQoYmFja2VuZE5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD47XG5cbiAgY3JlYXRlSW5mZXJlbmNlU2Vzc2lvbkhhbmRsZXIodXJpT3JCdWZmZXI6IHN0cmluZ3xVaW50OEFycmF5LCBvcHRpb25zPzogSW5mZXJlbmNlU2Vzc2lvbi5TZXNzaW9uT3B0aW9ucyk6XG4gICAgICBQcm9taXNlPEluZmVyZW5jZVNlc3Npb25IYW5kbGVyPjtcblxuICBjcmVhdGVUcmFpbmluZ1Nlc3Npb25IYW5kbGVyP1xuICAgICAgKGNoZWNrcG9pbnRTdGF0ZVVyaU9yQnVmZmVyOiBUcmFpbmluZ1Nlc3Npb24uVXJpT3JCdWZmZXIsIHRyYWluTW9kZWxVcmlPckJ1ZmZlcjogVHJhaW5pbmdTZXNzaW9uLlVyaU9yQnVmZmVyLFxuICAgICAgIGV2YWxNb2RlbFVyaU9yQnVmZmVyOiBUcmFpbmluZ1Nlc3Npb24uVXJpT3JCdWZmZXIsIG9wdGltaXplck1vZGVsVXJpT3JCdWZmZXI6IFRyYWluaW5nU2Vzc2lvbi5VcmlPckJ1ZmZlcixcbiAgICAgICBvcHRpb25zOiBJbmZlcmVuY2VTZXNzaW9uLlNlc3Npb25PcHRpb25zKTogUHJvbWlzZTxUcmFpbmluZ1Nlc3Npb25IYW5kbGVyPjtcbn1cblxuZXhwb3J0IHtyZWdpc3RlckJhY2tlbmR9IGZyb20gJy4vYmFja2VuZC1pbXBsLmpzJztcbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuLy8gVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBieSAvanMvc2NyaXB0cy91cGRhdGUtdmVyc2lvbi50c1xuLy8gRG8gbm90IG1vZGlmeSBmaWxlIGNvbnRlbnQgbWFudWFsbHkuXG5cbmV4cG9ydCBjb25zdCB2ZXJzaW9uID0gJzEuMTguMCc7XG4iLCAiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5cbmltcG9ydCB7RW52fSBmcm9tICcuL2Vudi5qcyc7XG5pbXBvcnQge3ZlcnNpb259IGZyb20gJy4vdmVyc2lvbi5qcyc7XG5cbnR5cGUgTG9nTGV2ZWxUeXBlID0gRW52Wydsb2dMZXZlbCddO1xuXG5sZXQgbG9nTGV2ZWxWYWx1ZTogUmVxdWlyZWQ8TG9nTGV2ZWxUeXBlPiA9ICd3YXJuaW5nJztcblxuZXhwb3J0IGNvbnN0IGVudjogRW52ID0ge1xuICB3YXNtOiB7fSBhcyBFbnYuV2ViQXNzZW1ibHlGbGFncyxcbiAgd2ViZ2w6IHt9IGFzIEVudi5XZWJHTEZsYWdzLFxuICB3ZWJncHU6IHt9IGFzIEVudi5XZWJHcHVGbGFncyxcbiAgdmVyc2lvbnM6IHtjb21tb246IHZlcnNpb259LFxuXG4gIHNldCBsb2dMZXZlbCh2YWx1ZTogTG9nTGV2ZWxUeXBlKSB7XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycgfHwgWyd2ZXJib3NlJywgJ2luZm8nLCAnd2FybmluZycsICdlcnJvcicsICdmYXRhbCddLmluZGV4T2YodmFsdWUpID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBsb2dnaW5nIGxldmVsOiAke3ZhbHVlfWApO1xuICAgIH1cbiAgICBsb2dMZXZlbFZhbHVlID0gdmFsdWU7XG4gIH0sXG4gIGdldCBsb2dMZXZlbCgpOiBSZXF1aXJlZDxMb2dMZXZlbFR5cGU+IHtcbiAgICByZXR1cm4gbG9nTGV2ZWxWYWx1ZTtcbiAgfSxcbn07XG5cbi8vIHNldCBwcm9wZXJ0eSAnbG9nTGV2ZWwnIHNvIHRoYXQgdGhleSBjYW4gYmUgY29ycmVjdGx5IHRyYW5zZmVycmVkIHRvIHdvcmtlciBieSBgcG9zdE1lc3NhZ2UoKWAuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZW52LCAnbG9nTGV2ZWwnLCB7ZW51bWVyYWJsZTogdHJ1ZX0pO1xuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQge2VudiBhcyBlbnZJbXBsfSBmcm9tICcuL2Vudi1pbXBsLmpzJztcblxuZXhwb3J0IGRlY2xhcmUgbmFtZXNwYWNlIEVudiB7XG4gIGV4cG9ydCB0eXBlIFdhc21QcmVmaXhPckZpbGVQYXRocyA9IHN0cmluZ3x7XG4gICAgLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uICovXG4gICAgJ29ydC13YXNtLndhc20nPzogc3RyaW5nO1xuICAgICdvcnQtd2FzbS10aHJlYWRlZC53YXNtJz86IHN0cmluZztcbiAgICAnb3J0LXdhc20tc2ltZC53YXNtJz86IHN0cmluZztcbiAgICAnb3J0LXRyYWluaW5nLXdhc20tc2ltZC53YXNtJz86IHN0cmluZztcbiAgICAnb3J0LXdhc20tc2ltZC10aHJlYWRlZC53YXNtJz86IHN0cmluZztcbiAgICAvKiBlc2xpbnQtZW5hYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvbiAqL1xuICB9O1xuICBleHBvcnQgaW50ZXJmYWNlIFdlYkFzc2VtYmx5RmxhZ3Mge1xuICAgIC8qKlxuICAgICAqIHNldCBvciBnZXQgbnVtYmVyIG9mIHRocmVhZChzKS4gSWYgb21pdHRlZCBvciBzZXQgdG8gMCwgbnVtYmVyIG9mIHRocmVhZChzKSB3aWxsIGJlIGRldGVybWluZWQgYnkgc3lzdGVtLiBJZiBzZXRcbiAgICAgKiB0byAxLCBubyB3b3JrZXIgdGhyZWFkIHdpbGwgYmUgc3Bhd25lZC5cbiAgICAgKlxuICAgICAqIFRoaXMgc2V0dGluZyBpcyBhdmFpbGFibGUgb25seSB3aGVuIFdlYkFzc2VtYmx5IG11bHRpdGhyZWFkIGZlYXR1cmUgaXMgYXZhaWxhYmxlIGluIGN1cnJlbnQgY29udGV4dC5cbiAgICAgKlxuICAgICAqIEBkZWZhdWx0VmFsdWUgYDBgXG4gICAgICovXG4gICAgbnVtVGhyZWFkcz86IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIHNldCBvciBnZXQgYSBib29sZWFuIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0byBlbmFibGUgU0lNRC4gSWYgc2V0IHRvIGZhbHNlLCBTSU1EIHdpbGwgYmUgZm9yY2VseSBkaXNhYmxlZC5cbiAgICAgKlxuICAgICAqIFRoaXMgc2V0dGluZyBpcyBhdmFpbGFibGUgb25seSB3aGVuIFdlYkFzc2VtYmx5IFNJTUQgZmVhdHVyZSBpcyBhdmFpbGFibGUgaW4gY3VycmVudCBjb250ZXh0LlxuICAgICAqXG4gICAgICogQGRlZmF1bHRWYWx1ZSBgdHJ1ZWBcbiAgICAgKi9cbiAgICBzaW1kPzogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIHNldCBvciBnZXQgYSBib29sZWFuIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0byBlbmFibGUgdHJhY2UuXG4gICAgICpcbiAgICAgKiBAZGVwcmVjYXRlZCBVc2UgYGVudi50cmFjZWAgaW5zdGVhZC4gSWYgYGVudi50cmFjZWAgaXMgc2V0LCB0aGlzIHByb3BlcnR5IHdpbGwgYmUgaWdub3JlZC5cbiAgICAgKiBAZGVmYXVsdFZhbHVlIGBmYWxzZWBcbiAgICAgKi9cbiAgICB0cmFjZT86IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBTZXQgb3IgZ2V0IGEgbnVtYmVyIHNwZWNpZnlpbmcgdGhlIHRpbWVvdXQgZm9yIGluaXRpYWxpemF0aW9uIG9mIFdlYkFzc2VtYmx5IGJhY2tlbmQsIGluIG1pbGxpc2Vjb25kcy4gQSB6ZXJvXG4gICAgICogdmFsdWUgaW5kaWNhdGVzIG5vIHRpbWVvdXQgaXMgc2V0LlxuICAgICAqXG4gICAgICogQGRlZmF1bHRWYWx1ZSBgMGBcbiAgICAgKi9cbiAgICBpbml0VGltZW91dD86IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFNldCBhIGN1c3RvbSBVUkwgcHJlZml4IHRvIHRoZSAud2FzbSBmaWxlcyBvciBhIHNldCBvZiBvdmVycmlkZXMgZm9yIGVhY2ggLndhc20gZmlsZS4gVGhlIG92ZXJyaWRlIHBhdGggc2hvdWxkIGJlXG4gICAgICogYW4gYWJzb2x1dGUgcGF0aC5cbiAgICAgKi9cbiAgICB3YXNtUGF0aHM/OiBXYXNtUHJlZml4T3JGaWxlUGF0aHM7XG5cbiAgICAvKipcbiAgICAgKiBTZXQgb3IgZ2V0IGEgYm9vbGVhbiB2YWx1ZSBpbmRpY2F0aW5nIHdoZXRoZXIgdG8gcHJveHkgdGhlIGV4ZWN1dGlvbiBvZiBtYWluIHRocmVhZCB0byBhIHdvcmtlciB0aHJlYWQuXG4gICAgICpcbiAgICAgKiBAZGVmYXVsdFZhbHVlIGBmYWxzZWBcbiAgICAgKi9cbiAgICBwcm94eT86IGJvb2xlYW47XG4gIH1cblxuICBleHBvcnQgaW50ZXJmYWNlIFdlYkdMRmxhZ3Mge1xuICAgIC8qKlxuICAgICAqIFNldCBvciBnZXQgdGhlIFdlYkdMIENvbnRleHQgSUQgKHdlYmdsIG9yIHdlYmdsMikuXG4gICAgICpcbiAgICAgKiBAZGVmYXVsdFZhbHVlIGAnd2ViZ2wyJ2BcbiAgICAgKi9cbiAgICBjb250ZXh0SWQ/OiAnd2ViZ2wnfCd3ZWJnbDInO1xuICAgIC8qKlxuICAgICAqIEdldCB0aGUgV2ViR0wgcmVuZGVyaW5nIGNvbnRleHQuXG4gICAgICovXG4gICAgcmVhZG9ubHkgY29udGV4dDogV2ViR0xSZW5kZXJpbmdDb250ZXh0O1xuICAgIC8qKlxuICAgICAqIFNldCBvciBnZXQgdGhlIG1heGltdW0gYmF0Y2ggc2l6ZSBmb3IgbWF0bXVsLiAwIG1lYW5zIHRvIGRpc2FibGUgYmF0Y2hpbmcuXG4gICAgICpcbiAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAqL1xuICAgIG1hdG11bE1heEJhdGNoU2l6ZT86IG51bWJlcjtcbiAgICAvKipcbiAgICAgKiBTZXQgb3IgZ2V0IHRoZSB0ZXh0dXJlIGNhY2hlIG1vZGUuXG4gICAgICpcbiAgICAgKiBAZGVmYXVsdFZhbHVlIGAnZnVsbCdgXG4gICAgICovXG4gICAgdGV4dHVyZUNhY2hlTW9kZT86ICdpbml0aWFsaXplck9ubHknfCdmdWxsJztcbiAgICAvKipcbiAgICAgKiBTZXQgb3IgZ2V0IHRoZSBwYWNrZWQgdGV4dHVyZSBtb2RlXG4gICAgICpcbiAgICAgKiBAZGVmYXVsdFZhbHVlIGBmYWxzZWBcbiAgICAgKi9cbiAgICBwYWNrPzogYm9vbGVhbjtcbiAgICAvKipcbiAgICAgKiBTZXQgb3IgZ2V0IHdoZXRoZXIgZW5hYmxlIGFzeW5jIGRvd25sb2FkLlxuICAgICAqXG4gICAgICogQGRlZmF1bHRWYWx1ZSBgZmFsc2VgXG4gICAgICovXG4gICAgYXN5bmM/OiBib29sZWFuO1xuICB9XG5cbiAgZXhwb3J0IGludGVyZmFjZSBXZWJHcHVQcm9maWxpbmdEYXRhVjFUZW5zb3JNZXRhZGF0YSB7XG4gICAgZGltczogcmVhZG9ubHkgbnVtYmVyW107XG4gICAgZGF0YVR5cGU6IHN0cmluZztcbiAgfVxuICBleHBvcnQgaW50ZXJmYWNlIFdlYkdwdVByb2ZpbGluZ0RhdGFWMSB7XG4gICAgdmVyc2lvbjogMTtcbiAgICBpbnB1dHNNZXRhZGF0YTogcmVhZG9ubHkgV2ViR3B1UHJvZmlsaW5nRGF0YVYxVGVuc29yTWV0YWRhdGFbXTtcbiAgICBvdXRwdXRzTWV0YWRhdGE6IHJlYWRvbmx5IFdlYkdwdVByb2ZpbGluZ0RhdGFWMVRlbnNvck1ldGFkYXRhW107XG4gICAga2VybmVsSWQ6IG51bWJlcjtcbiAgICBrZXJuZWxUeXBlOiBzdHJpbmc7XG4gICAga2VybmVsTmFtZTogc3RyaW5nO1xuICAgIHByb2dyYW1OYW1lOiBzdHJpbmc7XG4gICAgc3RhcnRUaW1lOiBudW1iZXI7XG4gICAgZW5kVGltZTogbnVtYmVyO1xuICB9XG5cbiAgZXhwb3J0IHR5cGUgV2ViR3B1UHJvZmlsaW5nRGF0YSA9IFdlYkdwdVByb2ZpbGluZ0RhdGFWMTtcblxuICBleHBvcnQgaW50ZXJmYWNlIFdlYkdwdUZsYWdzIHtcbiAgICAvKipcbiAgICAgKiBTZXQgb3IgZ2V0IHRoZSBwcm9maWxpbmcgbW9kZS5cbiAgICAgKlxuICAgICAqIEBkZXByZWNhdGVkIFVzZSBgZW52LndlYmdwdS5wcm9maWxpbmcubW9kZWAgaW5zdGVhZC4gSWYgYGVudi53ZWJncHUucHJvZmlsaW5nLm1vZGVgIGlzIHNldCwgdGhpcyBwcm9wZXJ0eSB3aWxsIGJlXG4gICAgICogaWdub3JlZC5cbiAgICAgKi9cbiAgICBwcm9maWxpbmdNb2RlPzogJ29mZid8J2RlZmF1bHQnO1xuICAgIC8qKlxuICAgICAqIFNldCBvciBnZXQgdGhlIHByb2ZpbGluZyBjb25maWd1cmF0aW9uLlxuICAgICAqL1xuICAgIHByb2ZpbGluZz86IHtcbiAgICAgIC8qKlxuICAgICAgICogU2V0IG9yIGdldCB0aGUgcHJvZmlsaW5nIG1vZGUuXG4gICAgICAgKlxuICAgICAgICogQGRlZmF1bHRWYWx1ZSBgJ29mZidgXG4gICAgICAgKi9cbiAgICAgIG1vZGU/OiAnb2ZmJ3wnZGVmYXVsdCc7XG5cbiAgICAgIC8qKlxuICAgICAgICogU2V0IG9yIGdldCBhIGNhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gYSBwcm9maWxpbmcgZGF0YSBpcyByZWNlaXZlZC4gSWYgbm90IHNldCwgdGhlIHByb2ZpbGluZyBkYXRhIHdpbGwgYmVcbiAgICAgICAqIHByaW50ZWQgdG8gY29uc29sZS5cbiAgICAgICAqL1xuICAgICAgb25kYXRhPzogKGRhdGE6IFdlYkdwdVByb2ZpbGluZ0RhdGEpID0+IHZvaWQ7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTZXQgb3IgZ2V0IHRoZSBwb3dlciBwcmVmZXJlbmNlLlxuICAgICAqXG4gICAgICogU2V0dGluZyB0aGlzIHByb3BlcnR5IG9ubHkgaGFzIGVmZmVjdCBiZWZvcmUgdGhlIGZpcnN0IFdlYkdQVSBpbmZlcmVuY2Ugc2Vzc2lvbiBpcyBjcmVhdGVkLiBUaGUgdmFsdWUgd2lsbCBiZVxuICAgICAqIHVzZWQgYXMgb3B0aW9ucyBmb3IgYG5hdmlnYXRvci5ncHUucmVxdWVzdEFkYXB0ZXIoKWAuXG4gICAgICpcbiAgICAgKiBTZWUge0BsaW5rIGh0dHBzOi8vZ3B1d2ViLmdpdGh1Yi5pby9ncHV3ZWIvI2RpY3RkZWYtZ3B1cmVxdWVzdGFkYXB0ZXJvcHRpb25zfSBmb3IgbW9yZSBkZXRhaWxzLlxuICAgICAqXG4gICAgICogQGRlZmF1bHRWYWx1ZSBgdW5kZWZpbmVkYFxuICAgICAqL1xuICAgIHBvd2VyUHJlZmVyZW5jZT86ICdsb3ctcG93ZXInfCdoaWdoLXBlcmZvcm1hbmNlJztcbiAgICAvKipcbiAgICAgKiBTZXQgb3IgZ2V0IHRoZSBmb3JjZSBmYWxsYmFjayBhZGFwdGVyIGZsYWcuXG4gICAgICpcbiAgICAgKiBTZXR0aW5nIHRoaXMgcHJvcGVydHkgb25seSBoYXMgZWZmZWN0IGJlZm9yZSB0aGUgZmlyc3QgV2ViR1BVIGluZmVyZW5jZSBzZXNzaW9uIGlzIGNyZWF0ZWQuIFRoZSB2YWx1ZSB3aWxsIGJlXG4gICAgICogdXNlZCBhcyBvcHRpb25zIGZvciBgbmF2aWdhdG9yLmdwdS5yZXF1ZXN0QWRhcHRlcigpYC5cbiAgICAgKlxuICAgICAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9ncHV3ZWIuZ2l0aHViLmlvL2dwdXdlYi8jZGljdGRlZi1ncHVyZXF1ZXN0YWRhcHRlcm9wdGlvbnN9IGZvciBtb3JlIGRldGFpbHMuXG4gICAgICpcbiAgICAgKiBAZGVmYXVsdFZhbHVlIGB1bmRlZmluZWRgXG4gICAgICovXG4gICAgZm9yY2VGYWxsYmFja0FkYXB0ZXI/OiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIFNldCBvciBnZXQgdGhlIGFkYXB0ZXIgZm9yIFdlYkdQVS5cbiAgICAgKlxuICAgICAqIFNldHRpbmcgdGhpcyBwcm9wZXJ0eSBvbmx5IGhhcyBlZmZlY3QgYmVmb3JlIHRoZSBmaXJzdCBXZWJHUFUgaW5mZXJlbmNlIHNlc3Npb24gaXMgY3JlYXRlZC4gVGhlIHZhbHVlIHdpbGwgYmVcbiAgICAgKiB1c2VkIGFzIHRoZSBHUFUgYWRhcHRlciBmb3IgdGhlIHVuZGVybHlpbmcgV2ViR1BVIGJhY2tlbmQgdG8gY3JlYXRlIEdQVSBkZXZpY2UuXG4gICAgICpcbiAgICAgKiBJZiB0aGlzIHByb3BlcnR5IGlzIG5vdCBzZXQsIGl0IHdpbGwgYmUgYXZhaWxhYmxlIHRvIGdldCBhZnRlciB0aGUgZmlyc3QgV2ViR1BVIGluZmVyZW5jZSBzZXNzaW9uIGlzIGNyZWF0ZWQuIFRoZVxuICAgICAqIHZhbHVlIHdpbGwgYmUgdGhlIEdQVSBhZGFwdGVyIHRoYXQgY3JlYXRlZCBieSB0aGUgdW5kZXJseWluZyBXZWJHUFUgYmFja2VuZC5cbiAgICAgKlxuICAgICAqIFdoZW4gdXNlIHdpdGggVHlwZVNjcmlwdCwgdGhlIHR5cGUgb2YgdGhpcyBwcm9wZXJ0eSBpcyBgR1BVQWRhcHRlcmAgZGVmaW5lZCBpbiBcIkB3ZWJncHUvdHlwZXNcIi5cbiAgICAgKiBVc2UgYGNvbnN0IGFkYXB0ZXIgPSBlbnYud2ViZ3B1LmFkYXB0ZXIgYXMgR1BVQWRhcHRlcjtgIGluIFR5cGVTY3JpcHQgdG8gYWNjZXNzIHRoaXMgcHJvcGVydHkgd2l0aCBjb3JyZWN0IHR5cGUuXG4gICAgICpcbiAgICAgKiBzZWUgY29tbWVudHMgb24ge0BsaW5rIFRlbnNvci5HcHVCdWZmZXJUeXBlfVxuICAgICAqL1xuICAgIGFkYXB0ZXI6IHVua25vd247XG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBkZXZpY2UgZm9yIFdlYkdQVS5cbiAgICAgKlxuICAgICAqIFRoaXMgcHJvcGVydHkgaXMgb25seSBhdmFpbGFibGUgYWZ0ZXIgdGhlIGZpcnN0IFdlYkdQVSBpbmZlcmVuY2Ugc2Vzc2lvbiBpcyBjcmVhdGVkLlxuICAgICAqXG4gICAgICogV2hlbiB1c2Ugd2l0aCBUeXBlU2NyaXB0LCB0aGUgdHlwZSBvZiB0aGlzIHByb3BlcnR5IGlzIGBHUFVEZXZpY2VgIGRlZmluZWQgaW4gXCJAd2ViZ3B1L3R5cGVzXCIuXG4gICAgICogVXNlIGBjb25zdCBkZXZpY2UgPSBlbnYud2ViZ3B1LmRldmljZSBhcyBHUFVEZXZpY2U7YCBpbiBUeXBlU2NyaXB0IHRvIGFjY2VzcyB0aGlzIHByb3BlcnR5IHdpdGggY29ycmVjdCB0eXBlLlxuICAgICAqXG4gICAgICogc2VlIGNvbW1lbnRzIG9uIHtAbGluayBUZW5zb3IuR3B1QnVmZmVyVHlwZX0gZm9yIG1vcmUgZGV0YWlscyBhYm91dCB3aHkgbm90IHVzZSB0eXBlcyBkZWZpbmVkIGluIFwiQHdlYmdwdS90eXBlc1wiLlxuICAgICAqL1xuICAgIHJlYWRvbmx5IGRldmljZTogdW5rbm93bjtcbiAgICAvKipcbiAgICAgKiBTZXQgb3IgZ2V0IHdoZXRoZXIgdmFsaWRhdGUgaW5wdXQgY29udGVudC5cbiAgICAgKlxuICAgICAqIEBkZWZhdWx0VmFsdWUgYGZhbHNlYFxuICAgICAqL1xuICAgIHZhbGlkYXRlSW5wdXRDb250ZW50PzogYm9vbGVhbjtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEVudiB7XG4gIC8qKlxuICAgKiBzZXQgdGhlIHNldmVyaXR5IGxldmVsIGZvciBsb2dnaW5nLlxuICAgKlxuICAgKiBAZGVmYXVsdFZhbHVlIGAnd2FybmluZydgXG4gICAqL1xuICBsb2dMZXZlbD86ICd2ZXJib3NlJ3wnaW5mbyd8J3dhcm5pbmcnfCdlcnJvcid8J2ZhdGFsJztcblxuICAvKipcbiAgICogSW5kaWNhdGUgd2hldGhlciBydW4gaW4gZGVidWcgbW9kZS5cbiAgICpcbiAgICogQGRlZmF1bHRWYWx1ZSBgZmFsc2VgXG4gICAqL1xuICBkZWJ1Zz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIHNldCBvciBnZXQgYSBib29sZWFuIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0byBlbmFibGUgdHJhY2UuXG4gICAqXG4gICAqIEBkZWZhdWx0VmFsdWUgYGZhbHNlYFxuICAgKi9cbiAgdHJhY2U/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBHZXQgdmVyc2lvbiBvZiB0aGUgY3VycmVudCBwYWNrYWdlLlxuICAgKi9cbiAgcmVhZG9ubHkgdmVyc2lvbnM6IHtcbiAgICByZWFkb25seSBjb21tb246IHN0cmluZztcbiAgICByZWFkb25seSB3ZWI/OiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgbm9kZT86IHN0cmluZztcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uXG4gICAgcmVhZG9ubHkgJ3JlYWN0LW5hdGl2ZSc/OiBzdHJpbmc7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlcHJlc2VudCBhIHNldCBvZiBmbGFncyBmb3IgV2ViQXNzZW1ibHlcbiAgICovXG4gIHJlYWRvbmx5IHdhc206IEVudi5XZWJBc3NlbWJseUZsYWdzO1xuXG4gIC8qKlxuICAgKiBSZXByZXNlbnQgYSBzZXQgb2YgZmxhZ3MgZm9yIFdlYkdMXG4gICAqL1xuICByZWFkb25seSB3ZWJnbDogRW52LldlYkdMRmxhZ3M7XG5cbiAgLyoqXG4gICAqIFJlcHJlc2VudCBhIHNldCBvZiBmbGFncyBmb3IgV2ViR1BVXG4gICAqL1xuICByZWFkb25seSB3ZWJncHU6IEVudi5XZWJHcHVGbGFncztcblxuICBbbmFtZTogc3RyaW5nXTogdW5rbm93bjtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnQgYSBzZXQgb2YgZmxhZ3MgYXMgYSBnbG9iYWwgc2luZ2xldG9uLlxuICovXG5leHBvcnQgY29uc3QgZW52OiBFbnYgPSBlbnZJbXBsO1xuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQge1RlbnNvclRvRGF0YVVybE9wdGlvbnMsIFRlbnNvclRvSW1hZ2VEYXRhT3B0aW9uc30gZnJvbSAnLi90ZW5zb3ItY29udmVyc2lvbi5qcyc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi90ZW5zb3IuanMnO1xuXG4vKipcbiAqIGltcGxlbWVudGF0aW9uIG9mIFRlbnNvci50b0RhdGFVUkwoKVxuICovXG5leHBvcnQgY29uc3QgdGVuc29yVG9EYXRhVVJMID0gKHRlbnNvcjogVGVuc29yLCBvcHRpb25zPzogVGVuc29yVG9EYXRhVXJsT3B0aW9ucyk6IHN0cmluZyA9PiB7XG4gIGNvbnN0IGNhbnZhcyA9IHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKSA6IChuZXcgT2Zmc2NyZWVuQ2FudmFzKDEsIDEpKTtcbiAgY2FudmFzLndpZHRoID0gdGVuc29yLmRpbXNbM107XG4gIGNhbnZhcy5oZWlnaHQgPSB0ZW5zb3IuZGltc1syXTtcbiAgY29uc3QgcGl4ZWxzMkRDb250ZXh0ID1cbiAgICAgIGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpIGFzIChDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBPZmZzY3JlZW5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsKTtcblxuICBpZiAocGl4ZWxzMkRDb250ZXh0ICE9IG51bGwpIHtcbiAgICAvLyBEZWZhdWx0IHZhbHVlcyBmb3IgaGVpZ2h0IGFuZCB3aWR0aCAmIGZvcm1hdFxuICAgIGxldCB3aWR0aDogbnVtYmVyO1xuICAgIGxldCBoZWlnaHQ6IG51bWJlcjtcbiAgICBpZiAob3B0aW9ucz8udGVuc29yTGF5b3V0ICE9PSB1bmRlZmluZWQgJiYgb3B0aW9ucy50ZW5zb3JMYXlvdXQgPT09ICdOSFdDJykge1xuICAgICAgd2lkdGggPSB0ZW5zb3IuZGltc1syXTtcbiAgICAgIGhlaWdodCA9IHRlbnNvci5kaW1zWzNdO1xuICAgIH0gZWxzZSB7ICAvLyBEZWZhdWx0IGxheW91dCBpcyBOQ1dIXG4gICAgICB3aWR0aCA9IHRlbnNvci5kaW1zWzNdO1xuICAgICAgaGVpZ2h0ID0gdGVuc29yLmRpbXNbMl07XG4gICAgfVxuXG4gICAgY29uc3QgaW5wdXRmb3JtYXQgPSBvcHRpb25zPy5mb3JtYXQgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuZm9ybWF0IDogJ1JHQic7XG5cbiAgICBjb25zdCBub3JtID0gb3B0aW9ucz8ubm9ybTtcbiAgICBsZXQgbm9ybU1lYW46IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdO1xuICAgIGxldCBub3JtQmlhczogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XG4gICAgaWYgKG5vcm0gPT09IHVuZGVmaW5lZCB8fCBub3JtLm1lYW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgbm9ybU1lYW4gPSBbMjU1LCAyNTUsIDI1NSwgMjU1XTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiAobm9ybS5tZWFuKSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgbm9ybU1lYW4gPSBbbm9ybS5tZWFuLCBub3JtLm1lYW4sIG5vcm0ubWVhbiwgbm9ybS5tZWFuXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vcm1NZWFuID0gW25vcm0ubWVhblswXSwgbm9ybS5tZWFuWzFdLCBub3JtLm1lYW5bMl0sIDBdO1xuICAgICAgICBpZiAobm9ybS5tZWFuWzNdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBub3JtTWVhblszXSA9IG5vcm0ubWVhblszXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAobm9ybSA9PT0gdW5kZWZpbmVkIHx8IG5vcm0uYmlhcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBub3JtQmlhcyA9IFswLCAwLCAwLCAwXTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiAobm9ybS5iaWFzKSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgbm9ybUJpYXMgPSBbbm9ybS5iaWFzLCBub3JtLmJpYXMsIG5vcm0uYmlhcywgbm9ybS5iaWFzXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vcm1CaWFzID0gW25vcm0uYmlhc1swXSwgbm9ybS5iaWFzWzFdLCBub3JtLmJpYXNbMl0sIDBdO1xuICAgICAgICBpZiAobm9ybS5iaWFzWzNdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBub3JtQmlhc1szXSA9IG5vcm0uYmlhc1szXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHN0cmlkZSA9IGhlaWdodCAqIHdpZHRoO1xuICAgIC8vIERlZmF1bHQgcG9pbnRlciBhc3NpZ25tZW50c1xuICAgIGxldCByVGVuc29yUG9pbnRlciA9IDAsIGdUZW5zb3JQb2ludGVyID0gc3RyaWRlLCBiVGVuc29yUG9pbnRlciA9IHN0cmlkZSAqIDIsIGFUZW5zb3JQb2ludGVyID0gLTE7XG5cbiAgICAvLyBVcGRhdGluZyB0aGUgcG9pbnRlciBhc3NpZ25tZW50cyBiYXNlZCBvbiB0aGUgaW5wdXQgaW1hZ2UgZm9ybWF0XG4gICAgaWYgKGlucHV0Zm9ybWF0ID09PSAnUkdCQScpIHtcbiAgICAgIHJUZW5zb3JQb2ludGVyID0gMDtcbiAgICAgIGdUZW5zb3JQb2ludGVyID0gc3RyaWRlO1xuICAgICAgYlRlbnNvclBvaW50ZXIgPSBzdHJpZGUgKiAyO1xuICAgICAgYVRlbnNvclBvaW50ZXIgPSBzdHJpZGUgKiAzO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRmb3JtYXQgPT09ICdSR0InKSB7XG4gICAgICByVGVuc29yUG9pbnRlciA9IDA7XG4gICAgICBnVGVuc29yUG9pbnRlciA9IHN0cmlkZTtcbiAgICAgIGJUZW5zb3JQb2ludGVyID0gc3RyaWRlICogMjtcbiAgICB9IGVsc2UgaWYgKGlucHV0Zm9ybWF0ID09PSAnUkJHJykge1xuICAgICAgclRlbnNvclBvaW50ZXIgPSAwO1xuICAgICAgYlRlbnNvclBvaW50ZXIgPSBzdHJpZGU7XG4gICAgICBnVGVuc29yUG9pbnRlciA9IHN0cmlkZSAqIDI7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoZWlnaHQ7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB3aWR0aDsgaisrKSB7XG4gICAgICAgIGNvbnN0IFIgPSAoKHRlbnNvci5kYXRhW3JUZW5zb3JQb2ludGVyKytdIGFzIG51bWJlcikgLSBub3JtQmlhc1swXSkgKiBub3JtTWVhblswXTsgIC8vIFIgdmFsdWVcbiAgICAgICAgY29uc3QgRyA9ICgodGVuc29yLmRhdGFbZ1RlbnNvclBvaW50ZXIrK10gYXMgbnVtYmVyKSAtIG5vcm1CaWFzWzFdKSAqIG5vcm1NZWFuWzFdOyAgLy8gRyB2YWx1ZVxuICAgICAgICBjb25zdCBCID0gKCh0ZW5zb3IuZGF0YVtiVGVuc29yUG9pbnRlcisrXSBhcyBudW1iZXIpIC0gbm9ybUJpYXNbMl0pICogbm9ybU1lYW5bMl07ICAvLyBCIHZhbHVlXG4gICAgICAgIGNvbnN0IEEgPSBhVGVuc29yUG9pbnRlciA9PT0gLTEgP1xuICAgICAgICAgICAgMjU1IDpcbiAgICAgICAgICAgICgodGVuc29yLmRhdGFbYVRlbnNvclBvaW50ZXIrK10gYXMgbnVtYmVyKSAtIG5vcm1CaWFzWzNdKSAqIG5vcm1NZWFuWzNdOyAgLy8gQSB2YWx1ZVxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L3Jlc3RyaWN0LXBsdXMtb3BlcmFuZHNcbiAgICAgICAgcGl4ZWxzMkRDb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKCcgKyBSICsgJywnICsgRyArICcsJyArIEIgKyAnLCcgKyBBICsgJyknO1xuICAgICAgICBwaXhlbHMyRENvbnRleHQuZmlsbFJlY3QoaiwgaSwgMSwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICgndG9EYXRhVVJMJyBpbiBjYW52YXMpIHtcbiAgICAgIHJldHVybiBjYW52YXMudG9EYXRhVVJMKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndG9EYXRhVVJMIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW4gbm90IGFjY2VzcyBpbWFnZSBkYXRhJyk7XG4gIH1cbn07XG5cbi8qKlxuICogaW1wbGVtZW50YXRpb24gb2YgVGVuc29yLnRvSW1hZ2VEYXRhKClcbiAqL1xuZXhwb3J0IGNvbnN0IHRlbnNvclRvSW1hZ2VEYXRhID0gKHRlbnNvcjogVGVuc29yLCBvcHRpb25zPzogVGVuc29yVG9JbWFnZURhdGFPcHRpb25zKTogSW1hZ2VEYXRhID0+IHtcbiAgY29uc3QgcGl4ZWxzMkRDb250ZXh0ID0gdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyA/XG4gICAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKS5nZXRDb250ZXh0KCcyZCcpIDpcbiAgICAgIG5ldyBPZmZzY3JlZW5DYW52YXMoMSwgMSkuZ2V0Q29udGV4dCgnMmQnKSBhcyBPZmZzY3JlZW5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIGxldCBpbWFnZTogSW1hZ2VEYXRhO1xuICBpZiAocGl4ZWxzMkRDb250ZXh0ICE9IG51bGwpIHtcbiAgICAvLyBEZWZhdWx0IHZhbHVlcyBmb3IgaGVpZ2h0IGFuZCB3aWR0aCAmIGZvcm1hdFxuICAgIGxldCB3aWR0aDogbnVtYmVyO1xuICAgIGxldCBoZWlnaHQ6IG51bWJlcjtcbiAgICBsZXQgY2hhbm5lbHM6IG51bWJlcjtcbiAgICBpZiAob3B0aW9ucz8udGVuc29yTGF5b3V0ICE9PSB1bmRlZmluZWQgJiYgb3B0aW9ucy50ZW5zb3JMYXlvdXQgPT09ICdOSFdDJykge1xuICAgICAgd2lkdGggPSB0ZW5zb3IuZGltc1syXTtcbiAgICAgIGhlaWdodCA9IHRlbnNvci5kaW1zWzFdO1xuICAgICAgY2hhbm5lbHMgPSB0ZW5zb3IuZGltc1szXTtcbiAgICB9IGVsc2UgeyAgLy8gRGVmYXVsdCBsYXlvdXQgaXMgTkNXSFxuICAgICAgd2lkdGggPSB0ZW5zb3IuZGltc1szXTtcbiAgICAgIGhlaWdodCA9IHRlbnNvci5kaW1zWzJdO1xuICAgICAgY2hhbm5lbHMgPSB0ZW5zb3IuZGltc1sxXTtcbiAgICB9XG4gICAgY29uc3QgaW5wdXRmb3JtYXQgPSBvcHRpb25zICE9PSB1bmRlZmluZWQgPyAob3B0aW9ucy5mb3JtYXQgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuZm9ybWF0IDogJ1JHQicpIDogJ1JHQic7XG5cbiAgICBjb25zdCBub3JtID0gb3B0aW9ucz8ubm9ybTtcbiAgICBsZXQgbm9ybU1lYW46IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdO1xuICAgIGxldCBub3JtQmlhczogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XG4gICAgaWYgKG5vcm0gPT09IHVuZGVmaW5lZCB8fCBub3JtLm1lYW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgbm9ybU1lYW4gPSBbMjU1LCAyNTUsIDI1NSwgMjU1XTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiAobm9ybS5tZWFuKSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgbm9ybU1lYW4gPSBbbm9ybS5tZWFuLCBub3JtLm1lYW4sIG5vcm0ubWVhbiwgbm9ybS5tZWFuXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vcm1NZWFuID0gW25vcm0ubWVhblswXSwgbm9ybS5tZWFuWzFdLCBub3JtLm1lYW5bMl0sIDI1NV07XG4gICAgICAgIGlmIChub3JtLm1lYW5bM10gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG5vcm1NZWFuWzNdID0gbm9ybS5tZWFuWzNdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChub3JtID09PSB1bmRlZmluZWQgfHwgbm9ybS5iaWFzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5vcm1CaWFzID0gWzAsIDAsIDAsIDBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZW9mIChub3JtLmJpYXMpID09PSAnbnVtYmVyJykge1xuICAgICAgICBub3JtQmlhcyA9IFtub3JtLmJpYXMsIG5vcm0uYmlhcywgbm9ybS5iaWFzLCBub3JtLmJpYXNdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9ybUJpYXMgPSBbbm9ybS5iaWFzWzBdLCBub3JtLmJpYXNbMV0sIG5vcm0uYmlhc1syXSwgMF07XG4gICAgICAgIGlmIChub3JtLmJpYXNbM10gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG5vcm1CaWFzWzNdID0gbm9ybS5iaWFzWzNdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc3RyaWRlID0gaGVpZ2h0ICogd2lkdGg7XG4gICAgaWYgKG9wdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKG9wdGlvbnMuZm9ybWF0ICE9PSB1bmRlZmluZWQgJiYgKGNoYW5uZWxzID09PSA0ICYmIG9wdGlvbnMuZm9ybWF0ICE9PSAnUkdCQScpIHx8XG4gICAgICAgICAgKGNoYW5uZWxzID09PSAzICYmIChvcHRpb25zLmZvcm1hdCAhPT0gJ1JHQicgJiYgb3B0aW9ucy5mb3JtYXQgIT09ICdCR1InKSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUZW5zb3IgZm9ybWF0IGRvZXNuXFwndCBtYXRjaCBpbnB1dCB0ZW5zb3IgZGltcycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIERlZmF1bHQgcG9pbnRlciBhc3NpZ25tZW50c1xuICAgIGNvbnN0IHN0ZXAgPSA0O1xuICAgIGxldCBySW1hZ2VQb2ludGVyID0gMCwgZ0ltYWdlUG9pbnRlciA9IDEsIGJJbWFnZVBvaW50ZXIgPSAyLCBhSW1hZ2VQb2ludGVyID0gMztcbiAgICBsZXQgclRlbnNvclBvaW50ZXIgPSAwLCBnVGVuc29yUG9pbnRlciA9IHN0cmlkZSwgYlRlbnNvclBvaW50ZXIgPSBzdHJpZGUgKiAyLCBhVGVuc29yUG9pbnRlciA9IC0xO1xuXG4gICAgLy8gVXBkYXRpbmcgdGhlIHBvaW50ZXIgYXNzaWdubWVudHMgYmFzZWQgb24gdGhlIGlucHV0IGltYWdlIGZvcm1hdFxuICAgIGlmIChpbnB1dGZvcm1hdCA9PT0gJ1JHQkEnKSB7XG4gICAgICByVGVuc29yUG9pbnRlciA9IDA7XG4gICAgICBnVGVuc29yUG9pbnRlciA9IHN0cmlkZTtcbiAgICAgIGJUZW5zb3JQb2ludGVyID0gc3RyaWRlICogMjtcbiAgICAgIGFUZW5zb3JQb2ludGVyID0gc3RyaWRlICogMztcbiAgICB9IGVsc2UgaWYgKGlucHV0Zm9ybWF0ID09PSAnUkdCJykge1xuICAgICAgclRlbnNvclBvaW50ZXIgPSAwO1xuICAgICAgZ1RlbnNvclBvaW50ZXIgPSBzdHJpZGU7XG4gICAgICBiVGVuc29yUG9pbnRlciA9IHN0cmlkZSAqIDI7XG4gICAgfSBlbHNlIGlmIChpbnB1dGZvcm1hdCA9PT0gJ1JCRycpIHtcbiAgICAgIHJUZW5zb3JQb2ludGVyID0gMDtcbiAgICAgIGJUZW5zb3JQb2ludGVyID0gc3RyaWRlO1xuICAgICAgZ1RlbnNvclBvaW50ZXIgPSBzdHJpZGUgKiAyO1xuICAgIH1cblxuICAgIGltYWdlID0gcGl4ZWxzMkRDb250ZXh0LmNyZWF0ZUltYWdlRGF0YSh3aWR0aCwgaGVpZ2h0KTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGVpZ2h0ICogd2lkdGg7XG4gICAgICAgICBySW1hZ2VQb2ludGVyICs9IHN0ZXAsIGdJbWFnZVBvaW50ZXIgKz0gc3RlcCwgYkltYWdlUG9pbnRlciArPSBzdGVwLCBhSW1hZ2VQb2ludGVyICs9IHN0ZXAsIGkrKykge1xuICAgICAgaW1hZ2UuZGF0YVtySW1hZ2VQb2ludGVyXSA9ICgodGVuc29yLmRhdGFbclRlbnNvclBvaW50ZXIrK10gYXMgbnVtYmVyKSAtIG5vcm1CaWFzWzBdKSAqIG5vcm1NZWFuWzBdOyAgLy8gUiB2YWx1ZVxuICAgICAgaW1hZ2UuZGF0YVtnSW1hZ2VQb2ludGVyXSA9ICgodGVuc29yLmRhdGFbZ1RlbnNvclBvaW50ZXIrK10gYXMgbnVtYmVyKSAtIG5vcm1CaWFzWzFdKSAqIG5vcm1NZWFuWzFdOyAgLy8gRyB2YWx1ZVxuICAgICAgaW1hZ2UuZGF0YVtiSW1hZ2VQb2ludGVyXSA9ICgodGVuc29yLmRhdGFbYlRlbnNvclBvaW50ZXIrK10gYXMgbnVtYmVyKSAtIG5vcm1CaWFzWzJdKSAqIG5vcm1NZWFuWzJdOyAgLy8gQiB2YWx1ZVxuICAgICAgaW1hZ2UuZGF0YVthSW1hZ2VQb2ludGVyXSA9IGFUZW5zb3JQb2ludGVyID09PSAtMSA/XG4gICAgICAgICAgMjU1IDpcbiAgICAgICAgICAoKHRlbnNvci5kYXRhW2FUZW5zb3JQb2ludGVyKytdIGFzIG51bWJlcikgLSBub3JtQmlhc1szXSkgKiBub3JtTWVhblszXTsgIC8vIEEgdmFsdWVcbiAgICB9XG5cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbiBub3QgYWNjZXNzIGltYWdlIGRhdGEnKTtcbiAgfVxuICByZXR1cm4gaW1hZ2U7XG59O1xuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQge09wdGlvbnNEaW1lbnNpb25zLCBPcHRpb25zRm9ybWF0LCBPcHRpb25zTm9ybWFsaXphdGlvblBhcmFtZXRlcnMsIE9wdGlvbnNUZW5zb3JGb3JtYXQsIE9wdGlvbnNUZW5zb3JMYXlvdXQsIFRlbnNvckZyb21HcHVCdWZmZXJPcHRpb25zLCBUZW5zb3JGcm9tSW1hZ2VCaXRtYXBPcHRpb25zLCBUZW5zb3JGcm9tSW1hZ2VEYXRhT3B0aW9ucywgVGVuc29yRnJvbUltYWdlRWxlbWVudE9wdGlvbnMsIFRlbnNvckZyb21UZXh0dXJlT3B0aW9ucywgVGVuc29yRnJvbVVybE9wdGlvbnN9IGZyb20gJy4vdGVuc29yLWZhY3RvcnkuanMnO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4vdGVuc29yLWltcGwuanMnO1xuaW1wb3J0IHtUZW5zb3IgYXMgVGVuc29ySW50ZXJmYWNlfSBmcm9tICcuL3RlbnNvci5qcyc7XG5cbmludGVyZmFjZSBCdWZmZXJUb1RlbnNvck9wdGlvbnMgZXh0ZW5kcyBPcHRpb25zRGltZW5zaW9ucywgT3B0aW9uc1RlbnNvckxheW91dCwgT3B0aW9uc05vcm1hbGl6YXRpb25QYXJhbWV0ZXJzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9wdGlvbnNGb3JtYXQsIE9wdGlvbnNUZW5zb3JGb3JtYXQge31cblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgdGVuc29yIG9iamVjdCBmcm9tIGltYWdlIG9iamVjdFxuICpcbiAqIEBwYXJhbSBidWZmZXIgLSBFeHRyYWN0ZWQgaW1hZ2UgYnVmZmVyIGRhdGEgLSBhc3N1bWluZyBSR0JBIGZvcm1hdFxuICogQHBhcmFtIGltYWdlRm9ybWF0IC0gaW5wdXQgaW1hZ2UgY29uZmlndXJhdGlvbiAtIHJlcXVpcmVkIGNvbmZpZ3VyYXRpb25zIGhlaWdodCwgd2lkdGgsIGZvcm1hdFxuICogQHBhcmFtIHRlbnNvckZvcm1hdCAtIG91dHB1dCB0ZW5zb3IgY29uZmlndXJhdGlvbiAtIERlZmF1bHQgaXMgUkdCIGZvcm1hdFxuICovXG5leHBvcnQgY29uc3QgYnVmZmVyVG9UZW5zb3IgPSAoYnVmZmVyOiBVaW50OENsYW1wZWRBcnJheXx1bmRlZmluZWQsIG9wdGlvbnM6IEJ1ZmZlclRvVGVuc29yT3B0aW9ucyk6IFRlbnNvciA9PiB7XG4gIGlmIChidWZmZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW1hZ2UgYnVmZmVyIG11c3QgYmUgZGVmaW5lZCcpO1xuICB9XG4gIGlmIChvcHRpb25zLmhlaWdodCA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMud2lkdGggPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW1hZ2UgaGVpZ2h0IGFuZCB3aWR0aCBtdXN0IGJlIGRlZmluZWQnKTtcbiAgfVxuICBpZiAob3B0aW9ucy50ZW5zb3JMYXlvdXQgPT09ICdOSFdDJykge1xuICAgIHRocm93IG5ldyBFcnJvcignTkhXQyBUZW5zb3IgbGF5b3V0IGlzIG5vdCBzdXBwb3J0ZWQgeWV0Jyk7XG4gIH1cblxuICBjb25zdCB7aGVpZ2h0LCB3aWR0aH0gPSBvcHRpb25zO1xuXG4gIGNvbnN0IG5vcm0gPSBvcHRpb25zLm5vcm0gPz8ge21lYW46IDI1NSwgYmlhczogMH07XG4gIGxldCBub3JtTWVhbjogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XG4gIGxldCBub3JtQmlhczogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XG5cbiAgaWYgKHR5cGVvZiAobm9ybS5tZWFuKSA9PT0gJ251bWJlcicpIHtcbiAgICBub3JtTWVhbiA9IFtub3JtLm1lYW4sIG5vcm0ubWVhbiwgbm9ybS5tZWFuLCBub3JtLm1lYW5dO1xuICB9IGVsc2Uge1xuICAgIG5vcm1NZWFuID0gW25vcm0ubWVhbiFbMF0sIG5vcm0ubWVhbiFbMV0sIG5vcm0ubWVhbiFbMl0sIG5vcm0ubWVhbiFbM10gPz8gMjU1XTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgKG5vcm0uYmlhcykgPT09ICdudW1iZXInKSB7XG4gICAgbm9ybUJpYXMgPSBbbm9ybS5iaWFzLCBub3JtLmJpYXMsIG5vcm0uYmlhcywgbm9ybS5iaWFzXTtcbiAgfSBlbHNlIHtcbiAgICBub3JtQmlhcyA9IFtub3JtLmJpYXMhWzBdLCBub3JtLmJpYXMhWzFdLCBub3JtLmJpYXMhWzJdLCBub3JtLmJpYXMhWzNdID8/IDBdO1xuICB9XG5cbiAgY29uc3QgaW5wdXRmb3JtYXQgPSBvcHRpb25zLmZvcm1hdCAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5mb3JtYXQgOiAnUkdCQSc7XG4gIC8vIGRlZmF1bHQgdmFsdWUgaXMgUkdCQSBzaW5jZSBpbWFnZWRhdGEgYW5kIEhUTUxJbWFnZUVsZW1lbnQgdXNlcyBpdFxuXG4gIGNvbnN0IG91dHB1dGZvcm1hdCA9XG4gICAgICBvcHRpb25zLnRlbnNvckZvcm1hdCAhPT0gdW5kZWZpbmVkID8gKG9wdGlvbnMudGVuc29yRm9ybWF0ICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLnRlbnNvckZvcm1hdCA6ICdSR0InKSA6ICdSR0InO1xuICBjb25zdCBzdHJpZGUgPSBoZWlnaHQgKiB3aWR0aDtcbiAgY29uc3QgZmxvYXQzMkRhdGEgPSBvdXRwdXRmb3JtYXQgPT09ICdSR0JBJyA/IG5ldyBGbG9hdDMyQXJyYXkoc3RyaWRlICogNCkgOiBuZXcgRmxvYXQzMkFycmF5KHN0cmlkZSAqIDMpO1xuXG4gIC8vIERlZmF1bHQgcG9pbnRlciBhc3NpZ25tZW50c1xuICBsZXQgc3RlcCA9IDQsIHJJbWFnZVBvaW50ZXIgPSAwLCBnSW1hZ2VQb2ludGVyID0gMSwgYkltYWdlUG9pbnRlciA9IDIsIGFJbWFnZVBvaW50ZXIgPSAzO1xuICBsZXQgclRlbnNvclBvaW50ZXIgPSAwLCBnVGVuc29yUG9pbnRlciA9IHN0cmlkZSwgYlRlbnNvclBvaW50ZXIgPSBzdHJpZGUgKiAyLCBhVGVuc29yUG9pbnRlciA9IC0xO1xuXG4gIC8vIFVwZGF0aW5nIHRoZSBwb2ludGVyIGFzc2lnbm1lbnRzIGJhc2VkIG9uIHRoZSBpbnB1dCBpbWFnZSBmb3JtYXRcbiAgaWYgKGlucHV0Zm9ybWF0ID09PSAnUkdCJykge1xuICAgIHN0ZXAgPSAzO1xuICAgIHJJbWFnZVBvaW50ZXIgPSAwO1xuICAgIGdJbWFnZVBvaW50ZXIgPSAxO1xuICAgIGJJbWFnZVBvaW50ZXIgPSAyO1xuICAgIGFJbWFnZVBvaW50ZXIgPSAtMTtcbiAgfVxuXG4gIC8vIFVwZGF0aW5nIHRoZSBwb2ludGVyIGFzc2lnbm1lbnRzIGJhc2VkIG9uIHRoZSBvdXRwdXQgdGVuc29yIGZvcm1hdFxuICBpZiAob3V0cHV0Zm9ybWF0ID09PSAnUkdCQScpIHtcbiAgICBhVGVuc29yUG9pbnRlciA9IHN0cmlkZSAqIDM7XG4gIH0gZWxzZSBpZiAob3V0cHV0Zm9ybWF0ID09PSAnUkJHJykge1xuICAgIHJUZW5zb3JQb2ludGVyID0gMDtcbiAgICBiVGVuc29yUG9pbnRlciA9IHN0cmlkZTtcbiAgICBnVGVuc29yUG9pbnRlciA9IHN0cmlkZSAqIDI7XG4gIH0gZWxzZSBpZiAob3V0cHV0Zm9ybWF0ID09PSAnQkdSJykge1xuICAgIGJUZW5zb3JQb2ludGVyID0gMDtcbiAgICBnVGVuc29yUG9pbnRlciA9IHN0cmlkZTtcbiAgICByVGVuc29yUG9pbnRlciA9IHN0cmlkZSAqIDI7XG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0cmlkZTtcbiAgICAgICBpKyssIHJJbWFnZVBvaW50ZXIgKz0gc3RlcCwgYkltYWdlUG9pbnRlciArPSBzdGVwLCBnSW1hZ2VQb2ludGVyICs9IHN0ZXAsIGFJbWFnZVBvaW50ZXIgKz0gc3RlcCkge1xuICAgIGZsb2F0MzJEYXRhW3JUZW5zb3JQb2ludGVyKytdID0gKGJ1ZmZlcltySW1hZ2VQb2ludGVyXSArIG5vcm1CaWFzWzBdKSAvIG5vcm1NZWFuWzBdO1xuICAgIGZsb2F0MzJEYXRhW2dUZW5zb3JQb2ludGVyKytdID0gKGJ1ZmZlcltnSW1hZ2VQb2ludGVyXSArIG5vcm1CaWFzWzFdKSAvIG5vcm1NZWFuWzFdO1xuICAgIGZsb2F0MzJEYXRhW2JUZW5zb3JQb2ludGVyKytdID0gKGJ1ZmZlcltiSW1hZ2VQb2ludGVyXSArIG5vcm1CaWFzWzJdKSAvIG5vcm1NZWFuWzJdO1xuICAgIGlmIChhVGVuc29yUG9pbnRlciAhPT0gLTEgJiYgYUltYWdlUG9pbnRlciAhPT0gLTEpIHtcbiAgICAgIGZsb2F0MzJEYXRhW2FUZW5zb3JQb2ludGVyKytdID0gKGJ1ZmZlclthSW1hZ2VQb2ludGVyXSArIG5vcm1CaWFzWzNdKSAvIG5vcm1NZWFuWzNdO1xuICAgIH1cbiAgfVxuXG4gIC8vIEZsb2F0MzJBcnJheSAtPiBvcnQuVGVuc29yXG4gIGNvbnN0IG91dHB1dFRlbnNvciA9IG91dHB1dGZvcm1hdCA9PT0gJ1JHQkEnID8gbmV3IFRlbnNvcignZmxvYXQzMicsIGZsb2F0MzJEYXRhLCBbMSwgNCwgaGVpZ2h0LCB3aWR0aF0pIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVGVuc29yKCdmbG9hdDMyJywgZmxvYXQzMkRhdGEsIFsxLCAzLCBoZWlnaHQsIHdpZHRoXSk7XG4gIHJldHVybiBvdXRwdXRUZW5zb3I7XG59O1xuXG4vKipcbiAqIGltcGxlbWVudGF0aW9uIG9mIFRlbnNvci5mcm9tSW1hZ2UoKS5cbiAqL1xuZXhwb3J0IGNvbnN0IHRlbnNvckZyb21JbWFnZSA9IGFzeW5jKFxuICAgIGltYWdlOiBJbWFnZURhdGF8SFRNTEltYWdlRWxlbWVudHxJbWFnZUJpdG1hcHxzdHJpbmcsXG4gICAgb3B0aW9ucz86IFRlbnNvckZyb21JbWFnZURhdGFPcHRpb25zfFRlbnNvckZyb21JbWFnZUVsZW1lbnRPcHRpb25zfFRlbnNvckZyb21JbWFnZUJpdG1hcE9wdGlvbnN8XG4gICAgVGVuc29yRnJvbVVybE9wdGlvbnMpOiBQcm9taXNlPFRlbnNvcj4gPT4ge1xuICAvLyBjaGVja2luZyB0aGUgdHlwZSBvZiBpbWFnZSBvYmplY3RcbiAgY29uc3QgaXNIVE1MSW1hZ2VFbGUgPSB0eXBlb2YgKEhUTUxJbWFnZUVsZW1lbnQpICE9PSAndW5kZWZpbmVkJyAmJiBpbWFnZSBpbnN0YW5jZW9mIEhUTUxJbWFnZUVsZW1lbnQ7XG4gIGNvbnN0IGlzSW1hZ2VEYXRhRWxlID0gdHlwZW9mIChJbWFnZURhdGEpICE9PSAndW5kZWZpbmVkJyAmJiBpbWFnZSBpbnN0YW5jZW9mIEltYWdlRGF0YTtcbiAgY29uc3QgaXNJbWFnZUJpdG1hcCA9IHR5cGVvZiAoSW1hZ2VCaXRtYXApICE9PSAndW5kZWZpbmVkJyAmJiBpbWFnZSBpbnN0YW5jZW9mIEltYWdlQml0bWFwO1xuICBjb25zdCBpc1N0cmluZyA9IHR5cGVvZiBpbWFnZSA9PT0gJ3N0cmluZyc7XG5cbiAgbGV0IGRhdGE6IFVpbnQ4Q2xhbXBlZEFycmF5fHVuZGVmaW5lZDtcbiAgbGV0IGJ1ZmZlclRvVGVuc29yT3B0aW9uczogQnVmZmVyVG9UZW5zb3JPcHRpb25zID0gb3B0aW9ucyA/PyB7fTtcblxuICBjb25zdCBjcmVhdGVDYW52YXMgPSAoKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBPZmZzY3JlZW5DYW52YXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gbmV3IE9mZnNjcmVlbkNhbnZhcygxLCAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW52YXMgaXMgbm90IHN1cHBvcnRlZCcpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgY3JlYXRlQ2FudmFzQ29udGV4dCA9IChjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50fE9mZnNjcmVlbkNhbnZhcykgPT4ge1xuICAgIGlmIChjYW52YXMgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCkge1xuICAgICAgcmV0dXJuIGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIH0gZWxzZSBpZiAoY2FudmFzIGluc3RhbmNlb2YgT2Zmc2NyZWVuQ2FudmFzKSB7XG4gICAgICByZXR1cm4gY2FudmFzLmdldENvbnRleHQoJzJkJykgYXMgT2Zmc2NyZWVuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH07XG4gIC8vIGZpbGxpbmcgYW5kIGNoZWNraW5nIGltYWdlIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICBpZiAoaXNIVE1MSW1hZ2VFbGUpIHtcbiAgICAvLyBIVE1MSW1hZ2VFbGVtZW50IC0gaW1hZ2Ugb2JqZWN0IC0gZm9ybWF0IGlzIFJHQkEgYnkgZGVmYXVsdFxuICAgIGNvbnN0IGNhbnZhcyA9IGNyZWF0ZUNhbnZhcygpO1xuICAgIGNhbnZhcy53aWR0aCA9IGltYWdlLndpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XG4gICAgY29uc3QgcGl4ZWxzMkRDb250ZXh0ID0gY3JlYXRlQ2FudmFzQ29udGV4dChjYW52YXMpO1xuXG4gICAgaWYgKHBpeGVsczJEQ29udGV4dCAhPSBudWxsKSB7XG4gICAgICBsZXQgaGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0O1xuICAgICAgbGV0IHdpZHRoID0gaW1hZ2Uud2lkdGg7XG4gICAgICBpZiAob3B0aW9ucyAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMucmVzaXplZEhlaWdodCAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMucmVzaXplZFdpZHRoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaGVpZ2h0ID0gb3B0aW9ucy5yZXNpemVkSGVpZ2h0O1xuICAgICAgICB3aWR0aCA9IG9wdGlvbnMucmVzaXplZFdpZHRoO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGJ1ZmZlclRvVGVuc29yT3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIGlmIChvcHRpb25zLnRlbnNvckZvcm1hdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbWFnZSBpbnB1dCBjb25maWcgZm9ybWF0IG11c3QgYmUgUkdCQSBmb3IgSFRNTEltYWdlRWxlbWVudCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJ1ZmZlclRvVGVuc29yT3B0aW9ucy50ZW5zb3JGb3JtYXQgPSAnUkdCQSc7XG4gICAgICAgIH1cbiAgICAgICAgYnVmZmVyVG9UZW5zb3JPcHRpb25zLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgYnVmZmVyVG9UZW5zb3JPcHRpb25zLndpZHRoID0gd2lkdGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBidWZmZXJUb1RlbnNvck9wdGlvbnMudGVuc29yRm9ybWF0ID0gJ1JHQkEnO1xuICAgICAgICBidWZmZXJUb1RlbnNvck9wdGlvbnMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICBidWZmZXJUb1RlbnNvck9wdGlvbnMud2lkdGggPSB3aWR0aDtcbiAgICAgIH1cblxuICAgICAgcGl4ZWxzMkRDb250ZXh0LmRyYXdJbWFnZShpbWFnZSwgMCwgMCk7XG4gICAgICBkYXRhID0gcGl4ZWxzMkRDb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCB3aWR0aCwgaGVpZ2h0KS5kYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbiBub3QgYWNjZXNzIGltYWdlIGRhdGEnKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNJbWFnZURhdGFFbGUpIHtcbiAgICBsZXQgaGVpZ2h0OiBudW1iZXI7XG4gICAgbGV0IHdpZHRoOiBudW1iZXI7XG5cbiAgICBpZiAob3B0aW9ucyAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMucmVzaXplZFdpZHRoICE9PSB1bmRlZmluZWQgJiYgb3B0aW9ucy5yZXNpemVkSGVpZ2h0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGhlaWdodCA9IG9wdGlvbnMucmVzaXplZEhlaWdodDtcbiAgICAgIHdpZHRoID0gb3B0aW9ucy5yZXNpemVkV2lkdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlaWdodCA9IGltYWdlLmhlaWdodDtcbiAgICAgIHdpZHRoID0gaW1hZ2Uud2lkdGg7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgYnVmZmVyVG9UZW5zb3JPcHRpb25zID0gb3B0aW9ucztcbiAgICB9XG4gICAgYnVmZmVyVG9UZW5zb3JPcHRpb25zLmZvcm1hdCA9ICdSR0JBJztcbiAgICBidWZmZXJUb1RlbnNvck9wdGlvbnMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIGJ1ZmZlclRvVGVuc29yT3B0aW9ucy53aWR0aCA9IHdpZHRoO1xuXG4gICAgaWYgKG9wdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgdGVtcENhbnZhcyA9IGNyZWF0ZUNhbnZhcygpO1xuXG4gICAgICB0ZW1wQ2FudmFzLndpZHRoID0gd2lkdGg7XG4gICAgICB0ZW1wQ2FudmFzLmhlaWdodCA9IGhlaWdodDtcblxuICAgICAgY29uc3QgcGl4ZWxzMkRDb250ZXh0ID0gY3JlYXRlQ2FudmFzQ29udGV4dCh0ZW1wQ2FudmFzKTtcblxuICAgICAgaWYgKHBpeGVsczJEQ29udGV4dCAhPSBudWxsKSB7XG4gICAgICAgIHBpeGVsczJEQ29udGV4dC5wdXRJbWFnZURhdGEoaW1hZ2UsIDAsIDApO1xuICAgICAgICBkYXRhID0gcGl4ZWxzMkRDb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCB3aWR0aCwgaGVpZ2h0KS5kYXRhO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW4gbm90IGFjY2VzcyBpbWFnZSBkYXRhJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSBpbWFnZS5kYXRhO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc0ltYWdlQml0bWFwKSB7XG4gICAgLy8gSW1hZ2VCaXRtYXAgLSBpbWFnZSBvYmplY3QgLSBmb3JtYXQgbXVzdCBiZSBwcm92aWRlZCBieSB1c2VyXG4gICAgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgcHJvdmlkZSBpbWFnZSBjb25maWcgd2l0aCBmb3JtYXQgZm9yIEltYWdlYml0bWFwJyk7XG4gICAgfVxuXG4gICAgY29uc3QgY2FudmFzID0gY3JlYXRlQ2FudmFzKCk7XG4gICAgY2FudmFzLndpZHRoID0gaW1hZ2Uud2lkdGg7XG4gICAgY2FudmFzLmhlaWdodCA9IGltYWdlLmhlaWdodDtcbiAgICBjb25zdCBwaXhlbHMyRENvbnRleHQgPSBjcmVhdGVDYW52YXNDb250ZXh0KGNhbnZhcyk7XG5cbiAgICBpZiAocGl4ZWxzMkRDb250ZXh0ICE9IG51bGwpIHtcbiAgICAgIGNvbnN0IGhlaWdodCA9IGltYWdlLmhlaWdodDtcbiAgICAgIGNvbnN0IHdpZHRoID0gaW1hZ2Uud2lkdGg7XG4gICAgICBwaXhlbHMyRENvbnRleHQuZHJhd0ltYWdlKGltYWdlLCAwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIGRhdGEgPSBwaXhlbHMyRENvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsIDAsIHdpZHRoLCBoZWlnaHQpLmRhdGE7XG4gICAgICBidWZmZXJUb1RlbnNvck9wdGlvbnMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgYnVmZmVyVG9UZW5zb3JPcHRpb25zLndpZHRoID0gd2lkdGg7XG4gICAgICByZXR1cm4gYnVmZmVyVG9UZW5zb3IoZGF0YSwgYnVmZmVyVG9UZW5zb3JPcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW4gbm90IGFjY2VzcyBpbWFnZSBkYXRhJyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzU3RyaW5nKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGNhbnZhcyA9IGNyZWF0ZUNhbnZhcygpO1xuICAgICAgY29uc3QgY29udGV4dCA9IGNyZWF0ZUNhbnZhc0NvbnRleHQoY2FudmFzKTtcbiAgICAgIGlmICghaW1hZ2UgfHwgIWNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdCgpO1xuICAgICAgfVxuICAgICAgY29uc3QgbmV3SW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgIG5ld0ltYWdlLmNyb3NzT3JpZ2luID0gJ0Fub255bW91cyc7XG4gICAgICBuZXdJbWFnZS5zcmMgPSBpbWFnZTtcbiAgICAgIG5ld0ltYWdlLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgY2FudmFzLndpZHRoID0gbmV3SW1hZ2Uud2lkdGg7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBuZXdJbWFnZS5oZWlnaHQ7XG4gICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKG5ld0ltYWdlLCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgICBjb25zdCBpbWcgPSBjb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXG4gICAgICAgIGJ1ZmZlclRvVGVuc29yT3B0aW9ucy5oZWlnaHQgPSBjYW52YXMuaGVpZ2h0O1xuICAgICAgICBidWZmZXJUb1RlbnNvck9wdGlvbnMud2lkdGggPSBjYW52YXMud2lkdGg7XG4gICAgICAgIHJlc29sdmUoYnVmZmVyVG9UZW5zb3IoaW1nLmRhdGEsIGJ1ZmZlclRvVGVuc29yT3B0aW9ucykpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0lucHV0IGRhdGEgcHJvdmlkZWQgaXMgbm90IHN1cHBvcnRlZCAtIGFib3J0ZWQgdGVuc29yIGNyZWF0aW9uJyk7XG4gIH1cblxuICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGJ1ZmZlclRvVGVuc29yKGRhdGEsIGJ1ZmZlclRvVGVuc29yT3B0aW9ucyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnB1dCBkYXRhIHByb3ZpZGVkIGlzIG5vdCBzdXBwb3J0ZWQgLSBhYm9ydGVkIHRlbnNvciBjcmVhdGlvbicpO1xuICB9XG59O1xuXG4vKipcbiAqIGltcGxlbWVudGF0aW9uIG9mIFRlbnNvci5mcm9tVGV4dHVyZSgpLlxuICovXG5leHBvcnQgY29uc3QgdGVuc29yRnJvbVRleHR1cmUgPSA8VCBleHRlbmRzIFRlbnNvckludGVyZmFjZS5UZXh0dXJlRGF0YVR5cGVzPihcbiAgICB0ZXh0dXJlOiBUZW5zb3JJbnRlcmZhY2UuVGV4dHVyZVR5cGUsIG9wdGlvbnM6IFRlbnNvckZyb21UZXh0dXJlT3B0aW9uczxUPik6IFRlbnNvciA9PiB7XG4gIGNvbnN0IHt3aWR0aCwgaGVpZ2h0LCBkb3dubG9hZCwgZGlzcG9zZX0gPSBvcHRpb25zO1xuICAvLyBBbHdheXMgYXNzdW1lIFJHQkFGMzIuIFRPRE86IHN1cHBvcnQgZGlmZmVyZW50IHRleHR1cmUgZm9ybWF0XG4gIGNvbnN0IGRpbXMgPSBbMSwgaGVpZ2h0LCB3aWR0aCwgNF07XG4gIHJldHVybiBuZXcgVGVuc29yKHtsb2NhdGlvbjogJ3RleHR1cmUnLCB0eXBlOiAnZmxvYXQzMicsIHRleHR1cmUsIGRpbXMsIGRvd25sb2FkLCBkaXNwb3NlfSk7XG59O1xuXG4vKipcbiAqIGltcGxlbWVudGF0aW9uIG9mIFRlbnNvci5mcm9tR3B1QnVmZmVyKCkuXG4gKi9cbmV4cG9ydCBjb25zdCB0ZW5zb3JGcm9tR3B1QnVmZmVyID0gPFQgZXh0ZW5kcyBUZW5zb3JJbnRlcmZhY2UuR3B1QnVmZmVyRGF0YVR5cGVzPihcbiAgICBncHVCdWZmZXI6IFRlbnNvckludGVyZmFjZS5HcHVCdWZmZXJUeXBlLCBvcHRpb25zOiBUZW5zb3JGcm9tR3B1QnVmZmVyT3B0aW9uczxUPik6IFRlbnNvciA9PiB7XG4gIGNvbnN0IHtkYXRhVHlwZSwgZGltcywgZG93bmxvYWQsIGRpc3Bvc2V9ID0gb3B0aW9ucztcbiAgcmV0dXJuIG5ldyBUZW5zb3Ioe2xvY2F0aW9uOiAnZ3B1LWJ1ZmZlcicsIHR5cGU6IGRhdGFUeXBlID8/ICdmbG9hdDMyJywgZ3B1QnVmZmVyLCBkaW1zLCBkb3dubG9hZCwgZGlzcG9zZX0pO1xufTtcblxuLyoqXG4gKiBpbXBsZW1lbnRhdGlvbiBvZiBUZW5zb3IuZnJvbVBpbm5lZEJ1ZmZlcigpLlxuICovXG5leHBvcnQgY29uc3QgdGVuc29yRnJvbVBpbm5lZEJ1ZmZlciA9IDxUIGV4dGVuZHMgVGVuc29ySW50ZXJmYWNlLkNwdVBpbm5lZERhdGFUeXBlcz4oXG4gICAgdHlwZTogVCwgYnVmZmVyOiBUZW5zb3JJbnRlcmZhY2UuRGF0YVR5cGVNYXBbVF0sIGRpbXM/OiByZWFkb25seSBudW1iZXJbXSk6IFRlbnNvciA9PlxuICAgIG5ldyBUZW5zb3Ioe2xvY2F0aW9uOiAnY3B1LXBpbm5lZCcsIHR5cGUsIGRhdGE6IGJ1ZmZlciwgZGltczogZGltcyA/PyBbYnVmZmVyLmxlbmd0aF19KTtcbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4vdGVuc29yLmpzJztcblxuZXhwb3J0IHR5cGUgU3VwcG9ydGVkVHlwZWRBcnJheUNvbnN0cnVjdG9ycyA9IEZsb2F0MzJBcnJheUNvbnN0cnVjdG9yfFVpbnQ4QXJyYXlDb25zdHJ1Y3RvcnxJbnQ4QXJyYXlDb25zdHJ1Y3RvcnxcbiAgICBVaW50MTZBcnJheUNvbnN0cnVjdG9yfEludDE2QXJyYXlDb25zdHJ1Y3RvcnxJbnQzMkFycmF5Q29uc3RydWN0b3J8QmlnSW50NjRBcnJheUNvbnN0cnVjdG9yfFVpbnQ4QXJyYXlDb25zdHJ1Y3RvcnxcbiAgICBGbG9hdDY0QXJyYXlDb25zdHJ1Y3RvcnxVaW50MzJBcnJheUNvbnN0cnVjdG9yfEJpZ1VpbnQ2NEFycmF5Q29uc3RydWN0b3I7XG5leHBvcnQgdHlwZSBTdXBwb3J0ZWRUeXBlZEFycmF5ID0gSW5zdGFuY2VUeXBlPFN1cHBvcnRlZFR5cGVkQXJyYXlDb25zdHJ1Y3RvcnM+O1xuXG4vLyBhIHJ1bnRpbWUgbWFwIHRoYXQgbWFwcyB0eXBlIHN0cmluZyB0byBUeXBlZEFycmF5IGNvbnN0cnVjdG9yLiBTaG91bGQgbWF0Y2ggVGVuc29yLkRhdGFUeXBlTWFwLlxuZXhwb3J0IGNvbnN0IE5VTUVSSUNfVEVOU09SX1RZUEVfVE9fVFlQRURBUlJBWV9NQVAgPSBuZXcgTWFwPHN0cmluZywgU3VwcG9ydGVkVHlwZWRBcnJheUNvbnN0cnVjdG9ycz4oW1xuICBbJ2Zsb2F0MzInLCBGbG9hdDMyQXJyYXldLFxuICBbJ3VpbnQ4JywgVWludDhBcnJheV0sXG4gIFsnaW50OCcsIEludDhBcnJheV0sXG4gIFsndWludDE2JywgVWludDE2QXJyYXldLFxuICBbJ2ludDE2JywgSW50MTZBcnJheV0sXG4gIFsnaW50MzInLCBJbnQzMkFycmF5XSxcbiAgWydib29sJywgVWludDhBcnJheV0sXG4gIFsnZmxvYXQ2NCcsIEZsb2F0NjRBcnJheV0sXG4gIFsndWludDMyJywgVWludDMyQXJyYXldLFxuXSk7XG5cbi8vIGEgcnVudGltZSBtYXAgdGhhdCBtYXBzIHR5cGUgc3RyaW5nIHRvIFR5cGVkQXJyYXkgY29uc3RydWN0b3IuIFNob3VsZCBtYXRjaCBUZW5zb3IuRGF0YVR5cGVNYXAuXG5leHBvcnQgY29uc3QgTlVNRVJJQ19URU5TT1JfVFlQRURBUlJBWV9UT19UWVBFX01BUCA9IG5ldyBNYXA8U3VwcG9ydGVkVHlwZWRBcnJheUNvbnN0cnVjdG9ycywgVGVuc29yLlR5cGU+KFtcbiAgW0Zsb2F0MzJBcnJheSwgJ2Zsb2F0MzInXSxcbiAgW1VpbnQ4QXJyYXksICd1aW50OCddLFxuICBbSW50OEFycmF5LCAnaW50OCddLFxuICBbVWludDE2QXJyYXksICd1aW50MTYnXSxcbiAgW0ludDE2QXJyYXksICdpbnQxNiddLFxuICBbSW50MzJBcnJheSwgJ2ludDMyJ10sXG4gIFtGbG9hdDY0QXJyYXksICdmbG9hdDY0J10sXG4gIFtVaW50MzJBcnJheSwgJ3VpbnQzMiddLFxuXSk7XG5cbi8vIGEgZHVtbXkgdHlwZSBkZWNsYXJhdGlvbiBmb3IgRmxvYXQxNkFycmF5IGluIGNhc2UgYW55IHBvbHlmaWxsIGlzIGF2YWlsYWJsZS5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvbiwgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICBjb25zdCBGbG9hdDE2QXJyYXk6IGFueTtcbn1cblxuLy8gdGhlIGZvbGxvd2luZyBjb2RlIGFsbG93cyBkZWxheWluZyBleGVjdXRpb24gb2YgQmlnSW50L0Zsb2F0MTZBcnJheSBjaGVja2luZy4gVGhpcyBhbGxvd3MgbGF6eSBpbml0aWFsaXphdGlvbiBmb3Jcbi8vIE5VTUVSSUNfVEVOU09SX1RZUEVfVE9fVFlQRURBUlJBWV9NQVAgYW5kIE5VTUVSSUNfVEVOU09SX1RZUEVEQVJSQVlfVE9fVFlQRV9NQVAsIHdoaWNoIGFsbG93cyBCaWdJbnQvRmxvYXQxNkFycmF5XG4vLyBwb2x5ZmlsbCBpZiBhdmFpbGFibGUuXG5sZXQgaXNUeXBlZEFycmF5Q2hlY2tlZCA9IGZhbHNlO1xuZXhwb3J0IGNvbnN0IGNoZWNrVHlwZWRBcnJheSA9ICgpID0+IHtcbiAgaWYgKCFpc1R5cGVkQXJyYXlDaGVja2VkKSB7XG4gICAgaXNUeXBlZEFycmF5Q2hlY2tlZCA9IHRydWU7XG4gICAgY29uc3QgaXNCaWdJbnQ2NEFycmF5QXZhaWxhYmxlID0gdHlwZW9mIEJpZ0ludDY0QXJyYXkgIT09ICd1bmRlZmluZWQnICYmIEJpZ0ludDY0QXJyYXkuZnJvbTtcbiAgICBjb25zdCBpc0JpZ1VpbnQ2NEFycmF5QXZhaWxhYmxlID0gdHlwZW9mIEJpZ1VpbnQ2NEFycmF5ICE9PSAndW5kZWZpbmVkJyAmJiBCaWdVaW50NjRBcnJheS5mcm9tO1xuICAgIGNvbnN0IGlzRmxvYXQxNkFycmF5QXZhaWxhYmxlID0gdHlwZW9mIEZsb2F0MTZBcnJheSAhPT0gJ3VuZGVmaW5lZCcgJiYgRmxvYXQxNkFycmF5LmZyb207XG5cbiAgICBpZiAoaXNCaWdJbnQ2NEFycmF5QXZhaWxhYmxlKSB7XG4gICAgICBOVU1FUklDX1RFTlNPUl9UWVBFX1RPX1RZUEVEQVJSQVlfTUFQLnNldCgnaW50NjQnLCBCaWdJbnQ2NEFycmF5KTtcbiAgICAgIE5VTUVSSUNfVEVOU09SX1RZUEVEQVJSQVlfVE9fVFlQRV9NQVAuc2V0KEJpZ0ludDY0QXJyYXksICdpbnQ2NCcpO1xuICAgIH1cbiAgICBpZiAoaXNCaWdVaW50NjRBcnJheUF2YWlsYWJsZSkge1xuICAgICAgTlVNRVJJQ19URU5TT1JfVFlQRV9UT19UWVBFREFSUkFZX01BUC5zZXQoJ3VpbnQ2NCcsIEJpZ1VpbnQ2NEFycmF5KTtcbiAgICAgIE5VTUVSSUNfVEVOU09SX1RZUEVEQVJSQVlfVE9fVFlQRV9NQVAuc2V0KEJpZ1VpbnQ2NEFycmF5LCAndWludDY0Jyk7XG4gICAgfVxuICAgIGlmIChpc0Zsb2F0MTZBcnJheUF2YWlsYWJsZSkge1xuICAgICAgTlVNRVJJQ19URU5TT1JfVFlQRV9UT19UWVBFREFSUkFZX01BUC5zZXQoJ2Zsb2F0MTYnLCBGbG9hdDE2QXJyYXkpO1xuICAgICAgTlVNRVJJQ19URU5TT1JfVFlQRURBUlJBWV9UT19UWVBFX01BUC5zZXQoRmxvYXQxNkFycmF5LCAnZmxvYXQxNicpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpZiBGbG9hdDE2QXJyYXkgaXMgbm90IGF2YWlsYWJsZSwgdXNlICdVaW50MTZBcnJheScgdG8gc3RvcmUgdGhlIGRhdGEuXG4gICAgICBOVU1FUklDX1RFTlNPUl9UWVBFX1RPX1RZUEVEQVJSQVlfTUFQLnNldCgnZmxvYXQxNicsIFVpbnQxNkFycmF5KTtcbiAgICB9XG4gIH1cbn07XG4iLCAiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5cbmltcG9ydCB7Q3B1UGlubmVkQ29uc3RydWN0b3JQYXJhbWV0ZXJzLCBHcHVCdWZmZXJDb25zdHJ1Y3RvclBhcmFtZXRlcnMsIFRleHR1cmVDb25zdHJ1Y3RvclBhcmFtZXRlcnN9IGZyb20gJy4vdGVuc29yLWZhY3RvcnkuanMnO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4vdGVuc29yLWltcGwuanMnO1xuXG4vKipcbiAqIGNhbGN1bGF0ZSBzaXplIGZyb20gZGltcy5cbiAqXG4gKiBAcGFyYW0gZGltcyB0aGUgZGltcyBhcnJheS4gTWF5IGJlIGFuIGlsbGVnYWwgaW5wdXQuXG4gKi9cbmV4cG9ydCBjb25zdCBjYWxjdWxhdGVTaXplID0gKGRpbXM6IHJlYWRvbmx5IHVua25vd25bXSk6IG51bWJlciA9PiB7XG4gIGxldCBzaXplID0gMTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgZGltID0gZGltc1tpXTtcbiAgICBpZiAodHlwZW9mIGRpbSAhPT0gJ251bWJlcicgfHwgIU51bWJlci5pc1NhZmVJbnRlZ2VyKGRpbSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYGRpbXNbJHtpfV0gbXVzdCBiZSBhbiBpbnRlZ2VyLCBnb3Q6ICR7ZGltfWApO1xuICAgIH1cbiAgICBpZiAoZGltIDwgMCkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoYGRpbXNbJHtpfV0gbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyLCBnb3Q6ICR7ZGltfWApO1xuICAgIH1cbiAgICBzaXplICo9IGRpbTtcbiAgfVxuICByZXR1cm4gc2l6ZTtcbn07XG5cbi8qKlxuICogaW1wbGVtZW50YXRpb24gb2YgVGVuc29yLnJlc2hhcGUoKVxuICovXG5leHBvcnQgY29uc3QgdGVuc29yUmVzaGFwZSA9ICh0ZW5zb3I6IFRlbnNvciwgZGltczogcmVhZG9ubHkgbnVtYmVyW10pOiBUZW5zb3IgPT4ge1xuICBzd2l0Y2ggKHRlbnNvci5sb2NhdGlvbikge1xuICAgIGNhc2UgJ2NwdSc6XG4gICAgICByZXR1cm4gbmV3IFRlbnNvcih0ZW5zb3IudHlwZSwgdGVuc29yLmRhdGEsIGRpbXMpO1xuICAgIGNhc2UgJ2NwdS1waW5uZWQnOlxuICAgICAgcmV0dXJuIG5ldyBUZW5zb3Ioe1xuICAgICAgICBsb2NhdGlvbjogJ2NwdS1waW5uZWQnLFxuICAgICAgICBkYXRhOiB0ZW5zb3IuZGF0YSBhcyBDcHVQaW5uZWRDb25zdHJ1Y3RvclBhcmFtZXRlcnNbJ2RhdGEnXSxcbiAgICAgICAgdHlwZTogdGVuc29yLnR5cGUgYXMgQ3B1UGlubmVkQ29uc3RydWN0b3JQYXJhbWV0ZXJzWyd0eXBlJ10sXG4gICAgICAgIGRpbXMsXG4gICAgICB9KTtcbiAgICBjYXNlICd0ZXh0dXJlJzpcbiAgICAgIHJldHVybiBuZXcgVGVuc29yKHtcbiAgICAgICAgbG9jYXRpb246ICd0ZXh0dXJlJyxcbiAgICAgICAgdGV4dHVyZTogdGVuc29yLnRleHR1cmUsXG4gICAgICAgIHR5cGU6IHRlbnNvci50eXBlIGFzIFRleHR1cmVDb25zdHJ1Y3RvclBhcmFtZXRlcnNbJ3R5cGUnXSxcbiAgICAgICAgZGltcyxcbiAgICAgIH0pO1xuICAgIGNhc2UgJ2dwdS1idWZmZXInOlxuICAgICAgcmV0dXJuIG5ldyBUZW5zb3Ioe1xuICAgICAgICBsb2NhdGlvbjogJ2dwdS1idWZmZXInLFxuICAgICAgICBncHVCdWZmZXI6IHRlbnNvci5ncHVCdWZmZXIsXG4gICAgICAgIHR5cGU6IHRlbnNvci50eXBlIGFzIEdwdUJ1ZmZlckNvbnN0cnVjdG9yUGFyYW1ldGVyc1sndHlwZSddLFxuICAgICAgICBkaW1zLFxuICAgICAgfSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdGVuc29yUmVzaGFwZTogdGVuc29yIGxvY2F0aW9uICR7dGVuc29yLmxvY2F0aW9ufSBpcyBub3Qgc3VwcG9ydGVkYCk7XG4gIH1cbn07XG4iLCAiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5cbmltcG9ydCB7dGVuc29yVG9EYXRhVVJMLCB0ZW5zb3JUb0ltYWdlRGF0YX0gZnJvbSAnLi90ZW5zb3ItY29udmVyc2lvbi1pbXBsLmpzJztcbmltcG9ydCB7VGVuc29yVG9EYXRhVXJsT3B0aW9ucywgVGVuc29yVG9JbWFnZURhdGFPcHRpb25zfSBmcm9tICcuL3RlbnNvci1jb252ZXJzaW9uLmpzJztcbmltcG9ydCB7dGVuc29yRnJvbUdwdUJ1ZmZlciwgdGVuc29yRnJvbUltYWdlLCB0ZW5zb3JGcm9tUGlubmVkQnVmZmVyLCB0ZW5zb3JGcm9tVGV4dHVyZX0gZnJvbSAnLi90ZW5zb3ItZmFjdG9yeS1pbXBsLmpzJztcbmltcG9ydCB7Q3B1UGlubmVkQ29uc3RydWN0b3JQYXJhbWV0ZXJzLCBHcHVCdWZmZXJDb25zdHJ1Y3RvclBhcmFtZXRlcnMsIFRlbnNvckZyb21HcHVCdWZmZXJPcHRpb25zLCBUZW5zb3JGcm9tSW1hZ2VCaXRtYXBPcHRpb25zLCBUZW5zb3JGcm9tSW1hZ2VEYXRhT3B0aW9ucywgVGVuc29yRnJvbUltYWdlRWxlbWVudE9wdGlvbnMsIFRlbnNvckZyb21UZXh0dXJlT3B0aW9ucywgVGVuc29yRnJvbVVybE9wdGlvbnMsIFRleHR1cmVDb25zdHJ1Y3RvclBhcmFtZXRlcnN9IGZyb20gJy4vdGVuc29yLWZhY3RvcnkuanMnO1xuaW1wb3J0IHtjaGVja1R5cGVkQXJyYXksIE5VTUVSSUNfVEVOU09SX1RZUEVfVE9fVFlQRURBUlJBWV9NQVAsIE5VTUVSSUNfVEVOU09SX1RZUEVEQVJSQVlfVE9fVFlQRV9NQVAsIFN1cHBvcnRlZFR5cGVkQXJyYXksIFN1cHBvcnRlZFR5cGVkQXJyYXlDb25zdHJ1Y3RvcnN9IGZyb20gJy4vdGVuc29yLWltcGwtdHlwZS1tYXBwaW5nLmpzJztcbmltcG9ydCB7Y2FsY3VsYXRlU2l6ZSwgdGVuc29yUmVzaGFwZX0gZnJvbSAnLi90ZW5zb3ItdXRpbHMtaW1wbC5qcyc7XG5pbXBvcnQge1RlbnNvciBhcyBUZW5zb3JJbnRlcmZhY2V9IGZyb20gJy4vdGVuc29yLmpzJztcblxuLy8gdHlwZSBhbGlhc2VzIGZvciB0aG9zZSBleHBvcnRlZCBmcm9tIFRlbnNvciBpbnRlcmZhY2VcblxudHlwZSBUZW5zb3JUeXBlID0gVGVuc29ySW50ZXJmYWNlLlR5cGU7XG50eXBlIFRlbnNvckRhdGFUeXBlID0gVGVuc29ySW50ZXJmYWNlLkRhdGFUeXBlO1xudHlwZSBUZW5zb3JEYXRhTG9jYXRpb24gPSBUZW5zb3JJbnRlcmZhY2UuRGF0YUxvY2F0aW9uO1xudHlwZSBUZW5zb3JUZXh0dXJlVHlwZSA9IFRlbnNvckludGVyZmFjZS5UZXh0dXJlVHlwZTtcbnR5cGUgVGVuc29yR3B1QnVmZmVyVHlwZSA9IFRlbnNvckludGVyZmFjZS5HcHVCdWZmZXJUeXBlO1xuXG4vKipcbiAqIHRoZSBpbXBsZW1lbnRhdGlvbiBvZiBUZW5zb3IgaW50ZXJmYWNlLlxuICpcbiAqIEBpZ25vcmVcbiAqL1xuZXhwb3J0IGNsYXNzIFRlbnNvciBpbXBsZW1lbnRzIFRlbnNvckludGVyZmFjZSB7XG4gIC8vICNyZWdpb24gY29uc3RydWN0b3JzXG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIG5ldyBDUFUgdGVuc29yIG9iamVjdCBmcm9tIHRoZSBnaXZlbiB0eXBlLCBkYXRhIGFuZCBkaW1zLlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICB0eXBlOiBUZW5zb3JUeXBlLCBkYXRhOiBUZW5zb3JEYXRhVHlwZXxyZWFkb25seSBzdHJpbmdbXXxyZWFkb25seSBudW1iZXJbXXxyZWFkb25seSBib29sZWFuW10sXG4gICAgICBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10pO1xuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IENQVSB0ZW5zb3Igb2JqZWN0IGZyb20gdGhlIGdpdmVuIGRhdGEgYW5kIGRpbXMuIFR5cGUgaXMgaW5mZXJyZWQgZnJvbSBkYXRhLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YTogVGVuc29yRGF0YVR5cGV8cmVhZG9ubHkgc3RyaW5nW118cmVhZG9ubHkgYm9vbGVhbltdLCBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10pO1xuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IHRlbnNvciBvYmplY3QgZnJvbSB0aGUgcGlubmVkIENQVSBkYXRhIHdpdGggdGhlIGdpdmVuIHR5cGUgYW5kIGRpbXMuXG4gICAqXG4gICAqIFRlbnNvcidzIGxvY2F0aW9uIHdpbGwgYmUgc2V0IHRvICdjcHUtcGlubmVkJy5cbiAgICpcbiAgICogQHBhcmFtIHBhcmFtcyAtIFNwZWNpZnkgdGhlIHBhcmFtZXRlcnMgdG8gY29uc3RydWN0IHRoZSB0ZW5zb3IuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJhbXM6IENwdVBpbm5lZENvbnN0cnVjdG9yUGFyYW1ldGVycyk7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYSBuZXcgdGVuc29yIG9iamVjdCBmcm9tIHRoZSBXZWJHTCB0ZXh0dXJlIHdpdGggdGhlIGdpdmVuIHR5cGUgYW5kIGRpbXMuXG4gICAqXG4gICAqIFRlbnNvcidzIGxvY2F0aW9uIHdpbGwgYmUgc2V0IHRvICd0ZXh0dXJlJy5cbiAgICpcbiAgICogQHBhcmFtIHBhcmFtcyAtIFNwZWNpZnkgdGhlIHBhcmFtZXRlcnMgdG8gY29uc3RydWN0IHRoZSB0ZW5zb3IuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJhbXM6IFRleHR1cmVDb25zdHJ1Y3RvclBhcmFtZXRlcnMpO1xuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IHRlbnNvciBvYmplY3QgZnJvbSB0aGUgV2ViR1BVIGJ1ZmZlciB3aXRoIHRoZSBnaXZlbiB0eXBlIGFuZCBkaW1zLlxuICAgKlxuICAgKiBUZW5zb3IncyBsb2NhdGlvbiB3aWxsIGJlIHNldCB0byAnZ3B1LWJ1ZmZlcicuXG4gICAqXG4gICAqIEBwYXJhbSBwYXJhbXMgLSBTcGVjaWZ5IHRoZSBwYXJhbWV0ZXJzIHRvIGNvbnN0cnVjdCB0aGUgdGVuc29yLlxuICAgKi9cbiAgY29uc3RydWN0b3IocGFyYW1zOiBHcHVCdWZmZXJDb25zdHJ1Y3RvclBhcmFtZXRlcnMpO1xuXG4gIC8qKlxuICAgKiBpbXBsZW1lbnRhdGlvbi5cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgYXJnMDogVGVuc29yVHlwZXxUZW5zb3JEYXRhVHlwZXxyZWFkb25seSBzdHJpbmdbXXxyZWFkb25seSBib29sZWFuW118Q3B1UGlubmVkQ29uc3RydWN0b3JQYXJhbWV0ZXJzfFxuICAgICAgVGV4dHVyZUNvbnN0cnVjdG9yUGFyYW1ldGVyc3xHcHVCdWZmZXJDb25zdHJ1Y3RvclBhcmFtZXRlcnMsXG4gICAgICBhcmcxPzogVGVuc29yRGF0YVR5cGV8cmVhZG9ubHkgbnVtYmVyW118cmVhZG9ubHkgc3RyaW5nW118cmVhZG9ubHkgYm9vbGVhbltdLCBhcmcyPzogcmVhZG9ubHkgbnVtYmVyW10pIHtcbiAgICAvLyBwZXJmb3JtIG9uZS10aW1lIGNoZWNrIGZvciBCaWdJbnQvRmxvYXQxNkFycmF5IHN1cHBvcnRcbiAgICBjaGVja1R5cGVkQXJyYXkoKTtcblxuICAgIGxldCB0eXBlOiBUZW5zb3JUeXBlO1xuICAgIGxldCBkaW1zOiByZWFkb25seSBudW1iZXJbXTtcblxuICAgIGlmICh0eXBlb2YgYXJnMCA9PT0gJ29iamVjdCcgJiYgJ2xvY2F0aW9uJyBpbiBhcmcwKSB7XG4gICAgICAvL1xuICAgICAgLy8gY29uc3RydWN0aW5nIHRlbnNvciBmcm9tIHNwZWNpZmljIGxvY2F0aW9uXG4gICAgICAvL1xuICAgICAgdGhpcy5kYXRhTG9jYXRpb24gPSBhcmcwLmxvY2F0aW9uO1xuICAgICAgdHlwZSA9IGFyZzAudHlwZTtcbiAgICAgIGRpbXMgPSBhcmcwLmRpbXM7XG4gICAgICBzd2l0Y2ggKGFyZzAubG9jYXRpb24pIHtcbiAgICAgICAgY2FzZSAnY3B1LXBpbm5lZCc6IHtcbiAgICAgICAgICBjb25zdCBleHBlY3RlZFR5cGVkQXJyYXlDb25zdHJ1Y3RvciA9IE5VTUVSSUNfVEVOU09SX1RZUEVfVE9fVFlQRURBUlJBWV9NQVAuZ2V0KHR5cGUpO1xuICAgICAgICAgIGlmICghZXhwZWN0ZWRUeXBlZEFycmF5Q29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYHVuc3VwcG9ydGVkIHR5cGUgXCIke3R5cGV9XCIgdG8gY3JlYXRlIHRlbnNvciBmcm9tIHBpbm5lZCBidWZmZXJgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCEoYXJnMC5kYXRhIGluc3RhbmNlb2YgZXhwZWN0ZWRUeXBlZEFycmF5Q29uc3RydWN0b3IpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBidWZmZXIgc2hvdWxkIGJlIG9mIHR5cGUgJHtleHBlY3RlZFR5cGVkQXJyYXlDb25zdHJ1Y3Rvci5uYW1lfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmNwdURhdGEgPSBhcmcwLmRhdGE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAndGV4dHVyZSc6IHtcbiAgICAgICAgICBpZiAodHlwZSAhPT0gJ2Zsb2F0MzInKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGB1bnN1cHBvcnRlZCB0eXBlIFwiJHt0eXBlfVwiIHRvIGNyZWF0ZSB0ZW5zb3IgZnJvbSB0ZXh0dXJlYCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuZ3B1VGV4dHVyZURhdGEgPSBhcmcwLnRleHR1cmU7XG4gICAgICAgICAgdGhpcy5kb3dubG9hZGVyID0gYXJnMC5kb3dubG9hZDtcbiAgICAgICAgICB0aGlzLmRpc3Bvc2VyID0gYXJnMC5kaXNwb3NlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ2dwdS1idWZmZXInOiB7XG4gICAgICAgICAgaWYgKCh0eXBlICE9PSAnZmxvYXQzMicgJiYgdHlwZSAhPT0gJ2Zsb2F0MTYnICYmIHR5cGUgIT09ICdpbnQzMicgJiYgdHlwZSAhPT0gJ2ludDY0JyAmJiB0eXBlICE9PSAndWludDMyJyAmJlxuICAgICAgICAgICAgICAgdHlwZSAhPT0gJ3VpbnQ4JyAmJiB0eXBlICE9PSAnYm9vbCcpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGB1bnN1cHBvcnRlZCB0eXBlIFwiJHt0eXBlfVwiIHRvIGNyZWF0ZSB0ZW5zb3IgZnJvbSBncHUgYnVmZmVyYCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuZ3B1QnVmZmVyRGF0YSA9IGFyZzAuZ3B1QnVmZmVyO1xuICAgICAgICAgIHRoaXMuZG93bmxvYWRlciA9IGFyZzAuZG93bmxvYWQ7XG4gICAgICAgICAgdGhpcy5kaXNwb3NlciA9IGFyZzAuZGlzcG9zZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGVuc29yIGNvbnN0cnVjdG9yOiB1bnN1cHBvcnRlZCBsb2NhdGlvbiAnJHt0aGlzLmRhdGFMb2NhdGlvbn0nYCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vXG4gICAgICAvLyBjb25zdHJ1Y3RpbmcgdGVuc29yIG9mIGxvY2F0aW9uICdjcHUnXG4gICAgICAvL1xuICAgICAgbGV0IGRhdGE6IFRlbnNvckRhdGFUeXBlO1xuICAgICAgbGV0IG1heWJlRGltczogdHlwZW9mIGFyZzF8dHlwZW9mIGFyZzI7XG4gICAgICAvLyBjaGVjayB3aGV0aGVyIGFyZzAgaXMgdHlwZSBvciBkYXRhXG4gICAgICBpZiAodHlwZW9mIGFyZzAgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vXG4gICAgICAgIC8vIE92ZXJyaWRlOiBjb25zdHJ1Y3Rvcih0eXBlLCBkYXRhLCAuLi4pXG4gICAgICAgIC8vXG4gICAgICAgIHR5cGUgPSBhcmcwO1xuICAgICAgICBtYXliZURpbXMgPSBhcmcyO1xuICAgICAgICBpZiAoYXJnMCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAvLyBzdHJpbmcgdGVuc29yXG4gICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGFyZzEpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBIHN0cmluZyB0ZW5zb3JcXCdzIGRhdGEgbXVzdCBiZSBhIHN0cmluZyBhcnJheS4nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gd2UgZG9uJ3QgY2hlY2sgd2hldGhlciBldmVyeSBlbGVtZW50IGluIHRoZSBhcnJheSBpcyBzdHJpbmc7IHRoaXMgaXMgdG9vIHNsb3cuIHdlIGFzc3VtZSBpdCdzIGNvcnJlY3QgYW5kXG4gICAgICAgICAgLy8gZXJyb3Igd2lsbCBiZSBwb3B1bGF0ZWQgYXQgaW5mZXJlbmNlXG4gICAgICAgICAgZGF0YSA9IGFyZzE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gbnVtZXJpYyB0ZW5zb3JcbiAgICAgICAgICBjb25zdCB0eXBlZEFycmF5Q29uc3RydWN0b3IgPSBOVU1FUklDX1RFTlNPUl9UWVBFX1RPX1RZUEVEQVJSQVlfTUFQLmdldChhcmcwKTtcbiAgICAgICAgICBpZiAodHlwZWRBcnJheUNvbnN0cnVjdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFVuc3VwcG9ydGVkIHRlbnNvciB0eXBlOiAke2FyZzB9LmApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhcmcxKSkge1xuICAgICAgICAgICAgaWYgKGFyZzAgPT09ICdmbG9hdDE2JyAmJiB0eXBlZEFycmF5Q29uc3RydWN0b3IgPT09IFVpbnQxNkFycmF5KSB7XG4gICAgICAgICAgICAgIC8vIFdoZW4gbm8gRmxvYXQxNkFycmF5IHBvbHlmaWxsIGlzIHVzZWQsIHdlIGNhbm5vdCBjcmVhdGUgJ2Zsb2F0MTYnIHRlbnNvciBmcm9tIG51bWJlciBhcnJheS5cbiAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgLy8gVGhyb3cgZXJyb3IgaGVyZSBiZWNhdXNlIHdoZW4gdXNlciB0cnkgdG8gdXNlIG51bWJlciBhcnJheSBhcyBkYXRhLFxuICAgICAgICAgICAgICAvLyBlLmcuIG5ldyBUZW5zb3IoJ2Zsb2F0MTYnLCBbMSwgMiwgMywgNF0sIGRpbXMpKSwgaXQgd2lsbCBhY3R1YWxseSBjYWxsXG4gICAgICAgICAgICAgIC8vIFVpbnQxNkFycmF5LmZyb20oYXJnMSkgd2hpY2ggZ2VuZXJhdGVzIHdyb25nIGRhdGEuXG4gICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgICAgICAgICAnQ3JlYXRpbmcgYSBmbG9hdDE2IHRlbnNvciBmcm9tIG51bWJlciBhcnJheSBpcyBub3Qgc3VwcG9ydGVkLiBQbGVhc2UgdXNlIFVpbnQxNkFycmF5IGFzIGRhdGEuJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFyZzAgPT09ICd1aW50NjQnIHx8IGFyZzAgPT09ICdpbnQ2NCcpIHtcbiAgICAgICAgICAgICAgLy8gdXNlICdhcyBhbnknIGhlcmUgYmVjYXVzZTpcbiAgICAgICAgICAgICAgLy8gMS4gVHlwZVNjcmlwdCdzIGNoZWNrIG9uIHR5cGUgb2YgJ0FycmF5LmlzQXJyYXkoKScgZG9lcyBub3Qgd29yayB3aXRoIHJlYWRvbmx5IGFycmF5cy5cbiAgICAgICAgICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTcwMDJcbiAgICAgICAgICAgICAgLy8gMi4gVHlwZVNjcmlwdCdzIGNoZWNrIG9uIHVuaW9uIHR5cGUgb2YgJyhCaWdJbnQ2NEFycmF5Q29uc3RydWN0b3J8QmlnVWludDY0QXJyYXlDb25zdHJ1Y3RvcikuZnJvbSgpJ1xuICAgICAgICAgICAgICAvLyBkb2VzIG5vdCBhY2NlcHQgcGFyYW1ldGVyIG1hcEZuLlxuICAgICAgICAgICAgICAvLyAzLiBwYXJhbWV0ZXJzIG9mICdTdXBwb3J0ZWRUeXBlZEFycmF5Q29uc3RydWN0b3JzLmZyb20oKScgZG9lcyBub3QgbWF0Y2ggdGhlIHJlcXVpcmVtZW50IG9mIHRoZSB1bmlvblxuICAgICAgICAgICAgICAvLyB0eXBlLlxuXG4gICAgICAgICAgICAgIC8vIGFzc3VtZSAnYXJnMScgaXMgb2YgdHlwZSBcInJlYWRvbmx5IG51bWJlcltdfHJlYWRvbmx5IGJpZ2ludFtdXCIgaGVyZS5cblxuICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICAgICAgICBkYXRhID0gKHR5cGVkQXJyYXlDb25zdHJ1Y3RvciBhcyBhbnkpLmZyb20oYXJnMSwgQmlnSW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIGFzc3VtZSAnYXJnMScgaXMgb2YgdHlwZSBcInJlYWRvbmx5IG51bWJlcltdXCIgaGVyZS5cbiAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgICAgICAgZGF0YSA9ICh0eXBlZEFycmF5Q29uc3RydWN0b3IgYXMgYW55KS5mcm9tKGFyZzEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoYXJnMSBpbnN0YW5jZW9mIHR5cGVkQXJyYXlDb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgZGF0YSA9IGFyZzE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEEgJHt0eXBlfSB0ZW5zb3IncyBkYXRhIG11c3QgYmUgdHlwZSBvZiAke3R5cGVkQXJyYXlDb25zdHJ1Y3Rvcn1gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vXG4gICAgICAgIC8vIE92ZXJyaWRlOiBjb25zdHJ1Y3RvcihkYXRhLCAuLi4pXG4gICAgICAgIC8vXG4gICAgICAgIG1heWJlRGltcyA9IGFyZzE7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGFyZzApKSB7XG4gICAgICAgICAgLy8gb25seSBib29sZWFuW10gYW5kIHN0cmluZ1tdIGlzIHN1cHBvcnRlZFxuICAgICAgICAgIGlmIChhcmcwLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGVuc29yIHR5cGUgY2Fubm90IGJlIGluZmVycmVkIGZyb20gYW4gZW1wdHkgYXJyYXkuJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGZpcnN0RWxlbWVudFR5cGUgPSB0eXBlb2YgYXJnMFswXTtcbiAgICAgICAgICBpZiAoZmlyc3RFbGVtZW50VHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHR5cGUgPSAnc3RyaW5nJztcbiAgICAgICAgICAgIGRhdGEgPSBhcmcwO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZmlyc3RFbGVtZW50VHlwZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICB0eXBlID0gJ2Jvb2wnO1xuICAgICAgICAgICAgLy8gJ2FyZzAnIGlzIG9mIHR5cGUgJ2Jvb2xlYW5bXScuIFVpbnQ4QXJyYXkuZnJvbShib29sZWFuW10pIGFjdHVhbGx5IHdvcmtzLCBidXQgdHlwZXNjcmlwdCB0aGlua3MgdGhpcyBpc1xuICAgICAgICAgICAgLy8gd3JvbmcgdHlwZS4gV2UgdXNlICdhcyBhbnknIHRvIG1ha2UgaXQgaGFwcHkuXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICAgICAgZGF0YSA9IFVpbnQ4QXJyYXkuZnJvbShhcmcwIGFzIGFueVtdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgSW52YWxpZCBlbGVtZW50IHR5cGUgb2YgZGF0YSBhcnJheTogJHtmaXJzdEVsZW1lbnRUeXBlfS5gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZ2V0IHRlbnNvciB0eXBlIGZyb20gVHlwZWRBcnJheVxuICAgICAgICAgIGNvbnN0IG1hcHBlZFR5cGUgPVxuICAgICAgICAgICAgICBOVU1FUklDX1RFTlNPUl9UWVBFREFSUkFZX1RPX1RZUEVfTUFQLmdldChhcmcwLmNvbnN0cnVjdG9yIGFzIFN1cHBvcnRlZFR5cGVkQXJyYXlDb25zdHJ1Y3RvcnMpO1xuICAgICAgICAgIGlmIChtYXBwZWRUeXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFVuc3VwcG9ydGVkIHR5cGUgZm9yIHRlbnNvciBkYXRhOiAke2FyZzAuY29uc3RydWN0b3J9LmApO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0eXBlID0gbWFwcGVkVHlwZTtcbiAgICAgICAgICBkYXRhID0gYXJnMCBhcyBTdXBwb3J0ZWRUeXBlZEFycmF5O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHR5cGUgYW5kIGRhdGEgaXMgcHJvY2Vzc2VkLCBub3cgcHJvY2Vzc2luZyBkaW1zXG4gICAgICBpZiAobWF5YmVEaW1zID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gYXNzdW1lIDEtRCB0ZW5zb3IgaWYgZGltcyBvbWl0dGVkXG4gICAgICAgIG1heWJlRGltcyA9IFtkYXRhLmxlbmd0aF07XG4gICAgICB9IGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KG1heWJlRGltcykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQSB0ZW5zb3JcXCdzIGRpbXMgbXVzdCBiZSBhIG51bWJlciBhcnJheScpO1xuICAgICAgfVxuICAgICAgZGltcyA9IG1heWJlRGltcyBhcyByZWFkb25seSBudW1iZXJbXTtcblxuICAgICAgdGhpcy5jcHVEYXRhID0gZGF0YTtcbiAgICAgIHRoaXMuZGF0YUxvY2F0aW9uID0gJ2NwdSc7XG4gICAgfVxuXG4gICAgLy8gcGVyZm9ybSBjaGVjayBvbiBkaW1zXG4gICAgY29uc3Qgc2l6ZSA9IGNhbGN1bGF0ZVNpemUoZGltcyk7XG4gICAgLy8gaWYgZGF0YSBpcyBvbiBDUFUsIGNoZWNrIHdoZXRoZXIgZGF0YSBsZW5ndGggbWF0Y2hlcyB0ZW5zb3Igc2l6ZVxuICAgIGlmICh0aGlzLmNwdURhdGEgJiYgc2l6ZSAhPT0gdGhpcy5jcHVEYXRhLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUZW5zb3IncyBzaXplKCR7c2l6ZX0pIGRvZXMgbm90IG1hdGNoIGRhdGEgbGVuZ3RoKCR7dGhpcy5jcHVEYXRhLmxlbmd0aH0pLmApO1xuICAgIH1cblxuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5kaW1zID0gZGltcztcbiAgICB0aGlzLnNpemUgPSBzaXplO1xuICB9XG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIGZhY3RvcnlcbiAgc3RhdGljIGFzeW5jIGZyb21JbWFnZShcbiAgICAgIGltYWdlOiBJbWFnZURhdGF8SFRNTEltYWdlRWxlbWVudHxJbWFnZUJpdG1hcHxzdHJpbmcsXG4gICAgICBvcHRpb25zPzogVGVuc29yRnJvbUltYWdlRGF0YU9wdGlvbnN8VGVuc29yRnJvbUltYWdlRWxlbWVudE9wdGlvbnN8VGVuc29yRnJvbUltYWdlQml0bWFwT3B0aW9uc3xcbiAgICAgIFRlbnNvckZyb21VcmxPcHRpb25zKTogUHJvbWlzZTxUZW5zb3JJbnRlcmZhY2U+IHtcbiAgICByZXR1cm4gdGVuc29yRnJvbUltYWdlKGltYWdlLCBvcHRpb25zKTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tVGV4dHVyZTxUIGV4dGVuZHMgVGVuc29ySW50ZXJmYWNlLlRleHR1cmVEYXRhVHlwZXM+KFxuICAgICAgdGV4dHVyZTogVGVuc29yVGV4dHVyZVR5cGUsIG9wdGlvbnM6IFRlbnNvckZyb21UZXh0dXJlT3B0aW9uczxUPik6IFRlbnNvckludGVyZmFjZSB7XG4gICAgcmV0dXJuIHRlbnNvckZyb21UZXh0dXJlKHRleHR1cmUsIG9wdGlvbnMpO1xuICB9XG5cbiAgc3RhdGljIGZyb21HcHVCdWZmZXI8VCBleHRlbmRzIFRlbnNvckludGVyZmFjZS5HcHVCdWZmZXJEYXRhVHlwZXM+KFxuICAgICAgZ3B1QnVmZmVyOiBUZW5zb3JHcHVCdWZmZXJUeXBlLCBvcHRpb25zOiBUZW5zb3JGcm9tR3B1QnVmZmVyT3B0aW9uczxUPik6IFRlbnNvckludGVyZmFjZSB7XG4gICAgcmV0dXJuIHRlbnNvckZyb21HcHVCdWZmZXIoZ3B1QnVmZmVyLCBvcHRpb25zKTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tUGlubmVkQnVmZmVyPFQgZXh0ZW5kcyBUZW5zb3JJbnRlcmZhY2UuQ3B1UGlubmVkRGF0YVR5cGVzPihcbiAgICAgIHR5cGU6IFQsIGJ1ZmZlcjogVGVuc29ySW50ZXJmYWNlLkRhdGFUeXBlTWFwW1RdLCBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10pOiBUZW5zb3Ige1xuICAgIHJldHVybiB0ZW5zb3JGcm9tUGlubmVkQnVmZmVyKHR5cGUsIGJ1ZmZlciwgZGltcyk7XG4gIH1cblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBjb252ZXJzaW9uc1xuICB0b0RhdGFVUkwob3B0aW9ucz86IFRlbnNvclRvRGF0YVVybE9wdGlvbnMpOiBzdHJpbmcge1xuICAgIHJldHVybiB0ZW5zb3JUb0RhdGFVUkwodGhpcywgb3B0aW9ucyk7XG4gIH1cblxuICB0b0ltYWdlRGF0YShvcHRpb25zPzogVGVuc29yVG9JbWFnZURhdGFPcHRpb25zKTogSW1hZ2VEYXRhIHtcbiAgICByZXR1cm4gdGVuc29yVG9JbWFnZURhdGEodGhpcywgb3B0aW9ucyk7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gcHVibGljIGZpZWxkc1xuICByZWFkb25seSBkaW1zOiByZWFkb25seSBudW1iZXJbXTtcbiAgcmVhZG9ubHkgdHlwZTogVGVuc29yVHlwZTtcbiAgcmVhZG9ubHkgc2l6ZTogbnVtYmVyO1xuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBwcml2YXRlIGZpZWxkc1xuXG4gIC8qKlxuICAgKiBzdG9yZXMgdGhlIGxvY2F0aW9uIG9mIHRoZSBkYXRhLlxuICAgKi9cbiAgcHJpdmF0ZSBkYXRhTG9jYXRpb246IFRlbnNvckRhdGFMb2NhdGlvbjtcblxuICAvKipcbiAgICogc3RvcmVzIHRoZSBkYXRhIG9uIENQVSwgaWYgbG9jYXRpb24gaXMgJ2NwdScgb3IgJ2NwdS1waW5uZWQnLiBvdGhlcndpc2UgZW1wdHkuXG4gICAqL1xuICBwcml2YXRlIGNwdURhdGE/OiBUZW5zb3JEYXRhVHlwZTtcblxuICAvKipcbiAgICogc3RvcmVzIHRoZSB1bmRlcmx5aW5nIHRleHR1cmUgd2hlbiBsb2NhdGlvbiBpcyAndGV4dHVyZScuIG90aGVyd2lzZSBlbXB0eS5cbiAgICovXG4gIHByaXZhdGUgZ3B1VGV4dHVyZURhdGE/OiBUZW5zb3JUZXh0dXJlVHlwZTtcblxuICAvKipcbiAgICogc3RvcmVzIHRoZSB1bmRlcmx5aW5nIEdQVSBidWZmZXIgd2hlbiBsb2NhdGlvbiBpcyAnZ3B1LWJ1ZmZlcicuIG90aGVyd2lzZSBlbXB0eS5cbiAgICovXG4gIHByaXZhdGUgZ3B1QnVmZmVyRGF0YT86IFRlbnNvckdwdUJ1ZmZlclR5cGU7XG5cbiAgLyoqXG4gICAqIHN0b3JlcyBhbiBvcHRpb25hbCBkb3dubG9hZGVyIGZ1bmN0aW9uIHRvIGRvd25sb2FkIGRhdGEgZnJvbSBHUFUgdG8gQ1BVLlxuICAgKi9cbiAgcHJpdmF0ZSBkb3dubG9hZGVyPygpOiBQcm9taXNlPFRlbnNvckRhdGFUeXBlPjtcblxuICAvKipcbiAgICogYSBmbGFnIGluZGljYXRpbmcgd2hldGhlciB0aGUgZGF0YSBpcyBiZWluZyBkb3dubG9hZGVkIGZyb20gR1BVIHRvIENQVS5cbiAgICovXG4gIHByaXZhdGUgaXNEb3dubG9hZGluZz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIHN0b3JlcyBhbiBvcHRpb25hbCBkaXNwb3NlciBmdW5jdGlvbiB0byBkaXNwb3NlIHRoZSB1bmRlcmx5aW5nIGRhdGEuXG4gICAqL1xuICBwcml2YXRlIGRpc3Bvc2VyPygpOiB2b2lkO1xuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBwcm9wZXJ0aWVzXG4gIGdldCBkYXRhKCk6IFRlbnNvckRhdGFUeXBlIHtcbiAgICB0aGlzLmVuc3VyZVZhbGlkKCk7XG4gICAgaWYgKCF0aGlzLmNwdURhdGEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnVGhlIGRhdGEgaXMgbm90IG9uIENQVS4gVXNlIGBnZXREYXRhKClgIHRvIGRvd25sb2FkIEdQVSBkYXRhIHRvIENQVSwgJyArXG4gICAgICAgICAgJ29yIHVzZSBgdGV4dHVyZWAgb3IgYGdwdUJ1ZmZlcmAgcHJvcGVydHkgdG8gYWNjZXNzIHRoZSBHUFUgZGF0YSBkaXJlY3RseS4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY3B1RGF0YTtcbiAgfVxuXG4gIGdldCBsb2NhdGlvbigpOiBUZW5zb3JEYXRhTG9jYXRpb24ge1xuICAgIHJldHVybiB0aGlzLmRhdGFMb2NhdGlvbjtcbiAgfVxuXG4gIGdldCB0ZXh0dXJlKCk6IFRlbnNvclRleHR1cmVUeXBlIHtcbiAgICB0aGlzLmVuc3VyZVZhbGlkKCk7XG4gICAgaWYgKCF0aGlzLmdwdVRleHR1cmVEYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBkYXRhIGlzIG5vdCBzdG9yZWQgYXMgYSBXZWJHTCB0ZXh0dXJlLicpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5ncHVUZXh0dXJlRGF0YTtcbiAgfVxuXG4gIGdldCBncHVCdWZmZXIoKTogVGVuc29yR3B1QnVmZmVyVHlwZSB7XG4gICAgdGhpcy5lbnN1cmVWYWxpZCgpO1xuICAgIGlmICghdGhpcy5ncHVCdWZmZXJEYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBkYXRhIGlzIG5vdCBzdG9yZWQgYXMgYSBXZWJHUFUgYnVmZmVyLicpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5ncHVCdWZmZXJEYXRhO1xuICB9XG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIG1ldGhvZHNcblxuICBhc3luYyBnZXREYXRhKHJlbGVhc2VEYXRhPzogYm9vbGVhbik6IFByb21pc2U8VGVuc29yRGF0YVR5cGU+IHtcbiAgICB0aGlzLmVuc3VyZVZhbGlkKCk7XG4gICAgc3dpdGNoICh0aGlzLmRhdGFMb2NhdGlvbikge1xuICAgICAgY2FzZSAnY3B1JzpcbiAgICAgIGNhc2UgJ2NwdS1waW5uZWQnOlxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xuICAgICAgY2FzZSAndGV4dHVyZSc6XG4gICAgICBjYXNlICdncHUtYnVmZmVyJzoge1xuICAgICAgICBpZiAoIXRoaXMuZG93bmxvYWRlcikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGN1cnJlbnQgdGVuc29yIGlzIG5vdCBjcmVhdGVkIHdpdGggYSBzcGVjaWZpZWQgZGF0YSBkb3dubG9hZGVyLicpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzRG93bmxvYWRpbmcpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjdXJyZW50IHRlbnNvciBpcyBiZWluZyBkb3dubG9hZGVkLicpO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy5pc0Rvd25sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5kb3dubG9hZGVyKCk7XG4gICAgICAgICAgdGhpcy5kb3dubG9hZGVyID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHRoaXMuZGF0YUxvY2F0aW9uID0gJ2NwdSc7XG4gICAgICAgICAgdGhpcy5jcHVEYXRhID0gZGF0YTtcblxuICAgICAgICAgIGlmIChyZWxlYXNlRGF0YSAmJiB0aGlzLmRpc3Bvc2VyKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3Bvc2VyKCk7XG4gICAgICAgICAgICB0aGlzLmRpc3Bvc2VyID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBkYXRhO1xuXG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgdGhpcy5pc0Rvd25sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgY2Fubm90IGdldCBkYXRhIGZyb20gbG9jYXRpb246ICR7dGhpcy5kYXRhTG9jYXRpb259YCk7XG4gICAgfVxuICB9XG5cbiAgZGlzcG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc0Rvd25sb2FkaW5nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjdXJyZW50IHRlbnNvciBpcyBiZWluZyBkb3dubG9hZGVkLicpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRpc3Bvc2VyKSB7XG4gICAgICB0aGlzLmRpc3Bvc2VyKCk7XG4gICAgICB0aGlzLmRpc3Bvc2VyID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aGlzLmNwdURhdGEgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5ncHVUZXh0dXJlRGF0YSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmdwdUJ1ZmZlckRhdGEgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5kb3dubG9hZGVyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuaXNEb3dubG9hZGluZyA9IHVuZGVmaW5lZDtcblxuICAgIHRoaXMuZGF0YUxvY2F0aW9uID0gJ25vbmUnO1xuICB9XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gdGVuc29yIHV0aWxpdGllc1xuICBwcml2YXRlIGVuc3VyZVZhbGlkKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRhdGFMb2NhdGlvbiA9PT0gJ25vbmUnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSB0ZW5zb3IgaXMgZGlzcG9zZWQuJyk7XG4gICAgfVxuICB9XG5cbiAgcmVzaGFwZShkaW1zOiByZWFkb25seSBudW1iZXJbXSk6IFRlbnNvckludGVyZmFjZSB7XG4gICAgdGhpcy5lbnN1cmVWYWxpZCgpO1xuICAgIGlmICh0aGlzLmRvd25sb2FkZXIgfHwgdGhpcy5kaXNwb3Nlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgcmVzaGFwZSBhIHRlbnNvciB0aGF0IG93bnMgR1BVIHJlc291cmNlLicpO1xuICAgIH1cbiAgICByZXR1cm4gdGVuc29yUmVzaGFwZSh0aGlzLCBkaW1zKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uXG59XG4iLCAiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5cbmltcG9ydCB7VGVuc29yRmFjdG9yeX0gZnJvbSAnLi90ZW5zb3ItZmFjdG9yeS5qcyc7XG5pbXBvcnQge1RlbnNvciBhcyBUZW5zb3JJbXBsfSBmcm9tICcuL3RlbnNvci1pbXBsLmpzJztcbmltcG9ydCB7VHlwZWRUZW5zb3JVdGlsc30gZnJvbSAnLi90ZW5zb3ItdXRpbHMuanMnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVkZWNsYXJlICovXG5cbi8qKlxuICogcmVwcmVzZW50IGEgYmFzaWMgdGVuc29yIHdpdGggc3BlY2lmaWVkIGRpbWVuc2lvbnMgYW5kIGRhdGEgdHlwZS5cbiAqL1xuaW50ZXJmYWNlIFR5cGVkVGVuc29yQmFzZTxUIGV4dGVuZHMgVGVuc29yLlR5cGU+IHtcbiAgLyoqXG4gICAqIEdldCB0aGUgZGltZW5zaW9ucyBvZiB0aGUgdGVuc29yLlxuICAgKi9cbiAgcmVhZG9ubHkgZGltczogcmVhZG9ubHkgbnVtYmVyW107XG4gIC8qKlxuICAgKiBHZXQgdGhlIGRhdGEgdHlwZSBvZiB0aGUgdGVuc29yLlxuICAgKi9cbiAgcmVhZG9ubHkgdHlwZTogVDtcbiAgLyoqXG4gICAqIEdldCB0aGUgYnVmZmVyIGRhdGEgb2YgdGhlIHRlbnNvci5cbiAgICpcbiAgICogSWYgdGhlIGRhdGEgaXMgbm90IG9uIENQVSAoZWcuIGl0J3MgaW4gdGhlIGZvcm0gb2YgV2ViR0wgdGV4dHVyZSBvciBXZWJHUFUgYnVmZmVyKSwgdGhyb3cgZXJyb3IuXG4gICAqL1xuICByZWFkb25seSBkYXRhOiBUZW5zb3IuRGF0YVR5cGVNYXBbVF07XG4gIC8qKlxuICAgKiBHZXQgdGhlIGxvY2F0aW9uIG9mIHRoZSBkYXRhLlxuICAgKi9cbiAgcmVhZG9ubHkgbG9jYXRpb246IFRlbnNvci5EYXRhTG9jYXRpb247XG4gIC8qKlxuICAgKiBHZXQgdGhlIFdlYkdMIHRleHR1cmUgdGhhdCBob2xkcyB0aGUgdGVuc29yIGRhdGEuXG4gICAqXG4gICAqIElmIHRoZSBkYXRhIGlzIG5vdCBvbiBHUFUgYXMgV2ViR0wgdGV4dHVyZSwgdGhyb3cgZXJyb3IuXG4gICAqL1xuICByZWFkb25seSB0ZXh0dXJlOiBUZW5zb3IuVGV4dHVyZVR5cGU7XG4gIC8qKlxuICAgKiBHZXQgdGhlIFdlYkdQVSBidWZmZXIgdGhhdCBob2xkcyB0aGUgdGVuc29yIGRhdGEuXG4gICAqXG4gICAqIElmIHRoZSBkYXRhIGlzIG5vdCBvbiBHUFUgYXMgV2ViR1BVIGJ1ZmZlciwgdGhyb3cgZXJyb3IuXG4gICAqL1xuICByZWFkb25seSBncHVCdWZmZXI6IFRlbnNvci5HcHVCdWZmZXJUeXBlO1xuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGJ1ZmZlciBkYXRhIG9mIHRoZSB0ZW5zb3IuXG4gICAqXG4gICAqIElmIHRoZSBkYXRhIGlzIG9uIENQVSwgcmV0dXJucyB0aGUgZGF0YSBpbW1lZGlhdGVseS5cbiAgICogSWYgdGhlIGRhdGEgaXMgb24gR1BVLCBkb3dubG9hZHMgdGhlIGRhdGEgYW5kIHJldHVybnMgdGhlIHByb21pc2UuXG4gICAqXG4gICAqIEBwYXJhbSByZWxlYXNlRGF0YSAtIHdoZXRoZXIgcmVsZWFzZSB0aGUgZGF0YSBvbiBHUFUuIElnbm9yZSBpZiBkYXRhIGlzIGFscmVhZHkgb24gQ1BVLlxuICAgKi9cbiAgZ2V0RGF0YShyZWxlYXNlRGF0YT86IGJvb2xlYW4pOiBQcm9taXNlPFRlbnNvci5EYXRhVHlwZU1hcFtUXT47XG5cbiAgLyoqXG4gICAqIERpc3Bvc2UgdGhlIHRlbnNvciBkYXRhLlxuICAgKlxuICAgKiBJZiB0aGUgZGF0YSBpcyBvbiBDUFUsIHJlbW92ZSBpdHMgaW50ZXJuYWwgcmVmZXJlbmNlIHRvIHRoZSB1bmRlcmx5aW5nIGRhdGEuXG4gICAqIElmIHRoZSBkYXRhIGlzIG9uIEdQVSwgcmVsZWFzZSB0aGUgZGF0YSBvbiBHUFUuXG4gICAqXG4gICAqIEFmdGVyIGNhbGxpbmcgdGhpcyBmdW5jdGlvbiwgdGhlIHRlbnNvciBpcyBjb25zaWRlcmVkIG5vIGxvbmdlciB2YWxpZC4gSXRzIGxvY2F0aW9uIHdpbGwgYmUgc2V0IHRvICdub25lJy5cbiAgICovXG4gIGRpc3Bvc2UoKTogdm9pZDtcbn1cblxuZXhwb3J0IGRlY2xhcmUgbmFtZXNwYWNlIFRlbnNvciB7XG4gIGludGVyZmFjZSBEYXRhVHlwZU1hcCB7XG4gICAgZmxvYXQzMjogRmxvYXQzMkFycmF5O1xuICAgIHVpbnQ4OiBVaW50OEFycmF5O1xuICAgIGludDg6IEludDhBcnJheTtcbiAgICB1aW50MTY6IFVpbnQxNkFycmF5O1xuICAgIGludDE2OiBJbnQxNkFycmF5O1xuICAgIGludDMyOiBJbnQzMkFycmF5O1xuICAgIGludDY0OiBCaWdJbnQ2NEFycmF5O1xuICAgIHN0cmluZzogc3RyaW5nW107XG4gICAgYm9vbDogVWludDhBcnJheTtcbiAgICBmbG9hdDE2OiBVaW50MTZBcnJheTsgIC8vIEtlZXAgdXNpbmcgVWludDE2QXJyYXkgdW50aWwgd2UgaGF2ZSBhIGNvbmNyZXRlIHNvbHV0aW9uIGZvciBmbG9hdCAxNi5cbiAgICBmbG9hdDY0OiBGbG9hdDY0QXJyYXk7XG4gICAgdWludDMyOiBVaW50MzJBcnJheTtcbiAgICB1aW50NjQ6IEJpZ1VpbnQ2NEFycmF5O1xuICAgIC8vIGNvbXBsZXg2NDogbmV2ZXI7XG4gICAgLy8gY29tcGxleDEyODogbmV2ZXI7XG4gICAgLy8gYmZsb2F0MTY6IG5ldmVyO1xuICB9XG5cbiAgaW50ZXJmYWNlIEVsZW1lbnRUeXBlTWFwIHtcbiAgICBmbG9hdDMyOiBudW1iZXI7XG4gICAgdWludDg6IG51bWJlcjtcbiAgICBpbnQ4OiBudW1iZXI7XG4gICAgdWludDE2OiBudW1iZXI7XG4gICAgaW50MTY6IG51bWJlcjtcbiAgICBpbnQzMjogbnVtYmVyO1xuICAgIGludDY0OiBiaWdpbnQ7XG4gICAgc3RyaW5nOiBzdHJpbmc7XG4gICAgYm9vbDogYm9vbGVhbjtcbiAgICBmbG9hdDE2OiBudW1iZXI7ICAvLyBLZWVwIHVzaW5nIFVpbnQxNkFycmF5IHVudGlsIHdlIGhhdmUgYSBjb25jcmV0ZSBzb2x1dGlvbiBmb3IgZmxvYXQgMTYuXG4gICAgZmxvYXQ2NDogbnVtYmVyO1xuICAgIHVpbnQzMjogbnVtYmVyO1xuICAgIHVpbnQ2NDogYmlnaW50O1xuICAgIC8vIGNvbXBsZXg2NDogbmV2ZXI7XG4gICAgLy8gY29tcGxleDEyODogbmV2ZXI7XG4gICAgLy8gYmZsb2F0MTY6IG5ldmVyO1xuICB9XG5cbiAgdHlwZSBEYXRhVHlwZSA9IERhdGFUeXBlTWFwW1R5cGVdO1xuICB0eXBlIEVsZW1lbnRUeXBlID0gRWxlbWVudFR5cGVNYXBbVHlwZV07XG5cbiAgLyoqXG4gICAqIHN1cHBvcnRlZCBkYXRhIHR5cGVzIGZvciBjb25zdHJ1Y3RpbmcgYSB0ZW5zb3IgZnJvbSBhIHBpbm5lZCBDUFUgYnVmZmVyXG4gICAqL1xuICBleHBvcnQgdHlwZSBDcHVQaW5uZWREYXRhVHlwZXMgPSBFeGNsdWRlPFRlbnNvci5UeXBlLCAnc3RyaW5nJz47XG5cbiAgLyoqXG4gICAqIHR5cGUgYWxpYXMgZm9yIFdlYkdMIHRleHR1cmVcbiAgICovXG4gIGV4cG9ydCB0eXBlIFRleHR1cmVUeXBlID0gV2ViR0xUZXh0dXJlO1xuXG4gIC8qKlxuICAgKiBzdXBwb3J0ZWQgZGF0YSB0eXBlcyBmb3IgY29uc3RydWN0aW5nIGEgdGVuc29yIGZyb20gYSBXZWJHTCB0ZXh0dXJlXG4gICAqL1xuICBleHBvcnQgdHlwZSBUZXh0dXJlRGF0YVR5cGVzID0gJ2Zsb2F0MzInO1xuXG4gIC8qKlxuICAgKiB0eXBlIGFsaWFzIGZvciBXZWJHUFUgYnVmZmVyXG4gICAqXG4gICAqIFRoZSByZWFzb24gd2h5IHdlIGRvbid0IHVzZSB0eXBlIFwiR1BVQnVmZmVyXCIgZGVmaW5lZCBpbiB3ZWJncHUuZC50cyBmcm9tIEB3ZWJncHUvdHlwZXMgaXMgYmVjYXVzZSBcIkB3ZWJncHUvdHlwZXNcIlxuICAgKiByZXF1aXJlcyBcIkB0eXBlcy9kb20td2ViY29kZWNzXCIgYXMgcGVlciBkZXBlbmRlbmN5IHdoZW4gdXNpbmcgVHlwZVNjcmlwdCA8IHY1LjEgYW5kIGl0cyB2ZXJzaW9uIG5lZWQgdG8gYmUgY2hvc2VuXG4gICAqIGNhcmVmdWxseSBhY2NvcmRpbmcgdG8gdGhlIFR5cGVTY3JpcHQgdmVyc2lvbiBiZWluZyB1c2VkLiBUaGlzIG1lYW5zIHNvIGZhciB0aGVyZSBpcyBub3QgYSB3YXkgdG8ga2VlcCBldmVyeVxuICAgKiBUeXBlU2NyaXB0IHZlcnNpb24gaGFwcHkuIEl0IHR1cm5zIG91dCB0aGF0IHdlIHdpbGwgZWFzaWx5IGJyb2tlIHVzZXJzIG9uIHNvbWUgVHlwZVNjcmlwdCB2ZXJzaW9uLlxuICAgKlxuICAgKiBmb3IgbW9yZSBpbmZvIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZ3B1d2ViL3R5cGVzL2lzc3Vlcy8xMjdcbiAgICovXG4gIGV4cG9ydCB0eXBlIEdwdUJ1ZmZlclR5cGUgPSB7c2l6ZTogbnVtYmVyOyBtYXBTdGF0ZTogJ3VubWFwcGVkJyB8ICdwZW5kaW5nJyB8ICdtYXBwZWQnfTtcblxuICAvKipcbiAgICogc3VwcG9ydGVkIGRhdGEgdHlwZXMgZm9yIGNvbnN0cnVjdGluZyBhIHRlbnNvciBmcm9tIGEgV2ViR1BVIGJ1ZmZlclxuICAgKi9cbiAgZXhwb3J0IHR5cGUgR3B1QnVmZmVyRGF0YVR5cGVzID0gJ2Zsb2F0MzInfCdmbG9hdDE2J3wnaW50MzInfCdpbnQ2NCd8J3VpbnQzMid8J3VpbnQ4J3wnYm9vbCc7XG5cbiAgLyoqXG4gICAqIHJlcHJlc2VudCB3aGVyZSB0aGUgdGVuc29yIGRhdGEgaXMgc3RvcmVkXG4gICAqL1xuICBleHBvcnQgdHlwZSBEYXRhTG9jYXRpb24gPSAnbm9uZSd8J2NwdSd8J2NwdS1waW5uZWQnfCd0ZXh0dXJlJ3wnZ3B1LWJ1ZmZlcic7XG5cbiAgLyoqXG4gICAqIHJlcHJlc2VudCB0aGUgZGF0YSB0eXBlIG9mIGEgdGVuc29yXG4gICAqL1xuICBleHBvcnQgdHlwZSBUeXBlID0ga2V5b2YgRGF0YVR5cGVNYXA7XG59XG5cbi8qKlxuICogUmVwcmVzZW50IG11bHRpLWRpbWVuc2lvbmFsIGFycmF5cyB0byBmZWVkIHRvIG9yIGZldGNoIGZyb20gbW9kZWwgaW5mZXJlbmNpbmcuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVHlwZWRUZW5zb3I8VCBleHRlbmRzIFRlbnNvci5UeXBlPiBleHRlbmRzIFR5cGVkVGVuc29yQmFzZTxUPiwgVHlwZWRUZW5zb3JVdGlsczxUPiB7fVxuLyoqXG4gKiBSZXByZXNlbnQgbXVsdGktZGltZW5zaW9uYWwgYXJyYXlzIHRvIGZlZWQgdG8gb3IgZmV0Y2ggZnJvbSBtb2RlbCBpbmZlcmVuY2luZy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUZW5zb3IgZXh0ZW5kcyBUeXBlZFRlbnNvckJhc2U8VGVuc29yLlR5cGU+LCBUeXBlZFRlbnNvclV0aWxzPFRlbnNvci5UeXBlPiB7fVxuXG4vKipcbiAqIHR5cGUgVGVuc29yQ29uc3RydWN0b3IgZGVmaW5lcyB0aGUgY29uc3RydWN0b3JzIG9mICdUZW5zb3InIHRvIGNyZWF0ZSBDUFUgdGVuc29yIGluc3RhbmNlcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUZW5zb3JDb25zdHJ1Y3RvciBleHRlbmRzIFRlbnNvckZhY3Rvcnkge1xuICAvLyAjcmVnaW9uIENQVSB0ZW5zb3IgLSBzcGVjaWZ5IGVsZW1lbnQgdHlwZVxuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IHN0cmluZyB0ZW5zb3Igb2JqZWN0IGZyb20gdGhlIGdpdmVuIHR5cGUsIGRhdGEgYW5kIGRpbXMuXG4gICAqXG4gICAqIEBwYXJhbSB0eXBlIC0gU3BlY2lmeSB0aGUgZWxlbWVudCB0eXBlLlxuICAgKiBAcGFyYW0gZGF0YSAtIFNwZWNpZnkgdGhlIENQVSB0ZW5zb3IgZGF0YS5cbiAgICogQHBhcmFtIGRpbXMgLSBTcGVjaWZ5IHRoZSBkaW1lbnNpb24gb2YgdGhlIHRlbnNvci4gSWYgb21pdHRlZCwgYSAxLUQgdGVuc29yIGlzIGFzc3VtZWQuXG4gICAqL1xuICBuZXcodHlwZTogJ3N0cmluZycsIGRhdGE6IFRlbnNvci5EYXRhVHlwZU1hcFsnc3RyaW5nJ118cmVhZG9ubHkgc3RyaW5nW10sXG4gICAgICBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10pOiBUeXBlZFRlbnNvcjwnc3RyaW5nJz47XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIG5ldyBib29sIHRlbnNvciBvYmplY3QgZnJvbSB0aGUgZ2l2ZW4gdHlwZSwgZGF0YSBhbmQgZGltcy5cbiAgICpcbiAgICogQHBhcmFtIHR5cGUgLSBTcGVjaWZ5IHRoZSBlbGVtZW50IHR5cGUuXG4gICAqIEBwYXJhbSBkYXRhIC0gU3BlY2lmeSB0aGUgQ1BVIHRlbnNvciBkYXRhLlxuICAgKiBAcGFyYW0gZGltcyAtIFNwZWNpZnkgdGhlIGRpbWVuc2lvbiBvZiB0aGUgdGVuc29yLiBJZiBvbWl0dGVkLCBhIDEtRCB0ZW5zb3IgaXMgYXNzdW1lZC5cbiAgICovXG4gIG5ldyh0eXBlOiAnYm9vbCcsIGRhdGE6IFRlbnNvci5EYXRhVHlwZU1hcFsnYm9vbCddfHJlYWRvbmx5IGJvb2xlYW5bXSwgZGltcz86IHJlYWRvbmx5IG51bWJlcltdKTogVHlwZWRUZW5zb3I8J2Jvb2wnPjtcblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IDY0LWJpdCBpbnRlZ2VyIHR5cGVkIHRlbnNvciBvYmplY3QgZnJvbSB0aGUgZ2l2ZW4gdHlwZSwgZGF0YSBhbmQgZGltcy5cbiAgICpcbiAgICogQHBhcmFtIHR5cGUgLSBTcGVjaWZ5IHRoZSBlbGVtZW50IHR5cGUuXG4gICAqIEBwYXJhbSBkYXRhIC0gU3BlY2lmeSB0aGUgQ1BVIHRlbnNvciBkYXRhLlxuICAgKiBAcGFyYW0gZGltcyAtIFNwZWNpZnkgdGhlIGRpbWVuc2lvbiBvZiB0aGUgdGVuc29yLiBJZiBvbWl0dGVkLCBhIDEtRCB0ZW5zb3IgaXMgYXNzdW1lZC5cbiAgICovXG4gIG5ldzxUIGV4dGVuZHMgJ3VpbnQ2NCd8J2ludDY0Jz4oXG4gICAgICB0eXBlOiBULCBkYXRhOiBUZW5zb3IuRGF0YVR5cGVNYXBbVF18cmVhZG9ubHkgYmlnaW50W118cmVhZG9ubHkgbnVtYmVyW10sXG4gICAgICBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10pOiBUeXBlZFRlbnNvcjxUPjtcblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IG51bWVyaWMgdGVuc29yIG9iamVjdCBmcm9tIHRoZSBnaXZlbiB0eXBlLCBkYXRhIGFuZCBkaW1zLlxuICAgKlxuICAgKiBAcGFyYW0gdHlwZSAtIFNwZWNpZnkgdGhlIGVsZW1lbnQgdHlwZS5cbiAgICogQHBhcmFtIGRhdGEgLSBTcGVjaWZ5IHRoZSBDUFUgdGVuc29yIGRhdGEuXG4gICAqIEBwYXJhbSBkaW1zIC0gU3BlY2lmeSB0aGUgZGltZW5zaW9uIG9mIHRoZSB0ZW5zb3IuIElmIG9taXR0ZWQsIGEgMS1EIHRlbnNvciBpcyBhc3N1bWVkLlxuICAgKi9cbiAgbmV3PFQgZXh0ZW5kcyBFeGNsdWRlPFRlbnNvci5UeXBlLCAnc3RyaW5nJ3wnYm9vbCd8J3VpbnQ2NCd8J2ludDY0Jz4+KFxuICAgICAgdHlwZTogVCwgZGF0YTogVGVuc29yLkRhdGFUeXBlTWFwW1RdfHJlYWRvbmx5IG51bWJlcltdLCBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10pOiBUeXBlZFRlbnNvcjxUPjtcbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gQ1BVIHRlbnNvciAtIGluZmVyIGVsZW1lbnQgdHlwZXNcblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IGZsb2F0MzIgdGVuc29yIG9iamVjdCBmcm9tIHRoZSBnaXZlbiBkYXRhIGFuZCBkaW1zLlxuICAgKlxuICAgKiBAcGFyYW0gZGF0YSAtIFNwZWNpZnkgdGhlIENQVSB0ZW5zb3IgZGF0YS5cbiAgICogQHBhcmFtIGRpbXMgLSBTcGVjaWZ5IHRoZSBkaW1lbnNpb24gb2YgdGhlIHRlbnNvci4gSWYgb21pdHRlZCwgYSAxLUQgdGVuc29yIGlzIGFzc3VtZWQuXG4gICAqL1xuICBuZXcoZGF0YTogRmxvYXQzMkFycmF5LCBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10pOiBUeXBlZFRlbnNvcjwnZmxvYXQzMic+O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYSBuZXcgaW50OCB0ZW5zb3Igb2JqZWN0IGZyb20gdGhlIGdpdmVuIGRhdGEgYW5kIGRpbXMuXG4gICAqXG4gICAqIEBwYXJhbSBkYXRhIC0gU3BlY2lmeSB0aGUgQ1BVIHRlbnNvciBkYXRhLlxuICAgKiBAcGFyYW0gZGltcyAtIFNwZWNpZnkgdGhlIGRpbWVuc2lvbiBvZiB0aGUgdGVuc29yLiBJZiBvbWl0dGVkLCBhIDEtRCB0ZW5zb3IgaXMgYXNzdW1lZC5cbiAgICovXG4gIG5ldyhkYXRhOiBJbnQ4QXJyYXksIGRpbXM/OiByZWFkb25seSBudW1iZXJbXSk6IFR5cGVkVGVuc29yPCdpbnQ4Jz47XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIG5ldyB1aW50OCB0ZW5zb3Igb2JqZWN0IGZyb20gdGhlIGdpdmVuIGRhdGEgYW5kIGRpbXMuXG4gICAqXG4gICAqIEBwYXJhbSBkYXRhIC0gU3BlY2lmeSB0aGUgQ1BVIHRlbnNvciBkYXRhLlxuICAgKiBAcGFyYW0gZGltcyAtIFNwZWNpZnkgdGhlIGRpbWVuc2lvbiBvZiB0aGUgdGVuc29yLiBJZiBvbWl0dGVkLCBhIDEtRCB0ZW5zb3IgaXMgYXNzdW1lZC5cbiAgICovXG4gIG5ldyhkYXRhOiBVaW50OEFycmF5LCBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10pOiBUeXBlZFRlbnNvcjwndWludDgnPjtcblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IHVpbnQxNiB0ZW5zb3Igb2JqZWN0IGZyb20gdGhlIGdpdmVuIGRhdGEgYW5kIGRpbXMuXG4gICAqXG4gICAqIEBwYXJhbSBkYXRhIC0gU3BlY2lmeSB0aGUgQ1BVIHRlbnNvciBkYXRhLlxuICAgKiBAcGFyYW0gZGltcyAtIFNwZWNpZnkgdGhlIGRpbWVuc2lvbiBvZiB0aGUgdGVuc29yLiBJZiBvbWl0dGVkLCBhIDEtRCB0ZW5zb3IgaXMgYXNzdW1lZC5cbiAgICovXG4gIG5ldyhkYXRhOiBVaW50MTZBcnJheSwgZGltcz86IHJlYWRvbmx5IG51bWJlcltdKTogVHlwZWRUZW5zb3I8J3VpbnQxNic+O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYSBuZXcgaW50MTYgdGVuc29yIG9iamVjdCBmcm9tIHRoZSBnaXZlbiBkYXRhIGFuZCBkaW1zLlxuICAgKlxuICAgKiBAcGFyYW0gZGF0YSAtIFNwZWNpZnkgdGhlIENQVSB0ZW5zb3IgZGF0YS5cbiAgICogQHBhcmFtIGRpbXMgLSBTcGVjaWZ5IHRoZSBkaW1lbnNpb24gb2YgdGhlIHRlbnNvci4gSWYgb21pdHRlZCwgYSAxLUQgdGVuc29yIGlzIGFzc3VtZWQuXG4gICAqL1xuICBuZXcoZGF0YTogSW50MTZBcnJheSwgZGltcz86IHJlYWRvbmx5IG51bWJlcltdKTogVHlwZWRUZW5zb3I8J2ludDE2Jz47XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIG5ldyBpbnQzMiB0ZW5zb3Igb2JqZWN0IGZyb20gdGhlIGdpdmVuIGRhdGEgYW5kIGRpbXMuXG4gICAqXG4gICAqIEBwYXJhbSBkYXRhIC0gU3BlY2lmeSB0aGUgQ1BVIHRlbnNvciBkYXRhLlxuICAgKiBAcGFyYW0gZGltcyAtIFNwZWNpZnkgdGhlIGRpbWVuc2lvbiBvZiB0aGUgdGVuc29yLiBJZiBvbWl0dGVkLCBhIDEtRCB0ZW5zb3IgaXMgYXNzdW1lZC5cbiAgICovXG4gIG5ldyhkYXRhOiBJbnQzMkFycmF5LCBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10pOiBUeXBlZFRlbnNvcjwnaW50MzInPjtcblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IGludDY0IHRlbnNvciBvYmplY3QgZnJvbSB0aGUgZ2l2ZW4gZGF0YSBhbmQgZGltcy5cbiAgICpcbiAgICogQHBhcmFtIGRhdGEgLSBTcGVjaWZ5IHRoZSBDUFUgdGVuc29yIGRhdGEuXG4gICAqIEBwYXJhbSBkaW1zIC0gU3BlY2lmeSB0aGUgZGltZW5zaW9uIG9mIHRoZSB0ZW5zb3IuIElmIG9taXR0ZWQsIGEgMS1EIHRlbnNvciBpcyBhc3N1bWVkLlxuICAgKi9cbiAgbmV3KGRhdGE6IEJpZ0ludDY0QXJyYXksIGRpbXM/OiByZWFkb25seSBudW1iZXJbXSk6IFR5cGVkVGVuc29yPCdpbnQ2NCc+O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYSBuZXcgc3RyaW5nIHRlbnNvciBvYmplY3QgZnJvbSB0aGUgZ2l2ZW4gZGF0YSBhbmQgZGltcy5cbiAgICpcbiAgICogQHBhcmFtIGRhdGEgLSBTcGVjaWZ5IHRoZSBDUFUgdGVuc29yIGRhdGEuXG4gICAqIEBwYXJhbSBkaW1zIC0gU3BlY2lmeSB0aGUgZGltZW5zaW9uIG9mIHRoZSB0ZW5zb3IuIElmIG9taXR0ZWQsIGEgMS1EIHRlbnNvciBpcyBhc3N1bWVkLlxuICAgKi9cbiAgbmV3KGRhdGE6IHJlYWRvbmx5IHN0cmluZ1tdLCBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10pOiBUeXBlZFRlbnNvcjwnc3RyaW5nJz47XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIG5ldyBib29sIHRlbnNvciBvYmplY3QgZnJvbSB0aGUgZ2l2ZW4gZGF0YSBhbmQgZGltcy5cbiAgICpcbiAgICogQHBhcmFtIGRhdGEgLSBTcGVjaWZ5IHRoZSBDUFUgdGVuc29yIGRhdGEuXG4gICAqIEBwYXJhbSBkaW1zIC0gU3BlY2lmeSB0aGUgZGltZW5zaW9uIG9mIHRoZSB0ZW5zb3IuIElmIG9taXR0ZWQsIGEgMS1EIHRlbnNvciBpcyBhc3N1bWVkLlxuICAgKi9cbiAgbmV3KGRhdGE6IHJlYWRvbmx5IGJvb2xlYW5bXSwgZGltcz86IHJlYWRvbmx5IG51bWJlcltdKTogVHlwZWRUZW5zb3I8J2Jvb2wnPjtcblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IGZsb2F0NjQgdGVuc29yIG9iamVjdCBmcm9tIHRoZSBnaXZlbiBkYXRhIGFuZCBkaW1zLlxuICAgKlxuICAgKiBAcGFyYW0gZGF0YSAtIFNwZWNpZnkgdGhlIENQVSB0ZW5zb3IgZGF0YS5cbiAgICogQHBhcmFtIGRpbXMgLSBTcGVjaWZ5IHRoZSBkaW1lbnNpb24gb2YgdGhlIHRlbnNvci4gSWYgb21pdHRlZCwgYSAxLUQgdGVuc29yIGlzIGFzc3VtZWQuXG4gICAqL1xuICBuZXcoZGF0YTogRmxvYXQ2NEFycmF5LCBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10pOiBUeXBlZFRlbnNvcjwnZmxvYXQ2NCc+O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYSBuZXcgdWludDMyIHRlbnNvciBvYmplY3QgZnJvbSB0aGUgZ2l2ZW4gZGF0YSBhbmQgZGltcy5cbiAgICpcbiAgICogQHBhcmFtIGRhdGEgLSBTcGVjaWZ5IHRoZSBDUFUgdGVuc29yIGRhdGEuXG4gICAqIEBwYXJhbSBkaW1zIC0gU3BlY2lmeSB0aGUgZGltZW5zaW9uIG9mIHRoZSB0ZW5zb3IuIElmIG9taXR0ZWQsIGEgMS1EIHRlbnNvciBpcyBhc3N1bWVkLlxuICAgKi9cbiAgbmV3KGRhdGE6IFVpbnQzMkFycmF5LCBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10pOiBUeXBlZFRlbnNvcjwndWludDMyJz47XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIG5ldyB1aW50NjQgdGVuc29yIG9iamVjdCBmcm9tIHRoZSBnaXZlbiBkYXRhIGFuZCBkaW1zLlxuICAgKlxuICAgKiBAcGFyYW0gZGF0YSAtIFNwZWNpZnkgdGhlIENQVSB0ZW5zb3IgZGF0YS5cbiAgICogQHBhcmFtIGRpbXMgLSBTcGVjaWZ5IHRoZSBkaW1lbnNpb24gb2YgdGhlIHRlbnNvci4gSWYgb21pdHRlZCwgYSAxLUQgdGVuc29yIGlzIGFzc3VtZWQuXG4gICAqL1xuICBuZXcoZGF0YTogQmlnVWludDY0QXJyYXksIGRpbXM/OiByZWFkb25seSBudW1iZXJbXSk6IFR5cGVkVGVuc29yPCd1aW50NjQnPjtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBDUFUgdGVuc29yIC0gZmFsbCBiYWNrIHRvIG5vbi1nZW5lcmljIHRlbnNvciB0eXBlIGRlY2xhcmF0aW9uXG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIG5ldyB0ZW5zb3Igb2JqZWN0IGZyb20gdGhlIGdpdmVuIHR5cGUsIGRhdGEgYW5kIGRpbXMuXG4gICAqXG4gICAqIEBwYXJhbSB0eXBlIC0gU3BlY2lmeSB0aGUgZWxlbWVudCB0eXBlLlxuICAgKiBAcGFyYW0gZGF0YSAtIFNwZWNpZnkgdGhlIENQVSB0ZW5zb3IgZGF0YS5cbiAgICogQHBhcmFtIGRpbXMgLSBTcGVjaWZ5IHRoZSBkaW1lbnNpb24gb2YgdGhlIHRlbnNvci4gSWYgb21pdHRlZCwgYSAxLUQgdGVuc29yIGlzIGFzc3VtZWQuXG4gICAqL1xuICBuZXcodHlwZTogVGVuc29yLlR5cGUsIGRhdGE6IFRlbnNvci5EYXRhVHlwZXxyZWFkb25seSBudW1iZXJbXXxyZWFkb25seSBzdHJpbmdbXXxyZWFkb25seSBiaWdpbnRbXXxyZWFkb25seSBib29sZWFuW10sXG4gICAgICBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10pOiBUZW5zb3I7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIG5ldyB0ZW5zb3Igb2JqZWN0IGZyb20gdGhlIGdpdmVuIGRhdGEgYW5kIGRpbXMuXG4gICAqXG4gICAqIEBwYXJhbSBkYXRhIC0gU3BlY2lmeSB0aGUgQ1BVIHRlbnNvciBkYXRhLlxuICAgKiBAcGFyYW0gZGltcyAtIFNwZWNpZnkgdGhlIGRpbWVuc2lvbiBvZiB0aGUgdGVuc29yLiBJZiBvbWl0dGVkLCBhIDEtRCB0ZW5zb3IgaXMgYXNzdW1lZC5cbiAgICovXG4gIG5ldyhkYXRhOiBUZW5zb3IuRGF0YVR5cGUsIGRpbXM/OiByZWFkb25seSBudW1iZXJbXSk6IFRlbnNvcjtcbiAgLy8gI2VuZHJlZ2lvblxufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uXG5leHBvcnQgY29uc3QgVGVuc29yID0gVGVuc29ySW1wbCBhcyBUZW5zb3JDb25zdHJ1Y3RvcjtcbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuaW1wb3J0IHtlbnZ9IGZyb20gJy4vZW52LWltcGwuanMnO1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqL1xuZXhwb3J0IGNvbnN0IFRSQUNFID0gKGRldmljZVR5cGU6IHN0cmluZywgbGFiZWw6IHN0cmluZykgPT4ge1xuICBpZiAodHlwZW9mIGVudi50cmFjZSA9PT0gJ3VuZGVmaW5lZCcgPyAhZW52Lndhc20udHJhY2UgOiAhZW52LnRyYWNlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gIGNvbnNvbGUudGltZVN0YW1wKGAke2RldmljZVR5cGV9OjpPUlQ6OiR7bGFiZWx9YCk7XG59O1xuXG5jb25zdCBUUkFDRV9GVU5DID0gKG1zZzogc3RyaW5nLCBleHRyYU1zZz86IHN0cmluZykgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBFcnJvcigpLnN0YWNrPy5zcGxpdCgvXFxyXFxufFxccnxcXG4vZykgfHwgW107XG4gIGxldCBoYXNUcmFjZUZ1bmMgPSBmYWxzZTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFjay5sZW5ndGg7IGkrKykge1xuICAgIGlmIChoYXNUcmFjZUZ1bmMgJiYgIXN0YWNrW2ldLmluY2x1ZGVzKCdUUkFDRV9GVU5DJykpIHtcbiAgICAgIGxldCBsYWJlbCA9IGBGVU5DXyR7bXNnfTo6JHtzdGFja1tpXS50cmltKCkuc3BsaXQoJyAnKVsxXX1gO1xuICAgICAgaWYgKGV4dHJhTXNnKSB7XG4gICAgICAgIGxhYmVsICs9IGA6OiR7ZXh0cmFNc2d9YDtcbiAgICAgIH1cbiAgICAgIFRSQUNFKCdDUFUnLCBsYWJlbCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChzdGFja1tpXS5pbmNsdWRlcygnVFJBQ0VfRlVOQycpKSB7XG4gICAgICBoYXNUcmFjZUZ1bmMgPSB0cnVlO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBAaWdub3JlXG4gKi9cbmV4cG9ydCBjb25zdCBUUkFDRV9GVU5DX0JFR0lOID0gKGV4dHJhTXNnPzogc3RyaW5nKSA9PiB7XG4gIGlmICh0eXBlb2YgZW52LnRyYWNlID09PSAndW5kZWZpbmVkJyA/ICFlbnYud2FzbS50cmFjZSA6ICFlbnYudHJhY2UpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgVFJBQ0VfRlVOQygnQkVHSU4nLCBleHRyYU1zZyk7XG59O1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqL1xuZXhwb3J0IGNvbnN0IFRSQUNFX0ZVTkNfRU5EID0gKGV4dHJhTXNnPzogc3RyaW5nKSA9PiB7XG4gIGlmICh0eXBlb2YgZW52LnRyYWNlID09PSAndW5kZWZpbmVkJyA/ICFlbnYud2FzbS50cmFjZSA6ICFlbnYudHJhY2UpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgVFJBQ0VfRlVOQygnRU5EJywgZXh0cmFNc2cpO1xufTtcbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuaW1wb3J0IHtyZXNvbHZlQmFja2VuZEFuZEV4ZWN1dGlvblByb3ZpZGVyc30gZnJvbSAnLi9iYWNrZW5kLWltcGwuanMnO1xuaW1wb3J0IHtJbmZlcmVuY2VTZXNzaW9uSGFuZGxlcn0gZnJvbSAnLi9iYWNrZW5kLmpzJztcbmltcG9ydCB7SW5mZXJlbmNlU2Vzc2lvbiBhcyBJbmZlcmVuY2VTZXNzaW9uSW50ZXJmYWNlfSBmcm9tICcuL2luZmVyZW5jZS1zZXNzaW9uLmpzJztcbmltcG9ydCB7T25ueFZhbHVlfSBmcm9tICcuL29ubngtdmFsdWUuanMnO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4vdGVuc29yLmpzJztcbmltcG9ydCB7VFJBQ0VfRlVOQ19CRUdJTiwgVFJBQ0VfRlVOQ19FTkR9IGZyb20gJy4vdHJhY2UuanMnO1xuXG50eXBlIFNlc3Npb25PcHRpb25zID0gSW5mZXJlbmNlU2Vzc2lvbkludGVyZmFjZS5TZXNzaW9uT3B0aW9ucztcbnR5cGUgUnVuT3B0aW9ucyA9IEluZmVyZW5jZVNlc3Npb25JbnRlcmZhY2UuUnVuT3B0aW9ucztcbnR5cGUgRmVlZHNUeXBlID0gSW5mZXJlbmNlU2Vzc2lvbkludGVyZmFjZS5GZWVkc1R5cGU7XG50eXBlIEZldGNoZXNUeXBlID0gSW5mZXJlbmNlU2Vzc2lvbkludGVyZmFjZS5GZXRjaGVzVHlwZTtcbnR5cGUgUmV0dXJuVHlwZSA9IEluZmVyZW5jZVNlc3Npb25JbnRlcmZhY2UuUmV0dXJuVHlwZTtcblxuZXhwb3J0IGNsYXNzIEluZmVyZW5jZVNlc3Npb24gaW1wbGVtZW50cyBJbmZlcmVuY2VTZXNzaW9uSW50ZXJmYWNlIHtcbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihoYW5kbGVyOiBJbmZlcmVuY2VTZXNzaW9uSGFuZGxlcikge1xuICAgIHRoaXMuaGFuZGxlciA9IGhhbmRsZXI7XG4gIH1cbiAgcnVuKGZlZWRzOiBGZWVkc1R5cGUsIG9wdGlvbnM/OiBSdW5PcHRpb25zKTogUHJvbWlzZTxSZXR1cm5UeXBlPjtcbiAgcnVuKGZlZWRzOiBGZWVkc1R5cGUsIGZldGNoZXM6IEZldGNoZXNUeXBlLCBvcHRpb25zPzogUnVuT3B0aW9ucyk6IFByb21pc2U8UmV0dXJuVHlwZT47XG4gIGFzeW5jIHJ1bihmZWVkczogRmVlZHNUeXBlLCBhcmcxPzogRmV0Y2hlc1R5cGV8UnVuT3B0aW9ucywgYXJnMj86IFJ1bk9wdGlvbnMpOiBQcm9taXNlPFJldHVyblR5cGU+IHtcbiAgICBUUkFDRV9GVU5DX0JFR0lOKCk7XG4gICAgY29uc3QgZmV0Y2hlczoge1tuYW1lOiBzdHJpbmddOiBPbm54VmFsdWV8bnVsbH0gPSB7fTtcbiAgICBsZXQgb3B0aW9uczogUnVuT3B0aW9ucyA9IHt9O1xuICAgIC8vIGNoZWNrIGlucHV0c1xuICAgIGlmICh0eXBlb2YgZmVlZHMgIT09ICdvYmplY3QnIHx8IGZlZWRzID09PSBudWxsIHx8IGZlZWRzIGluc3RhbmNlb2YgVGVuc29yIHx8IEFycmF5LmlzQXJyYXkoZmVlZHMpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICdcXCdmZWVkc1xcJyBtdXN0IGJlIGFuIG9iamVjdCB0aGF0IHVzZSBpbnB1dCBuYW1lcyBhcyBrZXlzIGFuZCBPbm54VmFsdWUgYXMgY29ycmVzcG9uZGluZyB2YWx1ZXMuJyk7XG4gICAgfVxuXG4gICAgbGV0IGlzRmV0Y2hlc0VtcHR5ID0gdHJ1ZTtcbiAgICAvLyBkZXRlcm1pbmUgd2hpY2ggb3ZlcnJpZGUgaXMgYmVpbmcgdXNlZFxuICAgIGlmICh0eXBlb2YgYXJnMSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmIChhcmcxID09PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1VuZXhwZWN0ZWQgYXJndW1lbnRbMV06IGNhbm5vdCBiZSBudWxsLicpO1xuICAgICAgfVxuICAgICAgaWYgKGFyZzEgaW5zdGFuY2VvZiBUZW5zb3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXFwnZmV0Y2hlc1xcJyBjYW5ub3QgYmUgYSBUZW5zb3InKTtcbiAgICAgIH1cblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnMSkpIHtcbiAgICAgICAgaWYgKGFyZzEubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXFwnZmV0Y2hlc1xcJyBjYW5ub3QgYmUgYW4gZW1wdHkgYXJyYXkuJyk7XG4gICAgICAgIH1cbiAgICAgICAgaXNGZXRjaGVzRW1wdHkgPSBmYWxzZTtcbiAgICAgICAgLy8gb3V0cHV0IG5hbWVzXG4gICAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBhcmcxKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXFwnZmV0Y2hlc1xcJyBtdXN0IGJlIGEgc3RyaW5nIGFycmF5IG9yIGFuIG9iamVjdC4nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMub3V0cHV0TmFtZXMuaW5kZXhPZihuYW1lKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKGAnZmV0Y2hlcycgY29udGFpbnMgaW52YWxpZCBvdXRwdXQgbmFtZTogJHtuYW1lfS5gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZmV0Y2hlc1tuYW1lXSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGFyZzIgPT09ICdvYmplY3QnICYmIGFyZzIgIT09IG51bGwpIHtcbiAgICAgICAgICBvcHRpb25zID0gYXJnMjtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJnMiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcXCdvcHRpb25zXFwnIG11c3QgYmUgYW4gb2JqZWN0LicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBkZWNpZGUgd2hldGhlciBhcmcxIGlzIGZldGNoZXMgb3Igb3B0aW9uc1xuICAgICAgICAvLyBpZiBhbnkgb3V0cHV0IG5hbWUgaXMgcHJlc2VudCBhbmQgaXRzIHZhbHVlIGlzIHZhbGlkIE9ubnhWYWx1ZSwgd2UgY29uc2lkZXIgaXQgZmV0Y2hlc1xuICAgICAgICBsZXQgaXNGZXRjaGVzID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IGFyZzFLZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYXJnMSk7XG4gICAgICAgIGZvciAoY29uc3QgbmFtZSBvZiB0aGlzLm91dHB1dE5hbWVzKSB7XG4gICAgICAgICAgaWYgKGFyZzFLZXlzLmluZGV4T2YobmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICBjb25zdCB2ID0gKGFyZzEgYXMgSW5mZXJlbmNlU2Vzc2lvbkludGVyZmFjZS5OdWxsYWJsZU9ubnhWYWx1ZU1hcFR5cGUpW25hbWVdO1xuICAgICAgICAgICAgaWYgKHYgPT09IG51bGwgfHwgdiBpbnN0YW5jZW9mIFRlbnNvcikge1xuICAgICAgICAgICAgICBpc0ZldGNoZXMgPSB0cnVlO1xuICAgICAgICAgICAgICBpc0ZldGNoZXNFbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICBmZXRjaGVzW25hbWVdID0gdjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNGZXRjaGVzKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBhcmcyID09PSAnb2JqZWN0JyAmJiBhcmcyICE9PSBudWxsKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gYXJnMjtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmcyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXFwnb3B0aW9uc1xcJyBtdXN0IGJlIGFuIG9iamVjdC4nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3B0aW9ucyA9IGFyZzEgYXMgUnVuT3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGFyZzEgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmV4cGVjdGVkIGFyZ3VtZW50WzFdOiBtdXN0IGJlIFxcJ2ZldGNoZXNcXCcgb3IgXFwnb3B0aW9uc1xcJy4nKTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiBhbGwgaW5wdXRzIGFyZSBpbiBmZWVkXG4gICAgZm9yIChjb25zdCBuYW1lIG9mIHRoaXMuaW5wdXROYW1lcykge1xuICAgICAgaWYgKHR5cGVvZiBmZWVkc1tuYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBpbnB1dCAnJHtuYW1lfScgaXMgbWlzc2luZyBpbiAnZmVlZHMnLmApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGlmIG5vIGZldGNoZXMgaXMgc3BlY2lmaWVkLCB3ZSB1c2UgdGhlIGZ1bGwgb3V0cHV0IG5hbWVzIGxpc3RcbiAgICBpZiAoaXNGZXRjaGVzRW1wdHkpIHtcbiAgICAgIGZvciAoY29uc3QgbmFtZSBvZiB0aGlzLm91dHB1dE5hbWVzKSB7XG4gICAgICAgIGZldGNoZXNbbmFtZV0gPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGZlZWRzLCBmZXRjaGVzIGFuZCBvcHRpb25zIGFyZSBwcmVwYXJlZFxuXG4gICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IHRoaXMuaGFuZGxlci5ydW4oZmVlZHMsIGZldGNoZXMsIG9wdGlvbnMpO1xuICAgIGNvbnN0IHJldHVyblZhbHVlOiB7W25hbWU6IHN0cmluZ106IE9ubnhWYWx1ZX0gPSB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiByZXN1bHRzKSB7XG4gICAgICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwocmVzdWx0cywga2V5KSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSByZXN1bHRzW2tleV07XG4gICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBUZW5zb3IpIHtcbiAgICAgICAgICByZXR1cm5WYWx1ZVtrZXldID0gcmVzdWx0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVyblZhbHVlW2tleV0gPSBuZXcgVGVuc29yKHJlc3VsdC50eXBlLCByZXN1bHQuZGF0YSwgcmVzdWx0LmRpbXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFRSQUNFX0ZVTkNfRU5EKCk7XG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgYXN5bmMgcmVsZWFzZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVyLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGUocGF0aDogc3RyaW5nLCBvcHRpb25zPzogU2Vzc2lvbk9wdGlvbnMpOiBQcm9taXNlPEluZmVyZW5jZVNlc3Npb25JbnRlcmZhY2U+O1xuICBzdGF0aWMgY3JlYXRlKGJ1ZmZlcjogQXJyYXlCdWZmZXJMaWtlLCBvcHRpb25zPzogU2Vzc2lvbk9wdGlvbnMpOiBQcm9taXNlPEluZmVyZW5jZVNlc3Npb25JbnRlcmZhY2U+O1xuICBzdGF0aWMgY3JlYXRlKGJ1ZmZlcjogQXJyYXlCdWZmZXJMaWtlLCBieXRlT2Zmc2V0OiBudW1iZXIsIGJ5dGVMZW5ndGg/OiBudW1iZXIsIG9wdGlvbnM/OiBTZXNzaW9uT3B0aW9ucyk6XG4gICAgICBQcm9taXNlPEluZmVyZW5jZVNlc3Npb25JbnRlcmZhY2U+O1xuICBzdGF0aWMgY3JlYXRlKGJ1ZmZlcjogVWludDhBcnJheSwgb3B0aW9ucz86IFNlc3Npb25PcHRpb25zKTogUHJvbWlzZTxJbmZlcmVuY2VTZXNzaW9uSW50ZXJmYWNlPjtcbiAgc3RhdGljIGFzeW5jIGNyZWF0ZShcbiAgICAgIGFyZzA6IHN0cmluZ3xBcnJheUJ1ZmZlckxpa2V8VWludDhBcnJheSwgYXJnMT86IFNlc3Npb25PcHRpb25zfG51bWJlciwgYXJnMj86IG51bWJlcixcbiAgICAgIGFyZzM/OiBTZXNzaW9uT3B0aW9ucyk6IFByb21pc2U8SW5mZXJlbmNlU2Vzc2lvbkludGVyZmFjZT4ge1xuICAgIFRSQUNFX0ZVTkNfQkVHSU4oKTtcbiAgICAvLyBlaXRoZXIgbG9hZCBmcm9tIGEgZmlsZSBvciBidWZmZXJcbiAgICBsZXQgZmlsZVBhdGhPclVpbnQ4QXJyYXk6IHN0cmluZ3xVaW50OEFycmF5O1xuICAgIGxldCBvcHRpb25zOiBTZXNzaW9uT3B0aW9ucyA9IHt9O1xuXG4gICAgaWYgKHR5cGVvZiBhcmcwID09PSAnc3RyaW5nJykge1xuICAgICAgZmlsZVBhdGhPclVpbnQ4QXJyYXkgPSBhcmcwO1xuICAgICAgaWYgKHR5cGVvZiBhcmcxID09PSAnb2JqZWN0JyAmJiBhcmcxICE9PSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMgPSBhcmcxO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJnMSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXFwnb3B0aW9uc1xcJyBtdXN0IGJlIGFuIG9iamVjdC4nKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFyZzAgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICBmaWxlUGF0aE9yVWludDhBcnJheSA9IGFyZzA7XG4gICAgICBpZiAodHlwZW9mIGFyZzEgPT09ICdvYmplY3QnICYmIGFyZzEgIT09IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucyA9IGFyZzE7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmcxICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcXCdvcHRpb25zXFwnIG11c3QgYmUgYW4gb2JqZWN0LicpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIGFyZzAgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciB8fFxuICAgICAgICAodHlwZW9mIFNoYXJlZEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiBhcmcwIGluc3RhbmNlb2YgU2hhcmVkQXJyYXlCdWZmZXIpKSB7XG4gICAgICBjb25zdCBidWZmZXIgPSBhcmcwO1xuICAgICAgbGV0IGJ5dGVPZmZzZXQgPSAwO1xuICAgICAgbGV0IGJ5dGVMZW5ndGggPSBhcmcwLmJ5dGVMZW5ndGg7XG4gICAgICBpZiAodHlwZW9mIGFyZzEgPT09ICdvYmplY3QnICYmIGFyZzEgIT09IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucyA9IGFyZzE7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmcxID09PSAnbnVtYmVyJykge1xuICAgICAgICBieXRlT2Zmc2V0ID0gYXJnMTtcbiAgICAgICAgaWYgKCFOdW1iZXIuaXNTYWZlSW50ZWdlcihieXRlT2Zmc2V0KSkge1xuICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdieXRlT2Zmc2V0XFwnIG11c3QgYmUgYW4gaW50ZWdlci4nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYnl0ZU9mZnNldCA8IDAgfHwgYnl0ZU9mZnNldCA+PSBidWZmZXIuYnl0ZUxlbmd0aCkge1xuICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKGAnYnl0ZU9mZnNldCcgaXMgb3V0IG9mIHJhbmdlIFswLCAke2J1ZmZlci5ieXRlTGVuZ3RofSkuYCk7XG4gICAgICAgIH1cbiAgICAgICAgYnl0ZUxlbmd0aCA9IGFyZzAuYnl0ZUxlbmd0aCAtIGJ5dGVPZmZzZXQ7XG4gICAgICAgIGlmICh0eXBlb2YgYXJnMiA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICBieXRlTGVuZ3RoID0gYXJnMjtcbiAgICAgICAgICBpZiAoIU51bWJlci5pc1NhZmVJbnRlZ2VyKGJ5dGVMZW5ndGgpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXFwnYnl0ZUxlbmd0aFxcJyBtdXN0IGJlIGFuIGludGVnZXIuJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChieXRlTGVuZ3RoIDw9IDAgfHwgYnl0ZU9mZnNldCArIGJ5dGVMZW5ndGggPiBidWZmZXIuYnl0ZUxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoYCdieXRlTGVuZ3RoJyBpcyBvdXQgb2YgcmFuZ2UgKDAsICR7YnVmZmVyLmJ5dGVMZW5ndGggLSBieXRlT2Zmc2V0fV0uYCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0eXBlb2YgYXJnMyA9PT0gJ29iamVjdCcgJiYgYXJnMyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgb3B0aW9ucyA9IGFyZzM7XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJnMyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1xcJ29wdGlvbnNcXCcgbXVzdCBiZSBhbiBvYmplY3QuJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmcyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1xcJ2J5dGVMZW5ndGhcXCcgbXVzdCBiZSBhIG51bWJlci4nKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJnMSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXFwnb3B0aW9uc1xcJyBtdXN0IGJlIGFuIG9iamVjdC4nKTtcbiAgICAgIH1cbiAgICAgIGZpbGVQYXRoT3JVaW50OEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyLCBieXRlT2Zmc2V0LCBieXRlTGVuZ3RoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5leHBlY3RlZCBhcmd1bWVudFswXTogbXVzdCBiZSBcXCdwYXRoXFwnIG9yIFxcJ2J1ZmZlclxcJy4nKTtcbiAgICB9XG5cbiAgICAvLyByZXNvbHZlIGJhY2tlbmQsIHVwZGF0ZSBzZXNzaW9uIG9wdGlvbnMgd2l0aCB2YWxpZGF0ZWQgRVBzLCBhbmQgY3JlYXRlIHNlc3Npb24gaGFuZGxlclxuICAgIGNvbnN0IFtiYWNrZW5kLCBvcHRpb25zV2l0aFZhbGlkYXRlZEVQc10gPSBhd2FpdCByZXNvbHZlQmFja2VuZEFuZEV4ZWN1dGlvblByb3ZpZGVycyhvcHRpb25zKTtcbiAgICBjb25zdCBoYW5kbGVyID0gYXdhaXQgYmFja2VuZC5jcmVhdGVJbmZlcmVuY2VTZXNzaW9uSGFuZGxlcihmaWxlUGF0aE9yVWludDhBcnJheSwgb3B0aW9uc1dpdGhWYWxpZGF0ZWRFUHMpO1xuICAgIFRSQUNFX0ZVTkNfRU5EKCk7XG4gICAgcmV0dXJuIG5ldyBJbmZlcmVuY2VTZXNzaW9uKGhhbmRsZXIpO1xuICB9XG5cbiAgc3RhcnRQcm9maWxpbmcoKTogdm9pZCB7XG4gICAgdGhpcy5oYW5kbGVyLnN0YXJ0UHJvZmlsaW5nKCk7XG4gIH1cbiAgZW5kUHJvZmlsaW5nKCk6IHZvaWQge1xuICAgIHRoaXMuaGFuZGxlci5lbmRQcm9maWxpbmcoKTtcbiAgfVxuXG4gIGdldCBpbnB1dE5hbWVzKCk6IHJlYWRvbmx5IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVyLmlucHV0TmFtZXM7XG4gIH1cbiAgZ2V0IG91dHB1dE5hbWVzKCk6IHJlYWRvbmx5IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVyLm91dHB1dE5hbWVzO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVyOiBJbmZlcmVuY2VTZXNzaW9uSGFuZGxlcjtcbn1cbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuaW1wb3J0IHtJbmZlcmVuY2VTZXNzaW9uIGFzIEluZmVyZW5jZVNlc3Npb25JbXBsfSBmcm9tICcuL2luZmVyZW5jZS1zZXNzaW9uLWltcGwuanMnO1xuaW1wb3J0IHtPbm54TW9kZWxPcHRpb25zfSBmcm9tICcuL29ubngtbW9kZWwuanMnO1xuaW1wb3J0IHtPbm54VmFsdWUsIE9ubnhWYWx1ZURhdGFMb2NhdGlvbn0gZnJvbSAnLi9vbm54LXZhbHVlLmpzJztcblxuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlZGVjbGFyZSAqL1xuXG5leHBvcnQgZGVjbGFyZSBuYW1lc3BhY2UgSW5mZXJlbmNlU2Vzc2lvbiB7XG4gIC8vICNyZWdpb24gaW5wdXQvb3V0cHV0IHR5cGVzXG5cbiAgdHlwZSBPbm54VmFsdWVNYXBUeXBlID0ge3JlYWRvbmx5IFtuYW1lOiBzdHJpbmddOiBPbm54VmFsdWV9O1xuICB0eXBlIE51bGxhYmxlT25ueFZhbHVlTWFwVHlwZSA9IHtyZWFkb25seSBbbmFtZTogc3RyaW5nXTogT25ueFZhbHVlIHwgbnVsbH07XG5cbiAgLyoqXG4gICAqIEEgZmVlZHMgKG1vZGVsIGlucHV0cykgaXMgYW4gb2JqZWN0IHRoYXQgdXNlcyBpbnB1dCBuYW1lcyBhcyBrZXlzIGFuZCBPbm54VmFsdWUgYXMgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gICAqL1xuICB0eXBlIEZlZWRzVHlwZSA9IE9ubnhWYWx1ZU1hcFR5cGU7XG5cbiAgLyoqXG4gICAqIEEgZmV0Y2hlcyAobW9kZWwgb3V0cHV0cykgY291bGQgYmUgb25lIG9mIHRoZSBmb2xsb3dpbmc6XG4gICAqXG4gICAqIC0gT21pdHRlZC4gVXNlIG1vZGVsJ3Mgb3V0cHV0IG5hbWVzIGRlZmluaXRpb24uXG4gICAqIC0gQW4gYXJyYXkgb2Ygc3RyaW5nIGluZGljYXRpbmcgdGhlIG91dHB1dCBuYW1lcy5cbiAgICogLSBBbiBvYmplY3QgdGhhdCB1c2Ugb3V0cHV0IG5hbWVzIGFzIGtleXMgYW5kIE9ubnhWYWx1ZSBvciBudWxsIGFzIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICAgKlxuICAgKiBAcmVtYXJrXG4gICAqIGRpZmZlcmVudCBmcm9tIGlucHV0IGFyZ3VtZW50LCBpbiBvdXRwdXQsIE9ubnhWYWx1ZSBpcyBvcHRpb25hbC4gSWYgYW4gT25ueFZhbHVlIGlzIHByZXNlbnQgaXQgd2lsbCBiZVxuICAgKiB1c2VkIGFzIGEgcHJlLWFsbG9jYXRlZCB2YWx1ZSBieSB0aGUgaW5mZXJlbmNlIGVuZ2luZTsgaWYgb21pdHRlZCwgaW5mZXJlbmNlIGVuZ2luZSB3aWxsIGFsbG9jYXRlIGJ1ZmZlclxuICAgKiBpbnRlcm5hbGx5LlxuICAgKi9cbiAgdHlwZSBGZXRjaGVzVHlwZSA9IHJlYWRvbmx5IHN0cmluZ1tdfE51bGxhYmxlT25ueFZhbHVlTWFwVHlwZTtcblxuICAvKipcbiAgICogQSBpbmZlcmVuY2luZyByZXR1cm4gdHlwZSBpcyBhbiBvYmplY3QgdGhhdCB1c2VzIG91dHB1dCBuYW1lcyBhcyBrZXlzIGFuZCBPbm54VmFsdWUgYXMgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gICAqL1xuICB0eXBlIFJldHVyblR5cGUgPSBPbm54VmFsdWVNYXBUeXBlO1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIHNlc3Npb24gb3B0aW9uc1xuXG4gIC8qKlxuICAgKiBBIHNldCBvZiBjb25maWd1cmF0aW9ucyBmb3Igc2Vzc2lvbiBiZWhhdmlvci5cbiAgICovXG4gIGV4cG9ydCBpbnRlcmZhY2UgU2Vzc2lvbk9wdGlvbnMgZXh0ZW5kcyBPbm54TW9kZWxPcHRpb25zIHtcbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSBvZiBleGVjdXRpb24gcHJvdmlkZXIgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIEFuIGV4ZWN1dGlvbiBwcm92aWRlciBvcHRpb24gY2FuIGJlIGEgc3RyaW5nIGluZGljYXRpbmcgdGhlIG5hbWUgb2YgdGhlIGV4ZWN1dGlvbiBwcm92aWRlcixcbiAgICAgKiBvciBhbiBvYmplY3Qgb2YgY29ycmVzcG9uZGluZyB0eXBlLlxuICAgICAqL1xuICAgIGV4ZWN1dGlvblByb3ZpZGVycz86IHJlYWRvbmx5IEV4ZWN1dGlvblByb3ZpZGVyQ29uZmlnW107XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaW50cmEgT1AgdGhyZWFkcyBudW1iZXIuXG4gICAgICpcbiAgICAgKiBUaGlzIHNldHRpbmcgaXMgYXZhaWxhYmxlIG9ubHkgaW4gT05OWFJ1bnRpbWUgKE5vZGUuanMgYmluZGluZyBhbmQgcmVhY3QtbmF0aXZlKS5cbiAgICAgKi9cbiAgICBpbnRyYU9wTnVtVGhyZWFkcz86IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBpbnRlciBPUCB0aHJlYWRzIG51bWJlci5cbiAgICAgKlxuICAgICAqIFRoaXMgc2V0dGluZyBpcyBhdmFpbGFibGUgb25seSBpbiBPTk5YUnVudGltZSAoTm9kZS5qcyBiaW5kaW5nIGFuZCByZWFjdC1uYXRpdmUpLlxuICAgICAqL1xuICAgIGludGVyT3BOdW1UaHJlYWRzPzogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGZyZWUgZGltZW5zaW9uIG92ZXJyaWRlLlxuICAgICAqXG4gICAgICogVGhpcyBzZXR0aW5nIGlzIGF2YWlsYWJsZSBvbmx5IGluIE9OTlhSdW50aW1lIChOb2RlLmpzIGJpbmRpbmcgYW5kIHJlYWN0LW5hdGl2ZSkgb3IgV2ViQXNzZW1ibHkgYmFja2VuZFxuICAgICAqL1xuICAgIGZyZWVEaW1lbnNpb25PdmVycmlkZXM/OiB7cmVhZG9ubHkgW2RpbWVuc2lvbk5hbWU6IHN0cmluZ106IG51bWJlcn07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgb3B0aW1pemF0aW9uIGxldmVsLlxuICAgICAqXG4gICAgICogVGhpcyBzZXR0aW5nIGlzIGF2YWlsYWJsZSBvbmx5IGluIE9OTlhSdW50aW1lIChOb2RlLmpzIGJpbmRpbmcgYW5kIHJlYWN0LW5hdGl2ZSkgb3IgV2ViQXNzZW1ibHkgYmFja2VuZFxuICAgICAqL1xuICAgIGdyYXBoT3B0aW1pemF0aW9uTGV2ZWw/OiAnZGlzYWJsZWQnfCdiYXNpYyd8J2V4dGVuZGVkJ3wnYWxsJztcblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgZW5hYmxlIENQVSBtZW1vcnkgYXJlbmEuXG4gICAgICpcbiAgICAgKiBUaGlzIHNldHRpbmcgaXMgYXZhaWxhYmxlIG9ubHkgaW4gT05OWFJ1bnRpbWUgKE5vZGUuanMgYmluZGluZyBhbmQgcmVhY3QtbmF0aXZlKSBvciBXZWJBc3NlbWJseSBiYWNrZW5kXG4gICAgICovXG4gICAgZW5hYmxlQ3B1TWVtQXJlbmE/OiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciBlbmFibGUgbWVtb3J5IHBhdHRlcm4uXG4gICAgICpcbiAgICAgKiBUaGlzIHNldHRpbmcgaXMgYXZhaWxhYmxlIG9ubHkgaW4gT05OWFJ1bnRpbWUgKE5vZGUuanMgYmluZGluZyBhbmQgcmVhY3QtbmF0aXZlKSBvciBXZWJBc3NlbWJseSBiYWNrZW5kXG4gICAgICovXG4gICAgZW5hYmxlTWVtUGF0dGVybj86IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRpb24gbW9kZS5cbiAgICAgKlxuICAgICAqIFRoaXMgc2V0dGluZyBpcyBhdmFpbGFibGUgb25seSBpbiBPTk5YUnVudGltZSAoTm9kZS5qcyBiaW5kaW5nIGFuZCByZWFjdC1uYXRpdmUpIG9yIFdlYkFzc2VtYmx5IGJhY2tlbmRcbiAgICAgKi9cbiAgICBleGVjdXRpb25Nb2RlPzogJ3NlcXVlbnRpYWwnfCdwYXJhbGxlbCc7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpbWl6ZWQgbW9kZWwgZmlsZSBwYXRoLlxuICAgICAqXG4gICAgICogSWYgdGhpcyBzZXR0aW5nIGlzIHNwZWNpZmllZCwgdGhlIG9wdGltaXplZCBtb2RlbCB3aWxsIGJlIGR1bXBlZC4gSW4gYnJvd3NlciwgYSBibG9iIHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIHdpdGggYSBwb3AtdXAgd2luZG93LlxuICAgICAqL1xuICAgIG9wdGltaXplZE1vZGVsRmlsZVBhdGg/OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIGVuYWJsZSBwcm9maWxpbmcuXG4gICAgICpcbiAgICAgKiBUaGlzIHNldHRpbmcgaXMgYSBwbGFjZWhvbGRlciBmb3IgYSBmdXR1cmUgdXNlLlxuICAgICAqL1xuICAgIGVuYWJsZVByb2ZpbGluZz86IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBGaWxlIHByZWZpeCBmb3IgcHJvZmlsaW5nLlxuICAgICAqXG4gICAgICogVGhpcyBzZXR0aW5nIGlzIGEgcGxhY2Vob2xkZXIgZm9yIGEgZnV0dXJlIHVzZS5cbiAgICAgKi9cbiAgICBwcm9maWxlRmlsZVByZWZpeD86IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIExvZyBJRC5cbiAgICAgKlxuICAgICAqIFRoaXMgc2V0dGluZyBpcyBhdmFpbGFibGUgb25seSBpbiBPTk5YUnVudGltZSAoTm9kZS5qcyBiaW5kaW5nIGFuZCByZWFjdC1uYXRpdmUpIG9yIFdlYkFzc2VtYmx5IGJhY2tlbmRcbiAgICAgKi9cbiAgICBsb2dJZD86IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIExvZyBzZXZlcml0eSBsZXZlbC4gU2VlXG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9vbm54cnVudGltZS9ibG9iL21haW4vaW5jbHVkZS9vbm54cnVudGltZS9jb3JlL2NvbW1vbi9sb2dnaW5nL3NldmVyaXR5LmhcbiAgICAgKlxuICAgICAqIFRoaXMgc2V0dGluZyBpcyBhdmFpbGFibGUgb25seSBpbiBPTk5YUnVudGltZSAoTm9kZS5qcyBiaW5kaW5nIGFuZCByZWFjdC1uYXRpdmUpIG9yIFdlYkFzc2VtYmx5IGJhY2tlbmRcbiAgICAgKi9cbiAgICBsb2dTZXZlcml0eUxldmVsPzogMHwxfDJ8M3w0O1xuXG4gICAgLyoqXG4gICAgICogTG9nIHZlcmJvc2l0eSBsZXZlbC5cbiAgICAgKlxuICAgICAqIFRoaXMgc2V0dGluZyBpcyBhdmFpbGFibGUgb25seSBpbiBXZWJBc3NlbWJseSBiYWNrZW5kLiBXaWxsIHN1cHBvcnQgTm9kZS5qcyBiaW5kaW5nIGFuZCByZWFjdC1uYXRpdmUgbGF0ZXJcbiAgICAgKi9cbiAgICBsb2dWZXJib3NpdHlMZXZlbD86IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFNwZWNpZnkgc3RyaW5nIGFzIGEgcHJlZmVycmVkIGRhdGEgbG9jYXRpb24gZm9yIGFsbCBvdXRwdXRzLCBvciBhbiBvYmplY3QgdGhhdCB1c2Ugb3V0cHV0IG5hbWVzIGFzIGtleXMgYW5kIGFcbiAgICAgKiBwcmVmZXJyZWQgZGF0YSBsb2NhdGlvbiBhcyBjb3JyZXNwb25kaW5nIHZhbHVlcy5cbiAgICAgKlxuICAgICAqIFRoaXMgc2V0dGluZyBpcyBhdmFpbGFibGUgb25seSBpbiBPTk5YUnVudGltZSBXZWIgZm9yIFdlYkdMIGFuZCBXZWJHUFUgRVAuXG4gICAgICovXG4gICAgcHJlZmVycmVkT3V0cHV0TG9jYXRpb24/OiBPbm54VmFsdWVEYXRhTG9jYXRpb258e3JlYWRvbmx5IFtvdXRwdXROYW1lOiBzdHJpbmddOiBPbm54VmFsdWVEYXRhTG9jYXRpb259O1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciBlbmFibGUgZ3JhcGggY2FwdHVyZS5cbiAgICAgKiBUaGlzIHNldHRpbmcgaXMgYXZhaWxhYmxlIG9ubHkgaW4gT05OWFJ1bnRpbWUgV2ViIGZvciBXZWJHUFUgRVAuXG4gICAgICovXG4gICAgZW5hYmxlR3JhcGhDYXB0dXJlPzogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIFN0b3JlIGNvbmZpZ3VyYXRpb25zIGZvciBhIHNlc3Npb24uIFNlZVxuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvb25ueHJ1bnRpbWUvYmxvYi9tYWluL2luY2x1ZGUvb25ueHJ1bnRpbWUvY29yZS9zZXNzaW9uL1xuICAgICAqIG9ubnhydW50aW1lX3Nlc3Npb25fb3B0aW9uc19jb25maWdfa2V5cy5oXG4gICAgICpcbiAgICAgKiBUaGlzIHNldHRpbmcgaXMgYXZhaWxhYmxlIG9ubHkgaW4gV2ViQXNzZW1ibHkgYmFja2VuZC4gV2lsbCBzdXBwb3J0IE5vZGUuanMgYmluZGluZyBhbmQgcmVhY3QtbmF0aXZlIGxhdGVyXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGpzXG4gICAgICogZXh0cmE6IHtcbiAgICAgKiAgIHNlc3Npb246IHtcbiAgICAgKiAgICAgc2V0X2Rlbm9ybWFsX2FzX3plcm86IFwiMVwiLFxuICAgICAqICAgICBkaXNhYmxlX3ByZXBhY2tpbmc6IFwiMVwiXG4gICAgICogICB9LFxuICAgICAqICAgb3B0aW1pemF0aW9uOiB7XG4gICAgICogICAgIGVuYWJsZV9nZWx1X2FwcHJveGltYXRpb246IFwiMVwiXG4gICAgICogICB9XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIGV4dHJhPzogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIH1cblxuICAvLyAjcmVnaW9uIGV4ZWN1dGlvbiBwcm92aWRlcnNcblxuICAvLyBDdXJyZW50bHksIHdlIGhhdmUgdGhlIGZvbGxvd2luZyBiYWNrZW5kcyB0byBzdXBwb3J0IGV4ZWN1dGlvbiBwcm92aWRlcnM6XG4gIC8vIEJhY2tlbmQgTm9kZS5qcyBiaW5kaW5nOiBzdXBwb3J0cyAnY3B1JywgJ2RtbCcgKHdpbjMyKSwgJ2NvcmVtbCcgKG1hY09TKSBhbmQgJ2N1ZGEnIChsaW51eCkuXG4gIC8vIEJhY2tlbmQgV2ViQXNzZW1ibHk6IHN1cHBvcnRzICdjcHUnLCAnd2FzbScsICd3ZWJncHUnIGFuZCAnd2Vibm4nLlxuICAvLyBCYWNrZW5kIE9OTlguanM6IHN1cHBvcnRzICd3ZWJnbCcuXG4gIC8vIEJhY2tlbmQgUmVhY3QgTmF0aXZlOiBzdXBwb3J0cyAnY3B1JywgJ3hubnBhY2snLCAnY29yZW1sJyAoaU9TKSwgJ25uYXBpJyAoQW5kcm9pZCkuXG4gIGludGVyZmFjZSBFeGVjdXRpb25Qcm92aWRlck9wdGlvbk1hcCB7XG4gICAgY29yZW1sOiBDb3JlTUxFeGVjdXRpb25Qcm92aWRlck9wdGlvbjtcbiAgICBjcHU6IENwdUV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uO1xuICAgIGN1ZGE6IEN1ZGFFeGVjdXRpb25Qcm92aWRlck9wdGlvbjtcbiAgICBkbWw6IERtbEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uO1xuICAgIG5uYXBpOiBObmFwaUV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uO1xuICAgIHRlbnNvcnJ0OiBUZW5zb3JSdEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uO1xuICAgIHdhc206IFdlYkFzc2VtYmx5RXhlY3V0aW9uUHJvdmlkZXJPcHRpb247XG4gICAgd2ViZ2w6IFdlYkdMRXhlY3V0aW9uUHJvdmlkZXJPcHRpb247XG4gICAgd2ViZ3B1OiBXZWJHcHVFeGVjdXRpb25Qcm92aWRlck9wdGlvbjtcbiAgICB3ZWJubjogV2ViTk5FeGVjdXRpb25Qcm92aWRlck9wdGlvbjtcbiAgICB4bm5wYWNrOiBYbm5wYWNrRXhlY3V0aW9uUHJvdmlkZXJPcHRpb247XG4gIH1cblxuICB0eXBlIEV4ZWN1dGlvblByb3ZpZGVyTmFtZSA9IGtleW9mIEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uTWFwO1xuICB0eXBlIEV4ZWN1dGlvblByb3ZpZGVyQ29uZmlnID1cbiAgICAgIEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uTWFwW0V4ZWN1dGlvblByb3ZpZGVyTmFtZV18RXhlY3V0aW9uUHJvdmlkZXJPcHRpb258RXhlY3V0aW9uUHJvdmlkZXJOYW1lfHN0cmluZztcblxuICBleHBvcnQgaW50ZXJmYWNlIEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uIHtcbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG4gIH1cbiAgZXhwb3J0IGludGVyZmFjZSBDcHVFeGVjdXRpb25Qcm92aWRlck9wdGlvbiBleHRlbmRzIEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uIHtcbiAgICByZWFkb25seSBuYW1lOiAnY3B1JztcbiAgICB1c2VBcmVuYT86IGJvb2xlYW47XG4gIH1cbiAgZXhwb3J0IGludGVyZmFjZSBDdWRhRXhlY3V0aW9uUHJvdmlkZXJPcHRpb24gZXh0ZW5kcyBFeGVjdXRpb25Qcm92aWRlck9wdGlvbiB7XG4gICAgcmVhZG9ubHkgbmFtZTogJ2N1ZGEnO1xuICAgIGRldmljZUlkPzogbnVtYmVyO1xuICB9XG4gIGV4cG9ydCBpbnRlcmZhY2UgRG1sRXhlY3V0aW9uUHJvdmlkZXJPcHRpb24gZXh0ZW5kcyBFeGVjdXRpb25Qcm92aWRlck9wdGlvbiB7XG4gICAgcmVhZG9ubHkgbmFtZTogJ2RtbCc7XG4gICAgZGV2aWNlSWQ/OiBudW1iZXI7XG4gIH1cbiAgZXhwb3J0IGludGVyZmFjZSBUZW5zb3JSdEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uIGV4dGVuZHMgRXhlY3V0aW9uUHJvdmlkZXJPcHRpb24ge1xuICAgIHJlYWRvbmx5IG5hbWU6ICd0ZW5zb3JydCc7XG4gICAgZGV2aWNlSWQ/OiBudW1iZXI7XG4gIH1cbiAgZXhwb3J0IGludGVyZmFjZSBXZWJBc3NlbWJseUV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uIGV4dGVuZHMgRXhlY3V0aW9uUHJvdmlkZXJPcHRpb24ge1xuICAgIHJlYWRvbmx5IG5hbWU6ICd3YXNtJztcbiAgfVxuICBleHBvcnQgaW50ZXJmYWNlIFdlYkdMRXhlY3V0aW9uUHJvdmlkZXJPcHRpb24gZXh0ZW5kcyBFeGVjdXRpb25Qcm92aWRlck9wdGlvbiB7XG4gICAgcmVhZG9ubHkgbmFtZTogJ3dlYmdsJztcbiAgICAvLyBUT0RPOiBhZGQgZmxhZ3NcbiAgfVxuICBleHBvcnQgaW50ZXJmYWNlIFhubnBhY2tFeGVjdXRpb25Qcm92aWRlck9wdGlvbiBleHRlbmRzIEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uIHtcbiAgICByZWFkb25seSBuYW1lOiAneG5ucGFjayc7XG4gIH1cbiAgZXhwb3J0IGludGVyZmFjZSBXZWJHcHVFeGVjdXRpb25Qcm92aWRlck9wdGlvbiBleHRlbmRzIEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uIHtcbiAgICByZWFkb25seSBuYW1lOiAnd2ViZ3B1JztcbiAgICBwcmVmZXJyZWRMYXlvdXQ/OiAnTkNIVyd8J05IV0MnO1xuICB9XG4gIGV4cG9ydCBpbnRlcmZhY2UgV2ViTk5FeGVjdXRpb25Qcm92aWRlck9wdGlvbiBleHRlbmRzIEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uIHtcbiAgICByZWFkb25seSBuYW1lOiAnd2Vibm4nO1xuICAgIGRldmljZVR5cGU/OiAnY3B1J3wnZ3B1J3wnbnB1JztcbiAgICBudW1UaHJlYWRzPzogbnVtYmVyO1xuICAgIHBvd2VyUHJlZmVyZW5jZT86ICdkZWZhdWx0J3wnbG93LXBvd2VyJ3wnaGlnaC1wZXJmb3JtYW5jZSc7XG4gIH1cbiAgZXhwb3J0IGludGVyZmFjZSBDb3JlTUxFeGVjdXRpb25Qcm92aWRlck9wdGlvbiBleHRlbmRzIEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uIHtcbiAgICByZWFkb25seSBuYW1lOiAnY29yZW1sJztcbiAgICAvKipcbiAgICAgKiBUaGUgYml0IGZsYWdzIGZvciBDb3JlTUwgZXhlY3V0aW9uIHByb3ZpZGVyLlxuICAgICAqXG4gICAgICogYGBgXG4gICAgICogQ09SRU1MX0ZMQUdfVVNFX0NQVV9PTkxZID0gMHgwMDFcbiAgICAgKiBDT1JFTUxfRkxBR19FTkFCTEVfT05fU1VCR1JBUEggPSAweDAwMlxuICAgICAqIENPUkVNTF9GTEFHX09OTFlfRU5BQkxFX0RFVklDRV9XSVRIX0FORSA9IDB4MDA0XG4gICAgICogQ09SRU1MX0ZMQUdfT05MWV9BTExPV19TVEFUSUNfSU5QVVRfU0hBUEVTID0gMHgwMDhcbiAgICAgKiBDT1JFTUxfRkxBR19DUkVBVEVfTUxQUk9HUkFNID0gMHgwMTBcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIFNlZSBpbmNsdWRlL29ubnhydW50aW1lL2NvcmUvcHJvdmlkZXJzL2NvcmVtbC9jb3JlbWxfcHJvdmlkZXJfZmFjdG9yeS5oIGZvciBtb3JlIGRldGFpbHMuXG4gICAgICpcbiAgICAgKiBUaGlzIGZsYWcgaXMgYXZhaWxhYmxlIG9ubHkgaW4gT05OWFJ1bnRpbWUgKE5vZGUuanMgYmluZGluZykuXG4gICAgICovXG4gICAgY29yZU1sRmxhZ3M/OiBudW1iZXI7XG4gICAgLyoqXG4gICAgICogU3BlY2lmeSB3aGV0aGVyIHRvIHVzZSBDUFUgb25seSBpbiBDb3JlTUwgRVAuXG4gICAgICpcbiAgICAgKiBUaGlzIHNldHRpbmcgaXMgYXZhaWxhYmxlIG9ubHkgaW4gT05OWFJ1bnRpbWUgKHJlYWN0LW5hdGl2ZSkuXG4gICAgICovXG4gICAgdXNlQ1BVT25seT86IGJvb2xlYW47XG4gICAgLyoqXG4gICAgICogU3BlY2lmeSB3aGV0aGVyIHRvIGVuYWJsZSBDb3JlTUwgRVAgb24gc3ViZ3JhcGguXG4gICAgICpcbiAgICAgKiBUaGlzIHNldHRpbmcgaXMgYXZhaWxhYmxlIG9ubHkgaW4gT05OWFJ1bnRpbWUgKHJlYWN0LW5hdGl2ZSkuXG4gICAgICovXG4gICAgZW5hYmxlT25TdWJncmFwaD86IGJvb2xlYW47XG4gICAgLyoqXG4gICAgICogU3BlY2lmeSB3aGV0aGVyIHRvIG9ubHkgZW5hYmxlIENvcmVNTCBFUCBmb3IgQXBwbGUgZGV2aWNlcyB3aXRoIEFORSAoQXBwbGUgTmV1cmFsIEVuZ2luZSkuXG4gICAgICpcbiAgICAgKiBUaGlzIHNldHRpbmcgaXMgYXZhaWxhYmxlIG9ubHkgaW4gT05OWFJ1bnRpbWUgKHJlYWN0LW5hdGl2ZSkuXG4gICAgICovXG4gICAgb25seUVuYWJsZURldmljZVdpdGhBTkU/OiBib29sZWFuO1xuICB9XG4gIGV4cG9ydCBpbnRlcmZhY2UgTm5hcGlFeGVjdXRpb25Qcm92aWRlck9wdGlvbiBleHRlbmRzIEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uIHtcbiAgICByZWFkb25seSBuYW1lOiAnbm5hcGknO1xuICAgIHVzZUZQMTY/OiBib29sZWFuO1xuICAgIHVzZU5DSFc/OiBib29sZWFuO1xuICAgIGNwdURpc2FibGVkPzogYm9vbGVhbjtcbiAgICBjcHVPbmx5PzogYm9vbGVhbjtcbiAgfVxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gcnVuIG9wdGlvbnNcblxuICAvKipcbiAgICogQSBzZXQgb2YgY29uZmlndXJhdGlvbnMgZm9yIGluZmVyZW5jZSBydW4gYmVoYXZpb3JcbiAgICovXG4gIGV4cG9ydCBpbnRlcmZhY2UgUnVuT3B0aW9ucyB7XG4gICAgLyoqXG4gICAgICogTG9nIHNldmVyaXR5IGxldmVsLiBTZWVcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L29ubnhydW50aW1lL2Jsb2IvbWFpbi9pbmNsdWRlL29ubnhydW50aW1lL2NvcmUvY29tbW9uL2xvZ2dpbmcvc2V2ZXJpdHkuaFxuICAgICAqXG4gICAgICogVGhpcyBzZXR0aW5nIGlzIGF2YWlsYWJsZSBvbmx5IGluIE9OTlhSdW50aW1lIChOb2RlLmpzIGJpbmRpbmcgYW5kIHJlYWN0LW5hdGl2ZSkgb3IgV2ViQXNzZW1ibHkgYmFja2VuZFxuICAgICAqL1xuICAgIGxvZ1NldmVyaXR5TGV2ZWw/OiAwfDF8MnwzfDQ7XG5cbiAgICAvKipcbiAgICAgKiBMb2cgdmVyYm9zaXR5IGxldmVsLlxuICAgICAqXG4gICAgICogVGhpcyBzZXR0aW5nIGlzIGF2YWlsYWJsZSBvbmx5IGluIFdlYkFzc2VtYmx5IGJhY2tlbmQuIFdpbGwgc3VwcG9ydCBOb2RlLmpzIGJpbmRpbmcgYW5kIHJlYWN0LW5hdGl2ZSBsYXRlclxuICAgICAqL1xuICAgIGxvZ1ZlcmJvc2l0eUxldmVsPzogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGVybWluYXRlIGFsbCBpbmNvbXBsZXRlIE9ydFJ1biBjYWxscyBhcyBzb29uIGFzIHBvc3NpYmxlIGlmIHRydWVcbiAgICAgKlxuICAgICAqIFRoaXMgc2V0dGluZyBpcyBhdmFpbGFibGUgb25seSBpbiBXZWJBc3NlbWJseSBiYWNrZW5kLiBXaWxsIHN1cHBvcnQgTm9kZS5qcyBiaW5kaW5nIGFuZCByZWFjdC1uYXRpdmUgbGF0ZXJcbiAgICAgKi9cbiAgICB0ZXJtaW5hdGU/OiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogQSB0YWcgZm9yIHRoZSBSdW4oKSBjYWxscyB1c2luZyB0aGlzXG4gICAgICpcbiAgICAgKiBUaGlzIHNldHRpbmcgaXMgYXZhaWxhYmxlIG9ubHkgaW4gT05OWFJ1bnRpbWUgKE5vZGUuanMgYmluZGluZyBhbmQgcmVhY3QtbmF0aXZlKSBvciBXZWJBc3NlbWJseSBiYWNrZW5kXG4gICAgICovXG4gICAgdGFnPzogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogU2V0IGEgc2luZ2xlIHJ1biBjb25maWd1cmF0aW9uIGVudHJ5LiBTZWVcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L29ubnhydW50aW1lL2Jsb2IvbWFpbi9pbmNsdWRlL29ubnhydW50aW1lL2NvcmUvc2Vzc2lvbi9cbiAgICAgKiBvbm54cnVudGltZV9ydW5fb3B0aW9uc19jb25maWdfa2V5cy5oXG4gICAgICpcbiAgICAgKiBUaGlzIHNldHRpbmcgaXMgYXZhaWxhYmxlIG9ubHkgaW4gV2ViQXNzZW1ibHkgYmFja2VuZC4gV2lsbCBzdXBwb3J0IE5vZGUuanMgYmluZGluZyBhbmQgcmVhY3QtbmF0aXZlIGxhdGVyXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogYGBganNcbiAgICAgKiBleHRyYToge1xuICAgICAqICAgbWVtb3J5OiB7XG4gICAgICogICAgIGVuYWJsZV9tZW1vcnlfYXJlbmFfc2hyaW5rYWdlOiBcIjFcIixcbiAgICAgKiAgIH1cbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICovXG4gICAgZXh0cmE/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgfVxuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIHZhbHVlIG1ldGFkYXRhXG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1lbXB0eS1pbnRlcmZhY2VcbiAgaW50ZXJmYWNlIFZhbHVlTWV0YWRhdGEge1xuICAgIC8vIFRCRFxuICB9XG5cbiAgLy8gI2VuZHJlZ2lvblxufVxuXG4vKipcbiAqIFJlcHJlc2VudCBhIHJ1bnRpbWUgaW5zdGFuY2Ugb2YgYW4gT05OWCBtb2RlbC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbmZlcmVuY2VTZXNzaW9uIHtcbiAgLy8gI3JlZ2lvbiBydW4oKVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIHRoZSBtb2RlbCBhc3luY2hyb25vdXNseSB3aXRoIHRoZSBnaXZlbiBmZWVkcyBhbmQgb3B0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIGZlZWRzIC0gUmVwcmVzZW50YXRpb24gb2YgdGhlIG1vZGVsIGlucHV0LiBTZWUgdHlwZSBkZXNjcmlwdGlvbiBvZiBgSW5mZXJlbmNlU2Vzc2lvbi5JbnB1dFR5cGVgIGZvciBkZXRhaWwuXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gT3B0aW9uYWwuIEEgc2V0IG9mIG9wdGlvbnMgdGhhdCBjb250cm9scyB0aGUgYmVoYXZpb3Igb2YgbW9kZWwgaW5mZXJlbmNlLlxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIG1hcCwgd2hpY2ggdXNlcyBvdXRwdXQgbmFtZXMgYXMga2V5cyBhbmQgT25ueFZhbHVlIGFzIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICAgKi9cbiAgcnVuKGZlZWRzOiBJbmZlcmVuY2VTZXNzaW9uLkZlZWRzVHlwZSwgb3B0aW9ucz86IEluZmVyZW5jZVNlc3Npb24uUnVuT3B0aW9ucyk6IFByb21pc2U8SW5mZXJlbmNlU2Vzc2lvbi5SZXR1cm5UeXBlPjtcblxuICAvKipcbiAgICogRXhlY3V0ZSB0aGUgbW9kZWwgYXN5bmNocm9ub3VzbHkgd2l0aCB0aGUgZ2l2ZW4gZmVlZHMsIGZldGNoZXMgYW5kIG9wdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSBmZWVkcyAtIFJlcHJlc2VudGF0aW9uIG9mIHRoZSBtb2RlbCBpbnB1dC4gU2VlIHR5cGUgZGVzY3JpcHRpb24gb2YgYEluZmVyZW5jZVNlc3Npb24uSW5wdXRUeXBlYCBmb3IgZGV0YWlsLlxuICAgKiBAcGFyYW0gZmV0Y2hlcyAtIFJlcHJlc2VudGF0aW9uIG9mIHRoZSBtb2RlbCBvdXRwdXQuIFNlZSB0eXBlIGRlc2NyaXB0aW9uIG9mIGBJbmZlcmVuY2VTZXNzaW9uLk91dHB1dFR5cGVgIGZvclxuICAgKiBkZXRhaWwuXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gT3B0aW9uYWwuIEEgc2V0IG9mIG9wdGlvbnMgdGhhdCBjb250cm9scyB0aGUgYmVoYXZpb3Igb2YgbW9kZWwgaW5mZXJlbmNlLlxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIG1hcCwgd2hpY2ggdXNlcyBvdXRwdXQgbmFtZXMgYXMga2V5cyBhbmQgT25ueFZhbHVlIGFzIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICAgKi9cbiAgcnVuKGZlZWRzOiBJbmZlcmVuY2VTZXNzaW9uLkZlZWRzVHlwZSwgZmV0Y2hlczogSW5mZXJlbmNlU2Vzc2lvbi5GZXRjaGVzVHlwZSxcbiAgICAgIG9wdGlvbnM/OiBJbmZlcmVuY2VTZXNzaW9uLlJ1bk9wdGlvbnMpOiBQcm9taXNlPEluZmVyZW5jZVNlc3Npb24uUmV0dXJuVHlwZT47XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gcmVsZWFzZSgpXG5cbiAgLyoqXG4gICAqIFJlbGVhc2UgdGhlIGluZmVyZW5jZSBzZXNzaW9uIGFuZCB0aGUgdW5kZXJseWluZyByZXNvdXJjZXMuXG4gICAqL1xuICByZWxlYXNlKCk6IFByb21pc2U8dm9pZD47XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gcHJvZmlsaW5nXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHByb2ZpbGluZy5cbiAgICovXG4gIHN0YXJ0UHJvZmlsaW5nKCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEVuZCBwcm9maWxpbmcuXG4gICAqL1xuICBlbmRQcm9maWxpbmcoKTogdm9pZDtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBtZXRhZGF0YVxuXG4gIC8qKlxuICAgKiBHZXQgaW5wdXQgbmFtZXMgb2YgdGhlIGxvYWRlZCBtb2RlbC5cbiAgICovXG4gIHJlYWRvbmx5IGlucHV0TmFtZXM6IHJlYWRvbmx5IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBHZXQgb3V0cHV0IG5hbWVzIG9mIHRoZSBsb2FkZWQgbW9kZWwuXG4gICAqL1xuICByZWFkb25seSBvdXRwdXROYW1lczogcmVhZG9ubHkgc3RyaW5nW107XG5cbiAgLy8gLyoqXG4gIC8vICAqIEdldCBpbnB1dCBtZXRhZGF0YSBvZiB0aGUgbG9hZGVkIG1vZGVsLlxuICAvLyAgKi9cbiAgLy8gcmVhZG9ubHkgaW5wdXRNZXRhZGF0YTogUmVhZG9ubHlBcnJheTxSZWFkb25seTxJbmZlcmVuY2VTZXNzaW9uLlZhbHVlTWV0YWRhdGE+PjtcblxuICAvLyAvKipcbiAgLy8gICogR2V0IG91dHB1dCBtZXRhZGF0YSBvZiB0aGUgbG9hZGVkIG1vZGVsLlxuICAvLyAgKi9cbiAgLy8gcmVhZG9ubHkgb3V0cHV0TWV0YWRhdGE6IFJlYWRvbmx5QXJyYXk8UmVhZG9ubHk8SW5mZXJlbmNlU2Vzc2lvbi5WYWx1ZU1ldGFkYXRhPj47XG5cbiAgLy8gI2VuZHJlZ2lvblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEluZmVyZW5jZVNlc3Npb25GYWN0b3J5IHtcbiAgLy8gI3JlZ2lvbiBjcmVhdGUoKVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgaW5mZXJlbmNlIHNlc3Npb24gYW5kIGxvYWQgbW9kZWwgYXN5bmNocm9ub3VzbHkgZnJvbSBhbiBPTk5YIG1vZGVsIGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSB1cmkgLSBUaGUgVVJJIG9yIGZpbGUgcGF0aCBvZiB0aGUgbW9kZWwgdG8gbG9hZC5cbiAgICogQHBhcmFtIG9wdGlvbnMgLSBzcGVjaWZ5IGNvbmZpZ3VyYXRpb24gZm9yIGNyZWF0aW5nIGEgbmV3IGluZmVyZW5jZSBzZXNzaW9uLlxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBJbmZlcmVuY2VTZXNzaW9uIG9iamVjdC5cbiAgICovXG4gIGNyZWF0ZSh1cmk6IHN0cmluZywgb3B0aW9ucz86IEluZmVyZW5jZVNlc3Npb24uU2Vzc2lvbk9wdGlvbnMpOiBQcm9taXNlPEluZmVyZW5jZVNlc3Npb24+O1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgaW5mZXJlbmNlIHNlc3Npb24gYW5kIGxvYWQgbW9kZWwgYXN5bmNocm9ub3VzbHkgZnJvbSBhbiBhcnJheSBidWZlci5cbiAgICpcbiAgICogQHBhcmFtIGJ1ZmZlciAtIEFuIEFycmF5QnVmZmVyIHJlcHJlc2VudGF0aW9uIG9mIGFuIE9OTlggbW9kZWwuXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gc3BlY2lmeSBjb25maWd1cmF0aW9uIGZvciBjcmVhdGluZyBhIG5ldyBpbmZlcmVuY2Ugc2Vzc2lvbi5cbiAgICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW4gSW5mZXJlbmNlU2Vzc2lvbiBvYmplY3QuXG4gICAqL1xuICBjcmVhdGUoYnVmZmVyOiBBcnJheUJ1ZmZlckxpa2UsIG9wdGlvbnM/OiBJbmZlcmVuY2VTZXNzaW9uLlNlc3Npb25PcHRpb25zKTogUHJvbWlzZTxJbmZlcmVuY2VTZXNzaW9uPjtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGluZmVyZW5jZSBzZXNzaW9uIGFuZCBsb2FkIG1vZGVsIGFzeW5jaHJvbm91c2x5IGZyb20gc2VnbWVudCBvZiBhbiBhcnJheSBidWZlci5cbiAgICpcbiAgICogQHBhcmFtIGJ1ZmZlciAtIEFuIEFycmF5QnVmZmVyIHJlcHJlc2VudGF0aW9uIG9mIGFuIE9OTlggbW9kZWwuXG4gICAqIEBwYXJhbSBieXRlT2Zmc2V0IC0gVGhlIGJlZ2lubmluZyBvZiB0aGUgc3BlY2lmaWVkIHBvcnRpb24gb2YgdGhlIGFycmF5IGJ1ZmZlci5cbiAgICogQHBhcmFtIGJ5dGVMZW5ndGggLSBUaGUgbGVuZ3RoIGluIGJ5dGVzIG9mIHRoZSBhcnJheSBidWZmZXIuXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gc3BlY2lmeSBjb25maWd1cmF0aW9uIGZvciBjcmVhdGluZyBhIG5ldyBpbmZlcmVuY2Ugc2Vzc2lvbi5cbiAgICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW4gSW5mZXJlbmNlU2Vzc2lvbiBvYmplY3QuXG4gICAqL1xuICBjcmVhdGUoYnVmZmVyOiBBcnJheUJ1ZmZlckxpa2UsIGJ5dGVPZmZzZXQ6IG51bWJlciwgYnl0ZUxlbmd0aD86IG51bWJlciwgb3B0aW9ucz86IEluZmVyZW5jZVNlc3Npb24uU2Vzc2lvbk9wdGlvbnMpOlxuICAgICAgUHJvbWlzZTxJbmZlcmVuY2VTZXNzaW9uPjtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGluZmVyZW5jZSBzZXNzaW9uIGFuZCBsb2FkIG1vZGVsIGFzeW5jaHJvbm91c2x5IGZyb20gYSBVaW50OEFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0gYnVmZmVyIC0gQSBVaW50OEFycmF5IHJlcHJlc2VudGF0aW9uIG9mIGFuIE9OTlggbW9kZWwuXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gc3BlY2lmeSBjb25maWd1cmF0aW9uIGZvciBjcmVhdGluZyBhIG5ldyBpbmZlcmVuY2Ugc2Vzc2lvbi5cbiAgICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW4gSW5mZXJlbmNlU2Vzc2lvbiBvYmplY3QuXG4gICAqL1xuICBjcmVhdGUoYnVmZmVyOiBVaW50OEFycmF5LCBvcHRpb25zPzogSW5mZXJlbmNlU2Vzc2lvbi5TZXNzaW9uT3B0aW9ucyk6IFByb21pc2U8SW5mZXJlbmNlU2Vzc2lvbj47XG5cbiAgLy8gI2VuZHJlZ2lvblxufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uXG5leHBvcnQgY29uc3QgSW5mZXJlbmNlU2Vzc2lvbjogSW5mZXJlbmNlU2Vzc2lvbkZhY3RvcnkgPSBJbmZlcmVuY2VTZXNzaW9uSW1wbDtcbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuaW1wb3J0IHtPcHRpb25zRm9ybWF0LCBPcHRpb25zTm9ybWFsaXphdGlvblBhcmFtZXRlcnMsIE9wdGlvbnNUZW5zb3JMYXlvdXR9IGZyb20gJy4vdGVuc29yLWZhY3RvcnkuanMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRlbnNvclRvRGF0YVVybE9wdGlvbnMgZXh0ZW5kcyBPcHRpb25zVGVuc29yTGF5b3V0LCBPcHRpb25zRm9ybWF0LCBPcHRpb25zTm9ybWFsaXphdGlvblBhcmFtZXRlcnMge31cblxuZXhwb3J0IGludGVyZmFjZSBUZW5zb3JUb0ltYWdlRGF0YU9wdGlvbnMgZXh0ZW5kcyBPcHRpb25zVGVuc29yTGF5b3V0LCBPcHRpb25zRm9ybWF0LCBPcHRpb25zTm9ybWFsaXphdGlvblBhcmFtZXRlcnMge31cblxuZXhwb3J0IGludGVyZmFjZSBDb252ZXJzaW9uVXRpbHMge1xuICAvKipcbiAgICogY3JlYXRlcyBhIERhdGFVUkwgaW5zdGFuY2UgZnJvbSB0ZW5zb3JcbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgLSBBbiBvcHRpb25hbCBvYmplY3QgcmVwcmVzZW50aW5nIG9wdGlvbnMgZm9yIGNyZWF0aW5nIGEgRGF0YVVSTCBpbnN0YW5jZSBmcm9tIHRoZSB0ZW5zb3IuXG4gICAqXG4gICAqIFRoZSBmb2xsb3dpbmcgZGVmYXVsdCBzZXR0aW5ncyB3aWxsIGJlIGFwcGxpZWQ6XG4gICAqIC0gYGZvcm1hdGA6IGAnUkdCJ2BcbiAgICogLSBgdGVuc29yTGF5b3V0YDogYCdOQ0hXJ2BcbiAgICogQHJldHVybnMgYSBEYXRhVVJMIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGltYWdlIGNvbnZlcnRlZCBmcm9tIHRlbnNvciBkYXRhXG4gICAqL1xuICB0b0RhdGFVUkwob3B0aW9ucz86IFRlbnNvclRvRGF0YVVybE9wdGlvbnMpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGNyZWF0ZXMgYW4gSW1hZ2VEYXRhIGluc3RhbmNlIGZyb20gdGVuc29yXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gQW4gb3B0aW9uYWwgb2JqZWN0IHJlcHJlc2VudGluZyBvcHRpb25zIGZvciBjcmVhdGluZyBhbiBJbWFnZURhdGEgaW5zdGFuY2UgZnJvbSB0aGUgdGVuc29yLlxuICAgKlxuICAgKiBUaGUgZm9sbG93aW5nIGRlZmF1bHQgc2V0dGluZ3Mgd2lsbCBiZSBhcHBsaWVkOlxuICAgKiAtIGBmb3JtYXRgOiBgJ1JHQidgXG4gICAqIC0gYHRlbnNvckxheW91dGA6IGAnTkNIVydgXG4gICAqIEByZXR1cm5zIGFuIEltYWdlRGF0YSBpbnN0YW5jZSByZXByZXNlbnRpbmcgdGhlIGltYWdlIGNvbnZlcnRlZCBmcm9tIHRlbnNvciBkYXRhXG4gICAqL1xuICB0b0ltYWdlRGF0YShvcHRpb25zPzogVGVuc29yVG9JbWFnZURhdGFPcHRpb25zKTogSW1hZ2VEYXRhO1xufVxuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQge1RlbnNvciwgVHlwZWRUZW5zb3J9IGZyb20gJy4vdGVuc29yLmpzJztcblxuZXhwb3J0IHR5cGUgSW1hZ2VGb3JtYXQgPSAnUkdCJ3wnUkdCQSd8J0JHUid8J1JCRyc7XG5leHBvcnQgdHlwZSBJbWFnZVRlbnNvckxheW91dCA9ICdOSFdDJ3wnTkNIVyc7XG5cbi8vIHRoZSBmb2xsb3dpbmcgcmVnaW9uIGNvbnRhaW5zIHR5cGUgZGVmaW5pdGlvbnMgZm9yIGNvbnN0cnVjdGluZyB0ZW5zb3IgZnJvbSBhIHNwZWNpZmljIGxvY2F0aW9uLlxuXG4vLyAjcmVnaW9uIHR5cGVzIGZvciBjb25zdHJ1Y3RpbmcgYSB0ZW5zb3IgZnJvbSBhIHNwZWNpZmljIGxvY2F0aW9uXG5cbi8qKlxuICogcmVwcmVzZW50IGNvbW1vbiBwcm9wZXJ0aWVzIG9mIHRoZSBwYXJhbWV0ZXIgZm9yIGNvbnN0cnVjdGluZyBhIHRlbnNvciBmcm9tIGEgc3BlY2lmaWMgbG9jYXRpb24uXG4gKi9cbmludGVyZmFjZSBDb21tb25Db25zdHJ1Y3RvclBhcmFtZXRlcnM8VD4gZXh0ZW5kcyBQaWNrPFRlbnNvciwgJ2RpbXMnPiB7XG4gIC8qKlxuICAgKiBTcGVjaWZ5IHRoZSBkYXRhIHR5cGUgb2YgdGhlIHRlbnNvci5cbiAgICovXG4gIHJlYWRvbmx5IHR5cGU6IFQ7XG59XG5cbi8qKlxuICogcmVwcmVzZW50IHRoZSBwYXJhbWV0ZXIgZm9yIGNvbnN0cnVjdGluZyBhIHRlbnNvciBmcm9tIGEgR1BVIHJlc291cmNlLlxuICovXG5pbnRlcmZhY2UgR3B1UmVzb3VyY2VDb25zdHJ1Y3RvclBhcmFtZXRlcnM8VCBleHRlbmRzIFRlbnNvci5UeXBlPiB7XG4gIC8qKlxuICAgKiBhbiBvcHRpb25hbCBjYWxsYmFjayBmdW5jdGlvbiB0byBkb3dubG9hZCBkYXRhIGZyb20gR1BVIHRvIENQVS5cbiAgICpcbiAgICogSWYgbm90IHByb3ZpZGVkLCB0aGUgdGVuc29yIHRyZWF0IHRoZSBHUFUgZGF0YSBhcyBleHRlcm5hbCByZXNvdXJjZS5cbiAgICovXG4gIGRvd25sb2FkPygpOiBQcm9taXNlPFRlbnNvci5EYXRhVHlwZU1hcFtUXT47XG5cbiAgLyoqXG4gICAqIGFuIG9wdGlvbmFsIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgdGVuc29yIGlzIGRpc3Bvc2VkLlxuICAgKlxuICAgKiBJZiBub3QgcHJvdmlkZWQsIHRoZSB0ZW5zb3IgdHJlYXQgdGhlIEdQVSBkYXRhIGFzIGV4dGVybmFsIHJlc291cmNlLlxuICAgKi9cbiAgZGlzcG9zZT8oKTogdm9pZDtcbn1cblxuLyoqXG4gKiByZXByZXNlbnQgdGhlIHBhcmFtZXRlciBmb3IgY29uc3RydWN0aW5nIGEgdGVuc29yIGZyb20gYSBwaW5uZWQgQ1BVIGJ1ZmZlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIENwdVBpbm5lZENvbnN0cnVjdG9yUGFyYW1ldGVyczxUIGV4dGVuZHMgVGVuc29yLkNwdVBpbm5lZERhdGFUeXBlcyA9IFRlbnNvci5DcHVQaW5uZWREYXRhVHlwZXM+IGV4dGVuZHNcbiAgICBDb21tb25Db25zdHJ1Y3RvclBhcmFtZXRlcnM8VD4ge1xuICAvKipcbiAgICogU3BlY2lmeSB0aGUgbG9jYXRpb24gb2YgdGhlIGRhdGEgdG8gYmUgJ2NwdS1waW5uZWQnLlxuICAgKi9cbiAgcmVhZG9ubHkgbG9jYXRpb246ICdjcHUtcGlubmVkJztcbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIENQVSBwaW5uZWQgYnVmZmVyIHRoYXQgaG9sZHMgdGhlIHRlbnNvciBkYXRhLlxuICAgKi9cbiAgcmVhZG9ubHkgZGF0YTogVGVuc29yLkRhdGFUeXBlTWFwW1RdO1xufVxuXG4vKipcbiAqIHJlcHJlc2VudCB0aGUgcGFyYW1ldGVyIGZvciBjb25zdHJ1Y3RpbmcgYSB0ZW5zb3IgZnJvbSBhIFdlYkdMIHRleHR1cmVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUZXh0dXJlQ29uc3RydWN0b3JQYXJhbWV0ZXJzPFQgZXh0ZW5kcyBUZW5zb3IuVGV4dHVyZURhdGFUeXBlcyA9IFRlbnNvci5UZXh0dXJlRGF0YVR5cGVzPiBleHRlbmRzXG4gICAgQ29tbW9uQ29uc3RydWN0b3JQYXJhbWV0ZXJzPFQ+LCBHcHVSZXNvdXJjZUNvbnN0cnVjdG9yUGFyYW1ldGVyczxUPiB7XG4gIC8qKlxuICAgKiBTcGVjaWZ5IHRoZSBsb2NhdGlvbiBvZiB0aGUgZGF0YSB0byBiZSAndGV4dHVyZScuXG4gICAqL1xuICByZWFkb25seSBsb2NhdGlvbjogJ3RleHR1cmUnO1xuICAvKipcbiAgICogU3BlY2lmeSB0aGUgV2ViR0wgdGV4dHVyZSB0aGF0IGhvbGRzIHRoZSB0ZW5zb3IgZGF0YS5cbiAgICovXG4gIHJlYWRvbmx5IHRleHR1cmU6IFRlbnNvci5UZXh0dXJlVHlwZTtcbn1cblxuLyoqXG4gKiByZXByZXNlbnQgdGhlIHBhcmFtZXRlciBmb3IgY29uc3RydWN0aW5nIGEgdGVuc29yIGZyb20gYSBXZWJHUFUgYnVmZmVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgR3B1QnVmZmVyQ29uc3RydWN0b3JQYXJhbWV0ZXJzPFQgZXh0ZW5kcyBUZW5zb3IuR3B1QnVmZmVyRGF0YVR5cGVzID0gVGVuc29yLkdwdUJ1ZmZlckRhdGFUeXBlcz4gZXh0ZW5kc1xuICAgIENvbW1vbkNvbnN0cnVjdG9yUGFyYW1ldGVyczxUPiwgR3B1UmVzb3VyY2VDb25zdHJ1Y3RvclBhcmFtZXRlcnM8VD4ge1xuICAvKipcbiAgICogU3BlY2lmeSB0aGUgbG9jYXRpb24gb2YgdGhlIGRhdGEgdG8gYmUgJ2dwdS1idWZmZXInLlxuICAgKi9cbiAgcmVhZG9ubHkgbG9jYXRpb246ICdncHUtYnVmZmVyJztcbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIFdlYkdQVSBidWZmZXIgdGhhdCBob2xkcyB0aGUgdGVuc29yIGRhdGEuXG4gICAqL1xuICByZWFkb25seSBncHVCdWZmZXI6IFRlbnNvci5HcHVCdWZmZXJUeXBlO1xufVxuXG4vLyAjZW5kcmVnaW9uXG5cbi8vIHRoZSBmb2xsb3dpbmcgcmVnaW9uIGNvbnRhaW5zIHR5cGUgZGVmaW5pdGlvbnMgb2YgZWFjaCBpbmRpdmlkdWFsIG9wdGlvbnMuXG4vLyB0aGUgdGVuc29yIGZhY3RvcnkgZnVuY3Rpb25zIHVzZSBhIGNvbXBvc2l0aW9uIG9mIHRob3NlIG9wdGlvbnMgYXMgdGhlIHBhcmFtZXRlciB0eXBlLlxuXG4vLyAjcmVnaW9uIE9wdGlvbnMgZmllbGRzXG5cbmV4cG9ydCBpbnRlcmZhY2UgT3B0aW9uc0Zvcm1hdCB7XG4gIC8qKlxuICAgKiBEZXNjcmliZXMgdGhlIGltYWdlIGZvcm1hdCByZXByZXNlbnRlZCBpbiBSR0JBIGNvbG9yIHNwYWNlLlxuICAgKi9cbiAgZm9ybWF0PzogSW1hZ2VGb3JtYXQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3B0aW9uc1RlbnNvckZvcm1hdCB7XG4gIC8qKlxuICAgKiBEZXNjcmliZXMgdGhlIGltYWdlIGZvcm1hdCBvZiB0aGUgdGVuc29yLlxuICAgKlxuICAgKiBOT1RFOiB0aGlzIGlzIGRpZmZlcmVudCBmcm9tIG9wdGlvbiAnZm9ybWF0Jy4gV2hpbGUgb3B0aW9uICdmb3JtYXQnIHJlcHJlc2VudHMgdGhlIG9yaWdpbmFsIGltYWdlLCAndGVuc29yRm9ybWF0J1xuICAgKiByZXByZXNlbnRzIHRoZSB0YXJnZXQgZm9ybWF0IG9mIHRoZSB0ZW5zb3IuIEEgdHJhbnNwb3NlIHdpbGwgYmUgcGVyZm9ybWVkIGlmIHRoZXkgYXJlIGRpZmZlcmVudC5cbiAgICovXG4gIHRlbnNvckZvcm1hdD86IEltYWdlRm9ybWF0O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9wdGlvbnNUZW5zb3JEYXRhVHlwZSB7XG4gIC8qKlxuICAgKiBEZXNjcmliZXMgdGhlIGRhdGEgdHlwZSBvZiB0aGUgdGVuc29yLlxuICAgKi9cbiAgZGF0YVR5cGU/OiAnZmxvYXQzMid8J3VpbnQ4Jztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPcHRpb25zVGVuc29yTGF5b3V0IHtcbiAgLyoqXG4gICAqIERlc2NyaWJlcyB0aGUgdGVuc29yIGxheW91dCB3aGVuIHJlcHJlc2VudGluZyBkYXRhIG9mIG9uZSBvciBtb3JlIGltYWdlKHMpLlxuICAgKi9cbiAgdGVuc29yTGF5b3V0PzogSW1hZ2VUZW5zb3JMYXlvdXQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3B0aW9uc0RpbWVuc2lvbnMge1xuICAvKipcbiAgICogRGVzY3JpYmVzIHRoZSBpbWFnZSBoZWlnaHQgaW4gcGl4ZWxcbiAgICovXG4gIGhlaWdodD86IG51bWJlcjtcbiAgLyoqXG4gICAqIERlc2NyaWJlcyB0aGUgaW1hZ2Ugd2lkdGggaW4gcGl4ZWxcbiAgICovXG4gIHdpZHRoPzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9wdGlvblJlc2l6ZWREaW1lbnNpb25zIHtcbiAgLyoqXG4gICAqIERlc2NyaWJlcyB0aGUgcmVzaXplZCBoZWlnaHQuIElmIG9taXR0ZWQsIG9yaWdpbmFsIGhlaWdodCB3aWxsIGJlIHVzZWQuXG4gICAqL1xuICByZXNpemVkSGVpZ2h0PzogbnVtYmVyO1xuICAvKipcbiAgICogRGVzY3JpYmVzIHJlc2l6ZWQgd2lkdGggLSBjYW4gYmUgYWNjZXNzZWQgdmlhIHRlbnNvciBkaW1lbnNpb25zIGFzIHdlbGxcbiAgICovXG4gIHJlc2l6ZWRXaWR0aD86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPcHRpb25zTm9ybWFsaXphdGlvblBhcmFtZXRlcnMge1xuICAvKipcbiAgICogRGVzY3JpYmVzIG5vcm1hbGl6YXRpb24gcGFyYW1ldGVycyB3aGVuIHByZXByb2Nlc3NpbmcgdGhlIGltYWdlIGFzIG1vZGVsIGlucHV0LlxuICAgKlxuICAgKiBEYXRhIGVsZW1lbnQgYXJlIHJhbmdlZCBmcm9tIDAgdG8gMjU1LlxuICAgKi9cbiAgbm9ybT86IHtcbiAgICAvKipcbiAgICAgKiBUaGUgJ2JpYXMnIHZhbHVlIGZvciBpbWFnZSBub3JtYWxpemF0aW9uLlxuICAgICAqIC0gSWYgb21pdHRlZCwgdXNlIGRlZmF1bHQgdmFsdWUgMC5cbiAgICAgKiAtIElmIGl0J3MgYSBzaW5nbGUgbnVtYmVyLCBhcHBseSB0byBlYWNoIGNoYW5uZWxcbiAgICAgKiAtIElmIGl0J3MgYW4gYXJyYXkgb2YgMyBvciA0IG51bWJlcnMsIGFwcGx5IGVsZW1lbnQtd2lzZS4gTnVtYmVyIG9mIGVsZW1lbnRzIG5lZWQgdG8gbWF0Y2ggdGhlIG51bWJlciBvZiBjaGFubmVsc1xuICAgICAqIGZvciB0aGUgY29ycmVzcG9uZGluZyBpbWFnZSBmb3JtYXRcbiAgICAgKi9cbiAgICBiaWFzPzogbnVtYmVyfFtudW1iZXIsIG51bWJlciwgbnVtYmVyXXxbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcbiAgICAvKipcbiAgICAgKiBUaGUgJ21lYW4nIHZhbHVlIGZvciBpbWFnZSBub3JtYWxpemF0aW9uLlxuICAgICAqIC0gSWYgb21pdHRlZCwgdXNlIGRlZmF1bHQgdmFsdWUgMjU1LlxuICAgICAqIC0gSWYgaXQncyBhIHNpbmdsZSBudW1iZXIsIGFwcGx5IHRvIGVhY2ggY2hhbm5lbFxuICAgICAqIC0gSWYgaXQncyBhbiBhcnJheSBvZiAzIG9yIDQgbnVtYmVycywgYXBwbHkgZWxlbWVudC13aXNlLiBOdW1iZXIgb2YgZWxlbWVudHMgbmVlZCB0byBtYXRjaCB0aGUgbnVtYmVyIG9mIGNoYW5uZWxzXG4gICAgICogZm9yIHRoZSBjb3JyZXNwb25kaW5nIGltYWdlIGZvcm1hdFxuICAgICAqL1xuICAgIG1lYW4/OiBudW1iZXIgfCBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gfCBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcbiAgfTtcbn1cblxuLy8gI2VuZHJlZ2lvblxuXG4vLyAjcmVnaW9uIE9wdGlvbnMgY29tcG9zaXRpb25cblxuZXhwb3J0IGludGVyZmFjZSBUZW5zb3JGcm9tSW1hZ2VEYXRhT3B0aW9ucyBleHRlbmRzIE9wdGlvblJlc2l6ZWREaW1lbnNpb25zLCBPcHRpb25zVGVuc29yRm9ybWF0LCBPcHRpb25zVGVuc29yTGF5b3V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9wdGlvbnNUZW5zb3JEYXRhVHlwZSwgT3B0aW9uc05vcm1hbGl6YXRpb25QYXJhbWV0ZXJzIHt9XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGVuc29yRnJvbUltYWdlRWxlbWVudE9wdGlvbnMgZXh0ZW5kcyBPcHRpb25SZXNpemVkRGltZW5zaW9ucywgT3B0aW9uc1RlbnNvckZvcm1hdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPcHRpb25zVGVuc29yTGF5b3V0LCBPcHRpb25zVGVuc29yRGF0YVR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT3B0aW9uc05vcm1hbGl6YXRpb25QYXJhbWV0ZXJzIHt9XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGVuc29yRnJvbVVybE9wdGlvbnMgZXh0ZW5kcyBPcHRpb25zRGltZW5zaW9ucywgT3B0aW9uUmVzaXplZERpbWVuc2lvbnMsIE9wdGlvbnNUZW5zb3JGb3JtYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT3B0aW9uc1RlbnNvckxheW91dCwgT3B0aW9uc1RlbnNvckRhdGFUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9wdGlvbnNOb3JtYWxpemF0aW9uUGFyYW1ldGVycyB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIFRlbnNvckZyb21JbWFnZUJpdG1hcE9wdGlvbnMgZXh0ZW5kcyBPcHRpb25SZXNpemVkRGltZW5zaW9ucywgT3B0aW9uc1RlbnNvckZvcm1hdCwgT3B0aW9uc1RlbnNvckxheW91dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9wdGlvbnNUZW5zb3JEYXRhVHlwZSwgT3B0aW9uc05vcm1hbGl6YXRpb25QYXJhbWV0ZXJzIHt9XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGVuc29yRnJvbVRleHR1cmVPcHRpb25zPFQgZXh0ZW5kcyBUZW5zb3IuVGV4dHVyZURhdGFUeXBlcz4gZXh0ZW5kc1xuICAgIFJlcXVpcmVkPE9wdGlvbnNEaW1lbnNpb25zPiwgT3B0aW9uc0Zvcm1hdCwgR3B1UmVzb3VyY2VDb25zdHJ1Y3RvclBhcmFtZXRlcnM8VD4vKiBUT0RPOiBhZGQgbW9yZSAqLyB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIFRlbnNvckZyb21HcHVCdWZmZXJPcHRpb25zPFQgZXh0ZW5kcyBUZW5zb3IuR3B1QnVmZmVyRGF0YVR5cGVzPiBleHRlbmRzXG4gICAgUGljazxUZW5zb3IsICdkaW1zJz4sIEdwdVJlc291cmNlQ29uc3RydWN0b3JQYXJhbWV0ZXJzPFQ+IHtcbiAgLyoqXG4gICAqIERlc2NyaWJlcyB0aGUgZGF0YSB0eXBlIG9mIHRoZSB0ZW5zb3IuXG4gICAqL1xuICBkYXRhVHlwZT86IFQ7XG59XG5cbi8vICNlbmRyZWdpb25cblxuLyoqXG4gKiB0eXBlIFRlbnNvckZhY3RvcnkgZGVmaW5lcyB0aGUgZmFjdG9yeSBmdW5jdGlvbnMgb2YgJ1RlbnNvcicgdG8gY3JlYXRlIHRlbnNvciBpbnN0YW5jZXMgZnJvbSBleGlzdGluZyBkYXRhIG9yXG4gKiByZXNvdXJjZXMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGVuc29yRmFjdG9yeSB7XG4gIC8qKlxuICAgKiBjcmVhdGUgYSB0ZW5zb3IgZnJvbSBhbiBJbWFnZURhdGEgb2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSBpbWFnZURhdGEgLSB0aGUgSW1hZ2VEYXRhIG9iamVjdCB0byBjcmVhdGUgdGVuc29yIGZyb21cbiAgICogQHBhcmFtIG9wdGlvbnMgLSBBbiBvcHRpb25hbCBvYmplY3QgcmVwcmVzZW50aW5nIG9wdGlvbnMgZm9yIGNyZWF0aW5nIHRlbnNvciBmcm9tIEltYWdlRGF0YS5cbiAgICpcbiAgICogVGhlIGZvbGxvd2luZyBkZWZhdWx0IHNldHRpbmdzIHdpbGwgYmUgYXBwbGllZDpcbiAgICogLSBgdGVuc29yRm9ybWF0YDogYCdSR0InYFxuICAgKiAtIGB0ZW5zb3JMYXlvdXRgOiBgJ05DSFcnYFxuICAgKiAtIGBkYXRhVHlwZWA6IGAnZmxvYXQzMidgXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgdGVuc29yIG9iamVjdFxuICAgKi9cbiAgZnJvbUltYWdlKGltYWdlRGF0YTogSW1hZ2VEYXRhLCBvcHRpb25zPzogVGVuc29yRnJvbUltYWdlRGF0YU9wdGlvbnMpOlxuICAgICAgUHJvbWlzZTxUeXBlZFRlbnNvcjwnZmxvYXQzMic+fFR5cGVkVGVuc29yPCd1aW50OCc+PjtcblxuICAvKipcbiAgICogY3JlYXRlIGEgdGVuc29yIGZyb20gYSBIVE1MSW1hZ2VFbGVtZW50IG9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0gaW1hZ2VFbGVtZW50IC0gdGhlIEhUTUxJbWFnZUVsZW1lbnQgb2JqZWN0IHRvIGNyZWF0ZSB0ZW5zb3IgZnJvbVxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIEFuIG9wdGlvbmFsIG9iamVjdCByZXByZXNlbnRpbmcgb3B0aW9ucyBmb3IgY3JlYXRpbmcgdGVuc29yIGZyb20gSFRNTEltYWdlRWxlbWVudC5cbiAgICpcbiAgICogVGhlIGZvbGxvd2luZyBkZWZhdWx0IHNldHRpbmdzIHdpbGwgYmUgYXBwbGllZDpcbiAgICogLSBgdGVuc29yRm9ybWF0YDogYCdSR0InYFxuICAgKiAtIGB0ZW5zb3JMYXlvdXRgOiBgJ05DSFcnYFxuICAgKiAtIGBkYXRhVHlwZWA6IGAnZmxvYXQzMidgXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgdGVuc29yIG9iamVjdFxuICAgKi9cbiAgZnJvbUltYWdlKGltYWdlRWxlbWVudDogSFRNTEltYWdlRWxlbWVudCwgb3B0aW9ucz86IFRlbnNvckZyb21JbWFnZUVsZW1lbnRPcHRpb25zKTpcbiAgICAgIFByb21pc2U8VHlwZWRUZW5zb3I8J2Zsb2F0MzInPnxUeXBlZFRlbnNvcjwndWludDgnPj47XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSBhIHRlbnNvciBmcm9tIFVSTFxuICAgKlxuICAgKiBAcGFyYW0gdXJsU291cmNlIC0gYSBzdHJpbmcgYXMgYSBVUkwgdG8gdGhlIGltYWdlIG9yIGEgZGF0YSBVUkwgY29udGFpbmluZyB0aGUgaW1hZ2UgZGF0YS5cbiAgICogQHBhcmFtIG9wdGlvbnMgLSBBbiBvcHRpb25hbCBvYmplY3QgcmVwcmVzZW50aW5nIG9wdGlvbnMgZm9yIGNyZWF0aW5nIHRlbnNvciBmcm9tIFVSTC5cbiAgICpcbiAgICogVGhlIGZvbGxvd2luZyBkZWZhdWx0IHNldHRpbmdzIHdpbGwgYmUgYXBwbGllZDpcbiAgICogLSBgdGVuc29yRm9ybWF0YDogYCdSR0InYFxuICAgKiAtIGB0ZW5zb3JMYXlvdXRgOiBgJ05DSFcnYFxuICAgKiAtIGBkYXRhVHlwZWA6IGAnZmxvYXQzMidgXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgdGVuc29yIG9iamVjdFxuICAgKi9cbiAgZnJvbUltYWdlKHVybFNvdXJjZTogc3RyaW5nLCBvcHRpb25zPzogVGVuc29yRnJvbVVybE9wdGlvbnMpOiBQcm9taXNlPFR5cGVkVGVuc29yPCdmbG9hdDMyJz58VHlwZWRUZW5zb3I8J3VpbnQ4Jz4+O1xuXG4gIC8qKlxuICAgKiBjcmVhdGUgYSB0ZW5zb3IgZnJvbSBhbiBJbWFnZUJpdG1hcCBvYmplY3RcbiAgICpcbiAgICogQHBhcmFtIGJpdG1hcCAtIHRoZSBJbWFnZUJpdG1hcCBvYmplY3QgdG8gY3JlYXRlIHRlbnNvciBmcm9tXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gQW4gb3B0aW9uYWwgb2JqZWN0IHJlcHJlc2VudGluZyBvcHRpb25zIGZvciBjcmVhdGluZyB0ZW5zb3IgZnJvbSBVUkwuXG4gICAqXG4gICAqIFRoZSBmb2xsb3dpbmcgZGVmYXVsdCBzZXR0aW5ncyB3aWxsIGJlIGFwcGxpZWQ6XG4gICAqIC0gYHRlbnNvckZvcm1hdGA6IGAnUkdCJ2BcbiAgICogLSBgdGVuc29yTGF5b3V0YDogYCdOQ0hXJ2BcbiAgICogLSBgZGF0YVR5cGVgOiBgJ2Zsb2F0MzInYFxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIHRlbnNvciBvYmplY3RcbiAgICovXG4gIGZyb21JbWFnZShiaXRtYXA6IEltYWdlQml0bWFwLCBvcHRpb25zOiBUZW5zb3JGcm9tSW1hZ2VCaXRtYXBPcHRpb25zKTpcbiAgICAgIFByb21pc2U8VHlwZWRUZW5zb3I8J2Zsb2F0MzInPnxUeXBlZFRlbnNvcjwndWludDgnPj47XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSBhIHRlbnNvciBmcm9tIGEgV2ViR0wgdGV4dHVyZVxuICAgKlxuICAgKiBAcGFyYW0gdGV4dHVyZSAtIHRoZSBXZWJHTFRleHR1cmUgb2JqZWN0IHRvIGNyZWF0ZSB0ZW5zb3IgZnJvbVxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIEFuIG9wdGlvbmFsIG9iamVjdCByZXByZXNlbnRpbmcgb3B0aW9ucyBmb3IgY3JlYXRpbmcgdGVuc29yIGZyb20gV2ViR0wgdGV4dHVyZS5cbiAgICpcbiAgICogVGhlIG9wdGlvbnMgaW5jbHVkZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICogLSBgd2lkdGhgOiB0aGUgd2lkdGggb2YgdGhlIHRleHR1cmUuIFJlcXVpcmVkLlxuICAgKiAtIGBoZWlnaHRgOiB0aGUgaGVpZ2h0IG9mIHRoZSB0ZXh0dXJlLiBSZXF1aXJlZC5cbiAgICogLSBgZm9ybWF0YDogdGhlIGZvcm1hdCBvZiB0aGUgdGV4dHVyZS4gSWYgb21pdHRlZCwgYXNzdW1lICdSR0JBJy5cbiAgICogLSBgZG93bmxvYWRgOiBhbiBvcHRpb25hbCBmdW5jdGlvbiB0byBkb3dubG9hZCB0aGUgdGVuc29yIGRhdGEgZnJvbSBHUFUgdG8gQ1BVLiBJZiBvbWl0dGVkLCB0aGUgR1BVIGRhdGFcbiAgICogd2lsbCBub3QgYmUgYWJsZSB0byBkb3dubG9hZC4gVXN1YWxseSwgdGhpcyBpcyBwcm92aWRlZCBieSBhIEdQVSBiYWNrZW5kIGZvciB0aGUgaW5mZXJlbmNlIG91dHB1dHMuIFVzZXJzIGRvbid0XG4gICAqIG5lZWQgdG8gcHJvdmlkZSB0aGlzIGZ1bmN0aW9uLlxuICAgKiAtIGBkaXNwb3NlYDogYW4gb3B0aW9uYWwgZnVuY3Rpb24gdG8gZGlzcG9zZSB0aGUgdGVuc29yIGRhdGEgb24gR1BVLiBJZiBvbWl0dGVkLCB0aGUgR1BVIGRhdGEgd2lsbCBub3QgYmUgZGlzcG9zZWQuXG4gICAqIFVzdWFsbHksIHRoaXMgaXMgcHJvdmlkZWQgYnkgYSBHUFUgYmFja2VuZCBmb3IgdGhlIGluZmVyZW5jZSBvdXRwdXRzLiBVc2VycyBkb24ndCBuZWVkIHRvIHByb3ZpZGUgdGhpcyBmdW5jdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMgYSB0ZW5zb3Igb2JqZWN0XG4gICAqL1xuICBmcm9tVGV4dHVyZTxUIGV4dGVuZHMgVGVuc29yLlRleHR1cmVEYXRhVHlwZXMgPSAnZmxvYXQzMic+KFxuICAgICAgdGV4dHVyZTogVGVuc29yLlRleHR1cmVUeXBlLCBvcHRpb25zOiBUZW5zb3JGcm9tVGV4dHVyZU9wdGlvbnM8VD4pOiBUeXBlZFRlbnNvcjwnZmxvYXQzMic+O1xuXG4gIC8qKlxuICAgKiBjcmVhdGUgYSB0ZW5zb3IgZnJvbSBhIFdlYkdQVSBidWZmZXJcbiAgICpcbiAgICogQHBhcmFtIGJ1ZmZlciAtIHRoZSBHUFVCdWZmZXIgb2JqZWN0IHRvIGNyZWF0ZSB0ZW5zb3IgZnJvbVxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIEFuIG9wdGlvbmFsIG9iamVjdCByZXByZXNlbnRpbmcgb3B0aW9ucyBmb3IgY3JlYXRpbmcgdGVuc29yIGZyb20gV2ViR1BVIGJ1ZmZlci5cbiAgICpcbiAgICogVGhlIG9wdGlvbnMgaW5jbHVkZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICogLSBgZGF0YVR5cGVgOiB0aGUgZGF0YSB0eXBlIG9mIHRoZSB0ZW5zb3IuIElmIG9taXR0ZWQsIGFzc3VtZSAnZmxvYXQzMicuXG4gICAqIC0gYGRpbXNgOiB0aGUgZGltZW5zaW9uIG9mIHRoZSB0ZW5zb3IuIFJlcXVpcmVkLlxuICAgKiAtIGBkb3dubG9hZGA6IGFuIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIGRvd25sb2FkIHRoZSB0ZW5zb3IgZGF0YSBmcm9tIEdQVSB0byBDUFUuIElmIG9taXR0ZWQsIHRoZSBHUFUgZGF0YVxuICAgKiB3aWxsIG5vdCBiZSBhYmxlIHRvIGRvd25sb2FkLiBVc3VhbGx5LCB0aGlzIGlzIHByb3ZpZGVkIGJ5IGEgR1BVIGJhY2tlbmQgZm9yIHRoZSBpbmZlcmVuY2Ugb3V0cHV0cy4gVXNlcnMgZG9uJ3RcbiAgICogbmVlZCB0byBwcm92aWRlIHRoaXMgZnVuY3Rpb24uXG4gICAqIC0gYGRpc3Bvc2VgOiBhbiBvcHRpb25hbCBmdW5jdGlvbiB0byBkaXNwb3NlIHRoZSB0ZW5zb3IgZGF0YSBvbiBHUFUuIElmIG9taXR0ZWQsIHRoZSBHUFUgZGF0YSB3aWxsIG5vdCBiZSBkaXNwb3NlZC5cbiAgICogVXN1YWxseSwgdGhpcyBpcyBwcm92aWRlZCBieSBhIEdQVSBiYWNrZW5kIGZvciB0aGUgaW5mZXJlbmNlIG91dHB1dHMuIFVzZXJzIGRvbid0IG5lZWQgdG8gcHJvdmlkZSB0aGlzIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyBhIHRlbnNvciBvYmplY3RcbiAgICovXG4gIGZyb21HcHVCdWZmZXI8VCBleHRlbmRzIFRlbnNvci5HcHVCdWZmZXJEYXRhVHlwZXM+KFxuICAgICAgYnVmZmVyOiBUZW5zb3IuR3B1QnVmZmVyVHlwZSwgb3B0aW9uczogVGVuc29yRnJvbUdwdUJ1ZmZlck9wdGlvbnM8VD4pOiBUeXBlZFRlbnNvcjxUPjtcblxuICAvKipcbiAgICogY3JlYXRlIGEgdGVuc29yIGZyb20gYSBwcmUtYWxsb2NhdGVkIGJ1ZmZlci4gVGhlIGJ1ZmZlciB3aWxsIGJlIHVzZWQgYXMgYSBwaW5uZWQgYnVmZmVyLlxuICAgKlxuICAgKiBAcGFyYW0gdHlwZSAtIHRoZSB0ZW5zb3IgZWxlbWVudCB0eXBlLlxuICAgKiBAcGFyYW0gYnVmZmVyIC0gYSBUeXBlZEFycmF5IGNvcnJlc3BvbmRpbmcgdG8gdGhlIHR5cGUuXG4gICAqIEBwYXJhbSBkaW1zIC0gc3BlY2lmeSB0aGUgZGltZW5zaW9uIG9mIHRoZSB0ZW5zb3IuIElmIG9taXR0ZWQsIGEgMS1EIHRlbnNvciBpcyBhc3N1bWVkLlxuICAgKlxuICAgKiBAcmV0dXJucyBhIHRlbnNvciBvYmplY3RcbiAgICovXG4gIGZyb21QaW5uZWRCdWZmZXI8VCBleHRlbmRzIEV4Y2x1ZGU8VGVuc29yLlR5cGUsICdzdHJpbmcnPj4oXG4gICAgICB0eXBlOiBULCBidWZmZXI6IFRlbnNvci5EYXRhVHlwZU1hcFtUXSwgZGltcz86IHJlYWRvbmx5IG51bWJlcltdKTogVHlwZWRUZW5zb3I8VD47XG59XG4iLCAiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5cbi8qKlxuICogQSBzdHJpbmcgdGhhdCByZXByZXNlbnRzIGEgZmlsZSdzIFVSTCBvciBwYXRoLlxuICpcbiAqIFBhdGggaXMgdmFpbGFibGUgb25seSBpbiBvbm54cnVudGltZS1ub2RlIG9yIG9ubnhydW50aW1lLXdlYiBydW5uaW5nIGluIE5vZGUuanMuXG4gKi9cbmV4cG9ydCB0eXBlIEZpbGVVcmxPclBhdGggPSBzdHJpbmc7XG5cbi8qKlxuICogQSBCbG9iIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgYSBmaWxlLlxuICovXG5leHBvcnQgdHlwZSBGaWxlQmxvYiA9IEJsb2I7XG5cbi8qKlxuICogQSBVaW50OEFycmF5LCBBcnJheUJ1ZmZlciBvciBTaGFyZWRBcnJheUJ1ZmZlciBvYmplY3QgdGhhdCByZXByZXNlbnRzIGEgZmlsZSBjb250ZW50LlxuICpcbiAqIFdoZW4gaXQgaXMgYW4gQXJyYXlCdWZmZXIgb3IgU2hhcmVkQXJyYXlCdWZmZXIsIHRoZSB3aG9sZSBidWZmZXIgaXMgYXNzdW1lZCB0byBiZSB0aGUgZmlsZSBjb250ZW50LlxuICovXG5leHBvcnQgdHlwZSBGaWxlRGF0YSA9IFVpbnQ4QXJyYXl8QXJyYXlCdWZmZXJMaWtlO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBmaWxlIHRoYXQgY2FuIGJlIGxvYWRlZCBieSB0aGUgT05OWCBSdW50aW1lIEphdmFTY3JpcHQgQVBJLlxuICovXG5leHBvcnQgdHlwZSBGaWxlVHlwZSA9IEZpbGVVcmxPclBhdGh8RmlsZUJsb2J8RmlsZURhdGE7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhbiBleHRlcm5hbCBkYXRhIGZpbGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXh0ZXJuYWxEYXRhRmlsZURlc2NyaXB0aW9uIHtcbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIGV4dGVybmFsIGRhdGEgZmlsZS5cbiAgICovXG4gIGRhdGE6IEZpbGVUeXBlO1xuICAvKipcbiAgICogU3BlY2lmeSB0aGUgZmlsZSBwYXRoLlxuICAgKi9cbiAgcGF0aDogc3RyaW5nO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gZXh0ZXJuYWwgZGF0YSBmaWxlLlxuICpcbiAqIFdoZW4gdXNpbmcgYSBzdHJpbmcsIGl0IHNob3VsZCBiZSBhIGZpbGUgVVJMIG9yIHBhdGggdGhhdCBpbiB0aGUgc2FtZSBkaXJlY3RvcnkgYXMgdGhlIG1vZGVsIGZpbGUuXG4gKi9cbmV4cG9ydCB0eXBlIEV4dGVybmFsRGF0YUZpbGVUeXBlID0gRXh0ZXJuYWxEYXRhRmlsZURlc2NyaXB0aW9ufEZpbGVVcmxPclBhdGg7XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgbW9kZWwgbG9hZGluZy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBPbm54TW9kZWxPcHRpb25zIHtcbiAgLyoqXG4gICAqIFNwZWNpZnlpbmcgYSBsaXN0IG9mIGZpbGVzIHRoYXQgcmVwcmVzZW50cyB0aGUgZXh0ZXJuYWwgZGF0YS5cbiAgICovXG4gIGV4dGVybmFsRGF0YT86IHJlYWRvbmx5IEV4dGVybmFsRGF0YUZpbGVUeXBlW107XG59XG4iLCAiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5cbmltcG9ydCB7VGVuc29yfSBmcm9tICcuL3RlbnNvci5qcyc7XG5cbmV4cG9ydCB0eXBlIE5vblRlbnNvclR5cGUgPSBuZXZlcjtcblxuLyoqXG4gKiBUeXBlIE9ubnhWYWx1ZSBSZXByZXNlbnRzIGJvdGggdGVuc29ycyBhbmQgbm9uLXRlbnNvcnMgdmFsdWUgZm9yIG1vZGVsJ3MgaW5wdXRzL291dHB1dHMuXG4gKlxuICogTk9URTogY3VycmVudGx5IG5vdCBzdXBwb3J0IG5vbi10ZW5zb3JcbiAqL1xuZXhwb3J0IHR5cGUgT25ueFZhbHVlID0gVGVuc29yfE5vblRlbnNvclR5cGU7XG5cbi8qKlxuICogVHlwZSBPbm54VmFsdWVEYXRhTG9jYXRpb24gcmVwcmVzZW50cyB0aGUgbG9jYXRpb24gb2YgdGhlIGRhdGEgb2YgYW4gT25ueFZhbHVlLlxuICovXG5leHBvcnQgdHlwZSBPbm54VmFsdWVEYXRhTG9jYXRpb24gPSBUZW5zb3IuRGF0YUxvY2F0aW9uO1xuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQge3Jlc29sdmVCYWNrZW5kQW5kRXhlY3V0aW9uUHJvdmlkZXJzfSBmcm9tICcuL2JhY2tlbmQtaW1wbC5qcyc7XG5pbXBvcnQge1Nlc3Npb25IYW5kbGVyLCBUcmFpbmluZ1Nlc3Npb25IYW5kbGVyfSBmcm9tICcuL2JhY2tlbmQuanMnO1xuaW1wb3J0IHtJbmZlcmVuY2VTZXNzaW9uIGFzIEluZmVyZW5jZVNlc3Npb259IGZyb20gJy4vaW5mZXJlbmNlLXNlc3Npb24uanMnO1xuaW1wb3J0IHtPbm54VmFsdWV9IGZyb20gJy4vb25ueC12YWx1ZS5qcyc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi90ZW5zb3IuanMnO1xuaW1wb3J0IHtUcmFpbmluZ1Nlc3Npb24gYXMgVHJhaW5pbmdTZXNzaW9uSW50ZXJmYWNlLCBUcmFpbmluZ1Nlc3Npb25DcmVhdGVPcHRpb25zfSBmcm9tICcuL3RyYWluaW5nLXNlc3Npb24uanMnO1xuXG50eXBlIFNlc3Npb25PcHRpb25zID0gSW5mZXJlbmNlU2Vzc2lvbi5TZXNzaW9uT3B0aW9ucztcbnR5cGUgRmVlZHNUeXBlID0gSW5mZXJlbmNlU2Vzc2lvbi5GZWVkc1R5cGU7XG50eXBlIEZldGNoZXNUeXBlID0gSW5mZXJlbmNlU2Vzc2lvbi5GZXRjaGVzVHlwZTtcbnR5cGUgUmV0dXJuVHlwZSA9IEluZmVyZW5jZVNlc3Npb24uUmV0dXJuVHlwZTtcbnR5cGUgUnVuT3B0aW9ucyA9IEluZmVyZW5jZVNlc3Npb24uUnVuT3B0aW9ucztcblxuY29uc3Qgbm9CYWNrZW5kRXJyTXNnOiBzdHJpbmcgPSAnVHJhaW5pbmcgYmFja2VuZCBjb3VsZCBub3QgYmUgcmVzb2x2ZWQuICcgK1xuICAgICdNYWtlIHN1cmUgeW91XFwncmUgdXNpbmcgdGhlIGNvcnJlY3QgY29uZmlndXJhdGlvbiAmIFdlYkFzc2VtYmx5IGZpbGVzLic7XG5cbmV4cG9ydCBjbGFzcyBUcmFpbmluZ1Nlc3Npb24gaW1wbGVtZW50cyBUcmFpbmluZ1Nlc3Npb25JbnRlcmZhY2Uge1xuICBwcml2YXRlIGNvbnN0cnVjdG9yKGhhbmRsZXI6IFRyYWluaW5nU2Vzc2lvbkhhbmRsZXIsIGhhc09wdGltaXplck1vZGVsOiBib29sZWFuLCBoYXNFdmFsTW9kZWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmhhbmRsZXIgPSBoYW5kbGVyO1xuICAgIHRoaXMuaGFzT3B0aW1pemVyTW9kZWwgPSBoYXNPcHRpbWl6ZXJNb2RlbDtcbiAgICB0aGlzLmhhc0V2YWxNb2RlbCA9IGhhc0V2YWxNb2RlbDtcbiAgfVxuICBwcml2YXRlIGhhbmRsZXI6IFRyYWluaW5nU2Vzc2lvbkhhbmRsZXI7XG4gIHByaXZhdGUgaGFzT3B0aW1pemVyTW9kZWw6IGJvb2xlYW47XG4gIHByaXZhdGUgaGFzRXZhbE1vZGVsOiBib29sZWFuO1xuXG4gIGdldCB0cmFpbmluZ0lucHV0TmFtZXMoKTogcmVhZG9ubHkgc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZXIuaW5wdXROYW1lcztcbiAgfVxuICBnZXQgdHJhaW5pbmdPdXRwdXROYW1lcygpOiByZWFkb25seSBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlci5vdXRwdXROYW1lcztcbiAgfVxuXG4gIGdldCBldmFsSW5wdXROYW1lcygpOiByZWFkb25seSBzdHJpbmdbXSB7XG4gICAgaWYgKHRoaXMuaGFzRXZhbE1vZGVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVyLmV2YWxJbnB1dE5hbWVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoaXMgdHJhaW5pbmcgc2Vzc2lvbiBoYXMgbm8gZXZhbE1vZGVsIGxvYWRlZC4nKTtcbiAgICB9XG4gIH1cbiAgZ2V0IGV2YWxPdXRwdXROYW1lcygpOiByZWFkb25seSBzdHJpbmdbXSB7XG4gICAgaWYgKHRoaXMuaGFzRXZhbE1vZGVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVyLmV2YWxPdXRwdXROYW1lcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIHRyYWluaW5nIHNlc3Npb24gaGFzIG5vIGV2YWxNb2RlbCBsb2FkZWQuJyk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGFzeW5jIGNyZWF0ZSh0cmFpbmluZ09wdGlvbnM6IFRyYWluaW5nU2Vzc2lvbkNyZWF0ZU9wdGlvbnMsIHNlc3Npb25PcHRpb25zPzogU2Vzc2lvbk9wdGlvbnMpOlxuICAgICAgUHJvbWlzZTxUcmFpbmluZ1Nlc3Npb24+IHtcbiAgICBjb25zdCBldmFsTW9kZWw6IHN0cmluZ3xVaW50OEFycmF5ID0gdHJhaW5pbmdPcHRpb25zLmV2YWxNb2RlbCB8fCAnJztcbiAgICBjb25zdCBvcHRpbWl6ZXJNb2RlbDogc3RyaW5nfFVpbnQ4QXJyYXkgPSB0cmFpbmluZ09wdGlvbnMub3B0aW1pemVyTW9kZWwgfHwgJyc7XG4gICAgY29uc3Qgb3B0aW9uczogU2Vzc2lvbk9wdGlvbnMgPSBzZXNzaW9uT3B0aW9ucyB8fCB7fTtcblxuICAgIC8vIHJlc29sdmUgYmFja2VuZCwgdXBkYXRlIHNlc3Npb24gb3B0aW9ucyB3aXRoIHZhbGlkYXRlZCBFUHMsIGFuZCBjcmVhdGUgc2Vzc2lvbiBoYW5kbGVyXG4gICAgY29uc3QgW2JhY2tlbmQsIG9wdGlvbnNXaXRoVmFsaWRhdGVkRVBzXSA9IGF3YWl0IHJlc29sdmVCYWNrZW5kQW5kRXhlY3V0aW9uUHJvdmlkZXJzKG9wdGlvbnMpO1xuICAgIGlmIChiYWNrZW5kLmNyZWF0ZVRyYWluaW5nU2Vzc2lvbkhhbmRsZXIpIHtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBhd2FpdCBiYWNrZW5kLmNyZWF0ZVRyYWluaW5nU2Vzc2lvbkhhbmRsZXIoXG4gICAgICAgICAgdHJhaW5pbmdPcHRpb25zLmNoZWNrcG9pbnRTdGF0ZSwgdHJhaW5pbmdPcHRpb25zLnRyYWluTW9kZWwsIGV2YWxNb2RlbCwgb3B0aW1pemVyTW9kZWwsXG4gICAgICAgICAgb3B0aW9uc1dpdGhWYWxpZGF0ZWRFUHMpO1xuICAgICAgcmV0dXJuIG5ldyBUcmFpbmluZ1Nlc3Npb24oaGFuZGxlciwgISF0cmFpbmluZ09wdGlvbnMub3B0aW1pemVyTW9kZWwsICEhdHJhaW5pbmdPcHRpb25zLmV2YWxNb2RlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihub0JhY2tlbmRFcnJNc2cpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgZnVuY3Rpb24gZm9yIHJ1blRyYWluU3RlcCBhbmQgZnV0dXJlIHJ1blN0ZXAgbWV0aG9kcyB0aGF0IGhhbmRsZXMgdGhlIHR5cGUtbmFycm93aW5nIGNvbnZlcnNpb24gZnJvbVxuICAgKiB0aGUgZ2l2ZW4gcGFyYW1ldGVycyB0byBTZXNzaW9uSGFuZGxlci5GZXRjaGVzVHlwZSBhbmQgUnVuT3B0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIGlucHV0TmFtZXMgdGhlIGZlZWRzIG9iamVjdCBpcyBjaGVja2VkIHRoYXQgdGhleSBjb250YWluIGFsbCBpbnB1dCBuYW1lcyBpbiB0aGUgcHJvdmlkZWQgbGlzdCBvZiBpbnB1dFxuICAgKiBuYW1lcy5cbiAgICogQHBhcmFtIG91dHB1dE5hbWVzIHRoZSBmZXRjaGVzIG9iamVjdCBpcyBjaGVja2VkIHRoYXQgdGhlaXIga2V5cyBtYXRjaCB1cCB3aXRoIHZhbGlkIG5hbWVzIGluIHRoZSBsaXN0IG9mIG91dHB1dFxuICAgKiBuYW1lcy5cbiAgICogQHBhcmFtIGZlZWRzIHRoZSByZXF1aXJlZCBpbnB1dFxuICAgKiBAcGFyYW0gYXJnMSBuYXJyb3dlZCAmIGNvbnZlcnRlZCBpbnRvIHRoZSBTZXNzaW9uSGFuZGxlci5GZXRjaGVzVHlwZSBvciBSdW5PcHRpb25zIG9iamVjdFxuICAgKiBAcGFyYW0gYXJnMiBvcHRpb25hbCBSdW5PcHRpb25zIG9iamVjdC5cbiAgICogQHJldHVybnNcbiAgICovXG4gIHR5cGVOYXJyb3dpbmdGb3JSdW5TdGVwKFxuICAgICAgaW5wdXROYW1lczogcmVhZG9ubHkgc3RyaW5nW10sIG91dHB1dE5hbWVzOiByZWFkb25seSBzdHJpbmdbXSwgZmVlZHM6IEZlZWRzVHlwZSwgYXJnMT86IEZldGNoZXNUeXBlfFJ1bk9wdGlvbnMsXG4gICAgICBhcmcyPzogUnVuT3B0aW9ucyk6IFtTZXNzaW9uSGFuZGxlci5GZXRjaGVzVHlwZSwgUnVuT3B0aW9uc10ge1xuICAgIGNvbnN0IGZldGNoZXM6IHtbbmFtZTogc3RyaW5nXTogT25ueFZhbHVlfG51bGx9ID0ge307XG4gICAgbGV0IG9wdGlvbnM6IFJ1bk9wdGlvbnMgPSB7fTtcbiAgICAvLyBjaGVjayBpbnB1dHNcbiAgICBpZiAodHlwZW9mIGZlZWRzICE9PSAnb2JqZWN0JyB8fCBmZWVkcyA9PT0gbnVsbCB8fCBmZWVkcyBpbnN0YW5jZW9mIFRlbnNvciB8fCBBcnJheS5pc0FycmF5KGZlZWRzKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAnXFwnZmVlZHNcXCcgbXVzdCBiZSBhbiBvYmplY3QgdGhhdCB1c2UgaW5wdXQgbmFtZXMgYXMga2V5cyBhbmQgT25ueFZhbHVlIGFzIGNvcnJlc3BvbmRpbmcgdmFsdWVzLicpO1xuICAgIH1cblxuICAgIGxldCBpc0ZldGNoZXNFbXB0eSA9IHRydWU7XG4gICAgLy8gZGV0ZXJtaW5lIHdoaWNoIG92ZXJyaWRlIGlzIGJlaW5nIHVzZWRcbiAgICBpZiAodHlwZW9mIGFyZzEgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAoYXJnMSA9PT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmV4cGVjdGVkIGFyZ3VtZW50WzFdOiBjYW5ub3QgYmUgbnVsbC4nKTtcbiAgICAgIH1cbiAgICAgIGlmIChhcmcxIGluc3RhbmNlb2YgVGVuc29yKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1xcJ2ZldGNoZXNcXCcgY2Fubm90IGJlIGEgVGVuc29yJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGFyZzEpKSB7XG4gICAgICAgIGlmIChhcmcxLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1xcJ2ZldGNoZXNcXCcgY2Fubm90IGJlIGFuIGVtcHR5IGFycmF5LicpO1xuICAgICAgICB9XG4gICAgICAgIGlzRmV0Y2hlc0VtcHR5ID0gZmFsc2U7XG4gICAgICAgIC8vIG91dHB1dCBuYW1lc1xuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgb2YgYXJnMSkge1xuICAgICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1xcJ2ZldGNoZXNcXCcgbXVzdCBiZSBhIHN0cmluZyBhcnJheSBvciBhbiBvYmplY3QuJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChvdXRwdXROYW1lcy5pbmRleE9mKG5hbWUpID09PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoYCdmZXRjaGVzJyBjb250YWlucyBpbnZhbGlkIG91dHB1dCBuYW1lOiAke25hbWV9LmApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmZXRjaGVzW25hbWVdID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgYXJnMiA9PT0gJ29iamVjdCcgJiYgYXJnMiAhPT0gbnVsbCkge1xuICAgICAgICAgIG9wdGlvbnMgPSBhcmcyO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmcyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1xcJ29wdGlvbnNcXCcgbXVzdCBiZSBhbiBvYmplY3QuJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGRlY2lkZSB3aGV0aGVyIGFyZzEgaXMgZmV0Y2hlcyBvciBvcHRpb25zXG4gICAgICAgIC8vIGlmIGFueSBvdXRwdXQgbmFtZSBpcyBwcmVzZW50IGFuZCBpdHMgdmFsdWUgaXMgdmFsaWQgT25ueFZhbHVlLCB3ZSBjb25zaWRlciBpdCBmZXRjaGVzXG4gICAgICAgIGxldCBpc0ZldGNoZXMgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgYXJnMUtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhhcmcxKTtcbiAgICAgICAgZm9yIChjb25zdCBuYW1lIG9mIG91dHB1dE5hbWVzKSB7XG4gICAgICAgICAgaWYgKGFyZzFLZXlzLmluZGV4T2YobmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICBjb25zdCB2ID0gKGFyZzEgYXMgSW5mZXJlbmNlU2Vzc2lvbi5OdWxsYWJsZU9ubnhWYWx1ZU1hcFR5cGUpW25hbWVdO1xuICAgICAgICAgICAgaWYgKHYgPT09IG51bGwgfHwgdiBpbnN0YW5jZW9mIFRlbnNvcikge1xuICAgICAgICAgICAgICBpc0ZldGNoZXMgPSB0cnVlO1xuICAgICAgICAgICAgICBpc0ZldGNoZXNFbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICBmZXRjaGVzW25hbWVdID0gdjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNGZXRjaGVzKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBhcmcyID09PSAnb2JqZWN0JyAmJiBhcmcyICE9PSBudWxsKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gYXJnMjtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmcyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXFwnb3B0aW9uc1xcJyBtdXN0IGJlIGFuIG9iamVjdC4nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3B0aW9ucyA9IGFyZzEgYXMgUnVuT3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGFyZzEgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmV4cGVjdGVkIGFyZ3VtZW50WzFdOiBtdXN0IGJlIFxcJ2ZldGNoZXNcXCcgb3IgXFwnb3B0aW9uc1xcJy4nKTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiBhbGwgaW5wdXRzIGFyZSBpbiBmZWVkXG4gICAgZm9yIChjb25zdCBuYW1lIG9mIGlucHV0TmFtZXMpIHtcbiAgICAgIGlmICh0eXBlb2YgZmVlZHNbbmFtZV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgaW5wdXQgJyR7bmFtZX0nIGlzIG1pc3NpbmcgaW4gJ2ZlZWRzJy5gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpZiBubyBmZXRjaGVzIGlzIHNwZWNpZmllZCwgd2UgdXNlIHRoZSBmdWxsIG91dHB1dCBuYW1lcyBsaXN0XG4gICAgaWYgKGlzRmV0Y2hlc0VtcHR5KSB7XG4gICAgICBmb3IgKGNvbnN0IG5hbWUgb2Ygb3V0cHV0TmFtZXMpIHtcbiAgICAgICAgZmV0Y2hlc1tuYW1lXSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFtmZXRjaGVzLCBvcHRpb25zXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgbWV0aG9kIGZvciBydW5UcmFpblN0ZXAgYW5kIGFueSBvdGhlciBydW5TdGVwIG1ldGhvZHMuIFRha2VzIHRoZSBSZXR1cm5UeXBlIHJlc3VsdCBmcm9tIHRoZSBTZXNzaW9uSGFuZGxlclxuICAgKiBhbmQgY2hhbmdlcyBpdCBpbnRvIGEgbWFwIG9mIFRlbnNvcnMuXG4gICAqXG4gICAqIEBwYXJhbSByZXN1bHRzXG4gICAqIEByZXR1cm5zXG4gICAqL1xuICBjb252ZXJ0SGFuZGxlclJldHVyblR5cGVUb01hcE9mVGVuc29ycyhyZXN1bHRzOiBTZXNzaW9uSGFuZGxlci5SZXR1cm5UeXBlKTogUmV0dXJuVHlwZSB7XG4gICAgY29uc3QgcmV0dXJuVmFsdWU6IHtbbmFtZTogc3RyaW5nXTogT25ueFZhbHVlfSA9IHt9O1xuICAgIGZvciAoY29uc3Qga2V5IGluIHJlc3VsdHMpIHtcbiAgICAgIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChyZXN1bHRzLCBrZXkpKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlc3VsdHNba2V5XTtcbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFRlbnNvcikge1xuICAgICAgICAgIHJldHVyblZhbHVlW2tleV0gPSByZXN1bHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuVmFsdWVba2V5XSA9IG5ldyBUZW5zb3IocmVzdWx0LnR5cGUsIHJlc3VsdC5kYXRhLCByZXN1bHQuZGltcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgYXN5bmMgbGF6eVJlc2V0R3JhZCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmhhbmRsZXIubGF6eVJlc2V0R3JhZCgpO1xuICB9XG5cbiAgcnVuVHJhaW5TdGVwKGZlZWRzOiBGZWVkc1R5cGUsIG9wdGlvbnM/OiBSdW5PcHRpb25zKTogUHJvbWlzZTxSZXR1cm5UeXBlPjtcbiAgcnVuVHJhaW5TdGVwKGZlZWRzOiBGZWVkc1R5cGUsIGZldGNoZXM6IEZldGNoZXNUeXBlLCBvcHRpb25zPzogUnVuT3B0aW9ucyk6IFByb21pc2U8UmV0dXJuVHlwZT47XG4gIGFzeW5jIHJ1blRyYWluU3RlcChmZWVkczogRmVlZHNUeXBlLCBhcmcxPzogRmV0Y2hlc1R5cGV8UnVuT3B0aW9ucywgYXJnMj86IFJ1bk9wdGlvbnMpOiBQcm9taXNlPFJldHVyblR5cGU+IHtcbiAgICBjb25zdCBbZmV0Y2hlcywgb3B0aW9uc10gPVxuICAgICAgICB0aGlzLnR5cGVOYXJyb3dpbmdGb3JSdW5TdGVwKHRoaXMudHJhaW5pbmdJbnB1dE5hbWVzLCB0aGlzLnRyYWluaW5nT3V0cHV0TmFtZXMsIGZlZWRzLCBhcmcxLCBhcmcyKTtcbiAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgdGhpcy5oYW5kbGVyLnJ1blRyYWluU3RlcChmZWVkcywgZmV0Y2hlcywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuY29udmVydEhhbmRsZXJSZXR1cm5UeXBlVG9NYXBPZlRlbnNvcnMocmVzdWx0cyk7XG4gIH1cblxuICBhc3luYyBydW5PcHRpbWl6ZXJTdGVwKG9wdGlvbnM/OiBJbmZlcmVuY2VTZXNzaW9uLlJ1bk9wdGlvbnN8dW5kZWZpbmVkKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMuaGFzT3B0aW1pemVyTW9kZWwpIHtcbiAgICAgIGF3YWl0IHRoaXMuaGFuZGxlci5ydW5PcHRpbWl6ZXJTdGVwKG9wdGlvbnMgfHwge30pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoaXMgVHJhaW5pbmdTZXNzaW9uIGhhcyBubyBPcHRpbWl6ZXJNb2RlbCBsb2FkZWQuJyk7XG4gICAgfVxuICB9XG5cbiAgcnVuRXZhbFN0ZXAoZmVlZHM6IEZlZWRzVHlwZSwgb3B0aW9ucz86IFJ1bk9wdGlvbnN8dW5kZWZpbmVkKTogUHJvbWlzZTxSZXR1cm5UeXBlPjtcbiAgcnVuRXZhbFN0ZXAoZmVlZHM6IEZlZWRzVHlwZSwgZmV0Y2hlczogRmV0Y2hlc1R5cGUsIG9wdGlvbnM/OiBSdW5PcHRpb25zfHVuZGVmaW5lZCk6IFByb21pc2U8UmV0dXJuVHlwZT47XG4gIGFzeW5jIHJ1bkV2YWxTdGVwKGZlZWRzOiBGZWVkc1R5cGUsIGFyZzE/OiBGZXRjaGVzVHlwZXxSdW5PcHRpb25zLCBhcmcyPzogUnVuT3B0aW9ucyk6IFByb21pc2U8UmV0dXJuVHlwZT4ge1xuICAgIGlmICh0aGlzLmhhc0V2YWxNb2RlbCkge1xuICAgICAgY29uc3QgW2ZldGNoZXMsIG9wdGlvbnNdID1cbiAgICAgICAgICB0aGlzLnR5cGVOYXJyb3dpbmdGb3JSdW5TdGVwKHRoaXMuZXZhbElucHV0TmFtZXMsIHRoaXMuZXZhbE91dHB1dE5hbWVzLCBmZWVkcywgYXJnMSwgYXJnMik7XG4gICAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgdGhpcy5oYW5kbGVyLnJ1bkV2YWxTdGVwKGZlZWRzLCBmZXRjaGVzLCBvcHRpb25zKTtcbiAgICAgIHJldHVybiB0aGlzLmNvbnZlcnRIYW5kbGVyUmV0dXJuVHlwZVRvTWFwT2ZUZW5zb3JzKHJlc3VsdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoaXMgVHJhaW5pbmdTZXNzaW9uIGhhcyBubyBFdmFsTW9kZWwgbG9hZGVkLicpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGdldFBhcmFtZXRlcnNTaXplKHRyYWluYWJsZU9ubHkgPSB0cnVlKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVyLmdldFBhcmFtZXRlcnNTaXplKHRyYWluYWJsZU9ubHkpO1xuICB9XG5cbiAgYXN5bmMgbG9hZFBhcmFtZXRlcnNCdWZmZXIoYXJyYXk6IFVpbnQ4QXJyYXksIHRyYWluYWJsZU9ubHkgPSB0cnVlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcGFyYW1zU2l6ZSA9IGF3YWl0IHRoaXMuZ2V0UGFyYW1ldGVyc1NpemUodHJhaW5hYmxlT25seSk7XG4gICAgLy8gY2hlY2tpbmcgdGhhdCB0aGUgc2l6ZSBvZiB0aGUgVWludDhBcnJheSBpcyBlcXVpdmFsZW50IHRvIHRoZSBieXRlIGxlbmd0aCBvZiBhIEZsb2F0MzJBcnJheSBvZiB0aGUgbnVtYmVyXG4gICAgLy8gb2YgcGFyYW1ldGVyc1xuICAgIGlmIChhcnJheS5sZW5ndGggIT09IDQgKiBwYXJhbXNTaXplKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ1NpemUgb2YgdGhlIGJ1ZmZlciBwYXNzZWQgaW50byBsb2FkUGFyYW1ldGVyc0J1ZmZlciBtdXN0IG1hdGNoIHRoZSBudW1iZXIgb2YgcGFyYW1ldGVycyBpbiAnICtcbiAgICAgICAgICAndGhlIG1vZGVsLiBQbGVhc2UgdXNlIGdldFBhcmFtZXRlcnNTaXplIG1ldGhvZCB0byBjaGVjay4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlci5sb2FkUGFyYW1ldGVyc0J1ZmZlcihhcnJheSwgdHJhaW5hYmxlT25seSk7XG4gIH1cblxuICBhc3luYyBnZXRDb250aWd1b3VzUGFyYW1ldGVycyh0cmFpbmFibGVPbmx5ID0gdHJ1ZSk6IFByb21pc2U8T25ueFZhbHVlPiB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlci5nZXRDb250aWd1b3VzUGFyYW1ldGVycyh0cmFpbmFibGVPbmx5KTtcbiAgfVxuXG4gIGFzeW5jIHJlbGVhc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlci5kaXNwb3NlKCk7XG4gIH1cbn1cbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuaW1wb3J0IHtJbmZlcmVuY2VTZXNzaW9ufSBmcm9tICcuL2luZmVyZW5jZS1zZXNzaW9uLmpzJztcbmltcG9ydCB7T25ueFZhbHVlfSBmcm9tICcuL29ubngtdmFsdWUuanMnO1xuaW1wb3J0IHtUcmFpbmluZ1Nlc3Npb24gYXMgVHJhaW5pbmdTZXNzaW9uSW1wbH0gZnJvbSAnLi90cmFpbmluZy1zZXNzaW9uLWltcGwuanMnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVkZWNsYXJlICovXG5cbmV4cG9ydCBkZWNsYXJlIG5hbWVzcGFjZSBUcmFpbmluZ1Nlc3Npb24ge1xuICAvKipcbiAgICogRWl0aGVyIFVSSSBmaWxlIHBhdGggKHN0cmluZykgb3IgVWludDhBcnJheSBjb250YWluaW5nIG1vZGVsIG9yIGNoZWNrcG9pbnQgaW5mb3JtYXRpb24uXG4gICAqL1xuICB0eXBlIFVyaU9yQnVmZmVyID0gc3RyaW5nfFVpbnQ4QXJyYXk7XG59XG5cbi8qKlxuICogUmVwcmVzZW50IGEgcnVudGltZSBpbnN0YW5jZSBvZiBhbiBPTk5YIHRyYWluaW5nIHNlc3Npb24sXG4gKiB3aGljaCBjb250YWlucyBhIG1vZGVsIHRoYXQgY2FuIGJlIHRyYWluZWQsIGFuZCwgb3B0aW9uYWxseSxcbiAqIGFuIGV2YWwgYW5kIG9wdGltaXplciBtb2RlbC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUcmFpbmluZ1Nlc3Npb24ge1xuICAvLyAjcmVnaW9uIHJ1bigpXG5cbiAgLyoqXG4gICAqIExhemlseSByZXNldHMgdGhlIGdyYWRpZW50cyBvZiBhbGwgdHJhaW5hYmxlIHBhcmFtZXRlcnMgdG8gemVyby4gU2hvdWxkIGhhcHBlbiBhZnRlciB0aGUgaW52b2NhdGlvbiBvZlxuICAgKiBydW5PcHRpbWl6ZXJTdGVwLlxuICAgKi9cbiAgbGF6eVJlc2V0R3JhZCgpOiBQcm9taXNlPHZvaWQ+O1xuXG4gIC8qKlxuICAgKiBSdW4gVHJhaW5TdGVwIGFzeW5jaHJvbm91c2x5IHdpdGggdGhlIGdpdmVuIGZlZWRzIGFuZCBvcHRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0gZmVlZHMgLSBSZXByZXNlbnRhdGlvbiBvZiB0aGUgbW9kZWwgaW5wdXQuIFNlZSB0eXBlIGRlc2NyaXB0aW9uIG9mIGBJbmZlcmVuY2VTZXNzaW9uLklucHV0VHlwZWAgZm9yXG4gICBkZXRhaWwuXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gT3B0aW9uYWwuIEEgc2V0IG9mIG9wdGlvbnMgdGhhdCBjb250cm9scyB0aGUgYmVoYXZpb3Igb2YgbW9kZWwgdHJhaW5pbmcuXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgbWFwLCB3aGljaCB1c2VzIG91dHB1dCBuYW1lcyBhcyBrZXlzIGFuZCBPbm54VmFsdWUgYXMgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gICAqL1xuICBydW5UcmFpblN0ZXAoZmVlZHM6IEluZmVyZW5jZVNlc3Npb24uRmVlZHNUeXBlLCBvcHRpb25zPzogSW5mZXJlbmNlU2Vzc2lvbi5SdW5PcHRpb25zKTpcbiAgICAgIFByb21pc2U8SW5mZXJlbmNlU2Vzc2lvbi5SZXR1cm5UeXBlPjtcblxuICAvKipcbiAgICogUnVuIGEgc2luZ2xlIHRyYWluIHN0ZXAgd2l0aCB0aGUgZ2l2ZW4gaW5wdXRzIGFuZCBvcHRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0gZmVlZHMgLSBSZXByZXNlbnRhdGlvbiBvZiB0aGUgbW9kZWwgaW5wdXQuXG4gICAqIEBwYXJhbSBmZXRjaGVzIC0gUmVwcmVzZW50YXRpb24gb2YgdGhlIG1vZGVsIG91dHB1dC5cbiAgICogZGV0YWlsLlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIE9wdGlvbmFsLiBBIHNldCBvZiBvcHRpb25zIHRoYXQgY29udHJvbHMgdGhlIGJlaGF2aW9yIG9mIG1vZGVsIHRyYWluaW5nLlxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIG1hcCwgd2hpY2ggdXNlcyBvdXRwdXQgbmFtZXMgYXMga2V5cyBhbmQgT25ueFZhbHVlIGFzIGNvcnJlc3BvbmRpbmdcbiAgIHZhbHVlcy5cbiAgICovXG4gIHJ1blRyYWluU3RlcChcbiAgICAgIGZlZWRzOiBJbmZlcmVuY2VTZXNzaW9uLkZlZWRzVHlwZSwgZmV0Y2hlczogSW5mZXJlbmNlU2Vzc2lvbi5GZXRjaGVzVHlwZSxcbiAgICAgIG9wdGlvbnM/OiBJbmZlcmVuY2VTZXNzaW9uLlJ1bk9wdGlvbnMpOiBQcm9taXNlPEluZmVyZW5jZVNlc3Npb24uUmV0dXJuVHlwZT47XG5cbiAgLyoqXG4gICAqIFJ1bnMgYSBzaW5nbGUgb3B0aW1pemVyIHN0ZXAsIHdoaWNoIHBlcmZvcm1zIHdlaWdodCB1cGRhdGVzIGZvciB0aGUgdHJhaW5hYmxlIHBhcmFtZXRlcnMgdXNpbmcgdGhlIG9wdGltaXplciBtb2RlbC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgLSBPcHRpb25hbC4gQSBzZXQgb2Ygb3B0aW9ucyB0aGF0IGNvbnRyb2xzIHRoZSBiZWhhdmlvciBvZiBtb2RlbCBvcHRpbWl6aW5nLlxuICAgKi9cbiAgcnVuT3B0aW1pemVyU3RlcChvcHRpb25zPzogSW5mZXJlbmNlU2Vzc2lvbi5SdW5PcHRpb25zKTogUHJvbWlzZTx2b2lkPjtcblxuICAvKipcbiAgICogUnVuIGEgc2luZ2xlIGV2YWwgc3RlcCB3aXRoIHRoZSBnaXZlbiBpbnB1dHMgYW5kIG9wdGlvbnMgdXNpbmcgdGhlIGV2YWwgbW9kZWwuXG4gICAqXG4gICAqIEBwYXJhbSBmZWVkcyAtIFJlcHJlc2VudGF0aW9uIG9mIHRoZSBtb2RlbCBpbnB1dC5cbiAgICogQHBhcmFtIG9wdGlvbnMgLSBPcHRpb25hbC4gQSBzZXQgb2Ygb3B0aW9ucyB0aGF0IGNvbnRyb2xzIHRoZSBiZWhhdmlvciBvZiBtb2RlbCBldmFsIHN0ZXAuXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgbWFwLCB3aGljaCB1c2VzIG91dHB1dCBuYW1lcyBhcyBrZXlzIGFuZCBPbm54VmFsdWUgYXMgY29ycmVzcG9uZGluZ1xuICAgdmFsdWVzLlxuICAgKi9cbiAgcnVuRXZhbFN0ZXAoZmVlZHM6IEluZmVyZW5jZVNlc3Npb24uRmVlZHNUeXBlLCBvcHRpb25zPzogSW5mZXJlbmNlU2Vzc2lvbi5SdW5PcHRpb25zKTpcbiAgICAgIFByb21pc2U8SW5mZXJlbmNlU2Vzc2lvbi5SZXR1cm5UeXBlPjtcblxuICAvKipcbiAgICogUnVuIGEgc2luZ2xlIGV2YWwgc3RlcCB3aXRoIHRoZSBnaXZlbiBpbnB1dHMgYW5kIG9wdGlvbnMgdXNpbmcgdGhlIGV2YWwgbW9kZWwuXG4gICAqXG4gICAqIEBwYXJhbSBmZWVkcyAtIFJlcHJlc2VudGF0aW9uIG9mIHRoZSBtb2RlbCBpbnB1dC5cbiAgICogQHBhcmFtIGZldGNoZXMgLSBSZXByZXNlbnRhdGlvbiBvZiB0aGUgbW9kZWwgb3V0cHV0LlxuICAgKiBkZXRhaWwuXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gT3B0aW9uYWwuIEEgc2V0IG9mIG9wdGlvbnMgdGhhdCBjb250cm9scyB0aGUgYmVoYXZpb3Igb2YgbW9kZWwgZXZhbCBzdGVwLlxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIG1hcCwgd2hpY2ggdXNlcyBvdXRwdXQgbmFtZXMgYXMga2V5cyBhbmQgT25ueFZhbHVlIGFzIGNvcnJlc3BvbmRpbmdcbiAgIHZhbHVlcy5cbiAgICovXG4gIHJ1bkV2YWxTdGVwKFxuICAgICAgZmVlZHM6IEluZmVyZW5jZVNlc3Npb24uRmVlZHNUeXBlLCBmZXRjaGVzOiBJbmZlcmVuY2VTZXNzaW9uLkZldGNoZXNUeXBlLFxuICAgICAgb3B0aW9ucz86IEluZmVyZW5jZVNlc3Npb24uUnVuT3B0aW9ucyk6IFByb21pc2U8SW5mZXJlbmNlU2Vzc2lvbi5SZXR1cm5UeXBlPjtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBjb3B5IHBhcmFtZXRlcnNcblxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSBzaXplIG9mIGFsbCBwYXJhbWV0ZXJzIGZvciB0aGUgdHJhaW5pbmcgc3RhdGUuIENhbGN1bGF0ZXMgdGhlIHRvdGFsIG51bWJlciBvZiBwcmltaXRpdmUgKGRhdGF0eXBlIG9mXG4gICAqIHRoZSBwYXJhbWV0ZXJzKSBlbGVtZW50cyBvZiBhbGwgdGhlIHBhcmFtZXRlcnMgaW4gdGhlIHRyYWluaW5nIHN0YXRlLlxuICAgKlxuICAgKiBAcGFyYW0gdHJhaW5hYmxlT25seSAtIFdoZW4gc2V0IHRvIHRydWUsIHRoZSBzaXplIGlzIGNhbGN1bGF0ZWQgZm9yIHRyYWluYWJsZSBwYXJhbXMgb25seS4gRGVmYXVsdCB2YWx1ZSBpcyB0cnVlLlxuICAgKi9cbiAgZ2V0UGFyYW1ldGVyc1NpemUodHJhaW5hYmxlT25seTogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPjtcblxuICAvKipcbiAgICogQ29waWVzIHBhcmFtZXRlciB2YWx1ZXMgZnJvbSB0aGUgZ2l2ZW4gYnVmZmVyIHRvIHRoZSB0cmFpbmluZyBzdGF0ZS4gQ3VycmVudGx5LCBvbmx5IHN1cHBvcnRpbmcgbW9kZWxzIHdpdGhcbiAgICogcGFyYW1ldGVycyBvZiB0eXBlIEZsb2F0MzIuXG4gICAqXG4gICAqIEBwYXJhbSBidWZmZXIgLSBBIFVpbnQ4QXJyYXkgcmVwcmVzZW50YXRpb24gb2YgRmxvYXQzMiBwYXJhbWV0ZXJzLlxuICAgKiBAcGFyYW0gdHJhaW5hYmxlT25seSAtIFRydWUgaWYgdHJhaW5hYmxlIHBhcmFtZXRlcnMgb25seSB0byBiZSBtb2RpZmllZCwgZmFsc2Ugb3RoZXJ3aXNlLiBEZWZhdWx0IHZhbHVlIGlzIHRydWUuXG4gICAqL1xuICBsb2FkUGFyYW1ldGVyc0J1ZmZlcihidWZmZXI6IFVpbnQ4QXJyYXksIHRyYWluYWJsZU9ubHk6IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+O1xuXG4gIC8qKlxuICAgKiBDb3BpZXMgdGhlIG1vZGVsIHBhcmFtZXRlcnMgdG8gYSBjb250aWd1b3VzIGJ1ZmZlci4gVXN1YWxseSB1c2VkIGluIHRoZSBjb250ZXh0IG9mIEZlZGVyYXRlZCBMZWFybmluZy5cbiAgICogQ3VycmVudGx5LCBvbmx5IHN1cHBvcnRpbmcgbW9kZWxzIHdpdGggcGFyYW1ldGVycyBvZiB0eXBlIEZsb2F0MzIuXG4gICAqXG4gICAqIEBwYXJhbSB0cmFpbmFibGVPbmx5IC0gV2hlbiBzZXQgdG8gdHJ1ZSwgb25seSB0cmFpbmFibGUgcGFyYW1ldGVycyBhcmUgY29waWVkLiBUcmFpbmFibGUgcGFyYW1ldGVycyBhcmUgcGFyYW1ldGVyc1xuICAgKiBmb3Igd2hpY2ggcmVxdWlyZXNfZ3JhZCBpcyBzZXQgdG8gdHJ1ZS4gRGVmYXVsdCB2YWx1ZSBpcyB0cnVlLlxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIEZsb2F0MzIgT25ueFZhbHVlIG9mIHRoZSByZXF1ZXN0ZWQgcGFyYW1ldGVycy5cbiAgICovXG4gIGdldENvbnRpZ3VvdXNQYXJhbWV0ZXJzKHRyYWluYWJsZU9ubHk6IGJvb2xlYW4pOiBQcm9taXNlPE9ubnhWYWx1ZT47XG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIHJlbGVhc2UoKVxuXG4gIC8qKlxuICAgKiBSZWxlYXNlIHRoZSBpbmZlcmVuY2Ugc2Vzc2lvbiBhbmQgdGhlIHVuZGVybHlpbmcgcmVzb3VyY2VzLlxuICAgKi9cbiAgcmVsZWFzZSgpOiBQcm9taXNlPHZvaWQ+O1xuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBtZXRhZGF0YVxuXG4gIC8qKlxuICAgKiBHZXQgaW5wdXQgbmFtZXMgb2YgdGhlIGxvYWRlZCB0cmFpbmluZyBtb2RlbC5cbiAgICovXG4gIHJlYWRvbmx5IHRyYWluaW5nSW5wdXROYW1lczogcmVhZG9ubHkgc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEdldCBvdXRwdXQgbmFtZXMgb2YgdGhlIGxvYWRlZCB0cmFpbmluZyBtb2RlbC5cbiAgICovXG4gIHJlYWRvbmx5IHRyYWluaW5nT3V0cHV0TmFtZXM6IHJlYWRvbmx5IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBHZXQgaW5wdXQgbmFtZXMgb2YgdGhlIGxvYWRlZCBldmFsIG1vZGVsLiBJcyBhbiBlbXB0eSBhcnJheSBpZiBubyBldmFsIG1vZGVsIGlzIGxvYWRlZC5cbiAgICovXG4gIHJlYWRvbmx5IGV2YWxJbnB1dE5hbWVzOiByZWFkb25seSBzdHJpbmdbXTtcblxuICAvKipcbiAgICogR2V0IG91dHB1dCBuYW1lcyBvZiB0aGUgbG9hZGVkIGV2YWwgbW9kZWwuIElzIGFuIGVtcHR5IGFycmF5IGlmIG5vIGV2YWwgbW9kZWwgaXMgbG9hZGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgZXZhbE91dHB1dE5hbWVzOiByZWFkb25seSBzdHJpbmdbXTtcblxuICAvLyAjZW5kcmVnaW9uXG59XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgb3B0aW9uYWwgcGFyYW1ldGVycyB0aGF0IGNhbiBiZSBwYXNzZWQgaW50byB0aGUgVHJhaW5pbmdTZXNzaW9uRmFjdG9yeS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUcmFpbmluZ1Nlc3Npb25DcmVhdGVPcHRpb25zIHtcbiAgLyoqXG4gICAqIFVSSSBvciBidWZmZXIgZm9yIGEgLmNrcHQgZmlsZSB0aGF0IGNvbnRhaW5zIHRoZSBjaGVja3BvaW50IGZvciB0aGUgdHJhaW5pbmcgbW9kZWwuXG4gICAqL1xuICBjaGVja3BvaW50U3RhdGU6IFRyYWluaW5nU2Vzc2lvbi5VcmlPckJ1ZmZlcjtcbiAgLyoqXG4gICAqIFVSSSBvciBidWZmZXIgZm9yIHRoZSAub25ueCB0cmFpbmluZyBmaWxlLlxuICAgKi9cbiAgdHJhaW5Nb2RlbDogVHJhaW5pbmdTZXNzaW9uLlVyaU9yQnVmZmVyO1xuICAvKipcbiAgICogT3B0aW9uYWwuIFVSSSBvciBidWZmZXIgZm9yIHRoZSAub25ueCBvcHRpbWl6ZXIgbW9kZWwgZmlsZS5cbiAgICovXG4gIG9wdGltaXplck1vZGVsPzogVHJhaW5pbmdTZXNzaW9uLlVyaU9yQnVmZmVyO1xuICAvKipcbiAgICogT3B0aW9uYWwuIFVSSSBvciBidWZmZXIgZm9yIHRoZSAub25ueCBldmFsIG1vZGVsIGZpbGUuXG4gICAqL1xuICBldmFsTW9kZWw/OiBUcmFpbmluZ1Nlc3Npb24uVXJpT3JCdWZmZXI7XG59XG5cbi8qKlxuICogRGVmaW5lcyBtZXRob2Qgb3ZlcmxvYWQgcG9zc2liaWxpdGllcyBmb3IgY3JlYXRpbmcgYSBUcmFpbmluZ1Nlc3Npb24uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVHJhaW5pbmdTZXNzaW9uRmFjdG9yeSB7XG4gIC8vICNyZWdpb24gY3JlYXRlKClcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBUcmFpbmluZ1Nlc3Npb24gYW5kIGFzeW5jaHJvbm91c2x5IGxvYWRzIGFueSBtb2RlbHMgcGFzc2VkIGluIHRocm91Z2ggdHJhaW5pbmdPcHRpb25zXG4gICAqXG4gICAqIEBwYXJhbSB0cmFpbmluZ09wdGlvbnMgc3BlY2lmeSBtb2RlbHMgYW5kIGNoZWNrcG9pbnRzIHRvIGxvYWQgaW50byB0aGUgVHJhaW5pbmcgU2Vzc2lvblxuICAgKiBAcGFyYW0gc2Vzc2lvbk9wdGlvbnMgc3BlY2lmeSBjb25maWd1cmF0aW9uIGZvciB0cmFpbmluZyBzZXNzaW9uIGJlaGF2aW9yXG4gICAqXG4gICAqIEByZXR1cm5zIFByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIFRyYWluaW5nU2Vzc2lvbiBvYmplY3RcbiAgICovXG4gIGNyZWF0ZSh0cmFpbmluZ09wdGlvbnM6IFRyYWluaW5nU2Vzc2lvbkNyZWF0ZU9wdGlvbnMsIHNlc3Npb25PcHRpb25zPzogSW5mZXJlbmNlU2Vzc2lvbi5TZXNzaW9uT3B0aW9ucyk6XG4gICAgICBQcm9taXNlPFRyYWluaW5nU2Vzc2lvbj47XG5cbiAgLy8gI2VuZHJlZ2lvblxufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uXG5leHBvcnQgY29uc3QgVHJhaW5pbmdTZXNzaW9uOiBUcmFpbmluZ1Nlc3Npb25GYWN0b3J5ID0gVHJhaW5pbmdTZXNzaW9uSW1wbDtcbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuLyoqXG4gKiAjIE9OTlggUnVudGltZSBKYXZhU2NyaXB0IEFQSVxuICpcbiAqIE9OTlggUnVudGltZSBKYXZhU2NyaXB0IEFQSSBpcyBhIHVuaWZpZWQgQVBJIGZvciBhbGwgSmF2YVNjcmlwdCB1c2FnZXMsIGluY2x1ZGluZyB0aGUgZm9sbG93aW5nIE5QTSBwYWNrYWdlczpcbiAqXG4gKiAtIFtvbm54cnVudGltZS1ub2RlXShodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9vbm54cnVudGltZS1ub2RlKVxuICogLSBbb25ueHJ1bnRpbWUtd2ViXShodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9vbm54cnVudGltZS13ZWIpXG4gKiAtIFtvbm54cnVudGltZS1yZWFjdC1uYXRpdmVdKGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL29ubnhydW50aW1lLXJlYWN0LW5hdGl2ZSlcbiAqXG4gKiBTZWUgYWxzbzpcbiAqIC0gW0dldCBTdGFydGVkXShodHRwczovL29ubnhydW50aW1lLmFpL2RvY3MvZ2V0LXN0YXJ0ZWQvd2l0aC1qYXZhc2NyaXB0LylcbiAqIC0gW0luZmVyZW5jZSBleGFtcGxlc10oaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9vbm54cnVudGltZS1pbmZlcmVuY2UtZXhhbXBsZXMvdHJlZS9tYWluL2pzKVxuICpcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICovXG5cbmV4cG9ydCAqIGZyb20gJy4vYmFja2VuZC5qcyc7XG5leHBvcnQgKiBmcm9tICcuL2Vudi5qcyc7XG5leHBvcnQgKiBmcm9tICcuL2luZmVyZW5jZS1zZXNzaW9uLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vdGVuc29yLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vdGVuc29yLWNvbnZlcnNpb24uanMnO1xuZXhwb3J0ICogZnJvbSAnLi90ZW5zb3ItZmFjdG9yeS5qcyc7XG5leHBvcnQgKiBmcm9tICcuL3RyYWNlLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vb25ueC1tb2RlbC5qcyc7XG5leHBvcnQgKiBmcm9tICcuL29ubngtdmFsdWUuanMnO1xuZXhwb3J0ICogZnJvbSAnLi90cmFpbmluZy1zZXNzaW9uLmpzJztcbiIsICJleHBvcnQgY29uc3QgY3B1cyA9IHVuZGVmaW5lZDsiLCAiZXhwb3J0IGNvbnN0IHJlYWRGaWxlID0gdW5kZWZpbmVkO2V4cG9ydCBjb25zdCByZWFkRmlsZVN5bmMgPSB1bmRlZmluZWQ7ZXhwb3J0IGNvbnN0IGNyZWF0ZVJlYWRTdHJlYW0gPSB1bmRlZmluZWQ7IiwgImV4cG9ydCBjb25zdCBqb2luID0gdW5kZWZpbmVkOyIsICJcbnZhciBvcnRXYXNtID0gKCgpID0+IHtcbiAgdmFyIF9zY3JpcHREaXIgPSB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIGRvY3VtZW50LmN1cnJlbnRTY3JpcHQgPyBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyYyA6IHVuZGVmaW5lZDtcbiAgaWYgKHR5cGVvZiBfX2ZpbGVuYW1lICE9PSAndW5kZWZpbmVkJykgX3NjcmlwdERpciA9IF9zY3JpcHREaXIgfHwgX19maWxlbmFtZTtcbiAgcmV0dXJuIChcbmZ1bmN0aW9uKG1vZHVsZUFyZyA9IHt9KSB7XG5cbnZhciBmPW1vZHVsZUFyZyxrLGw7Zi5yZWFkeT1uZXcgUHJvbWlzZSgoYSxiKT0+e2s9YTtsPWJ9KTt2YXIgYWE9T2JqZWN0LmFzc2lnbih7fSxmKSxiYT1cIi4vdGhpcy5wcm9ncmFtXCIsY2E9XCJvYmplY3RcIj09dHlwZW9mIHdpbmRvdyxxPVwiZnVuY3Rpb25cIj09dHlwZW9mIGltcG9ydFNjcmlwdHMsZGE9XCJvYmplY3RcIj09dHlwZW9mIHByb2Nlc3MmJlwib2JqZWN0XCI9PXR5cGVvZiBwcm9jZXNzLnZlcnNpb25zJiZcInN0cmluZ1wiPT10eXBlb2YgcHJvY2Vzcy52ZXJzaW9ucy5ub2RlLHY9XCJcIix4LHosQTtcbmlmKGRhKXt2YXIgZnM9cmVxdWlyZShcImZzXCIpLEI9cmVxdWlyZShcInBhdGhcIik7dj1xP0IuZGlybmFtZSh2KStcIi9cIjpfX2Rpcm5hbWUrXCIvXCI7eD0oYSxiKT0+e2E9QyhhKT9uZXcgVVJMKGEpOkIubm9ybWFsaXplKGEpO3JldHVybiBmcy5yZWFkRmlsZVN5bmMoYSxiP3ZvaWQgMDpcInV0ZjhcIil9O0E9YT0+e2E9eChhLCEwKTthLmJ1ZmZlcnx8KGE9bmV3IFVpbnQ4QXJyYXkoYSkpO3JldHVybiBhfTt6PShhLGIsYyxlPSEwKT0+e2E9QyhhKT9uZXcgVVJMKGEpOkIubm9ybWFsaXplKGEpO2ZzLnJlYWRGaWxlKGEsZT92b2lkIDA6XCJ1dGY4XCIsKGcsaCk9PntnP2MoZyk6YihlP2guYnVmZmVyOmgpfSl9OyFmLnRoaXNQcm9ncmFtJiYxPHByb2Nlc3MuYXJndi5sZW5ndGgmJihiYT1wcm9jZXNzLmFyZ3ZbMV0ucmVwbGFjZSgvXFxcXC9nLFwiL1wiKSk7cHJvY2Vzcy5hcmd2LnNsaWNlKDIpO2YuaW5zcGVjdD0oKT0+XCJbRW1zY3JpcHRlbiBNb2R1bGUgb2JqZWN0XVwifWVsc2UgaWYoY2F8fHEpcT92PVxuc2VsZi5sb2NhdGlvbi5ocmVmOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBkb2N1bWVudCYmZG9jdW1lbnQuY3VycmVudFNjcmlwdCYmKHY9ZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmMpLF9zY3JpcHREaXImJih2PV9zY3JpcHREaXIpLDAhPT12LmluZGV4T2YoXCJibG9iOlwiKT92PXYuc3Vic3RyKDAsdi5yZXBsYWNlKC9bPyNdLiovLFwiXCIpLmxhc3RJbmRleE9mKFwiL1wiKSsxKTp2PVwiXCIseD1hPT57dmFyIGI9bmV3IFhNTEh0dHBSZXF1ZXN0O2Iub3BlbihcIkdFVFwiLGEsITEpO2Iuc2VuZChudWxsKTtyZXR1cm4gYi5yZXNwb25zZVRleHR9LHEmJihBPWE9Pnt2YXIgYj1uZXcgWE1MSHR0cFJlcXVlc3Q7Yi5vcGVuKFwiR0VUXCIsYSwhMSk7Yi5yZXNwb25zZVR5cGU9XCJhcnJheWJ1ZmZlclwiO2Iuc2VuZChudWxsKTtyZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYi5yZXNwb25zZSl9KSx6PShhLGIsYyk9Pnt2YXIgZT1uZXcgWE1MSHR0cFJlcXVlc3Q7ZS5vcGVuKFwiR0VUXCIsYSwhMCk7ZS5yZXNwb25zZVR5cGU9XG5cImFycmF5YnVmZmVyXCI7ZS5vbmxvYWQ9KCk9PnsyMDA9PWUuc3RhdHVzfHwwPT1lLnN0YXR1cyYmZS5yZXNwb25zZT9iKGUucmVzcG9uc2UpOmMoKX07ZS5vbmVycm9yPWM7ZS5zZW5kKG51bGwpfTt2YXIgZWE9Y29uc29sZS5sb2cuYmluZChjb25zb2xlKSxEPWNvbnNvbGUuZXJyb3IuYmluZChjb25zb2xlKTtPYmplY3QuYXNzaWduKGYsYWEpO2FhPW51bGw7XCJvYmplY3RcIiE9dHlwZW9mIFdlYkFzc2VtYmx5JiZFKFwibm8gbmF0aXZlIHdhc20gc3VwcG9ydCBkZXRlY3RlZFwiKTt2YXIgRixmYT0hMSxHLEgsSSxKLGhhO1xuZnVuY3Rpb24gaWEoKXt2YXIgYT1GLmJ1ZmZlcjtmLkhFQVA4PUc9bmV3IEludDhBcnJheShhKTtmLkhFQVAxNj1uZXcgSW50MTZBcnJheShhKTtmLkhFQVBVOD1IPW5ldyBVaW50OEFycmF5KGEpO2YuSEVBUFUxNj1uZXcgVWludDE2QXJyYXkoYSk7Zi5IRUFQMzI9ST1uZXcgSW50MzJBcnJheShhKTtmLkhFQVBVMzI9Sj1uZXcgVWludDMyQXJyYXkoYSk7Zi5IRUFQRjMyPW5ldyBGbG9hdDMyQXJyYXkoYSk7Zi5IRUFQRjY0PWhhPW5ldyBGbG9hdDY0QXJyYXkoYSl9dmFyIEs9W10sTD1bXSxqYT1bXSxNPTAsTj1udWxsLE89bnVsbDtmdW5jdGlvbiBFKGEpe2E9XCJBYm9ydGVkKFwiK2ErXCIpXCI7RChhKTtmYT0hMDthPW5ldyBXZWJBc3NlbWJseS5SdW50aW1lRXJyb3IoYStcIi4gQnVpbGQgd2l0aCAtc0FTU0VSVElPTlMgZm9yIG1vcmUgaW5mby5cIik7bChhKTt0aHJvdyBhO31cbnZhciBrYT1hPT5hLnN0YXJ0c1dpdGgoXCJkYXRhOmFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbTtiYXNlNjQsXCIpLEM9YT0+YS5zdGFydHNXaXRoKFwiZmlsZTovL1wiKSxQO1A9XCJvcnQtd2FzbS53YXNtXCI7aWYoIWthKFApKXt2YXIgbGE9UDtQPWYubG9jYXRlRmlsZT9mLmxvY2F0ZUZpbGUobGEsdik6ditsYX1mdW5jdGlvbiBtYShhKXtpZihBKXJldHVybiBBKGEpO3Rocm93XCJib3RoIGFzeW5jIGFuZCBzeW5jIGZldGNoaW5nIG9mIHRoZSB3YXNtIGZhaWxlZFwiO31cbmZ1bmN0aW9uIG5hKGEpe2lmKGNhfHxxKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBmZXRjaCYmIUMoYSkpcmV0dXJuIGZldGNoKGEse2NyZWRlbnRpYWxzOlwic2FtZS1vcmlnaW5cIn0pLnRoZW4oYj0+e2lmKCFiLm9rKXRocm93XCJmYWlsZWQgdG8gbG9hZCB3YXNtIGJpbmFyeSBmaWxlIGF0ICdcIithK1wiJ1wiO3JldHVybiBiLmFycmF5QnVmZmVyKCl9KS5jYXRjaCgoKT0+bWEoYSkpO2lmKHopcmV0dXJuIG5ldyBQcm9taXNlKChiLGMpPT57eihhLGU9PmIobmV3IFVpbnQ4QXJyYXkoZSkpLGMpfSl9cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCk9Pm1hKGEpKX1mdW5jdGlvbiBvYShhLGIsYyl7cmV0dXJuIG5hKGEpLnRoZW4oZT0+V2ViQXNzZW1ibHkuaW5zdGFudGlhdGUoZSxiKSkudGhlbihlPT5lKS50aGVuKGMsZT0+e0QoYGZhaWxlZCB0byBhc3luY2hyb25vdXNseSBwcmVwYXJlIHdhc206ICR7ZX1gKTtFKGUpfSl9XG5mdW5jdGlvbiBwYShhLGIpe3ZhciBjPVA7cmV0dXJuXCJmdW5jdGlvblwiIT10eXBlb2YgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGVTdHJlYW1pbmd8fGthKGMpfHxDKGMpfHxkYXx8XCJmdW5jdGlvblwiIT10eXBlb2YgZmV0Y2g/b2EoYyxhLGIpOmZldGNoKGMse2NyZWRlbnRpYWxzOlwic2FtZS1vcmlnaW5cIn0pLnRoZW4oZT0+V2ViQXNzZW1ibHkuaW5zdGFudGlhdGVTdHJlYW1pbmcoZSxhKS50aGVuKGIsZnVuY3Rpb24oZyl7RChgd2FzbSBzdHJlYW1pbmcgY29tcGlsZSBmYWlsZWQ6ICR7Z31gKTtEKFwiZmFsbGluZyBiYWNrIHRvIEFycmF5QnVmZmVyIGluc3RhbnRpYXRpb25cIik7cmV0dXJuIG9hKGMsYSxiKX0pKX1cbnZhciBRLHFhPXs3OTE3Mjg6KGEsYixjLGUpPT57aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIGZ8fCFmLnphKXJldHVybiAxO2E9UihhPj4+MCk7YS5zdGFydHNXaXRoKFwiLi9cIikmJihhPWEuc3Vic3RyaW5nKDIpKTthPWYuemEuZ2V0KGEpO2lmKCFhKXJldHVybiAyO2I+Pj49MDtjPj4+PTA7aWYoYitjPmEuYnl0ZUxlbmd0aClyZXR1cm4gMzt0cnl7cmV0dXJuIEguc2V0KGEuc3ViYXJyYXkoYixiK2MpLGU+Pj4wPj4+MCksMH1jYXRjaHtyZXR1cm4gNH19fTtmdW5jdGlvbiByYShhKXt0aGlzLnhhPWEtMjQ7dGhpcy5IYT1mdW5jdGlvbihiKXtKW3RoaXMueGErND4+PjI+Pj4wXT1ifTt0aGlzLkdhPWZ1bmN0aW9uKGIpe0pbdGhpcy54YSs4Pj4+Mj4+PjBdPWJ9O3RoaXMuQWE9ZnVuY3Rpb24oYixjKXt0aGlzLkZhKCk7dGhpcy5IYShiKTt0aGlzLkdhKGMpfTt0aGlzLkZhPWZ1bmN0aW9uKCl7Slt0aGlzLnhhKzE2Pj4+Mj4+PjBdPTB9fVxudmFyIHNhPTAsdGE9MCx1YT1cInVuZGVmaW5lZFwiIT10eXBlb2YgVGV4dERlY29kZXI/bmV3IFRleHREZWNvZGVyKFwidXRmOFwiKTp2b2lkIDAsdmE9KGEsYixjKT0+e2I+Pj49MDt2YXIgZT1iK2M7Zm9yKGM9YjthW2NdJiYhKGM+PWUpOykrK2M7aWYoMTY8Yy1iJiZhLmJ1ZmZlciYmdWEpcmV0dXJuIHVhLmRlY29kZShhLnN1YmFycmF5KGIsYykpO2ZvcihlPVwiXCI7YjxjOyl7dmFyIGc9YVtiKytdO2lmKGcmMTI4KXt2YXIgaD1hW2IrK10mNjM7aWYoMTkyPT0oZyYyMjQpKWUrPVN0cmluZy5mcm9tQ2hhckNvZGUoKGcmMzEpPDw2fGgpO2Vsc2V7dmFyIG09YVtiKytdJjYzO2c9MjI0PT0oZyYyNDApPyhnJjE1KTw8MTJ8aDw8NnxtOihnJjcpPDwxOHxoPDwxMnxtPDw2fGFbYisrXSY2Mzs2NTUzNj5nP2UrPVN0cmluZy5mcm9tQ2hhckNvZGUoZyk6KGctPTY1NTM2LGUrPVN0cmluZy5mcm9tQ2hhckNvZGUoNTUyOTZ8Zz4+MTAsNTYzMjB8ZyYxMDIzKSl9fWVsc2UgZSs9U3RyaW5nLmZyb21DaGFyQ29kZShnKX1yZXR1cm4gZX0sXG5SPShhLGIpPT4oYT4+Pj0wKT92YShILGEsYik6XCJcIixTPWE9Pntmb3IodmFyIGI9MCxjPTA7YzxhLmxlbmd0aDsrK2Mpe3ZhciBlPWEuY2hhckNvZGVBdChjKTsxMjc+PWU/YisrOjIwNDc+PWU/Yis9Mjo1NTI5Njw9ZSYmNTczNDM+PWU/KGIrPTQsKytjKTpiKz0zfXJldHVybiBifSxUPShhLGIsYyxlKT0+e2M+Pj49MDtpZighKDA8ZSkpcmV0dXJuIDA7dmFyIGc9YztlPWMrZS0xO2Zvcih2YXIgaD0wO2g8YS5sZW5ndGg7KytoKXt2YXIgbT1hLmNoYXJDb2RlQXQoaCk7aWYoNTUyOTY8PW0mJjU3MzQzPj1tKXt2YXIgcj1hLmNoYXJDb2RlQXQoKytoKTttPTY1NTM2KygobSYxMDIzKTw8MTApfHImMTAyM31pZigxMjc+PW0pe2lmKGM+PWUpYnJlYWs7YltjKys+Pj4wXT1tfWVsc2V7aWYoMjA0Nz49bSl7aWYoYysxPj1lKWJyZWFrO2JbYysrPj4+MF09MTkyfG0+PjZ9ZWxzZXtpZig2NTUzNT49bSl7aWYoYysyPj1lKWJyZWFrO2JbYysrPj4+MF09MjI0fG0+PjEyfWVsc2V7aWYoYyszPj1cbmUpYnJlYWs7YltjKys+Pj4wXT0yNDB8bT4+MTg7YltjKys+Pj4wXT0xMjh8bT4+MTImNjN9YltjKys+Pj4wXT0xMjh8bT4+NiY2M31iW2MrKz4+PjBdPTEyOHxtJjYzfX1iW2M+Pj4wXT0wO3JldHVybiBjLWd9LFU9YT0+MD09PWElNCYmKDAhPT1hJTEwMHx8MD09PWElNDAwKSx3YT1bMCwzMSw2MCw5MSwxMjEsMTUyLDE4MiwyMTMsMjQ0LDI3NCwzMDUsMzM1XSx4YT1bMCwzMSw1OSw5MCwxMjAsMTUxLDE4MSwyMTIsMjQzLDI3MywzMDQsMzM0XSxDYT1hPT57dmFyIGI9UyhhKSsxLGM9QmEoYik7YyYmVChhLEgsYyxiKTtyZXR1cm4gY30sVj1bXSxXPXt9LERhPSgpPT57aWYoIVgpe3ZhciBhPXtVU0VSOlwid2ViX3VzZXJcIixMT0dOQU1FOlwid2ViX3VzZXJcIixQQVRIOlwiL1wiLFBXRDpcIi9cIixIT01FOlwiL2hvbWUvd2ViX3VzZXJcIixMQU5HOihcIm9iamVjdFwiPT10eXBlb2YgbmF2aWdhdG9yJiZuYXZpZ2F0b3IubGFuZ3VhZ2VzJiZuYXZpZ2F0b3IubGFuZ3VhZ2VzWzBdfHxcIkNcIikucmVwbGFjZShcIi1cIixcblwiX1wiKStcIi5VVEYtOFwiLF86YmF8fFwiLi90aGlzLnByb2dyYW1cIn0sYjtmb3IoYiBpbiBXKXZvaWQgMD09PVdbYl0/ZGVsZXRlIGFbYl06YVtiXT1XW2JdO3ZhciBjPVtdO2ZvcihiIGluIGEpYy5wdXNoKGAke2J9PSR7YVtiXX1gKTtYPWN9cmV0dXJuIFh9LFgsRWE9W251bGwsW10sW11dLEZhPVszMSwyOSwzMSwzMCwzMSwzMCwzMSwzMSwzMCwzMSwzMCwzMV0sR2E9WzMxLDI4LDMxLDMwLDMxLDMwLDMxLDMxLDMwLDMxLDMwLDMxXTtmdW5jdGlvbiBIYShhKXt2YXIgYj1BcnJheShTKGEpKzEpO1QoYSxiLDAsYi5sZW5ndGgpO3JldHVybiBifVxuZnVuY3Rpb24gSWEoYSxiLGMsZSl7ZnVuY3Rpb24gZyhkLG4scCl7Zm9yKGQ9XCJudW1iZXJcIj09dHlwZW9mIGQ/ZC50b1N0cmluZygpOmR8fFwiXCI7ZC5sZW5ndGg8bjspZD1wWzBdK2Q7cmV0dXJuIGR9ZnVuY3Rpb24gaChkLG4pe3JldHVybiBnKGQsbixcIjBcIil9ZnVuY3Rpb24gbShkLG4pe2Z1bmN0aW9uIHAoeWEpe3JldHVybiAwPnlhPy0xOjA8eWE/MTowfXZhciB5OzA9PT0oeT1wKGQuZ2V0RnVsbFllYXIoKS1uLmdldEZ1bGxZZWFyKCkpKSYmMD09PSh5PXAoZC5nZXRNb250aCgpLW4uZ2V0TW9udGgoKSkpJiYoeT1wKGQuZ2V0RGF0ZSgpLW4uZ2V0RGF0ZSgpKSk7cmV0dXJuIHl9ZnVuY3Rpb24gcihkKXtzd2l0Y2goZC5nZXREYXkoKSl7Y2FzZSAwOnJldHVybiBuZXcgRGF0ZShkLmdldEZ1bGxZZWFyKCktMSwxMSwyOSk7Y2FzZSAxOnJldHVybiBkO2Nhc2UgMjpyZXR1cm4gbmV3IERhdGUoZC5nZXRGdWxsWWVhcigpLDAsMyk7Y2FzZSAzOnJldHVybiBuZXcgRGF0ZShkLmdldEZ1bGxZZWFyKCksXG4wLDIpO2Nhc2UgNDpyZXR1cm4gbmV3IERhdGUoZC5nZXRGdWxsWWVhcigpLDAsMSk7Y2FzZSA1OnJldHVybiBuZXcgRGF0ZShkLmdldEZ1bGxZZWFyKCktMSwxMSwzMSk7Y2FzZSA2OnJldHVybiBuZXcgRGF0ZShkLmdldEZ1bGxZZWFyKCktMSwxMSwzMCl9fWZ1bmN0aW9uIHcoZCl7dmFyIG49ZC50YTtmb3IoZD1uZXcgRGF0ZSgobmV3IERhdGUoZC51YSsxOTAwLDAsMSkpLmdldFRpbWUoKSk7MDxuOyl7dmFyIHA9ZC5nZXRNb250aCgpLHk9KFUoZC5nZXRGdWxsWWVhcigpKT9GYTpHYSlbcF07aWYobj55LWQuZ2V0RGF0ZSgpKW4tPXktZC5nZXREYXRlKCkrMSxkLnNldERhdGUoMSksMTE+cD9kLnNldE1vbnRoKHArMSk6KGQuc2V0TW9udGgoMCksZC5zZXRGdWxsWWVhcihkLmdldEZ1bGxZZWFyKCkrMSkpO2Vsc2V7ZC5zZXREYXRlKGQuZ2V0RGF0ZSgpK24pO2JyZWFrfX1wPW5ldyBEYXRlKGQuZ2V0RnVsbFllYXIoKSsxLDAsNCk7bj1yKG5ldyBEYXRlKGQuZ2V0RnVsbFllYXIoKSxcbjAsNCkpO3A9cihwKTtyZXR1cm4gMD49bShuLGQpPzA+PW0ocCxkKT9kLmdldEZ1bGxZZWFyKCkrMTpkLmdldEZ1bGxZZWFyKCk6ZC5nZXRGdWxsWWVhcigpLTF9YT4+Pj0wO2I+Pj49MDtjPj4+PTA7ZT4+Pj0wO3ZhciB0PUpbZSs0MD4+PjI+Pj4wXTtlPXtEYTpJW2U+Pj4yPj4+MF0sQ2E6SVtlKzQ+Pj4yPj4+MF0sdmE6SVtlKzg+Pj4yPj4+MF0seWE6SVtlKzEyPj4+Mj4+PjBdLHdhOklbZSsxNj4+PjI+Pj4wXSx1YTpJW2UrMjA+Pj4yPj4+MF0sb2E6SVtlKzI0Pj4+Mj4+PjBdLHRhOklbZSsyOD4+PjI+Pj4wXSxJYTpJW2UrMzI+Pj4yPj4+MF0sQmE6SVtlKzM2Pj4+Mj4+PjBdLEVhOnQ/Uih0KTpcIlwifTtjPVIoYyk7dD17XCIlY1wiOlwiJWEgJWIgJWQgJUg6JU06JVMgJVlcIixcIiVEXCI6XCIlbS8lZC8leVwiLFwiJUZcIjpcIiVZLSVtLSVkXCIsXCIlaFwiOlwiJWJcIixcIiVyXCI6XCIlSTolTTolUyAlcFwiLFwiJVJcIjpcIiVIOiVNXCIsXCIlVFwiOlwiJUg6JU06JVNcIixcIiV4XCI6XCIlbS8lZC8leVwiLFwiJVhcIjpcIiVIOiVNOiVTXCIsXG5cIiVFY1wiOlwiJWNcIixcIiVFQ1wiOlwiJUNcIixcIiVFeFwiOlwiJW0vJWQvJXlcIixcIiVFWFwiOlwiJUg6JU06JVNcIixcIiVFeVwiOlwiJXlcIixcIiVFWVwiOlwiJVlcIixcIiVPZFwiOlwiJWRcIixcIiVPZVwiOlwiJWVcIixcIiVPSFwiOlwiJUhcIixcIiVPSVwiOlwiJUlcIixcIiVPbVwiOlwiJW1cIixcIiVPTVwiOlwiJU1cIixcIiVPU1wiOlwiJVNcIixcIiVPdVwiOlwiJXVcIixcIiVPVVwiOlwiJVVcIixcIiVPVlwiOlwiJVZcIixcIiVPd1wiOlwiJXdcIixcIiVPV1wiOlwiJVdcIixcIiVPeVwiOlwiJXlcIn07Zm9yKHZhciB1IGluIHQpYz1jLnJlcGxhY2UobmV3IFJlZ0V4cCh1LFwiZ1wiKSx0W3VdKTt2YXIgemE9XCJTdW5kYXkgTW9uZGF5IFR1ZXNkYXkgV2VkbmVzZGF5IFRodXJzZGF5IEZyaWRheSBTYXR1cmRheVwiLnNwbGl0KFwiIFwiKSxBYT1cIkphbnVhcnkgRmVicnVhcnkgTWFyY2ggQXByaWwgTWF5IEp1bmUgSnVseSBBdWd1c3QgU2VwdGVtYmVyIE9jdG9iZXIgTm92ZW1iZXIgRGVjZW1iZXJcIi5zcGxpdChcIiBcIik7dD17XCIlYVwiOmQ9PnphW2Qub2FdLnN1YnN0cmluZygwLDMpLFwiJUFcIjpkPT56YVtkLm9hXSxcblwiJWJcIjpkPT5BYVtkLndhXS5zdWJzdHJpbmcoMCwzKSxcIiVCXCI6ZD0+QWFbZC53YV0sXCIlQ1wiOmQ9PmgoKGQudWErMTkwMCkvMTAwfDAsMiksXCIlZFwiOmQ9PmgoZC55YSwyKSxcIiVlXCI6ZD0+ZyhkLnlhLDIsXCIgXCIpLFwiJWdcIjpkPT53KGQpLnRvU3RyaW5nKCkuc3Vic3RyaW5nKDIpLFwiJUdcIjpkPT53KGQpLFwiJUhcIjpkPT5oKGQudmEsMiksXCIlSVwiOmQ9PntkPWQudmE7MD09ZD9kPTEyOjEyPGQmJihkLT0xMik7cmV0dXJuIGgoZCwyKX0sXCIlalwiOmQ9Pntmb3IodmFyIG49MCxwPTA7cDw9ZC53YS0xO24rPShVKGQudWErMTkwMCk/RmE6R2EpW3ArK10pO3JldHVybiBoKGQueWErbiwzKX0sXCIlbVwiOmQ9PmgoZC53YSsxLDIpLFwiJU1cIjpkPT5oKGQuQ2EsMiksXCIlblwiOigpPT5cIlxcblwiLFwiJXBcIjpkPT4wPD1kLnZhJiYxMj5kLnZhP1wiQU1cIjpcIlBNXCIsXCIlU1wiOmQ9PmgoZC5EYSwyKSxcIiV0XCI6KCk9PlwiXFx0XCIsXCIldVwiOmQ9PmQub2F8fDcsXCIlVVwiOmQ9PmgoTWF0aC5mbG9vcigoZC50YSs3LWQub2EpLzcpLFxuMiksXCIlVlwiOmQ9Pnt2YXIgbj1NYXRoLmZsb29yKChkLnRhKzctKGQub2ErNiklNykvNyk7Mj49KGQub2ErMzcxLWQudGEtMiklNyYmbisrO2lmKG4pNTM9PW4mJihwPShkLm9hKzM3MS1kLnRhKSU3LDQ9PXB8fDM9PXAmJlUoZC51YSl8fChuPTEpKTtlbHNle249NTI7dmFyIHA9KGQub2ErNy1kLnRhLTEpJTc7KDQ9PXB8fDU9PXAmJlUoZC51YSU0MDAtMSkpJiZuKyt9cmV0dXJuIGgobiwyKX0sXCIld1wiOmQ9PmQub2EsXCIlV1wiOmQ9PmgoTWF0aC5mbG9vcigoZC50YSs3LShkLm9hKzYpJTcpLzcpLDIpLFwiJXlcIjpkPT4oZC51YSsxOTAwKS50b1N0cmluZygpLnN1YnN0cmluZygyKSxcIiVZXCI6ZD0+ZC51YSsxOTAwLFwiJXpcIjpkPT57ZD1kLkJhO3ZhciBuPTA8PWQ7ZD1NYXRoLmFicyhkKS82MDtyZXR1cm4obj9cIitcIjpcIi1cIikrU3RyaW5nKFwiMDAwMFwiKyhkLzYwKjEwMCtkJTYwKSkuc2xpY2UoLTQpfSxcIiVaXCI6ZD0+ZC5FYSxcIiUlXCI6KCk9PlwiJVwifTtjPWMucmVwbGFjZSgvJSUvZyxcIlxceDAwXFx4MDBcIik7XG5mb3IodSBpbiB0KWMuaW5jbHVkZXModSkmJihjPWMucmVwbGFjZShuZXcgUmVnRXhwKHUsXCJnXCIpLHRbdV0oZSkpKTtjPWMucmVwbGFjZSgvXFwwXFwwL2csXCIlXCIpO3U9SGEoYyk7aWYodS5sZW5ndGg+YilyZXR1cm4gMDtHLnNldCh1LGE+Pj4wKTtyZXR1cm4gdS5sZW5ndGgtMX1cbnZhciBMYT17YTpmdW5jdGlvbihhLGIsYyl7YT4+Pj0wOyhuZXcgcmEoYSkpLkFhKGI+Pj4wLGM+Pj4wKTtzYT1hO3RhKys7dGhyb3cgc2E7fSxlOmZ1bmN0aW9uKCl7cmV0dXJuIDB9LEg6ZnVuY3Rpb24oKXt9LHg6ZnVuY3Rpb24oKXt9LHo6ZnVuY3Rpb24oKXt9LEo6ZnVuY3Rpb24oKXtyZXR1cm4gMH0sRjpmdW5jdGlvbigpe30sQTpmdW5jdGlvbigpe30sRTpmdW5jdGlvbigpe30sZzpmdW5jdGlvbigpe30seTpmdW5jdGlvbigpe30sdjpmdW5jdGlvbigpe30sRzpmdW5jdGlvbigpe30sdzpmdW5jdGlvbigpe30sazooKT0+MSxuOmZ1bmN0aW9uKGEsYixjKXthPWIrMjA5NzE1Mj4+PjA8NDE5NDMwNS0hIWE/KGE+Pj4wKSs0Mjk0OTY3Mjk2KmI6TmFOO2M+Pj49MDthPW5ldyBEYXRlKDFFMyphKTtJW2M+Pj4yPj4+MF09YS5nZXRVVENTZWNvbmRzKCk7SVtjKzQ+Pj4yPj4+MF09YS5nZXRVVENNaW51dGVzKCk7SVtjKzg+Pj4yPj4+MF09YS5nZXRVVENIb3VycygpO0lbYysxMj4+PlxuMj4+PjBdPWEuZ2V0VVRDRGF0ZSgpO0lbYysxNj4+PjI+Pj4wXT1hLmdldFVUQ01vbnRoKCk7SVtjKzIwPj4+Mj4+PjBdPWEuZ2V0VVRDRnVsbFllYXIoKS0xOTAwO0lbYysyND4+PjI+Pj4wXT1hLmdldFVUQ0RheSgpO0lbYysyOD4+PjI+Pj4wXT0oYS5nZXRUaW1lKCktRGF0ZS5VVEMoYS5nZXRVVENGdWxsWWVhcigpLDAsMSwwLDAsMCwwKSkvODY0RTV8MH0sbzpmdW5jdGlvbihhLGIsYyl7YT1iKzIwOTcxNTI+Pj4wPDQxOTQzMDUtISFhPyhhPj4+MCkrNDI5NDk2NzI5NipiOk5hTjtjPj4+PTA7YT1uZXcgRGF0ZSgxRTMqYSk7SVtjPj4+Mj4+PjBdPWEuZ2V0U2Vjb25kcygpO0lbYys0Pj4+Mj4+PjBdPWEuZ2V0TWludXRlcygpO0lbYys4Pj4+Mj4+PjBdPWEuZ2V0SG91cnMoKTtJW2MrMTI+Pj4yPj4+MF09YS5nZXREYXRlKCk7SVtjKzE2Pj4+Mj4+PjBdPWEuZ2V0TW9udGgoKTtJW2MrMjA+Pj4yPj4+MF09YS5nZXRGdWxsWWVhcigpLTE5MDA7SVtjKzI0Pj4+Mj4+PjBdPWEuZ2V0RGF5KCk7XG5JW2MrMjg+Pj4yPj4+MF09KFUoYS5nZXRGdWxsWWVhcigpKT93YTp4YSlbYS5nZXRNb250aCgpXSthLmdldERhdGUoKS0xfDA7SVtjKzM2Pj4+Mj4+PjBdPS0oNjAqYS5nZXRUaW1lem9uZU9mZnNldCgpKTtiPShuZXcgRGF0ZShhLmdldEZ1bGxZZWFyKCksNiwxKSkuZ2V0VGltZXpvbmVPZmZzZXQoKTt2YXIgZT0obmV3IERhdGUoYS5nZXRGdWxsWWVhcigpLDAsMSkpLmdldFRpbWV6b25lT2Zmc2V0KCk7SVtjKzMyPj4+Mj4+PjBdPShiIT1lJiZhLmdldFRpbWV6b25lT2Zmc2V0KCk9PU1hdGgubWluKGUsYikpfDB9LHA6ZnVuY3Rpb24oYSl7YT4+Pj0wO3ZhciBiPW5ldyBEYXRlKElbYSsyMD4+PjI+Pj4wXSsxOTAwLElbYSsxNj4+PjI+Pj4wXSxJW2ErMTI+Pj4yPj4+MF0sSVthKzg+Pj4yPj4+MF0sSVthKzQ+Pj4yPj4+MF0sSVthPj4+Mj4+PjBdLDApLGM9SVthKzMyPj4+Mj4+PjBdLGU9Yi5nZXRUaW1lem9uZU9mZnNldCgpLGc9KG5ldyBEYXRlKGIuZ2V0RnVsbFllYXIoKSw2LDEpKS5nZXRUaW1lem9uZU9mZnNldCgpLFxuaD0obmV3IERhdGUoYi5nZXRGdWxsWWVhcigpLDAsMSkpLmdldFRpbWV6b25lT2Zmc2V0KCksbT1NYXRoLm1pbihoLGcpOzA+Yz9JW2ErMzI+Pj4yPj4+MF09TnVtYmVyKGchPWgmJm09PWUpOjA8YyE9KG09PWUpJiYoZz1NYXRoLm1heChoLGcpLGIuc2V0VGltZShiLmdldFRpbWUoKSs2RTQqKCgwPGM/bTpnKS1lKSkpO0lbYSsyND4+PjI+Pj4wXT1iLmdldERheSgpO0lbYSsyOD4+PjI+Pj4wXT0oVShiLmdldEZ1bGxZZWFyKCkpP3dhOnhhKVtiLmdldE1vbnRoKCldK2IuZ2V0RGF0ZSgpLTF8MDtJW2E+Pj4yPj4+MF09Yi5nZXRTZWNvbmRzKCk7SVthKzQ+Pj4yPj4+MF09Yi5nZXRNaW51dGVzKCk7SVthKzg+Pj4yPj4+MF09Yi5nZXRIb3VycygpO0lbYSsxMj4+PjI+Pj4wXT1iLmdldERhdGUoKTtJW2ErMTY+Pj4yPj4+MF09Yi5nZXRNb250aCgpO0lbYSsyMD4+PjI+Pj4wXT1iLmdldFllYXIoKTthPWIuZ2V0VGltZSgpO2lzTmFOKGEpPyhJW0phKCk+Pj4yPj4+MF09NjEsYT0tMSk6XG5hLz0xRTM7cmV0dXJuIEthKChRPWEsMTw9K01hdGguYWJzKFEpPzA8UT8rTWF0aC5mbG9vcihRLzQyOTQ5NjcyOTYpPj4+MDp+fitNYXRoLmNlaWwoKFEtKyh+flE+Pj4wKSkvNDI5NDk2NzI5Nik+Pj4wOjApKSxhPj4+MH0sbDpmdW5jdGlvbigpe3JldHVybi01Mn0sbTpmdW5jdGlvbigpe30sdDpmdW5jdGlvbihhLGIsYyl7ZnVuY3Rpb24gZSh3KXtyZXR1cm4odz13LnRvVGltZVN0cmluZygpLm1hdGNoKC9cXCgoW0EtWmEteiBdKylcXCkkLykpP3dbMV06XCJHTVRcIn1jPj4+PTA7dmFyIGc9KG5ldyBEYXRlKS5nZXRGdWxsWWVhcigpLGg9bmV3IERhdGUoZywwLDEpLG09bmV3IERhdGUoZyw2LDEpO2c9aC5nZXRUaW1lem9uZU9mZnNldCgpO3ZhciByPW0uZ2V0VGltZXpvbmVPZmZzZXQoKTtKW2E+Pj4wPj4+Mj4+PjBdPTYwKk1hdGgubWF4KGcscik7SVtiPj4+MD4+PjI+Pj4wXT1OdW1iZXIoZyE9cik7YT1lKGgpO2I9ZShtKTthPUNhKGEpO2I9Q2EoYik7cjxnPyhKW2M+Pj4yPj4+MF09XG5hLEpbYys0Pj4+Mj4+PjBdPWIpOihKW2M+Pj4yPj4+MF09YixKW2MrND4+PjI+Pj4wXT1hKX0sZDooKT0+e0UoXCJcIil9LEI6ZnVuY3Rpb24oYSxiLGMpe2E+Pj49MDtiPj4+PTA7Yz4+Pj0wO1YubGVuZ3RoPTA7Zm9yKHZhciBlO2U9SFtiKys+Pj4wXTspe3ZhciBnPTEwNSE9ZTtnJj0xMTIhPWU7Yys9ZyYmYyU4PzQ6MDtWLnB1c2goMTEyPT1lP0pbYz4+PjI+Pj4wXToxMDU9PWU/SVtjPj4+Mj4+PjBdOmhhW2M+Pj4zPj4+MF0pO2MrPWc/ODo0fXJldHVybiBxYVthXS5hcHBseShudWxsLFYpfSxoOigpPT5EYXRlLm5vdygpLHU6ZnVuY3Rpb24oKXtyZXR1cm4gNDI5NDkwMTc2MH0sYjooKT0+cGVyZm9ybWFuY2Uubm93KCksSTpmdW5jdGlvbihhLGIsYyl7Yj4+Pj0wO3JldHVybiBILmNvcHlXaXRoaW4oYT4+PjA+Pj4wLGI+Pj4wLGIrKGM+Pj4wKT4+PjApfSxzOmZ1bmN0aW9uKGEpe2E+Pj49MDt2YXIgYj1ILmxlbmd0aDtpZig0Mjk0OTAxNzYwPGEpcmV0dXJuITE7Zm9yKHZhciBjPVxuMTs0Pj1jO2MqPTIpe3ZhciBlPWIqKDErLjIvYyk7ZT1NYXRoLm1pbihlLGErMTAwNjYzMjk2KTt2YXIgZz1NYXRoO2U9TWF0aC5tYXgoYSxlKTthOntnPShnLm1pbi5jYWxsKGcsNDI5NDkwMTc2MCxlKyg2NTUzNi1lJTY1NTM2KSU2NTUzNiktRi5idWZmZXIuYnl0ZUxlbmd0aCs2NTUzNSkvNjU1MzY7dHJ5e0YuZ3JvdyhnKTtpYSgpO3ZhciBoPTE7YnJlYWsgYX1jYXRjaChtKXt9aD12b2lkIDB9aWYoaClyZXR1cm4hMH1yZXR1cm4hMX0sQzpmdW5jdGlvbihhLGIpe2E+Pj49MDtiPj4+PTA7dmFyIGM9MDtEYSgpLmZvckVhY2goKGUsZyk9Pnt2YXIgaD1iK2M7Zz1KW2ErNCpnPj4+Mj4+PjBdPWg7Zm9yKGg9MDtoPGUubGVuZ3RoOysraClHW2crKz4+PjA+Pj4wXT1lLmNoYXJDb2RlQXQoaCk7R1tnPj4+MD4+PjBdPTA7Yys9ZS5sZW5ndGgrMX0pO3JldHVybiAwfSxEOmZ1bmN0aW9uKGEsYil7YT4+Pj0wO2I+Pj49MDt2YXIgYz1EYSgpO0pbYT4+PjI+Pj4wXT1jLmxlbmd0aDt2YXIgZT1cbjA7Yy5mb3JFYWNoKGc9PmUrPWcubGVuZ3RoKzEpO0pbYj4+PjI+Pj4wXT1lO3JldHVybiAwfSxmOigpPT41MixqOmZ1bmN0aW9uKCl7cmV0dXJuIDUyfSxxOmZ1bmN0aW9uKCl7cmV0dXJuIDcwfSxpOmZ1bmN0aW9uKGEsYixjLGUpe2I+Pj49MDtjPj4+PTA7ZT4+Pj0wO2Zvcih2YXIgZz0wLGg9MDtoPGM7aCsrKXt2YXIgbT1KW2I+Pj4yPj4+MF0scj1KW2IrND4+PjI+Pj4wXTtiKz04O2Zvcih2YXIgdz0wO3c8cjt3Kyspe3ZhciB0PUhbbSt3Pj4+MF0sdT1FYVthXTswPT09dHx8MTA9PT10PygoMT09PWE/ZWE6RCkodmEodSwwKSksdS5sZW5ndGg9MCk6dS5wdXNoKHQpfWcrPXJ9SltlPj4+Mj4+PjBdPWc7cmV0dXJuIDB9LHI6SWEsYzpmdW5jdGlvbihhLGIsYyxlKXtyZXR1cm4gSWEoYT4+PjAsYj4+PjAsYz4+PjAsZT4+PjApfX0sWT1mdW5jdGlvbigpe2Z1bmN0aW9uIGEoYyl7WT1jLmV4cG9ydHM7WT1NYSgpO0Y9WS5LO2lhKCk7TC51bnNoaWZ0KFkuTCk7TS0tOzA9PU0mJihudWxsIT09XG5OJiYoY2xlYXJJbnRlcnZhbChOKSxOPW51bGwpLE8mJihjPU8sTz1udWxsLGMoKSkpO3JldHVybiBZfXZhciBiPXthOkxhfTtNKys7aWYoZi5pbnN0YW50aWF0ZVdhc20pdHJ5e3JldHVybiBmLmluc3RhbnRpYXRlV2FzbShiLGEpfWNhdGNoKGMpe0QoYE1vZHVsZS5pbnN0YW50aWF0ZVdhc20gY2FsbGJhY2sgZmFpbGVkIHdpdGggZXJyb3I6ICR7Y31gKSxsKGMpfXBhKGIsZnVuY3Rpb24oYyl7YShjLmluc3RhbmNlKX0pLmNhdGNoKGwpO3JldHVybnt9fSgpO2YuX09ydEluaXQ9KGEsYik9PihmLl9PcnRJbml0PVkuTSkoYSxiKTtmLl9PcnRHZXRMYXN0RXJyb3I9KGEsYik9PihmLl9PcnRHZXRMYXN0RXJyb3I9WS5OKShhLGIpO2YuX09ydENyZWF0ZVNlc3Npb25PcHRpb25zPShhLGIsYyxlLGcsaCxtLHIsdyx0KT0+KGYuX09ydENyZWF0ZVNlc3Npb25PcHRpb25zPVkuTykoYSxiLGMsZSxnLGgsbSxyLHcsdCk7XG5mLl9PcnRBcHBlbmRFeGVjdXRpb25Qcm92aWRlcj0oYSxiKT0+KGYuX09ydEFwcGVuZEV4ZWN1dGlvblByb3ZpZGVyPVkuUCkoYSxiKTtmLl9PcnRBZGRGcmVlRGltZW5zaW9uT3ZlcnJpZGU9KGEsYixjKT0+KGYuX09ydEFkZEZyZWVEaW1lbnNpb25PdmVycmlkZT1ZLlEpKGEsYixjKTtmLl9PcnRBZGRTZXNzaW9uQ29uZmlnRW50cnk9KGEsYixjKT0+KGYuX09ydEFkZFNlc3Npb25Db25maWdFbnRyeT1ZLlIpKGEsYixjKTtmLl9PcnRSZWxlYXNlU2Vzc2lvbk9wdGlvbnM9YT0+KGYuX09ydFJlbGVhc2VTZXNzaW9uT3B0aW9ucz1ZLlMpKGEpO2YuX09ydENyZWF0ZVNlc3Npb249KGEsYixjKT0+KGYuX09ydENyZWF0ZVNlc3Npb249WS5UKShhLGIsYyk7Zi5fT3J0UmVsZWFzZVNlc3Npb249YT0+KGYuX09ydFJlbGVhc2VTZXNzaW9uPVkuVSkoYSk7Zi5fT3J0R2V0SW5wdXRPdXRwdXRDb3VudD0oYSxiLGMpPT4oZi5fT3J0R2V0SW5wdXRPdXRwdXRDb3VudD1ZLlYpKGEsYixjKTtcbmYuX09ydEdldElucHV0TmFtZT0oYSxiKT0+KGYuX09ydEdldElucHV0TmFtZT1ZLlcpKGEsYik7Zi5fT3J0R2V0T3V0cHV0TmFtZT0oYSxiKT0+KGYuX09ydEdldE91dHB1dE5hbWU9WS5YKShhLGIpO2YuX09ydEZyZWU9YT0+KGYuX09ydEZyZWU9WS5ZKShhKTtmLl9PcnRDcmVhdGVUZW5zb3I9KGEsYixjLGUsZyxoKT0+KGYuX09ydENyZWF0ZVRlbnNvcj1ZLlopKGEsYixjLGUsZyxoKTtmLl9PcnRHZXRUZW5zb3JEYXRhPShhLGIsYyxlLGcpPT4oZi5fT3J0R2V0VGVuc29yRGF0YT1ZLl8pKGEsYixjLGUsZyk7Zi5fT3J0UmVsZWFzZVRlbnNvcj1hPT4oZi5fT3J0UmVsZWFzZVRlbnNvcj1ZLiQpKGEpO2YuX09ydENyZWF0ZVJ1bk9wdGlvbnM9KGEsYixjLGUpPT4oZi5fT3J0Q3JlYXRlUnVuT3B0aW9ucz1ZLmFhKShhLGIsYyxlKTtmLl9PcnRBZGRSdW5Db25maWdFbnRyeT0oYSxiLGMpPT4oZi5fT3J0QWRkUnVuQ29uZmlnRW50cnk9WS5iYSkoYSxiLGMpO1xuZi5fT3J0UmVsZWFzZVJ1bk9wdGlvbnM9YT0+KGYuX09ydFJlbGVhc2VSdW5PcHRpb25zPVkuY2EpKGEpO2YuX09ydENyZWF0ZUJpbmRpbmc9YT0+KGYuX09ydENyZWF0ZUJpbmRpbmc9WS5kYSkoYSk7Zi5fT3J0QmluZElucHV0PShhLGIsYyk9PihmLl9PcnRCaW5kSW5wdXQ9WS5lYSkoYSxiLGMpO2YuX09ydEJpbmRPdXRwdXQ9KGEsYixjLGUpPT4oZi5fT3J0QmluZE91dHB1dD1ZLmZhKShhLGIsYyxlKTtmLl9PcnRDbGVhckJvdW5kT3V0cHV0cz1hPT4oZi5fT3J0Q2xlYXJCb3VuZE91dHB1dHM9WS5nYSkoYSk7Zi5fT3J0UmVsZWFzZUJpbmRpbmc9YT0+KGYuX09ydFJlbGVhc2VCaW5kaW5nPVkuaGEpKGEpO2YuX09ydFJ1bldpdGhCaW5kaW5nPShhLGIsYyxlLGcpPT4oZi5fT3J0UnVuV2l0aEJpbmRpbmc9WS5pYSkoYSxiLGMsZSxnKTtmLl9PcnRSdW49KGEsYixjLGUsZyxoLG0scik9PihmLl9PcnRSdW49WS5qYSkoYSxiLGMsZSxnLGgsbSxyKTtcbmYuX09ydEVuZFByb2ZpbGluZz1hPT4oZi5fT3J0RW5kUHJvZmlsaW5nPVkua2EpKGEpO3ZhciBKYT0oKT0+KEphPVkubGEpKCksQmE9Zi5fbWFsbG9jPWE9PihCYT1mLl9tYWxsb2M9WS5tYSkoYSk7Zi5fZnJlZT1hPT4oZi5fZnJlZT1ZLm5hKShhKTt2YXIgS2E9YT0+KEthPVkucGEpKGEpLE5hPSgpPT4oTmE9WS5xYSkoKSxPYT1hPT4oT2E9WS5yYSkoYSksUGE9YT0+KFBhPVkuc2EpKGEpO2Z1bmN0aW9uIE1hKCl7dmFyIGE9WTthPU9iamVjdC5hc3NpZ24oe30sYSk7dmFyIGI9ZT0+KCk9PmUoKT4+PjAsYz1lPT5nPT5lKGcpPj4+MDthLmxhPWIoYS5sYSk7YS5tYT1jKGEubWEpO2EucWE9YihhLnFhKTthLnNhPWMoYS5zYSk7cmV0dXJuIGF9Zi5zdGFja0FsbG9jPVBhO2Yuc3RhY2tTYXZlPU5hO2Yuc3RhY2tSZXN0b3JlPU9hO2YuVVRGOFRvU3RyaW5nPVI7Zi5zdHJpbmdUb1VURjg9KGEsYixjKT0+VChhLEgsYixjKTtmLmxlbmd0aEJ5dGVzVVRGOD1TO3ZhciBaO1xuTz1mdW5jdGlvbiBRYSgpe1p8fFJhKCk7Wnx8KE89UWEpfTtmdW5jdGlvbiBSYSgpe2lmKCEoMDxNKSl7aWYoZi5wcmVSdW4pZm9yKFwiZnVuY3Rpb25cIj09dHlwZW9mIGYucHJlUnVuJiYoZi5wcmVSdW49W2YucHJlUnVuXSk7Zi5wcmVSdW4ubGVuZ3RoOyl7dmFyIGE9Zi5wcmVSdW4uc2hpZnQoKTtLLnVuc2hpZnQoYSl9Zm9yKDswPEsubGVuZ3RoOylLLnNoaWZ0KCkoZik7aWYoISgwPE18fFp8fChaPSEwLGYuY2FsbGVkUnVuPSEwLGZhKSkpe2Zvcig7MDxMLmxlbmd0aDspTC5zaGlmdCgpKGYpO2ZvcihrKGYpOzA8amEubGVuZ3RoOylqYS5zaGlmdCgpKGYpfX19UmEoKTtcblxuXG4gIHJldHVybiBtb2R1bGVBcmcucmVhZHlcbn1cbik7XG59KSgpO1xuO1xuaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JylcbiAgbW9kdWxlLmV4cG9ydHMgPSBvcnRXYXNtO1xuZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmVbJ2FtZCddKVxuICBkZWZpbmUoW10sICgpID0+IG9ydFdhc20pO1xuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ25vZGU6cGF0aCc7XG5pbXBvcnQge0Vudn0gZnJvbSAnb25ueHJ1bnRpbWUtY29tbW9uJztcblxuaW1wb3J0IHtPcnRXYXNtTW9kdWxlfSBmcm9tICcuL2JpbmRpbmcvb3J0LXdhc20nO1xuaW1wb3J0IHtPcnRXYXNtVGhyZWFkZWRNb2R1bGV9IGZyb20gJy4vYmluZGluZy9vcnQtd2FzbS10aHJlYWRlZCc7XG5cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHMgKi9cbmxldCBvcnRXYXNtRmFjdG9yeTogRW1zY3JpcHRlbk1vZHVsZUZhY3Rvcnk8T3J0V2FzbU1vZHVsZT47XG5cbmlmICghQlVJTERfREVGUy5ESVNBQkxFX1RSQUlOSU5HKSB7XG4gIG9ydFdhc21GYWN0b3J5ID0gcmVxdWlyZSgnLi9iaW5kaW5nL29ydC10cmFpbmluZy13YXNtLXNpbWQuanMnKTtcbn0gZWxzZSB7XG4gIG9ydFdhc21GYWN0b3J5ID1cbiAgICAgIEJVSUxEX0RFRlMuRElTQUJMRV9XRUJHUFUgPyByZXF1aXJlKCcuL2JpbmRpbmcvb3J0LXdhc20uanMnKSA6IHJlcXVpcmUoJy4vYmluZGluZy9vcnQtd2FzbS1zaW1kLmpzZXAuanMnKTtcbn1cblxuY29uc3Qgb3J0V2FzbUZhY3RvcnlUaHJlYWRlZDogRW1zY3JpcHRlbk1vZHVsZUZhY3Rvcnk8T3J0V2FzbU1vZHVsZT4gPSAhQlVJTERfREVGUy5ESVNBQkxFX1dBU01fVEhSRUFEID9cbiAgICAoQlVJTERfREVGUy5ESVNBQkxFX1dFQkdQVSA/IHJlcXVpcmUoJy4vYmluZGluZy9vcnQtd2FzbS10aHJlYWRlZC5qcycpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmUoJy4vYmluZGluZy9vcnQtd2FzbS1zaW1kLXRocmVhZGVkLmpzZXAuanMnKSkgOlxuICAgIG9ydFdhc21GYWN0b3J5O1xuLyogZXNsaW50LWVuYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzICovXG5cbmxldCB3YXNtOiBPcnRXYXNtTW9kdWxlfHVuZGVmaW5lZDtcbmxldCBpbml0aWFsaXplZCA9IGZhbHNlO1xubGV0IGluaXRpYWxpemluZyA9IGZhbHNlO1xubGV0IGFib3J0ZWQgPSBmYWxzZTtcblxuY29uc3QgaXNNdWx0aVRocmVhZFN1cHBvcnRlZCA9IChudW1UaHJlYWRzOiBudW1iZXIpOiBib29sZWFuID0+IHtcbiAgLy8gV2ViQXNzZW1ibHkgdGhyZWFkcyBhcmUgc2V0IHRvIDEgKHNpbmdsZSB0aHJlYWQpLlxuICBpZiAobnVtVGhyZWFkcyA9PT0gMSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIElmICdTaGFyZWRBcnJheUJ1ZmZlcicgaXMgbm90IGF2YWlsYWJsZSwgV2ViQXNzZW1ibHkgdGhyZWFkcyB3aWxsIG5vdCB3b3JrLlxuICBpZiAodHlwZW9mIFNoYXJlZEFycmF5QnVmZmVyID09PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgJiYgIXNlbGYuY3Jvc3NPcmlnaW5Jc29sYXRlZCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAnZW52Lndhc20ubnVtVGhyZWFkcyBpcyBzZXQgdG8gJyArIG51bVRocmVhZHMgK1xuICAgICAgICAgICcsIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgdW5sZXNzIHlvdSBlbmFibGUgY3Jvc3NPcmlnaW5Jc29sYXRlZCBtb2RlLiAnICtcbiAgICAgICAgICAnU2VlIGh0dHBzOi8vd2ViLmRldi9jcm9zcy1vcmlnaW4taXNvbGF0aW9uLWd1aWRlLyBmb3IgbW9yZSBpbmZvLicpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBvbm54cnVudGltZS13ZWIgZG9lcyBub3Qgc3VwcG9ydCBtdWx0aS10aHJlYWRzIGluIE5vZGUuanMuXG4gIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGUpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ2Vudi53YXNtLm51bVRocmVhZHMgaXMgc2V0IHRvICcgKyBudW1UaHJlYWRzICtcbiAgICAgICAgJywgaG93ZXZlciwgY3VycmVudGx5IG9ubnhydW50aW1lLXdlYiBkb2VzIG5vdCBzdXBwb3J0IG11bHRpLXRocmVhZHMgaW4gTm9kZS5qcy4gJyArXG4gICAgICAgICdQbGVhc2UgY29uc2lkZXIgdXNpbmcgb25ueHJ1bnRpbWUtbm9kZSBmb3IgcGVyZm9ybWFuY2UgY3JpdGljYWwgc2NlbmFyaW9zLicpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyBUZXN0IGZvciB0cmFuc2ZlcmFiaWxpdHkgb2YgU0FCcyAoZm9yIGJyb3dzZXJzLiBuZWVkZWQgZm9yIEZpcmVmb3gpXG4gICAgLy8gaHR0cHM6Ly9ncm91cHMuZ29vZ2xlLmNvbS9mb3J1bS8jIW1zZy9tb3ppbGxhLmRldi5wbGF0Zm9ybS9JSGtCWmxIRVRwQS9kd3NNTmNoV0VRQUpcbiAgICBpZiAodHlwZW9mIE1lc3NhZ2VDaGFubmVsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgbmV3IE1lc3NhZ2VDaGFubmVsKCkucG9ydDEucG9zdE1lc3NhZ2UobmV3IFNoYXJlZEFycmF5QnVmZmVyKDEpKTtcbiAgICB9XG5cbiAgICAvLyBUZXN0IGZvciBXZWJBc3NlbWJseSB0aHJlYWRzIGNhcGFiaWxpdHkgKGZvciBib3RoIGJyb3dzZXJzIGFuZCBOb2RlLmpzKVxuICAgIC8vIFRoaXMgdHlwZWQgYXJyYXkgaXMgYSBXZWJBc3NlbWJseSBwcm9ncmFtIGNvbnRhaW5pbmcgdGhyZWFkZWQgaW5zdHJ1Y3Rpb25zLlxuICAgIHJldHVybiBXZWJBc3NlbWJseS52YWxpZGF0ZShuZXcgVWludDhBcnJheShbXG4gICAgICAwLCA5NywgMTE1LCAxMDksIDEsIDAsICAwLCAgMCwgMSwgNCwgMSwgIDk2LCAwLCAgIDAsICAzLCAyLCAxLCAgMCwgNSxcbiAgICAgIDQsIDEsICAzLCAgIDEsICAgMSwgMTAsIDExLCAxLCA5LCAwLCA2NSwgMCwgIDI1NCwgMTYsIDIsIDAsIDI2LCAxMVxuICAgIF0pKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuY29uc3QgaXNTaW1kU3VwcG9ydGVkID0gKCk6IGJvb2xlYW4gPT4ge1xuICB0cnkge1xuICAgIC8vIFRlc3QgZm9yIFdlYkFzc2VtYmx5IFNJTUQgY2FwYWJpbGl0eSAoZm9yIGJvdGggYnJvd3NlcnMgYW5kIE5vZGUuanMpXG4gICAgLy8gVGhpcyB0eXBlZCBhcnJheSBpcyBhIFdlYkFzc2VtYmx5IHByb2dyYW0gY29udGFpbmluZyBTSU1EIGluc3RydWN0aW9ucy5cblxuICAgIC8vIFRoZSBiaW5hcnkgZGF0YSBpcyBnZW5lcmF0ZWQgZnJvbSB0aGUgZm9sbG93aW5nIGNvZGUgYnkgd2F0Mndhc206XG4gICAgLy9cbiAgICAvLyAobW9kdWxlXG4gICAgLy8gICAodHlwZSAkdDAgKGZ1bmMpKVxuICAgIC8vICAgKGZ1bmMgJGYwICh0eXBlICR0MClcbiAgICAvLyAgICAgKGRyb3BcbiAgICAvLyAgICAgICAoaTMyeDQuZG90X2kxNng4X3NcbiAgICAvLyAgICAgICAgIChpOHgxNi5zcGxhdFxuICAgIC8vICAgICAgICAgICAoaTMyLmNvbnN0IDApKVxuICAgIC8vICAgICAgICAgKHYxMjguY29uc3QgaTMyeDQgMHgwMDAwMDAwMCAweDAwMDAwMDAwIDB4MDAwMDAwMDAgMHgwMDAwMDAwMCkpKSkpXG5cbiAgICByZXR1cm4gV2ViQXNzZW1ibHkudmFsaWRhdGUobmV3IFVpbnQ4QXJyYXkoW1xuICAgICAgMCwgICA5NywgMTE1LCAxMDksIDEsIDAsIDAsIDAsIDEsIDQsIDEsIDk2LCAwLCAwLCAzLCAyLCAxLCAwLCAxMCwgMzAsIDEsICAgMjgsICAwLCA2NSwgMCxcbiAgICAgIDI1MywgMTUsIDI1MywgMTIsICAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAgMCwgMCwgMCwgMCwgMCwgMCwgMCwgIDAsICAyNTMsIDE4NiwgMSwgMjYsIDExXG4gICAgXSkpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5jb25zdCBnZXRXYXNtRmlsZU5hbWUgPSAodXNlU2ltZDogYm9vbGVhbiwgdXNlVGhyZWFkczogYm9vbGVhbikgPT4ge1xuICBpZiAodXNlU2ltZCkge1xuICAgIGlmICghQlVJTERfREVGUy5ESVNBQkxFX1RSQUlOSU5HKSB7XG4gICAgICByZXR1cm4gJ29ydC10cmFpbmluZy13YXNtLXNpbWQud2FzbSc7XG4gICAgfVxuICAgIHJldHVybiB1c2VUaHJlYWRzID8gJ29ydC13YXNtLXNpbWQtdGhyZWFkZWQud2FzbScgOiAnb3J0LXdhc20tc2ltZC53YXNtJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdXNlVGhyZWFkcyA/ICdvcnQtd2FzbS10aHJlYWRlZC53YXNtJyA6ICdvcnQtd2FzbS53YXNtJztcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxpemVXZWJBc3NlbWJseSA9IGFzeW5jKGZsYWdzOiBFbnYuV2ViQXNzZW1ibHlGbGFncyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICBpZiAoaW5pdGlhbGl6ZWQpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cbiAgaWYgKGluaXRpYWxpemluZykge1xuICAgIHRocm93IG5ldyBFcnJvcignbXVsdGlwbGUgY2FsbHMgdG8gXFwnaW5pdGlhbGl6ZVdlYkFzc2VtYmx5KClcXCcgZGV0ZWN0ZWQuJyk7XG4gIH1cbiAgaWYgKGFib3J0ZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3ByZXZpb3VzIGNhbGwgdG8gXFwnaW5pdGlhbGl6ZVdlYkFzc2VtYmx5KClcXCcgZmFpbGVkLicpO1xuICB9XG5cbiAgaW5pdGlhbGl6aW5nID0gdHJ1ZTtcblxuICAvLyB3YXNtIGZsYWdzIGFyZSBhbHJlYWR5IGluaXRpYWxpemVkXG4gIGNvbnN0IHRpbWVvdXQgPSBmbGFncy5pbml0VGltZW91dCE7XG4gIGNvbnN0IG51bVRocmVhZHMgPSBmbGFncy5udW1UaHJlYWRzITtcbiAgY29uc3Qgc2ltZCA9IGZsYWdzLnNpbWQhO1xuXG4gIGNvbnN0IHVzZVRocmVhZHMgPSBpc011bHRpVGhyZWFkU3VwcG9ydGVkKG51bVRocmVhZHMpO1xuICBjb25zdCB1c2VTaW1kID0gc2ltZCAmJiBpc1NpbWRTdXBwb3J0ZWQoKTtcblxuICBjb25zdCB3YXNtUGF0aHMgPSBmbGFncy53YXNtUGF0aHM7XG4gIGNvbnN0IHdhc21QcmVmaXhPdmVycmlkZSA9IHR5cGVvZiB3YXNtUGF0aHMgPT09ICdzdHJpbmcnID8gd2FzbVBhdGhzIDogdW5kZWZpbmVkO1xuICBjb25zdCB3YXNtRmlsZU5hbWUgPSBnZXRXYXNtRmlsZU5hbWUodXNlU2ltZCwgdXNlVGhyZWFkcyk7XG4gIGNvbnN0IHdhc21QYXRoT3ZlcnJpZGUgPSB0eXBlb2Ygd2FzbVBhdGhzID09PSAnb2JqZWN0JyA/IHdhc21QYXRoc1t3YXNtRmlsZU5hbWVdIDogdW5kZWZpbmVkO1xuXG4gIGxldCBpc1RpbWVvdXQgPSBmYWxzZTtcblxuICBjb25zdCB0YXNrczogQXJyYXk8UHJvbWlzZTx2b2lkPj4gPSBbXTtcblxuICAvLyBwcm9taXNlIGZvciB0aW1lb3V0XG4gIGlmICh0aW1lb3V0ID4gMCkge1xuICAgIHRhc2tzLnB1c2gobmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpc1RpbWVvdXQgPSB0cnVlO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9LCB0aW1lb3V0KTtcbiAgICB9KSk7XG4gIH1cblxuICAvLyBwcm9taXNlIGZvciBtb2R1bGUgaW5pdGlhbGl6YXRpb25cbiAgdGFza3MucHVzaChuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgZmFjdG9yeSA9IHVzZVRocmVhZHMgPyBvcnRXYXNtRmFjdG9yeVRocmVhZGVkIDogb3J0V2FzbUZhY3Rvcnk7XG4gICAgY29uc3QgY29uZmlnOiBQYXJ0aWFsPE9ydFdhc21Nb2R1bGU+ID0ge1xuICAgICAgbG9jYXRlRmlsZTogKGZpbGVOYW1lOiBzdHJpbmcsIHNjcmlwdERpcmVjdG9yeTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGlmICghQlVJTERfREVGUy5ESVNBQkxFX1dBU01fVEhSRUFEICYmIHVzZVRocmVhZHMgJiYgZmlsZU5hbWUuZW5kc1dpdGgoJy53b3JrZXIuanMnKSAmJlxuICAgICAgICAgICAgdHlwZW9mIEJsb2IgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgcmV0dXJuIFVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAvLyBUaGlzIHJlcXVpcmUoKSBmdW5jdGlvbiBpcyBoYW5kbGVkIGJ5IGVzYnVpbGQgcGx1Z2luIHRvIGxvYWQgZmlsZSBjb250ZW50IGFzIHN0cmluZy5cbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xuICAgICAgICAgICAgICAgIHJlcXVpcmUoJy4vYmluZGluZy9vcnQtd2FzbS10aHJlYWRlZC53b3JrZXIuanMnKVxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB7dHlwZTogJ3RleHQvamF2YXNjcmlwdCd9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZmlsZU5hbWUuZW5kc1dpdGgoJy53YXNtJykpIHtcbiAgICAgICAgICBpZiAod2FzbVBhdGhPdmVycmlkZSkge1xuICAgICAgICAgICAgcmV0dXJuIHdhc21QYXRoT3ZlcnJpZGU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgcHJlZml4ID0gd2FzbVByZWZpeE92ZXJyaWRlID8/IHNjcmlwdERpcmVjdG9yeTtcblxuICAgICAgICAgIGlmICghQlVJTERfREVGUy5ESVNBQkxFX1dFQkdQVSkge1xuICAgICAgICAgICAgaWYgKHdhc21GaWxlTmFtZSA9PT0gJ29ydC13YXNtLXNpbWQud2FzbScpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHByZWZpeCArICdvcnQtd2FzbS1zaW1kLmpzZXAud2FzbSc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHdhc21GaWxlTmFtZSA9PT0gJ29ydC13YXNtLXNpbWQtdGhyZWFkZWQud2FzbScpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHByZWZpeCArICdvcnQtd2FzbS1zaW1kLXRocmVhZGVkLmpzZXAud2FzbSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHByZWZpeCArIHdhc21GaWxlTmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzY3JpcHREaXJlY3RvcnkgKyBmaWxlTmFtZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKCFCVUlMRF9ERUZTLkRJU0FCTEVfV0FTTV9USFJFQUQgJiYgdXNlVGhyZWFkcykge1xuICAgICAgY29uZmlnLm51bVRocmVhZHMgPSBudW1UaHJlYWRzO1xuICAgICAgaWYgKHR5cGVvZiBCbG9iID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjb25maWcubWFpblNjcmlwdFVybE9yQmxvYiA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdvcnQtd2FzbS10aHJlYWRlZC5qcycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc2NyaXB0U291cmNlQ29kZSA9IGB2YXIgb3J0V2FzbVRocmVhZGVkPSR7ZmFjdG9yeS50b1N0cmluZygpfTtgO1xuICAgICAgICBjb25maWcubWFpblNjcmlwdFVybE9yQmxvYiA9IG5ldyBCbG9iKFtzY3JpcHRTb3VyY2VDb2RlXSwge3R5cGU6ICd0ZXh0L2phdmFzY3JpcHQnfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZmFjdG9yeShjb25maWcpLnRoZW4oXG4gICAgICAgIC8vIHdhc20gbW9kdWxlIGluaXRpYWxpemVkIHN1Y2Nlc3NmdWxseVxuICAgICAgICBtb2R1bGUgPT4ge1xuICAgICAgICAgIGluaXRpYWxpemluZyA9IGZhbHNlO1xuICAgICAgICAgIGluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgICB3YXNtID0gbW9kdWxlO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gd2FzbSBtb2R1bGUgZmFpbGVkIHRvIGluaXRpYWxpemVcbiAgICAgICAgKHdoYXQpID0+IHtcbiAgICAgICAgICBpbml0aWFsaXppbmcgPSBmYWxzZTtcbiAgICAgICAgICBhYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgICByZWplY3Qod2hhdCk7XG4gICAgICAgIH0pO1xuICB9KSk7XG5cbiAgYXdhaXQgUHJvbWlzZS5yYWNlKHRhc2tzKTtcblxuICBpZiAoaXNUaW1lb3V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBXZWJBc3NlbWJseSBiYWNrZW5kIGluaXRpYWxpemluZyBmYWlsZWQgZHVlIHRvIHRpbWVvdXQ6ICR7dGltZW91dH1tc2ApO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0SW5zdGFuY2UgPSAoKTogT3J0V2FzbU1vZHVsZSA9PiB7XG4gIGlmIChpbml0aWFsaXplZCAmJiB3YXNtKSB7XG4gICAgcmV0dXJuIHdhc207XG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoJ1dlYkFzc2VtYmx5IGlzIG5vdCBpbml0aWFsaXplZCB5ZXQuJyk7XG59O1xuXG5leHBvcnQgY29uc3QgZGlzcG9zZSA9ICgpOiB2b2lkID0+IHtcbiAgaWYgKGluaXRpYWxpemVkICYmICFpbml0aWFsaXppbmcgJiYgIWFib3J0ZWQpIHtcbiAgICBpbml0aWFsaXppbmcgPSB0cnVlO1xuXG4gICAgKHdhc20gYXMgT3J0V2FzbVRocmVhZGVkTW9kdWxlKS5QVGhyZWFkPy50ZXJtaW5hdGVBbGxUaHJlYWRzKCk7XG4gICAgd2FzbSA9IHVuZGVmaW5lZDtcblxuICAgIGluaXRpYWxpemluZyA9IGZhbHNlO1xuICAgIGluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgYWJvcnRlZCA9IHRydWU7XG4gIH1cbn07XG4iLCAiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5cbmltcG9ydCB7Z2V0SW5zdGFuY2V9IGZyb20gJy4vd2FzbS1mYWN0b3J5JztcblxuZXhwb3J0IGNvbnN0IGFsbG9jV2FzbVN0cmluZyA9IChkYXRhOiBzdHJpbmcsIGFsbG9jczogbnVtYmVyW10pOiBudW1iZXIgPT4ge1xuICBjb25zdCB3YXNtID0gZ2V0SW5zdGFuY2UoKTtcblxuICBjb25zdCBkYXRhTGVuZ3RoID0gd2FzbS5sZW5ndGhCeXRlc1VURjgoZGF0YSkgKyAxO1xuICBjb25zdCBkYXRhT2Zmc2V0ID0gd2FzbS5fbWFsbG9jKGRhdGFMZW5ndGgpO1xuICB3YXNtLnN0cmluZ1RvVVRGOChkYXRhLCBkYXRhT2Zmc2V0LCBkYXRhTGVuZ3RoKTtcbiAgYWxsb2NzLnB1c2goZGF0YU9mZnNldCk7XG5cbiAgcmV0dXJuIGRhdGFPZmZzZXQ7XG59O1xuXG5pbnRlcmZhY2UgRXh0cmFPcHRpb25zSGFuZGxlciB7XG4gIChuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiB2b2lkO1xufVxuXG5leHBvcnQgY29uc3QgaXRlcmF0ZUV4dHJhT3B0aW9ucyA9XG4gICAgKG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCBwcmVmaXg6IHN0cmluZywgc2VlbjogV2Vha1NldDxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4sXG4gICAgIGhhbmRsZXI6IEV4dHJhT3B0aW9uc0hhbmRsZXIpOiB2b2lkID0+IHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PSAnb2JqZWN0JyAmJiBvcHRpb25zICE9PSBudWxsKSB7XG4gICAgICAgIGlmIChzZWVuLmhhcyhvcHRpb25zKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2lyY3VsYXIgcmVmZXJlbmNlIGluIG9wdGlvbnMnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWVuLmFkZChvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBPYmplY3QuZW50cmllcyhvcHRpb25zKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgY29uc3QgbmFtZSA9IChwcmVmaXgpID8gcHJlZml4ICsga2V5IDoga2V5O1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIGl0ZXJhdGVFeHRyYU9wdGlvbnModmFsdWUgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIG5hbWUgKyAnLicsIHNlZW4sIGhhbmRsZXIpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIGhhbmRsZXIobmFtZSwgdmFsdWUudG9TdHJpbmcoKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICBoYW5kbGVyKG5hbWUsICh2YWx1ZSkgPyAnMScgOiAnMCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2FuJ3QgaGFuZGxlIGV4dHJhIGNvbmZpZyB0eXBlOiAke3R5cGVvZiB2YWx1ZX1gKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuLyoqXG4gKiBjaGVjayB3ZWIgYXNzZW1ibHkgQVBJJ3MgbGFzdCBlcnJvciBhbmQgdGhyb3cgZXJyb3IgaWYgYW55IGVycm9yIG9jY3VycmVkLlxuICogQHBhcmFtIG1lc3NhZ2UgYSBtZXNzYWdlIHVzZWQgd2hlbiBhbiBlcnJvciBvY2N1cnJlZC5cbiAqL1xuZXhwb3J0IGNvbnN0IGNoZWNrTGFzdEVycm9yID0gKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQgPT4ge1xuICBjb25zdCB3YXNtID0gZ2V0SW5zdGFuY2UoKTtcblxuICBjb25zdCBzdGFjayA9IHdhc20uc3RhY2tTYXZlKCk7XG4gIHRyeSB7XG4gICAgY29uc3QgcGFyYW1zT2Zmc2V0ID0gd2FzbS5zdGFja0FsbG9jKDgpO1xuICAgIHdhc20uX09ydEdldExhc3RFcnJvcihwYXJhbXNPZmZzZXQsIHBhcmFtc09mZnNldCArIDQpO1xuICAgIGNvbnN0IGVycm9yQ29kZSA9IHdhc20uSEVBUDMyW3BhcmFtc09mZnNldCAvIDRdO1xuICAgIGNvbnN0IGVycm9yTWVzc2FnZVBvaW50ZXIgPSB3YXNtLkhFQVBVMzJbcGFyYW1zT2Zmc2V0IC8gNCArIDFdO1xuICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGVycm9yTWVzc2FnZVBvaW50ZXIgPyB3YXNtLlVURjhUb1N0cmluZyhlcnJvck1lc3NhZ2VQb2ludGVyKSA6ICcnO1xuICAgIHRocm93IG5ldyBFcnJvcihgJHttZXNzYWdlfSBFUlJPUl9DT0RFOiAke2Vycm9yQ29kZX0sIEVSUk9SX01FU1NBR0U6ICR7ZXJyb3JNZXNzYWdlfWApO1xuICB9IGZpbmFsbHkge1xuICAgIHdhc20uc3RhY2tSZXN0b3JlKHN0YWNrKTtcbiAgfVxufTtcbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuaW1wb3J0IHtJbmZlcmVuY2VTZXNzaW9ufSBmcm9tICdvbm54cnVudGltZS1jb21tb24nO1xuXG5pbXBvcnQge2dldEluc3RhbmNlfSBmcm9tICcuL3dhc20tZmFjdG9yeSc7XG5pbXBvcnQge2FsbG9jV2FzbVN0cmluZywgY2hlY2tMYXN0RXJyb3IsIGl0ZXJhdGVFeHRyYU9wdGlvbnN9IGZyb20gJy4vd2FzbS11dGlscyc7XG5cbmV4cG9ydCBjb25zdCBzZXRSdW5PcHRpb25zID0gKG9wdGlvbnM6IEluZmVyZW5jZVNlc3Npb24uUnVuT3B0aW9ucyk6IFtudW1iZXIsIG51bWJlcltdXSA9PiB7XG4gIGNvbnN0IHdhc20gPSBnZXRJbnN0YW5jZSgpO1xuICBsZXQgcnVuT3B0aW9uc0hhbmRsZSA9IDA7XG4gIGNvbnN0IGFsbG9jczogbnVtYmVyW10gPSBbXTtcblxuICBjb25zdCBydW5PcHRpb25zOiBJbmZlcmVuY2VTZXNzaW9uLlJ1bk9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHRyeSB7XG4gICAgaWYgKG9wdGlvbnM/LmxvZ1NldmVyaXR5TGV2ZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcnVuT3B0aW9ucy5sb2dTZXZlcml0eUxldmVsID0gMjsgIC8vIERlZmF1bHQgdG8gd2FybmluZ1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHR5cGVvZiBvcHRpb25zLmxvZ1NldmVyaXR5TGV2ZWwgIT09ICdudW1iZXInIHx8ICFOdW1iZXIuaXNJbnRlZ2VyKG9wdGlvbnMubG9nU2V2ZXJpdHlMZXZlbCkgfHxcbiAgICAgICAgb3B0aW9ucy5sb2dTZXZlcml0eUxldmVsIDwgMCB8fCBvcHRpb25zLmxvZ1NldmVyaXR5TGV2ZWwgPiA0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGxvZyBzZXJ2ZXJpdHkgbGV2ZWwgaXMgbm90IHZhbGlkOiAke29wdGlvbnMubG9nU2V2ZXJpdHlMZXZlbH1gKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucz8ubG9nVmVyYm9zaXR5TGV2ZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcnVuT3B0aW9ucy5sb2dWZXJib3NpdHlMZXZlbCA9IDA7ICAvLyBEZWZhdWx0IHRvIDBcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmxvZ1ZlcmJvc2l0eUxldmVsICE9PSAnbnVtYmVyJyB8fCAhTnVtYmVyLmlzSW50ZWdlcihvcHRpb25zLmxvZ1ZlcmJvc2l0eUxldmVsKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBsb2cgdmVyYm9zaXR5IGxldmVsIGlzIG5vdCB2YWxpZDogJHtvcHRpb25zLmxvZ1ZlcmJvc2l0eUxldmVsfWApO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zPy50ZXJtaW5hdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcnVuT3B0aW9ucy50ZXJtaW5hdGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgdGFnRGF0YU9mZnNldCA9IDA7XG4gICAgaWYgKG9wdGlvbnM/LnRhZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0YWdEYXRhT2Zmc2V0ID0gYWxsb2NXYXNtU3RyaW5nKG9wdGlvbnMudGFnLCBhbGxvY3MpO1xuICAgIH1cblxuICAgIHJ1bk9wdGlvbnNIYW5kbGUgPSB3YXNtLl9PcnRDcmVhdGVSdW5PcHRpb25zKFxuICAgICAgICBydW5PcHRpb25zLmxvZ1NldmVyaXR5TGV2ZWwhLCBydW5PcHRpb25zLmxvZ1ZlcmJvc2l0eUxldmVsISwgISFydW5PcHRpb25zLnRlcm1pbmF0ZSEsIHRhZ0RhdGFPZmZzZXQpO1xuICAgIGlmIChydW5PcHRpb25zSGFuZGxlID09PSAwKSB7XG4gICAgICBjaGVja0xhc3RFcnJvcignQ2FuXFwndCBjcmVhdGUgcnVuIG9wdGlvbnMuJyk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnM/LmV4dHJhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGl0ZXJhdGVFeHRyYU9wdGlvbnMob3B0aW9ucy5leHRyYSwgJycsIG5ldyBXZWFrU2V0PFJlY29yZDxzdHJpbmcsIHVua25vd24+PigpLCAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICBjb25zdCBrZXlEYXRhT2Zmc2V0ID0gYWxsb2NXYXNtU3RyaW5nKGtleSwgYWxsb2NzKTtcbiAgICAgICAgY29uc3QgdmFsdWVEYXRhT2Zmc2V0ID0gYWxsb2NXYXNtU3RyaW5nKHZhbHVlLCBhbGxvY3MpO1xuXG4gICAgICAgIGlmICh3YXNtLl9PcnRBZGRSdW5Db25maWdFbnRyeShydW5PcHRpb25zSGFuZGxlLCBrZXlEYXRhT2Zmc2V0LCB2YWx1ZURhdGFPZmZzZXQpICE9PSAwKSB7XG4gICAgICAgICAgY2hlY2tMYXN0RXJyb3IoYENhbid0IHNldCBhIHJ1biBjb25maWcgZW50cnk6ICR7a2V5fSAtICR7dmFsdWV9LmApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gW3J1bk9wdGlvbnNIYW5kbGUsIGFsbG9jc107XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAocnVuT3B0aW9uc0hhbmRsZSAhPT0gMCkge1xuICAgICAgd2FzbS5fT3J0UmVsZWFzZVJ1bk9wdGlvbnMocnVuT3B0aW9uc0hhbmRsZSk7XG4gICAgfVxuICAgIGFsbG9jcy5mb3JFYWNoKGFsbG9jID0+IHdhc20uX2ZyZWUoYWxsb2MpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQge0luZmVyZW5jZVNlc3Npb259IGZyb20gJ29ubnhydW50aW1lLWNvbW1vbic7XG5cbmltcG9ydCB7Z2V0SW5zdGFuY2V9IGZyb20gJy4vd2FzbS1mYWN0b3J5JztcbmltcG9ydCB7YWxsb2NXYXNtU3RyaW5nLCBjaGVja0xhc3RFcnJvciwgaXRlcmF0ZUV4dHJhT3B0aW9uc30gZnJvbSAnLi93YXNtLXV0aWxzJztcblxuY29uc3QgZ2V0R3JhcGhPcHRpbXphdGlvbkxldmVsID0gKGdyYXBoT3B0aW1pemF0aW9uTGV2ZWw6IHN0cmluZ3x1bmtub3duKTogbnVtYmVyID0+IHtcbiAgc3dpdGNoIChncmFwaE9wdGltaXphdGlvbkxldmVsKSB7XG4gICAgY2FzZSAnZGlzYWJsZWQnOlxuICAgICAgcmV0dXJuIDA7XG4gICAgY2FzZSAnYmFzaWMnOlxuICAgICAgcmV0dXJuIDE7XG4gICAgY2FzZSAnZXh0ZW5kZWQnOlxuICAgICAgcmV0dXJuIDI7XG4gICAgY2FzZSAnYWxsJzpcbiAgICAgIHJldHVybiA5OTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bnN1cHBvcnRlZCBncmFwaCBvcHRpbWl6YXRpb24gbGV2ZWw6ICR7Z3JhcGhPcHRpbWl6YXRpb25MZXZlbH1gKTtcbiAgfVxufTtcblxuY29uc3QgZ2V0RXhlY3V0aW9uTW9kZSA9IChleGVjdXRpb25Nb2RlOiAnc2VxdWVudGlhbCd8J3BhcmFsbGVsJyk6IG51bWJlciA9PiB7XG4gIHN3aXRjaCAoZXhlY3V0aW9uTW9kZSkge1xuICAgIGNhc2UgJ3NlcXVlbnRpYWwnOlxuICAgICAgcmV0dXJuIDA7XG4gICAgY2FzZSAncGFyYWxsZWwnOlxuICAgICAgcmV0dXJuIDE7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdW5zdXBwb3J0ZWQgZXhlY3V0aW9uIG1vZGU6ICR7ZXhlY3V0aW9uTW9kZX1gKTtcbiAgfVxufTtcblxuY29uc3QgYXBwZW5kRGVmYXVsdE9wdGlvbnMgPSAob3B0aW9uczogSW5mZXJlbmNlU2Vzc2lvbi5TZXNzaW9uT3B0aW9ucyk6IHZvaWQgPT4ge1xuICBpZiAoIW9wdGlvbnMuZXh0cmEpIHtcbiAgICBvcHRpb25zLmV4dHJhID0ge307XG4gIH1cbiAgaWYgKCFvcHRpb25zLmV4dHJhLnNlc3Npb24pIHtcbiAgICBvcHRpb25zLmV4dHJhLnNlc3Npb24gPSB7fTtcbiAgfVxuICBjb25zdCBzZXNzaW9uID0gb3B0aW9ucy5leHRyYS5zZXNzaW9uIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIGlmICghc2Vzc2lvbi51c2Vfb3J0X21vZGVsX2J5dGVzX2RpcmVjdGx5KSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxuICAgIHNlc3Npb24udXNlX29ydF9tb2RlbF9ieXRlc19kaXJlY3RseSA9ICcxJztcbiAgfVxuXG4gIC8vIGlmIHVzaW5nIEpTRVAgd2l0aCBXZWJHUFUsIGFsd2F5cyBkaXNhYmxlIG1lbW9yeSBwYXR0ZXJuXG4gIGlmIChvcHRpb25zLmV4ZWN1dGlvblByb3ZpZGVycyAmJlxuICAgICAgb3B0aW9ucy5leGVjdXRpb25Qcm92aWRlcnMuc29tZShlcCA9PiAodHlwZW9mIGVwID09PSAnc3RyaW5nJyA/IGVwIDogZXAubmFtZSkgPT09ICd3ZWJncHUnKSkge1xuICAgIG9wdGlvbnMuZW5hYmxlTWVtUGF0dGVybiA9IGZhbHNlO1xuICB9XG59O1xuXG5jb25zdCBzZXRFeGVjdXRpb25Qcm92aWRlcnMgPVxuICAgIChzZXNzaW9uT3B0aW9uc0hhbmRsZTogbnVtYmVyLCBleGVjdXRpb25Qcm92aWRlcnM6IHJlYWRvbmx5IEluZmVyZW5jZVNlc3Npb24uRXhlY3V0aW9uUHJvdmlkZXJDb25maWdbXSxcbiAgICAgYWxsb2NzOiBudW1iZXJbXSk6IHZvaWQgPT4ge1xuICAgICAgZm9yIChjb25zdCBlcCBvZiBleGVjdXRpb25Qcm92aWRlcnMpIHtcbiAgICAgICAgbGV0IGVwTmFtZSA9IHR5cGVvZiBlcCA9PT0gJ3N0cmluZycgPyBlcCA6IGVwLm5hbWU7XG5cbiAgICAgICAgLy8gY2hlY2sgRVAgbmFtZVxuICAgICAgICBzd2l0Y2ggKGVwTmFtZSkge1xuICAgICAgICAgIGNhc2UgJ3dlYm5uJzpcbiAgICAgICAgICAgIGVwTmFtZSA9ICdXRUJOTic7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGVwICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICBjb25zdCB3ZWJubk9wdGlvbnMgPSBlcCBhcyBJbmZlcmVuY2VTZXNzaW9uLldlYk5ORXhlY3V0aW9uUHJvdmlkZXJPcHRpb247XG4gICAgICAgICAgICAgIGlmICh3ZWJubk9wdGlvbnM/LmRldmljZVR5cGUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXlEYXRhT2Zmc2V0ID0gYWxsb2NXYXNtU3RyaW5nKCdkZXZpY2VUeXBlJywgYWxsb2NzKTtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZURhdGFPZmZzZXQgPSBhbGxvY1dhc21TdHJpbmcod2Vibm5PcHRpb25zLmRldmljZVR5cGUsIGFsbG9jcyk7XG4gICAgICAgICAgICAgICAgaWYgKGdldEluc3RhbmNlKCkuX09ydEFkZFNlc3Npb25Db25maWdFbnRyeShzZXNzaW9uT3B0aW9uc0hhbmRsZSwga2V5RGF0YU9mZnNldCwgdmFsdWVEYXRhT2Zmc2V0KSAhPT1cbiAgICAgICAgICAgICAgICAgICAgMCkge1xuICAgICAgICAgICAgICAgICAgY2hlY2tMYXN0RXJyb3IoYENhbid0IHNldCBhIHNlc3Npb24gY29uZmlnIGVudHJ5OiAnZGV2aWNlVHlwZScgLSAke3dlYm5uT3B0aW9ucy5kZXZpY2VUeXBlfS5gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHdlYm5uT3B0aW9ucz8ubnVtVGhyZWFkcykge1xuICAgICAgICAgICAgICAgIGxldCBudW1UaHJlYWRzID0gd2Vibm5PcHRpb25zLm51bVRocmVhZHM7XG4gICAgICAgICAgICAgICAgLy8gSnVzdCBpZ25vcmUgaW52YWxpZCB3ZWJubk9wdGlvbnMubnVtVGhyZWFkcy5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG51bVRocmVhZHMgIT0gJ251bWJlcicgfHwgIU51bWJlci5pc0ludGVnZXIobnVtVGhyZWFkcykgfHwgbnVtVGhyZWFkcyA8IDApIHtcbiAgICAgICAgICAgICAgICAgIG51bVRocmVhZHMgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBrZXlEYXRhT2Zmc2V0ID0gYWxsb2NXYXNtU3RyaW5nKCdudW1UaHJlYWRzJywgYWxsb2NzKTtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZURhdGFPZmZzZXQgPSBhbGxvY1dhc21TdHJpbmcobnVtVGhyZWFkcy50b1N0cmluZygpLCBhbGxvY3MpO1xuICAgICAgICAgICAgICAgIGlmIChnZXRJbnN0YW5jZSgpLl9PcnRBZGRTZXNzaW9uQ29uZmlnRW50cnkoc2Vzc2lvbk9wdGlvbnNIYW5kbGUsIGtleURhdGFPZmZzZXQsIHZhbHVlRGF0YU9mZnNldCkgIT09XG4gICAgICAgICAgICAgICAgICAgIDApIHtcbiAgICAgICAgICAgICAgICAgIGNoZWNrTGFzdEVycm9yKGBDYW4ndCBzZXQgYSBzZXNzaW9uIGNvbmZpZyBlbnRyeTogJ251bVRocmVhZHMnIC0gJHt3ZWJubk9wdGlvbnMubnVtVGhyZWFkc30uYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICh3ZWJubk9wdGlvbnM/LnBvd2VyUHJlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleURhdGFPZmZzZXQgPSBhbGxvY1dhc21TdHJpbmcoJ3Bvd2VyUHJlZmVyZW5jZScsIGFsbG9jcyk7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWVEYXRhT2Zmc2V0ID0gYWxsb2NXYXNtU3RyaW5nKHdlYm5uT3B0aW9ucy5wb3dlclByZWZlcmVuY2UsIGFsbG9jcyk7XG4gICAgICAgICAgICAgICAgaWYgKGdldEluc3RhbmNlKCkuX09ydEFkZFNlc3Npb25Db25maWdFbnRyeShzZXNzaW9uT3B0aW9uc0hhbmRsZSwga2V5RGF0YU9mZnNldCwgdmFsdWVEYXRhT2Zmc2V0KSAhPT1cbiAgICAgICAgICAgICAgICAgICAgMCkge1xuICAgICAgICAgICAgICAgICAgY2hlY2tMYXN0RXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgYENhbid0IHNldCBhIHNlc3Npb24gY29uZmlnIGVudHJ5OiAncG93ZXJQcmVmZXJlbmNlJyAtICR7d2Vibm5PcHRpb25zLnBvd2VyUHJlZmVyZW5jZX0uYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICd3ZWJncHUnOlxuICAgICAgICAgICAgZXBOYW1lID0gJ0pTJztcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXAgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHdlYmdwdU9wdGlvbnMgPSBlcCBhcyBJbmZlcmVuY2VTZXNzaW9uLldlYkdwdUV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uO1xuICAgICAgICAgICAgICBpZiAod2ViZ3B1T3B0aW9ucz8ucHJlZmVycmVkTGF5b3V0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHdlYmdwdU9wdGlvbnMucHJlZmVycmVkTGF5b3V0ICE9PSAnTkNIVycgJiYgd2ViZ3B1T3B0aW9ucy5wcmVmZXJyZWRMYXlvdXQgIT09ICdOSFdDJykge1xuICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBwcmVmZXJyZWRMYXlvdXQgbXVzdCBiZSBlaXRoZXIgJ05DSFcnIG9yICdOSFdDJzogJHt3ZWJncHVPcHRpb25zLnByZWZlcnJlZExheW91dH1gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5RGF0YU9mZnNldCA9IGFsbG9jV2FzbVN0cmluZygncHJlZmVycmVkTGF5b3V0JywgYWxsb2NzKTtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZURhdGFPZmZzZXQgPSBhbGxvY1dhc21TdHJpbmcod2ViZ3B1T3B0aW9ucy5wcmVmZXJyZWRMYXlvdXQsIGFsbG9jcyk7XG4gICAgICAgICAgICAgICAgaWYgKGdldEluc3RhbmNlKCkuX09ydEFkZFNlc3Npb25Db25maWdFbnRyeShzZXNzaW9uT3B0aW9uc0hhbmRsZSwga2V5RGF0YU9mZnNldCwgdmFsdWVEYXRhT2Zmc2V0KSAhPT1cbiAgICAgICAgICAgICAgICAgICAgMCkge1xuICAgICAgICAgICAgICAgICAgY2hlY2tMYXN0RXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgYENhbid0IHNldCBhIHNlc3Npb24gY29uZmlnIGVudHJ5OiAncHJlZmVycmVkTGF5b3V0JyAtICR7d2ViZ3B1T3B0aW9ucy5wcmVmZXJyZWRMYXlvdXR9LmApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnd2FzbSc6XG4gICAgICAgICAgY2FzZSAnY3B1JzpcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYG5vdCBzdXBwb3J0ZWQgZXhlY3V0aW9uIHByb3ZpZGVyOiAke2VwTmFtZX1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVwTmFtZURhdGFPZmZzZXQgPSBhbGxvY1dhc21TdHJpbmcoZXBOYW1lLCBhbGxvY3MpO1xuICAgICAgICBpZiAoZ2V0SW5zdGFuY2UoKS5fT3J0QXBwZW5kRXhlY3V0aW9uUHJvdmlkZXIoc2Vzc2lvbk9wdGlvbnNIYW5kbGUsIGVwTmFtZURhdGFPZmZzZXQpICE9PSAwKSB7XG4gICAgICAgICAgY2hlY2tMYXN0RXJyb3IoYENhbid0IGFwcGVuZCBleGVjdXRpb24gcHJvdmlkZXI6ICR7ZXBOYW1lfS5gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbmV4cG9ydCBjb25zdCBzZXRTZXNzaW9uT3B0aW9ucyA9IChvcHRpb25zPzogSW5mZXJlbmNlU2Vzc2lvbi5TZXNzaW9uT3B0aW9ucyk6IFtudW1iZXIsIG51bWJlcltdXSA9PiB7XG4gIGNvbnN0IHdhc20gPSBnZXRJbnN0YW5jZSgpO1xuICBsZXQgc2Vzc2lvbk9wdGlvbnNIYW5kbGUgPSAwO1xuICBjb25zdCBhbGxvY3M6IG51bWJlcltdID0gW107XG5cbiAgY29uc3Qgc2Vzc2lvbk9wdGlvbnM6IEluZmVyZW5jZVNlc3Npb24uU2Vzc2lvbk9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBhcHBlbmREZWZhdWx0T3B0aW9ucyhzZXNzaW9uT3B0aW9ucyk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBncmFwaE9wdGltaXphdGlvbkxldmVsID0gZ2V0R3JhcGhPcHRpbXphdGlvbkxldmVsKHNlc3Npb25PcHRpb25zLmdyYXBoT3B0aW1pemF0aW9uTGV2ZWwgPz8gJ2FsbCcpO1xuICAgIGNvbnN0IGV4ZWN1dGlvbk1vZGUgPSBnZXRFeGVjdXRpb25Nb2RlKHNlc3Npb25PcHRpb25zLmV4ZWN1dGlvbk1vZGUgPz8gJ3NlcXVlbnRpYWwnKTtcbiAgICBjb25zdCBsb2dJZERhdGFPZmZzZXQgPVxuICAgICAgICB0eXBlb2Ygc2Vzc2lvbk9wdGlvbnMubG9nSWQgPT09ICdzdHJpbmcnID8gYWxsb2NXYXNtU3RyaW5nKHNlc3Npb25PcHRpb25zLmxvZ0lkLCBhbGxvY3MpIDogMDtcblxuICAgIGNvbnN0IGxvZ1NldmVyaXR5TGV2ZWwgPSBzZXNzaW9uT3B0aW9ucy5sb2dTZXZlcml0eUxldmVsID8/IDI7ICAvLyBEZWZhdWx0IHRvIDIgLSB3YXJuaW5nXG4gICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGxvZ1NldmVyaXR5TGV2ZWwpIHx8IGxvZ1NldmVyaXR5TGV2ZWwgPCAwIHx8IGxvZ1NldmVyaXR5TGV2ZWwgPiA0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGxvZyBzZXJ2ZXJpdHkgbGV2ZWwgaXMgbm90IHZhbGlkOiAke2xvZ1NldmVyaXR5TGV2ZWx9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgbG9nVmVyYm9zaXR5TGV2ZWwgPSBzZXNzaW9uT3B0aW9ucy5sb2dWZXJib3NpdHlMZXZlbCA/PyAwOyAgLy8gRGVmYXVsdCB0byAwIC0gdmVyYm9zZVxuICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihsb2dWZXJib3NpdHlMZXZlbCkgfHwgbG9nVmVyYm9zaXR5TGV2ZWwgPCAwIHx8IGxvZ1ZlcmJvc2l0eUxldmVsID4gNCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBsb2cgdmVyYm9zaXR5IGxldmVsIGlzIG5vdCB2YWxpZDogJHtsb2dWZXJib3NpdHlMZXZlbH1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBvcHRpbWl6ZWRNb2RlbEZpbGVQYXRoT2Zmc2V0ID0gdHlwZW9mIHNlc3Npb25PcHRpb25zLm9wdGltaXplZE1vZGVsRmlsZVBhdGggPT09ICdzdHJpbmcnID9cbiAgICAgICAgYWxsb2NXYXNtU3RyaW5nKHNlc3Npb25PcHRpb25zLm9wdGltaXplZE1vZGVsRmlsZVBhdGgsIGFsbG9jcykgOlxuICAgICAgICAwO1xuXG4gICAgc2Vzc2lvbk9wdGlvbnNIYW5kbGUgPSB3YXNtLl9PcnRDcmVhdGVTZXNzaW9uT3B0aW9ucyhcbiAgICAgICAgZ3JhcGhPcHRpbWl6YXRpb25MZXZlbCwgISFzZXNzaW9uT3B0aW9ucy5lbmFibGVDcHVNZW1BcmVuYSwgISFzZXNzaW9uT3B0aW9ucy5lbmFibGVNZW1QYXR0ZXJuLCBleGVjdXRpb25Nb2RlLFxuICAgICAgICAhIXNlc3Npb25PcHRpb25zLmVuYWJsZVByb2ZpbGluZywgMCwgbG9nSWREYXRhT2Zmc2V0LCBsb2dTZXZlcml0eUxldmVsLCBsb2dWZXJib3NpdHlMZXZlbCxcbiAgICAgICAgb3B0aW1pemVkTW9kZWxGaWxlUGF0aE9mZnNldCk7XG4gICAgaWYgKHNlc3Npb25PcHRpb25zSGFuZGxlID09PSAwKSB7XG4gICAgICBjaGVja0xhc3RFcnJvcignQ2FuXFwndCBjcmVhdGUgc2Vzc2lvbiBvcHRpb25zLicpO1xuICAgIH1cblxuICAgIGlmIChzZXNzaW9uT3B0aW9ucy5leGVjdXRpb25Qcm92aWRlcnMpIHtcbiAgICAgIHNldEV4ZWN1dGlvblByb3ZpZGVycyhzZXNzaW9uT3B0aW9uc0hhbmRsZSwgc2Vzc2lvbk9wdGlvbnMuZXhlY3V0aW9uUHJvdmlkZXJzLCBhbGxvY3MpO1xuICAgIH1cblxuICAgIGlmIChzZXNzaW9uT3B0aW9ucy5lbmFibGVHcmFwaENhcHR1cmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHR5cGVvZiBzZXNzaW9uT3B0aW9ucy5lbmFibGVHcmFwaENhcHR1cmUgIT09ICdib29sZWFuJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGVuYWJsZUdyYXBoQ2FwdHVyZSBtdXN0IGJlIGEgYm9vbGVhbiB2YWx1ZTogJHtzZXNzaW9uT3B0aW9ucy5lbmFibGVHcmFwaENhcHR1cmV9YCk7XG4gICAgICB9XG4gICAgICBjb25zdCBrZXlEYXRhT2Zmc2V0ID0gYWxsb2NXYXNtU3RyaW5nKCdlbmFibGVHcmFwaENhcHR1cmUnLCBhbGxvY3MpO1xuICAgICAgY29uc3QgdmFsdWVEYXRhT2Zmc2V0ID0gYWxsb2NXYXNtU3RyaW5nKHNlc3Npb25PcHRpb25zLmVuYWJsZUdyYXBoQ2FwdHVyZS50b1N0cmluZygpLCBhbGxvY3MpO1xuICAgICAgaWYgKHdhc20uX09ydEFkZFNlc3Npb25Db25maWdFbnRyeShzZXNzaW9uT3B0aW9uc0hhbmRsZSwga2V5RGF0YU9mZnNldCwgdmFsdWVEYXRhT2Zmc2V0KSAhPT0gMCkge1xuICAgICAgICBjaGVja0xhc3RFcnJvcihcbiAgICAgICAgICAgIGBDYW4ndCBzZXQgYSBzZXNzaW9uIGNvbmZpZyBlbnRyeTogJ2VuYWJsZUdyYXBoQ2FwdHVyZScgLSAke3Nlc3Npb25PcHRpb25zLmVuYWJsZUdyYXBoQ2FwdHVyZX0uYCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNlc3Npb25PcHRpb25zLmZyZWVEaW1lbnNpb25PdmVycmlkZXMpIHtcbiAgICAgIGZvciAoY29uc3QgW25hbWUsIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhzZXNzaW9uT3B0aW9ucy5mcmVlRGltZW5zaW9uT3ZlcnJpZGVzKSkge1xuICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBmcmVlIGRpbWVuc2lvbiBvdmVycmlkZSBuYW1lIG11c3QgYmUgYSBzdHJpbmc6ICR7bmFtZX1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJyB8fCAhTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSkgfHwgdmFsdWUgPCAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBmcmVlIGRpbWVuc2lvbiBvdmVycmlkZSB2YWx1ZSBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIGludGVnZXI6ICR7dmFsdWV9YCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmFtZU9mZnNldCA9IGFsbG9jV2FzbVN0cmluZyhuYW1lLCBhbGxvY3MpO1xuICAgICAgICBpZiAod2FzbS5fT3J0QWRkRnJlZURpbWVuc2lvbk92ZXJyaWRlKHNlc3Npb25PcHRpb25zSGFuZGxlLCBuYW1lT2Zmc2V0LCB2YWx1ZSkgIT09IDApIHtcbiAgICAgICAgICBjaGVja0xhc3RFcnJvcihgQ2FuJ3Qgc2V0IGEgZnJlZSBkaW1lbnNpb24gb3ZlcnJpZGU6ICR7bmFtZX0gLSAke3ZhbHVlfS5gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzZXNzaW9uT3B0aW9ucy5leHRyYSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpdGVyYXRlRXh0cmFPcHRpb25zKHNlc3Npb25PcHRpb25zLmV4dHJhLCAnJywgbmV3IFdlYWtTZXQ8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+KCksIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgIGNvbnN0IGtleURhdGFPZmZzZXQgPSBhbGxvY1dhc21TdHJpbmcoa2V5LCBhbGxvY3MpO1xuICAgICAgICBjb25zdCB2YWx1ZURhdGFPZmZzZXQgPSBhbGxvY1dhc21TdHJpbmcodmFsdWUsIGFsbG9jcyk7XG5cbiAgICAgICAgaWYgKHdhc20uX09ydEFkZFNlc3Npb25Db25maWdFbnRyeShzZXNzaW9uT3B0aW9uc0hhbmRsZSwga2V5RGF0YU9mZnNldCwgdmFsdWVEYXRhT2Zmc2V0KSAhPT0gMCkge1xuICAgICAgICAgIGNoZWNrTGFzdEVycm9yKGBDYW4ndCBzZXQgYSBzZXNzaW9uIGNvbmZpZyBlbnRyeTogJHtrZXl9IC0gJHt2YWx1ZX0uYCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBbc2Vzc2lvbk9wdGlvbnNIYW5kbGUsIGFsbG9jc107XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoc2Vzc2lvbk9wdGlvbnNIYW5kbGUgIT09IDApIHtcbiAgICAgIHdhc20uX09ydFJlbGVhc2VTZXNzaW9uT3B0aW9ucyhzZXNzaW9uT3B0aW9uc0hhbmRsZSk7XG4gICAgfVxuICAgIGFsbG9jcy5mb3JFYWNoKGFsbG9jID0+IHdhc20uX2ZyZWUoYWxsb2MpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnb25ueHJ1bnRpbWUtY29tbW9uJztcblxuLy8gYSBkdW1teSB0eXBlIGRlY2xhcmF0aW9uIGZvciBGbG9hdDE2QXJyYXkgaW4gY2FzZSBhbnkgcG9seWZpbGwgaXMgYXZhaWxhYmxlLlxuZGVjbGFyZSBnbG9iYWwge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uLCBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gIGNvbnN0IEZsb2F0MTZBcnJheTogYW55O1xufVxuXG4vLyBUaGlzIGZpbGUgaW5jbHVkZXMgY29tbW9uIGRlZmluaXRpb25zLiBUaGV5IGRvIE5PVCBoYXZlIGRlcGVuZGVuY3kgb24gdGhlIFdlYkFzc2VtYmx5IGluc3RhbmNlLlxuXG4vKipcbiAqIENvcGllZCBmcm9tIE9OTlggZGVmaW5pdGlvbi4gVXNlIHRoaXMgdG8gZHJvcCBkZXBlbmRlbmN5ICdvbm54X3Byb3RvJyB0byBkZWNyZWFzZSBjb21waWxlZCAuanMgZmlsZSBzaXplLlxuICovXG5leHBvcnQgY29uc3QgZW51bSBEYXRhVHlwZSB7XG4gIHVuZGVmaW5lZCA9IDAsXG4gIGZsb2F0ID0gMSxcbiAgdWludDggPSAyLFxuICBpbnQ4ID0gMyxcbiAgdWludDE2ID0gNCxcbiAgaW50MTYgPSA1LFxuICBpbnQzMiA9IDYsXG4gIGludDY0ID0gNyxcbiAgc3RyaW5nID0gOCxcbiAgYm9vbCA9IDksXG4gIGZsb2F0MTYgPSAxMCxcbiAgZG91YmxlID0gMTEsXG4gIHVpbnQzMiA9IDEyLFxuICB1aW50NjQgPSAxMyxcbiAgY29tcGxleDY0ID0gMTQsXG4gIGNvbXBsZXgxMjggPSAxNSxcbiAgYmZsb2F0MTYgPSAxNlxufVxuXG4vKipcbiAqIE1hcCBzdHJpbmcgdGVuc29yIGRhdGEgdG8gZW51bSB2YWx1ZVxuICovXG5leHBvcnQgY29uc3QgdGVuc29yRGF0YVR5cGVTdHJpbmdUb0VudW0gPSAodHlwZTogc3RyaW5nKTogRGF0YVR5cGUgPT4ge1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdpbnQ4JzpcbiAgICAgIHJldHVybiBEYXRhVHlwZS5pbnQ4O1xuICAgIGNhc2UgJ3VpbnQ4JzpcbiAgICAgIHJldHVybiBEYXRhVHlwZS51aW50ODtcbiAgICBjYXNlICdib29sJzpcbiAgICAgIHJldHVybiBEYXRhVHlwZS5ib29sO1xuICAgIGNhc2UgJ2ludDE2JzpcbiAgICAgIHJldHVybiBEYXRhVHlwZS5pbnQxNjtcbiAgICBjYXNlICd1aW50MTYnOlxuICAgICAgcmV0dXJuIERhdGFUeXBlLnVpbnQxNjtcbiAgICBjYXNlICdpbnQzMic6XG4gICAgICByZXR1cm4gRGF0YVR5cGUuaW50MzI7XG4gICAgY2FzZSAndWludDMyJzpcbiAgICAgIHJldHVybiBEYXRhVHlwZS51aW50MzI7XG4gICAgY2FzZSAnZmxvYXQxNic6XG4gICAgICByZXR1cm4gRGF0YVR5cGUuZmxvYXQxNjtcbiAgICBjYXNlICdmbG9hdDMyJzpcbiAgICAgIHJldHVybiBEYXRhVHlwZS5mbG9hdDtcbiAgICBjYXNlICdmbG9hdDY0JzpcbiAgICAgIHJldHVybiBEYXRhVHlwZS5kb3VibGU7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiBEYXRhVHlwZS5zdHJpbmc7XG4gICAgY2FzZSAnaW50NjQnOlxuICAgICAgcmV0dXJuIERhdGFUeXBlLmludDY0O1xuICAgIGNhc2UgJ3VpbnQ2NCc6XG4gICAgICByZXR1cm4gRGF0YVR5cGUudWludDY0O1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdW5zdXBwb3J0ZWQgZGF0YSB0eXBlOiAke3R5cGV9YCk7XG4gIH1cbn07XG5cbi8qKlxuICogTWFwIGVudW0gdmFsdWUgdG8gc3RyaW5nIHRlbnNvciBkYXRhXG4gKi9cbmV4cG9ydCBjb25zdCB0ZW5zb3JEYXRhVHlwZUVudW1Ub1N0cmluZyA9ICh0eXBlUHJvdG86IERhdGFUeXBlKTogVGVuc29yLlR5cGUgPT4ge1xuICBzd2l0Y2ggKHR5cGVQcm90bykge1xuICAgIGNhc2UgRGF0YVR5cGUuaW50ODpcbiAgICAgIHJldHVybiAnaW50OCc7XG4gICAgY2FzZSBEYXRhVHlwZS51aW50ODpcbiAgICAgIHJldHVybiAndWludDgnO1xuICAgIGNhc2UgRGF0YVR5cGUuYm9vbDpcbiAgICAgIHJldHVybiAnYm9vbCc7XG4gICAgY2FzZSBEYXRhVHlwZS5pbnQxNjpcbiAgICAgIHJldHVybiAnaW50MTYnO1xuICAgIGNhc2UgRGF0YVR5cGUudWludDE2OlxuICAgICAgcmV0dXJuICd1aW50MTYnO1xuICAgIGNhc2UgRGF0YVR5cGUuaW50MzI6XG4gICAgICByZXR1cm4gJ2ludDMyJztcbiAgICBjYXNlIERhdGFUeXBlLnVpbnQzMjpcbiAgICAgIHJldHVybiAndWludDMyJztcbiAgICBjYXNlIERhdGFUeXBlLmZsb2F0MTY6XG4gICAgICByZXR1cm4gJ2Zsb2F0MTYnO1xuICAgIGNhc2UgRGF0YVR5cGUuZmxvYXQ6XG4gICAgICByZXR1cm4gJ2Zsb2F0MzInO1xuICAgIGNhc2UgRGF0YVR5cGUuZG91YmxlOlxuICAgICAgcmV0dXJuICdmbG9hdDY0JztcbiAgICBjYXNlIERhdGFUeXBlLnN0cmluZzpcbiAgICAgIHJldHVybiAnc3RyaW5nJztcbiAgICBjYXNlIERhdGFUeXBlLmludDY0OlxuICAgICAgcmV0dXJuICdpbnQ2NCc7XG4gICAgY2FzZSBEYXRhVHlwZS51aW50NjQ6XG4gICAgICByZXR1cm4gJ3VpbnQ2NCc7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bnN1cHBvcnRlZCBkYXRhIHR5cGU6ICR7dHlwZVByb3RvfWApO1xuICB9XG59O1xuXG4vKipcbiAqIGdldCB0ZW5zb3IgZWxlbWVudCBzaXplIGluIGJ5dGVzIGJ5IHRoZSBnaXZlbiBkYXRhIHR5cGVcbiAqIEByZXR1cm5zIHNpemUgaW4gaW50ZWdlciBvciB1bmRlZmluZWQgaWYgdGhlIGRhdGEgdHlwZSBpcyBub3Qgc3VwcG9ydGVkXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRUZW5zb3JFbGVtZW50U2l6ZSA9IChkYXRlVHlwZTogbnVtYmVyKTogbnVtYmVyfFxuICAgIHVuZGVmaW5lZCA9PiBbdW5kZWZpbmVkLCA0LCAxLCAxLCAyLCAyLCA0LCA4LCB1bmRlZmluZWQsIDEsIDIsIDgsIDQsIDgsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWRdW2RhdGVUeXBlXTtcblxuLyoqXG4gKiBnZXQgdHlwZWQgYXJyYXkgY29uc3RydWN0b3IgYnkgdGhlIGdpdmVuIHRlbnNvciB0eXBlXG4gKi9cbmV4cG9ydCBjb25zdCB0ZW5zb3JUeXBlVG9UeXBlZEFycmF5Q29uc3RydWN0b3IgPSAodHlwZTogVGVuc29yLlR5cGUpOiBGbG9hdDMyQXJyYXlDb25zdHJ1Y3RvcnxVaW50OEFycmF5Q29uc3RydWN0b3J8XG4gICAgSW50OEFycmF5Q29uc3RydWN0b3J8VWludDE2QXJyYXlDb25zdHJ1Y3RvcnxJbnQxNkFycmF5Q29uc3RydWN0b3J8SW50MzJBcnJheUNvbnN0cnVjdG9yfEJpZ0ludDY0QXJyYXlDb25zdHJ1Y3RvcnxcbiAgICBVaW50OEFycmF5Q29uc3RydWN0b3J8RmxvYXQ2NEFycmF5Q29uc3RydWN0b3J8VWludDMyQXJyYXlDb25zdHJ1Y3RvcnxCaWdVaW50NjRBcnJheUNvbnN0cnVjdG9yID0+IHtcbiAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlICdmbG9hdDE2JzpcbiAgICAgICAgICAvLyBhbGxvdyBGbG9hdDE2QXJyYXkgcG9seWZpbGwuXG4gICAgICAgICAgcmV0dXJuIHR5cGVvZiBGbG9hdDE2QXJyYXkgIT09ICd1bmRlZmluZWQnICYmIEZsb2F0MTZBcnJheS5mcm9tID8gRmxvYXQxNkFycmF5IDogVWludDE2QXJyYXk7XG4gICAgICAgIGNhc2UgJ2Zsb2F0MzInOlxuICAgICAgICAgIHJldHVybiBGbG9hdDMyQXJyYXk7XG4gICAgICAgIGNhc2UgJ3VpbnQ4JzpcbiAgICAgICAgICByZXR1cm4gVWludDhBcnJheTtcbiAgICAgICAgY2FzZSAnaW50OCc6XG4gICAgICAgICAgcmV0dXJuIEludDhBcnJheTtcbiAgICAgICAgY2FzZSAndWludDE2JzpcbiAgICAgICAgICByZXR1cm4gVWludDE2QXJyYXk7XG4gICAgICAgIGNhc2UgJ2ludDE2JzpcbiAgICAgICAgICByZXR1cm4gSW50MTZBcnJheTtcbiAgICAgICAgY2FzZSAnaW50MzInOlxuICAgICAgICAgIHJldHVybiBJbnQzMkFycmF5O1xuICAgICAgICBjYXNlICdib29sJzpcbiAgICAgICAgICByZXR1cm4gVWludDhBcnJheTtcbiAgICAgICAgY2FzZSAnZmxvYXQ2NCc6XG4gICAgICAgICAgcmV0dXJuIEZsb2F0NjRBcnJheTtcbiAgICAgICAgY2FzZSAndWludDMyJzpcbiAgICAgICAgICByZXR1cm4gVWludDMyQXJyYXk7XG4gICAgICAgIGNhc2UgJ2ludDY0JzpcbiAgICAgICAgICByZXR1cm4gQmlnSW50NjRBcnJheTtcbiAgICAgICAgY2FzZSAndWludDY0JzpcbiAgICAgICAgICByZXR1cm4gQmlnVWludDY0QXJyYXk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bnN1cHBvcnRlZCB0eXBlOiAke3R5cGV9YCk7XG4gICAgICB9XG4gICAgfTtcblxuLyoqXG4gKiBNYXAgc3RyaW5nIGxvZyBsZXZlbCB0byBpbnRlZ2VyIHZhbHVlXG4gKi9cbmV4cG9ydCBjb25zdCBsb2dMZXZlbFN0cmluZ1RvRW51bSA9IChsb2dMZXZlbD86ICd2ZXJib3NlJ3wnaW5mbyd8J3dhcm5pbmcnfCdlcnJvcid8J2ZhdGFsJyk6IG51bWJlciA9PiB7XG4gIHN3aXRjaCAobG9nTGV2ZWwpIHtcbiAgICBjYXNlICd2ZXJib3NlJzpcbiAgICAgIHJldHVybiAwO1xuICAgIGNhc2UgJ2luZm8nOlxuICAgICAgcmV0dXJuIDE7XG4gICAgY2FzZSAnd2FybmluZyc6XG4gICAgICByZXR1cm4gMjtcbiAgICBjYXNlICdlcnJvcic6XG4gICAgICByZXR1cm4gMztcbiAgICBjYXNlICdmYXRhbCc6XG4gICAgICByZXR1cm4gNDtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bnN1cHBvcnRlZCBsb2dnaW5nIGxldmVsOiAke2xvZ0xldmVsfWApO1xuICB9XG59O1xuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdGhlIGdpdmVuIHRlbnNvciB0eXBlIGlzIHN1cHBvcnRlZCBieSBHUFUgYnVmZmVyXG4gKi9cbmV4cG9ydCBjb25zdCBpc0dwdUJ1ZmZlclN1cHBvcnRlZFR5cGUgPSAodHlwZTogVGVuc29yLlR5cGUpOiB0eXBlIGlzIFRlbnNvci5HcHVCdWZmZXJEYXRhVHlwZXMgPT4gdHlwZSA9PT0gJ2Zsb2F0MzInIHx8XG4gICAgdHlwZSA9PT0gJ2Zsb2F0MTYnIHx8IHR5cGUgPT09ICdpbnQzMicgfHwgdHlwZSA9PT0gJ2ludDY0JyB8fCB0eXBlID09PSAndWludDMyJyB8fCB0eXBlID09PSAndWludDgnIHx8XG4gICAgdHlwZSA9PT0gJ2Jvb2wnO1xuXG4vKipcbiAqIE1hcCBzdHJpbmcgZGF0YSBsb2NhdGlvbiB0byBpbnRlZ2VyIHZhbHVlXG4gKi9cbmV4cG9ydCBjb25zdCBkYXRhTG9jYXRpb25TdHJpbmdUb0VudW0gPSAobG9jYXRpb246IFRlbnNvci5EYXRhTG9jYXRpb24pOiBudW1iZXIgPT4ge1xuICBzd2l0Y2ggKGxvY2F0aW9uKSB7XG4gICAgY2FzZSAnbm9uZSc6XG4gICAgICByZXR1cm4gMDtcbiAgICBjYXNlICdjcHUnOlxuICAgICAgcmV0dXJuIDE7XG4gICAgY2FzZSAnY3B1LXBpbm5lZCc6XG4gICAgICByZXR1cm4gMjtcbiAgICBjYXNlICd0ZXh0dXJlJzpcbiAgICAgIHJldHVybiAzO1xuICAgIGNhc2UgJ2dwdS1idWZmZXInOlxuICAgICAgcmV0dXJuIDQ7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdW5zdXBwb3J0ZWQgZGF0YSBsb2NhdGlvbjogJHtsb2NhdGlvbn1gKTtcbiAgfVxufTtcblxuLyoqXG4gKiBNYXAgaW50ZWdlciBkYXRhIGxvY2F0aW9uIHRvIHN0cmluZyB2YWx1ZVxuICovXG5leHBvcnQgY29uc3QgZGF0YUxvY2F0aW9uRW51bVRvU3RyaW5nID0gKGxvY2F0aW9uOiBudW1iZXIpOiBUZW5zb3IuRGF0YUxvY2F0aW9ufHVuZGVmaW5lZCA9PlxuICAgIChbJ25vbmUnLCAnY3B1JywgJ2NwdS1waW5uZWQnLCAndGV4dHVyZScsICdncHUtYnVmZmVyJ10gYXMgY29uc3QpW2xvY2F0aW9uXTtcbiIsICJleHBvcnQgY29uc3QgcmVhZEZpbGUgPSB1bmRlZmluZWQ7ZXhwb3J0IGNvbnN0IHJlYWRGaWxlU3luYyA9IHVuZGVmaW5lZDtleHBvcnQgY29uc3QgY3JlYXRlUmVhZFN0cmVhbSA9IHVuZGVmaW5lZDsiLCAiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5cbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCB7cmVhZEZpbGV9IGZyb20gJ25vZGU6ZnMvcHJvbWlzZXMnO1xuXG4vKipcbiAqIExvYWQgYSBmaWxlIGludG8gYSBVaW50OEFycmF5LlxuICpcbiAqIEBwYXJhbSBmaWxlIC0gdGhlIGZpbGUgdG8gbG9hZC4gQ2FuIGJlIGEgVVJML3BhdGgsIGEgQmxvYiwgYW4gQXJyYXlCdWZmZXIsIG9yIGEgVWludDhBcnJheS5cbiAqIEByZXR1cm5zIGEgVWludDhBcnJheSBjb250YWluaW5nIHRoZSBmaWxlIGRhdGEuXG4gKi9cbmV4cG9ydCBjb25zdCBsb2FkRmlsZSA9IGFzeW5jKGZpbGU6IHN0cmluZ3xCbG9ifEFycmF5QnVmZmVyTGlrZXxVaW50OEFycmF5KTogUHJvbWlzZTxVaW50OEFycmF5PiA9PiB7XG4gIGlmICh0eXBlb2YgZmlsZSA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MudmVyc2lvbnMgJiYgcHJvY2Vzcy52ZXJzaW9ucy5ub2RlKSB7XG4gICAgICAvLyBsb2FkIGZpbGUgaW50byBBcnJheUJ1ZmZlciBpbiBOb2RlLmpzXG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYXdhaXQgcmVhZEZpbGUoZmlsZSkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZS5jb2RlID09PSAnRVJSX0ZTX0ZJTEVfVE9PX0xBUkdFJykge1xuICAgICAgICAgIC8vIGZpbGUgaXMgdG9vIGxhcmdlLCB1c2UgZnMuY3JlYXRlUmVhZFN0cmVhbSBpbnN0ZWFkXG4gICAgICAgICAgY29uc3Qgc3RyZWFtID0gZnMuY3JlYXRlUmVhZFN0cmVhbShmaWxlKTtcbiAgICAgICAgICBjb25zdCBjaHVua3M6IFVpbnQ4QXJyYXlbXSA9IFtdO1xuICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgY2h1bmsgb2Ygc3RyZWFtKSB7XG4gICAgICAgICAgICBjaHVua3MucHVzaChjaHVuayk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShCdWZmZXIuY29uY2F0KGNodW5rcykpO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGxvYWQgZmlsZSBpbnRvIEFycmF5QnVmZmVyIGluIGJyb3dzZXJzXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGZpbGUpO1xuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGZhaWxlZCB0byBsb2FkIGV4dGVybmFsIGRhdGEgZmlsZTogJHtmaWxlfWApO1xuICAgICAgfVxuICAgICAgY29uc3QgY29udGVudExlbmd0aEhlYWRlciA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdDb250ZW50LUxlbmd0aCcpO1xuICAgICAgY29uc3QgZmlsZVNpemUgPSBjb250ZW50TGVuZ3RoSGVhZGVyID8gcGFyc2VJbnQoY29udGVudExlbmd0aEhlYWRlciwgMTApIDogMDtcbiAgICAgIGlmIChmaWxlU2l6ZSA8IDEwNzM3NDE4MjQgLyogMUdCICovKSB7XG4gICAgICAgIC8vIHdoZW4gQ29udGVudC1MZW5ndGggaGVhZGVyIGlzIG5vdCBzZXQsIHdlIGNhbm5vdCBkZXRlcm1pbmUgdGhlIGZpbGUgc2l6ZS4gV2UgYXNzdW1lIGl0IGlzIHNtYWxsIGVub3VnaCB0b1xuICAgICAgICAvLyBsb2FkIGludG8gbWVtb3J5LlxuICAgICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYXdhaXQgcmVzcG9uc2UuYXJyYXlCdWZmZXIoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBmaWxlIGlzIHRvbyBsYXJnZSwgdXNlIHN0cmVhbSBpbnN0ZWFkXG4gICAgICAgIGlmICghcmVzcG9uc2UuYm9keSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgZmFpbGVkIHRvIGxvYWQgZXh0ZXJuYWwgZGF0YSBmaWxlOiAke2ZpbGV9LCBubyByZXNwb25zZSBib2R5LmApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlYWRlciA9IHJlc3BvbnNlLmJvZHkuZ2V0UmVhZGVyKCk7XG5cbiAgICAgICAgbGV0IGJ1ZmZlcjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyB0cnkgdG8gY3JlYXRlIEFycmF5QnVmZmVyIGRpcmVjdGx5XG4gICAgICAgICAgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGZpbGVTaXplKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgUmFuZ2VFcnJvcikge1xuICAgICAgICAgICAgLy8gdXNlIFdlYkFzc2VtYmx5IE1lbW9yeSB0byBhbGxvY2F0ZSBsYXJnZXIgQXJyYXlCdWZmZXJcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VzID0gTWF0aC5jZWlsKGZpbGVTaXplIC8gNjU1MzYpO1xuICAgICAgICAgICAgYnVmZmVyID0gbmV3IFdlYkFzc2VtYmx5Lk1lbW9yeSh7aW5pdGlhbDogcGFnZXMsIG1heGltdW06IHBhZ2VzfSkuYnVmZmVyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBvZmZzZXQgPSAwO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgY29uc3Qge2RvbmUsIHZhbHVlfSA9IGF3YWl0IHJlYWRlci5yZWFkKCk7XG4gICAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBjaHVua1NpemUgPSB2YWx1ZS5ieXRlTGVuZ3RoO1xuICAgICAgICAgIGNvbnN0IGNodW5rID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyLCBvZmZzZXQsIGNodW5rU2l6ZSk7XG4gICAgICAgICAgY2h1bmsuc2V0KHZhbHVlKTtcbiAgICAgICAgICBvZmZzZXQgKz0gY2h1bmtTaXplO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShidWZmZXIsIDAsIGZpbGVTaXplKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfSBlbHNlIGlmIChmaWxlIGluc3RhbmNlb2YgQmxvYikge1xuICAgIHJldHVybiBuZXcgVWludDhBcnJheShhd2FpdCBmaWxlLmFycmF5QnVmZmVyKCkpO1xuICB9IGVsc2UgaWYgKGZpbGUgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgcmV0dXJuIGZpbGU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGZpbGUpO1xuICB9XG59O1xuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQge0VudiwgSW5mZXJlbmNlU2Vzc2lvbiwgVGVuc29yfSBmcm9tICdvbm54cnVudGltZS1jb21tb24nO1xuXG5pbXBvcnQge1NlcmlhbGl6YWJsZUludGVybmFsQnVmZmVyLCBTZXJpYWxpemFibGVTZXNzaW9uTWV0YWRhdGEsIFNlcmlhbGl6YWJsZVRlbnNvck1ldGFkYXRhLCBUZW5zb3JNZXRhZGF0YX0gZnJvbSAnLi9wcm94eS1tZXNzYWdlcyc7XG5pbXBvcnQge3NldFJ1bk9wdGlvbnN9IGZyb20gJy4vcnVuLW9wdGlvbnMnO1xuaW1wb3J0IHtzZXRTZXNzaW9uT3B0aW9uc30gZnJvbSAnLi9zZXNzaW9uLW9wdGlvbnMnO1xuaW1wb3J0IHtkYXRhTG9jYXRpb25TdHJpbmdUb0VudW0sIGdldFRlbnNvckVsZW1lbnRTaXplLCBpc0dwdUJ1ZmZlclN1cHBvcnRlZFR5cGUsIGxvZ0xldmVsU3RyaW5nVG9FbnVtLCB0ZW5zb3JEYXRhVHlwZUVudW1Ub1N0cmluZywgdGVuc29yRGF0YVR5cGVTdHJpbmdUb0VudW0sIHRlbnNvclR5cGVUb1R5cGVkQXJyYXlDb25zdHJ1Y3Rvcn0gZnJvbSAnLi93YXNtLWNvbW1vbic7XG5pbXBvcnQge2dldEluc3RhbmNlfSBmcm9tICcuL3dhc20tZmFjdG9yeSc7XG5pbXBvcnQge2FsbG9jV2FzbVN0cmluZywgY2hlY2tMYXN0RXJyb3J9IGZyb20gJy4vd2FzbS11dGlscyc7XG5pbXBvcnQge2xvYWRGaWxlfSBmcm9tICcuL3dhc20tdXRpbHMtbG9hZC1maWxlJztcblxuLy8gI3JlZ2lvbiBJbml0aWFsaXphdGlvbnNcblxuLyoqXG4gKiBUaGVyZSBhcmUgNCBkaWZmZXJlbnQgXCJpbml0aWFsaXphdGlvblwiIHN0ZXBzIGZvciBPUlQuIFRoZXkgaGFwcGVuIGluIGRpZmZlcmVudCBwbGFjZXMgYW5kIGRpZmZlcmVudCB0aW1lLlxuICpcbiAqIDEuIEphdmFTY3JpcHQgaW5pdGlhbGl6YXRpb24gZm9yIG9ubnhydW50aW1lLWNvbW1vbiBhbmQgb25ueHJ1bnRpbWUtd2ViLlxuICogICAgVGhpcyBpcyB0aGUgZmlyc3QgaW5pdGlhbGl6YXRpb24gc3RlcC4gSW4gdGhpcyBzdGVwLCBvbm54cnVudGltZS13ZWIgY2FsbHMgb25ueHJ1bnRpbWUtY29tbW9uJ3MgcmVnaXN0ZXJCYWNrZW5kKClcbiAqIGZ1bmN0aW9uIG11bHRpcGxlIHRpbWVzIHRvIHJlZ2lzdGVyIGFsbCB0aGUgYXZhaWxhYmxlIGJhY2tlbmRzLiBUaGUgYmFja2VuZCByZWdpc3RyYXRpb24gaXMgdmVyeSBmYXN0LiBJdCBvbmx5XG4gKiByZWdpc3RlcnMgdGhlIGJhY2tlbmQgbmFtZSB3aXRoIHRoZSB1bmluaXRpYWxpemVkIGJhY2tlbmQgb2JqZWN0LiBObyBoZWF2eSBpbml0aWFsaXphdGlvbiBpcyBkb25lIGluIHRoaXMgc3RlcC5cbiAqICAgIFJlZmVyIHRvIHdlYi9saWIvaW5kZXgudHMgZm9yIHRoZSBiYWNrZW5kIHJlZ2lzdHJhdGlvbi5cbiAqXG4gKiAyLiBXZWJBc3NlbWJseSBhcnRpZmFjdCBpbml0aWFsaXphdGlvbi5cbiAqICAgIFRoaXMgaGFwcGVucyB3aGVuIGFueSByZWdpc3RlcmVkIHdhc20gYmFja2VuZCBpcyB1c2VkIGZvciB0aGUgZmlyc3QgdGltZSAoaWUuIGBvcnQuSW5mZXJlbmNlU2Vzc2lvbi5jcmVhdGUoKWAgb3JcbiAqIGBvcnQuVHJhaW5pbmdTZXNzaW9uLmNyZWF0ZSgpYCBpcyBjYWxsZWQpLiBJbiB0aGlzIHN0ZXAsIG9ubnhydW50aW1lLXdlYiBkb2VzIHRoZSBmb2xsb3dpbmdzOlxuICogICAgIC0gY3JlYXRlIGEgcHJveHkgd29ya2VyIGFuZCBtYWtlIHN1cmUgdGhlIHByb3h5IHdvcmtlciBpcyByZWFkeSB0byByZWNlaXZlIG1lc3NhZ2VzLCBpZiBwcm94eSBpcyBlbmFibGVkLlxuICogICAgIC0gcGVyZm9ybSBmZWF0dXJlIGRldGVjdGlvbiwgbG9jYXRlIGNvcnJlY3QgV2ViQXNzZW1ibHkgYXJ0aWZhY3QgcGF0aCBhbmQgY2FsbCB0aGUgRW1zY3JpcHRlbiBnZW5lcmF0ZWRcbiAqIEphdmFTY3JpcHQgY29kZSB0byBpbml0aWFsaXplIHRoZSBXZWJBc3NlbWJseSBydW50aW1lLlxuICogICAgICAgICAtIGlmIHByb3h5IGlzIGVuYWJsZWQsIHRoaXMgc3RlcCBoYXBwZW5zIGluIHRoZSBwcm94eSB3b3JrZXIgdXNpbmcgbWVzc2FnZSAnaW5pdC13YXNtJy5cbiAqICAgICAgICAgLSBkb3dubG9hZGluZyB0aGUgJ29ydC13YXNtey4uLn0ud2FzbScgZmlsZSBpcyBkb25lIGluIHRoaXMgc3RlcC5cbiAqICAgICAgICAgLSBpZiBtdWx0aS10aHJlYWQgaXMgZW5hYmxlZCwgb25lIG9yIG1vcmUgd2Vid29ya2VyIHdpbGwgYmUgY3JlYXRlZCB0byBpbml0aWFsaXplIHRoZSBQVGhyZWFkIHRocmVhZHBvb2wuXG4gKlxuICogMy4gT1JUIGVudmlyb25tZW50IGluaXRpYWxpemF0aW9uLlxuICogICAgVGhpcyBoYXBwZW5zIGFmdGVyIHN0ZXAgMi4gSW4gdGhpcyBzdGVwLCBvbm54cnVudGltZS13ZWIgcGVyZm9ybXMgT05OWCBSdW50aW1lIGVudmlyb25tZW50IGluaXRpYWxpemF0aW9uLlxuICogRnVuY3Rpb24gYF9PcnRJbml0KClgIGlzIGNhbGxlZCBpbiB0aGlzIHN0ZXAuXG4gKiAgICAgLSBpZiBwcm94eSBpcyBlbmFibGVkLCB0aGlzIHN0ZXAgaGFwcGVucyBpbiB0aGUgcHJveHkgd29ya2VyIHVzaW5nIG1lc3NhZ2UgJ2luaXQtb3J0Jy5cbiAqICAgICAtIGxvZ2dpbmcgbGV2ZWwgKG9ydC5lbnYubG9nTGV2ZWwpIGFuZCB0aHJlYWQgbnVtYmVyIChvcnQuZW52Lndhc20ubnVtVGhyZWFkcykgYXJlIHNldCBpbiB0aGlzIHN0ZXAuXG4gKlxuICogNC4gU2Vzc2lvbiBpbml0aWFsaXphdGlvbi5cbiAqICAgIFRoaXMgaGFwcGVucyB3aGVuIGBvcnQuSW5mZXJlbmNlU2Vzc2lvbi5jcmVhdGUoKWAgb3IgYG9ydC5UcmFpbmluZ1Nlc3Npb24uY3JlYXRlKClgIGlzIGNhbGxlZC4gVW5saWtlIHRoZSBmaXJzdCAzXG4gKiBzdGVwcyAodGhleSBvbmx5IGNhbGxlZCBvbmNlKSwgdGhpcyBzdGVwIHdpbGwgYmUgZG9uZSBmb3IgZWFjaCBzZXNzaW9uLiBJbiB0aGlzIHN0ZXAsIG9ubnhydW50aW1lLXdlYiBkb2VzIHRoZVxuICogZm9sbG93aW5nczpcbiAqICAgIElmIHRoZSBwYXJhbWV0ZXIgaXMgYSBVUkw6XG4gKiAgICAtIGRvd25sb2FkIHRoZSBtb2RlbCBkYXRhIGZyb20gdGhlIFVSTC5cbiAqICAgIC0gY29weSB0aGUgbW9kZWwgZGF0YSB0byB0aGUgV0FTTSBoZWFwLiAocHJveHk6ICdjb3B5LWZyb20nKVxuICogICAgLSBkZXJlZmVyZW5jZSB0aGUgbW9kZWwgYnVmZmVyLiBUaGlzIHN0ZXAgYWxsb3dzIHRoZSBvcmlnaW5hbCBBcnJheUJ1ZmZlciB0byBiZSBnYXJiYWdlIGNvbGxlY3RlZC5cbiAqICAgIC0gY2FsbCBgX09ydENyZWF0ZVNlc3Npb24oKWAgdG8gY3JlYXRlIHRoZSBzZXNzaW9uLiAocHJveHk6ICdjcmVhdGUnKVxuICpcbiAqICAgIElmIHRoZSBwYXJhbWV0ZXIgaXMgYSBVaW50OEFycmF5IG9iamVjdDpcbiAqICAgIC0gY29weSB0aGUgbW9kZWwgZGF0YSB0byB0aGUgV0FTTSBoZWFwLiAocHJveHk6ICdjb3B5LWZyb20nKVxuICogICAgLSBjYWxsIGBfT3J0Q3JlYXRlU2Vzc2lvbigpYCB0byBjcmVhdGUgdGhlIHNlc3Npb24uIChwcm94eTogJ2NyZWF0ZScpXG4gKlxuICpcbiAqL1xuXG4vKipcbiAqIGluaXRpYWxpemUgT1JUIGVudmlyb25tZW50LlxuICpcbiAqIEBwYXJhbSBudW1UaHJlYWRzIFNldEdsb2JhbEludHJhT3BOdW1UaHJlYWRzKG51bVRocmVhZHMpXG4gKiBAcGFyYW0gbG9nZ2luZ0xldmVsIENyZWF0ZUVudihzdGF0aWNfY2FzdDxPcnRMb2dnaW5nTGV2ZWw+KGxvZ2dpbmdfbGV2ZWwpKVxuICovXG5jb25zdCBpbml0T3J0ID0gKG51bVRocmVhZHM6IG51bWJlciwgbG9nZ2luZ0xldmVsOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgY29uc3QgZXJyb3JDb2RlID0gZ2V0SW5zdGFuY2UoKS5fT3J0SW5pdChudW1UaHJlYWRzLCBsb2dnaW5nTGV2ZWwpO1xuICBpZiAoZXJyb3JDb2RlICE9PSAwKSB7XG4gICAgY2hlY2tMYXN0RXJyb3IoJ0NhblxcJ3QgaW5pdGlhbGl6ZSBvbm54cnVudGltZS4nKTtcbiAgfVxufTtcblxuLyoqXG4gKiBpbnRpYWxpemUgcnVudGltZSBlbnZpcm9ubWVudC5cbiAqIEBwYXJhbSBlbnYgcGFzc2VkIGluIHRoZSBlbnZpcm9ubWVudCBjb25maWcgb2JqZWN0LlxuICovXG5leHBvcnQgY29uc3QgaW5pdFJ1bnRpbWUgPSBhc3luYyhlbnY6IEVudik6IFByb21pc2U8dm9pZD4gPT4ge1xuICAvLyBpbml0IE9SVFxuICBpbml0T3J0KGVudi53YXNtLm51bVRocmVhZHMhLCBsb2dMZXZlbFN0cmluZ1RvRW51bShlbnYubG9nTGV2ZWwpKTtcbn07XG5cbi8qKlxuICogcGVyZm9ybSBFUCBzcGVjaWZpYyBpbml0aWFsaXphdGlvbi5cbiAqXG4gKiBAcGFyYW0gZW52XG4gKiBAcGFyYW0gZXBOYW1lXG4gKi9cbmV4cG9ydCBjb25zdCBpbml0RXAgPSBhc3luYyhlbnY6IEVudiwgZXBOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgaWYgKCFCVUlMRF9ERUZTLkRJU0FCTEVfV0VCR1BVKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHMsIEB0eXBlc2NyaXB0LWVzbGludC9uby12YXItcmVxdWlyZXNcbiAgICBjb25zdCBpbml0SnNlcCA9IHJlcXVpcmUoJy4vanNlcC9pbml0JykuaW5pdDtcblxuICAgIGlmIChlcE5hbWUgPT09ICd3ZWJncHUnKSB7XG4gICAgICAvLyBwZXJmb3JtIFdlYkdQVSBhdmFpbGFiaWxpdHkgY2hlY2tcbiAgICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yID09PSAndW5kZWZpbmVkJyB8fCAhbmF2aWdhdG9yLmdwdSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1dlYkdQVSBpcyBub3Qgc3VwcG9ydGVkIGluIGN1cnJlbnQgZW52aXJvbm1lbnQnKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGFkYXB0ZXIgPSBlbnYud2ViZ3B1LmFkYXB0ZXIgYXMgR1BVQWRhcHRlciB8IG51bGw7XG4gICAgICBpZiAoIWFkYXB0ZXIpIHtcbiAgICAgICAgLy8gaWYgYWRhcHRlciBpcyBub3Qgc2V0LCByZXF1ZXN0IGEgbmV3IGFkYXB0ZXIuXG4gICAgICAgIGNvbnN0IHBvd2VyUHJlZmVyZW5jZSA9IGVudi53ZWJncHUucG93ZXJQcmVmZXJlbmNlO1xuICAgICAgICBpZiAocG93ZXJQcmVmZXJlbmNlICE9PSB1bmRlZmluZWQgJiYgcG93ZXJQcmVmZXJlbmNlICE9PSAnbG93LXBvd2VyJyAmJlxuICAgICAgICAgICAgcG93ZXJQcmVmZXJlbmNlICE9PSAnaGlnaC1wZXJmb3JtYW5jZScpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcG93ZXJQcmVmZXJlbmNlIHNldHRpbmc6IFwiJHtwb3dlclByZWZlcmVuY2V9XCJgKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmb3JjZUZhbGxiYWNrQWRhcHRlciA9IGVudi53ZWJncHUuZm9yY2VGYWxsYmFja0FkYXB0ZXI7XG4gICAgICAgIGlmIChmb3JjZUZhbGxiYWNrQWRhcHRlciAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBmb3JjZUZhbGxiYWNrQWRhcHRlciAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGZvcmNlRmFsbGJhY2tBZGFwdGVyIHNldHRpbmc6IFwiJHtmb3JjZUZhbGxiYWNrQWRhcHRlcn1cImApO1xuICAgICAgICB9XG4gICAgICAgIGFkYXB0ZXIgPSBhd2FpdCBuYXZpZ2F0b3IuZ3B1LnJlcXVlc3RBZGFwdGVyKHtwb3dlclByZWZlcmVuY2UsIGZvcmNlRmFsbGJhY2tBZGFwdGVyfSk7XG4gICAgICAgIGlmICghYWRhcHRlcikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgJ0ZhaWxlZCB0byBnZXQgR1BVIGFkYXB0ZXIuICcgK1xuICAgICAgICAgICAgICAnWW91IG1heSBuZWVkIHRvIGVuYWJsZSBmbGFnIFwiLS1lbmFibGUtdW5zYWZlLXdlYmdwdVwiIGlmIHlvdSBhcmUgdXNpbmcgQ2hyb21lLicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBhZGFwdGVyIGlzIHNldCwgdmFsaWRhdGUgaXQuXG4gICAgICAgIGlmICh0eXBlb2YgYWRhcHRlci5saW1pdHMgIT09ICdvYmplY3QnIHx8IHR5cGVvZiBhZGFwdGVyLmZlYXR1cmVzICE9PSAnb2JqZWN0JyB8fFxuICAgICAgICAgICAgdHlwZW9mIGFkYXB0ZXIucmVxdWVzdERldmljZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBHUFUgYWRhcHRlciBzZXQgaW4gYGVudi53ZWJncHUuYWRhcHRlcmAuIEl0IG11c3QgYmUgYSBHUFVBZGFwdGVyIG9iamVjdC4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWVudi53YXNtLnNpbWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgJ05vdCBzdXBwb3J0ZWQgZm9yIFdlYkdQVT1PTiBhbmQgU0lNRD1PRkYuIFBsZWFzZSBzZXQgYGVudi53YXNtLnNpbWRgIHRvIHRydWUgd2hlbiB1c2luZyBgd2ViZ3B1YCBFUCcpO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCBpbml0SnNlcCgnd2ViZ3B1JywgZ2V0SW5zdGFuY2UoKSwgZW52LCBhZGFwdGVyKTtcbiAgICB9XG4gICAgaWYgKGVwTmFtZSA9PT0gJ3dlYm5uJykge1xuICAgICAgLy8gcGVyZm9ybSBXZWJOTiBhdmFpbGFiaWxpdHkgY2hlY2tcbiAgICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yID09PSAndW5kZWZpbmVkJyB8fCAhKG5hdmlnYXRvciBhcyB1bmtub3duIGFzIHttbDogdW5rbm93bn0pLm1sKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignV2ViTk4gaXMgbm90IHN1cHBvcnRlZCBpbiBjdXJyZW50IGVudmlyb25tZW50Jyk7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IGluaXRKc2VwKCd3ZWJubicsIGdldEluc3RhbmNlKCksIGVudik7XG4gICAgfVxuICB9XG59O1xuXG4vLyAjZW5kcmVnaW9uIEluaXRpYWxpemF0aW9uc1xuXG4vKipcbiAqIHZhbGlkIGRhdGEgbG9jYXRpb25zIGZvciBpbnB1dC9vdXRwdXQgdGVuc29ycy5cbiAqL1xudHlwZSBTdXBwb3J0ZWRUZW5zb3JEYXRhTG9jYXRpb25Gb3JJbnB1dE91dHB1dCA9ICdjcHUnfCdjcHUtcGlubmVkJ3wnZ3B1LWJ1ZmZlcic7XG5cbnR5cGUgSU9CaW5kaW5nU3RhdGUgPSB7XG4gIC8qKlxuICAgKiB0aGUgaGFuZGxlIG9mIElPIGJpbmRpbmcuXG4gICAqL1xuICByZWFkb25seSBoYW5kbGU6IG51bWJlcjtcblxuICAvKipcbiAgICogdGhlIHByZWZlcnJlZCBsb2NhdGlvbiBmb3IgZWFjaCBvdXRwdXQgdGVuc29yLlxuICAgKlxuICAgKiB2YWx1ZSBpcyBvbmUgb2YgJ2NwdScsICdjcHUtcGlubmVkJywgJ2dwdS1idWZmZXInLlxuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0UHJlZmVycmVkTG9jYXRpb25zOiByZWFkb25seSBTdXBwb3J0ZWRUZW5zb3JEYXRhTG9jYXRpb25Gb3JJbnB1dE91dHB1dFtdO1xuXG4gIC8qKlxuICAgKiBlbnVtIHZhbHVlIG9mIHRoZSBwcmVmZXJyZWQgbG9jYXRpb24gZm9yIGVhY2ggb3V0cHV0IHRlbnNvci5cbiAgICovXG4gIHJlYWRvbmx5IG91dHB1dFByZWZlcnJlZExvY2F0aW9uc0VuY29kZWQ6IHJlYWRvbmx5IG51bWJlcltdO1xufTtcblxuLyoqXG4gKiAgdHVwbGUgZWxlbWVudHMgYXJlOiBJbmZlcmVuY2VTZXNzaW9uIElEOyBpbnB1dE5hbWVzVVRGOEVuY29kZWQ7IG91dHB1dE5hbWVzVVRGOEVuY29kZWQ7IGJpbmRpbmdTdGF0ZVxuICovXG50eXBlIFNlc3Npb25NZXRhZGF0YSA9IFtcbiAgaW5mZXJlbmNlU2Vzc2lvbklkOiBudW1iZXIsIGlucHV0TmFtZXNVVEY4RW5jb2RlZDogbnVtYmVyW10sIG91dHB1dE5hbWVzVVRGOEVuY29kZWQ6IG51bWJlcltdLFxuICBiaW5kaW5nU3RhdGU6IElPQmluZGluZ1N0YXRlfG51bGwsIGVuYWJsZUdyYXBoQ2FwdHVyZTogYm9vbGVhbiwgaW5wdXRPdXRwdXRCb3VuZDogYm9vbGVhblxuXTtcblxuY29uc3QgYWN0aXZlU2Vzc2lvbnMgPSBuZXcgTWFwPG51bWJlciwgU2Vzc2lvbk1ldGFkYXRhPigpO1xuXG4vKipcbiAqIGdldCB0aGUgaW5wdXQvb3V0cHV0IGNvdW50IG9mIHRoZSBzZXNzaW9uLlxuICogQHBhcmFtIHNlc3Npb25IYW5kbGUgdGhlIGhhbmRsZSByZXByZXNlbnRpbmcgdGhlIHNlc3Npb24uIHNob3VsZCBiZSBub24temVyby5cbiAqIEByZXR1cm5zIGEgdHVwbGUgaW5jbHVkaW5nIDIgbnVtYmVycywgcmVwcmVzZW50aW5nIHRoZSBpbnB1dCBjb3VudCBhbmQgb3V0cHV0IGNvdW50LlxuICovXG5jb25zdCBnZXRTZXNzaW9uSW5wdXRPdXRwdXRDb3VudCA9IChzZXNzaW9uSGFuZGxlOiBudW1iZXIpOiBbbnVtYmVyLCBudW1iZXJdID0+IHtcbiAgY29uc3Qgd2FzbSA9IGdldEluc3RhbmNlKCk7XG4gIGNvbnN0IHN0YWNrID0gd2FzbS5zdGFja1NhdmUoKTtcbiAgdHJ5IHtcbiAgICBjb25zdCBkYXRhT2Zmc2V0ID0gd2FzbS5zdGFja0FsbG9jKDgpO1xuICAgIGNvbnN0IGVycm9yQ29kZSA9IHdhc20uX09ydEdldElucHV0T3V0cHV0Q291bnQoc2Vzc2lvbkhhbmRsZSwgZGF0YU9mZnNldCwgZGF0YU9mZnNldCArIDQpO1xuICAgIGlmIChlcnJvckNvZGUgIT09IDApIHtcbiAgICAgIGNoZWNrTGFzdEVycm9yKCdDYW5cXCd0IGdldCBzZXNzaW9uIGlucHV0L291dHB1dCBjb3VudC4nKTtcbiAgICB9XG4gICAgcmV0dXJuIFt3YXNtLkhFQVAzMltkYXRhT2Zmc2V0IC8gNF0sIHdhc20uSEVBUDMyW2RhdGFPZmZzZXQgLyA0ICsgMV1dO1xuICB9IGZpbmFsbHkge1xuICAgIHdhc20uc3RhY2tSZXN0b3JlKHN0YWNrKTtcbiAgfVxufTtcblxuLyoqXG4gKiBhbGxvY2F0ZSB0aGUgbWVtb3J5IGFuZCBtZW1jcHkgdGhlIGV4dGVybmFsIGJ1ZmZlci5cbiAqXG4gKiBAcGFyYW0gbW9kZWwgLSB0aGUgZXh0ZXJuYWwgYnVmZmVyIGNvbnRhaW5pbmcgdGhlIG1vZGVsIGRhdGEuIE11c3Qgbm90IGJlIHRoZSBzYW1lIGJ1ZmZlciBhcyB0aGUgV0FTTSBoZWFwLlxuICogQHJldHVybnMgYSAyLWVsZW1lbnRzIHR1cGxlIC0gdGhlIHBvaW50ZXIgYW5kIHNpemUgb2YgdGhlIGFsbG9jYXRlZCBidWZmZXJcbiAqL1xuZXhwb3J0IGNvbnN0IGNvcHlGcm9tRXh0ZXJuYWxCdWZmZXIgPSAobW9kZWw6IFVpbnQ4QXJyYXkpOiBbbnVtYmVyLCBudW1iZXJdID0+IHtcbiAgY29uc3Qgd2FzbSA9IGdldEluc3RhbmNlKCk7XG4gIGNvbnN0IG1vZGVsRGF0YU9mZnNldCA9IHdhc20uX21hbGxvYyhtb2RlbC5ieXRlTGVuZ3RoKTtcbiAgaWYgKG1vZGVsRGF0YU9mZnNldCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ2FuJ3QgY3JlYXRlIGEgc2Vzc2lvbi4gZmFpbGVkIHRvIGFsbG9jYXRlIGEgYnVmZmVyIG9mIHNpemUgJHttb2RlbC5ieXRlTGVuZ3RofS5gKTtcbiAgfVxuICB3YXNtLkhFQVBVOC5zZXQobW9kZWwsIG1vZGVsRGF0YU9mZnNldCk7XG4gIHJldHVybiBbbW9kZWxEYXRhT2Zmc2V0LCBtb2RlbC5ieXRlTGVuZ3RoXTtcbn07XG5cbi8qKlxuICogY3JlYXRlIGFuIGluZmVyZW5jZSBzZXNzaW9uIGZyb20gYSBtb2RlbCBkYXRhIGJ1ZmZlci5cbiAqXG4gKiBAcGFyYW0gbW9kZWxEYXRhIC0gZWl0aGVyIGEgVWludDhBcnJheSBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBtb2RlbCBkYXRhLCBvciBhIDItZWxlbWVudHMgdHVwbGUgY29udGFpbmluZyB0aGVcbiAqICAgICBwb2ludGVyIGFuZCBzaXplIG9mIHRoZSBtb2RlbCBkYXRhIGJ1ZmZlci5cbiAqIEBwYXJhbSBvcHRpb25zIGFuIG9wdGlvbmFsIHNlc3Npb24gb3B0aW9ucyBvYmplY3QuXG4gKiBAcmV0dXJucyBhIDMtZWxlbWVudHMgdHVwbGUgY29udGFpbmluZyBbc2Vzc2lvbiBoYW5kbGUsIGlucHV0IG5hbWVzLCBvdXRwdXQgbmFtZXNdXG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVTZXNzaW9uID0gYXN5bmMoXG4gICAgbW9kZWxEYXRhOiBVaW50OEFycmF5fFNlcmlhbGl6YWJsZUludGVybmFsQnVmZmVyLFxuICAgIG9wdGlvbnM/OiBJbmZlcmVuY2VTZXNzaW9uLlNlc3Npb25PcHRpb25zKTogUHJvbWlzZTxTZXJpYWxpemFibGVTZXNzaW9uTWV0YWRhdGE+ID0+IHtcbiAgbGV0IG1vZGVsRGF0YU9mZnNldDogbnVtYmVyLCBtb2RlbERhdGFMZW5ndGg6IG51bWJlcjtcbiAgY29uc3Qgd2FzbSA9IGdldEluc3RhbmNlKCk7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkobW9kZWxEYXRhKSkge1xuICAgIC8vIGlmIG1vZGVsIGRhdGEgaXMgYW4gYXJyYXksIGl0IG11c3QgYmUgYSAyLWVsZW1lbnRzIHR1cGxlIGNvbnRhaW5pbmcgdGhlIHBvaW50ZXIgYW5kIHNpemUgb2YgdGhlIG1vZGVsIGRhdGFcbiAgICBbbW9kZWxEYXRhT2Zmc2V0LCBtb2RlbERhdGFMZW5ndGhdID0gbW9kZWxEYXRhO1xuICB9IGVsc2UgaWYgKG1vZGVsRGF0YS5idWZmZXIgPT09IHdhc20uSEVBUFU4LmJ1ZmZlcikge1xuICAgIC8vIGlmIG1vZGVsIGRhdGEgdXNlcyB0aGUgc2FtZSBidWZmZXIgYXMgdGhlIFdBU00gaGVhcCwgd2UgZG9uJ3QgbmVlZCB0byBjb3B5IGl0LlxuICAgIFttb2RlbERhdGFPZmZzZXQsIG1vZGVsRGF0YUxlbmd0aF0gPSBbbW9kZWxEYXRhLmJ5dGVPZmZzZXQsIG1vZGVsRGF0YS5ieXRlTGVuZ3RoXTtcbiAgfSBlbHNlIHtcbiAgICAvLyBvdGhlcndpc2UsIGNvcHkgdGhlIG1vZGVsIGRhdGEgdG8gdGhlIFdBU00gaGVhcC5cbiAgICBbbW9kZWxEYXRhT2Zmc2V0LCBtb2RlbERhdGFMZW5ndGhdID0gY29weUZyb21FeHRlcm5hbEJ1ZmZlcihtb2RlbERhdGEpO1xuICB9XG5cbiAgbGV0IHNlc3Npb25IYW5kbGUgPSAwO1xuICBsZXQgc2Vzc2lvbk9wdGlvbnNIYW5kbGUgPSAwO1xuICBsZXQgaW9CaW5kaW5nSGFuZGxlID0gMDtcbiAgbGV0IGFsbG9jczogbnVtYmVyW10gPSBbXTtcbiAgY29uc3QgaW5wdXROYW1lc1VURjhFbmNvZGVkID0gW107XG4gIGNvbnN0IG91dHB1dE5hbWVzVVRGOEVuY29kZWQgPSBbXTtcblxuICB0cnkge1xuICAgIFtzZXNzaW9uT3B0aW9uc0hhbmRsZSwgYWxsb2NzXSA9IHNldFNlc3Npb25PcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgaWYgKG9wdGlvbnM/LmV4dGVybmFsRGF0YSAmJiB3YXNtLm1vdW50RXh0ZXJuYWxEYXRhKSB7XG4gICAgICBjb25zdCBsb2FkaW5nUHJvbWlzZXMgPSBbXTtcbiAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBvcHRpb25zLmV4dGVybmFsRGF0YSkge1xuICAgICAgICBjb25zdCBwYXRoID0gdHlwZW9mIGZpbGUgPT09ICdzdHJpbmcnID8gZmlsZSA6IGZpbGUucGF0aDtcbiAgICAgICAgbG9hZGluZ1Byb21pc2VzLnB1c2gobG9hZEZpbGUodHlwZW9mIGZpbGUgPT09ICdzdHJpbmcnID8gZmlsZSA6IGZpbGUuZGF0YSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICB3YXNtLm1vdW50RXh0ZXJuYWxEYXRhIShwYXRoLCBkYXRhKTtcbiAgICAgICAgfSkpO1xuICAgICAgfVxuXG4gICAgICAvLyB3YWl0IGZvciBhbGwgZXh0ZXJuYWwgZGF0YSBmaWxlcyB0byBiZSBsb2FkZWRcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKGxvYWRpbmdQcm9taXNlcyk7XG4gICAgfVxuXG4gICAgc2Vzc2lvbkhhbmRsZSA9IGF3YWl0IHdhc20uX09ydENyZWF0ZVNlc3Npb24obW9kZWxEYXRhT2Zmc2V0LCBtb2RlbERhdGFMZW5ndGgsIHNlc3Npb25PcHRpb25zSGFuZGxlKTtcbiAgICBpZiAoc2Vzc2lvbkhhbmRsZSA9PT0gMCkge1xuICAgICAgY2hlY2tMYXN0RXJyb3IoJ0NhblxcJ3QgY3JlYXRlIGEgc2Vzc2lvbi4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBbaW5wdXRDb3VudCwgb3V0cHV0Q291bnRdID0gZ2V0U2Vzc2lvbklucHV0T3V0cHV0Q291bnQoc2Vzc2lvbkhhbmRsZSk7XG5cbiAgICBjb25zdCBlbmFibGVHcmFwaENhcHR1cmUgPSAhIW9wdGlvbnM/LmVuYWJsZUdyYXBoQ2FwdHVyZTtcblxuICAgIGNvbnN0IGlucHV0TmFtZXMgPSBbXTtcbiAgICBjb25zdCBvdXRwdXROYW1lcyA9IFtdO1xuICAgIGNvbnN0IG91dHB1dFByZWZlcnJlZExvY2F0aW9uczogU3VwcG9ydGVkVGVuc29yRGF0YUxvY2F0aW9uRm9ySW5wdXRPdXRwdXRbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRDb3VudDsgaSsrKSB7XG4gICAgICBjb25zdCBuYW1lID0gd2FzbS5fT3J0R2V0SW5wdXROYW1lKHNlc3Npb25IYW5kbGUsIGkpO1xuICAgICAgaWYgKG5hbWUgPT09IDApIHtcbiAgICAgICAgY2hlY2tMYXN0RXJyb3IoJ0NhblxcJ3QgZ2V0IGFuIGlucHV0IG5hbWUuJyk7XG4gICAgICB9XG4gICAgICBpbnB1dE5hbWVzVVRGOEVuY29kZWQucHVzaChuYW1lKTtcbiAgICAgIGlucHV0TmFtZXMucHVzaCh3YXNtLlVURjhUb1N0cmluZyhuYW1lKSk7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3V0cHV0Q291bnQ7IGkrKykge1xuICAgICAgY29uc3QgbmFtZSA9IHdhc20uX09ydEdldE91dHB1dE5hbWUoc2Vzc2lvbkhhbmRsZSwgaSk7XG4gICAgICBpZiAobmFtZSA9PT0gMCkge1xuICAgICAgICBjaGVja0xhc3RFcnJvcignQ2FuXFwndCBnZXQgYW4gb3V0cHV0IG5hbWUuJyk7XG4gICAgICB9XG4gICAgICBvdXRwdXROYW1lc1VURjhFbmNvZGVkLnB1c2gobmFtZSk7XG4gICAgICBjb25zdCBuYW1lU3RyaW5nID0gd2FzbS5VVEY4VG9TdHJpbmcobmFtZSk7XG4gICAgICBvdXRwdXROYW1lcy5wdXNoKG5hbWVTdHJpbmcpO1xuXG4gICAgICBpZiAoIUJVSUxEX0RFRlMuRElTQUJMRV9XRUJHUFUpIHtcbiAgICAgICAgaWYgKGVuYWJsZUdyYXBoQ2FwdHVyZSAmJiBvcHRpb25zPy5wcmVmZXJyZWRPdXRwdXRMb2NhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgb3V0cHV0UHJlZmVycmVkTG9jYXRpb25zLnB1c2goJ2dwdS1idWZmZXInKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IHR5cGVvZiBvcHRpb25zPy5wcmVmZXJyZWRPdXRwdXRMb2NhdGlvbiA9PT0gJ3N0cmluZycgP1xuICAgICAgICAgICAgb3B0aW9ucy5wcmVmZXJyZWRPdXRwdXRMb2NhdGlvbiA6XG4gICAgICAgICAgICBvcHRpb25zPy5wcmVmZXJyZWRPdXRwdXRMb2NhdGlvbj8uW25hbWVTdHJpbmddID8/ICdjcHUnO1xuICAgICAgICBpZiAobG9jYXRpb24gIT09ICdjcHUnICYmIGxvY2F0aW9uICE9PSAnY3B1LXBpbm5lZCcgJiYgbG9jYXRpb24gIT09ICdncHUtYnVmZmVyJykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm90IHN1cHBvcnRlZCBwcmVmZXJyZWQgb3V0cHV0IGxvY2F0aW9uOiAke2xvY2F0aW9ufS5gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW5hYmxlR3JhcGhDYXB0dXJlICYmIGxvY2F0aW9uICE9PSAnZ3B1LWJ1ZmZlcicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vdCBzdXBwb3J0ZWQgcHJlZmVycmVkIG91dHB1dCBsb2NhdGlvbjogJHtcbiAgICAgICAgICAgICAgbG9jYXRpb259LiBPbmx5ICdncHUtYnVmZmVyJyBsb2NhdGlvbiBpcyBzdXBwb3J0ZWQgd2hlbiBlbmFibGVHcmFwaENhcHR1cmUgaXMgdHJ1ZS5gKTtcbiAgICAgICAgfVxuICAgICAgICBvdXRwdXRQcmVmZXJyZWRMb2NhdGlvbnMucHVzaChsb2NhdGlvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdXNlIElPIGJpbmRpbmcgb25seSB3aGVuIGF0IGxlYXN0IG9uZSBvdXRwdXQgaXMgcHJlZmZlcmVkIHRvIGJlIG9uIEdQVS5cbiAgICBsZXQgYmluZGluZ1N0YXRlOiBJT0JpbmRpbmdTdGF0ZXxudWxsID0gbnVsbDtcbiAgICBpZiAoIUJVSUxEX0RFRlMuRElTQUJMRV9XRUJHUFUgJiYgb3V0cHV0UHJlZmVycmVkTG9jYXRpb25zLnNvbWUobCA9PiBsID09PSAnZ3B1LWJ1ZmZlcicpKSB7XG4gICAgICBpb0JpbmRpbmdIYW5kbGUgPSB3YXNtLl9PcnRDcmVhdGVCaW5kaW5nKHNlc3Npb25IYW5kbGUpO1xuICAgICAgaWYgKGlvQmluZGluZ0hhbmRsZSA9PT0gMCkge1xuICAgICAgICBjaGVja0xhc3RFcnJvcignQ2FuXFwndCBjcmVhdGUgSU8gYmluZGluZy4nKTtcbiAgICAgIH1cblxuICAgICAgYmluZGluZ1N0YXRlID0ge1xuICAgICAgICBoYW5kbGU6IGlvQmluZGluZ0hhbmRsZSxcbiAgICAgICAgb3V0cHV0UHJlZmVycmVkTG9jYXRpb25zLFxuICAgICAgICBvdXRwdXRQcmVmZXJyZWRMb2NhdGlvbnNFbmNvZGVkOiBvdXRwdXRQcmVmZXJyZWRMb2NhdGlvbnMubWFwKGwgPT4gZGF0YUxvY2F0aW9uU3RyaW5nVG9FbnVtKGwpKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgYWN0aXZlU2Vzc2lvbnMuc2V0KFxuICAgICAgICBzZXNzaW9uSGFuZGxlLFxuICAgICAgICBbc2Vzc2lvbkhhbmRsZSwgaW5wdXROYW1lc1VURjhFbmNvZGVkLCBvdXRwdXROYW1lc1VURjhFbmNvZGVkLCBiaW5kaW5nU3RhdGUsIGVuYWJsZUdyYXBoQ2FwdHVyZSwgZmFsc2VdKTtcbiAgICByZXR1cm4gW3Nlc3Npb25IYW5kbGUsIGlucHV0TmFtZXMsIG91dHB1dE5hbWVzXTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlucHV0TmFtZXNVVEY4RW5jb2RlZC5mb3JFYWNoKGJ1ZiA9PiB3YXNtLl9PcnRGcmVlKGJ1ZikpO1xuICAgIG91dHB1dE5hbWVzVVRGOEVuY29kZWQuZm9yRWFjaChidWYgPT4gd2FzbS5fT3J0RnJlZShidWYpKTtcblxuICAgIGlmIChpb0JpbmRpbmdIYW5kbGUgIT09IDApIHtcbiAgICAgIHdhc20uX09ydFJlbGVhc2VCaW5kaW5nKGlvQmluZGluZ0hhbmRsZSk7XG4gICAgfVxuXG4gICAgaWYgKHNlc3Npb25IYW5kbGUgIT09IDApIHtcbiAgICAgIHdhc20uX09ydFJlbGVhc2VTZXNzaW9uKHNlc3Npb25IYW5kbGUpO1xuICAgIH1cbiAgICB0aHJvdyBlO1xuICB9IGZpbmFsbHkge1xuICAgIHdhc20uX2ZyZWUobW9kZWxEYXRhT2Zmc2V0KTtcbiAgICBpZiAoc2Vzc2lvbk9wdGlvbnNIYW5kbGUgIT09IDApIHtcbiAgICAgIHdhc20uX09ydFJlbGVhc2VTZXNzaW9uT3B0aW9ucyhzZXNzaW9uT3B0aW9uc0hhbmRsZSk7XG4gICAgfVxuICAgIGFsbG9jcy5mb3JFYWNoKGFsbG9jID0+IHdhc20uX2ZyZWUoYWxsb2MpKTtcblxuICAgIC8vIHVubW91bnQgZXh0ZXJuYWwgZGF0YSBpZiBuZWNlc3NhcnlcbiAgICB3YXNtLnVubW91bnRFeHRlcm5hbERhdGE/LigpO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgcmVsZWFzZVNlc3Npb24gPSAoc2Vzc2lvbklkOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgY29uc3Qgd2FzbSA9IGdldEluc3RhbmNlKCk7XG4gIGNvbnN0IHNlc3Npb24gPSBhY3RpdmVTZXNzaW9ucy5nZXQoc2Vzc2lvbklkKTtcbiAgaWYgKCFzZXNzaW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBjYW5ub3QgcmVsZWFzZSBzZXNzaW9uLiBpbnZhbGlkIHNlc3Npb24gaWQ6ICR7c2Vzc2lvbklkfWApO1xuICB9XG4gIGNvbnN0IFtzZXNzaW9uSGFuZGxlLCBpbnB1dE5hbWVzVVRGOEVuY29kZWQsIG91dHB1dE5hbWVzVVRGOEVuY29kZWQsIGlvQmluZGluZ1N0YXRlLCBlbmFibGVHcmFwaENhcHR1cmVdID0gc2Vzc2lvbjtcblxuICBpZiAoaW9CaW5kaW5nU3RhdGUpIHtcbiAgICBpZiAoZW5hYmxlR3JhcGhDYXB0dXJlKSB7XG4gICAgICB3YXNtLl9PcnRDbGVhckJvdW5kT3V0cHV0cyhpb0JpbmRpbmdTdGF0ZS5oYW5kbGUpO1xuICAgIH1cbiAgICB3YXNtLl9PcnRSZWxlYXNlQmluZGluZyhpb0JpbmRpbmdTdGF0ZS5oYW5kbGUpO1xuICB9XG5cbiAgd2FzbS5qc2VwT25SZWxlYXNlU2Vzc2lvbj8uKHNlc3Npb25JZCk7XG5cbiAgaW5wdXROYW1lc1VURjhFbmNvZGVkLmZvckVhY2goYnVmID0+IHdhc20uX09ydEZyZWUoYnVmKSk7XG4gIG91dHB1dE5hbWVzVVRGOEVuY29kZWQuZm9yRWFjaChidWYgPT4gd2FzbS5fT3J0RnJlZShidWYpKTtcbiAgd2FzbS5fT3J0UmVsZWFzZVNlc3Npb24oc2Vzc2lvbkhhbmRsZSk7XG4gIGFjdGl2ZVNlc3Npb25zLmRlbGV0ZShzZXNzaW9uSWQpO1xufTtcblxuZXhwb3J0IGNvbnN0IHByZXBhcmVJbnB1dE91dHB1dFRlbnNvciA9XG4gICAgKHRlbnNvcjogVGVuc29yTWV0YWRhdGF8bnVsbCwgdGVuc29ySGFuZGxlczogbnVtYmVyW10sIGFsbG9jczogbnVtYmVyW10sIHNlc3Npb25JZDogbnVtYmVyLCBpbmRleDogbnVtYmVyLFxuICAgICBlbmFibGVHcmFwaENhcHR1cmUgPSBmYWxzZSk6IHZvaWQgPT4ge1xuICAgICAgaWYgKCF0ZW5zb3IpIHtcbiAgICAgICAgdGVuc29ySGFuZGxlcy5wdXNoKDApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHdhc20gPSBnZXRJbnN0YW5jZSgpO1xuXG4gICAgICBjb25zdCBkYXRhVHlwZSA9IHRlbnNvclswXTtcbiAgICAgIGNvbnN0IGRpbXMgPSB0ZW5zb3JbMV07XG4gICAgICBjb25zdCBsb2NhdGlvbiA9IHRlbnNvclszXTtcblxuICAgICAgbGV0IHJhd0RhdGE6IG51bWJlcjtcbiAgICAgIGxldCBkYXRhQnl0ZUxlbmd0aDogbnVtYmVyO1xuXG4gICAgICBpZiAoZGF0YVR5cGUgPT09ICdzdHJpbmcnICYmIGxvY2F0aW9uID09PSAnZ3B1LWJ1ZmZlcicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdHJpbmcgdGVuc29yIGlzIG5vdCBzdXBwb3J0ZWQgb24gR1BVLicpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZW5hYmxlR3JhcGhDYXB0dXJlICYmIGxvY2F0aW9uICE9PSAnZ3B1LWJ1ZmZlcicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYEV4dGVybmFsIGJ1ZmZlciBtdXN0IGJlIHByb3ZpZGVkIGZvciBpbnB1dC9vdXRwdXQgaW5kZXggJHtpbmRleH0gd2hlbiBlbmFibGVHcmFwaENhcHR1cmUgaXMgdHJ1ZS5gKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGxvY2F0aW9uID09PSAnZ3B1LWJ1ZmZlcicpIHtcbiAgICAgICAgY29uc3QgZ3B1QnVmZmVyID0gdGVuc29yWzJdLmdwdUJ1ZmZlciBhcyBHUFVCdWZmZXI7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRTaXplSW5CeXRlcyA9IGdldFRlbnNvckVsZW1lbnRTaXplKHRlbnNvckRhdGFUeXBlU3RyaW5nVG9FbnVtKGRhdGFUeXBlKSkhO1xuICAgICAgICBkYXRhQnl0ZUxlbmd0aCA9IGRpbXMucmVkdWNlKChhLCBiKSA9PiBhICogYiwgMSkgKiBlbGVtZW50U2l6ZUluQnl0ZXM7XG5cbiAgICAgICAgY29uc3QgcmVnaXN0ZXJCdWZmZXIgPSB3YXNtLmpzZXBSZWdpc3RlckJ1ZmZlcjtcbiAgICAgICAgaWYgKCFyZWdpc3RlckJ1ZmZlcikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGVuc29yIGxvY2F0aW9uIFwiZ3B1LWJ1ZmZlclwiIGlzIG5vdCBzdXBwb3J0ZWQgd2l0aG91dCB1c2luZyBXZWJHUFUuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmF3RGF0YSA9IHJlZ2lzdGVyQnVmZmVyKHNlc3Npb25JZCwgaW5kZXgsIGdwdUJ1ZmZlciwgZGF0YUJ5dGVMZW5ndGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRlbnNvclsyXTtcblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICAgIC8vIHN0cmluZyB0ZW5zb3JcbiAgICAgICAgICBkYXRhQnl0ZUxlbmd0aCA9IDQgKiBkYXRhLmxlbmd0aDtcbiAgICAgICAgICByYXdEYXRhID0gd2FzbS5fbWFsbG9jKGRhdGFCeXRlTGVuZ3RoKTtcbiAgICAgICAgICBhbGxvY3MucHVzaChyYXdEYXRhKTtcbiAgICAgICAgICBsZXQgZGF0YUluZGV4ID0gcmF3RGF0YSAvIDQ7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRhdGFbaV0gIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYHRlbnNvciBkYXRhIGF0IGluZGV4ICR7aX0gaXMgbm90IGEgc3RyaW5nYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3YXNtLkhFQVBVMzJbZGF0YUluZGV4KytdID0gYWxsb2NXYXNtU3RyaW5nKGRhdGFbaV0sIGFsbG9jcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRhdGFCeXRlTGVuZ3RoID0gZGF0YS5ieXRlTGVuZ3RoO1xuICAgICAgICAgIHJhd0RhdGEgPSB3YXNtLl9tYWxsb2MoZGF0YUJ5dGVMZW5ndGgpO1xuICAgICAgICAgIGFsbG9jcy5wdXNoKHJhd0RhdGEpO1xuICAgICAgICAgIHdhc20uSEVBUFU4LnNldChuZXcgVWludDhBcnJheShkYXRhLmJ1ZmZlciwgZGF0YS5ieXRlT2Zmc2V0LCBkYXRhQnl0ZUxlbmd0aCksIHJhd0RhdGEpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN0YWNrID0gd2FzbS5zdGFja1NhdmUoKTtcbiAgICAgIGNvbnN0IGRpbXNPZmZzZXQgPSB3YXNtLnN0YWNrQWxsb2MoNCAqIGRpbXMubGVuZ3RoKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCBkaW1JbmRleCA9IGRpbXNPZmZzZXQgLyA0O1xuICAgICAgICBkaW1zLmZvckVhY2goZCA9PiB3YXNtLkhFQVAzMltkaW1JbmRleCsrXSA9IGQpO1xuICAgICAgICBjb25zdCB0ZW5zb3IgPSB3YXNtLl9PcnRDcmVhdGVUZW5zb3IoXG4gICAgICAgICAgICB0ZW5zb3JEYXRhVHlwZVN0cmluZ1RvRW51bShkYXRhVHlwZSksIHJhd0RhdGEsIGRhdGFCeXRlTGVuZ3RoLCBkaW1zT2Zmc2V0LCBkaW1zLmxlbmd0aCxcbiAgICAgICAgICAgIGRhdGFMb2NhdGlvblN0cmluZ1RvRW51bShsb2NhdGlvbikpO1xuICAgICAgICBpZiAodGVuc29yID09PSAwKSB7XG4gICAgICAgICAgY2hlY2tMYXN0RXJyb3IoYENhbid0IGNyZWF0ZSB0ZW5zb3IgZm9yIGlucHV0L291dHB1dC4gc2Vzc2lvbj0ke3Nlc3Npb25JZH0sIGluZGV4PSR7aW5kZXh9LmApO1xuICAgICAgICB9XG4gICAgICAgIHRlbnNvckhhbmRsZXMucHVzaCh0ZW5zb3IpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5zdGFja1Jlc3RvcmUoc3RhY2spO1xuICAgICAgfVxuICAgIH07XG5cbi8qKlxuICogcGVyZm9ybSBpbmZlcmVuY2UgcnVuXG4gKi9cbmV4cG9ydCBjb25zdCBydW4gPSBhc3luYyhcbiAgICBzZXNzaW9uSWQ6IG51bWJlciwgaW5wdXRJbmRpY2VzOiBudW1iZXJbXSwgaW5wdXRUZW5zb3JzOiBUZW5zb3JNZXRhZGF0YVtdLCBvdXRwdXRJbmRpY2VzOiBudW1iZXJbXSxcbiAgICBvdXRwdXRUZW5zb3JzOiBBcnJheTxUZW5zb3JNZXRhZGF0YXxudWxsPiwgb3B0aW9uczogSW5mZXJlbmNlU2Vzc2lvbi5SdW5PcHRpb25zKTogUHJvbWlzZTxUZW5zb3JNZXRhZGF0YVtdPiA9PiB7XG4gIGNvbnN0IHdhc20gPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCBzZXNzaW9uID0gYWN0aXZlU2Vzc2lvbnMuZ2V0KHNlc3Npb25JZCk7XG4gIGlmICghc2Vzc2lvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihgY2Fubm90IHJ1biBpbmZlcmVuY2UuIGludmFsaWQgc2Vzc2lvbiBpZDogJHtzZXNzaW9uSWR9YCk7XG4gIH1cbiAgY29uc3Qgc2Vzc2lvbkhhbmRsZSA9IHNlc3Npb25bMF07XG4gIGNvbnN0IGlucHV0TmFtZXNVVEY4RW5jb2RlZCA9IHNlc3Npb25bMV07XG4gIGNvbnN0IG91dHB1dE5hbWVzVVRGOEVuY29kZWQgPSBzZXNzaW9uWzJdO1xuICBjb25zdCBpb0JpbmRpbmdTdGF0ZSA9IHNlc3Npb25bM107XG4gIGNvbnN0IGVuYWJsZUdyYXBoQ2FwdHVyZSA9IHNlc3Npb25bNF07XG4gIGNvbnN0IGlucHV0T3V0cHV0Qm91bmQgPSBzZXNzaW9uWzVdO1xuXG4gIGNvbnN0IGlucHV0Q291bnQgPSBpbnB1dEluZGljZXMubGVuZ3RoO1xuICBjb25zdCBvdXRwdXRDb3VudCA9IG91dHB1dEluZGljZXMubGVuZ3RoO1xuXG4gIGxldCBydW5PcHRpb25zSGFuZGxlID0gMDtcbiAgbGV0IHJ1bk9wdGlvbnNBbGxvY3M6IG51bWJlcltdID0gW107XG5cbiAgY29uc3QgaW5wdXRUZW5zb3JIYW5kbGVzOiBudW1iZXJbXSA9IFtdO1xuICBjb25zdCBvdXRwdXRUZW5zb3JIYW5kbGVzOiBudW1iZXJbXSA9IFtdO1xuICBjb25zdCBpbnB1dE91dHB1dEFsbG9jczogbnVtYmVyW10gPSBbXTtcblxuICBjb25zdCBiZWZvcmVSdW5TdGFjayA9IHdhc20uc3RhY2tTYXZlKCk7XG4gIGNvbnN0IGlucHV0VmFsdWVzT2Zmc2V0ID0gd2FzbS5zdGFja0FsbG9jKGlucHV0Q291bnQgKiA0KTtcbiAgY29uc3QgaW5wdXROYW1lc09mZnNldCA9IHdhc20uc3RhY2tBbGxvYyhpbnB1dENvdW50ICogNCk7XG4gIGNvbnN0IG91dHB1dFZhbHVlc09mZnNldCA9IHdhc20uc3RhY2tBbGxvYyhvdXRwdXRDb3VudCAqIDQpO1xuICBjb25zdCBvdXRwdXROYW1lc09mZnNldCA9IHdhc20uc3RhY2tBbGxvYyhvdXRwdXRDb3VudCAqIDQpO1xuXG4gIHRyeSB7XG4gICAgW3J1bk9wdGlvbnNIYW5kbGUsIHJ1bk9wdGlvbnNBbGxvY3NdID0gc2V0UnVuT3B0aW9ucyhvcHRpb25zKTtcblxuICAgIC8vIGNyZWF0ZSBpbnB1dCB0ZW5zb3JzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dENvdW50OyBpKyspIHtcbiAgICAgIHByZXBhcmVJbnB1dE91dHB1dFRlbnNvcihcbiAgICAgICAgICBpbnB1dFRlbnNvcnNbaV0sIGlucHV0VGVuc29ySGFuZGxlcywgaW5wdXRPdXRwdXRBbGxvY3MsIHNlc3Npb25JZCwgaW5wdXRJbmRpY2VzW2ldLCBlbmFibGVHcmFwaENhcHR1cmUpO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSBvdXRwdXQgdGVuc29yc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3V0cHV0Q291bnQ7IGkrKykge1xuICAgICAgcHJlcGFyZUlucHV0T3V0cHV0VGVuc29yKFxuICAgICAgICAgIG91dHB1dFRlbnNvcnNbaV0sIG91dHB1dFRlbnNvckhhbmRsZXMsIGlucHV0T3V0cHV0QWxsb2NzLCBzZXNzaW9uSWQsIGlucHV0Q291bnQgKyBvdXRwdXRJbmRpY2VzW2ldLFxuICAgICAgICAgIGVuYWJsZUdyYXBoQ2FwdHVyZSk7XG4gICAgfVxuXG4gICAgbGV0IGlucHV0VmFsdWVzSW5kZXggPSBpbnB1dFZhbHVlc09mZnNldCAvIDQ7XG4gICAgbGV0IGlucHV0TmFtZXNJbmRleCA9IGlucHV0TmFtZXNPZmZzZXQgLyA0O1xuICAgIGxldCBvdXRwdXRWYWx1ZXNJbmRleCA9IG91dHB1dFZhbHVlc09mZnNldCAvIDQ7XG4gICAgbGV0IG91dHB1dE5hbWVzSW5kZXggPSBvdXRwdXROYW1lc09mZnNldCAvIDQ7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dENvdW50OyBpKyspIHtcbiAgICAgIHdhc20uSEVBUFUzMltpbnB1dFZhbHVlc0luZGV4KytdID0gaW5wdXRUZW5zb3JIYW5kbGVzW2ldO1xuICAgICAgd2FzbS5IRUFQVTMyW2lucHV0TmFtZXNJbmRleCsrXSA9IGlucHV0TmFtZXNVVEY4RW5jb2RlZFtpbnB1dEluZGljZXNbaV1dO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dHB1dENvdW50OyBpKyspIHtcbiAgICAgIHdhc20uSEVBUFUzMltvdXRwdXRWYWx1ZXNJbmRleCsrXSA9IG91dHB1dFRlbnNvckhhbmRsZXNbaV07XG4gICAgICB3YXNtLkhFQVBVMzJbb3V0cHV0TmFtZXNJbmRleCsrXSA9IG91dHB1dE5hbWVzVVRGOEVuY29kZWRbb3V0cHV0SW5kaWNlc1tpXV07XG4gICAgfVxuXG4gICAgaWYgKCFCVUlMRF9ERUZTLkRJU0FCTEVfV0VCR1BVICYmIGlvQmluZGluZ1N0YXRlICYmICFpbnB1dE91dHB1dEJvdW5kKSB7XG4gICAgICBjb25zdCB7aGFuZGxlLCBvdXRwdXRQcmVmZXJyZWRMb2NhdGlvbnMsIG91dHB1dFByZWZlcnJlZExvY2F0aW9uc0VuY29kZWR9ID0gaW9CaW5kaW5nU3RhdGU7XG5cbiAgICAgIGlmIChpbnB1dE5hbWVzVVRGOEVuY29kZWQubGVuZ3RoICE9PSBpbnB1dENvdW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgaW5wdXQgY291bnQgZnJvbSBmZWVkcyAoJHtcbiAgICAgICAgICAgIGlucHV0Q291bnR9KSBpcyBleHBlY3RlZCB0byBiZSBhbHdheXMgZXF1YWwgdG8gbW9kZWwncyBpbnB1dCBjb3VudCAoJHtpbnB1dE5hbWVzVVRGOEVuY29kZWQubGVuZ3RofSkuYCk7XG4gICAgICB9XG5cbiAgICAgIC8vIHByb2Nlc3MgaW5wdXRzXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0Q291bnQ7IGkrKykge1xuICAgICAgICBjb25zdCBpbmRleCA9IGlucHV0SW5kaWNlc1tpXTtcbiAgICAgICAgY29uc3QgZXJyb3JDb2RlID0gYXdhaXQgd2FzbS5fT3J0QmluZElucHV0KGhhbmRsZSwgaW5wdXROYW1lc1VURjhFbmNvZGVkW2luZGV4XSwgaW5wdXRUZW5zb3JIYW5kbGVzW2ldKTtcbiAgICAgICAgaWYgKGVycm9yQ29kZSAhPT0gMCkge1xuICAgICAgICAgIGNoZWNrTGFzdEVycm9yKGBDYW4ndCBiaW5kIGlucHV0WyR7aX1dIGZvciBzZXNzaW9uPSR7c2Vzc2lvbklkfS5gKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBwcm9jZXNzIHByZS1hbGxvY2F0ZWQgb3V0cHV0c1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdXRwdXRDb3VudDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gb3V0cHV0SW5kaWNlc1tpXTtcbiAgICAgICAgY29uc3QgbG9jYXRpb24gPSBvdXRwdXRUZW5zb3JzW2ldPy5bM107ICAvLyB1bmRlZmluZWQgbWVhbnMgb3V0cHV0IGlzIG5vdCBwcmUtYWxsb2NhdGVkLlxuXG4gICAgICAgIGlmIChsb2NhdGlvbikge1xuICAgICAgICAgIC8vIG91dHB1dCBpcyBwcmUtYWxsb2NhdGVkLiBiaW5kIHRoZSB0ZW5zb3IuXG4gICAgICAgICAgY29uc3QgZXJyb3JDb2RlID0gd2FzbS5fT3J0QmluZE91dHB1dChoYW5kbGUsIG91dHB1dE5hbWVzVVRGOEVuY29kZWRbaW5kZXhdLCBvdXRwdXRUZW5zb3JIYW5kbGVzW2ldLCAwKTtcbiAgICAgICAgICBpZiAoZXJyb3JDb2RlICE9PSAwKSB7XG4gICAgICAgICAgICBjaGVja0xhc3RFcnJvcihgQ2FuJ3QgYmluZCBwcmUtYWxsb2NhdGVkIG91dHB1dFske2l9XSBmb3Igc2Vzc2lvbj0ke3Nlc3Npb25JZH0uYCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIG91dHB1dCBpcyBub3QgcHJlLWFsbG9jYXRlZC4gcmVzZXQgcHJlZmVycmVkIGxvY2F0aW9uLlxuICAgICAgICAgIGNvbnN0IGVycm9yQ29kZSA9XG4gICAgICAgICAgICAgIHdhc20uX09ydEJpbmRPdXRwdXQoaGFuZGxlLCBvdXRwdXROYW1lc1VURjhFbmNvZGVkW2luZGV4XSwgMCwgb3V0cHV0UHJlZmVycmVkTG9jYXRpb25zRW5jb2RlZFtpbmRleF0pO1xuICAgICAgICAgIGlmIChlcnJvckNvZGUgIT09IDApIHtcbiAgICAgICAgICAgIGNoZWNrTGFzdEVycm9yKGBDYW4ndCBiaW5kIG91dHB1dFske2l9XSB0byAke291dHB1dFByZWZlcnJlZExvY2F0aW9uc1tpXX0gZm9yIHNlc3Npb249JHtzZXNzaW9uSWR9LmApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYWN0aXZlU2Vzc2lvbnMuc2V0KFxuICAgICAgICAgIHNlc3Npb25JZCxcbiAgICAgICAgICBbc2Vzc2lvbkhhbmRsZSwgaW5wdXROYW1lc1VURjhFbmNvZGVkLCBvdXRwdXROYW1lc1VURjhFbmNvZGVkLCBpb0JpbmRpbmdTdGF0ZSwgZW5hYmxlR3JhcGhDYXB0dXJlLCB0cnVlXSk7XG4gICAgfVxuXG4gICAgd2FzbS5qc2VwT25SdW5TdGFydD8uKHNlc3Npb25IYW5kbGUpO1xuICAgIGxldCBlcnJvckNvZGU6IG51bWJlcjtcbiAgICBpZiAoIUJVSUxEX0RFRlMuRElTQUJMRV9XRUJHUFUgJiYgaW9CaW5kaW5nU3RhdGUpIHtcbiAgICAgIGVycm9yQ29kZSA9IGF3YWl0IHdhc20uX09ydFJ1bldpdGhCaW5kaW5nKFxuICAgICAgICAgIHNlc3Npb25IYW5kbGUsIGlvQmluZGluZ1N0YXRlLmhhbmRsZSwgb3V0cHV0Q291bnQsIG91dHB1dFZhbHVlc09mZnNldCwgcnVuT3B0aW9uc0hhbmRsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9yQ29kZSA9IGF3YWl0IHdhc20uX09ydFJ1bihcbiAgICAgICAgICBzZXNzaW9uSGFuZGxlLCBpbnB1dE5hbWVzT2Zmc2V0LCBpbnB1dFZhbHVlc09mZnNldCwgaW5wdXRDb3VudCwgb3V0cHV0TmFtZXNPZmZzZXQsIG91dHB1dENvdW50LFxuICAgICAgICAgIG91dHB1dFZhbHVlc09mZnNldCwgcnVuT3B0aW9uc0hhbmRsZSk7XG4gICAgfVxuXG4gICAgaWYgKGVycm9yQ29kZSAhPT0gMCkge1xuICAgICAgY2hlY2tMYXN0RXJyb3IoJ2ZhaWxlZCB0byBjYWxsIE9ydFJ1bigpLicpO1xuICAgIH1cblxuICAgIGNvbnN0IG91dHB1dDogVGVuc29yTWV0YWRhdGFbXSA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdXRwdXRDb3VudDsgaSsrKSB7XG4gICAgICBjb25zdCB0ZW5zb3IgPSB3YXNtLkhFQVBVMzJbb3V0cHV0VmFsdWVzT2Zmc2V0IC8gNCArIGldO1xuICAgICAgaWYgKHRlbnNvciA9PT0gb3V0cHV0VGVuc29ySGFuZGxlc1tpXSkge1xuICAgICAgICAvLyBvdXRwdXQgdGVuc29yIGlzIHByZS1hbGxvY2F0ZWQuIG5vIG5lZWQgdG8gY29weSBkYXRhLlxuICAgICAgICBvdXRwdXQucHVzaChvdXRwdXRUZW5zb3JzW2ldISk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBiZWZvcmVHZXRUZW5zb3JEYXRhU3RhY2sgPSB3YXNtLnN0YWNrU2F2ZSgpO1xuICAgICAgLy8gc3RhY2sgYWxsb2NhdGUgNCBwb2ludGVyIHZhbHVlXG4gICAgICBjb25zdCB0ZW5zb3JEYXRhT2Zmc2V0ID0gd2FzbS5zdGFja0FsbG9jKDQgKiA0KTtcblxuICAgICAgbGV0IGtlZXBPdXRwdXRUZW5zb3IgPSBmYWxzZTtcbiAgICAgIGxldCB0eXBlOiBUZW5zb3IuVHlwZXx1bmRlZmluZWQsIGRhdGFPZmZzZXQgPSAwO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZXJyb3JDb2RlID0gd2FzbS5fT3J0R2V0VGVuc29yRGF0YShcbiAgICAgICAgICAgIHRlbnNvciwgdGVuc29yRGF0YU9mZnNldCwgdGVuc29yRGF0YU9mZnNldCArIDQsIHRlbnNvckRhdGFPZmZzZXQgKyA4LCB0ZW5zb3JEYXRhT2Zmc2V0ICsgMTIpO1xuICAgICAgICBpZiAoZXJyb3JDb2RlICE9PSAwKSB7XG4gICAgICAgICAgY2hlY2tMYXN0RXJyb3IoYENhbid0IGFjY2VzcyBvdXRwdXQgdGVuc29yIGRhdGEgb24gaW5kZXggJHtpfS5gKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdGVuc29yRGF0YUluZGV4ID0gdGVuc29yRGF0YU9mZnNldCAvIDQ7XG4gICAgICAgIGNvbnN0IGRhdGFUeXBlID0gd2FzbS5IRUFQVTMyW3RlbnNvckRhdGFJbmRleCsrXTtcbiAgICAgICAgZGF0YU9mZnNldCA9IHdhc20uSEVBUFUzMlt0ZW5zb3JEYXRhSW5kZXgrK107XG4gICAgICAgIGNvbnN0IGRpbXNPZmZzZXQgPSB3YXNtLkhFQVBVMzJbdGVuc29yRGF0YUluZGV4KytdO1xuICAgICAgICBjb25zdCBkaW1zTGVuZ3RoID0gd2FzbS5IRUFQVTMyW3RlbnNvckRhdGFJbmRleCsrXTtcbiAgICAgICAgY29uc3QgZGltcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpbXNMZW5ndGg7IGkrKykge1xuICAgICAgICAgIGRpbXMucHVzaCh3YXNtLkhFQVBVMzJbZGltc09mZnNldCAvIDQgKyBpXSk7XG4gICAgICAgIH1cbiAgICAgICAgd2FzbS5fT3J0RnJlZShkaW1zT2Zmc2V0KTtcblxuICAgICAgICBjb25zdCBzaXplID0gZGltcy5yZWR1Y2UoKGEsIGIpID0+IGEgKiBiLCAxKTtcbiAgICAgICAgdHlwZSA9IHRlbnNvckRhdGFUeXBlRW51bVRvU3RyaW5nKGRhdGFUeXBlKTtcblxuICAgICAgICBjb25zdCBwcmVmZXJyZWRMb2NhdGlvbiA9IGlvQmluZGluZ1N0YXRlPy5vdXRwdXRQcmVmZXJyZWRMb2NhdGlvbnNbb3V0cHV0SW5kaWNlc1tpXV07XG5cbiAgICAgICAgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgaWYgKHByZWZlcnJlZExvY2F0aW9uID09PSAnZ3B1LWJ1ZmZlcicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU3RyaW5nIHRlbnNvciBpcyBub3Qgc3VwcG9ydGVkIG9uIEdQVS4nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3Qgc3RyaW5nRGF0YTogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICBsZXQgZGF0YUluZGV4ID0gZGF0YU9mZnNldCAvIDQ7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IHdhc20uSEVBUFUzMltkYXRhSW5kZXgrK107XG4gICAgICAgICAgICBjb25zdCBtYXhCeXRlc1RvUmVhZCA9IGkgPT09IHNpemUgLSAxID8gdW5kZWZpbmVkIDogd2FzbS5IRUFQVTMyW2RhdGFJbmRleF0gLSBvZmZzZXQ7XG4gICAgICAgICAgICBzdHJpbmdEYXRhLnB1c2god2FzbS5VVEY4VG9TdHJpbmcob2Zmc2V0LCBtYXhCeXRlc1RvUmVhZCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvdXRwdXQucHVzaChbdHlwZSwgZGltcywgc3RyaW5nRGF0YSwgJ2NwdSddKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBJZiBhIGNlcnRhaW4gb3V0cHV0J3MgcHJlZmVycmVkIGxvY2F0aW9uIGlzIEdQVSBidXQgdGhlIHRlbnNvciBpcyBlbXB0eSwgd2Ugc3RpbGwgbmVlZCB0byBjcmVhdGUgYSBDUFVcbiAgICAgICAgICAvLyB0ZW5zb3IgZm9yIGl0LiBUaGVyZSBpcyBubyBtYXBwaW5nIEdQVSBidWZmZXIgZm9yIGFuIGVtcHR5IHRlbnNvci5cbiAgICAgICAgICBpZiAocHJlZmVycmVkTG9jYXRpb24gPT09ICdncHUtYnVmZmVyJyAmJiBzaXplID4gMCkge1xuICAgICAgICAgICAgY29uc3QgZ2V0QnVmZmVyID0gd2FzbS5qc2VwR2V0QnVmZmVyO1xuICAgICAgICAgICAgaWYgKCFnZXRCdWZmZXIpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwcmVmZXJyZWRMb2NhdGlvbiBcImdwdS1idWZmZXJcIiBpcyBub3Qgc3VwcG9ydGVkIHdpdGhvdXQgdXNpbmcgV2ViR1BVLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZ3B1QnVmZmVyID0gZ2V0QnVmZmVyKGRhdGFPZmZzZXQpO1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudFNpemUgPSBnZXRUZW5zb3JFbGVtZW50U2l6ZShkYXRhVHlwZSk7XG4gICAgICAgICAgICBpZiAoZWxlbWVudFNpemUgPT09IHVuZGVmaW5lZCB8fCAhaXNHcHVCdWZmZXJTdXBwb3J0ZWRUeXBlKHR5cGUpKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZGF0YSB0eXBlOiAke3R5cGV9YCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGRvIG5vdCByZWxlYXNlIHRoZSB0ZW5zb3IgcmlnaHQgbm93LiBpdCB3aWxsIGJlIHJlbGVhc2VkIHdoZW4gdXNlciBjYWxscyB0ZW5zb3IuZGlzcG9zZSgpLlxuICAgICAgICAgICAga2VlcE91dHB1dFRlbnNvciA9IHRydWU7XG5cbiAgICAgICAgICAgIG91dHB1dC5wdXNoKFtcbiAgICAgICAgICAgICAgdHlwZSwgZGltcywge1xuICAgICAgICAgICAgICAgIGdwdUJ1ZmZlcixcbiAgICAgICAgICAgICAgICBkb3dubG9hZDogd2FzbS5qc2VwQ3JlYXRlRG93bmxvYWRlciEoZ3B1QnVmZmVyLCBzaXplICogZWxlbWVudFNpemUsIHR5cGUpLFxuICAgICAgICAgICAgICAgIGRpc3Bvc2U6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHdhc20uX09ydFJlbGVhc2VUZW5zb3IodGVuc29yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdncHUtYnVmZmVyJ1xuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGVkQXJyYXlDb25zdHJ1Y3RvciA9IHRlbnNvclR5cGVUb1R5cGVkQXJyYXlDb25zdHJ1Y3Rvcih0eXBlKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBuZXcgdHlwZWRBcnJheUNvbnN0cnVjdG9yKHNpemUpO1xuICAgICAgICAgICAgbmV3IFVpbnQ4QXJyYXkoZGF0YS5idWZmZXIsIGRhdGEuYnl0ZU9mZnNldCwgZGF0YS5ieXRlTGVuZ3RoKVxuICAgICAgICAgICAgICAgIC5zZXQod2FzbS5IRUFQVTguc3ViYXJyYXkoZGF0YU9mZnNldCwgZGF0YU9mZnNldCArIGRhdGEuYnl0ZUxlbmd0aCkpO1xuICAgICAgICAgICAgb3V0cHV0LnB1c2goW3R5cGUsIGRpbXMsIGRhdGEsICdjcHUnXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLnN0YWNrUmVzdG9yZShiZWZvcmVHZXRUZW5zb3JEYXRhU3RhY2spO1xuICAgICAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgZGF0YU9mZnNldCkge1xuICAgICAgICAgIHdhc20uX2ZyZWUoZGF0YU9mZnNldCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFrZWVwT3V0cHV0VGVuc29yKSB7XG4gICAgICAgICAgd2FzbS5fT3J0UmVsZWFzZVRlbnNvcih0ZW5zb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlvQmluZGluZ1N0YXRlICYmICFlbmFibGVHcmFwaENhcHR1cmUpIHtcbiAgICAgIHdhc20uX09ydENsZWFyQm91bmRPdXRwdXRzKGlvQmluZGluZ1N0YXRlLmhhbmRsZSk7XG4gICAgICBhY3RpdmVTZXNzaW9ucy5zZXQoXG4gICAgICAgICAgc2Vzc2lvbklkLFxuICAgICAgICAgIFtzZXNzaW9uSGFuZGxlLCBpbnB1dE5hbWVzVVRGOEVuY29kZWQsIG91dHB1dE5hbWVzVVRGOEVuY29kZWQsIGlvQmluZGluZ1N0YXRlLCBlbmFibGVHcmFwaENhcHR1cmUsIGZhbHNlXSk7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH0gZmluYWxseSB7XG4gICAgd2FzbS5zdGFja1Jlc3RvcmUoYmVmb3JlUnVuU3RhY2spO1xuXG4gICAgaW5wdXRUZW5zb3JIYW5kbGVzLmZvckVhY2godiA9PiB3YXNtLl9PcnRSZWxlYXNlVGVuc29yKHYpKTtcbiAgICBvdXRwdXRUZW5zb3JIYW5kbGVzLmZvckVhY2godiA9PiB3YXNtLl9PcnRSZWxlYXNlVGVuc29yKHYpKTtcbiAgICBpbnB1dE91dHB1dEFsbG9jcy5mb3JFYWNoKHAgPT4gd2FzbS5fZnJlZShwKSk7XG5cbiAgICBpZiAocnVuT3B0aW9uc0hhbmRsZSAhPT0gMCkge1xuICAgICAgd2FzbS5fT3J0UmVsZWFzZVJ1bk9wdGlvbnMocnVuT3B0aW9uc0hhbmRsZSk7XG4gICAgfVxuICAgIHJ1bk9wdGlvbnNBbGxvY3MuZm9yRWFjaChwID0+IHdhc20uX2ZyZWUocCkpO1xuICB9XG59O1xuXG4vKipcbiAqIGVuZCBwcm9maWxpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IGVuZFByb2ZpbGluZyA9IChzZXNzaW9uSWQ6IG51bWJlcik6IHZvaWQgPT4ge1xuICBjb25zdCB3YXNtID0gZ2V0SW5zdGFuY2UoKTtcbiAgY29uc3Qgc2Vzc2lvbiA9IGFjdGl2ZVNlc3Npb25zLmdldChzZXNzaW9uSWQpO1xuICBpZiAoIXNlc3Npb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgc2Vzc2lvbiBpZCcpO1xuICB9XG4gIGNvbnN0IHNlc3Npb25IYW5kbGUgPSBzZXNzaW9uWzBdO1xuXG4gIC8vIHByb2ZpbGUgZmlsZSBuYW1lIGlzIG5vdCB1c2VkIHlldCwgYnV0IGl0IG11c3QgYmUgZnJlZWQuXG4gIGNvbnN0IHByb2ZpbGVGaWxlTmFtZSA9IHdhc20uX09ydEVuZFByb2ZpbGluZyhzZXNzaW9uSGFuZGxlKTtcbiAgaWYgKHByb2ZpbGVGaWxlTmFtZSA9PT0gMCkge1xuICAgIGNoZWNrTGFzdEVycm9yKCdDYW5cXCd0IGdldCBhbiBwcm9maWxlIGZpbGUgbmFtZS4nKTtcbiAgfVxuICB3YXNtLl9PcnRGcmVlKHByb2ZpbGVGaWxlTmFtZSk7XG59O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdFRyYW5zZmVyYWJsZUJ1ZmZlcnMgPSAodGVuc29yczogcmVhZG9ubHkgU2VyaWFsaXphYmxlVGVuc29yTWV0YWRhdGFbXSk6IEFycmF5QnVmZmVyTGlrZVtdID0+IHtcbiAgY29uc3QgYnVmZmVyczogQXJyYXlCdWZmZXJMaWtlW10gPSBbXTtcbiAgZm9yIChjb25zdCB0ZW5zb3Igb2YgdGVuc29ycykge1xuICAgIGNvbnN0IGRhdGEgPSB0ZW5zb3JbMl07XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEpICYmICdidWZmZXInIGluIGRhdGEpIHtcbiAgICAgIGJ1ZmZlcnMucHVzaChkYXRhLmJ1ZmZlcik7XG4gICAgfVxuICB9XG4gIHJldHVybiBidWZmZXJzO1xufTtcbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuaW1wb3J0IHtlbnYsIEluZmVyZW5jZVNlc3Npb259IGZyb20gJ29ubnhydW50aW1lLWNvbW1vbic7XG5cbmltcG9ydCB7T3J0V2FzbU1lc3NhZ2UsIFNlcmlhbGl6YWJsZUludGVybmFsQnVmZmVyLCBTZXJpYWxpemFibGVTZXNzaW9uTWV0YWRhdGEsIFNlcmlhbGl6YWJsZVRlbnNvck1ldGFkYXRhLCBUZW5zb3JNZXRhZGF0YX0gZnJvbSAnLi9wcm94eS1tZXNzYWdlcyc7XG5pbXBvcnQgKiBhcyBjb3JlIGZyb20gJy4vd2FzbS1jb3JlLWltcGwnO1xuaW1wb3J0IHtpbml0aWFsaXplV2ViQXNzZW1ibHl9IGZyb20gJy4vd2FzbS1mYWN0b3J5JztcblxuY29uc3QgaXNQcm94eSA9ICgpOiBib29sZWFuID0+ICEhZW52Lndhc20ucHJveHkgJiYgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJztcbmxldCBwcm94eVdvcmtlcjogV29ya2VyfHVuZGVmaW5lZDtcbmxldCBpbml0aWFsaXppbmcgPSBmYWxzZTtcbmxldCBpbml0aWFsaXplZCA9IGZhbHNlO1xubGV0IGFib3J0ZWQgPSBmYWxzZTtcblxudHlwZSBQcm9taXNlQ2FsbGJhY2tzPFQgPSB2b2lkPiA9IFtyZXNvbHZlOiAocmVzdWx0OiBUKSA9PiB2b2lkLCByZWplY3Q6IChyZWFzb246IHVua25vd24pID0+IHZvaWRdO1xubGV0IGluaXRXYXNtQ2FsbGJhY2tzOiBQcm9taXNlQ2FsbGJhY2tzO1xuY29uc3QgcXVldWVkQ2FsbGJhY2tzOiBNYXA8T3J0V2FzbU1lc3NhZ2VbJ3R5cGUnXSwgQXJyYXk8UHJvbWlzZUNhbGxiYWNrczx1bmtub3duPj4+ID0gbmV3IE1hcCgpO1xuXG5jb25zdCBlbnF1ZXVlQ2FsbGJhY2tzID0gKHR5cGU6IE9ydFdhc21NZXNzYWdlWyd0eXBlJ10sIGNhbGxiYWNrczogUHJvbWlzZUNhbGxiYWNrczx1bmtub3duPik6IHZvaWQgPT4ge1xuICBjb25zdCBxdWV1ZSA9IHF1ZXVlZENhbGxiYWNrcy5nZXQodHlwZSk7XG4gIGlmIChxdWV1ZSkge1xuICAgIHF1ZXVlLnB1c2goY2FsbGJhY2tzKTtcbiAgfSBlbHNlIHtcbiAgICBxdWV1ZWRDYWxsYmFja3Muc2V0KHR5cGUsIFtjYWxsYmFja3NdKTtcbiAgfVxufTtcblxuY29uc3QgZW5zdXJlV29ya2VyID0gKCk6IHZvaWQgPT4ge1xuICBpZiAoaW5pdGlhbGl6aW5nIHx8ICFpbml0aWFsaXplZCB8fCBhYm9ydGVkIHx8ICFwcm94eVdvcmtlcikge1xuICAgIHRocm93IG5ldyBFcnJvcignd29ya2VyIG5vdCByZWFkeScpO1xuICB9XG59O1xuXG5jb25zdCBvblByb3h5V29ya2VyTWVzc2FnZSA9IChldjogTWVzc2FnZUV2ZW50PE9ydFdhc21NZXNzYWdlPik6IHZvaWQgPT4ge1xuICBzd2l0Y2ggKGV2LmRhdGEudHlwZSkge1xuICAgIGNhc2UgJ2luaXQtd2FzbSc6XG4gICAgICBpbml0aWFsaXppbmcgPSBmYWxzZTtcbiAgICAgIGlmIChldi5kYXRhLmVycikge1xuICAgICAgICBhYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgaW5pdFdhc21DYWxsYmFja3NbMV0oZXYuZGF0YS5lcnIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICBpbml0V2FzbUNhbGxiYWNrc1swXSgpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnaW5pdC1lcCc6XG4gICAgY2FzZSAnY29weS1mcm9tJzpcbiAgICBjYXNlICdjcmVhdGUnOlxuICAgIGNhc2UgJ3JlbGVhc2UnOlxuICAgIGNhc2UgJ3J1bic6XG4gICAgY2FzZSAnZW5kLXByb2ZpbGluZyc6IHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrcyA9IHF1ZXVlZENhbGxiYWNrcy5nZXQoZXYuZGF0YS50eXBlKSE7XG4gICAgICBpZiAoZXYuZGF0YS5lcnIpIHtcbiAgICAgICAgY2FsbGJhY2tzLnNoaWZ0KCkhWzFdKGV2LmRhdGEuZXJyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrcy5zaGlmdCgpIVswXShldi5kYXRhLm91dCEpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGRlZmF1bHQ6XG4gIH1cbn07XG5cbmNvbnN0IHNjcmlwdFNyYyA9IHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgPyAoZG9jdW1lbnQ/LmN1cnJlbnRTY3JpcHQgYXMgSFRNTFNjcmlwdEVsZW1lbnQpPy5zcmMgOiB1bmRlZmluZWQ7XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXplV2ViQXNzZW1ibHlBbmRPcnRSdW50aW1lID0gYXN5bmMoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGlmIChpbml0aWFsaXplZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoaW5pdGlhbGl6aW5nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdtdWx0aXBsZSBjYWxscyB0byBcXCdpbml0V2FzbSgpXFwnIGRldGVjdGVkLicpO1xuICB9XG4gIGlmIChhYm9ydGVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcmV2aW91cyBjYWxsIHRvIFxcJ2luaXRXYXNtKClcXCcgZmFpbGVkLicpO1xuICB9XG5cbiAgaW5pdGlhbGl6aW5nID0gdHJ1ZTtcblxuICBpZiAoIUJVSUxEX0RFRlMuRElTQUJMRV9XQVNNX1BST1hZICYmIGlzUHJveHkoKSkge1xuICAgIC8vIG92ZXJ3cml0ZSB3YXNtIGZpbGVwYXRoc1xuICAgIGlmIChlbnYud2FzbS53YXNtUGF0aHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHNjcmlwdFNyYyAmJiBzY3JpcHRTcmMuaW5kZXhPZignYmxvYjonKSAhPT0gMCkge1xuICAgICAgICBlbnYud2FzbS53YXNtUGF0aHMgPSBzY3JpcHRTcmMuc3Vic3RyKDAsICsoc2NyaXB0U3JjKS5sYXN0SW5kZXhPZignLycpICsgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHByb3h5V29ya2VyPy50ZXJtaW5hdGUoKTtcblxuICAgICAgY29uc3Qgd29ya2VyVXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihcbiAgICAgICAgICBbXG4gICAgICAgICAgICAvLyBUaGlzIHJlcXVpcmUoKSBmdW5jdGlvbiBpcyBoYW5kbGVkIGJ5IGVzYnVpbGQgcGx1Z2luIHRvIGxvYWQgZmlsZSBjb250ZW50IGFzIHN0cmluZy5cbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgICAgICAgICByZXF1aXJlKCcuL3Byb3h5LXdvcmtlci9tYWluJylcbiAgICAgICAgICBdLFxuICAgICAgICAgIHt0eXBlOiAndGV4dC9qYXZhc2NyaXB0J30pKTtcbiAgICAgIHByb3h5V29ya2VyID0gbmV3IFdvcmtlcih3b3JrZXJVcmwsIHtuYW1lOiAnb3J0LXdhc20tcHJveHktd29ya2VyJ30pO1xuICAgICAgcHJveHlXb3JrZXIub25lcnJvciA9IChldjogRXJyb3JFdmVudCkgPT4gcmVqZWN0KGV2KTtcbiAgICAgIHByb3h5V29ya2VyLm9ubWVzc2FnZSA9IG9uUHJveHlXb3JrZXJNZXNzYWdlO1xuICAgICAgVVJMLnJldm9rZU9iamVjdFVSTCh3b3JrZXJVcmwpO1xuICAgICAgaW5pdFdhc21DYWxsYmFja3MgPSBbcmVzb2x2ZSwgcmVqZWN0XTtcbiAgICAgIGNvbnN0IG1lc3NhZ2U6IE9ydFdhc21NZXNzYWdlID0ge3R5cGU6ICdpbml0LXdhc20nLCBpbiA6IGVudn07XG4gICAgICBwcm94eVdvcmtlci5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbiAgICB9KTtcblxuICB9IGVsc2Uge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBpbml0aWFsaXplV2ViQXNzZW1ibHkoZW52Lndhc20pO1xuICAgICAgYXdhaXQgY29yZS5pbml0UnVudGltZShlbnYpO1xuICAgICAgaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGFib3J0ZWQgPSB0cnVlO1xuICAgICAgdGhyb3cgZTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaW5pdGlhbGl6aW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgaW5pdGlhbGl6ZU9ydEVwID0gYXN5bmMoZXBOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgaWYgKCFCVUlMRF9ERUZTLkRJU0FCTEVfV0FTTV9QUk9YWSAmJiBpc1Byb3h5KCkpIHtcbiAgICBlbnN1cmVXb3JrZXIoKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZW5xdWV1ZUNhbGxiYWNrcygnaW5pdC1lcCcsIFtyZXNvbHZlLCByZWplY3RdKTtcbiAgICAgIGNvbnN0IG1lc3NhZ2U6IE9ydFdhc21NZXNzYWdlID0ge3R5cGU6ICdpbml0LWVwJywgaW4gOiB7ZXBOYW1lLCBlbnZ9fTtcbiAgICAgIHByb3h5V29ya2VyIS5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBhd2FpdCBjb3JlLmluaXRFcChlbnYsIGVwTmFtZSk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBjb3B5RnJvbUV4dGVybmFsQnVmZmVyID0gYXN5bmMoYnVmZmVyOiBVaW50OEFycmF5KTogUHJvbWlzZTxTZXJpYWxpemFibGVJbnRlcm5hbEJ1ZmZlcj4gPT4ge1xuICBpZiAoIUJVSUxEX0RFRlMuRElTQUJMRV9XQVNNX1BST1hZICYmIGlzUHJveHkoKSkge1xuICAgIGVuc3VyZVdvcmtlcigpO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxTZXJpYWxpemFibGVJbnRlcm5hbEJ1ZmZlcj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZW5xdWV1ZUNhbGxiYWNrcygnY29weS1mcm9tJywgW3Jlc29sdmUsIHJlamVjdF0pO1xuICAgICAgY29uc3QgbWVzc2FnZTogT3J0V2FzbU1lc3NhZ2UgPSB7dHlwZTogJ2NvcHktZnJvbScsIGluIDoge2J1ZmZlcn19O1xuICAgICAgcHJveHlXb3JrZXIhLnBvc3RNZXNzYWdlKG1lc3NhZ2UsIFtidWZmZXIuYnVmZmVyXSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGNvcmUuY29weUZyb21FeHRlcm5hbEJ1ZmZlcihidWZmZXIpO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlU2Vzc2lvbiA9XG4gICAgYXN5bmMobW9kZWw6IFNlcmlhbGl6YWJsZUludGVybmFsQnVmZmVyfFVpbnQ4QXJyYXksIG9wdGlvbnM/OiBJbmZlcmVuY2VTZXNzaW9uLlNlc3Npb25PcHRpb25zKTpcbiAgICAgICAgUHJvbWlzZTxTZXJpYWxpemFibGVTZXNzaW9uTWV0YWRhdGE+ID0+IHtcbiAgICAgICAgICBpZiAoIUJVSUxEX0RFRlMuRElTQUJMRV9XQVNNX1BST1hZICYmIGlzUHJveHkoKSkge1xuICAgICAgICAgICAgLy8gY2hlY2sgdW5zdXBwb3J0ZWQgb3B0aW9uc1xuICAgICAgICAgICAgaWYgKG9wdGlvbnM/LnByZWZlcnJlZE91dHB1dExvY2F0aW9uKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignc2Vzc2lvbiBvcHRpb24gXCJwcmVmZXJyZWRPdXRwdXRMb2NhdGlvblwiIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIHByb3h5LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW5zdXJlV29ya2VyKCk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8U2VyaWFsaXphYmxlU2Vzc2lvbk1ldGFkYXRhPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgIGVucXVldWVDYWxsYmFja3MoJ2NyZWF0ZScsIFtyZXNvbHZlLCByZWplY3RdKTtcbiAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZTogT3J0V2FzbU1lc3NhZ2UgPSB7dHlwZTogJ2NyZWF0ZScsIGluIDoge21vZGVsLCBvcHRpb25zOiB7Li4ub3B0aW9uc319fTtcbiAgICAgICAgICAgICAgY29uc3QgdHJhbnNmZXJhYmxlOiBUcmFuc2ZlcmFibGVbXSA9IFtdO1xuICAgICAgICAgICAgICBpZiAobW9kZWwgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICAgICAgICAgICAgdHJhbnNmZXJhYmxlLnB1c2gobW9kZWwuYnVmZmVyKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBwcm94eVdvcmtlciEucG9zdE1lc3NhZ2UobWVzc2FnZSwgdHJhbnNmZXJhYmxlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gY29yZS5jcmVhdGVTZXNzaW9uKG1vZGVsLCBvcHRpb25zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbmV4cG9ydCBjb25zdCByZWxlYXNlU2Vzc2lvbiA9IGFzeW5jKHNlc3Npb25JZDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGlmICghQlVJTERfREVGUy5ESVNBQkxFX1dBU01fUFJPWFkgJiYgaXNQcm94eSgpKSB7XG4gICAgZW5zdXJlV29ya2VyKCk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGVucXVldWVDYWxsYmFja3MoJ3JlbGVhc2UnLCBbcmVzb2x2ZSwgcmVqZWN0XSk7XG4gICAgICBjb25zdCBtZXNzYWdlOiBPcnRXYXNtTWVzc2FnZSA9IHt0eXBlOiAncmVsZWFzZScsIGluIDogc2Vzc2lvbklkfTtcbiAgICAgIHByb3h5V29ya2VyIS5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb3JlLnJlbGVhc2VTZXNzaW9uKHNlc3Npb25JZCk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBydW4gPSBhc3luYyhcbiAgICBzZXNzaW9uSWQ6IG51bWJlciwgaW5wdXRJbmRpY2VzOiBudW1iZXJbXSwgaW5wdXRzOiBUZW5zb3JNZXRhZGF0YVtdLCBvdXRwdXRJbmRpY2VzOiBudW1iZXJbXSxcbiAgICBvdXRwdXRzOiBBcnJheTxUZW5zb3JNZXRhZGF0YXxudWxsPiwgb3B0aW9uczogSW5mZXJlbmNlU2Vzc2lvbi5SdW5PcHRpb25zKTogUHJvbWlzZTxUZW5zb3JNZXRhZGF0YVtdPiA9PiB7XG4gIGlmICghQlVJTERfREVGUy5ESVNBQkxFX1dBU01fUFJPWFkgJiYgaXNQcm94eSgpKSB7XG4gICAgLy8gY2hlY2sgaW5wdXRzIGxvY2F0aW9uXG4gICAgaWYgKGlucHV0cy5zb21lKHQgPT4gdFszXSAhPT0gJ2NwdScpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2lucHV0IHRlbnNvciBvbiBHUFUgaXMgbm90IHN1cHBvcnRlZCBmb3IgcHJveHkuJyk7XG4gICAgfVxuICAgIC8vIGNoZWNrIG91dHB1dHMgbG9jYXRpb25cbiAgICBpZiAob3V0cHV0cy5zb21lKHQgPT4gdCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigncHJlLWFsbG9jYXRlZCBvdXRwdXQgdGVuc29yIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIHByb3h5LicpO1xuICAgIH1cbiAgICBlbnN1cmVXb3JrZXIoKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8U2VyaWFsaXphYmxlVGVuc29yTWV0YWRhdGFbXT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZW5xdWV1ZUNhbGxiYWNrcygncnVuJywgW3Jlc29sdmUsIHJlamVjdF0pO1xuICAgICAgY29uc3Qgc2VyaWFsaXphYmxlSW5wdXRzID0gaW5wdXRzIGFzIFNlcmlhbGl6YWJsZVRlbnNvck1ldGFkYXRhW107ICAvLyBldmVyeSBpbnB1dCBpcyBvbiBDUFUuXG4gICAgICBjb25zdCBtZXNzYWdlOiBPcnRXYXNtTWVzc2FnZSA9XG4gICAgICAgICAge3R5cGU6ICdydW4nLCBpbiA6IHtzZXNzaW9uSWQsIGlucHV0SW5kaWNlcywgaW5wdXRzOiBzZXJpYWxpemFibGVJbnB1dHMsIG91dHB1dEluZGljZXMsIG9wdGlvbnN9fTtcbiAgICAgIHByb3h5V29ya2VyIS5wb3N0TWVzc2FnZShtZXNzYWdlLCBjb3JlLmV4dHJhY3RUcmFuc2ZlcmFibGVCdWZmZXJzKHNlcmlhbGl6YWJsZUlucHV0cykpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBjb3JlLnJ1bihzZXNzaW9uSWQsIGlucHV0SW5kaWNlcywgaW5wdXRzLCBvdXRwdXRJbmRpY2VzLCBvdXRwdXRzLCBvcHRpb25zKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGVuZFByb2ZpbGluZyA9IGFzeW5jKHNlc3Npb25JZDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGlmICghQlVJTERfREVGUy5ESVNBQkxFX1dBU01fUFJPWFkgJiYgaXNQcm94eSgpKSB7XG4gICAgZW5zdXJlV29ya2VyKCk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGVucXVldWVDYWxsYmFja3MoJ2VuZC1wcm9maWxpbmcnLCBbcmVzb2x2ZSwgcmVqZWN0XSk7XG4gICAgICBjb25zdCBtZXNzYWdlOiBPcnRXYXNtTWVzc2FnZSA9IHt0eXBlOiAnZW5kLXByb2ZpbGluZycsIGluIDogc2Vzc2lvbklkfTtcbiAgICAgIHByb3h5V29ya2VyIS5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb3JlLmVuZFByb2ZpbGluZyhzZXNzaW9uSWQpO1xuICB9XG59O1xuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQge0luZmVyZW5jZVNlc3Npb24sIEluZmVyZW5jZVNlc3Npb25IYW5kbGVyLCBTZXNzaW9uSGFuZGxlciwgVGVuc29yLCBUUkFDRV9GVU5DX0JFR0lOLCBUUkFDRV9GVU5DX0VORH0gZnJvbSAnb25ueHJ1bnRpbWUtY29tbW9uJztcblxuaW1wb3J0IHtTZXJpYWxpemFibGVJbnRlcm5hbEJ1ZmZlciwgVGVuc29yTWV0YWRhdGF9IGZyb20gJy4vcHJveHktbWVzc2FnZXMnO1xuaW1wb3J0IHtjb3B5RnJvbUV4dGVybmFsQnVmZmVyLCBjcmVhdGVTZXNzaW9uLCBlbmRQcm9maWxpbmcsIHJlbGVhc2VTZXNzaW9uLCBydW59IGZyb20gJy4vcHJveHktd3JhcHBlcic7XG5pbXBvcnQge2lzR3B1QnVmZmVyU3VwcG9ydGVkVHlwZX0gZnJvbSAnLi93YXNtLWNvbW1vbic7XG5pbXBvcnQge2xvYWRGaWxlfSBmcm9tICcuL3dhc20tdXRpbHMtbG9hZC1maWxlJztcblxuZXhwb3J0IGNvbnN0IGVuY29kZVRlbnNvck1ldGFkYXRhID0gKHRlbnNvcjogVGVuc29yLCBnZXROYW1lOiAoKSA9PiBzdHJpbmcpOiBUZW5zb3JNZXRhZGF0YSA9PiB7XG4gIHN3aXRjaCAodGVuc29yLmxvY2F0aW9uKSB7XG4gICAgY2FzZSAnY3B1JzpcbiAgICAgIHJldHVybiBbdGVuc29yLnR5cGUsIHRlbnNvci5kaW1zLCB0ZW5zb3IuZGF0YSwgJ2NwdSddO1xuICAgIGNhc2UgJ2dwdS1idWZmZXInOlxuICAgICAgcmV0dXJuIFt0ZW5zb3IudHlwZSwgdGVuc29yLmRpbXMsIHtncHVCdWZmZXI6IHRlbnNvci5ncHVCdWZmZXJ9LCAnZ3B1LWJ1ZmZlciddO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgZGF0YSBsb2NhdGlvbjogJHt0ZW5zb3IubG9jYXRpb259IGZvciAke2dldE5hbWUoKX1gKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGRlY29kZVRlbnNvck1ldGFkYXRhID0gKHRlbnNvcjogVGVuc29yTWV0YWRhdGEpOiBUZW5zb3IgPT4ge1xuICBzd2l0Y2ggKHRlbnNvclszXSkge1xuICAgIGNhc2UgJ2NwdSc6XG4gICAgICByZXR1cm4gbmV3IFRlbnNvcih0ZW5zb3JbMF0sIHRlbnNvclsyXSwgdGVuc29yWzFdKTtcbiAgICBjYXNlICdncHUtYnVmZmVyJzoge1xuICAgICAgY29uc3QgZGF0YVR5cGUgPSB0ZW5zb3JbMF07XG4gICAgICBpZiAoIWlzR3B1QnVmZmVyU3VwcG9ydGVkVHlwZShkYXRhVHlwZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBub3Qgc3VwcG9ydGVkIGRhdGEgdHlwZTogJHtkYXRhVHlwZX0gZm9yIGRlc2VyaWFsaXppbmcgR1BVIHRlbnNvcmApO1xuICAgICAgfVxuICAgICAgY29uc3Qge2dwdUJ1ZmZlciwgZG93bmxvYWQsIGRpc3Bvc2V9ID0gdGVuc29yWzJdO1xuICAgICAgcmV0dXJuIFRlbnNvci5mcm9tR3B1QnVmZmVyKGdwdUJ1ZmZlciwge2RhdGFUeXBlLCBkaW1zOiB0ZW5zb3JbMV0sIGRvd25sb2FkLCBkaXNwb3NlfSk7XG4gICAgfVxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgZGF0YSBsb2NhdGlvbjogJHt0ZW5zb3JbM119YCk7XG4gIH1cbn07XG5cbmV4cG9ydCBjbGFzcyBPbm54cnVudGltZVdlYkFzc2VtYmx5U2Vzc2lvbkhhbmRsZXIgaW1wbGVtZW50cyBJbmZlcmVuY2VTZXNzaW9uSGFuZGxlciB7XG4gIHByaXZhdGUgc2Vzc2lvbklkOiBudW1iZXI7XG5cbiAgaW5wdXROYW1lczogc3RyaW5nW107XG4gIG91dHB1dE5hbWVzOiBzdHJpbmdbXTtcblxuICBhc3luYyBmZXRjaE1vZGVsQW5kQ29weVRvV2FzbU1lbW9yeShwYXRoOiBzdHJpbmcpOiBQcm9taXNlPFNlcmlhbGl6YWJsZUludGVybmFsQnVmZmVyPiB7XG4gICAgLy8gZmV0Y2ggbW9kZWwgZnJvbSB1cmwgYW5kIG1vdmUgdG8gd2FzbSBoZWFwLlxuICAgIHJldHVybiBjb3B5RnJvbUV4dGVybmFsQnVmZmVyKGF3YWl0IGxvYWRGaWxlKHBhdGgpKTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRNb2RlbChwYXRoT3JCdWZmZXI6IHN0cmluZ3xVaW50OEFycmF5LCBvcHRpb25zPzogSW5mZXJlbmNlU2Vzc2lvbi5TZXNzaW9uT3B0aW9ucyk6IFByb21pc2U8dm9pZD4ge1xuICAgIFRSQUNFX0ZVTkNfQkVHSU4oKTtcbiAgICBsZXQgbW9kZWw6IFBhcmFtZXRlcnM8dHlwZW9mIGNyZWF0ZVNlc3Npb24+WzBdO1xuXG4gICAgaWYgKHR5cGVvZiBwYXRoT3JCdWZmZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MudmVyc2lvbnMgJiYgcHJvY2Vzcy52ZXJzaW9ucy5ub2RlKSB7XG4gICAgICAgIC8vIG5vZGVcbiAgICAgICAgbW9kZWwgPSBhd2FpdCBsb2FkRmlsZShwYXRoT3JCdWZmZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gYnJvd3NlclxuICAgICAgICAvLyBmZXRjaCBtb2RlbCBhbmQgY29weSB0byB3YXNtIGhlYXAuXG4gICAgICAgIG1vZGVsID0gYXdhaXQgdGhpcy5mZXRjaE1vZGVsQW5kQ29weVRvV2FzbU1lbW9yeShwYXRoT3JCdWZmZXIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtb2RlbCA9IHBhdGhPckJ1ZmZlcjtcbiAgICB9XG5cbiAgICBbdGhpcy5zZXNzaW9uSWQsIHRoaXMuaW5wdXROYW1lcywgdGhpcy5vdXRwdXROYW1lc10gPSBhd2FpdCBjcmVhdGVTZXNzaW9uKG1vZGVsLCBvcHRpb25zKTtcbiAgICBUUkFDRV9GVU5DX0VORCgpO1xuICB9XG5cbiAgYXN5bmMgZGlzcG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gcmVsZWFzZVNlc3Npb24odGhpcy5zZXNzaW9uSWQpO1xuICB9XG5cbiAgYXN5bmMgcnVuKGZlZWRzOiBTZXNzaW9uSGFuZGxlci5GZWVkc1R5cGUsIGZldGNoZXM6IFNlc3Npb25IYW5kbGVyLkZldGNoZXNUeXBlLCBvcHRpb25zOiBJbmZlcmVuY2VTZXNzaW9uLlJ1bk9wdGlvbnMpOlxuICAgICAgUHJvbWlzZTxTZXNzaW9uSGFuZGxlci5SZXR1cm5UeXBlPiB7XG4gICAgVFJBQ0VfRlVOQ19CRUdJTigpO1xuICAgIGNvbnN0IGlucHV0QXJyYXk6IFRlbnNvcltdID0gW107XG4gICAgY29uc3QgaW5wdXRJbmRpY2VzOiBudW1iZXJbXSA9IFtdO1xuICAgIE9iamVjdC5lbnRyaWVzKGZlZWRzKS5mb3JFYWNoKGt2cCA9PiB7XG4gICAgICBjb25zdCBuYW1lID0ga3ZwWzBdO1xuICAgICAgY29uc3QgdGVuc29yID0ga3ZwWzFdO1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmlucHV0TmFtZXMuaW5kZXhPZihuYW1lKTtcbiAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIGlucHV0ICcke25hbWV9J2ApO1xuICAgICAgfVxuICAgICAgaW5wdXRBcnJheS5wdXNoKHRlbnNvcik7XG4gICAgICBpbnB1dEluZGljZXMucHVzaChpbmRleCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBvdXRwdXRBcnJheTogQXJyYXk8VGVuc29yfG51bGw+ID0gW107XG4gICAgY29uc3Qgb3V0cHV0SW5kaWNlczogbnVtYmVyW10gPSBbXTtcbiAgICBPYmplY3QuZW50cmllcyhmZXRjaGVzKS5mb3JFYWNoKGt2cCA9PiB7XG4gICAgICBjb25zdCBuYW1lID0ga3ZwWzBdO1xuICAgICAgY29uc3QgdGVuc29yID0ga3ZwWzFdO1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLm91dHB1dE5hbWVzLmluZGV4T2YobmFtZSk7XG4gICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgaW52YWxpZCBvdXRwdXQgJyR7bmFtZX0nYCk7XG4gICAgICB9XG4gICAgICBvdXRwdXRBcnJheS5wdXNoKHRlbnNvcik7XG4gICAgICBvdXRwdXRJbmRpY2VzLnB1c2goaW5kZXgpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgaW5wdXRzID1cbiAgICAgICAgaW5wdXRBcnJheS5tYXAoKHQsIGkpID0+IGVuY29kZVRlbnNvck1ldGFkYXRhKHQsICgpID0+IGBpbnB1dCBcIiR7dGhpcy5pbnB1dE5hbWVzW2lucHV0SW5kaWNlc1tpXV19XCJgKSk7XG4gICAgY29uc3Qgb3V0cHV0cyA9IG91dHB1dEFycmF5Lm1hcChcbiAgICAgICAgKHQsIGkpID0+IHQgPyBlbmNvZGVUZW5zb3JNZXRhZGF0YSh0LCAoKSA9PiBgb3V0cHV0IFwiJHt0aGlzLm91dHB1dE5hbWVzW291dHB1dEluZGljZXNbaV1dfVwiYCkgOiBudWxsKTtcblxuICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBydW4odGhpcy5zZXNzaW9uSWQsIGlucHV0SW5kaWNlcywgaW5wdXRzLCBvdXRwdXRJbmRpY2VzLCBvdXRwdXRzLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IHJlc3VsdE1hcDogU2Vzc2lvbkhhbmRsZXIuUmV0dXJuVHlwZSA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0TWFwW3RoaXMub3V0cHV0TmFtZXNbb3V0cHV0SW5kaWNlc1tpXV1dID0gb3V0cHV0QXJyYXlbaV0gPz8gZGVjb2RlVGVuc29yTWV0YWRhdGEocmVzdWx0c1tpXSk7XG4gICAgfVxuICAgIFRSQUNFX0ZVTkNfRU5EKCk7XG4gICAgcmV0dXJuIHJlc3VsdE1hcDtcbiAgfVxuXG4gIHN0YXJ0UHJvZmlsaW5nKCk6IHZvaWQge1xuICAgIC8vIFRPRE86IGltcGxlbWVudCBwcm9maWxpbmdcbiAgfVxuXG4gIGVuZFByb2ZpbGluZygpOiB2b2lkIHtcbiAgICB2b2lkIGVuZFByb2ZpbGluZyh0aGlzLnNlc3Npb25JZCk7XG4gIH1cbn1cbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuaW1wb3J0IHtjcHVzfSBmcm9tICdub2RlOm9zJztcbmltcG9ydCB7QmFja2VuZCwgZW52LCBJbmZlcmVuY2VTZXNzaW9uLCBJbmZlcmVuY2VTZXNzaW9uSGFuZGxlcn0gZnJvbSAnb25ueHJ1bnRpbWUtY29tbW9uJztcblxuaW1wb3J0IHtpbml0aWFsaXplT3J0RXAsIGluaXRpYWxpemVXZWJBc3NlbWJseUFuZE9ydFJ1bnRpbWV9IGZyb20gJy4vd2FzbS9wcm94eS13cmFwcGVyJztcbmltcG9ydCB7T25ueHJ1bnRpbWVXZWJBc3NlbWJseVNlc3Npb25IYW5kbGVyfSBmcm9tICcuL3dhc20vc2Vzc2lvbi1oYW5kbGVyLWluZmVyZW5jZSc7XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpbml0aWFsaXplcyBhbGwgZmxhZ3MgZm9yIFdlYkFzc2VtYmx5LlxuICpcbiAqIFRob3NlIGZsYWdzIGFyZSBhY2Nlc3NpYmxlIGZyb20gYG9ydC5lbnYud2FzbWAuIFVzZXJzIGFyZSBhbGxvdyB0byBzZXQgdGhvc2UgZmxhZ3MgYmVmb3JlIHRoZSBmaXJzdCBpbmZlcmVuY2Ugc2Vzc2lvblxuICogYmVpbmcgY3JlYXRlZCwgdG8gb3ZlcnJpZGUgZGVmYXVsdCB2YWx1ZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGluaXRpYWxpemVGbGFncyA9ICgpOiB2b2lkID0+IHtcbiAgaWYgKHR5cGVvZiBlbnYud2FzbS5pbml0VGltZW91dCAhPT0gJ251bWJlcicgfHwgZW52Lndhc20uaW5pdFRpbWVvdXQgPCAwKSB7XG4gICAgZW52Lndhc20uaW5pdFRpbWVvdXQgPSAwO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBlbnYud2FzbS5zaW1kICE9PSAnYm9vbGVhbicpIHtcbiAgICBlbnYud2FzbS5zaW1kID0gdHJ1ZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZW52Lndhc20ucHJveHkgIT09ICdib29sZWFuJykge1xuICAgIGVudi53YXNtLnByb3h5ID0gZmFsc2U7XG4gIH1cblxuICBpZiAodHlwZW9mIGVudi53YXNtLnRyYWNlICE9PSAnYm9vbGVhbicpIHtcbiAgICBlbnYud2FzbS50cmFjZSA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBlbnYud2FzbS5udW1UaHJlYWRzICE9PSAnbnVtYmVyJyB8fCAhTnVtYmVyLmlzSW50ZWdlcihlbnYud2FzbS5udW1UaHJlYWRzKSB8fCBlbnYud2FzbS5udW1UaHJlYWRzIDw9IDApIHtcbiAgICAvLyBXZWI6IHdoZW4gY3Jvc3NPcmlnaW5Jc29sYXRlZCBpcyBmYWxzZSwgU2hhcmVkQXJyYXlCdWZmZXIgaXMgbm90IGF2YWlsYWJsZSBzbyBXZWJBc3NlbWJseSB0aHJlYWRzIHdpbGwgbm90IHdvcmsuXG4gICAgLy8gTm9kZS5qczogb25ueHJ1bnRpbWUtd2ViIGRvZXMgbm90IHN1cHBvcnQgbXVsdGktdGhyZWFkcyBpbiBOb2RlLmpzLlxuICAgIGlmICgodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnICYmICFzZWxmLmNyb3NzT3JpZ2luSXNvbGF0ZWQpIHx8XG4gICAgICAgICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGUpKSB7XG4gICAgICBlbnYud2FzbS5udW1UaHJlYWRzID0gMTtcbiAgICB9XG4gICAgY29uc3QgbnVtQ3B1TG9naWNhbENvcmVzID0gdHlwZW9mIG5hdmlnYXRvciA9PT0gJ3VuZGVmaW5lZCcgPyBjcHVzKCkubGVuZ3RoIDogbmF2aWdhdG9yLmhhcmR3YXJlQ29uY3VycmVuY3k7XG4gICAgZW52Lndhc20ubnVtVGhyZWFkcyA9IE1hdGgubWluKDQsIE1hdGguY2VpbCgobnVtQ3B1TG9naWNhbENvcmVzIHx8IDEpIC8gMikpO1xuICB9XG59O1xuXG5leHBvcnQgY2xhc3MgT25ueHJ1bnRpbWVXZWJBc3NlbWJseUJhY2tlbmQgaW1wbGVtZW50cyBCYWNrZW5kIHtcbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gaW5pdGlhbGl6ZXMgdGhlIFdlYkFzc2VtYmx5IGJhY2tlbmQuXG4gICAqXG4gICAqIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgb25seSBvbmNlIGZvciBlYWNoIGJhY2tlbmQgbmFtZS4gSXQgd2lsbCBiZSBjYWxsZWQgdGhlIGZpcnN0IHRpbWUgd2hlblxuICAgKiBgb3J0LkluZmVyZW5jZVNlc3Npb24uY3JlYXRlKClgIGlzIGNhbGxlZCB3aXRoIGEgcmVnaXN0ZXJlZCBiYWNrZW5kIG5hbWUuXG4gICAqXG4gICAqIEBwYXJhbSBiYWNrZW5kTmFtZSAtIHRoZSByZWdpc3RlcmVkIGJhY2tlbmQgbmFtZS5cbiAgICovXG4gIGFzeW5jIGluaXQoYmFja2VuZE5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIC8vIHBvcHVsYXRlIHdhc20gZmxhZ3NcbiAgICBpbml0aWFsaXplRmxhZ3MoKTtcblxuICAgIC8vIGluaXQgd2FzbVxuICAgIGF3YWl0IGluaXRpYWxpemVXZWJBc3NlbWJseUFuZE9ydFJ1bnRpbWUoKTtcblxuICAgIC8vIHBlcmZvcm1lIEVQIHNwZWNpZmljIGluaXRpYWxpemF0aW9uXG4gICAgYXdhaXQgaW5pdGlhbGl6ZU9ydEVwKGJhY2tlbmROYW1lKTtcbiAgfVxuICBjcmVhdGVJbmZlcmVuY2VTZXNzaW9uSGFuZGxlcihwYXRoOiBzdHJpbmcsIG9wdGlvbnM/OiBJbmZlcmVuY2VTZXNzaW9uLlNlc3Npb25PcHRpb25zKTpcbiAgICAgIFByb21pc2U8SW5mZXJlbmNlU2Vzc2lvbkhhbmRsZXI+O1xuICBjcmVhdGVJbmZlcmVuY2VTZXNzaW9uSGFuZGxlcihidWZmZXI6IFVpbnQ4QXJyYXksIG9wdGlvbnM/OiBJbmZlcmVuY2VTZXNzaW9uLlNlc3Npb25PcHRpb25zKTpcbiAgICAgIFByb21pc2U8SW5mZXJlbmNlU2Vzc2lvbkhhbmRsZXI+O1xuICBhc3luYyBjcmVhdGVJbmZlcmVuY2VTZXNzaW9uSGFuZGxlcihwYXRoT3JCdWZmZXI6IHN0cmluZ3xVaW50OEFycmF5LCBvcHRpb25zPzogSW5mZXJlbmNlU2Vzc2lvbi5TZXNzaW9uT3B0aW9ucyk6XG4gICAgICBQcm9taXNlPEluZmVyZW5jZVNlc3Npb25IYW5kbGVyPiB7XG4gICAgY29uc3QgaGFuZGxlciA9IG5ldyBPbm54cnVudGltZVdlYkFzc2VtYmx5U2Vzc2lvbkhhbmRsZXIoKTtcbiAgICBhd2FpdCBoYW5kbGVyLmxvYWRNb2RlbChwYXRoT3JCdWZmZXIsIG9wdGlvbnMpO1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoaGFuZGxlcik7XG4gIH1cbn1cbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuaW1wb3J0IHtPbm54cnVudGltZVdlYkFzc2VtYmx5QmFja2VuZH0gZnJvbSAnLi9iYWNrZW5kLXdhc20nO1xuZXhwb3J0IGNvbnN0IHdhc21CYWNrZW5kID0gbmV3IE9ubnhydW50aW1lV2ViQXNzZW1ibHlCYWNrZW5kKCk7XG4iLCAiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby12YXItcmVxdWlyZXMsIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHMgKi9cbi8vIFdlIHVzZSBcInJlcXVpcmVcIiBpbnN0ZWFkIG9mIFwiaW1wb3J0XCIgaGVyZSBiZWNhdXNlIGltcG9ydCBzdGF0ZW1lbnQgbXVzdCBiZSBwdXQgaW4gdG9wIGxldmVsLiBPdXIgY3VycmVudCBjb2RlIGRvZXNcbi8vIG5vdCBhbGxvdyBidW5kbGVyIHRvIHRyZWUtc2hha2luZyBjb2RlIGFzIGV4cGVjdGVkIGJlY2F1c2Ugc29tZSBjb2RlcyBhcmUgdHJlYXRlZCBhcyBoYXZpbmcgc2lkZSBlZmZlY3RzLlxuLy8gU28gd2UgaW1wb3J0IGNvZGUgaW5zaWRlIHRoZSBpZi1jbGF1c2UgdG8gYWxsb3cgYnVuZGxlciByZW1vdmUgdGhlIGNvZGUgc2FmZWx5LlxuXG5leHBvcnQgKiBmcm9tICdvbm54cnVudGltZS1jb21tb24nO1xuaW1wb3J0ICogYXMgb3J0IGZyb20gJ29ubnhydW50aW1lLWNvbW1vbic7XG5leHBvcnQgZGVmYXVsdCBvcnQ7XG5cbmltcG9ydCB7cmVnaXN0ZXJCYWNrZW5kLCBlbnZ9IGZyb20gJ29ubnhydW50aW1lLWNvbW1vbic7XG5pbXBvcnQge3ZlcnNpb259IGZyb20gJy4vdmVyc2lvbic7XG5cbmlmICghQlVJTERfREVGUy5ESVNBQkxFX1dFQkdMKSB7XG4gIGNvbnN0IG9ubnhqc0JhY2tlbmQgPSByZXF1aXJlKCcuL2JhY2tlbmQtb25ueGpzJykub25ueGpzQmFja2VuZDtcbiAgcmVnaXN0ZXJCYWNrZW5kKCd3ZWJnbCcsIG9ubnhqc0JhY2tlbmQsIC0xMCk7XG59XG5cbmlmICghQlVJTERfREVGUy5ESVNBQkxFX1dBU00pIHtcbiAgY29uc3Qgd2FzbUJhY2tlbmQgPSBCVUlMRF9ERUZTLkRJU0FCTEVfVFJBSU5JTkcgPyByZXF1aXJlKCcuL2JhY2tlbmQtd2FzbS1pbmZlcmVuY2UnKS53YXNtQmFja2VuZCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZSgnLi9iYWNrZW5kLXdhc20tdHJhaW5pbmcnKS53YXNtQmFja2VuZDtcbiAgaWYgKCFCVUlMRF9ERUZTLkRJU0FCTEVfV0VCR1BVKSB7XG4gICAgcmVnaXN0ZXJCYWNrZW5kKCd3ZWJncHUnLCB3YXNtQmFja2VuZCwgNSk7XG4gICAgcmVnaXN0ZXJCYWNrZW5kKCd3ZWJubicsIHdhc21CYWNrZW5kLCA1KTtcbiAgfVxuICByZWdpc3RlckJhY2tlbmQoJ2NwdScsIHdhc21CYWNrZW5kLCAxMCk7XG4gIHJlZ2lzdGVyQmFja2VuZCgnd2FzbScsIHdhc21CYWNrZW5kLCAxMCk7XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbnYudmVyc2lvbnMsICd3ZWInLCB7dmFsdWU6IHZlcnNpb24sIGVudW1lcmFibGU6IHRydWV9KTtcbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuLy8gVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBieSAvanMvc2NyaXB0cy91cGRhdGUtdmVyc2lvbi50c1xuLy8gRG8gbm90IG1vZGlmeSBmaWxlIGNvbnRlbnQgbWFudWFsbHkuXG5cbmV4cG9ydCBjb25zdCB2ZXJzaW9uID0gJzEuMTguMCc7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE1BZ0JNLFVBQ0EsMEJBWU8saUJBd0NQLGdDQXdDTztBQTdHYjs7O0FBZ0JBLE1BQU0sV0FBcUMsb0JBQUksSUFBRztBQUNsRCxNQUFNLDJCQUFxQyxDQUFBO0FBWXBDLE1BQU0sa0JBQWtCLENBQUMsTUFBYyxTQUFrQixhQUEwQjtBQUN4RixZQUFJLFdBQVcsT0FBTyxRQUFRLFNBQVMsY0FBYyxPQUFPLFFBQVEsa0NBQWtDLFlBQVk7QUFDaEgsZ0JBQU0saUJBQWlCLFNBQVMsSUFBSSxJ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LEdBQUUsQ0FBQztBQUFBLGNBQUUsTUFBSyxPQUFHLEdBQUcsRUFBRSxFQUFFO0FBQUEsY0FBRSxNQUFLLE9BQUcsR0FBRyxFQUFFLEtBQUcsUUFBTSxNQUFJLEdBQUUsQ0FBQztBQUFBLGNBQUUsTUFBSyxPQUFHLEVBQUUsRUFBRSxJQUFHLENBQUM7QUFBQSxjQUFFLE1BQUssT0FBRyxFQUFFLEVBQUUsSUFBRyxHQUFFLEdBQUc7QUFBQSxjQUFFLE1BQUssT0FBRyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDO0FBQUEsY0FBRSxNQUFLLE9BQUcsRUFBRSxDQUFDO0FBQUEsY0FBRSxNQUFLLE9BQUcsRUFBRSxFQUFFLElBQUcsQ0FBQztBQUFBLGNBQUUsTUFBSyxPQUFHO0FBQUMsb0JBQUUsRUFBRTtBQUFHLHFCQUFHLElBQUUsSUFBRSxLQUFHLEtBQUcsTUFBSSxLQUFHO0FBQUksdUJBQU8sRUFBRSxHQUFFLENBQUM7QUFBQSxjQUFDO0FBQUEsY0FBRSxNQUFLLE9BQUc7QUFBQyx5QkFBUSxJQUFFLEdBQUUsSUFBRSxHQUFFLEtBQUcsRUFBRSxLQUFHLEdBQUUsTUFBSSxFQUFFLEVBQUUsS0FBRyxJQUFJLElBQUUsS0FBRyxJQUFJLEdBQUc7QUFBRTtBQUFDLHVCQUFPLEVBQUUsRUFBRSxLQUFHLEdBQUUsQ0FBQztBQUFBLGNBQUM7QUFBQSxjQUFFLE1BQUssT0FBRyxFQUFFLEVBQUUsS0FBRyxHQUFFLENBQUM7QUFBQSxjQUFFLE1BQUssT0FBRyxFQUFFLEVBQUUsSUFBRyxDQUFDO0FBQUEsY0FBRSxNQUFLLE1BQUk7QUFBQSxjQUFLLE1BQUssT0FBRyxLQUFHLEVBQUUsTUFBSSxLQUFHLEVBQUUsS0FBRyxPQUFLO0FBQUEsY0FBSyxNQUFLLE9BQUcsRUFBRSxFQUFFLElBQUcsQ0FBQztBQUFBLGNBQUUsTUFBSyxNQUFJO0FBQUEsY0FBSyxNQUFLLE9BQUcsRUFBRSxNQUFJO0FBQUEsY0FBRSxNQUFLLE9BQUc7QUFBQSxnQkFBRSxLQUFLLE9BQU8sRUFBRSxLQUFHLElBQUUsRUFBRSxNQUFJLENBQUM7QUFBQSxnQkFDbmY7QUFBQSxjQUFDO0FBQUEsY0FBRSxNQUFLLE9BQUc7QUFBQyxvQkFBSSxJQUFFLEtBQUssT0FBTyxFQUFFLEtBQUcsS0FBRyxFQUFFLEtBQUcsS0FBRyxLQUFHLENBQUM7QUFBRSxzQkFBSSxFQUFFLEtBQUcsTUFBSSxFQUFFLEtBQUcsS0FBRyxLQUFHO0FBQUksb0JBQUc7QUFBRSx3QkFBSSxNQUFJLEtBQUcsRUFBRSxLQUFHLE1BQUksRUFBRSxNQUFJLEdBQUUsS0FBRyxLQUFHLEtBQUcsS0FBRyxFQUFFLEVBQUUsRUFBRSxNQUFJLElBQUU7QUFBQSxxQkFBUTtBQUFDLHNCQUFFO0FBQUcsc0JBQUksS0FBRyxFQUFFLEtBQUcsSUFBRSxFQUFFLEtBQUcsS0FBRztBQUFFLG1CQUFDLEtBQUcsS0FBRyxLQUFHLEtBQUcsRUFBRSxFQUFFLEtBQUcsTUFBSSxDQUFDLE1BQUk7QUFBQSxnQkFBRztBQUFDLHVCQUFPLEVBQUUsR0FBRSxDQUFDO0FBQUEsY0FBQztBQUFBLGNBQUUsTUFBSyxPQUFHLEVBQUU7QUFBQSxjQUFHLE1BQUssT0FBRyxFQUFFLEtBQUssT0FBTyxFQUFFLEtBQUcsS0FBRyxFQUFFLEtBQUcsS0FBRyxLQUFHLENBQUMsR0FBRSxDQUFDO0FBQUEsY0FBRSxNQUFLLFFBQUksRUFBRSxLQUFHLE1BQU0sU0FBUyxFQUFFLFVBQVUsQ0FBQztBQUFBLGNBQUUsTUFBSyxPQUFHLEVBQUUsS0FBRztBQUFBLGNBQUssTUFBSyxPQUFHO0FBQUMsb0JBQUUsRUFBRTtBQUFHLG9CQUFJLElBQUUsS0FBRztBQUFFLG9CQUFFLEtBQUssSUFBSSxDQUFDLElBQUU7QUFBRyx3QkFBTyxJQUFFLE1BQUksT0FBSyxPQUFPLFVBQVEsSUFBRSxLQUFHLE1BQUksSUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFO0FBQUEsY0FBQztBQUFBLGNBQUUsTUFBSyxPQUFHLEVBQUU7QUFBQSxjQUFHLE1BQUssTUFBSTtBQUFBLFlBQUc7QUFBRSxnQkFBRSxFQUFFLFFBQVEsT0FBTSxNQUFVO0FBQ3hmLGlCQUFJLEtBQUs7QUFBRSxnQkFBRSxTQUFTLENBQUMsTUFBSSxJQUFFLEVBQUUsUUFBUSxJQUFJLE9BQU8sR0FBRSxHQUFHLEdBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQUcsZ0JBQUUsRUFBRSxRQUFRLFNBQVEsR0FBRztBQUFFLGdCQUFFLEdBQUcsQ0FBQztBQUFFLGdCQUFHLEVBQUUsU0FBTztBQUFFLHFCQUFPO0FBQUUsY0FBRSxJQUFJLEdBQUUsTUFBSSxDQUFDO0FBQUUsbUJBQU8sRUFBRSxTQUFPO0FBQUEsVUFBQztBQUMzSixjQUFJLEtBQUcsRUFBQyxHQUFFLFNBQVMsR0FBRSxHQUFFLEdBQUU7QUFBQyxtQkFBSztBQUFFLFlBQUMsSUFBSSxHQUFHLENBQUMsRUFBRyxHQUFHLE1BQUksR0FBRSxNQUFJLENBQUM7QUFBRSxpQkFBRztBQUFFO0FBQUssa0JBQU07QUFBQSxVQUFHLEdBQUUsR0FBRSxXQUFVO0FBQUMsbUJBQU87QUFBQSxVQUFDLEdBQUUsR0FBRSxXQUFVO0FBQUEsVUFBQyxHQUFFLEdBQUUsV0FBVTtBQUFBLFVBQUMsR0FBRSxHQUFFLFdBQVU7QUFBQSxVQUFDLEdBQUUsR0FBRSxXQUFVO0FBQUMsbUJBQU87QUFBQSxVQUFDLEdBQUUsR0FBRSxXQUFVO0FBQUEsVUFBQyxHQUFFLEdBQUUsV0FBVTtBQUFBLFVBQUMsR0FBRSxHQUFFLFdBQVU7QUFBQSxVQUFDLEdBQUUsR0FBRSxXQUFVO0FBQUEsVUFBQyxHQUFFLEdBQUUsV0FBVTtBQUFBLFVBQUMsR0FBRSxHQUFFLFdBQVU7QUFBQSxVQUFDLEdBQUUsR0FBRSxXQUFVO0FBQUEsVUFBQyxHQUFFLEdBQUUsV0FBVTtBQUFBLFVBQUMsR0FBRSxHQUFFLE1BQUksR0FBRSxHQUFFLFNBQVMsR0FBRSxHQUFFLEdBQUU7QUFBQyxnQkFBRSxJQUFFLFlBQVUsSUFBRSxVQUFRLENBQUMsQ0FBQyxLQUFHLE1BQUksS0FBRyxhQUFXLElBQUU7QUFBSSxtQkFBSztBQUFFLGdCQUFFLElBQUksS0FBSyxNQUFJLENBQUM7QUFBRSxjQUFFLE1BQUksTUFBSSxDQUFDLElBQUUsRUFBRSxjQUFjO0FBQUUsY0FBRSxJQUFFLE1BQUksTUFBSSxDQUFDLElBQUUsRUFBRSxjQUFjO0FBQUUsY0FBRSxJQUFFLE1BQUksTUFBSSxDQUFDLElBQUUsRUFBRSxZQUFZO0FBQUUsY0FBRSxJQUFFLE9BQ2hmLE1BQUksQ0FBQyxJQUFFLEVBQUUsV0FBVztBQUFFLGNBQUUsSUFBRSxPQUFLLE1BQUksQ0FBQyxJQUFFLEVBQUUsWUFBWTtBQUFFLGNBQUUsSUFBRSxPQUFLLE1BQUksQ0FBQyxJQUFFLEVBQUUsZUFBZSxJQUFFO0FBQUssY0FBRSxJQUFFLE9BQUssTUFBSSxDQUFDLElBQUUsRUFBRSxVQUFVO0FBQUUsY0FBRSxJQUFFLE9BQUssTUFBSSxDQUFDLEtBQUcsRUFBRSxRQUFRLElBQUUsS0FBSyxJQUFJLEVBQUUsZUFBZSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxDQUFDLEtBQUcsUUFBTTtBQUFBLFVBQUMsR0FBRSxHQUFFLFNBQVMsR0FBRSxHQUFFLEdBQUU7QUFBQyxnQkFBRSxJQUFFLFlBQVUsSUFBRSxVQUFRLENBQUMsQ0FBQyxLQUFHLE1BQUksS0FBRyxhQUFXLElBQUU7QUFBSSxtQkFBSztBQUFFLGdCQUFFLElBQUksS0FBSyxNQUFJLENBQUM7QUFBRSxjQUFFLE1BQUksTUFBSSxDQUFDLElBQUUsRUFBRSxXQUFXO0FBQUUsY0FBRSxJQUFFLE1BQUksTUFBSSxDQUFDLElBQUUsRUFBRSxXQUFXO0FBQUUsY0FBRSxJQUFFLE1BQUksTUFBSSxDQUFDLElBQUUsRUFBRSxTQUFTO0FBQUUsY0FBRSxJQUFFLE9BQUssTUFBSSxDQUFDLElBQUUsRUFBRSxRQUFRO0FBQUUsY0FBRSxJQUFFLE9BQUssTUFBSSxDQUFDLElBQUUsRUFBRSxTQUFTO0FBQUUsY0FBRSxJQUFFLE9BQUssTUFBSSxDQUFDLElBQUUsRUFBRSxZQUFZLElBQUU7QUFBSyxjQUFFLElBQUUsT0FBSyxNQUFJLENBQUMsSUFBRSxFQUFFLE9BQU87QUFDemYsY0FBRSxJQUFFLE9BQUssTUFBSSxDQUFDLEtBQUcsRUFBRSxFQUFFLFlBQVksQ0FBQyxJQUFFLEtBQUcsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFFLEVBQUUsUUFBUSxJQUFFLElBQUU7QUFBRSxjQUFFLElBQUUsT0FBSyxNQUFJLENBQUMsSUFBRSxFQUFFLEtBQUcsRUFBRSxrQkFBa0I7QUFBRyxnQkFBRyxJQUFJLEtBQUssRUFBRSxZQUFZLEdBQUUsR0FBRSxDQUFDLEVBQUcsa0JBQWtCO0FBQUUsZ0JBQUksSUFBRyxJQUFJLEtBQUssRUFBRSxZQUFZLEdBQUUsR0FBRSxDQUFDLEVBQUcsa0JBQWtCO0FBQUUsY0FBRSxJQUFFLE9BQUssTUFBSSxDQUFDLEtBQUcsS0FBRyxLQUFHLEVBQUUsa0JBQWtCLEtBQUcsS0FBSyxJQUFJLEdBQUUsQ0FBQyxLQUFHO0FBQUEsVUFBQyxHQUFFLEdBQUUsU0FBUyxHQUFFO0FBQUMsbUJBQUs7QUFBRSxnQkFBSSxJQUFFLElBQUksS0FBSyxFQUFFLElBQUUsT0FBSyxNQUFJLENBQUMsSUFBRSxNQUFLLEVBQUUsSUFBRSxPQUFLLE1BQUksQ0FBQyxHQUFFLEVBQUUsSUFBRSxPQUFLLE1BQUksQ0FBQyxHQUFFLEVBQUUsSUFBRSxNQUFJLE1BQUksQ0FBQyxHQUFFLEVBQUUsSUFBRSxNQUFJLE1BQUksQ0FBQyxHQUFFLEVBQUUsTUFBSSxNQUFJLENBQUMsR0FBRSxDQUFDLEdBQUUsSUFBRSxFQUFFLElBQUUsT0FBSyxNQUFJLENBQUMsR0FBRSxJQUFFLEVBQUUsa0JBQWtCLEdBQUUsSUFBRyxJQUFJLEtBQUssRUFBRSxZQUFZLEdBQUUsR0FBRSxDQUFDLEVBQUcsa0JBQWtCLEdBQzFnQixJQUFHLElBQUksS0FBSyxFQUFFLFlBQVksR0FBRSxHQUFFLENBQUMsRUFBRyxrQkFBa0IsR0FBRSxJQUFFLEtBQUssSUFBSSxHQUFFLENBQUM7QUFBRSxnQkFBRSxJQUFFLEVBQUUsSUFBRSxPQUFLLE1BQUksQ0FBQyxJQUFFLE9BQU8sS0FBRyxLQUFHLEtBQUcsQ0FBQyxJQUFFLElBQUUsTUFBSSxLQUFHLE9BQUssSUFBRSxLQUFLLElBQUksR0FBRSxDQUFDLEdBQUUsRUFBRSxRQUFRLEVBQUUsUUFBUSxJQUFFLFFBQU0sSUFBRSxJQUFFLElBQUUsS0FBRyxFQUFFO0FBQUcsY0FBRSxJQUFFLE9BQUssTUFBSSxDQUFDLElBQUUsRUFBRSxPQUFPO0FBQUUsY0FBRSxJQUFFLE9BQUssTUFBSSxDQUFDLEtBQUcsRUFBRSxFQUFFLFlBQVksQ0FBQyxJQUFFLEtBQUcsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFFLEVBQUUsUUFBUSxJQUFFLElBQUU7QUFBRSxjQUFFLE1BQUksTUFBSSxDQUFDLElBQUUsRUFBRSxXQUFXO0FBQUUsY0FBRSxJQUFFLE1BQUksTUFBSSxDQUFDLElBQUUsRUFBRSxXQUFXO0FBQUUsY0FBRSxJQUFFLE1BQUksTUFBSSxDQUFDLElBQUUsRUFBRSxTQUFTO0FBQUUsY0FBRSxJQUFFLE9BQUssTUFBSSxDQUFDLElBQUUsRUFBRSxRQUFRO0FBQUUsY0FBRSxJQUFFLE9BQUssTUFBSSxDQUFDLElBQUUsRUFBRSxTQUFTO0FBQUUsY0FBRSxJQUFFLE9BQUssTUFBSSxDQUFDLElBQUUsRUFBRSxRQUFRO0FBQUUsZ0JBQUUsRUFBRSxRQUFRO0FBQUUsa0JBQU0sQ0FBQyxLQUFHLEVBQUUsR0FBRyxNQUFJLE1BQUksQ0FBQyxJQUFFLElBQUcsSUFBRSxNQUNqZixLQUFHO0FBQUksbUJBQU8sSUFBSSxJQUFFLEdBQUUsS0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUUsSUFBRSxJQUFFLENBQUMsS0FBSyxNQUFNLElBQUUsVUFBVSxNQUFJLElBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLElBQUUsRUFBRSxDQUFDLENBQUMsTUFBSSxNQUFJLFVBQVUsTUFBSSxJQUFFLEVBQUUsR0FBRSxNQUFJO0FBQUEsVUFBQyxHQUFFLEdBQUUsV0FBVTtBQUFDLG1CQUFNO0FBQUEsVUFBRyxHQUFFLEdBQUUsV0FBVTtBQUFBLFVBQUMsR0FBRSxHQUFFLFNBQVMsR0FBRSxHQUFFLEdBQUU7QUFBQyxxQkFBUyxFQUFFLEdBQUU7QUFBQyxzQkFBTyxJQUFFLEVBQUUsYUFBYSxFQUFFLE1BQU0sbUJBQW1CLEtBQUcsRUFBRSxDQUFDLElBQUU7QUFBQSxZQUFLO0FBQUMsbUJBQUs7QUFBRSxnQkFBSSxLQUFHLG9CQUFJLFFBQU0sWUFBWSxHQUFFLElBQUUsSUFBSSxLQUFLLEdBQUUsR0FBRSxDQUFDLEdBQUUsSUFBRSxJQUFJLEtBQUssR0FBRSxHQUFFLENBQUM7QUFBRSxnQkFBRSxFQUFFLGtCQUFrQjtBQUFFLGdCQUFJLElBQUUsRUFBRSxrQkFBa0I7QUFBRSxjQUFFLE1BQUksTUFBSSxNQUFJLENBQUMsSUFBRSxLQUFHLEtBQUssSUFBSSxHQUFFLENBQUM7QUFBRSxjQUFFLE1BQUksTUFBSSxNQUFJLENBQUMsSUFBRSxPQUFPLEtBQUcsQ0FBQztBQUFFLGdCQUFFLEVBQUUsQ0FBQztBQUFFLGdCQUFFLEVBQUUsQ0FBQztBQUFFLGdCQUFFLEdBQUcsQ0FBQztBQUFFLGdCQUFFLEdBQUcsQ0FBQztBQUFFLGdCQUFFLEtBQUcsRUFBRSxNQUFJLE1BQUksQ0FBQyxJQUNuZixHQUFFLEVBQUUsSUFBRSxNQUFJLE1BQUksQ0FBQyxJQUFFLE1BQUksRUFBRSxNQUFJLE1BQUksQ0FBQyxJQUFFLEdBQUUsRUFBRSxJQUFFLE1BQUksTUFBSSxDQUFDLElBQUU7QUFBQSxVQUFFLEdBQUUsR0FBRSxNQUFJO0FBQUMsY0FBRSxFQUFFO0FBQUEsVUFBQyxHQUFFLEdBQUUsU0FBUyxHQUFFLEdBQUUsR0FBRTtBQUFDLG1CQUFLO0FBQUUsbUJBQUs7QUFBRSxtQkFBSztBQUFFLGNBQUUsU0FBTztBQUFFLHFCQUFRLEdBQUUsSUFBRSxFQUFFLFFBQU0sQ0FBQyxLQUFHO0FBQUMsa0JBQUksSUFBRSxPQUFLO0FBQUUsbUJBQUcsT0FBSztBQUFFLG1CQUFHLEtBQUcsSUFBRSxJQUFFLElBQUU7QUFBRSxnQkFBRSxLQUFLLE9BQUssSUFBRSxFQUFFLE1BQUksTUFBSSxDQUFDLElBQUUsT0FBSyxJQUFFLEVBQUUsTUFBSSxNQUFJLENBQUMsSUFBRSxHQUFHLE1BQUksTUFBSSxDQUFDLENBQUM7QUFBRSxtQkFBRyxJQUFFLElBQUU7QUFBQSxZQUFDO0FBQUMsbUJBQU8sR0FBRyxDQUFDLEVBQUUsTUFBTSxNQUFLLENBQUM7QUFBQSxVQUFDLEdBQUUsR0FBRSxNQUFJLEtBQUssSUFBSSxHQUFFLEdBQUUsV0FBVTtBQUFDLG1CQUFPO0FBQUEsVUFBVSxHQUFFLEdBQUUsTUFBSSxZQUFZLElBQUksR0FBRSxHQUFFLFNBQVMsR0FBRSxHQUFFLEdBQUU7QUFBQyxtQkFBSztBQUFFLG1CQUFPLEVBQUUsV0FBVyxNQUFJLE1BQUksR0FBRSxNQUFJLEdBQUUsS0FBRyxNQUFJLE9BQUssQ0FBQztBQUFBLFVBQUMsR0FBRSxHQUFFLFNBQVMsR0FBRTtBQUFDLG1CQUFLO0FBQUUsZ0JBQUksSUFBRSxFQUFFO0FBQU8sZ0JBQUcsYUFBVztBQUFFLHFCQUFNO0FBQUcscUJBQVEsSUFDbmYsR0FBRSxLQUFHLEdBQUUsS0FBRyxHQUFFO0FBQUMsa0JBQUksSUFBRSxLQUFHLElBQUUsTUFBRztBQUFHLGtCQUFFLEtBQUssSUFBSSxHQUFFLElBQUUsU0FBUztBQUFFLGtCQUFJLElBQUU7QUFBSyxrQkFBRSxLQUFLLElBQUksR0FBRSxDQUFDO0FBQUUsaUJBQUU7QUFBQyxxQkFBRyxFQUFFLElBQUksS0FBSyxHQUFFLFlBQVcsS0FBRyxRQUFNLElBQUUsU0FBTyxLQUFLLElBQUUsRUFBRSxPQUFPLGFBQVcsU0FBTztBQUFNLG9CQUFHO0FBQUMsb0JBQUUsS0FBSyxDQUFDO0FBQUUscUJBQUc7QUFBRSxzQkFBSSxJQUFFO0FBQUUsd0JBQU07QUFBQSxnQkFBQyxTQUFPLEdBQUU7QUFBQSxnQkFBQztBQUFDLG9CQUFFO0FBQUEsY0FBTTtBQUFDLGtCQUFHO0FBQUUsdUJBQU07QUFBQSxZQUFFO0FBQUMsbUJBQU07QUFBQSxVQUFFLEdBQUUsR0FBRSxTQUFTLEdBQUUsR0FBRTtBQUFDLG1CQUFLO0FBQUUsbUJBQUs7QUFBRSxnQkFBSSxJQUFFO0FBQUUsZUFBRyxFQUFFLFFBQVEsQ0FBQyxHQUFFLE1BQUk7QUFBQyxrQkFBSSxJQUFFLElBQUU7QUFBRSxrQkFBRSxFQUFFLElBQUUsSUFBRSxNQUFJLE1BQUksQ0FBQyxJQUFFO0FBQUUsbUJBQUksSUFBRSxHQUFFLElBQUUsRUFBRSxRQUFPLEVBQUU7QUFBRSxrQkFBRSxRQUFNLE1BQUksQ0FBQyxJQUFFLEVBQUUsV0FBVyxDQUFDO0FBQUUsZ0JBQUUsTUFBSSxNQUFJLENBQUMsSUFBRTtBQUFFLG1CQUFHLEVBQUUsU0FBTztBQUFBLFlBQUMsQ0FBQztBQUFFLG1CQUFPO0FBQUEsVUFBQyxHQUFFLEdBQUUsU0FBUyxHQUFFLEdBQUU7QUFBQyxtQkFBSztBQUFFLG1CQUFLO0FBQUUsZ0JBQUksSUFBRSxHQUFHO0FBQUUsY0FBRSxNQUFJLE1BQUksQ0FBQyxJQUFFLEVBQUU7QUFBTyxnQkFBSSxJQUNyZjtBQUFFLGNBQUUsUUFBUSxPQUFHLEtBQUcsRUFBRSxTQUFPLENBQUM7QUFBRSxjQUFFLE1BQUksTUFBSSxDQUFDLElBQUU7QUFBRSxtQkFBTztBQUFBLFVBQUMsR0FBRSxHQUFFLE1BQUksSUFBRyxHQUFFLFdBQVU7QUFBQyxtQkFBTztBQUFBLFVBQUUsR0FBRSxHQUFFLFdBQVU7QUFBQyxtQkFBTztBQUFBLFVBQUUsR0FBRSxHQUFFLFNBQVMsR0FBRSxHQUFFLEdBQUUsR0FBRTtBQUFDLG1CQUFLO0FBQUUsbUJBQUs7QUFBRSxtQkFBSztBQUFFLHFCQUFRLElBQUUsR0FBRSxJQUFFLEdBQUUsSUFBRSxHQUFFLEtBQUk7QUFBQyxrQkFBSSxJQUFFLEVBQUUsTUFBSSxNQUFJLENBQUMsR0FBRSxJQUFFLEVBQUUsSUFBRSxNQUFJLE1BQUksQ0FBQztBQUFFLG1CQUFHO0FBQUUsdUJBQVEsSUFBRSxHQUFFLElBQUUsR0FBRSxLQUFJO0FBQUMsb0JBQUksSUFBRSxFQUFFLElBQUUsTUFBSSxDQUFDLEdBQUUsSUFBRSxHQUFHLENBQUM7QUFBRSxzQkFBSSxLQUFHLE9BQUssTUFBSSxN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LEVBQzdDO0FBRUEsTUFBSSxNQUEwQjtBQUM1QixVQUFNQyxlQUFjLE9BQThCLDhFQUFvQyxjQUNwQyxLQUFtQztBQUNyRixRQUFJLE9BQTRCO0FBQzlCLHNCQUFnQixVQUFVQSxjQUFhLENBQUM7QUFDeEMsc0JBQWdCLFNBQVNBLGNBQWEsQ0FBQztBQUFBLElBQ3pDO0FBQ0Esb0JBQWdCLE9BQU9BLGNBQWEsRUFBRTtBQUN0QyxvQkFBZ0IsUUFBUUEsY0FBYSxFQUFFO0FBQUEsRUFDekM7QUFFQSxTQUFPLGVBQWVDLEtBQUksVUFBVSxPQUFPLEVBQUMsT0FBT0MsVUFBUyxZQUFZLEtBQUksQ0FBQzsiLAogICJuYW1lcyI6IFsiaSIsICJlbnYiLCAiVGVuc29yIiwgIlRlbnNvciIsICJJbmZlcmVuY2VTZXNzaW9uIiwgIlRlbnNvciIsICJUcmFpbmluZ1Nlc3Npb24iLCAiSW5mZXJlbmNlU2Vzc2lvbiIsICJUZW5zb3IiLCAiVHJhaW5pbmdTZXNzaW9uIiwgImVudiIsICJ3YXNtIiwgIndhc20iLCAid2FzbSIsICJyZWFkRmlsZSIsICJyZWFkRmlsZSIsICJlbnYiLCAid2FzbSIsICJ0ZW5zb3IiLCAiZXJyb3JDb2RlIiwgImkiLCAiaW5pdGlhbGl6aW5nIiwgImluaXRpYWxpemVkIiwgImFib3J0ZWQiLCAiY29weUZyb21FeHRlcm5hbEJ1ZmZlciIsICJjcmVhdGVTZXNzaW9uIiwgInJlbGVhc2VTZXNzaW9uIiwgInJ1biIsICJlbmRQcm9maWxpbmciLCAiZW52IiwgIlRlbnNvciIsICJjb3B5RnJvbUV4dGVybmFsQnVmZmVyIiwgImNyZWF0ZVNlc3Npb24iLCAicmVsZWFzZVNlc3Npb24iLCAicnVuIiwgImVuZFByb2ZpbGluZyIsICJlbnYiLCAiSW5mZXJlbmNlU2Vzc2lvbiIsICJUZW5zb3IiLCAiVHJhaW5pbmdTZXNzaW9uIiwgImVudiIsICJ2ZXJzaW9uIiwgIndhc21CYWNrZW5kIiwgImVudiIsICJ2ZXJzaW9uIl0KfQo=
