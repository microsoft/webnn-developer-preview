/* global ort */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
//
// An example how to run HTDemucs stem separation with WebNN in onnxruntime-web.
//

import {
    $,
    log,
    logError,
    setupORT,
    showCompatibleChromiumVersion,
    getWebnnStatus,
    getQueryValue,
    checkRemoteEnvironment,
    getHuggingFaceDomain,
} from "../../assets/js/common_utils.js";
import { WebNNPerf } from "../webnn-perf.js";
import {
    HOP,
    SAMPLE_RATE,
    SEGMENT_LENGTH,
    SPECTROGRAM_SHAPE,
    STEM_NAMES,
    WAVEFORM_SHAPE,
    addSegmentToStems,
    buildOverlapWeights,
    computeMixError,
    createStemBuffers,
    extractSegment,
    finalizeStemRange,
    getSegmentLayout,
    htdemucsPostForward,
    htdemucsPreForward,
} from "./htdemucs.js";
import {
    STREAM_LEAD_HOPS,
    mixerPause,
    publishStemRegion,
    resetStemMixer,
    startStemMixer,
    stemMixer,
    stemTransport,
    toggleStemMute,
    toggleStemSolo,
    updateStemTileStates,
    updateTransportUi,
} from "./stem_mixer.js";
import {
    computeLevels,
    decodeAudioFile,
    downloadWithProgress,
    encodeWavFloat32,
    readFromOPFS,
    resampleAudioBuffer,
    stripExtension,
    toMegabytes,
    toStereo,
    triggerDownload,
    writeToOPFS,
} from "./utils.js";
import { setupWaveform } from "./waveform.js";

const MODEL = {
    name: "htdemucs_fwd",
    host: checkRemoteEnvironment() ? "https://huggingface.co/webnn/stem-separator/resolve/main/onnx" : "./models",
    file: "htdemucs_fwd.onnx",
    externalData: "htdemucs_fwd.onnx.data",
    size: "170MB",
};

// Tried in this order when the backend select is "auto".
const BACKENDS = [
    { id: "webnn-npu", provider: "webnn", device: "npu", label: "WebNN NPU" },
    { id: "webnn-gpu", provider: "webnn", device: "gpu", label: "WebNN GPU" },
    { id: "webgpu", provider: "webgpu", device: "gpu", label: "WebGPU" },
    { id: "wasm", provider: "wasm", device: "cpu", label: "WASM" },
];

const VERBOSE = getQueryValue("verbose")?.toLowerCase() === "true";

const MIX_COLOR = "#3f6f9f";
const STEM_COLORS = {
    drums: "#e74c3c",
    bass: "#9b59b6",
    other: "#f39c12",
    vocals: "#27ae60",
};

const mainElement = $(".main");
const statusElement = $("#status");
const backendSelect = $("#backend-select");
const loadButton = $("#load-btn");
const inferButton = $("#infer-btn");
const audioFileInput = $("#audio-file");
const inputAudio = $("#input-audio");
let inputWaveformState = null; // destroy()ed and replaced whenever a new file is loaded
const mixPlayButton = $("#mix-play-btn");
const mixTrack = $("#mix-track");
const stemGrid = $("#stem-grid");
const resultsGateMessage = $("#results-gate-msg");
const loadwaveElement = $("#stage-loadwave");
const downloadAllButton = $("#download-all-btn");

let session = null;
let backendLabel = null;
// Backend-select value the live session was created from; null when there is no usable session.
let loadedSelection = null;
let audioInput = null; // { left, right, totalSamples, fileName }
const inferenceControlState = new Map();

// ============================================================================
// UI state
// ============================================================================

function updateBackendBadge(backend) {
    const normalized = String(backend || "").toLowerCase();
    const label = normalized.includes("npu")
        ? "NPU"
        : normalized.includes("gpu") || normalized === "auto"
          ? "GPU"
          : "CPU";
    $("#device").textContent = label;
    $("#badge").className = label === "NPU" ? "npu" : label === "CPU" ? "cpu" : "";
}

// Single place that derives the Load / Start buttons, badge and status from the session state.
function updateSessionState() {
    const hasSession = loadedSelection !== null;
    const stale = hasSession && backendSelect.value !== loadedSelection;
    loadButton.textContent = hasSession ? (stale ? "Reload Model" : "Model Loaded") : "Load Model";
    loadButton.disabled = !window.ort || (hasSession && !stale);
    loadButton.classList.toggle("attention", stale);
    inferButton.disabled = !hasSession || stale || !audioInput;
    if (hasSession) {
        updateBackendBadge(backendLabel);
        statusElement.innerHTML = stale
            ? `Backend changed — click <strong>Reload Model</strong> to apply. Still using <strong>${backendLabel}</strong>.`
            : `Session loaded with <strong>${backendLabel}</strong>`;
    } else {
        updateBackendBadge(backendSelect.value);
    }
}

function setInferenceControlsDisabled(disabled) {
    if (disabled) {
        for (const control of [backendSelect, loadButton, audioFileInput]) {
            inferenceControlState.set(control, control.disabled);
            control.disabled = true;
        }
        return;
    }
    inferenceControlState.forEach((wasDisabled, control) => {
        control.disabled = wasDisabled;
    });
    inferenceControlState.clear();
}

// Overall model-load progress, 0-100, drawn as the sdxl-turbo style loadwave over the Tracks stage.
function setLoadProgress(value, label) {
    loadwaveElement.hidden = false;
    // Over existing tracks the overlay turns translucent, so it is clear the results are still there.
    loadwaveElement.classList.toggle("over-tracks", !mixTrack.hidden);
    loadwaveElement.style.setProperty("--loadwave-value", value);
    $("#loadwave-value").textContent = Math.round(value);
    if (label !== undefined) $("#loadwave-label").textContent = label;
}

function hideLoadProgress() {
    loadwaveElement.hidden = true;
}

function showStageMessage(text) {
    $("#stage-msg").textContent = text;
    $("#stage-empty").hidden = false;
}

function showErrorBadge(element, message) {
    const badge = document.createElement("span");
    badge.className = "badge badge-error";
    badge.textContent = `Failed: ${message}`;
    element.replaceChildren(badge);
}

const checkWebNN = async () => {
    const status = $("#webnnstatus");
    const info = $("#info");
    const webnnStatus = await getWebnnStatus();

    if (webnnStatus.webnn) {
        status.setAttribute("class", "green");
        info.innerHTML = `WebNN supported · <a href="./?devicetype=gpu">GPU</a> · <a href="./?devicetype=npu">NPU</a>`;
    } else {
        status.setAttribute("class", "red");
        const reason = webnnStatus.error ? `WebNN not supported: ${webnnStatus.error}` : "WebNN not supported";
        info.innerHTML = `${reason} <a id="webnn_na" href="../../install.html" title="WebNN Installation Guide">Set up WebNN</a>`;
        logError(`[Error] ${reason}`);
    }
};

// ============================================================================
// Model loading and session creation
// ============================================================================

// `progressRange` is the [from, to] slice of the overall load progress this file fills.
async function loadModelFile(host, file, label, progressRange) {
    const [from, to] = progressRange;
    const opfsPath = `models/${MODEL.name}/${file}`;
    const cached = await readFromOPFS(opfsPath);
    if (cached) {
        log(`[Load] ${file} loaded from OPFS cache · ${toMegabytes(cached.byteLength)} MB`);
        setLoadProgress(to, `Loaded ${label} from cache`);
        return cached;
    }
    const buffer = await downloadWithProgress(`${host}/${file}`, (receivedBytes, totalBytes) => {
        setLoadProgress(
            from + ((to - from) * receivedBytes) / totalBytes,
            `Downloading ${label} · ${toMegabytes(receivedBytes)} / ${toMegabytes(totalBytes)} MB`,
        );
    });
    setLoadProgress(to);
    const savedToCache = await writeToOPFS(opfsPath, buffer);
    log(
        `[Load] ${file} downloaded from ${host}${savedToCache ? ", cached to OPFS" : ""} · ${toMegabytes(buffer.byteLength)} MB`,
    );
    return buffer;
}

async function loadModelBuffers() {
    let host = MODEL.host;
    if (host.includes("huggingface.co")) {
        host = host.replace("huggingface.co", await getHuggingFaceDomain());
    }
    const fetchFile = (file, label, progressRange) =>
        WebNNPerf.time("webnn.model.fetch", () => loadModelFile(host, file, label, progressRange), { model: file });
    const graph = await fetchFile(MODEL.file, "model graph", [0, 5]);
    const weights = await fetchFile(MODEL.externalData, "weights", [5, 85]);
    return { graph, weights };
}

async function detectAvailableBackends() {
    const available = new Set(["wasm"]);
    if ("ml" in navigator) {
        for (const device of ["npu", "gpu"]) {
            try {
                await navigator.ml.createContext({ deviceType: device });
                available.add(`webnn-${device}`);
            } catch {
                // device not supported
            }
        }
    }
    if ("gpu" in navigator) {
        try {
            if (await navigator.gpu.requestAdapter()) available.add("webgpu");
        } catch {
            // WebGPU not supported
        }
    }
    return available;
}

async function createSession({ graph, weights }, availableBackends, selection) {
    const candidates = selection === "auto" ? BACKENDS : BACKENDS.filter(backend => backend.id === selection);
    if (candidates.length === 0) {
        throw new Error(`Backend "${selection}" not found`);
    }
    for (const backend of candidates) {
        if (!availableBackends.has(backend.id)) {
            log(`[Session Create] ${backend.label} unavailable, skipped`);
            continue;
        }
        try {
            log(`[Session Create] Beginning ${MODEL.name} with ${backend.label}`);
            WebNNPerf.configure({ model: MODEL.name, device: backend.device, provider: backend.provider });
            const executionProvider = { name: backend.provider };
            if (backend.provider === "webnn") {
                executionProvider.deviceType = backend.device;
                executionProvider.context = await WebNNPerf.time("webnn.context.create", () =>
                    navigator.ml.createContext({ deviceType: backend.device }),
                );
            }
            const sessionOptions = {
                executionProviders: [executionProvider],
                logSeverityLevel: VERBOSE ? 0 : 3, // 0: verbose, 1: info, 2: warning, 3: error
                externalData: [{ data: weights, path: MODEL.externalData }],
            };
            const start = performance.now();
            const createdSession = await WebNNPerf.time(
                "webnn.session.create",
                () => ort.InferenceSession.create(graph, sessionOptions),
                { model: MODEL.name },
            );
            const sessionCreationTime = (performance.now() - start).toFixed(2);
            log(`[Session Create] Create ${MODEL.name} with ${backend.label} completed · ${sessionCreationTime}ms`);
            return { createdSession, backend };
        } catch (error) {
            log(`[Session Create] ${backend.label} failed: ${error.message}`);
        }
    }
    throw new Error("All backends failed");
}

async function loadModel() {
    loadButton.disabled = true;
    backendSelect.disabled = true;
    inferButton.disabled = true;
    // The overlay covers the tracks, so nothing underneath should keep playing.
    mixerPause();
    inputAudio.pause();
    mainElement.classList.add("busy");
    statusElement.textContent = "Loading...";
    setLoadProgress(0, "Preparing…");

    try {
        if (session) {
            // Freed before the new compile so two copies never sit on the NPU/GPU at once.
            const previousSession = session;
            session = null;
            loadedSelection = null;
            await previousSession.release?.();
            log(`[Load] Released previous ${backendLabel} session`);
        }

        const availableBackends = await detectAvailableBackends();
        const availableLabels = BACKENDS.filter(backend => availableBackends.has(backend.id)).map(
            backend => backend.label,
        );
        log(`[Load] Available backends: ${availableLabels.join(", ")}`);
        log(`[Load] Loading model ${MODEL.name} · ${MODEL.size}`);
        const modelBuffers = await loadModelBuffers();

        const selection = backendSelect.value;
        updateBackendBadge(selection);
        setLoadProgress(90, `Compiling for ${backendSelect.selectedOptions[0].textContent}…`);
        const { createdSession, backend } = await createSession(modelBuffers, availableBackends, selection);
        session = createdSession;
        backendLabel = backend.label;
        loadedSelection = selection;

        log("[Session Create] Ready to separate audio");
        audioFileInput.disabled = false;
        if (mixTrack.hidden) showStageMessage("Model ready — upload an audio file to begin.");
        setLoadProgress(100);
        updateSessionState();
    } catch (error) {
        logError(`[Load] failed, ${error.message}`);
        updateSessionState();
        showErrorBadge(statusElement, error.message);
        if (!session) $("#device").textContent = "—";
        if (mixTrack.hidden) showStageMessage("Model failed to load — see the log for details.");
    } finally {
        hideLoadProgress();
        mainElement.classList.remove("busy");
        backendSelect.disabled = false;
        if (!session) loadButton.disabled = false;
    }
}

// ============================================================================
// Audio input
// ============================================================================

function formatSampleCount(sampleCount) {
    return `${sampleCount.toLocaleString()} samples (${(sampleCount / SAMPLE_RATE).toFixed(2)}s)`;
}

// Stems from the previous run or file are stale the moment a new one starts: stop the mixer
// and clear them, so nothing keeps playing underneath and no mismatched results stay visible.
function clearStemResults() {
    for (const tile of Object.values(stemMixer.tiles)) tile.destroy?.();
    resetStemMixer();
    stemGrid.innerHTML = "";
    $("#stem-stats").innerHTML = "";
    downloadAllButton.disabled = true;
    downloadAllButton.onclick = null;
    resultsGateMessage.hidden = mixTrack.hidden;
}

async function handleAudioFile(file) {
    inputAudio.pause();
    audioInput = null;
    updateSessionState();
    const audioInfo = $("#audio-info");
    audioInfo.innerHTML = "";
    mixTrack.hidden = true;
    $("#track-file").textContent = file.name;
    showStageMessage("Decoding…");
    clearStemResults();

    log(`[Audio] Loading ${file.name} · ${toMegabytes(file.size)} MB`);
    const decoded = await decodeAudioFile(file);
    log(
        `[Audio] Decoded · ${decoded.sampleRate} Hz · ${decoded.numberOfChannels} ch · ${decoded.duration.toFixed(2)}s`,
    );
    showStageMessage("Resampling…");
    const resampled = await resampleAudioBuffer(decoded, SAMPLE_RATE);
    if (resampled !== decoded) log(`[Audio] Resampled to ${SAMPLE_RATE} Hz`);
    const { left, right, droppedChannels } = toStereo(resampled);
    if (droppedChannels > 0) {
        log(`[Audio] Using the first 2 of ${resampled.numberOfChannels} channels`);
    } else if (resampled.numberOfChannels === 1) {
        log("[Audio] Mono duplicated to stereo");
    }
    const totalSamples = left.length;
    const segmentLayout = getSegmentLayout(totalSamples);
    log(
        `[Audio] ${segmentLayout.count} segments · hop ${HOP} · last segment padded by ${segmentLayout.lastPadding.toLocaleString()} samples`,
    );

    inputAudio.pause();
    // The previous file's blob URL would otherwise pin that file for the life of the page.
    if (inputAudio.src.startsWith("blob:")) URL.revokeObjectURL(inputAudio.src);
    inputAudio.src = URL.createObjectURL(file);
    // A fresh canvas drops the previous file's click/pointer listeners; destroy() drops the ones
    // attached to the shared `inputAudio` clock, which would otherwise leak across file loads.
    inputWaveformState?.destroy();
    const previousWaveform = $("#input-waveform");
    const inputWaveform = previousWaveform.cloneNode(false);
    previousWaveform.replaceWith(inputWaveform);
    $("#stage-empty").hidden = true;
    mixTrack.hidden = false;
    resultsGateMessage.hidden = false;
    inputWaveformState = setupWaveform(inputWaveform, left, right, inputAudio, MIX_COLOR);
    audioInfo.innerHTML = `
        <details class="audio-details">
          <summary>Audio details</summary>
          <table class="tensor-table">
            <tr><th>Source</th><td>${decoded.sampleRate} Hz · ${decoded.numberOfChannels} ch · ${decoded.duration.toFixed(2)}s</td></tr>
            <tr><th>Resampled</th><td>${resampled === decoded ? "(not needed)" : `${SAMPLE_RATE} Hz · ${formatSampleCount(resampled.length)}`}</td></tr>
            <tr><th>Total samples @ 44.1kHz</th><td>${formatSampleCount(totalSamples)}</td></tr>
            <tr><th>Segments</th><td>${segmentLayout.count} × ${SEGMENT_LENGTH} samples (hop ${HOP}, overlap ${SEGMENT_LENGTH - HOP})</td></tr>
            <tr><th>Last segment padding</th><td>${segmentLayout.lastPadding.toLocaleString()} samples</td></tr>
          </table>
        </details>
      `;
    audioInput = { left, right, totalSamples, fileName: file.name };
    updateSessionState();
}

// ============================================================================
// Separation
// ============================================================================

async function runInference() {
    if (!session) throw new Error("Session not loaded — load the model first");
    if (!audioInput) throw new Error("No audio loaded — choose an audio file first");
    const { left, right, totalSamples, fileName } = audioInput;
    const progressFill = $("#infer-progress-fill");
    const progressLabel = $("#infer-progress-label");
    const etaElement = $("#infer-eta");
    const resultElement = $("#infer-result");
    $("#infer-progress-container").style.display = "block";
    progressFill.style.width = "0%";
    progressLabel.textContent = "0%";
    etaElement.textContent = "";
    resultElement.innerHTML = "";
    clearStemResults();

    const segmentCount = getSegmentLayout(totalSamples).count;
    const weights = buildOverlapWeights();
    // Preallocated, so the tiles can be built before any segment runs; the loop fills them in place.
    const stems = createStemBuffers(totalSamples);
    const weightTotals = new Float32Array(totalSamples);
    // Nothing above has awaited, so this is still the click task and the AudioContext may start.
    renderStemShells(stems, totalSamples, fileName);
    const leadSeconds = (STREAM_LEAD_HOPS * HOP) / SAMPLE_RATE;
    log(`[Session Run] Beginning ${segmentCount} segments, playback starts after ${leadSeconds.toFixed(1)}s of audio`);

    let frontier = 0; // samples finalized and handed to the mixer
    let inferenceMs = 0; // per-segment time only, so backends compare without streaming overhead
    let streamingMs = 0;
    let firstSegmentMs = 0;
    const startTime = performance.now();
    for (let segmentIndex = 0; segmentIndex < segmentCount; segmentIndex++) {
        const segment = extractSegment(left, right, segmentIndex);
        const segmentStart = performance.now();
        const { spectrogram, waveform, spectrogramStats, waveformStats } = htdemucsPreForward(segment);
        const inputs = {
            x: new ort.Tensor("float32", spectrogram, SPECTROGRAM_SHAPE),
            xt: new ort.Tensor("float32", waveform, WAVEFORM_SHAPE),
        };
        const outputs = await WebNNPerf.time("webnn.inference", () => session.run(inputs), {
            model: MODEL.name,
            iteration: segmentIndex + 1,
        });
        const sources = htdemucsPostForward(outputs.x_out.data, outputs.xt_out.data, spectrogramStats, waveformStats);
        const segmentMs = performance.now() - segmentStart;
        if (segmentIndex === 0) firstSegmentMs = segmentMs;
        inferenceMs += segmentMs;
        addSegmentToStems(stems, weightTotals, sources, weights, segmentIndex * HOP);
        for (const tensor of [...Object.values(inputs), ...Object.values(outputs)]) tensor.dispose?.();

        const streamingStart = performance.now();
        // The last segment has no successor, so it closes out the tail in one jump.
        const newFrontier =
            segmentIndex === segmentCount - 1 ? totalSamples : Math.min((segmentIndex + 1) * HOP, totalSamples);
        if (newFrontier > frontier) {
            finalizeStemRange(stems, weightTotals, frontier, newFrontier);
            const wallSeconds = (performance.now() - startTime) / 1000;
            stemMixer.streamRatio = wallSeconds > 0 ? newFrontier / SAMPLE_RATE / wallSeconds : 0;
            publishStemRegion(stems, frontier, newFrontier);
            frontier = newFrontier;
        }
        streamingMs += performance.now() - streamingStart;

        const elapsedSeconds = (performance.now() - startTime) / 1000;
        const remainingSeconds = (elapsedSeconds / (segmentIndex + 1)) * (segmentCount - segmentIndex - 1);
        progressFill.style.width = `${((segmentIndex + 1) / segmentCount) * 100}%`;
        progressLabel.textContent = `${segmentIndex + 1} / ${segmentCount}`;
        etaElement.textContent = `Elapsed ${elapsedSeconds.toFixed(1)}s · est. remaining ${remainingSeconds.toFixed(1)}s · last segment ${(segmentMs / 1000).toFixed(2)}s`;
        log(`[Session Run] Segment ${segmentIndex + 1}/${segmentCount} · ${segmentMs.toFixed(2)}ms`);
        await new Promise(resolve => requestAnimationFrame(resolve));
    }

    const wallSeconds = (performance.now() - startTime) / 1000;
    const inferenceSeconds = inferenceMs / 1000;
    const streamingSeconds = streamingMs / 1000;
    const audioSeconds = totalSamples / SAMPLE_RATE;
    const realtimeRatio = audioSeconds / wallSeconds;
    const inferenceRatio = audioSeconds / inferenceSeconds;
    log(
        `[Session Run] Separation completed · ${wallSeconds.toFixed(1)}s (${realtimeRatio.toFixed(2)}× realtime), first segment ${(firstSegmentMs / 1000).toFixed(2)}s`,
    );
    log(
        `[Session Run] Pure inference ${inferenceSeconds.toFixed(1)}s (${inferenceRatio.toFixed(2)}× realtime) · streaming overhead ${streamingSeconds.toFixed(2)}s`,
    );
    resultElement.innerHTML = `
        <span class="result-ok">✓ Separated in ${wallSeconds.toFixed(1)}s · ${realtimeRatio.toFixed(2)}× realtime · ${backendLabel}</span>
        <span class="result-sub">pure inference ${inferenceSeconds.toFixed(1)}s (${inferenceRatio.toFixed(2)}×) · streaming overhead ${streamingSeconds.toFixed(2)}s</span>
      `;
    showStemStatistics(stems, left, right);
    finalizeStemResults(stems, fileName);
}

function showStemStatistics(stems, left, right) {
    const rows = STEM_NAMES.map(name => {
        const leftLevels = computeLevels(stems[name].left);
        const rightLevels = computeLevels(stems[name].right);
        const cells = [leftLevels.peak, rightLevels.peak, leftLevels.rms, rightLevels.rms]
            .map(value => `<td>${value.toFixed(4)}</td>`)
            .join("");
        return `<tr><td>${name}</td>${cells}</tr>`;
    });
    $("#stem-stats").innerHTML = `
        <details class="audio-details">
          <summary>Stem statistics</summary>
          <table class="tensor-table">
            <tr><th>Stem</th><th>Peak L</th><th>Peak R</th><th>RMS L</th><th>RMS R</th></tr>
            ${rows.join("")}
          </table>
          <div class="result-note">
            sum-of-stems vs mix MAE: ${computeMixError(stems, left, right).toExponential(3)} (small ≈ correct overlap-add)
          </div>
        </details>
      `;
}

// ============================================================================
// Stem tracks
// ============================================================================

// Tiles, waveforms, mute / solo and the audio graph: everything that does not need finished audio.
function renderStemShells(stems, totalSamples, fileName) {
    startStemMixer(totalSamples);
    const baseName = stripExtension(fileName);

    for (const name of STEM_NAMES) {
        const tile = document.createElement("div");
        tile.className = "track";
        tile.innerHTML = `
          <div class="track-head">
            <div class="track-name" style="color: ${STEM_COLORS[name]};">${name}</div>
            <div class="stem-toggles">
              <button class="stem-toggle mute" aria-pressed="false" title="Mute ${name}">M</button>
              <button class="stem-toggle solo" aria-pressed="false" title="Solo ${name}">S</button>
            </div>
          </div>
          <canvas class="track-waveform" aria-label="${name} waveform"></canvas>
          <div class="track-tail">
            <button class="icon-btn small stem-download-btn" disabled>
              <svg viewBox="0 -960 960 960"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" /></svg>
            </button>
            <div class="stem-size">—</div>
          </div>
        `;
        stemGrid.appendChild(tile);
        const canvas = tile.querySelector(".track-waveform");
        const waveformState = setupWaveform(
            canvas,
            stems[name].left,
            stems[name].right,
            stemTransport,
            STEM_COLORS[name],
            () => (stemMixer.streaming ? stemMixer.frontierSamples : stemMixer.totalSamples),
        );
        const muteButton = tile.querySelector(".stem-toggle.mute");
        const soloButton = tile.querySelector(".stem-toggle.solo");
        const downloadButton = tile.querySelector(".stem-download-btn");
        downloadButton.title = `Separating ${baseName}.${name}.wav…`;
        muteButton.addEventListener("click", () => toggleStemMute(name));
        soloButton.addEventListener("click", () => toggleStemSolo(name));
        stemMixer.tiles[name] = {
            muteButton,
            soloButton,
            canvas,
            sizeElement: tile.querySelector(".stem-size"),
            downloadButton,
            redraw: () => waveformState.draw(),
            destroy: () => waveformState.destroy(),
        };
    }
    resultsGateMessage.hidden = true;
    updateTransportUi();
    updateStemTileStates();
}

// Enables downloads. Clearing `streaming` lifts the seek clamp and drops the frontier marker.
// WAVs are encoded on click, one at a time, so the stems are never held a second time as blobs.
function finalizeStemResults(stems, fileName) {
    const baseName = stripExtension(fileName);
    stemMixer.streaming = false;
    const downloadStem = name => {
        const encodeStart = performance.now();
        const blob = encodeWavFloat32(stems[name].left, stems[name].right, SAMPLE_RATE);
        const encodeTime = (performance.now() - encodeStart).toFixed(2);
        log(`[Encode] ${name} encoded to WAV · ${toMegabytes(blob.size)} MB · ${encodeTime}ms`);
        triggerDownload(blob, `${baseName}.${name}.wav`);
    };
    // Same size encodeWavFloat32 produces: 44-byte header + stereo float32 samples.
    const wavBytes = 44 + stems[STEM_NAMES[0]].left.length * 8;
    for (const name of STEM_NAMES) {
        const tile = stemMixer.tiles[name];
        tile.sizeElement.textContent = `${toMegabytes(wavBytes)} MB`;
        tile.downloadButton.disabled = false;
        tile.downloadButton.title = `Download ${baseName}.${name}.wav`;
        tile.downloadButton.onclick = () => downloadStem(name);
        tile.redraw();
    }
    downloadAllButton.disabled = false;
    downloadAllButton.onclick = async () => {
        for (const name of STEM_NAMES) {
            downloadStem(name);
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    };
    updateTransportUi();
}

// ============================================================================
// Initialization and event handlers
// ============================================================================

// Same query scheme as the other demos: ?provider=webnn|webgpu|wasm&devicetype=npu|gpu.
function applyBackendFromQuery() {
    const provider = getQueryValue("provider")?.toLowerCase();
    const deviceType = getQueryValue("devicetype")?.toLowerCase();
    if (!provider && !deviceType) return;
    const target = provider === "webgpu" || provider === "wasm" ? provider : `webnn-${deviceType || "gpu"}`;
    if (!BACKENDS.some(backend => backend.id === target)) return;
    backendSelect.value = target;
    updateBackendBadge(target);
}

const ui = async () => {
    applyBackendFromQuery();
    await setupORT("stem-separator", "dev");
    showCompatibleChromiumVersion("stem-separator");
    ort.env.wasm.numThreads = 1;
    ort.env.wasm.simd = true;
    // WASM and WebGPU still work without WebNN, so loading is not gated on the check below.
    loadButton.disabled = false;
    await checkWebNN();
};

if (document.readyState !== "loading") {
    ui();
} else {
    document.addEventListener("DOMContentLoaded", ui, false);
}

loadButton.addEventListener("click", loadModel);
backendSelect.addEventListener("change", updateSessionState);

mixPlayButton.addEventListener("click", () => {
    if (inputAudio.paused) inputAudio.play().catch(() => {});
    else inputAudio.pause();
});
// The mix preview and the stem mixer share the speakers, so only one plays at a time.
inputAudio.addEventListener("play", () => {
    mixPlayButton.classList.add("playing");
    mixerPause();
});
inputAudio.addEventListener("pause", () => mixPlayButton.classList.remove("playing"));

inferButton.addEventListener("click", async () => {
    inferButton.disabled = true;
    setInferenceControlsDisabled(true);
    try {
        await runInference();
    } catch (error) {
        logError(`[Session Run] failed, ${error.message}`);
        showErrorBadge($("#infer-result"), error.message);
        // Keep `streaming` set so seeking stays clamped to the audio that did finalize.
        mixerPause();
        stemMixer.resumeOnPublish = false;
        for (const tile of Object.values(stemMixer.tiles)) tile.downloadButton.title = "Separation incomplete";
        updateTransportUi();
    } finally {
        setInferenceControlsDisabled(false);
        updateSessionState();
    }
});

audioFileInput.addEventListener("change", async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    audioFileInput.disabled = true;
    try {
        await handleAudioFile(file);
    } catch (error) {
        logError(`[Audio] failed, ${error.message}`);
        showStageMessage(`Failed to load audio: ${error.message}`);
    } finally {
        audioFileInput.disabled = false;
    }
});
