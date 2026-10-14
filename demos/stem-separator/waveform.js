// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
//
// Canvas waveforms with a playhead and, while separating, a frontier marker.
//

// Peaks are painted once into an offscreen layer rather than every frame: with four stems
// animating in sync a per-frame rescan would be ~10M samples x 4 x 60fps.
function createWaveformLayer(width, height, pixelRatio) {
    const layer = document.createElement("canvas");
    layer.width = Math.max(1, Math.floor(width * pixelRatio));
    layer.height = Math.max(1, Math.floor(height * pixelRatio));
    const context = layer.getContext("2d");
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.fillStyle = "#f5f5f5";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "#d9d9d9";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, height / 2 + 0.5);
    context.lineTo(width, height / 2 + 0.5);
    context.stroke();
    return layer;
}

// Paints columns [fromX, toX) into the layer. Streaming appends columns as regions finalize, so a
// whole run stays O(total samples); columns are the unit so a partial column is never stroked twice.
function paintWaveformColumns(layer, width, height, pixelRatio, left, right, color, fromX, toX) {
    const total = left.length;
    if (toX <= fromX || !total) return;
    const context = layer.getContext("2d");
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const middle = height / 2;
    const peakHeight = height * 0.42;
    context.strokeStyle = color;
    context.globalAlpha = 0.8;
    context.lineWidth = 1;
    context.beginPath();
    for (let x = fromX; x < toX; x++) {
        const start = Math.floor((x * total) / width);
        const end = Math.max(start + 1, Math.floor(((x + 1) * total) / width));
        let minimum = 1;
        let maximum = -1;
        for (let i = start; i < end && i < total; i++) {
            const sample = ((left[i] || 0) + (right[i] || 0)) * 0.5;
            minimum = Math.min(minimum, sample);
            maximum = Math.max(maximum, sample);
        }
        context.moveTo(x + 0.5, middle + maximum * peakHeight);
        context.lineTo(x + 0.5, middle + minimum * peakHeight);
    }
    context.stroke();
    context.globalAlpha = 1;
}

function drawWaveform(canvas, left, right, clock, state) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width < 1 || height < 1) return;
    const pixelRatio = window.devicePixelRatio || 1;
    const layerKey = `${width}x${height}x${pixelRatio}`;
    if (state.layerKey !== layerKey) {
        // A resize invalidates every column, so repaint from sample 0 up to the frontier.
        state.layer = createWaveformLayer(width, height, pixelRatio);
        state.layerKey = layerKey;
        state.renderedX = 0;
    }
    const total = left.length;
    const ready = state.readySamples ? Math.min(state.readySamples(), total) : total;
    const readyX = total ? Math.floor((ready * width) / total) : 0;
    if (readyX > state.renderedX) {
        paintWaveformColumns(
            state.layer,
            width,
            height,
            pixelRatio,
            left,
            right,
            canvas.dataset.color,
            state.renderedX,
            readyX,
        );
        state.renderedX = readyX;
    }

    const context = canvas.getContext("2d");
    if (canvas.width !== state.layer.width || canvas.height !== state.layer.height) {
        canvas.width = state.layer.width;
        canvas.height = state.layer.height;
    }
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = canvas.dataset.dimmed === "1" ? 0.25 : 1;
    context.drawImage(state.layer, 0, 0);
    context.globalAlpha = 1;

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    if (ready < total) {
        // Scrim the not-yet-separated tail and mark the frontier racing ahead of the playhead.
        const frontierX = (ready / total) * width;
        context.fillStyle = "rgba(245, 245, 245, 0.72)";
        context.fillRect(frontierX, 0, width - frontierX, height);
        context.fillStyle = "#f5a623";
        context.fillRect(Math.max(0, frontierX - 1), 0, 2, height);
    }
    if (clock.duration) {
        const playheadX = Math.min(width, (clock.currentTime / clock.duration) * width);
        context.fillStyle = "#333";
        context.fillRect(Math.max(0, playheadX - 1), 0, 2, height);
    }
}

// `clock` is anything exposing the HTMLAudioElement subset used here (duration, paused, currentTime,
// play/pause/ended events): both <audio> and the stem transport qualify. `readySamples` optionally
// reports how much of left/right is final; omit it for complete buffers.
//
// `clock` may be a long-lived, shared object (e.g. the stem transport used by every stem tile), so
// callers must call the returned state's `destroy()` before discarding a waveform — otherwise the
// listeners attached here keep `left`/`right` (and the canvas) alive for the lifetime of the page.
export function setupWaveform(canvas, left, right, clock, color, readySamples = null) {
    canvas.dataset.color = color;
    const state = { draw: null, animationFrame: null, layer: null, layerKey: "", renderedX: 0, readySamples };
    state.draw = () => drawWaveform(canvas, left, right, clock, state);

    canvas.tabIndex = 0;
    canvas.setAttribute("role", "slider");
    canvas.setAttribute("aria-valuemin", "0");
    const updateAriaValue = () => {
        const duration = clock.duration || 0;
        canvas.setAttribute("aria-valuemax", duration.toFixed(1));
        canvas.setAttribute("aria-valuenow", (clock.currentTime || 0).toFixed(1));
        canvas.setAttribute("aria-valuetext", `${(clock.currentTime || 0).toFixed(1)}s of ${duration.toFixed(1)}s`);
    };
    updateAriaValue();

    const resizeObserver = new ResizeObserver(() => state.draw());
    resizeObserver.observe(canvas);

    const handleClick = event => {
        if (!clock.duration) return;
        const bounds = canvas.getBoundingClientRect();
        clock.currentTime = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)) * clock.duration;
        updateAriaValue();
        state.draw();
    };
    const handlePointerMove = event => {
        const position = (event.clientX - canvas.getBoundingClientRect().left) / canvas.clientWidth;
        canvas.title = clock.duration ? `${(position * clock.duration).toFixed(1)}s` : "Waveform";
    };
    const handleKeyDown = event => {
        if (!clock.duration) return;
        const step = event.shiftKey ? 10 : 1;
        if (event.key === "ArrowRight") clock.currentTime = Math.min(clock.duration, clock.currentTime + step);
        else if (event.key === "ArrowLeft") clock.currentTime = Math.max(0, clock.currentTime - step);
        else if (event.key === "Home") clock.currentTime = 0;
        else if (event.key === "End") clock.currentTime = clock.duration;
        else return;
        event.preventDefault();
        updateAriaValue();
        state.draw();
    };
    const handlePlay = () => {
        const animate = () => {
            updateAriaValue();
            state.draw();
            if (!clock.paused) state.animationFrame = requestAnimationFrame(animate);
        };
        cancelAnimationFrame(state.animationFrame);
        animate();
    };
    const handleStop = () => {
        cancelAnimationFrame(state.animationFrame);
        updateAriaValue();
        state.draw();
    };

    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("keydown", handleKeyDown);
    clock.addEventListener("play", handlePlay);
    clock.addEventListener("pause", handleStop);
    clock.addEventListener("seek", handleStop);
    clock.addEventListener("ended", handleStop);
    clock.addEventListener("durationchange", updateAriaValue);

    state.destroy = () => {
        cancelAnimationFrame(state.animationFrame);
        resizeObserver.disconnect();
        canvas.removeEventListener("click", handleClick);
        canvas.removeEventListener("pointermove", handlePointerMove);
        canvas.removeEventListener("keydown", handleKeyDown);
        clock.removeEventListener("play", handlePlay);
        clock.removeEventListener("pause", handleStop);
        clock.removeEventListener("seek", handleStop);
        clock.removeEventListener("ended", handleStop);
        clock.removeEventListener("durationchange", updateAriaValue);
    };

    state.draw();
    return state;
}
