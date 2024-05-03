// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
//
// An example how to run _ with webnn in onnxruntime-web.
//

import {
  setupORT,
  log,
  getQueryValue,
  webNnStatus,
} from "../../assets/js/common_utils.js";

let provider = "webnn";
let deviceType = "gpu";
let dataType = "float16";

let canvas;
let placeholder;
let actionBar;
let filein;

async function main() {}

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
  placeholder = document.querySelector("#placeholder div");
  canvas = document.querySelector("#img_canvas");
  filein = document.querySelector("#file-in");
  actionBar = document.querySelector("#action-bar");
  canvas.setAttribute("class", "none");
  await setupORT();

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

  await checkWebNN();
  await main();
};

document.addEventListener("DOMContentLoaded", ui, false);