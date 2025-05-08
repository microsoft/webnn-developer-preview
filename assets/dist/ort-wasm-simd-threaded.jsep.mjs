var ortWasmThreaded = (() => {
  var _scriptName = import.meta.url;
  
  return (
async function(moduleArg = {}) {
  var moduleRtn;

// include: shell.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(moduleArg) => Promise<Module>
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = moduleArg;

// Set up the promise that indicates the Module is initialized
var readyPromiseResolve, readyPromiseReject;

var readyPromise = new Promise((resolve, reject) => {
  readyPromiseResolve = resolve;
  readyPromiseReject = reject;
});

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).
// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = typeof window == "object";

var ENVIRONMENT_IS_WORKER = typeof WorkerGlobalScope != "undefined";

// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string" && process.type != "renderer";

// Three configurations we can be running in:
// 1) We could be the application main() thread running in the main JS UI thread. (ENVIRONMENT_IS_WORKER == false and ENVIRONMENT_IS_PTHREAD == false)
// 2) We could be the application main() thread proxied to worker. (with Emscripten -sPROXY_TO_WORKER) (ENVIRONMENT_IS_WORKER == true, ENVIRONMENT_IS_PTHREAD == false)
// 3) We could be an application pthread running in a worker. (ENVIRONMENT_IS_WORKER == true and ENVIRONMENT_IS_PTHREAD == true)
// The way we signal to a worker that it is hosting a pthread is to construct
// it with a specific name.
var ENVIRONMENT_IS_PTHREAD = ENVIRONMENT_IS_WORKER && self.name?.startsWith("em-pthread");

if (ENVIRONMENT_IS_NODE) {
  // When building an ES module `require` is not normally available.
  // We need to use `createRequire()` to construct the require()` function.
  const {createRequire} = await import("module");
  /** @suppress{duplicate} */ var require = createRequire(import.meta.url);
  var worker_threads = require("worker_threads");
  global.Worker = worker_threads.Worker;
  ENVIRONMENT_IS_WORKER = !worker_threads.isMainThread;
  // Under node we set `workerData` to `em-pthread` to signal that the worker
  // is hosting a pthread.
  ENVIRONMENT_IS_PTHREAD = ENVIRONMENT_IS_WORKER && worker_threads["workerData"] == "em-pthread";
}

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)
// include: /home/wm/work/webml/webnn/frameworks/onnxruntime/honry/onnxruntime/onnxruntime/wasm/pre.js
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// This file contains the pre-run code for the ORT WebAssembly module. The code in this file will be injected into the
// final module using Emscripten's `--pre-js` option.
/**
 * Mount external data files of a model to an internal map, which will be used during session initialization.
 *
 * @param {string} externalDataFilesPath
 * @param {Uint8Array} externalDataFilesData
 */ Module["mountExternalData"] = (externalDataFilePath, externalDataFileData) => {
  if (externalDataFilePath.startsWith("./")) {
    externalDataFilePath = externalDataFilePath.substring(2);
  }
  const files = Module.MountedFiles || (Module.MountedFiles = new Map);
  files.set(externalDataFilePath, externalDataFileData);
};

/**
 * Unmount external data files of a model.
 */ Module["unmountExternalData"] = () => {
  delete Module.MountedFiles;
};

/**
 * A workaround for SharedArrayBuffer when it is not available in the current context.
 *
 * We need this workaround because Emscripten generates code that assumes `SharedArrayBuffer` is always available and
 * uses SharedArrayBuffer in this way:
 * ```js
 * buffer instanceof SharedArrayBuffer
 * ```
 *
 * This code will throw an error when SharedArrayBuffer is not available. Fortunately, we can use `WebAssembly.Memory`
 * to create an instance of SharedArrayBuffer even when SharedArrayBuffer is not available in `globalThis`.
 *
 * While this workaround allows the WebAssembly module to be loaded, it does not provide multi-threading features when
 * SharedArrayBuffer is not available in `globalThis`. The WebAssembly module will run well in a single thread, when:
 * - Module['numThreads'] is set to 1, and
 * - _OrtInit() is called with numThreads = 1.
 *
 * @suppress {checkVars}
 */ var SharedArrayBuffer = globalThis.SharedArrayBuffer ?? new WebAssembly.Memory({
  initial: 0,
  maximum: 0,
  shared: true
}).buffer.constructor;

// end include: /home/wm/work/webml/webnn/frameworks/onnxruntime/honry/onnxruntime/onnxruntime/wasm/pre.js
// include: /home/wm/work/webml/webnn/frameworks/onnxruntime/honry/onnxruntime/onnxruntime/wasm/pre-jsep.js
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// This file contains the pre-run code for the ORT WebAssembly module. The code in this file will be injected into the
// final module using Emscripten's `--pre-js` option.
// This file will only be used in build with flag `--use_jsep`.
// This is a wrapper for OrtRun() and OrtRunWithBinding() to ensure that Promises are handled correctly.
const jsepRunAsync = runAsyncFunc => async (...args) => {
  try {
    // Module.jsepSessionState should be null, unless we are in the middle of a session.
    // If it is not null, it means that the previous session has not finished yet.
    if (Module.jsepSessionState) {
      throw new Error("Session already started");
    }
    const state = (Module.jsepSessionState = {
      sessionHandle: args[0],
      errors: []
    });
    // Run the acyncified function: OrtRun() or OrtRunWithBinding()
    const ret = await runAsyncFunc(...args);
    // Check if the session is still valid. this object should be the same as the one we set above.
    if (Module.jsepSessionState !== state) {
      throw new Error("Session mismatch");
    }
    // Flush the backend. This will submit all pending commands to the GPU.
    Module.jsepBackend?.["flush"]();
    // Await all pending promises. This includes GPU validation promises for diagnostic purposes.
    const errorPromises = state.errors;
    if (errorPromises.length > 0) {
      let errors = await Promise.all(errorPromises);
      errors = errors.filter(e => e);
      if (errors.length > 0) {
        throw new Error(errors.join("\n"));
      }
    }
    return ret;
  } finally {
    Module.jsepSessionState = null;
  }
};

/**
 * initialize JSEP for WebGPU and WebNN.
 */ Module["jsepInit"] = (name, params) => {
  if (name === "webgpu") {
    [Module.jsepBackend, Module.jsepAlloc, Module.jsepFree, Module.jsepCopy, Module.jsepCopyAsync, Module.jsepCreateKernel, Module.jsepReleaseKernel, Module.jsepRunKernel, Module.jsepCaptureBegin, Module.jsepCaptureEnd, Module.jsepReplay] = params;
    // expose webgpu backend functions
    const backend = Module.jsepBackend;
    Module["jsepRegisterBuffer"] = (sessionId, index, buffer, size) => backend["registerBuffer"](sessionId, index, buffer, size);
    Module["jsepGetBuffer"] = dataId => backend["getBuffer"](dataId);
    Module["jsepCreateDownloader"] = (gpuBuffer, size, type) => backend["createDownloader"](gpuBuffer, size, type);
    Module["jsepOnCreateSession"] = sessionId => {
      backend["onCreateSession"](sessionId);
    };
    Module["jsepOnReleaseSession"] = sessionId => {
      backend["onReleaseSession"](sessionId);
    };
    Module["jsepOnRunStart"] = sessionId => backend["onRunStart"](sessionId);
    Module.jsepUploadExternalBuffer = (dataId, buffer) => {
      backend["upload"](dataId, buffer);
    };
  } else if (name === "webnn") {
    // Functions called from EM_ASM need to be assigned in a way that can be minified.
    // Functions called via emscripten::val::module_property need to be assigned by name so that the minifier doesn't
    // change the name.
    const backend = params[0];
    [Module.webnnReserveTensorId, Module.webnnReleaseTensorId, Module["webnnEnsureTensor"], Module.webnnUploadTensor, Module["webnnDownloadTensor"]] = params.slice(1);
    // This function is called from both JS and an EM_ASM block, it needs both a minifiable name and an explicit name.
    Module["webnnReleaseTensorId"] = Module.webnnReleaseTensorId;
    Module["webnnUploadTensor"] = Module.webnnUploadTensor;
    // Functions called from JS also need to have explicit names.
    Module["webnnOnRunStart"] = sessionId => backend["onRunStart"](sessionId);
    Module["webnnOnRunEnd"] = backend["onRunEnd"].bind(backend);
    Module["webnnRegisterMLContext"] = (sessionId, mlContext) => {
      backend["registerMLContext"](sessionId, mlContext);
    };
    Module["webnnOnReleaseSession"] = sessionId => {
      backend["onReleaseSession"](sessionId);
    };
    Module["webnnCreateMLTensorDownloader"] = (tensorId, type) => backend["createMLTensorDownloader"](tensorId, type);
    Module["webnnRegisterMLTensor"] = (sessionId, tensor, dataType, shape) => backend["registerMLTensor"](sessionId, tensor, dataType, shape);
    Module["webnnCreateMLContext"] = optionsOrGpuDevice => backend["createMLContext"](optionsOrGpuDevice);
    Module["webnnRegisterMLConstant"] = (externalFilePath, dataOffset, dataLength, builder, desc, shouldConvertInt64ToInt32) => backend["registerMLConstant"](externalFilePath, dataOffset, dataLength, builder, desc, Module.MountedFiles, shouldConvertInt64ToInt32);
    Module["webnnRegisterGraphInput"] = backend["registerGraphInput"].bind(backend);
    Module["webnnIsGraphInput"] = backend["isGraphInput"].bind(backend);
    Module["webnnCreateTemporaryTensor"] = backend["createTemporaryTensor"].bind(backend);
    Module["webnnIsInt64Supported"] = backend["isInt64Supported"].bind(backend);
  }
};

// end include: /home/wm/work/webml/webnn/frameworks/onnxruntime/honry/onnxruntime/onnxruntime/wasm/pre-jsep.js
// include: /home/wm/work/webml/webnn/frameworks/onnxruntime/honry/onnxruntime/onnxruntime/wasm/pre-async.js
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// This file contains the pre-run code for the ORT WebAssembly module. The code in this file will be injected into the
// final module using Emscripten's `--pre-js` option.
// This file will only be used in build with flag `-s ASYNCIFY=1`.
/**
 * initialize for asyncify support.
 */ let initAsyncImpl = () => {
  // This is a simplified version of cwrap() with options.async === true (-sASYNCIFY=1)
  // It removes some overhead in cwarp() and ccall() that we don't need.
  // Currently in ASYNCIFY build, we only use this for the following functions:
  // - OrtCreateSession()
  // - OrtRun()
  // - OrtRunWithBinding()
  // - OrtBindInput()
  // Note: about parameters "getFunc" and "setFunc":
  // - Emscripten has different behaviors for Debug and Release builds for generating exported function wrapper.
  //   - In Debug build, it will generate a wrapper function for each exported function. For example, it generates a
  //     wrapper for OrtRun() like this (minified):
  //     ```
  //     var _OrtRun = Module["_OrtRun"] = createExportWrapper("OrtRun");
  //     ```
  //   - In Release build, it will generate a lazy loading wrapper for each exported function. For example, it generates
  //     a wrapper for OrtRun() like this (minified):
  //     ```
  //     d._OrtRun = (a, b, c, e, f, h, l, q) => (d._OrtRun = J.ka)(a, b, c, e, f, h, l, q);
  //     ```
  //   The behavior of these two wrappers are different. The debug build will assign `Module["_OrtRun"]` only once
  //   because `createExportWrapper()` does not reset `Module["_OrtRun"]` inside. The release build, however, will
  //   reset d._OrtRun to J.ka when the first time it is called.
  //   The difference is important because we need to design the async wrapper in a way that it can handle both cases.
  //   Now, let's look at how the async wrapper is designed to work for both cases:
  //   - Debug build:
  //      1. When Web assembly is being loaded, `Module["_OrtRun"]` is assigned to `createExportWrapper("OrtRun")`.
  //      2. When the first time `Module["initAsync"]` is called, `Module["_OrtRun"]` is re-assigned to a new async
  //         wrapper function.
  //      Value of `Module["_OrtRun"]` will not be changed again.
  //   - Release build:
  //      1. When Web assembly is being loaded, `Module["_OrtRun"]` is assigned to a lazy loading wrapper function.
  //      2. When the first time `Module["initAsync"]` is called, `Module["_OrtRun"]` is re-assigned to a new async
  //         wrapper function.
  //      3. When the first time `Module["_OrtRun"]` is called, the async wrapper will be called. It will call into this
  //         function:
  //         ```
  //         (a, b, c, e, f, h, l, q) => (d._OrtRun = J.ka)(a, b, c, e, f, h, l, q);
  //         ```
  //         This function will assign d._OrtRun (ie. the minimized `Module["_OrtRun"]`) to the real function (J.ka).
  //      4. Since d._OrtRun is re-assigned, we need to update the async wrapper to re-assign its stored
  //         function to the updated value (J.ka), and re-assign the value of `d._OrtRun` back to the async wrapper.
  //      Value of `Module["_OrtRun"]` will not be changed again.
  //   The value of `Module["_OrtRun"]` will need to be assigned for 2 times for debug build and 4 times for release
  //   build.
  //   This is why we need this `getFunc` and `setFunc` parameters. They are used to get the current value of an
  //   exported function and set the new value of an exported function.
  const wrapAsync = (func, getFunc, setFunc) => (...args) => {
    // cache the async data before calling the function.
    const previousAsync = Asyncify.currData;
    const previousFunc = getFunc?.();
    const ret = func(...args);
    const newFunc = getFunc?.();
    if (previousFunc !== newFunc) {
      // The exported function has been updated.
      // Set the sync function reference to the new function.
      func = newFunc;
      // Set the exported function back to the async wrapper.
      setFunc(previousFunc);
      // Remove getFunc and setFunc. They are no longer needed.
      setFunc = null;
      getFunc = null;
    }
    // If the async data has been changed, it means that the function started an async operation.
    if (Asyncify.currData != previousAsync) {
      // returns the promise
      return Asyncify.whenDone();
    }
    // the function is synchronous. returns the result.
    return ret;
  };
  // replace the original functions with asyncified versions
  const wrapAsyncAPIs = funcNames => {
    for (const funcName of funcNames) {
      Module[funcName] = wrapAsync(Module[funcName], () => Module[funcName], v => (Module[funcName] = v));
    }
  };
  wrapAsyncAPIs([ "_OrtAppendExecutionProvider", "_OrtCreateSession", "_OrtRun", "_OrtRunWithBinding", "_OrtBindInput" ]);
  // If JSEP is enabled, wrap OrtRun() and OrtRunWithBinding() with asyncify.
  if (typeof jsepRunAsync !== "undefined") {
    Module["_OrtRun"] = jsepRunAsync(Module["_OrtRun"]);
    Module["_OrtRunWithBinding"] = jsepRunAsync(Module["_OrtRunWithBinding"]);
  }
  // remove this function to make sure it is called only once.
  initAsyncImpl = undefined;
};

Module["asyncInit"] = () => {
  initAsyncImpl?.();
};

// end include: /home/wm/work/webml/webnn/frameworks/onnxruntime/honry/onnxruntime/onnxruntime/wasm/pre-async.js
// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = Object.assign({}, Module);

var arguments_ = [];

var thisProgram = "./this.program";

var quit_ = (status, toThrow) => {
  throw toThrow;
};

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = "";

function locateFile(path) {
  if (Module["locateFile"]) {
    return Module["locateFile"](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var readAsync, readBinary;

if (ENVIRONMENT_IS_NODE) {
  // These modules will usually be used on Node.js. Load them eagerly to avoid
  // the complexity of lazy-loading.
  var fs = require("fs");
  var nodePath = require("path");
  // EXPORT_ES6 + ENVIRONMENT_IS_NODE always requires use of import.meta.url,
  // since there's no way getting the current absolute path of the module when
  // support for that is not available.
  if (!import.meta.url.startsWith("data:")) {
    scriptDirectory = nodePath.dirname(require("url").fileURLToPath(import.meta.url)) + "/";
  }
  // include: node_shell_read.js
  readBinary = filename => {
    // We need to re-wrap `file://` strings to URLs.
    filename = isFileURI(filename) ? new URL(filename) : filename;
    var ret = fs.readFileSync(filename);
    return ret;
  };
  readAsync = async (filename, binary = true) => {
    // See the comment in the `readBinary` function.
    filename = isFileURI(filename) ? new URL(filename) : filename;
    var ret = fs.readFileSync(filename, binary ? undefined : "utf8");
    return ret;
  };
  // end include: node_shell_read.js
  if (!Module["thisProgram"] && process.argv.length > 1) {
    thisProgram = process.argv[1].replace(/\\/g, "/");
  }
  arguments_ = process.argv.slice(2);
  // MODULARIZE will export the module in the proper place outside, we don't need to export here
  quit_ = (status, toThrow) => {
    process.exitCode = status;
    throw toThrow;
  };
} else // Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) {
    // Check worker, not web, since window could be polyfilled
    scriptDirectory = self.location.href;
  } else if (typeof document != "undefined" && document.currentScript) {
    // web
    scriptDirectory = document.currentScript.src;
  }
  // When MODULARIZE, this JS may be executed later, after document.currentScript
  // is gone, so we saved it, and we use it here instead of any other info.
  if (_scriptName) {
    scriptDirectory = _scriptName;
  }
  // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
  // otherwise, slice off the final part of the url to find the script directory.
  // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
  // and scriptDirectory will correctly be replaced with an empty string.
  // If scriptDirectory contains a query (starting with ?) or a fragment (starting with #),
  // they are removed because they could contain a slash.
  if (scriptDirectory.startsWith("blob:")) {
    scriptDirectory = "";
  } else {
    scriptDirectory = scriptDirectory.slice(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
  }
  // Differentiate the Web Worker from the Node Worker case, as reading must
  // be done differently.
  if (!ENVIRONMENT_IS_NODE) {
    // include: web_or_worker_shell_read.js
    if (ENVIRONMENT_IS_WORKER) {
      readBinary = url => {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, false);
        xhr.responseType = "arraybuffer";
        xhr.send(null);
        return new Uint8Array(/** @type{!ArrayBuffer} */ (xhr.response));
      };
    }
    readAsync = async url => {
      // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
      // See https://github.com/github/fetch/pull/92#issuecomment-140665932
      // Cordova or Electron apps are typically loaded from a file:// url.
      // So use XHR on webview if URL is a file URL.
      if (isFileURI(url)) {
        return new Promise((resolve, reject) => {
          var xhr = new XMLHttpRequest;
          xhr.open("GET", url, true);
          xhr.responseType = "arraybuffer";
          xhr.onload = () => {
            if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
              // file URLs can return 0
              resolve(xhr.response);
              return;
            }
            reject(xhr.status);
          };
          xhr.onerror = reject;
          xhr.send(null);
        });
      }
      var response = await fetch(url, {
        credentials: "same-origin"
      });
      if (response.ok) {
        return response.arrayBuffer();
      }
      throw new Error(response.status + " : " + response.url);
    };
  }
} else {}

// Set up the out() and err() hooks, which are how we can print to stdout or
// stderr, respectively.
// Normally just binding console.log/console.error here works fine, but
// under node (with workers) we see missing/out-of-order messages so route
// directly to stdout and stderr.
// See https://github.com/emscripten-core/emscripten/issues/14804
var defaultPrint = console.log.bind(console);

var defaultPrintErr = console.error.bind(console);

if (ENVIRONMENT_IS_NODE) {
  defaultPrint = (...args) => fs.writeSync(1, args.join(" ") + "\n");
  defaultPrintErr = (...args) => fs.writeSync(2, args.join(" ") + "\n");
}

var out = defaultPrint;

var err = defaultPrintErr;

// Merge back in the overrides
Object.assign(Module, moduleOverrides);

// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used.
moduleOverrides = null;

// Emit code to handle expected values on the Module object. This applies Module.x
// to the proper local x. This has two benefits: first, we only emit it if it is
// expected to arrive, and second, by using a local everywhere else that can be
// minified.
// perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message
// end include: shell.js
// include: preamble.js
// === Preamble library stuff ===
// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html
var wasmBinary = Module["wasmBinary"];

// Wasm globals
var wasmMemory;

// For sending to workers.
var wasmModule;

//========================================
// Runtime essentials
//========================================
// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

// Memory management
var /** @type {!Int8Array} */ HEAP8, /** @type {!Uint8Array} */ HEAPU8, /** @type {!Int16Array} */ HEAP16, /** @type {!Uint16Array} */ HEAPU16, /** @type {!Int32Array} */ HEAP32, /** @type {!Uint32Array} */ HEAPU32, /** @type {!Float32Array} */ HEAPF32, /* BigInt64Array type is not correctly defined in closure
/** not-@type {!BigInt64Array} */ HEAP64, /* BigUint64Array type is not correctly defined in closure
/** not-t@type {!BigUint64Array} */ HEAPU64, /** @type {!Float64Array} */ HEAPF64;

var runtimeInitialized = false;

/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */ var isFileURI = filename => filename.startsWith("file://");

// include: runtime_shared.js
// include: runtime_stack_check.js
// end include: runtime_stack_check.js
// include: runtime_exceptions.js
// end include: runtime_exceptions.js
// include: runtime_debug.js
// end include: runtime_debug.js
// include: memoryprofiler.js
// end include: memoryprofiler.js
// include: growableHeap.js
// Support for growable heap + pthreads, where the buffer may change, so JS views
// must be updated.
function GROWABLE_HEAP_I8() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAP8;
}

function GROWABLE_HEAP_U8() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAPU8;
}

function GROWABLE_HEAP_I16() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAP16;
}

function GROWABLE_HEAP_U16() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAPU16;
}

function GROWABLE_HEAP_I32() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAP32;
}

function GROWABLE_HEAP_U32() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAPU32;
}

function GROWABLE_HEAP_F32() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAPF32;
}

function GROWABLE_HEAP_F64() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAPF64;
}

// end include: growableHeap.js
// include: runtime_pthread.js
// Pthread Web Worker handling code.
// This code runs only on pthread web workers and handles pthread setup
// and communication with the main thread via postMessage.
if (ENVIRONMENT_IS_PTHREAD) {
  var wasmModuleReceived;
  // Node.js support
  if (ENVIRONMENT_IS_NODE) {
    // Create as web-worker-like an environment as we can.
    var parentPort = worker_threads["parentPort"];
    parentPort.on("message", msg => onmessage({
      data: msg
    }));
    Object.assign(globalThis, {
      self: global,
      postMessage: msg => parentPort.postMessage(msg)
    });
  }
  // Thread-local guard variable for one-time init of the JS state
  var initializedJS = false;
  function threadPrintErr(...args) {
    var text = args.join(" ");
    // See https://github.com/emscripten-core/emscripten/issues/14804
    if (ENVIRONMENT_IS_NODE) {
      fs.writeSync(2, text + "\n");
      return;
    }
    console.error(text);
  }
  err = threadPrintErr;
  function threadAlert(...args) {
    var text = args.join(" ");
    postMessage({
      cmd: "alert",
      text,
      threadId: _pthread_self()
    });
  }
  self.alert = threadAlert;
  // Turn unhandled rejected promises into errors so that the main thread will be
  // notified about them.
  self.onunhandledrejection = e => {
    throw e.reason || e;
  };
  function handleMessage(e) {
    try {
      var msgData = e["data"];
      //dbg('msgData: ' + Object.keys(msgData));
      var cmd = msgData.cmd;
      if (cmd === "load") {
        // Preload command that is called once per worker to parse and load the Emscripten code.
        // Until we initialize the runtime, queue up any further incoming messages.
        let messageQueue = [];
        self.onmessage = e => messageQueue.push(e);
        // And add a callback for when the runtime is initialized.
        self.startWorker = instance => {
          // Notify the main thread that this thread has loaded.
          postMessage({
            cmd: "loaded"
          });
          // Process any messages that were queued before the thread was ready.
          for (let msg of messageQueue) {
            handleMessage(msg);
          }
          // Restore the real message handler.
          self.onmessage = handleMessage;
        };
        // Use `const` here to ensure that the variable is scoped only to
        // that iteration, allowing safe reference from a closure.
        for (const handler of msgData.handlers) {
          // The the main module has a handler for a certain even, but no
          // handler exists on the pthread worker, then proxy that handler
          // back to the main thread.
          if (!Module[handler] || Module[handler].proxy) {
            Module[handler] = (...args) => {
              postMessage({
                cmd: "callHandler",
                handler,
                args
              });
            };
            // Rebind the out / err handlers if needed
            if (handler == "print") out = Module[handler];
            if (handler == "printErr") err = Module[handler];
          }
        }
        wasmMemory = msgData.wasmMemory;
        updateMemoryViews();
        wasmModuleReceived(msgData.wasmModule);
      } else if (cmd === "run") {
        // Call inside JS module to set up the stack frame for this pthread in JS module scope.
        // This needs to be the first thing that we do, as we cannot call to any C/C++ functions
        // until the thread stack is initialized.
        establishStackSpace(msgData.pthread_ptr);
        // Pass the thread address to wasm to store it for fast access.
        __emscripten_thread_init(msgData.pthread_ptr, /*is_main=*/ 0, /*is_runtime=*/ 0, /*can_block=*/ 1, 0, 0);
        PThread.threadInitTLS();
        // Await mailbox notifications with `Atomics.waitAsync` so we can start
        // using the fast `Atomics.notify` notification path.
        __emscripten_thread_mailbox_await(msgData.pthread_ptr);
        if (!initializedJS) {
          // Embind must initialize itself on all threads, as it generates support JS.
          // We only do this once per worker since they get reused
          __embind_initialize_bindings();
          initializedJS = true;
        }
        try {
          invokeEntryPoint(msgData.start_routine, msgData.arg);
        } catch (ex) {
          if (ex != "unwind") {
            // The pthread "crashed".  Do not call `_emscripten_thread_exit` (which
            // would make this thread joinable).  Instead, re-throw the exception
            // and let the top level handler propagate it back to the main thread.
            throw ex;
          }
        }
      } else if (msgData.target === "setimmediate") {} else if (cmd === "checkMailbox") {
        if (initializedJS) {
          checkMailbox();
        }
      } else if (cmd) {
        // The received message looks like something that should be handled by this message
        // handler, (since there is a cmd field present), but is not one of the
        // recognized commands:
        err(`worker: received unknown command ${cmd}`);
        err(msgData);
      }
    } catch (ex) {
      __emscripten_thread_crashed();
      throw ex;
    }
  }
  self.onmessage = handleMessage;
}

// ENVIRONMENT_IS_PTHREAD
// end include: runtime_pthread.js
function updateMemoryViews() {
  var b = wasmMemory.buffer;
  Module["HEAP8"] = HEAP8 = new Int8Array(b);
  Module["HEAP16"] = HEAP16 = new Int16Array(b);
  Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
  Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
  Module["HEAP32"] = HEAP32 = new Int32Array(b);
  Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
  Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
  Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
  Module["HEAP64"] = HEAP64 = new BigInt64Array(b);
  Module["HEAPU64"] = HEAPU64 = new BigUint64Array(b);
}

// end include: runtime_shared.js
// In non-standalone/normal mode, we create the memory here.
// include: runtime_init_memory.js
// Create the wasm memory. (Note: this only applies if IMPORTED_MEMORY is defined)
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
if (!ENVIRONMENT_IS_PTHREAD) {
  {
    var INITIAL_MEMORY = 16777216;
    /** @suppress {checkTypes} */ wasmMemory = new WebAssembly.Memory({
      "initial": INITIAL_MEMORY / 65536,
      // In theory we should not need to emit the maximum if we want "unlimited"
      // or 4GB of memory, but VMs error on that atm, see
      // https://github.com/emscripten-core/emscripten/issues/14130
      // And in the pthreads case we definitely need to emit a maximum. So
      // always emit one.
      "maximum": 65536,
      "shared": true
    });
  }
  updateMemoryViews();
}

// end include: runtime_init_memory.js
function preRun() {
  callRuntimeCallbacks(onPreRuns);
}

function initRuntime() {
  runtimeInitialized = true;
  if (ENVIRONMENT_IS_PTHREAD) return startWorker(Module);
  wasmExports["Da"]();
}

function postRun() {
  if (ENVIRONMENT_IS_PTHREAD) return;
}

// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// Module.preRun (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;

var dependenciesFulfilled = null;

function addRunDependency(id) {
  runDependencies++;
}

function removeRunDependency(id) {
  runDependencies--;
  if (runDependencies == 0) {
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback();
    }
  }
}

/** @param {string|number=} what */ function abort(what) {
  what = "Aborted(" + what + ")";
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);
  ABORT = true;
  what += ". Build with -sASSERTIONS for more info.";
  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.
  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // definition for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */ var e = new WebAssembly.RuntimeError(what);
  readyPromiseReject(e);
  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

var wasmBinaryFile;

function findWasmBinary() {
  if (Module["locateFile"]) {
    return locateFile("ort-wasm-simd-threaded.jsep.wasm");
  }
  // Use bundler-friendly `new URL(..., import.meta.url)` pattern; works in browsers too.
  return new URL("ort-wasm-simd-threaded.jsep.wasm", import.meta.url).href;
}

function getBinarySync(file) {
  if (file == wasmBinaryFile && wasmBinary) {
    return new Uint8Array(wasmBinary);
  }
  if (readBinary) {
    return readBinary(file);
  }
  throw "both async and sync fetching of the wasm failed";
}

async function getWasmBinary(binaryFile) {
  // If we don't have the binary yet, load it asynchronously using readAsync.
  if (!wasmBinary) {
    // Fetch the binary using readAsync
    try {
      var response = await readAsync(binaryFile);
      return new Uint8Array(response);
    } catch {}
  }
  // Otherwise, getBinarySync should be able to get it synchronously
  return getBinarySync(binaryFile);
}

async function instantiateArrayBuffer(binaryFile, imports) {
  try {
    var binary = await getWasmBinary(binaryFile);
    var instance = await WebAssembly.instantiate(binary, imports);
    return instance;
  } catch (reason) {
    err(`failed to asynchronously prepare wasm: ${reason}`);
    abort(reason);
  }
}

async function instantiateAsync(binary, binaryFile, imports) {
  if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE) {
    try {
      var response = fetch(binaryFile, {
        credentials: "same-origin"
      });
      var instantiationResult = await WebAssembly.instantiateStreaming(response, imports);
      return instantiationResult;
    } catch (reason) {
      // We expect the most common failure cause to be a bad MIME type for the binary,
      // in which case falling back to ArrayBuffer instantiation should work.
      err(`wasm streaming compile failed: ${reason}`);
      err("falling back to ArrayBuffer instantiation");
    }
  }
  return instantiateArrayBuffer(binaryFile, imports);
}

function getWasmImports() {
  assignWasmImports();
  // prepare imports
  return {
    "a": wasmImports
  };
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
async function createWasm() {
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/ function receiveInstance(instance, module) {
    wasmExports = instance.exports;
    wasmExports = Asyncify.instrumentWasmExports(wasmExports);
    wasmExports = applySignatureConversions(wasmExports);
    registerTLSInit(wasmExports["jb"]);
    // We now have the Wasm module loaded up, keep a reference to the compiled module so we can post it to the workers.
    wasmModule = module;
    removeRunDependency("wasm-instantiate");
    return wasmExports;
  }
  // wait for the pthread pool (if any)
  addRunDependency("wasm-instantiate");
  // Prefer streaming instantiation if available.
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    return receiveInstance(result["instance"], result["module"]);
  }
  var info = getWasmImports();
  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  if (Module["instantiateWasm"]) {
    return new Promise((resolve, reject) => {
      Module["instantiateWasm"](info, (mod, inst) => {
        receiveInstance(mod, inst);
        resolve(mod.exports);
      });
    });
  }
  if (ENVIRONMENT_IS_PTHREAD) {
    return new Promise(resolve => {
      wasmModuleReceived = module => {
        // Instantiate from the module posted from the main thread.
        // We can just use sync instantiation in the worker.
        var instance = new WebAssembly.Instance(module, getWasmImports());
        resolve(receiveInstance(instance, module));
      };
    });
  }
  wasmBinaryFile ??= findWasmBinary();
  try {
    var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
    var exports = receiveInstantiationResult(result);
    return exports;
  } catch (e) {
    // If instantiation fails, reject the module ready promise.
    readyPromiseReject(e);
    return Promise.reject(e);
  }
}

// === Body ===
var ASM_CONSTS = {
  860124: ($0, $1, $2, $3, $4) => {
    if (typeof Module == "undefined" || !Module.MountedFiles) {
      return 1;
    }
    let fileName = UTF8ToString(Number($0 >>> 0));
    if (fileName.startsWith("./")) {
      fileName = fileName.substring(2);
    }
    const fileData = Module.MountedFiles.get(fileName);
    if (!fileData) {
      return 2;
    }
    const offset = Number($1 >>> 0);
    const length = Number($2 >>> 0);
    const dataIdOrBuffer = Number($3 >>> 0);
    const loadType = $4;
    if (offset + length > fileData.byteLength) {
      return 3;
    }
    try {
      const data = fileData.subarray(offset, offset + length);
      switch (loadType) {
       case 0:
        GROWABLE_HEAP_U8().set(data, dataIdOrBuffer >>> 0);
        break;

       case 1:
        if (Module.webgpuUploadExternalBuffer) {
          Module.webgpuUploadExternalBuffer(dataIdOrBuffer, data);
        } else {
          Module.jsepUploadExternalBuffer(dataIdOrBuffer, data);
        }
        break;

       default:
        return 4;
      }
      return 0;
    } catch {
      return 4;
    }
  },
  860948: ($0, $1, $2) => {
    Module.webnnUploadTensor($0, GROWABLE_HEAP_U8().subarray($1 >>> 0, $1 + $2 >>> 0));
  },
  861012: () => Module.webnnReserveTensorId(),
  861054: $0 => {
    Module.webnnReleaseTensorId($0);
  },
  861091: () => {
    Module.jsepCaptureBegin();
  },
  861122: () => {
    Module.jsepCaptureEnd();
  },
  861151: () => {
    Module.jsepReplay();
  },
  861176: $0 => Module.jsepAlloc($0),
  861209: $0 => Module.jsepFree($0),
  861241: ($0, $1, $2) => {
    Module.jsepCopy(Number($0), Number($1), Number($2), true);
  },
  861304: ($0, $1, $2) => {
    Module.jsepCopy(Number($0), Number($1), Number($2));
  },
  861361: () => (typeof wasmOffsetConverter !== "undefined"),
  861418: $0 => {
    Module.jsepCreateKernel("Abs", $0, undefined);
  },
  861469: $0 => {
    Module.jsepCreateKernel("Neg", $0, undefined);
  },
  861520: $0 => {
    Module.jsepCreateKernel("Floor", $0, undefined);
  },
  861573: $0 => {
    Module.jsepCreateKernel("Ceil", $0, undefined);
  },
  861625: $0 => {
    Module.jsepCreateKernel("Reciprocal", $0, undefined);
  },
  861683: $0 => {
    Module.jsepCreateKernel("Sqrt", $0, undefined);
  },
  861735: $0 => {
    Module.jsepCreateKernel("Exp", $0, undefined);
  },
  861786: $0 => {
    Module.jsepCreateKernel("Erf", $0, undefined);
  },
  861837: $0 => {
    Module.jsepCreateKernel("Sigmoid", $0, undefined);
  },
  861892: ($0, $1, $2) => {
    Module.jsepCreateKernel("HardSigmoid", $0, ({
      "alpha": $1,
      "beta": $2
    }));
  },
  861971: $0 => {
    Module.jsepCreateKernel("Log", $0, undefined);
  },
  862022: $0 => {
    Module.jsepCreateKernel("Sin", $0, undefined);
  },
  862073: $0 => {
    Module.jsepCreateKernel("Cos", $0, undefined);
  },
  862124: $0 => {
    Module.jsepCreateKernel("Tan", $0, undefined);
  },
  862175: $0 => {
    Module.jsepCreateKernel("Asin", $0, undefined);
  },
  862227: $0 => {
    Module.jsepCreateKernel("Acos", $0, undefined);
  },
  862279: $0 => {
    Module.jsepCreateKernel("Atan", $0, undefined);
  },
  862331: $0 => {
    Module.jsepCreateKernel("Sinh", $0, undefined);
  },
  862383: $0 => {
    Module.jsepCreateKernel("Cosh", $0, undefined);
  },
  862435: $0 => {
    Module.jsepCreateKernel("Asinh", $0, undefined);
  },
  862488: $0 => {
    Module.jsepCreateKernel("Acosh", $0, undefined);
  },
  862541: $0 => {
    Module.jsepCreateKernel("Atanh", $0, undefined);
  },
  862594: $0 => {
    Module.jsepCreateKernel("Tanh", $0, undefined);
  },
  862646: $0 => {
    Module.jsepCreateKernel("Not", $0, undefined);
  },
  862697: ($0, $1, $2) => {
    Module.jsepCreateKernel("Clip", $0, ({
      "min": $1,
      "max": $2
    }));
  },
  862766: $0 => {
    Module.jsepCreateKernel("Clip", $0, undefined);
  },
  862818: ($0, $1) => {
    Module.jsepCreateKernel("Elu", $0, ({
      "alpha": $1
    }));
  },
  862876: $0 => {
    Module.jsepCreateKernel("Gelu", $0, undefined);
  },
  862928: $0 => {
    Module.jsepCreateKernel("Relu", $0, undefined);
  },
  862980: ($0, $1) => {
    Module.jsepCreateKernel("LeakyRelu", $0, ({
      "alpha": $1
    }));
  },
  863044: ($0, $1) => {
    Module.jsepCreateKernel("ThresholdedRelu", $0, ({
      "alpha": $1
    }));
  },
  863114: ($0, $1) => {
    Module.jsepCreateKernel("Cast", $0, ({
      "to": $1
    }));
  },
  863172: $0 => {
    Module.jsepCreateKernel("Add", $0, undefined);
  },
  863223: $0 => {
    Module.jsepCreateKernel("Sub", $0, undefined);
  },
  863274: $0 => {
    Module.jsepCreateKernel("Mul", $0, undefined);
  },
  863325: $0 => {
    Module.jsepCreateKernel("Div", $0, undefined);
  },
  863376: $0 => {
    Module.jsepCreateKernel("Pow", $0, undefined);
  },
  863427: $0 => {
    Module.jsepCreateKernel("Equal", $0, undefined);
  },
  863480: $0 => {
    Module.jsepCreateKernel("Greater", $0, undefined);
  },
  863535: $0 => {
    Module.jsepCreateKernel("GreaterOrEqual", $0, undefined);
  },
  863597: $0 => {
    Module.jsepCreateKernel("Less", $0, undefined);
  },
  863649: $0 => {
    Module.jsepCreateKernel("LessOrEqual", $0, undefined);
  },
  863708: ($0, $1, $2, $3, $4) => {
    Module.jsepCreateKernel("ReduceMean", $0, ({
      "keepDims": !!$1,
      "noopWithEmptyAxes": !!$2,
      "axes": $3 ? (Array.from(GROWABLE_HEAP_I32().subarray(Number($3) >>> 0, Number($4) >>> 0))) : []
    }));
  },
  863883: ($0, $1, $2, $3, $4) => {
    Module.jsepCreateKernel("ReduceMax", $0, ({
      "keepDims": !!$1,
      "noopWithEmptyAxes": !!$2,
      "axes": $3 ? (Array.from(GROWABLE_HEAP_I32().subarray(Number($3) >>> 0, Number($4) >>> 0))) : []
    }));
  },
  864057: ($0, $1, $2, $3, $4) => {
    Module.jsepCreateKernel("ReduceMin", $0, ({
      "keepDims": !!$1,
      "noopWithEmptyAxes": !!$2,
      "axes": $3 ? (Array.from(GROWABLE_HEAP_I32().subarray(Number($3) >>> 0, Number($4) >>> 0))) : []
    }));
  },
  864231: ($0, $1, $2, $3, $4) => {
    Module.jsepCreateKernel("ReduceProd", $0, ({
      "keepDims": !!$1,
      "noopWithEmptyAxes": !!$2,
      "axes": $3 ? (Array.from(GROWABLE_HEAP_I32().subarray(Number($3) >>> 0, Number($4) >>> 0))) : []
    }));
  },
  864406: ($0, $1, $2, $3, $4) => {
    Module.jsepCreateKernel("ReduceSum", $0, ({
      "keepDims": !!$1,
      "noopWithEmptyAxes": !!$2,
      "axes": $3 ? (Array.from(GROWABLE_HEAP_I32().subarray(Number($3) >>> 0, Number($4) >>> 0))) : []
    }));
  },
  864580: ($0, $1, $2, $3, $4) => {
    Module.jsepCreateKernel("ReduceL1", $0, ({
      "keepDims": !!$1,
      "noopWithEmptyAxes": !!$2,
      "axes": $3 ? (Array.from(GROWABLE_HEAP_I32().subarray(Number($3) >>> 0, Number($4) >>> 0))) : []
    }));
  },
  864753: ($0, $1, $2, $3, $4) => {
    Module.jsepCreateKernel("ReduceL2", $0, ({
      "keepDims": !!$1,
      "noopWithEmptyAxes": !!$2,
      "axes": $3 ? (Array.from(GROWABLE_HEAP_I32().subarray(Number($3) >>> 0, Number($4) >>> 0))) : []
    }));
  },
  864926: ($0, $1, $2, $3, $4) => {
    Module.jsepCreateKernel("ReduceLogSum", $0, ({
      "keepDims": !!$1,
      "noopWithEmptyAxes": !!$2,
      "axes": $3 ? (Array.from(GROWABLE_HEAP_I32().subarray(Number($3) >>> 0, Number($4) >>> 0))) : []
    }));
  },
  865103: ($0, $1, $2, $3, $4) => {
    Module.jsepCreateKernel("ReduceSumSquare", $0, ({
      "keepDims": !!$1,
      "noopWithEmptyAxes": !!$2,
      "axes": $3 ? (Array.from(GROWABLE_HEAP_I32().subarray(Number($3) >>> 0, Number($4) >>> 0))) : []
    }));
  },
  865283: ($0, $1, $2, $3, $4) => {
    Module.jsepCreateKernel("ReduceLogSumExp", $0, ({
      "keepDims": !!$1,
      "noopWithEmptyAxes": !!$2,
      "axes": $3 ? (Array.from(GROWABLE_HEAP_I32().subarray(Number($3) >>> 0, Number($4) >>> 0))) : []
    }));
  },
  865463: $0 => {
    Module.jsepCreateKernel("Where", $0, undefined);
  },
  865516: ($0, $1, $2) => {
    Module.jsepCreateKernel("Transpose", $0, ({
      "perm": $1 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($1) >>> 0, Number($2) >>> 0)) : []
    }));
  },
  865640: ($0, $1, $2, $3) => {
    Module.jsepCreateKernel("DepthToSpace", $0, ({
      "blocksize": $1,
      "mode": UTF8ToString($2),
      "format": $3 ? "NHWC" : "NCHW"
    }));
  },
  865773: ($0, $1, $2, $3) => {
    Module.jsepCreateKernel("DepthToSpace", $0, ({
      "blocksize": $1,
      "mode": UTF8ToString($2),
      "format": $3 ? "NHWC" : "NCHW"
    }));
  },
  865906: ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) => {
    Module.jsepCreateKernel("ConvTranspose", $0, ({
      "format": $8 ? "NHWC" : "NCHW",
      "autoPad": $1,
      "dilations": [ $2 ],
      "group": $3,
      "kernelShape": [ $4 ],
      "pads": [ $5, $6 ],
      "strides": [ $7 ],
      "wIsConst": () => (!!GROWABLE_HEAP_I8()[$9 >>> 0]),
      "outputPadding": $10 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($10) >>> 0, Number($11) >>> 0)) : [],
      "outputShape": $12 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($12) >>> 0, Number($13) >>> 0)) : [],
      "activation": UTF8ToString($14)
    }));
  },
  866339: ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) => {
    Module.jsepCreateKernel("ConvTranspose", $0, ({
      "format": $7 ? "NHWC" : "NCHW",
      "autoPad": $1,
      "dilations": Array.from(GROWABLE_HEAP_I32().subarray(Number($2) >>> 0, (Number($2) >>> 0) + 2 >>> 0)),
      "group": $3,
      "kernelShape": Array.from(GROWABLE_HEAP_I32().subarray(Number($4) >>> 0, (Number($4) >>> 0) + 2 >>> 0)),
      "pads": Array.from(GROWABLE_HEAP_I32().subarray(Number($5) >>> 0, (Number($5) >>> 0) + 4 >>> 0)),
      "strides": Array.from(GROWABLE_HEAP_I32().subarray(Number($6) >>> 0, (Number($6) >>> 0) + 2 >>> 0)),
      "wIsConst": () => (!!GROWABLE_HEAP_I8()[$8 >>> 0]),
      "outputPadding": $9 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($9) >>> 0, Number($10) >>> 0)) : [],
      "outputShape": $11 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($11) >>> 0, Number($12) >>> 0)) : [],
      "activation": UTF8ToString($13)
    }));
  },
  867e3: ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) => {
    Module.jsepCreateKernel("ConvTranspose", $0, ({
      "format": $8 ? "NHWC" : "NCHW",
      "autoPad": $1,
      "dilations": [ $2 ],
      "group": $3,
      "kernelShape": [ $4 ],
      "pads": [ $5, $6 ],
      "strides": [ $7 ],
      "wIsConst": () => (!!GROWABLE_HEAP_I8()[$9 >>> 0]),
      "outputPadding": $10 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($10) >>> 0, Number($11) >>> 0)) : [],
      "outputShape": $12 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($12) >>> 0, Number($13) >>> 0)) : [],
      "activation": UTF8ToString($14)
    }));
  },
  867433: ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) => {
    Module.jsepCreateKernel("ConvTranspose", $0, ({
      "format": $7 ? "NHWC" : "NCHW",
      "autoPad": $1,
      "dilations": Array.from(GROWABLE_HEAP_I32().subarray(Number($2) >>> 0, (Number($2) >>> 0) + 2 >>> 0)),
      "group": $3,
      "kernelShape": Array.from(GROWABLE_HEAP_I32().subarray(Number($4) >>> 0, (Number($4) >>> 0) + 2 >>> 0)),
      "pads": Array.from(GROWABLE_HEAP_I32().subarray(Number($5) >>> 0, (Number($5) >>> 0) + 4 >>> 0)),
      "strides": Array.from(GROWABLE_HEAP_I32().subarray(Number($6) >>> 0, (Number($6) >>> 0) + 2 >>> 0)),
      "wIsConst": () => (!!GROWABLE_HEAP_I8()[$8 >>> 0]),
      "outputPadding": $9 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($9) >>> 0, Number($10) >>> 0)) : [],
      "outputShape": $11 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($11) >>> 0, Number($12) >>> 0)) : [],
      "activation": UTF8ToString($13)
    }));
  },
  868094: ($0, $1) => {
    Module.jsepCreateKernel("GlobalAveragePool", $0, ({
      "format": $1 ? "NHWC" : "NCHW"
    }));
  },
  868185: ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) => {
    Module.jsepCreateKernel("AveragePool", $0, ({
      "format": $13 ? "NHWC" : "NCHW",
      "auto_pad": $1,
      "ceil_mode": $2,
      "count_include_pad": $3,
      "storage_order": $4,
      "dilations": $5 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($5) >>> 0, Number($6) >>> 0)) : [],
      "kernel_shape": $7 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($7) >>> 0, Number($8) >>> 0)) : [],
      "pads": $9 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($9) >>> 0, Number($10) >>> 0)) : [],
      "strides": $11 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($11) >>> 0, Number($12) >>> 0)) : []
    }));
  },
  868664: ($0, $1) => {
    Module.jsepCreateKernel("GlobalAveragePool", $0, ({
      "format": $1 ? "NHWC" : "NCHW"
    }));
  },
  868755: ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) => {
    Module.jsepCreateKernel("AveragePool", $0, ({
      "format": $13 ? "NHWC" : "NCHW",
      "auto_pad": $1,
      "ceil_mode": $2,
      "count_include_pad": $3,
      "storage_order": $4,
      "dilations": $5 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($5) >>> 0, Number($6) >>> 0)) : [],
      "kernel_shape": $7 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($7) >>> 0, Number($8) >>> 0)) : [],
      "pads": $9 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($9) >>> 0, Number($10) >>> 0)) : [],
      "strides": $11 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($11) >>> 0, Number($12) >>> 0)) : []
    }));
  },
  869234: ($0, $1) => {
    Module.jsepCreateKernel("GlobalMaxPool", $0, ({
      "format": $1 ? "NHWC" : "NCHW"
    }));
  },
  869321: ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) => {
    Module.jsepCreateKernel("MaxPool", $0, ({
      "format": $13 ? "NHWC" : "NCHW",
      "auto_pad": $1,
      "ceil_mode": $2,
      "count_include_pad": $3,
      "storage_order": $4,
      "dilations": $5 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($5) >>> 0, Number($6) >>> 0)) : [],
      "kernel_shape": $7 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($7) >>> 0, Number($8) >>> 0)) : [],
      "pads": $9 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($9) >>> 0, Number($10) >>> 0)) : [],
      "strides": $11 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($11) >>> 0, Number($12) >>> 0)) : []
    }));
  },
  869796: ($0, $1) => {
    Module.jsepCreateKernel("GlobalMaxPool", $0, ({
      "format": $1 ? "NHWC" : "NCHW"
    }));
  },
  869883: ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) => {
    Module.jsepCreateKernel("MaxPool", $0, ({
      "format": $13 ? "NHWC" : "NCHW",
      "auto_pad": $1,
      "ceil_mode": $2,
      "count_include_pad": $3,
      "storage_order": $4,
      "dilations": $5 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($5) >>> 0, Number($6) >>> 0)) : [],
      "kernel_shape": $7 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($7) >>> 0, Number($8) >>> 0)) : [],
      "pads": $9 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($9) >>> 0, Number($10) >>> 0)) : [],
      "strides": $11 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($11) >>> 0, Number($12) >>> 0)) : []
    }));
  },
  870358: ($0, $1, $2, $3, $4) => {
    Module.jsepCreateKernel("Gemm", $0, ({
      "alpha": $1,
      "beta": $2,
      "transA": $3,
      "transB": $4
    }));
  },
  870462: $0 => {
    Module.jsepCreateKernel("MatMul", $0, undefined);
  },
  870516: ($0, $1, $2, $3) => {
    Module.jsepCreateKernel("ArgMax", $0, ({
      "keepDims": !!$1,
      "selectLastIndex": !!$2,
      "axis": $3
    }));
  },
  870624: ($0, $1, $2, $3) => {
    Module.jsepCreateKernel("ArgMin", $0, ({
      "keepDims": !!$1,
      "selectLastIndex": !!$2,
      "axis": $3
    }));
  },
  870732: ($0, $1) => {
    Module.jsepCreateKernel("Softmax", $0, ({
      "axis": $1
    }));
  },
  870795: ($0, $1) => {
    Module.jsepCreateKernel("Concat", $0, ({
      "axis": $1
    }));
  },
  870855: ($0, $1, $2, $3, $4) => {
    Module.jsepCreateKernel("Split", $0, ({
      "axis": $1,
      "numOutputs": $2,
      "splitSizes": $3 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($3) >>> 0, Number($4) >>> 0)) : []
    }));
  },
  871011: $0 => {
    Module.jsepCreateKernel("Expand", $0, undefined);
  },
  871065: ($0, $1) => {
    Module.jsepCreateKernel("Gather", $0, ({
      "axis": Number($1)
    }));
  },
  871136: ($0, $1) => {
    Module.jsepCreateKernel("GatherElements", $0, ({
      "axis": Number($1)
    }));
  },
  871215: ($0, $1) => {
    Module.jsepCreateKernel("GatherND", $0, ({
      "batch_dims": Number($1)
    }));
  },
  871294: ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10) => {
    Module.jsepCreateKernel("Resize", $0, ({
      "antialias": $1,
      "axes": $2 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($2) >>> 0, Number($3) >>> 0)) : [],
      "coordinateTransformMode": UTF8ToString($4),
      "cubicCoeffA": $5,
      "excludeOutside": $6,
      "extrapolationValue": $7,
      "keepAspectRatioPolicy": UTF8ToString($8),
      "mode": UTF8ToString($9),
      "nearestMode": UTF8ToString($10)
    }));
  },
  871656: ($0, $1, $2, $3, $4, $5, $6) => {
    Module.jsepCreateKernel("Slice", $0, ({
      "starts": $1 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($1) >>> 0, Number($2) >>> 0)) : [],
      "ends": $3 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($3) >>> 0, Number($4) >>> 0)) : [],
      "axes": $5 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($5) >>> 0, Number($6) >>> 0)) : []
    }));
  },
  871920: $0 => {
    Module.jsepCreateKernel("Tile", $0, undefined);
  },
  871972: ($0, $1, $2) => {
    Module.jsepCreateKernel("InstanceNormalization", $0, ({
      "epsilon": $1,
      "format": $2 ? "NHWC" : "NCHW"
    }));
  },
  872086: ($0, $1, $2) => {
    Module.jsepCreateKernel("InstanceNormalization", $0, ({
      "epsilon": $1,
      "format": $2 ? "NHWC" : "NCHW"
    }));
  },
  872200: $0 => {
    Module.jsepCreateKernel("Range", $0, undefined);
  },
  872253: ($0, $1) => {
    Module.jsepCreateKernel("Einsum", $0, ({
      "equation": UTF8ToString($1)
    }));
  },
  872334: ($0, $1, $2, $3, $4) => {
    Module.jsepCreateKernel("Pad", $0, ({
      "mode": $1,
      "value": $2,
      "pads": $3 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($3) >>> 0, Number($4) >>> 0)) : []
    }));
  },
  872477: ($0, $1, $2, $3, $4, $5) => {
    Module.jsepCreateKernel("BatchNormalization", $0, ({
      "epsilon": $1,
      "momentum": $2,
      "spatial": !!$4,
      "trainingMode": !!$3,
      "format": $5 ? "NHWC" : "NCHW"
    }));
  },
  872646: ($0, $1, $2, $3, $4, $5) => {
    Module.jsepCreateKernel("BatchNormalization", $0, ({
      "epsilon": $1,
      "momentum": $2,
      "spatial": !!$4,
      "trainingMode": !!$3,
      "format": $5 ? "NHWC" : "NCHW"
    }));
  },
  872815: ($0, $1, $2) => {
    Module.jsepCreateKernel("CumSum", $0, ({
      "exclusive": Number($1),
      "reverse": Number($2)
    }));
  },
  872912: ($0, $1, $2) => {
    Module.jsepCreateKernel("DequantizeLinear", $0, ({
      "axis": $1,
      "blockSize": $2
    }));
  },
  873002: ($0, $1, $2, $3, $4) => {
    Module.jsepCreateKernel("GridSample", $0, ({
      "align_corners": $1,
      "mode": UTF8ToString($2),
      "padding_mode": UTF8ToString($3),
      "format": $4 ? "NHWC" : "NCHW"
    }));
  },
  873172: ($0, $1, $2, $3, $4) => {
    Module.jsepCreateKernel("GridSample", $0, ({
      "align_corners": $1,
      "mode": UTF8ToString($2),
      "padding_mode": UTF8ToString($3),
      "format": $4 ? "NHWC" : "NCHW"
    }));
  },
  873342: ($0, $1) => {
    Module.jsepCreateKernel("ScatterND", $0, ({
      "reduction": UTF8ToString($1)
    }));
  },
  873427: ($0, $1, $2, $3, $4, $5, $6, $7, $8) => {
    Module.jsepCreateKernel("Attention", $0, ({
      "numHeads": $1,
      "isUnidirectional": $2,
      "maskFilterValue": $3,
      "scale": $4,
      "doRotary": $5,
      "qkvHiddenSizes": $6 ? (Array.from(GROWABLE_HEAP_I32().subarray(Number($7) >>> 0, Number($7) + $6 >>> 0))) : [],
      "pastPresentShareBuffer": !!$8
    }));
  },
  873699: $0 => {
    Module.jsepCreateKernel("BiasAdd", $0, undefined);
  },
  873754: $0 => {
    Module.jsepCreateKernel("BiasSplitGelu", $0, undefined);
  },
  873815: $0 => {
    Module.jsepCreateKernel("FastGelu", $0, undefined);
  },
  873871: ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) => {
    Module.jsepCreateKernel("Conv", $0, ({
      "format": $11 ? "NHWC" : "NCHW",
      "auto_pad": $1,
      "dilations": $2 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($2) >>> 0, Number($3) >>> 0)) : [],
      "group": $4,
      "kernel_shape": $5 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($5) >>> 0, Number($6) >>> 0)) : [],
      "pads": $7 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($7) >>> 0, Number($8) >>> 0)) : [],
      "strides": $9 ? Array.from(GROWABLE_HEAP_I32().subarray(Number($9) >>> 0, Number($10) >>> 0)) : [],
      "w_is_const": () => (!!GROWABLE_HEAP_I8()[Number($12) >>> 0]),
      "activation": UTF8ToString($13),
      "activation_params": $14 ? Array.from(GROWABLE_HEAP_F32().subarray(Number($14) >>> 0, Number($15) >>> 0)) : []
    }));
  },
  874455: $0 => {
    Module.jsepCreateKernel("Gelu", $0, undefined);
  },
  874507: ($0, $1, $2, $3, $4, $5, $6, $7, $8) => {
    Module.jsepCreateKernel("GroupQueryAttention", $0, ({
      "numHeads": $1,
      "kvNumHeads": $2,
      "scale": $3,
      "softcap": $4,
      "doRotary": $5,
      "rotaryInterleaved": $6,
      "smoothSoftmax": $7,
      "localWindowSize": $8
    }));
  },
  874724: ($0, $1, $2, $3) => {
    Module.jsepCreateKernel("LayerNormalization", $0, ({
      "axis": $1,
      "epsilon": $2,
      "simplified": !!$3
    }));
  },
  874835: ($0, $1, $2, $3) => {
    Module.jsepCreateKernel("LayerNormalization", $0, ({
      "axis": $1,
      "epsilon": $2,
      "simplified": !!$3
    }));
  },
  874946: ($0, $1, $2, $3, $4, $5) => {
    Module.jsepCreateKernel("MatMulNBits", $0, ({
      "k": $1,
      "n": $2,
      "accuracyLevel": $3,
      "bits": $4,
      "blockSize": $5
    }));
  },
  875073: ($0, $1, $2, $3, $4, $5) => {
    Module.jsepCreateKernel("MultiHeadAttention", $0, ({
      "numHeads": $1,
      "isUnidirectional": $2,
      "maskFilterValue": $3,
      "scale": $4,
      "doRotary": $5
    }));
  },
  875232: ($0, $1) => {
    Module.jsepCreateKernel("QuickGelu", $0, ({
      "alpha": $1
    }));
  },
  875296: ($0, $1, $2, $3, $4) => {
    Module.jsepCreateKernel("RotaryEmbedding", $0, ({
      "interleaved": !!$1,
      "numHeads": $2,
      "rotaryEmbeddingDim": $3,
      "scale": $4
    }));
  },
  875435: ($0, $1, $2) => {
    Module.jsepCreateKernel("SkipLayerNormalization", $0, ({
      "epsilon": $1,
      "simplified": !!$2
    }));
  },
  875537: ($0, $1, $2) => {
    Module.jsepCreateKernel("SkipLayerNormalization", $0, ({
      "epsilon": $1,
      "simplified": !!$2
    }));
  },
  875639: ($0, $1, $2, $3) => {
    Module.jsepCreateKernel("GatherBlockQuantized", $0, ({
      "gatherAxis": $1,
      "quantizeAxis": $2,
      "blockSize": $3
    }));
  },
  875760: $0 => {
    Module.jsepReleaseKernel($0);
  },
  875794: ($0, $1) => Module.jsepRunKernel(Number($0), Number($1), Module.jsepSessionState.sessionHandle, Module.jsepSessionState.errors)
};

function __asyncjs__jsepDownload(src_data, dst_data, bytes) {
  return Asyncify.handleAsync(async () => {
    await Module.jsepCopyAsync(Number(src_data), Number(dst_data), Number(bytes));
  });
}

function HaveOffsetConverter() {
  return typeof wasmOffsetConverter !== "undefined";
}

// end include: preamble.js
class ExitStatus {
  name="ExitStatus";
  constructor(status) {
    this.message = `Program terminated with exit(${status})`;
    this.status = status;
  }
}

var terminateWorker = worker => {
  worker.terminate();
  // terminate() can be asynchronous, so in theory the worker can continue
  // to run for some amount of time after termination.  However from our POV
  // the worker now dead and we don't want to hear from it again, so we stub
  // out its message handler here.  This avoids having to check in each of
  // the onmessage handlers if the message was coming from valid worker.
  worker.onmessage = e => {};
};

var cleanupThread = pthread_ptr => {
  var worker = PThread.pthreads[pthread_ptr];
  PThread.returnWorkerToPool(worker);
};

var callRuntimeCallbacks = callbacks => {
  while (callbacks.length > 0) {
    // Pass the module as the first argument.
    callbacks.shift()(Module);
  }
};

var onPreRuns = [];

var addOnPreRun = cb => onPreRuns.unshift(cb);

var spawnThread = threadParams => {
  var worker = PThread.getNewWorker();
  if (!worker) {
    // No available workers in the PThread pool.
    return 6;
  }
  PThread.runningWorkers.push(worker);
  // Add to pthreads map
  PThread.pthreads[threadParams.pthread_ptr] = worker;
  worker.pthread_ptr = threadParams.pthread_ptr;
  var msg = {
    cmd: "run",
    start_routine: threadParams.startRoutine,
    arg: threadParams.arg,
    pthread_ptr: threadParams.pthread_ptr
  };
  if (ENVIRONMENT_IS_NODE) {
    // Mark worker as weakly referenced once we start executing a pthread,
    // so that its existence does not prevent Node.js from exiting.  This
    // has no effect if the worker is already weakly referenced (e.g. if
    // this worker was previously idle/unused).
    worker.unref();
  }
  // Ask the worker to start executing its pthread entry point function.
  worker.postMessage(msg, threadParams.transferList);
  return 0;
};

var runtimeKeepaliveCounter = 0;

var keepRuntimeAlive = () => runtimeKeepaliveCounter > 0;

var stackSave = () => _emscripten_stack_get_current();

var stackRestore = val => __emscripten_stack_restore(val);

var stackAlloc = sz => __emscripten_stack_alloc(sz);

var INT53_MAX = 9007199254740992;

var INT53_MIN = -9007199254740992;

var bigintToI53Checked = num => (num < INT53_MIN || num > INT53_MAX) ? NaN : Number(num);

/** @type{function(number, (number|boolean), ...number)} */ var proxyToMainThread = (funcIndex, emAsmAddr, sync, ...callArgs) => {
  // EM_ASM proxying is done by passing a pointer to the address of the EM_ASM
  // content as `emAsmAddr`.  JS library proxying is done by passing an index
  // into `proxiedJSCallArgs` as `funcIndex`. If `emAsmAddr` is non-zero then
  // `funcIndex` will be ignored.
  // Additional arguments are passed after the first three are the actual
  // function arguments.
  // The serialization buffer contains the number of call params, and then
  // all the args here.
  // We also pass 'sync' to C separately, since C needs to look at it.
  // Allocate a buffer, which will be copied by the C code.
  // First passed parameter specifies the number of arguments to the function.
  // When BigInt support is enabled, we must handle types in a more complex
  // way, detecting at runtime if a value is a BigInt or not (as we have no
  // type info here). To do that, add a "prefix" before each value that
  // indicates if it is a BigInt, which effectively doubles the number of
  // values we serialize for proxying. TODO: pack this?
  var serializedNumCallArgs = callArgs.length * 2;
  var sp = stackSave();
  var args = stackAlloc(serializedNumCallArgs * 8);
  var b = ((args) >>> 3);
  for (var i = 0; i < callArgs.length; i++) {
    var arg = callArgs[i];
    if (typeof arg == "bigint") {
      // The prefix is non-zero to indicate a bigint.
      HEAP64[b + 2 * i] = 1n;
      HEAP64[b + 2 * i + 1] = arg;
    } else {
      // The prefix is zero to indicate a JS Number.
      HEAP64[b + 2 * i] = 0n;
      GROWABLE_HEAP_F64()[b + 2 * i + 1 >>> 0] = arg;
    }
  }
  var rtn = __emscripten_run_on_main_thread_js(funcIndex, emAsmAddr, serializedNumCallArgs, args, sync);
  stackRestore(sp);
  return rtn;
};

function _proc_exit(code) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(0, 0, 1, code);
  EXITSTATUS = code;
  if (!keepRuntimeAlive()) {
    PThread.terminateAllThreads();
    ABORT = true;
  }
  quit_(code, new ExitStatus(code));
}

var handleException = e => {
  // Certain exception types we do not treat as errors since they are used for
  // internal control flow.
  // 1. ExitStatus, which is thrown by exit()
  // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
  //    that wish to return to JS event loop.
  if (e instanceof ExitStatus || e == "unwind") {
    return EXITSTATUS;
  }
  quit_(1, e);
};

function exitOnMainThread(returnCode) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(1, 0, 0, returnCode);
  _exit(returnCode);
}

/** @suppress {duplicate } */ /** @param {boolean|number=} implicit */ var exitJS = (status, implicit) => {
  EXITSTATUS = status;
  if (ENVIRONMENT_IS_PTHREAD) {
    // implicit exit can never happen on a pthread
    // When running in a pthread we propagate the exit back to the main thread
    // where it can decide if the whole process should be shut down or not.
    // The pthread may have decided not to exit its own runtime, for example
    // because it runs a main loop, but that doesn't affect the main thread.
    exitOnMainThread(status);
    throw "unwind";
  }
  _proc_exit(status);
};

var _exit = exitJS;

var PThread = {
  unusedWorkers: [],
  runningWorkers: [],
  tlsInitFunctions: [],
  pthreads: {},
  init() {
    if ((!(ENVIRONMENT_IS_PTHREAD))) {
      PThread.initMainThread();
    }
  },
  initMainThread() {
    var pthreadPoolSize = Module["numThreads"] - 1;
    // Start loading up the Worker pool, if requested.
    while (pthreadPoolSize--) {
      PThread.allocateUnusedWorker();
    }
    // MINIMAL_RUNTIME takes care of calling loadWasmModuleToAllWorkers
    // in postamble_minimal.js
    addOnPreRun(() => {
      addRunDependency("loading-workers");
      PThread.loadWasmModuleToAllWorkers(() => removeRunDependency("loading-workers"));
    });
  },
  terminateAllThreads: () => {
    // Attempt to kill all workers.  Sadly (at least on the web) there is no
    // way to terminate a worker synchronously, or to be notified when a
    // worker in actually terminated.  This means there is some risk that
    // pthreads will continue to be executing after `worker.terminate` has
    // returned.  For this reason, we don't call `returnWorkerToPool` here or
    // free the underlying pthread data structures.
    for (var worker of PThread.runningWorkers) {
      terminateWorker(worker);
    }
    for (var worker of PThread.unusedWorkers) {
      terminateWorker(worker);
    }
    PThread.unusedWorkers = [];
    PThread.runningWorkers = [];
    PThread.pthreads = {};
  },
  returnWorkerToPool: worker => {
    // We don't want to run main thread queued calls here, since we are doing
    // some operations that leave the worker queue in an invalid state until
    // we are completely done (it would be bad if free() ends up calling a
    // queued pthread_create which looks at the global data structures we are
    // modifying). To achieve that, defer the free() til the very end, when
    // we are all done.
    var pthread_ptr = worker.pthread_ptr;
    delete PThread.pthreads[pthread_ptr];
    // Note: worker is intentionally not terminated so the pool can
    // dynamically grow.
    PThread.unusedWorkers.push(worker);
    PThread.runningWorkers.splice(PThread.runningWorkers.indexOf(worker), 1);
    // Not a running Worker anymore
    // Detach the worker from the pthread object, and return it to the
    // worker pool as an unused worker.
    worker.pthread_ptr = 0;
    // Finally, free the underlying (and now-unused) pthread structure in
    // linear memory.
    __emscripten_thread_free_data(pthread_ptr);
  },
  threadInitTLS() {
    // Call thread init functions (these are the _emscripten_tls_init for each
    // module loaded.
    PThread.tlsInitFunctions.forEach(f => f());
  },
  loadWasmModuleToWorker: worker => new Promise(onFinishedLoading => {
    worker.onmessage = e => {
      var d = e["data"];
      var cmd = d.cmd;
      // If this message is intended to a recipient that is not the main
      // thread, forward it to the target thread.
      if (d.targetThread && d.targetThread != _pthread_self()) {
        var targetWorker = PThread.pthreads[d.targetThread];
        if (targetWorker) {
          targetWorker.postMessage(d, d.transferList);
        } else {
          err(`Internal error! Worker sent a message "${cmd}" to target pthread ${d.targetThread}, but that thread no longer exists!`);
        }
        return;
      }
      if (cmd === "checkMailbox") {
        checkMailbox();
      } else if (cmd === "spawnThread") {
        spawnThread(d);
      } else if (cmd === "cleanupThread") {
        cleanupThread(d.thread);
      } else if (cmd === "loaded") {
        worker.loaded = true;
        // Check that this worker doesn't have an associated pthread.
        if (ENVIRONMENT_IS_NODE && !worker.pthread_ptr) {
          // Once worker is loaded & idle, mark it as weakly referenced,
          // so that mere existence of a Worker in the pool does not prevent
          // Node.js from exiting the app.
          worker.unref();
        }
        onFinishedLoading(worker);
      } else if (cmd === "alert") {
        alert(`Thread ${d.threadId}: ${d.text}`);
      } else if (d.target === "setimmediate") {
        // Worker wants to postMessage() to itself to implement setImmediate()
        // emulation.
        worker.postMessage(d);
      } else if (cmd === "callHandler") {
        Module[d.handler](...d.args);
      } else if (cmd) {
        // The received message looks like something that should be handled by this message
        // handler, (since there is a e.data.cmd field present), but is not one of the
        // recognized commands:
        err(`worker sent an unknown command ${cmd}`);
      }
    };
    worker.onerror = e => {
      var message = "worker sent an error!";
      err(`${message} ${e.filename}:${e.lineno}: ${e.message}`);
      throw e;
    };
    if (ENVIRONMENT_IS_NODE) {
      worker.on("message", data => worker.onmessage({
        data
      }));
      worker.on("error", e => worker.onerror(e));
    }
    // When running on a pthread, none of the incoming parameters on the module
    // object are present. Proxy known handlers back to the main thread if specified.
    var handlers = [];
    var knownHandlers = [];
    for (var handler of knownHandlers) {
      if (Module.propertyIsEnumerable(handler)) {
        handlers.push(handler);
      }
    }
    // Ask the new worker to load up the Emscripten-compiled page. This is a heavy operation.
    worker.postMessage({
      cmd: "load",
      handlers,
      wasmMemory,
      wasmModule
    });
  }),
  loadWasmModuleToAllWorkers(onMaybeReady) {
    // Instantiation is synchronous in pthreads.
    if (ENVIRONMENT_IS_PTHREAD) {
      return onMaybeReady();
    }
    let pthreadPoolReady = Promise.all(PThread.unusedWorkers.map(PThread.loadWasmModuleToWorker));
    pthreadPoolReady.then(onMaybeReady);
  },
  allocateUnusedWorker() {
    var worker;
    // If we're using module output, use bundler-friendly pattern.
    // We need to generate the URL with import.meta.url as the base URL of the JS file
    // instead of just using new URL(import.meta.url) because bundler's only recognize
    // the first case in their bundling step. The latter ends up producing an invalid
    // URL to import from the server (e.g., for webpack the file:// path).
    worker = new Worker(new URL(import.meta.url), {
      "type": "module",
      // This is the way that we signal to the node worker that it is hosting
      // a pthread.
      "workerData": "em-pthread",
      // This is the way that we signal to the Web Worker that it is hosting
      // a pthread.
      "name": "em-pthread"
    });
    PThread.unusedWorkers.push(worker);
  },
  getNewWorker() {
    if (PThread.unusedWorkers.length == 0) {
      // PTHREAD_POOL_SIZE_STRICT should show a warning and, if set to level `2`, return from the function.
      PThread.allocateUnusedWorker();
      PThread.loadWasmModuleToWorker(PThread.unusedWorkers[0]);
    }
    return PThread.unusedWorkers.pop();
  }
};

var establishStackSpace = pthread_ptr => {
  // If memory growth is enabled, the memory views may have gotten out of date,
  // so resync them before accessing the pthread ptr below.
  updateMemoryViews();
  var stackHigh = GROWABLE_HEAP_U32()[(((pthread_ptr) + (52)) >>> 2) >>> 0];
  var stackSize = GROWABLE_HEAP_U32()[(((pthread_ptr) + (56)) >>> 2) >>> 0];
  var stackLow = stackHigh - stackSize;
  // Set stack limits used by `emscripten/stack.h` function.  These limits are
  // cached in wasm-side globals to make checks as fast as possible.
  _emscripten_stack_set_limits(stackHigh, stackLow);
  // Call inside wasm module to set up the stack frame for this pthread in wasm module scope
  stackRestore(stackHigh);
};

/**
     * @param {number} ptr
     * @param {string} type
     */ function getValue(ptr, type = "i8") {
  if (type.endsWith("*")) type = "*";
  switch (type) {
   case "i1":
    return GROWABLE_HEAP_I8()[ptr >>> 0];

   case "i8":
    return GROWABLE_HEAP_I8()[ptr >>> 0];

   case "i16":
    return GROWABLE_HEAP_I16()[((ptr) >>> 1) >>> 0];

   case "i32":
    return GROWABLE_HEAP_I32()[((ptr) >>> 2) >>> 0];

   case "i64":
    return HEAP64[((ptr) >>> 3)];

   case "float":
    return GROWABLE_HEAP_F32()[((ptr) >>> 2) >>> 0];

   case "double":
    return GROWABLE_HEAP_F64()[((ptr) >>> 3) >>> 0];

   case "*":
    return GROWABLE_HEAP_U32()[((ptr) >>> 2) >>> 0];

   default:
    abort(`invalid type for getValue: ${type}`);
  }
}

var invokeEntryPoint = (ptr, arg) => {
  // An old thread on this worker may have been canceled without returning the
  // `runtimeKeepaliveCounter` to zero. Reset it now so the new thread won't
  // be affected.
  runtimeKeepaliveCounter = 0;
  // pthread entry points are always of signature 'void *ThreadMain(void *arg)'
  // Native codebases sometimes spawn threads with other thread entry point
  // signatures, such as void ThreadMain(void *arg), void *ThreadMain(), or
  // void ThreadMain().  That is not acceptable per C/C++ specification, but
  // x86 compiler ABI extensions enable that to work. If you find the
  // following line to crash, either change the signature to "proper" void
  // *ThreadMain(void *arg) form, or try linking with the Emscripten linker
  // flag -sEMULATE_FUNCTION_POINTER_CASTS to add in emulation for this x86
  // ABI extension.
  var result = (a1 => dynCall_ii(ptr, a1))(arg);
  function finish(result) {
    if (keepRuntimeAlive()) {
      EXITSTATUS = result;
    } else {
      __emscripten_thread_exit(result);
    }
  }
  finish(result);
};

var registerTLSInit = tlsInitFunc => PThread.tlsInitFunctions.push(tlsInitFunc);

/**
     * @param {number} ptr
     * @param {number} value
     * @param {string} type
     */ function setValue(ptr, value, type = "i8") {
  if (type.endsWith("*")) type = "*";
  switch (type) {
   case "i1":
    GROWABLE_HEAP_I8()[ptr >>> 0] = value;
    break;

   case "i8":
    GROWABLE_HEAP_I8()[ptr >>> 0] = value;
    break;

   case "i16":
    GROWABLE_HEAP_I16()[((ptr) >>> 1) >>> 0] = value;
    break;

   case "i32":
    GROWABLE_HEAP_I32()[((ptr) >>> 2) >>> 0] = value;
    break;

   case "i64":
    HEAP64[((ptr) >>> 3)] = BigInt(value);
    break;

   case "float":
    GROWABLE_HEAP_F32()[((ptr) >>> 2) >>> 0] = value;
    break;

   case "double":
    GROWABLE_HEAP_F64()[((ptr) >>> 3) >>> 0] = value;
    break;

   case "*":
    GROWABLE_HEAP_U32()[((ptr) >>> 2) >>> 0] = value;
    break;

   default:
    abort(`invalid type for setValue: ${type}`);
  }
}

class ExceptionInfo {
  // excPtr - Thrown object pointer to wrap. Metadata pointer is calculated from it.
  constructor(excPtr) {
    this.excPtr = excPtr;
    this.ptr = excPtr - 24;
  }
  set_type(type) {
    GROWABLE_HEAP_U32()[(((this.ptr) + (4)) >>> 2) >>> 0] = type;
  }
  get_type() {
    return GROWABLE_HEAP_U32()[(((this.ptr) + (4)) >>> 2) >>> 0];
  }
  set_destructor(destructor) {
    GROWABLE_HEAP_U32()[(((this.ptr) + (8)) >>> 2) >>> 0] = destructor;
  }
  get_destructor() {
    return GROWABLE_HEAP_U32()[(((this.ptr) + (8)) >>> 2) >>> 0];
  }
  set_caught(caught) {
    caught = caught ? 1 : 0;
    GROWABLE_HEAP_I8()[(this.ptr) + (12) >>> 0] = caught;
  }
  get_caught() {
    return GROWABLE_HEAP_I8()[(this.ptr) + (12) >>> 0] != 0;
  }
  set_rethrown(rethrown) {
    rethrown = rethrown ? 1 : 0;
    GROWABLE_HEAP_I8()[(this.ptr) + (13) >>> 0] = rethrown;
  }
  get_rethrown() {
    return GROWABLE_HEAP_I8()[(this.ptr) + (13) >>> 0] != 0;
  }
  // Initialize native structure fields. Should be called once after allocated.
  init(type, destructor) {
    this.set_adjusted_ptr(0);
    this.set_type(type);
    this.set_destructor(destructor);
  }
  set_adjusted_ptr(adjustedPtr) {
    GROWABLE_HEAP_U32()[(((this.ptr) + (16)) >>> 2) >>> 0] = adjustedPtr;
  }
  get_adjusted_ptr() {
    return GROWABLE_HEAP_U32()[(((this.ptr) + (16)) >>> 2) >>> 0];
  }
}

var exceptionLast = 0;

var uncaughtExceptionCount = 0;

function ___cxa_throw(ptr, type, destructor) {
  ptr >>>= 0;
  type >>>= 0;
  destructor >>>= 0;
  var info = new ExceptionInfo(ptr);
  // Initialize ExceptionInfo content after it was allocated in __cxa_allocate_exception.
  info.init(type, destructor);
  exceptionLast = ptr;
  uncaughtExceptionCount++;
  throw exceptionLast;
}

function pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(2, 0, 1, pthread_ptr, attr, startRoutine, arg);
  return ___pthread_create_js(pthread_ptr, attr, startRoutine, arg);
}

var _emscripten_has_threading_support = () => typeof SharedArrayBuffer != "undefined";

function ___pthread_create_js(pthread_ptr, attr, startRoutine, arg) {
  pthread_ptr >>>= 0;
  attr >>>= 0;
  startRoutine >>>= 0;
  arg >>>= 0;
  if (!_emscripten_has_threading_support()) {
    return 6;
  }
  // List of JS objects that will transfer ownership to the Worker hosting the thread
  var transferList = [];
  var error = 0;
  // Synchronously proxy the thread creation to main thread if possible. If we
  // need to transfer ownership of objects, then proxy asynchronously via
  // postMessage.
  if (ENVIRONMENT_IS_PTHREAD && (transferList.length === 0 || error)) {
    return pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg);
  }
  // If on the main thread, and accessing Canvas/OffscreenCanvas failed, abort
  // with the detected error.
  if (error) return error;
  var threadParams = {
    startRoutine,
    pthread_ptr,
    arg,
    transferList
  };
  if (ENVIRONMENT_IS_PTHREAD) {
    // The prepopulated pool of web workers that can host pthreads is stored
    // in the main JS thread. Therefore if a pthread is attempting to spawn a
    // new thread, the thread creation must be deferred to the main JS thread.
    threadParams.cmd = "spawnThread";
    postMessage(threadParams, transferList);
    // When we defer thread creation this way, we have no way to detect thread
    // creation synchronously today, so we have to assume success and return 0.
    return 0;
  }
  // We are the main thread, so we have the pthread warmup pool in this
  // thread and can fire off JS thread creation directly ourselves.
  return spawnThread(threadParams);
}

var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder : undefined;

/**
     * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
     * array that contains uint8 values, returns a copy of that string as a
     * Javascript String object.
     * heapOrArray is either a regular array, or a JavaScript typed array view.
     * @param {number=} idx
     * @param {number=} maxBytesToRead
     * @return {string}
     */ var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead = NaN) => {
  idx >>>= 0;
  var endIdx = idx + maxBytesToRead;
  var endPtr = idx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on
  // null terminator by itself.  Also, use the length info to avoid running tiny
  // strings through TextDecoder, since .subarray() allocates garbage.
  // (As a tiny code save trick, compare endPtr against endIdx using a negation,
  // so that undefined/NaN means Infinity)
  while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
  if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
    return UTF8Decoder.decode(heapOrArray.buffer instanceof ArrayBuffer ? heapOrArray.subarray(idx, endPtr) : heapOrArray.slice(idx, endPtr));
  }
  var str = "";
  // If building with TextDecoder, we have already computed the string length
  // above, so test loop end condition against that
  while (idx < endPtr) {
    // For UTF8 byte structure, see:
    // http://en.wikipedia.org/wiki/UTF-8#Description
    // https://www.ietf.org/rfc/rfc2279.txt
    // https://tools.ietf.org/html/rfc3629
    var u0 = heapOrArray[idx++];
    if (!(u0 & 128)) {
      str += String.fromCharCode(u0);
      continue;
    }
    var u1 = heapOrArray[idx++] & 63;
    if ((u0 & 224) == 192) {
      str += String.fromCharCode(((u0 & 31) << 6) | u1);
      continue;
    }
    var u2 = heapOrArray[idx++] & 63;
    if ((u0 & 240) == 224) {
      u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
    } else {
      u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
    }
    if (u0 < 65536) {
      str += String.fromCharCode(u0);
    } else {
      var ch = u0 - 65536;
      str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
    }
  }
  return str;
};

/**
     * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
     * emscripten HEAP, returns a copy of that string as a Javascript String object.
     *
     * @param {number} ptr
     * @param {number=} maxBytesToRead - An optional length that specifies the
     *   maximum number of bytes to read. You can omit this parameter to scan the
     *   string until the first 0 byte. If maxBytesToRead is passed, and the string
     *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
     *   string will cut short at that byte index (i.e. maxBytesToRead will not
     *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
     *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
     *   JS JIT optimizations off, so it is worth to consider consistently using one
     * @return {string}
     */ var UTF8ToString = (ptr, maxBytesToRead) => {
  ptr >>>= 0;
  return ptr ? UTF8ArrayToString(GROWABLE_HEAP_U8(), ptr, maxBytesToRead) : "";
};

var SYSCALLS = {
  varargs: undefined,
  getStr(ptr) {
    var ret = UTF8ToString(ptr);
    return ret;
  }
};

function ___syscall_fcntl64(fd, cmd, varargs) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(3, 0, 1, fd, cmd, varargs);
  varargs >>>= 0;
  SYSCALLS.varargs = varargs;
  return 0;
}

function ___syscall_fstat64(fd, buf) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(4, 0, 1, fd, buf);
  buf >>>= 0;
}

var lengthBytesUTF8 = str => {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
    // unit, not a Unicode code point of the character! So decode
    // UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var c = str.charCodeAt(i);
    // possibly a lead surrogate
    if (c <= 127) {
      len++;
    } else if (c <= 2047) {
      len += 2;
    } else if (c >= 55296 && c <= 57343) {
      len += 4;
      ++i;
    } else {
      len += 3;
    }
  }
  return len;
};

var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
  outIdx >>>= 0;
  // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
  // undefined and false each don't write out any bytes.
  if (!(maxBytesToWrite > 0)) return 0;
  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1;
  // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
    // unit, not a Unicode code point of the character! So decode
    // UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
    // and https://www.ietf.org/rfc/rfc2279.txt
    // and https://tools.ietf.org/html/rfc3629
    var u = str.charCodeAt(i);
    // possibly a lead surrogate
    if (u >= 55296 && u <= 57343) {
      var u1 = str.charCodeAt(++i);
      u = 65536 + ((u & 1023) << 10) | (u1 & 1023);
    }
    if (u <= 127) {
      if (outIdx >= endIdx) break;
      heap[outIdx++ >>> 0] = u;
    } else if (u <= 2047) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++ >>> 0] = 192 | (u >> 6);
      heap[outIdx++ >>> 0] = 128 | (u & 63);
    } else if (u <= 65535) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++ >>> 0] = 224 | (u >> 12);
      heap[outIdx++ >>> 0] = 128 | ((u >> 6) & 63);
      heap[outIdx++ >>> 0] = 128 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      heap[outIdx++ >>> 0] = 240 | (u >> 18);
      heap[outIdx++ >>> 0] = 128 | ((u >> 12) & 63);
      heap[outIdx++ >>> 0] = 128 | ((u >> 6) & 63);
      heap[outIdx++ >>> 0] = 128 | (u & 63);
    }
  }
  // Null-terminate the pointer to the buffer.
  heap[outIdx >>> 0] = 0;
  return outIdx - startIdx;
};

var stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, GROWABLE_HEAP_U8(), outPtr, maxBytesToWrite);

function ___syscall_getcwd(buf, size) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(5, 0, 1, buf, size);
  buf >>>= 0;
  size >>>= 0;
}

function ___syscall_getdents64(fd, dirp, count) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(6, 0, 1, fd, dirp, count);
  dirp >>>= 0;
  count >>>= 0;
}

function ___syscall_ioctl(fd, op, varargs) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(7, 0, 1, fd, op, varargs);
  varargs >>>= 0;
  SYSCALLS.varargs = varargs;
  return 0;
}

function ___syscall_lstat64(path, buf) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(8, 0, 1, path, buf);
  path >>>= 0;
  buf >>>= 0;
}

function ___syscall_mkdirat(dirfd, path, mode) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(9, 0, 1, dirfd, path, mode);
  path >>>= 0;
}

function ___syscall_newfstatat(dirfd, path, buf, flags) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(10, 0, 1, dirfd, path, buf, flags);
  path >>>= 0;
  buf >>>= 0;
}

function ___syscall_openat(dirfd, path, flags, varargs) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(11, 0, 1, dirfd, path, flags, varargs);
  path >>>= 0;
  varargs >>>= 0;
  SYSCALLS.varargs = varargs;
}

function ___syscall_readlinkat(dirfd, path, buf, bufsize) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(12, 0, 1, dirfd, path, buf, bufsize);
  path >>>= 0;
  buf >>>= 0;
  bufsize >>>= 0;
}

function ___syscall_rmdir(path) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(13, 0, 1, path);
  path >>>= 0;
}

function ___syscall_stat64(path, buf) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(14, 0, 1, path, buf);
  path >>>= 0;
  buf >>>= 0;
}

function ___syscall_unlinkat(dirfd, path, flags) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(15, 0, 1, dirfd, path, flags);
  path >>>= 0;
}

var __abort_js = () => abort("");

var embindRepr = v => {
  if (v === null) {
    return "null";
  }
  var t = typeof v;
  if (t === "object" || t === "array" || t === "function") {
    return v.toString();
  } else {
    return "" + v;
  }
};

var embind_init_charCodes = () => {
  var codes = new Array(256);
  for (var i = 0; i < 256; ++i) {
    codes[i] = String.fromCharCode(i);
  }
  embind_charCodes = codes;
};

var embind_charCodes;

var readLatin1String = ptr => {
  var ret = "";
  var c = ptr;
  while (GROWABLE_HEAP_U8()[c >>> 0]) {
    ret += embind_charCodes[GROWABLE_HEAP_U8()[c++ >>> 0]];
  }
  return ret;
};

var awaitingDependencies = {};

var registeredTypes = {};

var typeDependencies = {};

var BindingError;

var throwBindingError = message => {
  throw new BindingError(message);
};

var InternalError;

/** @param {Object=} options */ function sharedRegisterType(rawType, registeredInstance, options = {}) {
  var name = registeredInstance.name;
  if (!rawType) {
    throwBindingError(`type "${name}" must have a positive integer typeid pointer`);
  }
  if (registeredTypes.hasOwnProperty(rawType)) {
    if (options.ignoreDuplicateRegistrations) {
      return;
    } else {
      throwBindingError(`Cannot register type '${name}' twice`);
    }
  }
  registeredTypes[rawType] = registeredInstance;
  delete typeDependencies[rawType];
  if (awaitingDependencies.hasOwnProperty(rawType)) {
    var callbacks = awaitingDependencies[rawType];
    delete awaitingDependencies[rawType];
    callbacks.forEach(cb => cb());
  }
}

/** @param {Object=} options */ function registerType(rawType, registeredInstance, options = {}) {
  return sharedRegisterType(rawType, registeredInstance, options);
}

var integerReadValueFromPointer = (name, width, signed) => {
  // integers are quite common, so generate very specialized functions
  switch (width) {
   case 1:
    return signed ? pointer => GROWABLE_HEAP_I8()[pointer >>> 0] : pointer => GROWABLE_HEAP_U8()[pointer >>> 0];

   case 2:
    return signed ? pointer => GROWABLE_HEAP_I16()[((pointer) >>> 1) >>> 0] : pointer => GROWABLE_HEAP_U16()[((pointer) >>> 1) >>> 0];

   case 4:
    return signed ? pointer => GROWABLE_HEAP_I32()[((pointer) >>> 2) >>> 0] : pointer => GROWABLE_HEAP_U32()[((pointer) >>> 2) >>> 0];

   case 8:
    return signed ? pointer => HEAP64[((pointer) >>> 3)] : pointer => HEAPU64[((pointer) >>> 3)];

   default:
    throw new TypeError(`invalid integer width (${width}): ${name}`);
  }
};

/** @suppress {globalThis} */ function __embind_register_bigint(primitiveType, name, size, minRange, maxRange) {
  primitiveType >>>= 0;
  name >>>= 0;
  size >>>= 0;
  name = readLatin1String(name);
  var isUnsignedType = (name.indexOf("u") != -1);
  // maxRange comes through as -1 for uint64_t (see issue 13902). Work around that temporarily
  if (isUnsignedType) {
    maxRange = (1n << 64n) - 1n;
  }
  registerType(primitiveType, {
    name,
    "fromWireType": value => value,
    "toWireType": function(destructors, value) {
      if (typeof value != "bigint" && typeof value != "number") {
        throw new TypeError(`Cannot convert "${embindRepr(value)}" to ${this.name}`);
      }
      if (typeof value == "number") {
        value = BigInt(value);
      }
      return value;
    },
    argPackAdvance: GenericWireTypeSize,
    "readValueFromPointer": integerReadValueFromPointer(name, size, !isUnsignedType),
    destructorFunction: null
  });
}

var GenericWireTypeSize = 8;

/** @suppress {globalThis} */ function __embind_register_bool(rawType, name, trueValue, falseValue) {
  rawType >>>= 0;
  name >>>= 0;
  name = readLatin1String(name);
  registerType(rawType, {
    name,
    "fromWireType": function(wt) {
      // ambiguous emscripten ABI: sometimes return values are
      // true or false, and sometimes integers (0 or 1)
      return !!wt;
    },
    "toWireType": function(destructors, o) {
      return o ? trueValue : falseValue;
    },
    argPackAdvance: GenericWireTypeSize,
    "readValueFromPointer": function(pointer) {
      return this["fromWireType"](GROWABLE_HEAP_U8()[pointer >>> 0]);
    },
    destructorFunction: null
  });
}

var emval_freelist = [];

var emval_handles = [];

function __emval_decref(handle) {
  handle >>>= 0;
  if (handle > 9 && 0 === --emval_handles[handle + 1]) {
    emval_handles[handle] = undefined;
    emval_freelist.push(handle);
  }
}

var count_emval_handles = () => emval_handles.length / 2 - 5 - emval_freelist.length;

var init_emval = () => {
  // reserve 0 and some special values. These never get de-allocated.
  emval_handles.push(0, 1, undefined, 1, null, 1, true, 1, false, 1);
  Module["count_emval_handles"] = count_emval_handles;
};

var Emval = {
  toValue: handle => {
    if (!handle) {
      throwBindingError("Cannot use deleted val. handle = " + handle);
    }
    return emval_handles[handle];
  },
  toHandle: value => {
    switch (value) {
     case undefined:
      return 2;

     case null:
      return 4;

     case true:
      return 6;

     case false:
      return 8;

     default:
      {
        const handle = emval_freelist.pop() || emval_handles.length;
        emval_handles[handle] = value;
        emval_handles[handle + 1] = 1;
        return handle;
      }
    }
  }
};

/** @suppress {globalThis} */ function readPointer(pointer) {
  return this["fromWireType"](GROWABLE_HEAP_U32()[((pointer) >>> 2) >>> 0]);
}

var EmValType = {
  name: "emscripten::val",
  "fromWireType": handle => {
    var rv = Emval.toValue(handle);
    __emval_decref(handle);
    return rv;
  },
  "toWireType": (destructors, value) => Emval.toHandle(value),
  argPackAdvance: GenericWireTypeSize,
  "readValueFromPointer": readPointer,
  destructorFunction: null
};

function __embind_register_emval(rawType) {
  rawType >>>= 0;
  return registerType(rawType, EmValType);
}

var floatReadValueFromPointer = (name, width) => {
  switch (width) {
   case 4:
    return function(pointer) {
      return this["fromWireType"](GROWABLE_HEAP_F32()[((pointer) >>> 2) >>> 0]);
    };

   case 8:
    return function(pointer) {
      return this["fromWireType"](GROWABLE_HEAP_F64()[((pointer) >>> 3) >>> 0]);
    };

   default:
    throw new TypeError(`invalid float width (${width}): ${name}`);
  }
};

var __embind_register_float = function(rawType, name, size) {
  rawType >>>= 0;
  name >>>= 0;
  size >>>= 0;
  name = readLatin1String(name);
  registerType(rawType, {
    name,
    "fromWireType": value => value,
    "toWireType": (destructors, value) => value,
    argPackAdvance: GenericWireTypeSize,
    "readValueFromPointer": floatReadValueFromPointer(name, size),
    destructorFunction: null
  });
};

/** @suppress {globalThis} */ function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
  primitiveType >>>= 0;
  name >>>= 0;
  size >>>= 0;
  name = readLatin1String(name);
  // LLVM doesn't have signed and unsigned 32-bit types, so u32 literals come
  // out as 'i32 -1'. Always treat those as max u32.
  if (maxRange === -1) {
    maxRange = 4294967295;
  }
  var fromWireType = value => value;
  if (minRange === 0) {
    var bitshift = 32 - 8 * size;
    fromWireType = value => (value << bitshift) >>> bitshift;
  }
  var isUnsignedType = (name.includes("unsigned"));
  var checkAssertions = (value, toTypeName) => {};
  var toWireType;
  if (isUnsignedType) {
    toWireType = function(destructors, value) {
      checkAssertions(value, this.name);
      return value >>> 0;
    };
  } else {
    toWireType = function(destructors, value) {
      checkAssertions(value, this.name);
      // The VM will perform JS to Wasm value conversion, according to the spec:
      // https://www.w3.org/TR/wasm-js-api-1/#towebassemblyvalue
      return value;
    };
  }
  registerType(primitiveType, {
    name,
    "fromWireType": fromWireType,
    "toWireType": toWireType,
    argPackAdvance: GenericWireTypeSize,
    "readValueFromPointer": integerReadValueFromPointer(name, size, minRange !== 0),
    destructorFunction: null
  });
}

function __embind_register_memory_view(rawType, dataTypeIndex, name) {
  rawType >>>= 0;
  name >>>= 0;
  var typeMapping = [ Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, BigInt64Array, BigUint64Array ];
  var TA = typeMapping[dataTypeIndex];
  function decodeMemoryView(handle) {
    var size = GROWABLE_HEAP_U32()[((handle) >>> 2) >>> 0];
    var data = GROWABLE_HEAP_U32()[(((handle) + (4)) >>> 2) >>> 0];
    return new TA(GROWABLE_HEAP_I8().buffer, data, size);
  }
  name = readLatin1String(name);
  registerType(rawType, {
    name,
    "fromWireType": decodeMemoryView,
    argPackAdvance: GenericWireTypeSize,
    "readValueFromPointer": decodeMemoryView
  }, {
    ignoreDuplicateRegistrations: true
  });
}

function __embind_register_std_string(rawType, name) {
  rawType >>>= 0;
  name >>>= 0;
  name = readLatin1String(name);
  var stdStringIsUTF8 = true;
  registerType(rawType, {
    name,
    // For some method names we use string keys here since they are part of
    // the public/external API and/or used by the runtime-generated code.
    "fromWireType"(value) {
      var length = GROWABLE_HEAP_U32()[((value) >>> 2) >>> 0];
      var payload = value + 4;
      var str;
      if (stdStringIsUTF8) {
        var decodeStartPtr = payload;
        // Looping here to support possible embedded '0' bytes
        for (var i = 0; i <= length; ++i) {
          var currentBytePtr = payload + i;
          if (i == length || GROWABLE_HEAP_U8()[currentBytePtr >>> 0] == 0) {
            var maxRead = currentBytePtr - decodeStartPtr;
            var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
            if (str === undefined) {
              str = stringSegment;
            } else {
              str += String.fromCharCode(0);
              str += stringSegment;
            }
            decodeStartPtr = currentBytePtr + 1;
          }
        }
      } else {
        var a = new Array(length);
        for (var i = 0; i < length; ++i) {
          a[i] = String.fromCharCode(GROWABLE_HEAP_U8()[payload + i >>> 0]);
        }
        str = a.join("");
      }
      _free(value);
      return str;
    },
    "toWireType"(destructors, value) {
      if (value instanceof ArrayBuffer) {
        value = new Uint8Array(value);
      }
      var length;
      var valueIsOfTypeString = (typeof value == "string");
      if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
        throwBindingError("Cannot pass non-string to std::string");
      }
      if (stdStringIsUTF8 && valueIsOfTypeString) {
        length = lengthBytesUTF8(value);
      } else {
        length = value.length;
      }
      // assumes POINTER_SIZE alignment
      var base = _malloc(4 + length + 1);
      var ptr = base + 4;
      GROWABLE_HEAP_U32()[((base) >>> 2) >>> 0] = length;
      if (stdStringIsUTF8 && valueIsOfTypeString) {
        stringToUTF8(value, ptr, length + 1);
      } else {
        if (valueIsOfTypeString) {
          for (var i = 0; i < length; ++i) {
            var charCode = value.charCodeAt(i);
            if (charCode > 255) {
              _free(base);
              throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
            }
            GROWABLE_HEAP_U8()[ptr + i >>> 0] = charCode;
          }
        } else {
          for (var i = 0; i < length; ++i) {
            GROWABLE_HEAP_U8()[ptr + i >>> 0] = value[i];
          }
        }
      }
      if (destructors !== null) {
        destructors.push(_free, base);
      }
      return base;
    },
    argPackAdvance: GenericWireTypeSize,
    "readValueFromPointer": readPointer,
    destructorFunction(ptr) {
      _free(ptr);
    }
  });
}

var UTF16Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf-16le") : undefined;

var UTF16ToString = (ptr, maxBytesToRead) => {
  var endPtr = ptr;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on
  // null terminator by itself.
  // Also, use the length info to avoid running tiny strings through
  // TextDecoder, since .subarray() allocates garbage.
  var idx = endPtr >> 1;
  var maxIdx = idx + maxBytesToRead / 2;
  // If maxBytesToRead is not passed explicitly, it will be undefined, and this
  // will always evaluate to true. This saves on code size.
  while (!(idx >= maxIdx) && GROWABLE_HEAP_U16()[idx >>> 0]) ++idx;
  endPtr = idx << 1;
  if (endPtr - ptr > 32 && UTF16Decoder) return UTF16Decoder.decode(GROWABLE_HEAP_U8().slice(ptr, endPtr));
  // Fallback: decode without UTF16Decoder
  var str = "";
  // If maxBytesToRead is not passed explicitly, it will be undefined, and the
  // for-loop's condition will always evaluate to true. The loop is then
  // terminated on the first null char.
  for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
    var codeUnit = GROWABLE_HEAP_I16()[(((ptr) + (i * 2)) >>> 1) >>> 0];
    if (codeUnit == 0) break;
    // fromCharCode constructs a character from a UTF-16 code unit, so we can
    // pass the UTF16 string right through.
    str += String.fromCharCode(codeUnit);
  }
  return str;
};

var stringToUTF16 = (str, outPtr, maxBytesToWrite) => {
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  maxBytesToWrite ??= 2147483647;
  if (maxBytesToWrite < 2) return 0;
  maxBytesToWrite -= 2;
  // Null terminator.
  var startPtr = outPtr;
  var numCharsToWrite = (maxBytesToWrite < str.length * 2) ? (maxBytesToWrite / 2) : str.length;
  for (var i = 0; i < numCharsToWrite; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i);
    // possibly a lead surrogate
    GROWABLE_HEAP_I16()[((outPtr) >>> 1) >>> 0] = codeUnit;
    outPtr += 2;
  }
  // Null-terminate the pointer to the HEAP.
  GROWABLE_HEAP_I16()[((outPtr) >>> 1) >>> 0] = 0;
  return outPtr - startPtr;
};

var lengthBytesUTF16 = str => str.length * 2;

var UTF32ToString = (ptr, maxBytesToRead) => {
  var i = 0;
  var str = "";
  // If maxBytesToRead is not passed explicitly, it will be undefined, and this
  // will always evaluate to true. This saves on code size.
  while (!(i >= maxBytesToRead / 4)) {
    var utf32 = GROWABLE_HEAP_I32()[(((ptr) + (i * 4)) >>> 2) >>> 0];
    if (utf32 == 0) break;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    if (utf32 >= 65536) {
      var ch = utf32 - 65536;
      str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
  return str;
};

var stringToUTF32 = (str, outPtr, maxBytesToWrite) => {
  outPtr >>>= 0;
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  maxBytesToWrite ??= 2147483647;
  if (maxBytesToWrite < 4) return 0;
  var startPtr = outPtr;
  var endPtr = startPtr + maxBytesToWrite - 4;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i);
    // possibly a lead surrogate
    if (codeUnit >= 55296 && codeUnit <= 57343) {
      var trailSurrogate = str.charCodeAt(++i);
      codeUnit = 65536 + ((codeUnit & 1023) << 10) | (trailSurrogate & 1023);
    }
    GROWABLE_HEAP_I32()[((outPtr) >>> 2) >>> 0] = codeUnit;
    outPtr += 4;
    if (outPtr + 4 > endPtr) break;
  }
  // Null-terminate the pointer to the HEAP.
  GROWABLE_HEAP_I32()[((outPtr) >>> 2) >>> 0] = 0;
  return outPtr - startPtr;
};

var lengthBytesUTF32 = str => {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i);
    if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
    // possibly a lead surrogate, so skip over the tail surrogate.
    len += 4;
  }
  return len;
};

var __embind_register_std_wstring = function(rawType, charSize, name) {
  rawType >>>= 0;
  charSize >>>= 0;
  name >>>= 0;
  name = readLatin1String(name);
  var decodeString, encodeString, readCharAt, lengthBytesUTF;
  if (charSize === 2) {
    decodeString = UTF16ToString;
    encodeString = stringToUTF16;
    lengthBytesUTF = lengthBytesUTF16;
    readCharAt = pointer => GROWABLE_HEAP_U16()[((pointer) >>> 1) >>> 0];
  } else if (charSize === 4) {
    decodeString = UTF32ToString;
    encodeString = stringToUTF32;
    lengthBytesUTF = lengthBytesUTF32;
    readCharAt = pointer => GROWABLE_HEAP_U32()[((pointer) >>> 2) >>> 0];
  }
  registerType(rawType, {
    name,
    "fromWireType": value => {
      // Code mostly taken from _embind_register_std_string fromWireType
      var length = GROWABLE_HEAP_U32()[((value) >>> 2) >>> 0];
      var str;
      var decodeStartPtr = value + 4;
      // Looping here to support possible embedded '0' bytes
      for (var i = 0; i <= length; ++i) {
        var currentBytePtr = value + 4 + i * charSize;
        if (i == length || readCharAt(currentBytePtr) == 0) {
          var maxReadBytes = currentBytePtr - decodeStartPtr;
          var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
          if (str === undefined) {
            str = stringSegment;
          } else {
            str += String.fromCharCode(0);
            str += stringSegment;
          }
          decodeStartPtr = currentBytePtr + charSize;
        }
      }
      _free(value);
      return str;
    },
    "toWireType": (destructors, value) => {
      if (!(typeof value == "string")) {
        throwBindingError(`Cannot pass non-string to C++ string type ${name}`);
      }
      // assumes POINTER_SIZE alignment
      var length = lengthBytesUTF(value);
      var ptr = _malloc(4 + length + charSize);
      GROWABLE_HEAP_U32()[((ptr) >>> 2) >>> 0] = length / charSize;
      encodeString(value, ptr + 4, length + charSize);
      if (destructors !== null) {
        destructors.push(_free, ptr);
      }
      return ptr;
    },
    argPackAdvance: GenericWireTypeSize,
    "readValueFromPointer": readPointer,
    destructorFunction(ptr) {
      _free(ptr);
    }
  });
};

var __embind_register_void = function(rawType, name) {
  rawType >>>= 0;
  name >>>= 0;
  name = readLatin1String(name);
  registerType(rawType, {
    isVoid: true,
    // void return values can be optimized out sometimes
    name,
    argPackAdvance: 0,
    "fromWireType": () => undefined,
    // TODO: assert if anything else is given?
    "toWireType": (destructors, o) => undefined
  });
};

function __emscripten_init_main_thread_js(tb) {
  tb >>>= 0;
  // Pass the thread address to the native code where they stored in wasm
  // globals which act as a form of TLS. Global constructors trying
  // to access this value will read the wrong value, but that is UB anyway.
  __emscripten_thread_init(tb, /*is_main=*/ !ENVIRONMENT_IS_WORKER, /*is_runtime=*/ 1, /*can_block=*/ !ENVIRONMENT_IS_WEB, /*default_stacksize=*/ 131072, /*start_profiling=*/ false);
  PThread.threadInitTLS();
}

var maybeExit = () => {
  if (!keepRuntimeAlive()) {
    try {
      if (ENVIRONMENT_IS_PTHREAD) __emscripten_thread_exit(EXITSTATUS); else _exit(EXITSTATUS);
    } catch (e) {
      handleException(e);
    }
  }
};

var callUserCallback = func => {
  if (ABORT) {
    return;
  }
  try {
    func();
    maybeExit();
  } catch (e) {
    handleException(e);
  }
};

function __emscripten_thread_mailbox_await(pthread_ptr) {
  pthread_ptr >>>= 0;
  if (typeof Atomics.waitAsync === "function") {
    // Wait on the pthread's initial self-pointer field because it is easy and
    // safe to access from sending threads that need to notify the waiting
    // thread.
    // TODO: How to make this work with wasm64?
    var wait = Atomics.waitAsync(GROWABLE_HEAP_I32(), ((pthread_ptr) >>> 2), pthread_ptr);
    wait.value.then(checkMailbox);
    var waitingAsync = pthread_ptr + 128;
    Atomics.store(GROWABLE_HEAP_I32(), ((waitingAsync) >>> 2), 1);
  }
}

var checkMailbox = () => {
  // Only check the mailbox if we have a live pthread runtime. We implement
  // pthread_self to return 0 if there is no live runtime.
  var pthread_ptr = _pthread_self();
  if (pthread_ptr) {
    // If we are using Atomics.waitAsync as our notification mechanism, wait
    // for a notification before processing the mailbox to avoid missing any
    // work that could otherwise arrive after we've finished processing the
    // mailbox and before we're ready for the next notification.
    __emscripten_thread_mailbox_await(pthread_ptr);
    callUserCallback(__emscripten_check_mailbox);
  }
};

function __emscripten_notify_mailbox_postmessage(targetThread, currThreadId) {
  targetThread >>>= 0;
  currThreadId >>>= 0;
  if (targetThread == currThreadId) {
    setTimeout(checkMailbox);
  } else if (ENVIRONMENT_IS_PTHREAD) {
    postMessage({
      targetThread,
      cmd: "checkMailbox"
    });
  } else {
    var worker = PThread.pthreads[targetThread];
    if (!worker) {
      return;
    }
    worker.postMessage({
      cmd: "checkMailbox"
    });
  }
}

var proxiedJSCallArgs = [];

function __emscripten_receive_on_main_thread_js(funcIndex, emAsmAddr, callingThread, numCallArgs, args) {
  emAsmAddr >>>= 0;
  callingThread >>>= 0;
  args >>>= 0;
  // Sometimes we need to backproxy events to the calling thread (e.g.
  // HTML5 DOM events handlers such as
  // emscripten_set_mousemove_callback()), so keep track in a globally
  // accessible variable about the thread that initiated the proxying.
  numCallArgs /= 2;
  proxiedJSCallArgs.length = numCallArgs;
  var b = ((args) >>> 3);
  for (var i = 0; i < numCallArgs; i++) {
    if (HEAP64[b + 2 * i]) {
      // It's a BigInt.
      proxiedJSCallArgs[i] = HEAP64[b + 2 * i + 1];
    } else {
      // It's a Number.
      proxiedJSCallArgs[i] = GROWABLE_HEAP_F64()[b + 2 * i + 1 >>> 0];
    }
  }
  // Proxied JS library funcs use funcIndex and EM_ASM functions use emAsmAddr
  var func = emAsmAddr ? ASM_CONSTS[emAsmAddr] : proxiedFunctionTable[funcIndex];
  PThread.currentProxiedOperationCallerThread = callingThread;
  var rtn = func(...proxiedJSCallArgs);
  PThread.currentProxiedOperationCallerThread = 0;
  return rtn;
}

var __emscripten_runtime_keepalive_clear = () => {
  runtimeKeepaliveCounter = 0;
};

function __emscripten_thread_cleanup(thread) {
  thread >>>= 0;
  // Called when a thread needs to be cleaned up so it can be reused.
  // A thread is considered reusable when it either returns from its
  // entry point, calls pthread_exit, or acts upon a cancellation.
  // Detached threads are responsible for calling this themselves,
  // otherwise pthread_join is responsible for calling this.
  if (!ENVIRONMENT_IS_PTHREAD) cleanupThread(thread); else postMessage({
    cmd: "cleanupThread",
    thread
  });
}

function __emscripten_thread_set_strongref(thread) {
  thread >>>= 0;
  // Called when a thread needs to be strongly referenced.
  // Currently only used for:
  // - keeping the "main" thread alive in PROXY_TO_PTHREAD mode;
  // - crashed threads that needs to propagate the uncaught exception
  //   back to the main thread.
  if (ENVIRONMENT_IS_NODE) {
    PThread.pthreads[thread].ref();
  }
}

var getTypeName = type => {
  var ptr = ___getTypeName(type);
  var rv = readLatin1String(ptr);
  _free(ptr);
  return rv;
};

var requireRegisteredType = (rawType, humanName) => {
  var impl = registeredTypes[rawType];
  if (undefined === impl) {
    throwBindingError(`${humanName} has unknown type ${getTypeName(rawType)}`);
  }
  return impl;
};

var emval_returnValue = (returnType, destructorsRef, handle) => {
  var destructors = [];
  var result = returnType["toWireType"](destructors, handle);
  if (destructors.length) {
    // void, primitives and any other types w/o destructors don't need to allocate a handle
    GROWABLE_HEAP_U32()[((destructorsRef) >>> 2) >>> 0] = Emval.toHandle(destructors);
  }
  return result;
};

function __emval_as(handle, returnType, destructorsRef) {
  handle >>>= 0;
  returnType >>>= 0;
  destructorsRef >>>= 0;
  handle = Emval.toValue(handle);
  returnType = requireRegisteredType(returnType, "emval::as");
  return emval_returnValue(returnType, destructorsRef, handle);
}

function __emval_as_int64(handle, returnType) {
  handle >>>= 0;
  returnType >>>= 0;
  handle = Emval.toValue(handle);
  returnType = requireRegisteredType(returnType, "emval::as");
  return returnType["toWireType"](null, handle);
}

var runAndAbortIfError = func => {
  try {
    return func();
  } catch (e) {
    abort(e);
  }
};

var runtimeKeepalivePush = () => {
  runtimeKeepaliveCounter += 1;
};

var runtimeKeepalivePop = () => {
  runtimeKeepaliveCounter -= 1;
};

var Asyncify = {
  instrumentWasmImports(imports) {
    var importPattern = /^(invoke_.*|__asyncjs__.*)$/;
    for (let [x, original] of Object.entries(imports)) {
      if (typeof original == "function") {
        let isAsyncifyImport = original.isAsync || importPattern.test(x);
      }
    }
  },
  instrumentWasmExports(exports) {
    var ret = {};
    for (let [x, original] of Object.entries(exports)) {
      if (typeof original == "function") {
        ret[x] = (...args) => {
          Asyncify.exportCallStack.push(x);
          try {
            return original(...args);
          } finally {
            if (!ABORT) {
              var y = Asyncify.exportCallStack.pop();
              Asyncify.maybeStopUnwind();
            }
          }
        };
      } else {
        ret[x] = original;
      }
    }
    return ret;
  },
  State: {
    Normal: 0,
    Unwinding: 1,
    Rewinding: 2,
    Disabled: 3
  },
  state: 0,
  StackSize: 65536,
  currData: null,
  handleSleepReturnValue: 0,
  exportCallStack: [],
  callStackNameToId: {},
  callStackIdToName: {},
  callStackId: 0,
  asyncPromiseHandlers: null,
  sleepCallbacks: [],
  getCallStackId(funcName) {
    var id = Asyncify.callStackNameToId[funcName];
    if (id === undefined) {
      id = Asyncify.callStackId++;
      Asyncify.callStackNameToId[funcName] = id;
      Asyncify.callStackIdToName[id] = funcName;
    }
    return id;
  },
  maybeStopUnwind() {
    if (Asyncify.currData && Asyncify.state === Asyncify.State.Unwinding && Asyncify.exportCallStack.length === 0) {
      // We just finished unwinding.
      // Be sure to set the state before calling any other functions to avoid
      // possible infinite recursion here (For example in debug pthread builds
      // the dbg() function itself can call back into WebAssembly to get the
      // current pthread_self() pointer).
      Asyncify.state = Asyncify.State.Normal;
      runtimeKeepalivePush();
      // Keep the runtime alive so that a re-wind can be done later.
      runAndAbortIfError(_asyncify_stop_unwind);
      if (typeof Fibers != "undefined") {
        Fibers.trampoline();
      }
    }
  },
  whenDone() {
    return new Promise((resolve, reject) => {
      Asyncify.asyncPromiseHandlers = {
        resolve,
        reject
      };
    });
  },
  allocateData() {
    // An asyncify data structure has three fields:
    //  0  current stack pos
    //  4  max stack pos
    //  8  id of function at bottom of the call stack (callStackIdToName[id] == name of js function)
    // The Asyncify ABI only interprets the first two fields, the rest is for the runtime.
    // We also embed a stack in the same memory region here, right next to the structure.
    // This struct is also defined as asyncify_data_t in emscripten/fiber.h
    var ptr = _malloc(12 + Asyncify.StackSize);
    Asyncify.setDataHeader(ptr, ptr + 12, Asyncify.StackSize);
    Asyncify.setDataRewindFunc(ptr);
    return ptr;
  },
  setDataHeader(ptr, stack, stackSize) {
    GROWABLE_HEAP_U32()[((ptr) >>> 2) >>> 0] = stack;
    GROWABLE_HEAP_U32()[(((ptr) + (4)) >>> 2) >>> 0] = stack + stackSize;
  },
  setDataRewindFunc(ptr) {
    var bottomOfCallStack = Asyncify.exportCallStack[0];
    var rewindId = Asyncify.getCallStackId(bottomOfCallStack);
    GROWABLE_HEAP_I32()[(((ptr) + (8)) >>> 2) >>> 0] = rewindId;
  },
  getDataRewindFuncName(ptr) {
    var id = GROWABLE_HEAP_I32()[(((ptr) + (8)) >>> 2) >>> 0];
    var name = Asyncify.callStackIdToName[id];
    return name;
  },
  getDataRewindFunc(name) {
    var func = wasmExports[name];
    return func;
  },
  doRewind(ptr) {
    var name = Asyncify.getDataRewindFuncName(ptr);
    var func = Asyncify.getDataRewindFunc(name);
    // Once we have rewound and the stack we no longer need to artificially
    // keep the runtime alive.
    runtimeKeepalivePop();
    return func();
  },
  handleSleep(startAsync) {
    if (ABORT) return;
    if (Asyncify.state === Asyncify.State.Normal) {
      // Prepare to sleep. Call startAsync, and see what happens:
      // if the code decided to call our callback synchronously,
      // then no async operation was in fact begun, and we don't
      // need to do anything.
      var reachedCallback = false;
      var reachedAfterCallback = false;
      startAsync((handleSleepReturnValue = 0) => {
        if (ABORT) return;
        Asyncify.handleSleepReturnValue = handleSleepReturnValue;
        reachedCallback = true;
        if (!reachedAfterCallback) {
          // We are happening synchronously, so no need for async.
          return;
        }
        Asyncify.state = Asyncify.State.Rewinding;
        runAndAbortIfError(() => _asyncify_start_rewind(Asyncify.currData));
        if (typeof MainLoop != "undefined" && MainLoop.func) {
          MainLoop.resume();
        }
        var asyncWasmReturnValue, isError = false;
        try {
          asyncWasmReturnValue = Asyncify.doRewind(Asyncify.currData);
        } catch (err) {
          asyncWasmReturnValue = err;
          isError = true;
        }
        // Track whether the return value was handled by any promise handlers.
        var handled = false;
        if (!Asyncify.currData) {
          // All asynchronous execution has finished.
          // `asyncWasmReturnValue` now contains the final
          // return value of the exported async WASM function.
          // Note: `asyncWasmReturnValue` is distinct from
          // `Asyncify.handleSleepReturnValue`.
          // `Asyncify.handleSleepReturnValue` contains the return
          // value of the last C function to have executed
          // `Asyncify.handleSleep()`, where as `asyncWasmReturnValue`
          // contains the return value of the exported WASM function
          // that may have called C functions that
          // call `Asyncify.handleSleep()`.
          var asyncPromiseHandlers = Asyncify.asyncPromiseHandlers;
          if (asyncPromiseHandlers) {
            Asyncify.asyncPromiseHandlers = null;
            (isError ? asyncPromiseHandlers.reject : asyncPromiseHandlers.resolve)(asyncWasmReturnValue);
            handled = true;
          }
        }
        if (isError && !handled) {
          // If there was an error and it was not handled by now, we have no choice but to
          // rethrow that error into the global scope where it can be caught only by
          // `onerror` or `onunhandledpromiserejection`.
          throw asyncWasmReturnValue;
        }
      });
      reachedAfterCallback = true;
      if (!reachedCallback) {
        // A true async operation was begun; start a sleep.
        Asyncify.state = Asyncify.State.Unwinding;
        // TODO: reuse, don't alloc/free every sleep
        Asyncify.currData = Asyncify.allocateData();
        if (typeof MainLoop != "undefined" && MainLoop.func) {
          MainLoop.pause();
        }
        runAndAbortIfError(() => _asyncify_start_unwind(Asyncify.currData));
      }
    } else if (Asyncify.state === Asyncify.State.Rewinding) {
      // Stop a resume.
      Asyncify.state = Asyncify.State.Normal;
      runAndAbortIfError(_asyncify_stop_rewind);
      _free(Asyncify.currData);
      Asyncify.currData = null;
      // Call all sleep callbacks now that the sleep-resume is all done.
      Asyncify.sleepCallbacks.forEach(callUserCallback);
    } else {
      abort(`invalid state: ${Asyncify.state}`);
    }
    return Asyncify.handleSleepReturnValue;
  },
  handleAsync(startAsync) {
    return Asyncify.handleSleep(wakeUp => {
      // TODO: add error handling as a second param when handleSleep implements it.
      startAsync().then(wakeUp);
    });
  }
};

var __emval_await = function(promise) {
  promise >>>= 0;
  return Asyncify.handleAsync(async () => {
    var value = await Emval.toValue(promise);
    return Emval.toHandle(value);
  });
};

__emval_await.isAsync = true;

var emval_methodCallers = [];

function __emval_call(caller, handle, destructorsRef, args) {
  caller >>>= 0;
  handle >>>= 0;
  destructorsRef >>>= 0;
  args >>>= 0;
  caller = emval_methodCallers[caller];
  handle = Emval.toValue(handle);
  return caller(null, handle, destructorsRef, args);
}

var emval_symbols = {};

var getStringOrSymbol = address => {
  var symbol = emval_symbols[address];
  if (symbol === undefined) {
    return readLatin1String(address);
  }
  return symbol;
};

function __emval_call_method(caller, objHandle, methodName, destructorsRef, args) {
  caller >>>= 0;
  objHandle >>>= 0;
  methodName >>>= 0;
  destructorsRef >>>= 0;
  args >>>= 0;
  caller = emval_methodCallers[caller];
  objHandle = Emval.toValue(objHandle);
  methodName = getStringOrSymbol(methodName);
  return caller(objHandle, objHandle[methodName], destructorsRef, args);
}

function __emval_equals(first, second) {
  first >>>= 0;
  second >>>= 0;
  first = Emval.toValue(first);
  second = Emval.toValue(second);
  return first == second;
}

var emval_get_global = () => {
  if (typeof globalThis == "object") {
    return globalThis;
  }
  return (function() {
    return Function;
  })()("return this")();
};

function __emval_get_global(name) {
  name >>>= 0;
  if (name === 0) {
    return Emval.toHandle(emval_get_global());
  } else {
    name = getStringOrSymbol(name);
    return Emval.toHandle(emval_get_global()[name]);
  }
}

var emval_addMethodCaller = caller => {
  var id = emval_methodCallers.length;
  emval_methodCallers.push(caller);
  return id;
};

var emval_lookupTypes = (argCount, argTypes) => {
  var a = new Array(argCount);
  for (var i = 0; i < argCount; ++i) {
    a[i] = requireRegisteredType(GROWABLE_HEAP_U32()[(((argTypes) + (i * 4)) >>> 2) >>> 0], "parameter " + i);
  }
  return a;
};

var createNamedFunction = (name, func) => Object.defineProperty(func, "name", {
  value: name
});

var reflectConstruct = Reflect.construct;

function newFunc(constructor, argumentList) {
  if (!(constructor instanceof Function)) {
    throw new TypeError(`new_ called with constructor type ${typeof (constructor)} which is not a function`);
  }
  /*
       * Previously, the following line was just:
       *   function dummy() {};
       * Unfortunately, Chrome was preserving 'dummy' as the object's name, even
       * though at creation, the 'dummy' has the correct constructor name.  Thus,
       * objects created with IMVU.new would show up in the debugger as 'dummy',
       * which isn't very helpful.  Using IMVU.createNamedFunction addresses the
       * issue.  Doubly-unfortunately, there's no way to write a test for this
       * behavior.  -NRD 2013.02.22
       */ var dummy = createNamedFunction(constructor.name || "unknownFunctionName", function() {});
  dummy.prototype = constructor.prototype;
  var obj = new dummy;
  var r = constructor.apply(obj, argumentList);
  return (r instanceof Object) ? r : obj;
}

function __emval_get_method_caller(argCount, argTypes, kind) {
  argTypes >>>= 0;
  var types = emval_lookupTypes(argCount, argTypes);
  var retType = types.shift();
  argCount--;
  // remove the shifted off return type
  var functionBody = `return function (obj, func, destructorsRef, args) {\n`;
  var offset = 0;
  var argsList = [];
  // 'obj?, arg0, arg1, arg2, ... , argN'
  if (kind === /* FUNCTION */ 0) {
    argsList.push("obj");
  }
  var params = [ "retType" ];
  var args = [ retType ];
  for (var i = 0; i < argCount; ++i) {
    argsList.push("arg" + i);
    params.push("argType" + i);
    args.push(types[i]);
    functionBody += `  var arg${i} = argType${i}.readValueFromPointer(args${offset ? "+" + offset : ""});\n`;
    offset += types[i].argPackAdvance;
  }
  var invoker = kind === /* CONSTRUCTOR */ 1 ? "new func" : "func.call";
  functionBody += `  var rv = ${invoker}(${argsList.join(", ")});\n`;
  if (!retType.isVoid) {
    params.push("emval_returnValue");
    args.push(emval_returnValue);
    functionBody += "  return emval_returnValue(retType, destructorsRef, rv);\n";
  }
  functionBody += "};\n";
  params.push(functionBody);
  var invokerFunction = newFunc(Function, params)(...args);
  var functionName = `methodCaller<(${types.map(t => t.name).join(", ")}) => ${retType.name}>`;
  return emval_addMethodCaller(createNamedFunction(functionName, invokerFunction));
}

function __emval_get_module_property(name) {
  name >>>= 0;
  name = getStringOrSymbol(name);
  return Emval.toHandle(Module[name]);
}

function __emval_get_property(handle, key) {
  handle >>>= 0;
  key >>>= 0;
  handle = Emval.toValue(handle);
  key = Emval.toValue(key);
  return Emval.toHandle(handle[key]);
}

function __emval_incref(handle) {
  handle >>>= 0;
  if (handle > 9) {
    emval_handles[handle + 1] += 1;
  }
}

function __emval_new_array() {
  return Emval.toHandle([]);
}

function __emval_new_array_from_memory_view(view) {
  view >>>= 0;
  view = Emval.toValue(view);
  // using for..loop is faster than Array.from
  var a = new Array(view.length);
  for (var i = 0; i < view.length; i++) a[i] = view[i];
  return Emval.toHandle(a);
}

function __emval_new_cstring(v) {
  v >>>= 0;
  return Emval.toHandle(getStringOrSymbol(v));
}

function __emval_new_object() {
  return Emval.toHandle({});
}

var runDestructors = destructors => {
  while (destructors.length) {
    var ptr = destructors.pop();
    var del = destructors.pop();
    del(ptr);
  }
};

function __emval_run_destructors(handle) {
  handle >>>= 0;
  var destructors = Emval.toValue(handle);
  runDestructors(destructors);
  __emval_decref(handle);
}

function __emval_set_property(handle, key, value) {
  handle >>>= 0;
  key >>>= 0;
  value >>>= 0;
  handle = Emval.toValue(handle);
  key = Emval.toValue(key);
  value = Emval.toValue(value);
  handle[key] = value;
}

function __emval_take_value(type, arg) {
  type >>>= 0;
  arg >>>= 0;
  type = requireRegisteredType(type, "_emval_take_value");
  var v = type["readValueFromPointer"](arg);
  return Emval.toHandle(v);
}

function __gmtime_js(time, tmPtr) {
  time = bigintToI53Checked(time);
  tmPtr >>>= 0;
  var date = new Date(time * 1e3);
  GROWABLE_HEAP_I32()[((tmPtr) >>> 2) >>> 0] = date.getUTCSeconds();
  GROWABLE_HEAP_I32()[(((tmPtr) + (4)) >>> 2) >>> 0] = date.getUTCMinutes();
  GROWABLE_HEAP_I32()[(((tmPtr) + (8)) >>> 2) >>> 0] = date.getUTCHours();
  GROWABLE_HEAP_I32()[(((tmPtr) + (12)) >>> 2) >>> 0] = date.getUTCDate();
  GROWABLE_HEAP_I32()[(((tmPtr) + (16)) >>> 2) >>> 0] = date.getUTCMonth();
  GROWABLE_HEAP_I32()[(((tmPtr) + (20)) >>> 2) >>> 0] = date.getUTCFullYear() - 1900;
  GROWABLE_HEAP_I32()[(((tmPtr) + (24)) >>> 2) >>> 0] = date.getUTCDay();
  var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
  var yday = ((date.getTime() - start) / (1e3 * 60 * 60 * 24)) | 0;
  GROWABLE_HEAP_I32()[(((tmPtr) + (28)) >>> 2) >>> 0] = yday;
}

var isLeapYear = year => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

var MONTH_DAYS_LEAP_CUMULATIVE = [ 0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335 ];

var MONTH_DAYS_REGULAR_CUMULATIVE = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ];

var ydayFromDate = date => {
  var leap = isLeapYear(date.getFullYear());
  var monthDaysCumulative = (leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE);
  var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
  // -1 since it's days since Jan 1
  return yday;
};

function __localtime_js(time, tmPtr) {
  time = bigintToI53Checked(time);
  tmPtr >>>= 0;
  var date = new Date(time * 1e3);
  GROWABLE_HEAP_I32()[((tmPtr) >>> 2) >>> 0] = date.getSeconds();
  GROWABLE_HEAP_I32()[(((tmPtr) + (4)) >>> 2) >>> 0] = date.getMinutes();
  GROWABLE_HEAP_I32()[(((tmPtr) + (8)) >>> 2) >>> 0] = date.getHours();
  GROWABLE_HEAP_I32()[(((tmPtr) + (12)) >>> 2) >>> 0] = date.getDate();
  GROWABLE_HEAP_I32()[(((tmPtr) + (16)) >>> 2) >>> 0] = date.getMonth();
  GROWABLE_HEAP_I32()[(((tmPtr) + (20)) >>> 2) >>> 0] = date.getFullYear() - 1900;
  GROWABLE_HEAP_I32()[(((tmPtr) + (24)) >>> 2) >>> 0] = date.getDay();
  var yday = ydayFromDate(date) | 0;
  GROWABLE_HEAP_I32()[(((tmPtr) + (28)) >>> 2) >>> 0] = yday;
  GROWABLE_HEAP_I32()[(((tmPtr) + (36)) >>> 2) >>> 0] = -(date.getTimezoneOffset() * 60);
  // Attention: DST is in December in South, and some regions don't have DST at all.
  var start = new Date(date.getFullYear(), 0, 1);
  var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  var winterOffset = start.getTimezoneOffset();
  var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
  GROWABLE_HEAP_I32()[(((tmPtr) + (32)) >>> 2) >>> 0] = dst;
}

var __mktime_js = function(tmPtr) {
  tmPtr >>>= 0;
  var ret = (() => {
    var date = new Date(GROWABLE_HEAP_I32()[(((tmPtr) + (20)) >>> 2) >>> 0] + 1900, GROWABLE_HEAP_I32()[(((tmPtr) + (16)) >>> 2) >>> 0], GROWABLE_HEAP_I32()[(((tmPtr) + (12)) >>> 2) >>> 0], GROWABLE_HEAP_I32()[(((tmPtr) + (8)) >>> 2) >>> 0], GROWABLE_HEAP_I32()[(((tmPtr) + (4)) >>> 2) >>> 0], GROWABLE_HEAP_I32()[((tmPtr) >>> 2) >>> 0], 0);
    // There's an ambiguous hour when the time goes back; the tm_isdst field is
    // used to disambiguate it.  Date() basically guesses, so we fix it up if it
    // guessed wrong, or fill in tm_isdst with the guess if it's -1.
    var dst = GROWABLE_HEAP_I32()[(((tmPtr) + (32)) >>> 2) >>> 0];
    var guessedOffset = date.getTimezoneOffset();
    var start = new Date(date.getFullYear(), 0, 1);
    var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    var winterOffset = start.getTimezoneOffset();
    var dstOffset = Math.min(winterOffset, summerOffset);
    // DST is in December in South
    if (dst < 0) {
      // Attention: some regions don't have DST at all.
      GROWABLE_HEAP_I32()[(((tmPtr) + (32)) >>> 2) >>> 0] = Number(summerOffset != winterOffset && dstOffset == guessedOffset);
    } else if ((dst > 0) != (dstOffset == guessedOffset)) {
      var nonDstOffset = Math.max(winterOffset, summerOffset);
      var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
      // Don't try setMinutes(date.getMinutes() + ...) -- it's messed up.
      date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4);
    }
    GROWABLE_HEAP_I32()[(((tmPtr) + (24)) >>> 2) >>> 0] = date.getDay();
    var yday = ydayFromDate(date) | 0;
    GROWABLE_HEAP_I32()[(((tmPtr) + (28)) >>> 2) >>> 0] = yday;
    // To match expected behavior, update fields from date
    GROWABLE_HEAP_I32()[((tmPtr) >>> 2) >>> 0] = date.getSeconds();
    GROWABLE_HEAP_I32()[(((tmPtr) + (4)) >>> 2) >>> 0] = date.getMinutes();
    GROWABLE_HEAP_I32()[(((tmPtr) + (8)) >>> 2) >>> 0] = date.getHours();
    GROWABLE_HEAP_I32()[(((tmPtr) + (12)) >>> 2) >>> 0] = date.getDate();
    GROWABLE_HEAP_I32()[(((tmPtr) + (16)) >>> 2) >>> 0] = date.getMonth();
    GROWABLE_HEAP_I32()[(((tmPtr) + (20)) >>> 2) >>> 0] = date.getYear();
    var timeMs = date.getTime();
    if (isNaN(timeMs)) {
      return -1;
    }
    // Return time in microseconds
    return timeMs / 1e3;
  })();
  return BigInt(ret);
};

function __mmap_js(len, prot, flags, fd, offset, allocated, addr) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(16, 0, 1, len, prot, flags, fd, offset, allocated, addr);
  len >>>= 0;
  offset = bigintToI53Checked(offset);
  allocated >>>= 0;
  addr >>>= 0;
  return -52;
}

function __munmap_js(addr, len, prot, flags, fd, offset) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(17, 0, 1, addr, len, prot, flags, fd, offset);
  addr >>>= 0;
  len >>>= 0;
  offset = bigintToI53Checked(offset);
}

var timers = {};

var _emscripten_get_now = () => performance.timeOrigin + performance.now();

function __setitimer_js(which, timeout_ms) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(18, 0, 1, which, timeout_ms);
  // First, clear any existing timer.
  if (timers[which]) {
    clearTimeout(timers[which].id);
    delete timers[which];
  }
  // A timeout of zero simply cancels the current timeout so we have nothing
  // more to do.
  if (!timeout_ms) return 0;
  var id = setTimeout(() => {
    delete timers[which];
    callUserCallback(() => __emscripten_timeout(which, _emscripten_get_now()));
  }, timeout_ms);
  timers[which] = {
    id,
    timeout_ms
  };
  return 0;
}

var __tzset_js = function(timezone, daylight, std_name, dst_name) {
  timezone >>>= 0;
  daylight >>>= 0;
  std_name >>>= 0;
  dst_name >>>= 0;
  // TODO: Use (malleable) environment variables instead of system settings.
  var currentYear = (new Date).getFullYear();
  var winter = new Date(currentYear, 0, 1);
  var summer = new Date(currentYear, 6, 1);
  var winterOffset = winter.getTimezoneOffset();
  var summerOffset = summer.getTimezoneOffset();
  // Local standard timezone offset. Local standard time is not adjusted for
  // daylight savings.  This code uses the fact that getTimezoneOffset returns
  // a greater value during Standard Time versus Daylight Saving Time (DST).
  // Thus it determines the expected output during Standard Time, and it
  // compares whether the output of the given date the same (Standard) or less
  // (DST).
  var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
  // timezone is specified as seconds west of UTC ("The external variable
  // `timezone` shall be set to the difference, in seconds, between
  // Coordinated Universal Time (UTC) and local standard time."), the same
  // as returned by stdTimezoneOffset.
  // See http://pubs.opengroup.org/onlinepubs/009695399/functions/tzset.html
  GROWABLE_HEAP_U32()[((timezone) >>> 2) >>> 0] = stdTimezoneOffset * 60;
  GROWABLE_HEAP_I32()[((daylight) >>> 2) >>> 0] = Number(winterOffset != summerOffset);
  var extractZone = timezoneOffset => {
    // Why inverse sign?
    // Read here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
    var sign = timezoneOffset >= 0 ? "-" : "+";
    var absOffset = Math.abs(timezoneOffset);
    var hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
    var minutes = String(absOffset % 60).padStart(2, "0");
    return `UTC${sign}${hours}${minutes}`;
  };
  var winterName = extractZone(winterOffset);
  var summerName = extractZone(summerOffset);
  if (summerOffset < winterOffset) {
    // Northern hemisphere
    stringToUTF8(winterName, std_name, 17);
    stringToUTF8(summerName, dst_name, 17);
  } else {
    stringToUTF8(winterName, dst_name, 17);
    stringToUTF8(summerName, std_name, 17);
  }
};

var _emscripten_date_now = () => Date.now();

var nowIsMonotonic = 1;

var checkWasiClock = clock_id => clock_id >= 0 && clock_id <= 3;

function _clock_time_get(clk_id, ignored_precision, ptime) {
  ignored_precision = bigintToI53Checked(ignored_precision);
  ptime >>>= 0;
  if (!checkWasiClock(clk_id)) {
    return 28;
  }
  var now;
  // all wasi clocks but realtime are monotonic
  if (clk_id === 0) {
    now = _emscripten_date_now();
  } else if (nowIsMonotonic) {
    now = _emscripten_get_now();
  } else {
    return 52;
  }
  // "now" is in ms, and wasi times are in ns.
  var nsec = Math.round(now * 1e3 * 1e3);
  HEAP64[((ptime) >>> 3)] = BigInt(nsec);
  return 0;
}

var readEmAsmArgsArray = [];

var readEmAsmArgs = (sigPtr, buf) => {
  readEmAsmArgsArray.length = 0;
  var ch;
  // Most arguments are i32s, so shift the buffer pointer so it is a plain
  // index into HEAP32.
  while (ch = GROWABLE_HEAP_U8()[sigPtr++ >>> 0]) {
    // Floats are always passed as doubles, so all types except for 'i'
    // are 8 bytes and require alignment.
    var wide = (ch != 105);
    wide &= (ch != 112);
    buf += wide && (buf % 8) ? 4 : 0;
    readEmAsmArgsArray.push(// Special case for pointers under wasm64 or CAN_ADDRESS_2GB mode.
    ch == 112 ? GROWABLE_HEAP_U32()[((buf) >>> 2) >>> 0] : ch == 106 ? HEAP64[((buf) >>> 3)] : ch == 105 ? GROWABLE_HEAP_I32()[((buf) >>> 2) >>> 0] : GROWABLE_HEAP_F64()[((buf) >>> 3) >>> 0]);
    buf += wide ? 8 : 4;
  }
  return readEmAsmArgsArray;
};

var runEmAsmFunction = (code, sigPtr, argbuf) => {
  var args = readEmAsmArgs(sigPtr, argbuf);
  return ASM_CONSTS[code](...args);
};

function _emscripten_asm_const_int(code, sigPtr, argbuf) {
  code >>>= 0;
  sigPtr >>>= 0;
  argbuf >>>= 0;
  return runEmAsmFunction(code, sigPtr, argbuf);
}

function _emscripten_asm_const_ptr(code, sigPtr, argbuf) {
  code >>>= 0;
  sigPtr >>>= 0;
  argbuf >>>= 0;
  return runEmAsmFunction(code, sigPtr, argbuf);
}

var warnOnce = text => {
  warnOnce.shown ||= {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    if (ENVIRONMENT_IS_NODE) text = "warning: " + text;
    err(text);
  }
};

var _emscripten_check_blocking_allowed = () => {};

function _emscripten_errn(str, len) {
  str >>>= 0;
  len >>>= 0;
  return err(UTF8ToString(str, len));
}

var _emscripten_exit_with_live_runtime = () => {
  runtimeKeepalivePush();
  throw "unwind";
};

var getHeapMax = () => // Stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate
// full 4GB Wasm memories, the size will wrap back to 0 bytes in Wasm side
// for any code that deals with heap sizes, which would require special
// casing all heap size related code to treat 0 specially.
4294901760;

function _emscripten_get_heap_max() {
  return getHeapMax();
}

var _emscripten_num_logical_cores = () => ENVIRONMENT_IS_NODE ? require("os").cpus().length : navigator["hardwareConcurrency"];

function _emscripten_pc_get_function(pc) {
  pc >>>= 0;
  abort("Cannot use emscripten_pc_get_function without -sUSE_OFFSET_CONVERTER");
  return 0;
}

var alignMemory = (size, alignment) => Math.ceil(size / alignment) * alignment;

var growMemory = size => {
  var b = wasmMemory.buffer;
  var pages = ((size - b.byteLength + 65535) / 65536) | 0;
  try {
    // round size grow request up to wasm page size (fixed 64KB per spec)
    wasmMemory.grow(pages);
    // .grow() takes a delta compared to the previous size
    updateMemoryViews();
    return 1;
  } catch (e) {}
};

function _emscripten_resize_heap(requestedSize) {
  requestedSize >>>= 0;
  var oldSize = GROWABLE_HEAP_U8().length;
  // With multithreaded builds, races can happen (another thread might increase the size
  // in between), so return a failure, and let the caller retry.
  if (requestedSize <= oldSize) {
    return false;
  }
  // Memory resize rules:
  // 1.  Always increase heap size to at least the requested size, rounded up
  //     to next page multiple.
  // 2a. If MEMORY_GROWTH_LINEAR_STEP == -1, excessively resize the heap
  //     geometrically: increase the heap size according to
  //     MEMORY_GROWTH_GEOMETRIC_STEP factor (default +20%), At most
  //     overreserve by MEMORY_GROWTH_GEOMETRIC_CAP bytes (default 96MB).
  // 2b. If MEMORY_GROWTH_LINEAR_STEP != -1, excessively resize the heap
  //     linearly: increase the heap size by at least
  //     MEMORY_GROWTH_LINEAR_STEP bytes.
  // 3.  Max size for the heap is capped at 2048MB-WASM_PAGE_SIZE, or by
  //     MAXIMUM_MEMORY, or by ASAN limit, depending on which is smallest
  // 4.  If we were unable to allocate as much memory, it may be due to
  //     over-eager decision to excessively reserve due to (3) above.
  //     Hence if an allocation fails, cut down on the amount of excess
  //     growth, in an attempt to succeed to perform a smaller allocation.
  // A limit is set for how much we can grow. We should not exceed that
  // (the wasm binary specifies it, so if we tried, we'd fail anyhow).
  var maxHeapSize = getHeapMax();
  if (requestedSize > maxHeapSize) {
    return false;
  }
  // Loop through potential heap size increases. If we attempt a too eager
  // reservation that fails, cut down on the attempted size and reserve a
  // smaller bump instead. (max 3 times, chosen somewhat arbitrarily)
  for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
    var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
    // ensure geometric growth
    // but limit overreserving (default to capping at +96MB overgrowth at most)
    overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
    var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
    var replacement = growMemory(newSize);
    if (replacement) {
      return true;
    }
  }
  return false;
}

/** @returns {number} */ var convertFrameToPC = frame => {
  abort("Cannot use convertFrameToPC (needed by __builtin_return_address) without -sUSE_OFFSET_CONVERTER");
  // return 0 if we can't find any
  return 0;
};

var UNWIND_CACHE = {};

var saveInUnwindCache = callstack => {
  callstack.forEach(frame => {
    var pc = convertFrameToPC(frame);
    if (pc) {
      UNWIND_CACHE[pc] = frame;
    }
  });
};

var jsStackTrace = () => (new Error).stack.toString();

function _emscripten_stack_snapshot() {
  var callstack = jsStackTrace().split("\n");
  if (callstack[0] == "Error") {
    callstack.shift();
  }
  saveInUnwindCache(callstack);
  // Caches the stack snapshot so that emscripten_stack_unwind_buffer() can
  // unwind from this spot.
  UNWIND_CACHE.last_addr = convertFrameToPC(callstack[3]);
  UNWIND_CACHE.last_stack = callstack;
  return UNWIND_CACHE.last_addr;
}

function _emscripten_stack_unwind_buffer(addr, buffer, count) {
  addr >>>= 0;
  buffer >>>= 0;
  var stack;
  if (UNWIND_CACHE.last_addr == addr) {
    stack = UNWIND_CACHE.last_stack;
  } else {
    stack = jsStackTrace().split("\n");
    if (stack[0] == "Error") {
      stack.shift();
    }
    saveInUnwindCache(stack);
  }
  var offset = 3;
  while (stack[offset] && convertFrameToPC(stack[offset]) != addr) {
    ++offset;
  }
  for (var i = 0; i < count && stack[i + offset]; ++i) {
    GROWABLE_HEAP_I32()[(((buffer) + (i * 4)) >>> 2) >>> 0] = convertFrameToPC(stack[i + offset]);
  }
  return i;
}

var ENV = {};

var getExecutableName = () => thisProgram || "./this.program";

var getEnvStrings = () => {
  if (!getEnvStrings.strings) {
    // Default values.
    // Browser language detection #8751
    var lang = ((typeof navigator == "object" && navigator.languages && navigator.languages[0]) || "C").replace("-", "_") + ".UTF-8";
    var env = {
      "USER": "web_user",
      "LOGNAME": "web_user",
      "PATH": "/",
      "PWD": "/",
      "HOME": "/home/web_user",
      "LANG": lang,
      "_": getExecutableName()
    };
    // Apply the user-provided values, if any.
    for (var x in ENV) {
      // x is a key in ENV; if ENV[x] is undefined, that means it was
      // explicitly set to be so. We allow user code to do that to
      // force variables with default values to remain unset.
      if (ENV[x] === undefined) delete env[x]; else env[x] = ENV[x];
    }
    var strings = [];
    for (var x in env) {
      strings.push(`${x}=${env[x]}`);
    }
    getEnvStrings.strings = strings;
  }
  return getEnvStrings.strings;
};

var stringToAscii = (str, buffer) => {
  for (var i = 0; i < str.length; ++i) {
    GROWABLE_HEAP_I8()[buffer++ >>> 0] = str.charCodeAt(i);
  }
  // Null-terminate the string
  GROWABLE_HEAP_I8()[buffer >>> 0] = 0;
};

var _environ_get = function(__environ, environ_buf) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(19, 0, 1, __environ, environ_buf);
  __environ >>>= 0;
  environ_buf >>>= 0;
  var bufSize = 0;
  getEnvStrings().forEach((string, i) => {
    var ptr = environ_buf + bufSize;
    GROWABLE_HEAP_U32()[(((__environ) + (i * 4)) >>> 2) >>> 0] = ptr;
    stringToAscii(string, ptr);
    bufSize += string.length + 1;
  });
  return 0;
};

var _environ_sizes_get = function(penviron_count, penviron_buf_size) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(20, 0, 1, penviron_count, penviron_buf_size);
  penviron_count >>>= 0;
  penviron_buf_size >>>= 0;
  var strings = getEnvStrings();
  GROWABLE_HEAP_U32()[((penviron_count) >>> 2) >>> 0] = strings.length;
  var bufSize = 0;
  strings.forEach(string => bufSize += string.length + 1);
  GROWABLE_HEAP_U32()[((penviron_buf_size) >>> 2) >>> 0] = bufSize;
  return 0;
};

function _fd_close(fd) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(21, 0, 1, fd);
  return 52;
}

function _fd_read(fd, iov, iovcnt, pnum) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(22, 0, 1, fd, iov, iovcnt, pnum);
  iov >>>= 0;
  iovcnt >>>= 0;
  pnum >>>= 0;
  return 52;
}

function _fd_seek(fd, offset, whence, newOffset) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(23, 0, 1, fd, offset, whence, newOffset);
  offset = bigintToI53Checked(offset);
  newOffset >>>= 0;
  return 70;
}

var printCharBuffers = [ null, [], [] ];

var printChar = (stream, curr) => {
  var buffer = printCharBuffers[stream];
  if (curr === 0 || curr === 10) {
    (stream === 1 ? out : err)(UTF8ArrayToString(buffer));
    buffer.length = 0;
  } else {
    buffer.push(curr);
  }
};

function _fd_write(fd, iov, iovcnt, pnum) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(24, 0, 1, fd, iov, iovcnt, pnum);
  iov >>>= 0;
  iovcnt >>>= 0;
  pnum >>>= 0;
  // hack to support printf in SYSCALLS_REQUIRE_FILESYSTEM=0
  var num = 0;
  for (var i = 0; i < iovcnt; i++) {
    var ptr = GROWABLE_HEAP_U32()[((iov) >>> 2) >>> 0];
    var len = GROWABLE_HEAP_U32()[(((iov) + (4)) >>> 2) >>> 0];
    iov += 8;
    for (var j = 0; j < len; j++) {
      printChar(fd, GROWABLE_HEAP_U8()[ptr + j >>> 0]);
    }
    num += len;
  }
  GROWABLE_HEAP_U32()[((pnum) >>> 2) >>> 0] = num;
  return 0;
}

PThread.init();

embind_init_charCodes();

BindingError = Module["BindingError"] = class BindingError extends Error {
  constructor(message) {
    super(message);
    this.name = "BindingError";
  }
};

InternalError = Module["InternalError"] = class InternalError extends Error {
  constructor(message) {
    super(message);
    this.name = "InternalError";
  }
};

init_emval();

// proxiedFunctionTable specifies the list of functions that can be called
// either synchronously or asynchronously from other threads in postMessage()d
// or internally queued events. This way a pthread in a Worker can synchronously
// access e.g. the DOM on the main thread.
var proxiedFunctionTable = [ _proc_exit, exitOnMainThread, pthreadCreateProxied, ___syscall_fcntl64, ___syscall_fstat64, ___syscall_getcwd, ___syscall_getdents64, ___syscall_ioctl, ___syscall_lstat64, ___syscall_mkdirat, ___syscall_newfstatat, ___syscall_openat, ___syscall_readlinkat, ___syscall_rmdir, ___syscall_stat64, ___syscall_unlinkat, __mmap_js, __munmap_js, __setitimer_js, _environ_get, _environ_sizes_get, _fd_close, _fd_read, _fd_seek, _fd_write ];

var wasmImports;

function assignWasmImports() {
  wasmImports = {
    /** @export */ L: HaveOffsetConverter,
    /** @export */ M: __asyncjs__jsepDownload,
    /** @export */ b: ___cxa_throw,
    /** @export */ Ca: ___pthread_create_js,
    /** @export */ C: ___syscall_fcntl64,
    /** @export */ Ba: ___syscall_fstat64,
    /** @export */ Aa: ___syscall_getcwd,
    /** @export */ za: ___syscall_getdents64,
    /** @export */ ya: ___syscall_ioctl,
    /** @export */ xa: ___syscall_lstat64,
    /** @export */ wa: ___syscall_mkdirat,
    /** @export */ va: ___syscall_newfstatat,
    /** @export */ K: ___syscall_openat,
    /** @export */ ua: ___syscall_readlinkat,
    /** @export */ ta: ___syscall_rmdir,
    /** @export */ sa: ___syscall_stat64,
    /** @export */ ra: ___syscall_unlinkat,
    /** @export */ la: __abort_js,
    /** @export */ H: __embind_register_bigint,
    /** @export */ ka: __embind_register_bool,
    /** @export */ ja: __embind_register_emval,
    /** @export */ G: __embind_register_float,
    /** @export */ u: __embind_register_integer,
    /** @export */ r: __embind_register_memory_view,
    /** @export */ ia: __embind_register_std_string,
    /** @export */ A: __embind_register_std_wstring,
    /** @export */ ha: __embind_register_void,
    /** @export */ ga: __emscripten_init_main_thread_js,
    /** @export */ fa: __emscripten_notify_mailbox_postmessage,
    /** @export */ ea: __emscripten_receive_on_main_thread_js,
    /** @export */ da: __emscripten_runtime_keepalive_clear,
    /** @export */ F: __emscripten_thread_cleanup,
    /** @export */ ca: __emscripten_thread_mailbox_await,
    /** @export */ ba: __emscripten_thread_set_strongref,
    /** @export */ t: __emval_as,
    /** @export */ aa: __emval_as_int64,
    /** @export */ w: __emval_await,
    /** @export */ o: __emval_call,
    /** @export */ m: __emval_call_method,
    /** @export */ c: __emval_decref,
    /** @export */ $: __emval_equals,
    /** @export */ n: __emval_get_global,
    /** @export */ k: __emval_get_method_caller,
    /** @export */ v: __emval_get_module_property,
    /** @export */ p: __emval_get_property,
    /** @export */ f: __emval_incref,
    /** @export */ s: __emval_new_array,
    /** @export */ l: __emval_new_array_from_memory_view,
    /** @export */ e: __emval_new_cstring,
    /** @export */ j: __emval_new_object,
    /** @export */ i: __emval_run_destructors,
    /** @export */ g: __emval_set_property,
    /** @export */ d: __emval_take_value,
    /** @export */ _: __gmtime_js,
    /** @export */ Z: __localtime_js,
    /** @export */ Y: __mktime_js,
    /** @export */ X: __mmap_js,
    /** @export */ W: __munmap_js,
    /** @export */ V: __setitimer_js,
    /** @export */ U: __tzset_js,
    /** @export */ qa: _clock_time_get,
    /** @export */ h: _emscripten_asm_const_int,
    /** @export */ z: _emscripten_asm_const_ptr,
    /** @export */ E: _emscripten_check_blocking_allowed,
    /** @export */ T: _emscripten_date_now,
    /** @export */ y: _emscripten_errn,
    /** @export */ S: _emscripten_exit_with_live_runtime,
    /** @export */ R: _emscripten_get_heap_max,
    /** @export */ q: _emscripten_get_now,
    /** @export */ x: _emscripten_num_logical_cores,
    /** @export */ D: _emscripten_pc_get_function,
    /** @export */ Q: _emscripten_resize_heap,
    /** @export */ P: _emscripten_stack_snapshot,
    /** @export */ O: _emscripten_stack_unwind_buffer,
    /** @export */ pa: _environ_get,
    /** @export */ oa: _environ_sizes_get,
    /** @export */ N: _exit,
    /** @export */ B: _fd_close,
    /** @export */ J: _fd_read,
    /** @export */ na: _fd_seek,
    /** @export */ I: _fd_write,
    /** @export */ a: wasmMemory,
    /** @export */ ma: _proc_exit
  };
}

var wasmExports = await createWasm();

var ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports["Da"])();

var ___getTypeName = a0 => (___getTypeName = wasmExports["Ea"])(a0);

var __embind_initialize_bindings = () => (__embind_initialize_bindings = wasmExports["Fa"])();

var _OrtInit = Module["_OrtInit"] = (a0, a1) => (_OrtInit = Module["_OrtInit"] = wasmExports["Ga"])(a0, a1);

var _OrtGetLastError = Module["_OrtGetLastError"] = (a0, a1) => (_OrtGetLastError = Module["_OrtGetLastError"] = wasmExports["Ha"])(a0, a1);

var _OrtCreateSessionOptions = Module["_OrtCreateSessionOptions"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) => (_OrtCreateSessionOptions = Module["_OrtCreateSessionOptions"] = wasmExports["Ia"])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);

var _OrtAppendExecutionProvider = Module["_OrtAppendExecutionProvider"] = (a0, a1, a2, a3, a4) => (_OrtAppendExecutionProvider = Module["_OrtAppendExecutionProvider"] = wasmExports["Ja"])(a0, a1, a2, a3, a4);

var _OrtAddFreeDimensionOverride = Module["_OrtAddFreeDimensionOverride"] = (a0, a1, a2) => (_OrtAddFreeDimensionOverride = Module["_OrtAddFreeDimensionOverride"] = wasmExports["Ka"])(a0, a1, a2);

var _OrtAddSessionConfigEntry = Module["_OrtAddSessionConfigEntry"] = (a0, a1, a2) => (_OrtAddSessionConfigEntry = Module["_OrtAddSessionConfigEntry"] = wasmExports["La"])(a0, a1, a2);

var _OrtReleaseSessionOptions = Module["_OrtReleaseSessionOptions"] = a0 => (_OrtReleaseSessionOptions = Module["_OrtReleaseSessionOptions"] = wasmExports["Ma"])(a0);

var _OrtCreateSession = Module["_OrtCreateSession"] = (a0, a1, a2) => (_OrtCreateSession = Module["_OrtCreateSession"] = wasmExports["Na"])(a0, a1, a2);

var _OrtReleaseSession = Module["_OrtReleaseSession"] = a0 => (_OrtReleaseSession = Module["_OrtReleaseSession"] = wasmExports["Oa"])(a0);

var _OrtGetInputOutputCount = Module["_OrtGetInputOutputCount"] = (a0, a1, a2) => (_OrtGetInputOutputCount = Module["_OrtGetInputOutputCount"] = wasmExports["Pa"])(a0, a1, a2);

var _OrtGetInputOutputMetadata = Module["_OrtGetInputOutputMetadata"] = (a0, a1, a2, a3) => (_OrtGetInputOutputMetadata = Module["_OrtGetInputOutputMetadata"] = wasmExports["Qa"])(a0, a1, a2, a3);

var _OrtFree = Module["_OrtFree"] = a0 => (_OrtFree = Module["_OrtFree"] = wasmExports["Ra"])(a0);

var _OrtCreateTensor = Module["_OrtCreateTensor"] = (a0, a1, a2, a3, a4, a5) => (_OrtCreateTensor = Module["_OrtCreateTensor"] = wasmExports["Sa"])(a0, a1, a2, a3, a4, a5);

var _OrtGetTensorData = Module["_OrtGetTensorData"] = (a0, a1, a2, a3, a4) => (_OrtGetTensorData = Module["_OrtGetTensorData"] = wasmExports["Ta"])(a0, a1, a2, a3, a4);

var _OrtReleaseTensor = Module["_OrtReleaseTensor"] = a0 => (_OrtReleaseTensor = Module["_OrtReleaseTensor"] = wasmExports["Ua"])(a0);

var _OrtCreateRunOptions = Module["_OrtCreateRunOptions"] = (a0, a1, a2, a3) => (_OrtCreateRunOptions = Module["_OrtCreateRunOptions"] = wasmExports["Va"])(a0, a1, a2, a3);

var _OrtAddRunConfigEntry = Module["_OrtAddRunConfigEntry"] = (a0, a1, a2) => (_OrtAddRunConfigEntry = Module["_OrtAddRunConfigEntry"] = wasmExports["Wa"])(a0, a1, a2);

var _OrtReleaseRunOptions = Module["_OrtReleaseRunOptions"] = a0 => (_OrtReleaseRunOptions = Module["_OrtReleaseRunOptions"] = wasmExports["Xa"])(a0);

var _OrtCreateBinding = Module["_OrtCreateBinding"] = a0 => (_OrtCreateBinding = Module["_OrtCreateBinding"] = wasmExports["Ya"])(a0);

var _OrtBindInput = Module["_OrtBindInput"] = (a0, a1, a2) => (_OrtBindInput = Module["_OrtBindInput"] = wasmExports["Za"])(a0, a1, a2);

var _OrtBindOutput = Module["_OrtBindOutput"] = (a0, a1, a2, a3) => (_OrtBindOutput = Module["_OrtBindOutput"] = wasmExports["_a"])(a0, a1, a2, a3);

var _OrtClearBoundOutputs = Module["_OrtClearBoundOutputs"] = a0 => (_OrtClearBoundOutputs = Module["_OrtClearBoundOutputs"] = wasmExports["$a"])(a0);

var _OrtReleaseBinding = Module["_OrtReleaseBinding"] = a0 => (_OrtReleaseBinding = Module["_OrtReleaseBinding"] = wasmExports["ab"])(a0);

var _OrtRunWithBinding = Module["_OrtRunWithBinding"] = (a0, a1, a2, a3, a4) => (_OrtRunWithBinding = Module["_OrtRunWithBinding"] = wasmExports["bb"])(a0, a1, a2, a3, a4);

var _OrtRun = Module["_OrtRun"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (_OrtRun = Module["_OrtRun"] = wasmExports["cb"])(a0, a1, a2, a3, a4, a5, a6, a7);

var _OrtEndProfiling = Module["_OrtEndProfiling"] = a0 => (_OrtEndProfiling = Module["_OrtEndProfiling"] = wasmExports["db"])(a0);

var _JsepOutput = Module["_JsepOutput"] = (a0, a1, a2) => (_JsepOutput = Module["_JsepOutput"] = wasmExports["eb"])(a0, a1, a2);

var _JsepGetNodeName = Module["_JsepGetNodeName"] = a0 => (_JsepGetNodeName = Module["_JsepGetNodeName"] = wasmExports["fb"])(a0);

var _pthread_self = () => (_pthread_self = wasmExports["gb"])();

var _free = Module["_free"] = a0 => (_free = Module["_free"] = wasmExports["hb"])(a0);

var _malloc = Module["_malloc"] = a0 => (_malloc = Module["_malloc"] = wasmExports["ib"])(a0);

var __emscripten_tls_init = () => (__emscripten_tls_init = wasmExports["jb"])();

var __emscripten_thread_init = (a0, a1, a2, a3, a4, a5) => (__emscripten_thread_init = wasmExports["lb"])(a0, a1, a2, a3, a4, a5);

var __emscripten_thread_crashed = () => (__emscripten_thread_crashed = wasmExports["mb"])();

var __emscripten_run_on_main_thread_js = (a0, a1, a2, a3, a4) => (__emscripten_run_on_main_thread_js = wasmExports["nb"])(a0, a1, a2, a3, a4);

var __emscripten_thread_free_data = a0 => (__emscripten_thread_free_data = wasmExports["ob"])(a0);

var __emscripten_thread_exit = a0 => (__emscripten_thread_exit = wasmExports["pb"])(a0);

var __emscripten_timeout = (a0, a1) => (__emscripten_timeout = wasmExports["qb"])(a0, a1);

var __emscripten_check_mailbox = () => (__emscripten_check_mailbox = wasmExports["rb"])();

var _emscripten_stack_set_limits = (a0, a1) => (_emscripten_stack_set_limits = wasmExports["sb"])(a0, a1);

var __emscripten_stack_restore = a0 => (__emscripten_stack_restore = wasmExports["tb"])(a0);

var __emscripten_stack_alloc = a0 => (__emscripten_stack_alloc = wasmExports["ub"])(a0);

var _emscripten_stack_get_current = () => (_emscripten_stack_get_current = wasmExports["vb"])();

var dynCall_ii = Module["dynCall_ii"] = (a0, a1) => (dynCall_ii = Module["dynCall_ii"] = wasmExports["wb"])(a0, a1);

var _asyncify_start_unwind = a0 => (_asyncify_start_unwind = wasmExports["xb"])(a0);

var _asyncify_stop_unwind = () => (_asyncify_stop_unwind = wasmExports["yb"])();

var _asyncify_start_rewind = a0 => (_asyncify_start_rewind = wasmExports["zb"])(a0);

var _asyncify_stop_rewind = () => (_asyncify_stop_rewind = wasmExports["Ab"])();

// Argument name here must shadow the `wasmExports` global so
// that it is recognised by metadce and minify-import-export-names
// passes.
function applySignatureConversions(wasmExports) {
  // First, make a copy of the incoming exports object
  wasmExports = Object.assign({}, wasmExports);
  var makeWrapper_pp = f => a0 => f(a0) >>> 0;
  var makeWrapper_p = f => () => f() >>> 0;
  wasmExports["Ea"] = makeWrapper_pp(wasmExports["Ea"]);
  wasmExports["gb"] = makeWrapper_p(wasmExports["gb"]);
  wasmExports["ib"] = makeWrapper_pp(wasmExports["ib"]);
  wasmExports["ub"] = makeWrapper_pp(wasmExports["ub"]);
  wasmExports["vb"] = makeWrapper_p(wasmExports["vb"]);
  wasmExports["__cxa_get_exception_ptr"] = makeWrapper_pp(wasmExports["__cxa_get_exception_ptr"]);
  return wasmExports;
}

// include: postamble.js
// === Auto-generated postamble setup entry stuff ===
Module["stackSave"] = stackSave;

Module["stackRestore"] = stackRestore;

Module["stackAlloc"] = stackAlloc;

Module["setValue"] = setValue;

Module["getValue"] = getValue;

Module["UTF8ToString"] = UTF8ToString;

Module["stringToUTF8"] = stringToUTF8;

Module["lengthBytesUTF8"] = lengthBytesUTF8;

function run() {
  if (runDependencies > 0) {
    dependenciesFulfilled = run;
    return;
  }
  if ((ENVIRONMENT_IS_PTHREAD)) {
    readyPromiseResolve(Module);
    initRuntime();
    return;
  }
  preRun();
  // a preRun added a dependency, run will be called later
  if (runDependencies > 0) {
    dependenciesFulfilled = run;
    return;
  }
  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    Module["calledRun"] = true;
    if (ABORT) return;
    initRuntime();
    readyPromiseResolve(Module);
    postRun();
  }
  {
    doRun();
  }
}

run();

// end include: postamble.js
// include: /home/wm/work/webml/webnn/frameworks/onnxruntime/honry/onnxruntime/onnxruntime/wasm/js_post_js.js
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
Module["PTR_SIZE"] = 4;

// end include: /home/wm/work/webml/webnn/frameworks/onnxruntime/honry/onnxruntime/onnxruntime/wasm/js_post_js.js
// include: postamble_modularize.js
// In MODULARIZE mode we wrap the generated code in a factory function
// and return either the Module itself, or a promise of the module.
// We assign to the `moduleRtn` global here and configure closure to see
// this as and extern so it won't get minified.
moduleRtn = readyPromise;


  return moduleRtn;
}
);
})();
export default ortWasmThreaded;
var isPthread = globalThis.self?.name?.startsWith('em-pthread');
var isNode = typeof globalThis.process?.versions?.node == 'string';
if (isNode) isPthread = (await import('worker_threads')).workerData === 'em-pthread';

// When running as a pthread, construct a new instance on startup
isPthread && ortWasmThreaded();
