// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
//
// An example how to run whisper in onnxruntime-web.
//

import { Whisper } from "./whisper.js";
import { loadScript, removeElement, getQueryValue, getOrtDevVersion, webNnStatus, log, concatBuffer, concatBufferArray, logUser } from "./utils.js";
import VADBuilder, { VADMode, VADEvent } from "./vad/embedded.js";
import AudioMotionAnalyzer from './static/js/audioMotion-analyzer.js?min';
import { lcm } from "./vad/math.js";

const options = {
  mode: 10,
  channelLayout: 'single',
  fillAlpha: .25,
  frequencyScale: 'bark',
  gradientLeft: 'prism',
  gradientRight: 'prism',
  linearAmplitude: true,
  linearBoost: 1.8,
  lineWidth: 1,
  ledBars: false,
  maxFreq: 20000,
  minFreq: 20,
  mirror: 0,
  radial: false,
  reflexRatio: 0,
  showPeaks: true,
  weightingFilter: 'D',
  showScaleX: false,
  overlay: true,
  showBgColor:true, 
  bgAlpha: 0
};

const kSampleRate = 16000;
const kIntervalAudio_ms = 1000;
const kMaxAudioLengthInSec = 30;
const kSteps = kSampleRate * kMaxAudioLengthInSec;

// whisper class
let whisper;

let provider = "webnn";
let deviceType = 'gpu';
let dataType = "float16";

// audio context
let context = null;
let mediaRecorder;
let stream;

// some dom shortcuts
let device = 'gpu';
let badge;
let fileUpload;
let labelFileUpload;
let record;
let speech;
let progress;
let resultShow;
let latency;
let audioProcessing;
let copy;
let audio_src;
let outputText;
let container;
let audioMotion;

// for audio capture
// This enum states the current speech state.
const SpeechStates = {
  UNINITIALIZED: 0,
  PROCESSING: 1,
  PAUSED: 2,
  FINISHED: 3,
};
let speechState = SpeechStates.UNINITIALIZED;

let streamingNode = null;
let sourceNode = null;
let audioChunks = []; // member {isSubChunk: boolean, data: Float32Array}
let subAudioChunks = [];
let chunkLength = 1 / 25; // length in sec of one audio chunk from AudioWorklet processor, recommended by vad
let maxChunkLength = 1; // max audio length in sec for a single audio processing
let maxAudioLength = 10; // max audio length in sec for rectification, must not be greater than 30 sec
let maxUnprocessedAudioLength = 0;
let maxProcessAudioBufferLength = 0;
let accumulateSubChunks = false;
let silenceAudioCounter = 0;
// check if last audio processing is completed, to avoid race condition
let lastProcessingCompleted = true;
// check if last speech processing is completed when restart speech
let lastSpeechCompleted = true;

// involve webrtcvad to detect voice activity
let VAD = null;
let vad = null;

let singleAudioChunk = null; // one time audio process buffer
let subAudioChunkLength = 0; // length of a sub audio chunk
let subText = "";
let speechToText = "";

const blacklistTags = [
  "[inaudible]",
  " [inaudible]",
  "[ Inaudible ]",
  "[INAUDIBLE]",
  " [INAUDIBLE]",
  "[BLANK_AUDIO]",
  " [BLANK_AUDIO]",
  " [no audio]",
  "[no audio]",
  "[silent]",
];

function updateConfig() {
  const query = window.location.search.substring("1");
  const providers = ["webnn", "webgpu", "wasm"];
  const deviceTypes = ['cpu', 'gpu', 'npu']
  const dataTypes = ["float32", "float16"];
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (pair[0] == "provider" && providers.includes(pair[1])) {
      provider = pair[1];
    }
    if (pair[0] == 'deviceType' && deviceTypes.includes(pair[1])) {
      deviceType = pair[1];
    }
    if (pair[0] == "dataType" && dataTypes.includes(pair[1])) {
      dataType = pair[1];
    }
    if (pair[0] == "maxChunkLength") {
      maxChunkLength = parseFloat(pair[1]);
    }

    if (pair[0] == 'chunkLength') {
      chunkLength = parseFloat(pair[1]);
    }
    if (pair[0] == 'maxAudioLength') {
        maxAudioLength = Math.min(parseInt(pair[1]), kMaxAudioLengthInSec);
    }

    if (pair[0] == 'accumulateSubChunks') {
      accumulateSubChunks = pair[1].toLowerCase() === 'true';
    }
  }
}

// transcribe active
function busy() {
  progress.parentNode.style.display = "block";
  outputText.innerText = "";
  latency.innerText = "0.0%";
  resultShow.setAttribute('class', 'show');
}

// transcribe done
function ready() {
  audioProcessing.setAttribute('class', '');
  labelFileUpload.setAttribute('class', 'file-upload-label');
  fileUpload.disabled = false;
  record.disabled = false;
  speech.disabled = false;
  progress.style.width = "0%";
  // progress.parentNode.style.display = "none";
}

// process audio buffer
async function process_audio(audio, starttime, idx, pos) {
  audioProcessing.setAttribute('class', 'show');
  if (idx < audio.length) {
    // not done
    try {
      // update progress bar
      progress.style.width = ((idx * 100) / audio.length).toFixed(1) + "%";
      latency.innerText = ((idx * 100) / audio.length).toFixed(1) + "%";

      // run inference for 30 sec
      const xa = audio.slice(idx, idx + kSteps);
      const ret = await whisper.run(xa);
      // append results to outputText
      outputText.innerText += ret;
      logUser(ret);
      // outputText.scrollTop = outputText.scrollHeight;
      
      await process_audio(audio, starttime, idx + kSteps, pos + kMaxAudioLengthInSec);
    } catch (e) {
      log(`Error · ${e.message}`);
    }
  } else {
    // done with audio buffer
    const processing_time = (performance.now() - starttime) / 1000;
    const total = audio.length / kSampleRate;
    resultShow.setAttribute('class', 'show');
    latency.innerText = `100.0%, ${(
      total / processing_time
    ).toFixed(1)} x realtime`;
    progress.style.width = "100%";
    log(
      `${
        latency.innerText
      }, total ${processing_time.toFixed(
        1
      )}s processing time for ${total.toFixed(1)}s audio`
    );
  }
}

// transcribe audio source
async function transcribe_file() {
  resultShow.setAttribute('class', 'show');
  if (audio_src.src == "") {
    log("Error · No audio input, please record the audio");
    ready();
    return;
  }

  busy();
  log("Starting transcription ...");
  audioProcessing.setAttribute('class', 'show');
  try {
    const buffer = await (await fetch(audio_src.src)).arrayBuffer();
    const audioBuffer = await context.decodeAudioData(buffer);
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start();
    const renderedBuffer = await offlineContext.startRendering();
    const audio = renderedBuffer.getChannelData(0);
    await process_audio(audio, performance.now(), 0, 0);
  } catch (e) {
    log(`Error · ${e.message}`);
  } finally {
    ready();
  }
}

// start recording
async function startRecord() {
  labelFileUpload.setAttribute('class', 'file-upload-label disabled');
  fileUpload.disabled = true;
  record.disabled = false;
  speech.disabled = true;
  stream = null;
  outputText.innerText = '';
  if (!audio_src.paused) {
    audio_src.pause();
  }
  audio_src.src == "";

  resultShow.setAttribute('class', '');
  if (mediaRecorder === undefined) {
    try {
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            autoGainControl: true,
            noiseSuppression: true,
            channelCount: 1,
            latency: 0
          },
        });
      }
      mediaRecorder = new MediaRecorder(stream);
    } catch (e) {
      // record.innerText = "Record";
      log(`Preprocessing · Access to microphone, ${e.message}`);
    }
  }
  let recording_start = performance.now();
  let chunks = [];

  mediaRecorder.ondataavailable = (e) => {
    chunks.push(e.data);
    resultShow.setAttribute('class', 'show');
    latency.innerText = `recorded: ${(
      (performance.now() - recording_start) /
      1000
    ).toFixed(1)}s`;
  };

  mediaRecorder.onstop = async () => {
    const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
    log(
      `Preprocessing · Recorded ${((performance.now() - recording_start) / 1000).toFixed(
        1
      )}s audio`
    );
    audio_src.src = window.URL.createObjectURL(blob);
    audio_src.play();
    await transcribe_file();
  };
  mediaRecorder.start(kIntervalAudio_ms);
}

// stop recording
async function stopRecord() {
  record.disabled = true;
  if (mediaRecorder) {
    mediaRecorder.stop();
    mediaRecorder = undefined;
  }
}

let micStream;
// start speech
async function startSpeech() {
  speechToText = '';
  labelFileUpload.setAttribute('class', 'file-upload-label disabled');
  fileUpload.disabled = true;
  record.disabled = true;
  speech.disabled = false;
  if (!audio_src.paused) {
    audio_src.pause();
  }
  audio_src.src == "";
  resultShow.setAttribute('class', '');
  speechState = SpeechStates.PROCESSING;
  await captureAudioStream();
  if (streamingNode != null) {
    streamingNode.port.postMessage({ message: "STOP_PROCESSING", data: false });
  }
}

// stop speech
async function stopSpeech() {
  // if (micStream) {
	// 	audioMotion.disconnectInput( micStream, true );
  // }
  if (streamingNode != null) {
    streamingNode.port.postMessage({ message: "STOP_PROCESSING", data: true });
    speechState = SpeechStates.PAUSED;
  }
  silenceAudioCounter = 0;
  // push last singleAudioChunk to audioChunks, in case it is ignored.
  if (singleAudioChunk != null) {
    audioChunks.push({ isSubChunk: false, data: singleAudioChunk });
    singleAudioChunk = null;
    if (
      lastProcessingCompleted &&
      lastSpeechCompleted &&
      audioChunks.length > 0
    ) {
      await processAudioBuffer();
    }
  }
  console.warn(`max process audio length: ${maxProcessAudioBufferLength} sec`);
  console.warn(`max unprocessed audio length: ${maxUnprocessedAudioLength} sec`);
  // if (stream) {
  //     stream.getTracks().forEach(track => track.stop());
  // }
  // if (context) {
  //     // context.close().then(() => context = null);
  //     await context.suspend();
  // }
}

// use AudioWorklet API to capture real-time audio
async function captureAudioStream() {
  try {
    if (context && context.state === "suspended") {
      await context.resume();
    }
    // Get user's microphone and connect it to the AudioContext.
    if (!stream) {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          autoGainControl: true,
          noiseSuppression: true,
          channelCount: 1,
          latency: 0,
        },
      });
      // micStream = audioMotion.audioCtx.createMediaStreamSource(stream);
      // audioMotion.connectInput(micStream);
    }
    if (streamingNode) {
      return;
    }

    VAD = await VADBuilder();
    vad = new VAD(VADMode.AGGRESSIVE, kSampleRate);

    // clear output context
    outputText.innerText = "";
    sourceNode = new MediaStreamAudioSourceNode(context, {
      mediaStream: stream,
    });
    await context.audioWorklet.addModule("streaming_processor.js");
    // 128 is the minimum length for audio worklet processing.
    const minBufferSize = vad.getMinBufferSize(
      lcm(chunkLength * kSampleRate, 128)
    );
    console.log(`VAD minBufferSize: ${minBufferSize / kSampleRate} sec`);
    const streamProperties = {
      minBufferSize: minBufferSize,
    };
    streamingNode = new AudioWorkletNode(context, "streaming-processor", {
      processorOptions: streamProperties,
    });

    streamingNode.port.onmessage = async (e) => {
      if (e.data.message === "START_TRANSCRIBE") {
        const frame = VAD.floatTo16BitPCM(e.data.buffer); // VAD requires Int16Array input
        const res = vad.processBuffer(frame);
        // has voice
        if (res == VADEvent.VOICE) {
          singleAudioChunk = concatBuffer(singleAudioChunk, e.data.buffer);
          // meet max audio chunk length for a single process, split it.
          if (singleAudioChunk.length >= kSampleRate * maxChunkLength) {
            if (subAudioChunkLength == 0) {
              // subAudioChunkLength >= kSampleRate * maxChunkLength
              subAudioChunkLength = singleAudioChunk.length;
            }
            audioChunks.push({ isSubChunk: true, data: singleAudioChunk });
            singleAudioChunk = null;
          }

          silenceAudioCounter = 0;
        } else {
          // no voice
          silenceAudioCounter++;
          // if only one silence chunk exists between two voice chunks,
          // just treat it as a continous audio chunk.
          if (singleAudioChunk != null && silenceAudioCounter > 1) {
            audioChunks.push({ isSubChunk: false, data: singleAudioChunk });
            singleAudioChunk = null;
          }
        }

        // new audio is coming, and no audio is processing
        if (lastProcessingCompleted && audioChunks.length > 0) {
          await processAudioBuffer();
        }
      }
    };

    sourceNode.connect(streamingNode).connect(context.destination);
  } catch (e) {
    log(`Error · Capturing audio - ${e.message}`);
  }
}

async function processAudioBuffer() {
  audioProcessing.setAttribute('class', 'show');
  lastProcessingCompleted = false;
  let processBuffer;
  const audioChunk = audioChunks.shift();
  // it is sub audio chunk, need to do rectification at last sub chunk
  if (audioChunk.isSubChunk) {
    subAudioChunks.push(audioChunk.data);
    // if the speech is pause, and it is the last audio chunk, concat the subAudioChunks to do rectification
    if (speechState == SpeechStates.PAUSED && audioChunks.length == 1) {
      processBuffer = concatBufferArray(subAudioChunks);
      subAudioChunks = []; // clear subAudioChunks
    } else if (subAudioChunks.length * maxChunkLength >= maxAudioLength) {
      // if total length of subAudioChunks >= maxAudioLength sec,
      // force to break it from subAudioChunks to reduce latency.
      processBuffer = concatBufferArray(subAudioChunks);
      subAudioChunks = [];
    } else {
        if (accumulateSubChunks) {
            processBuffer = concatBufferArray(subAudioChunks);
        } else {
            processBuffer = audioChunk.data;
        }
    }
  } else {
    // Slience detected, concat all subAudoChunks to do rectification
    if (subAudioChunks.length > 0) {
      subAudioChunks.push(audioChunk.data); // append sub chunk's next neighbor
      processBuffer = concatBufferArray(subAudioChunks);
      subAudioChunks = []; // clear subAudioChunks
    } else {
      // No other subAudioChunks, just process this one.
      processBuffer = audioChunk.data;
    }
  }
 
  // ignore too small audio chunk, e.g. 0.16 sec
  // per testing, audios less than 0.16 sec are almost blank audio
  const processBufferLength = processBuffer.length / kSampleRate;
  if (processBufferLength > 0.16) {
    const start = performance.now();
    const ret = await whisper.run(processBuffer);

    const processing_time = (performance.now() - start) / 1000;

    resultShow.setAttribute('class', 'show');
    latency.innerText = `${(
      processBufferLength / processing_time
    ).toFixed(1)} x realtime`;

    log(
      `${
        latency.innerText
      }, ${processBufferLength}s audio processing time: ${processing_time.toFixed(2)}s`
    );

    // ignore slient, inaudible audio output, i.e. '[BLANK_AUDIO]'
    if (!blacklistTags.includes(ret)) {
      if (subAudioChunks.length > 0) {
        if (accumulateSubChunks) {
          subText = ret;
        } else {
          subText += ret;
        }
        outputText.innerText = speechToText + subText;
      } else {
        subText = '';
        speechToText += ret;
        outputText.innerText = speechToText;
      }
      logUser(ret);
      // outputText.scrollTop = outputText.scrollHeight;
    }
  } else {
    console.warn(`drop too small audio chunk: ${processBufferLength}`);
  }

  if (processBufferLength > maxProcessAudioBufferLength) {
    maxProcessAudioBufferLength = processBufferLength;
  }
  lastProcessingCompleted = true;

  if (subAudioChunks.length == 0) {
    // clear subText
    subText = "";
  }

  if (audioChunks.length > 0) {
    let unprocessedAudioLength = 0;
    for (let i = 0; i < audioChunks.length; ++i) {
        unprocessedAudioLength += audioChunks[i].data.length;
    }
    unprocessedAudioLength /= kSampleRate;
    console.warn(`un-processed audio chunk length: ${(unprocessedAudioLength)} sec`);
    if (unprocessedAudioLength > maxUnprocessedAudioLength) {
        maxUnprocessedAudioLength = unprocessedAudioLength;
    }

    // recusive audioBuffer in audioChunks
    lastSpeechCompleted = false;
    await processAudioBuffer();
  } else {
    lastSpeechCompleted = true;
  }

  if (lastSpeechCompleted && speechState == SpeechStates.PAUSED) {
    ready();
  }
}

const setupORT = async () => {
  const ortversion = document.querySelector('#ortversion');
  removeElement('onnxruntime-web');
  let ortVersion = await getOrtDevVersion();
  // let ortLink = '';
  // if (ortVersion && ortVersion.length > 4) {
  //     await loadScript('onnxruntime-web', `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ortVersion}/dist/ort.all.min.js`);
  //     ortLink = `https://www.npmjs.com/package/onnxruntime-web/v/${ortVersion}`
  //     ortversion.innerHTML = `ONNX Runtime Web: <a href="${ortLink}">${ortVersion}</a>`;
  // } else {
  //     await loadScript('onnxruntime-web', './dist/ort.all.min.js');
  //     ortversion.innerHTML = `ONNX Runtime Web: Test version`;
  // }
  await loadScript('onnxruntime-web', '../../assets/dist/ort.all.js');
  ortversion.innerHTML = `ONNX Runtime Web: Test version`;
}

const main = async () => {
  device = document.getElementById('device');
  badge = document.getElementById('badge');
  audio_src = document.querySelector("audio");
  labelFileUpload = document.getElementById("label-file-upload");
  fileUpload = document.getElementById("file-upload");
  record = document.getElementById("record");
  speech = document.getElementById("speech");
  progress = document.getElementById("progress");
  outputText = document.getElementById("outputText");
  resultShow = document.getElementById("result-show");
  latency = document.getElementById("latency");
  audioProcessing = document.getElementById("audio-processing");
  copy = document.getElementById("copy");
  container = document.getElementById('container');
  
  labelFileUpload.setAttribute('class', 'file-upload-label disabled');
  fileUpload.disabled = true;
  record.disabled = true;
  speech.disabled = true;
  // progress.parentNode.style.display = "none";

  updateConfig();

  await setupORT();
  ort.env.wasm.numThreads = 1;
  ort.env.wasm.simd = true;

  if (deviceType.toLowerCase().indexOf("cpu") > -1 || provider.toLowerCase().indexOf("wasm") > -1) {
    device.innerHTML = "CPU";
    badge.setAttribute('class', 'cpu');
    document.body.setAttribute('class', 'cpu');
  } else if (deviceType.toLowerCase().indexOf("gpu") > -1 || provider.toLowerCase().indexOf("webgpu") > -1) {
    device.innerHTML = "GPU";
    badge.setAttribute('class', '');
    document.body.setAttribute('class', 'gpu');
  } else if (deviceType.toLowerCase().indexOf("npu") > -1) {
    device.innerHTML = "NPU";
    badge.setAttribute('class', 'npu');
    document.body.setAttribute('class', 'npu');
  }

  // click on Record
  record.addEventListener("click", (e) => {
    if (record.getAttribute('class').indexOf("active") == -1) {
      subText = "";
      record.setAttribute('class', 'active');
      startRecord();
    } else {
      record.setAttribute('class', '');
      stopRecord();
    }
  });

  // click on Speech
  speech.addEventListener("click", async (e) => {
    if (speech.getAttribute('class').indexOf("active") == -1) {
      if (!lastSpeechCompleted) {
        log("Last speech-to-text has not completed yet, try later...");
        return;
      }
      subText = "";
      speech.setAttribute('class', 'active');
      await startSpeech();
    } else {
      speech.setAttribute('class', '');
      speech.disabled = true;
      await stopSpeech();
    }
  });

  // drop file
  fileUpload.onchange = async function (evt) {
    labelFileUpload.setAttribute('class', 'file-upload-label disabled');
    fileUpload.disabled = true;
    record.disabled = true;
    speech.disabled = true;
    subText = "";
    if (!audio_src.paused) {
      audio_src.pause();
    }
    audio_src.src == "";
    let target = evt.target || window.event.src,
      files = target.files;
    if(files && files.length > 0) {
      audio_src.src = URL.createObjectURL(files[0]);
      audio_src.play();
      await transcribe_file();
    } else {
      audio_src.src = '';
    }
  };

  copy.addEventListener('click', async (e) => {
    try {
      await navigator.clipboard.writeText(outputText.innerText);
      logUser('The speech to text copied to clipboard');
    } catch (err) {
      logUser('Failed to copy');
      console.error('Failed to copy: ', err);
    }
  })

  log(`ONNX Runtime Web Execution Provider loaded · ${provider.toUpperCase()}`);
  try {
    context = new AudioContext({ sampleRate: kSampleRate });
    const whisper_url = location.href.includes("github.io")
      ? "https://huggingface.co/onnxruntime-web-temp/demo/resolve/main/whisper-base/"
      : "./models/";
    whisper = new Whisper(whisper_url, provider, deviceType, dataType);
    await whisper.create_whisper_processor();
    await whisper.create_whisper_tokenizer();
    await whisper.create_ort_sessions();
    log("Ready to transcribe ...");
    ready();
    context = new AudioContext({
      sampleRate: kSampleRate,
      channelCount: 1,
      echoCancellation: false,
      autoGainControl: true,
      noiseSuppression: true,
    });
    if (!context) {
      throw new Error(
        "no AudioContext, make sure domain has access to Microphone"
      );
    }

  } catch (e) {
    log(`Error · ${e.message}`);
  }

  try {
    audioMotion = new AudioMotionAnalyzer(
      container,
      {
        source: audio_src
      }
    );
    audioMotion.setOptions(options);
  }
  catch(err) {
    container.innerHTML = `Error: ${ err.message }`;
  }

};

const ui = async () => {
  let status = document.querySelector("#webnnstatus");
  let info = document.querySelector("#info");
  let webnnStatus = await webNnStatus();

  if (
    getQueryValue("provider") &&
    getQueryValue("provider").toLowerCase().indexOf("wasm") > -1
  ) {
    status.innerHTML = "";
    title.innerHTML = "WebAssembly";
    await main();
  } else if (
    getQueryValue("provider") &&
    getQueryValue("provider").toLowerCase().indexOf("webgpu") > -1
  ) {
    status.innerHTML = "";
    title.innerHTML = "WebGPU";
    await main();
  } else {
    if (webnnStatus.webnn) {
      status.setAttribute("class", "green");
      info.innerHTML = `WebNN supported · <a href="./?deviceType=gpu">GPU</a> · <a href="./?deviceType=npu">NPU</a>`;
      await main();
    } else {
      if (webnnStatus.error) {
        status.setAttribute("class", "red");
        info.innerHTML = `WebNN not supported: ${webnnStatus.error}`;
        log(`WebNN not supported: ${webnnStatus.error}`);
      } else {
        status.setAttribute("class", "red");
        info.innerHTML = "WebNN not supported";
        log("WebNN not supported");
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", ui, false);
