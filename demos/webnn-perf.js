// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
//
// Lightweight performance instrumentation for WebNN demos.
// Uses the W3C Performance API (mark/measure) and structured console events
// so that browser automation tooling (e.g. Playwright) can collect metrics
// without any UI changes.
//
// Usage:
//   import { WebNNPerf } from '../webnn-perf.js';
//   WebNNPerf.configure({ model: 'resnet-50', device: 'gpu', provider: 'webnn' });
//   const session = await WebNNPerf.time('webnn.session.create', () =>
//     ort.InferenceSession.create(buf, opts)
//   , { model: 'unet' });
//
// Collecting from Playwright:
//   const metrics = await page.evaluate(() =>
//     performance.getEntriesByType('measure')
//       .filter(e => e.name.startsWith('webnn.'))
//       .map(e => ({ name: e.name, duration: e.duration, detail: e.detail }))
//   );

const PREFIX = "[WebNN:Perf]";

let _defaults = {};
let _counter = {};

/**
 * Configure default metadata attached to every event.
 * Call once at demo startup with { model, device, provider }.
 */
function configure(defaults) {
    _defaults = { ..._defaults, ...defaults };
}

/**
 * Reset all state (marks, counters, defaults).
 */
function reset() {
    _defaults = {};
    _counter = {};
    performance
        .getEntriesByType("mark")
        .filter(e => e.name.startsWith("webnn."))
        .forEach(e => {
            try {
                performance.clearMarks(e.name);
            } catch {
                /* ignore */
            }
        });
    performance
        .getEntriesByType("measure")
        .filter(e => e.name.startsWith("webnn."))
        .forEach(e => {
            try {
                performance.clearMeasures(e.name);
            } catch {
                /* ignore */
            }
        });
}

/**
 * Time an async operation and emit a performance measure + console event.
 *
 * @param {string} name  Metric name, e.g. 'webnn.session.create'
 * @param {Function} fn  Async function to execute and time
 * @param {Object} [meta]  Additional metadata (model, size, iteration, etc.)
 * @returns {*} The return value of fn()
 */
async function time(name, fn, meta) {
    const seq = (_counter[name] = (_counter[name] || 0) + 1);
    const startMark = `${name}:start:${seq}`;
    const endMark = `${name}:end:${seq}`;

    performance.mark(startMark);
    const t0 = performance.now();

    try {
        const result = await fn();
        const duration = performance.now() - t0;

        performance.mark(endMark);
        const detail = { ..._defaults, ...meta, seq, durationMs: parseFloat(duration.toFixed(2)) };

        try {
            performance.measure(name, { start: startMark, end: endMark, detail });
        } catch {
            // Fallback for browsers that don't support detail in measure
            performance.measure(name, startMark, endMark);
        }

        console.log(`${PREFIX} ${JSON.stringify({ name, ...detail })}`);
        return result;
    } catch (err) {
        const duration = performance.now() - t0;
        const detail = { ..._defaults, ...meta, seq, durationMs: parseFloat(duration.toFixed(2)), error: err.message };
        console.log(`${PREFIX} ${JSON.stringify({ name, ...detail })}`);
        throw err;
    }
}

/**
 * Return all WebNN performance measure entries.
 */
function getEntries() {
    return performance
        .getEntriesByType("measure")
        .filter(e => e.name.startsWith("webnn."))
        .map(e => ({
            name: e.name,
            duration: e.duration,
            detail: e.detail,
        }));
}

export const WebNNPerf = { configure, reset, time, getEntries };
