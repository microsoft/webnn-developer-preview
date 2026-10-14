// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
//
// Browser helpers for the stem separator: OPFS cache, downloads, audio decoding and WAV encoding.
//

import { log } from "../../assets/js/common_utils.js";

export const toMegabytes = bytes => (bytes / 1048576).toFixed(1);

export function formatClock(seconds) {
    const total = Math.max(0, Math.floor(seconds));
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export function stripExtension(fileName) {
    const dot = fileName.lastIndexOf(".");
    return dot > 0 ? fileName.substring(0, dot) : fileName;
}

// ============================================================================
// OPFS cache and downloads
// ============================================================================

async function getOpfsFileHandle(path, create) {
    const parts = path.split("/").filter(Boolean);
    let directory = await navigator.storage.getDirectory();
    for (const part of parts.slice(0, -1)) {
        directory = await directory.getDirectoryHandle(part, { create });
    }
    return directory.getFileHandle(parts[parts.length - 1], { create });
}

export async function readFromOPFS(path) {
    try {
        const file = await (await getOpfsFileHandle(path, false)).getFile();
        return await file.arrayBuffer();
    } catch {
        return null;
    }
}

export async function writeToOPFS(path, arrayBuffer) {
    try {
        const writable = await (await getOpfsFileHandle(path, true)).createWritable();
        await writable.write(arrayBuffer);
        await writable.close();
        return true;
    } catch (error) {
        log(`[Load] OPFS write failed: ${error.message}`);
        return false;
    }
}

export async function downloadWithProgress(url, onProgress) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const totalBytes = parseInt(response.headers.get("content-length") || "0", 10);
    const reader = response.body.getReader();
    const chunks = [];
    let receivedBytes = 0;
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedBytes += value.length;
        if (totalBytes) onProgress(receivedBytes, totalBytes);
    }
    const buffer = new Uint8Array(receivedBytes);
    let offset = 0;
    for (const chunk of chunks) {
        buffer.set(chunk, offset);
        offset += chunk.length;
    }
    return buffer.buffer;
}

export function triggerDownload(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ============================================================================
// Audio decoding and WAV encoding
// ============================================================================

export async function decodeAudioFile(file) {
    const arrayBuffer = await file.arrayBuffer();
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    try {
        return await audioContext.decodeAudioData(arrayBuffer);
    } finally {
        await audioContext.close();
    }
}

export async function resampleAudioBuffer(audioBuffer, sampleRate) {
    if (audioBuffer.sampleRate === sampleRate) return audioBuffer;
    const length = Math.ceil(audioBuffer.duration * sampleRate);
    const offlineContext = new OfflineAudioContext(audioBuffer.numberOfChannels, length, sampleRate);
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start(0);
    return await offlineContext.startRendering();
}

// Takes the first two channels; mono is duplicated to stereo.
export function toStereo(audioBuffer) {
    const left = audioBuffer.getChannelData(0);
    if (audioBuffer.numberOfChannels === 1) {
        return { left, right: left.slice(), droppedChannels: 0 };
    }
    return { left, right: audioBuffer.getChannelData(1), droppedChannels: audioBuffer.numberOfChannels - 2 };
}

export function computeLevels(samples) {
    let peak = 0;
    let sumOfSquares = 0;
    for (let i = 0; i < samples.length; i++) {
        peak = Math.max(peak, Math.abs(samples[i]));
        sumOfSquares += samples[i] * samples[i];
    }
    return { peak, rms: Math.sqrt(sumOfSquares / samples.length) };
}

// 32-bit float stereo WAV (WAVE_FORMAT_IEEE_FLOAT), openable in openDAW, Reaper, Audacity, Ableton, etc.
export function encodeWavFloat32(left, right, sampleRate) {
    const channelCount = 2;
    const bytesPerSample = 4;
    const blockAlign = channelCount * bytesPerSample;
    const dataSize = left.length * blockAlign;
    const view = new DataView(new ArrayBuffer(44 + dataSize));
    const writeString = (offset, text) => {
        for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
    };
    writeString(0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 3, true); // WAVE_FORMAT_IEEE_FLOAT
    view.setUint16(22, channelCount, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bytesPerSample * 8, true);
    writeString(36, "data");
    view.setUint32(40, dataSize, true);
    for (let i = 0, offset = 44; i < left.length; i++, offset += blockAlign) {
        view.setFloat32(offset, left[i], true);
        view.setFloat32(offset + bytesPerSample, right[i], true);
    }
    return new Blob([view.buffer], { type: "audio/wav" });
}
