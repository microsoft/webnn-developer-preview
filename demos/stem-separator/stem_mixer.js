// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
//
// Stem mixer: one AudioContext drives all four stems from a single clock so they stay
// sample-accurate. Each stem has a persistent GainNode; mute / solo only ever changes gain.
//

import { $ } from "../../assets/js/common_utils.js";
import { HOP, SAMPLE_RATE, STEM_NAMES } from "./htdemucs.js";
import { formatClock } from "./utils.js";

const GAIN_RAMP_SECONDS = 0.01;
const START_LEAD_SECONDS = 0.02;
// Streaming playback waits for this many hops of finalized audio. pre/post_forward block the
// main thread for ~1s at a time, which two hops (7.8s) comfortably covers.
export const STREAM_LEAD_HOPS = 2;
// Refuse to start with less playable audio than this, rather than underrun on the first frame.
const MIN_PLAYABLE_SECONDS = 0.05;
// AudioBuffers are built only for regions starting within this window of now, so playback holds a
// few seconds of audio rather than a second copy of the whole track. Three hops leave at least one
// queued region (3.9s) of slack when the main thread is busy as a region ends.
const SCHEDULE_AHEAD_SECONDS = (3 * HOP) / SAMPLE_RATE;

const playButton = $("#mixer-play-btn");
const stopButton = $("#mixer-stop-btn");
const clockElement = $("#mixer-clock");
const streamStatElement = $("#mixer-stream-stat");

export const stemMixer = {
    context: null,
    gains: {},
    stems: null, // { [name]: { left, right } } Float32Arrays the regions are read from
    // Finalized audio as [{ startSample, length }]. AudioBuffers cannot grow, so each region is
    // scheduled as its own buffers on the shared clock, created just before it plays.
    regions: [],
    scheduledRegionCount: 0,
    activeSources: [],
    muted: new Set(),
    solo: new Set(),
    tiles: {}, // name -> { muteButton, soloButton, canvas, sizeElement, downloadButton, redraw }
    listeners: { play: [], pause: [], ended: [] },
    duration: 0,
    totalSamples: 0,
    frontierSamples: 0, // how far separation has finalized
    streaming: false, // true while a separation run is still producing
    streamRatio: 0, // realtime multiple so far, for the live readout
    autoStarted: false,
    resumeOnPublish: false,
    playing: false,
    startedAt: 0, // context time when the current playback began
    startOffset: 0, // track position at that instant
    clockAnimationFrame: null,
};

// Duck-types the slice of HTMLAudioElement that setupWaveform consumes.
export const stemTransport = {
    get duration() {
        return stemMixer.duration;
    },
    get paused() {
        return !stemMixer.playing;
    },
    get currentTime() {
        return mixerPosition();
    },
    set currentTime(value) {
        mixerSeek(value);
    },
    addEventListener(type, callback) {
        stemMixer.listeners[type]?.push(callback);
    },
    removeEventListener(type, callback) {
        const listeners = stemMixer.listeners[type];
        const index = listeners?.indexOf(callback) ?? -1;
        if (index >= 0) listeners.splice(index, 1);
    },
};

function mixerEmit(type) {
    for (const callback of stemMixer.listeners[type]) callback();
}

function mixerPosition() {
    if (!stemMixer.playing || !stemMixer.context) return stemMixer.startOffset;
    const elapsed = Math.max(0, stemMixer.context.currentTime - stemMixer.startedAt);
    return Math.min(stemMixer.startOffset + elapsed, stemMixer.duration);
}

// Furthest position with audio behind it: the separation frontier while streaming, else the whole track.
function mixerPlayableLimit() {
    return stemMixer.streaming ? stemMixer.frontierSamples / SAMPLE_RATE : stemMixer.duration;
}

// Solo overrides mute without clearing it, so dropping the last solo restores the previous mutes.
function effectiveStemGain(name) {
    const audible = stemMixer.solo.size > 0 ? stemMixer.solo.has(name) : !stemMixer.muted.has(name);
    return audible ? 1 : 0;
}

function applyStemGains() {
    const context = stemMixer.context;
    for (const name of STEM_NAMES) {
        const gain = stemMixer.gains[name];
        if (!gain || !context) continue;
        // A step change on a running signal clicks; ramp instead.
        const now = context.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(effectiveStemGain(name), now + GAIN_RAMP_SECONDS);
    }
    updateStemTileStates();
}

export function updateStemTileStates() {
    for (const name of STEM_NAMES) {
        const tile = stemMixer.tiles[name];
        if (!tile) continue;
        const isMuted = stemMixer.muted.has(name);
        const isSolo = stemMixer.solo.has(name);
        tile.muteButton.classList.toggle("active", isMuted);
        tile.soloButton.classList.toggle("active", isSolo);
        tile.muteButton.setAttribute("aria-pressed", String(isMuted));
        tile.soloButton.setAttribute("aria-pressed", String(isSolo));
        tile.canvas.dataset.dimmed = effectiveStemGain(name) > 0 ? "" : "1";
        tile.redraw();
    }
}

export function toggleStemMute(name) {
    if (!stemMixer.muted.delete(name)) stemMixer.muted.add(name);
    applyStemGains();
}

export function toggleStemSolo(name) {
    if (!stemMixer.solo.delete(name)) stemMixer.solo.add(name);
    applyStemGains();
}

function createMixerContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContextClass({ sampleRate: SAMPLE_RATE });
    stemMixer.context = context;
    for (const name of STEM_NAMES) {
        const gain = context.createGain();
        gain.gain.value = effectiveStemGain(name);
        gain.connect(context.destination);
        stemMixer.gains[name] = gain;
    }
}

// Must run inside the Start Separation click task, so the AudioContext starts under the autoplay policy.
export function startStemMixer(totalSamples) {
    resetStemMixer();
    stemMixer.totalSamples = totalSamples;
    stemMixer.duration = totalSamples / SAMPLE_RATE;
    // Set before the waveforms first draw, or they would paint the still-empty arrays as complete.
    stemMixer.streaming = true;
    createMixerContext();
}

// Marks a finalized range playable. Ranges must never overlap, so callers advance a single
// monotonic frontier.
export function publishStemRegion(stems, fromSample, toSample) {
    const length = toSample - fromSample;
    if (!stemMixer.context || length <= 0) return;
    stemMixer.stems = stems;
    stemMixer.regions.push({ startSample: fromSample, length });
    stemMixer.frontierSamples = toSample;

    if (stemMixer.resumeOnPublish && !stemMixer.playing) {
        stemMixer.resumeOnPublish = false;
        mixerPlay().catch(() => {});
    } else if (stemMixer.playing) {
        scheduleReadyRegions();
    }
    const leadSamples = Math.min(stemMixer.totalSamples, STREAM_LEAD_HOPS * HOP);
    if (stemMixer.streaming && !stemMixer.autoStarted && stemMixer.frontierSamples >= leadSamples) {
        stemMixer.autoStarted = true;
        mixerPlay().catch(() => {});
    }
    updateTransportUi();
    for (const name of STEM_NAMES) stemMixer.tiles[name]?.redraw();
}

function createRegionBuffer(region, name) {
    const { left, right } = stemMixer.stems[name];
    const end = region.startSample + region.length;
    const buffer = stemMixer.context.createBuffer(2, region.length, SAMPLE_RATE);
    buffer.copyToChannel(left.subarray(region.startSample, end), 0);
    buffer.copyToChannel(right.subarray(region.startSample, end), 1);
    return buffer;
}

// Drops a finished source so its AudioBuffer can be collected.
function releaseSource(source) {
    source.disconnect();
    const index = stemMixer.activeSources.indexOf(source);
    if (index >= 0) stemMixer.activeSources.splice(index, 1);
}

// Called again from each region's onended (not rAF), so playback keeps going in a hidden tab.
function scheduleReadyRegions() {
    const context = stemMixer.context;
    if (!stemMixer.playing || !context) return;
    const horizon = context.currentTime + SCHEDULE_AHEAD_SECONDS;
    while (stemMixer.scheduledRegionCount < stemMixer.regions.length) {
        const region = stemMixer.regions[stemMixer.scheduledRegionCount];
        const regionPosition = region.startSample / SAMPLE_RATE;
        const regionSeconds = region.length / SAMPLE_RATE;
        // Every start time derives from the one (startedAt, startOffset) origin mixerPosition() reads,
        // so regions cannot drift apart and stems cannot drift against each other.
        let when = stemMixer.startedAt + (regionPosition - stemMixer.startOffset);
        if (when > horizon) break; // scheduled when an earlier region ends
        stemMixer.scheduledRegionCount++;
        let offset = 0;
        if (when < context.currentTime) {
            offset = context.currentTime - when;
            if (offset >= regionSeconds) continue; // entirely behind the playhead
            when = context.currentTime;
        }
        const isLast = region.startSample + region.length >= stemMixer.totalSamples;
        for (const name of STEM_NAMES) {
            const source = context.createBufferSource();
            source.buffer = createRegionBuffer(region, name);
            source.connect(stemMixer.gains[name]);
            source.onended =
                name === STEM_NAMES[0]
                    ? () => {
                          releaseSource(source);
                          // Backstop for end-of-track while the tab is hidden and rAF is parked.
                          if (isLast) mixerHandleEnded();
                          else scheduleReadyRegions();
                      }
                    : () => releaseSource(source);
            source.start(when, offset);
            stemMixer.activeSources.push(source);
        }
    }
}

function mixerStopSources() {
    for (const source of stemMixer.activeSources) {
        source.onended = null; // our own stop() must not look like end-of-track
        try {
            source.stop();
        } catch {
            // never started
        }
        source.disconnect();
    }
    stemMixer.activeSources = [];
    stemMixer.scheduledRegionCount = 0;
}

function startTransportClock() {
    const tick = () => {
        if (stemMixer.playing) {
            const position = mixerPosition();
            if (!stemMixer.streaming && position >= stemMixer.duration - 0.001) {
                mixerHandleEnded();
                return;
            }
            if (stemMixer.streaming && position > mixerPlayableLimit() + 0.001) {
                mixerUnderrun();
                return;
            }
        }
        updateTransportUi();
        if (stemMixer.playing) stemMixer.clockAnimationFrame = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(stemMixer.clockAnimationFrame);
    tick();
}

// The playhead caught the frontier (a segment took longer than the 3.9s hop it yields):
// park on it and resume when the next region lands.
function mixerUnderrun() {
    const limit = mixerPlayableLimit();
    mixerStopSources();
    stemMixer.playing = false;
    stemMixer.startOffset = limit;
    stemMixer.resumeOnPublish = true;
    updateTransportUi();
    mixerEmit("pause");
}

async function mixerPlay() {
    if (stemMixer.playing || !stemMixer.context || !stemMixer.regions.length) return;
    let offset = stemMixer.startOffset;
    if (offset >= stemMixer.duration - 0.01) offset = 0;
    const limit = mixerPlayableLimit();
    if (offset > limit - MIN_PLAYABLE_SECONDS) {
        // Nothing separated past here yet; wait for the next region.
        stemMixer.startOffset = Math.max(0, Math.min(offset, limit));
        stemMixer.resumeOnPublish = stemMixer.streaming;
        updateTransportUi();
        return;
    }
    const context = stemMixer.context;
    if (context.state === "suspended") {
        try {
            await context.resume();
        } catch {
            return; // no user gesture available; leave the transport idle
        }
    }
    $("#input-audio").pause();
    stemMixer.startedAt = context.currentTime + START_LEAD_SECONDS;
    stemMixer.startOffset = offset;
    stemMixer.playing = true;
    stemMixer.scheduledRegionCount = 0;
    scheduleReadyRegions();
    startTransportClock();
    mixerEmit("play");
}

export function mixerPause() {
    if (!stemMixer.playing) return;
    const position = mixerPosition();
    mixerStopSources();
    stemMixer.playing = false;
    stemMixer.resumeOnPublish = false;
    stemMixer.startOffset = position;
    updateTransportUi();
    mixerEmit("pause");
}

function mixerHandleEnded() {
    mixerStopSources();
    stemMixer.playing = false;
    stemMixer.resumeOnPublish = false;
    stemMixer.startOffset = 0;
    updateTransportUi();
    mixerEmit("ended");
}

// Clamped to the frontier, so a click past it lands on the boundary instead of silence.
function mixerSeek(seconds) {
    const target = Math.max(0, Math.min(seconds, mixerPlayableLimit()));
    const wasPlaying = stemMixer.playing;
    if (wasPlaying) mixerStopSources();
    stemMixer.playing = false;
    stemMixer.startOffset = target;
    if (wasPlaying) mixerPlay().catch(() => {});
    else updateTransportUi();
}

export function updateTransportUi() {
    const hasAudio = stemMixer.regions.length > 0;
    playButton.classList.toggle("playing", stemMixer.playing);
    playButton.title = stemMixer.playing ? "Pause stems" : "Play stems";
    playButton.disabled = !hasAudio;
    stopButton.disabled = !hasAudio;
    clockElement.textContent = `${formatClock(mixerPosition())} / ${formatClock(stemMixer.duration)}`;
    streamStatElement.style.display = stemMixer.streaming ? "" : "none";
    if (stemMixer.streaming) {
        const ratio = stemMixer.streamRatio ? ` · ${stemMixer.streamRatio.toFixed(1)}× realtime` : "";
        const stalled = stemMixer.resumeOnPublish ? " · waiting for audio" : "";
        streamStatElement.textContent = `separated ${formatClock(mixerPlayableLimit())}${ratio}${stalled}`;
    }
}

// Drops the previous run's stems (~340 MB for a four-minute track), audio graph and waveform listeners.
export async function resetStemMixer() {
    mixerStopSources();
    cancelAnimationFrame(stemMixer.clockAnimationFrame);
    const context = stemMixer.context;
    Object.assign(stemMixer, {
        context: null,
        stems: null,
        regions: [],
        gains: {},
        tiles: {},
        listeners: { play: [], pause: [], ended: [] },
        duration: 0,
        totalSamples: 0,
        frontierSamples: 0,
        streaming: false,
        streamRatio: 0,
        autoStarted: false,
        resumeOnPublish: false,
        playing: false,
        startedAt: 0,
        startOffset: 0,
        clockAnimationFrame: null,
    });
    stemMixer.muted.clear();
    stemMixer.solo.clear();
    updateTransportUi();
    if (context && context.state !== "closed") {
        try {
            await context.close();
        } catch {
            // already closing
        }
    }
}

playButton.addEventListener("click", () => {
    if (stemMixer.playing) mixerPause();
    else mixerPlay();
});
stopButton.addEventListener("click", () => {
    if (stemMixer.playing) {
        mixerSeek(0);
    } else {
        stemMixer.startOffset = 0;
        updateTransportUi();
        mixerEmit("pause"); // redraw the playheads at zero
    }
});
