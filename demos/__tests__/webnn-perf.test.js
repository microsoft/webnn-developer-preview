// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
//
// Unit tests for demos/webnn-perf.js using Node's built-in test runner.
// Run with: node --test demos/__tests__/webnn-perf.test.js

import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { WebNNPerf } from "../webnn-perf.js";

describe("WebNNPerf", () => {
    beforeEach(() => {
        WebNNPerf.reset();
    });

    describe("configure()", () => {
        it("should merge default metadata", async () => {
            WebNNPerf.configure({ model: "resnet-50", device: "gpu" });
            WebNNPerf.configure({ provider: "webnn" });

            await WebNNPerf.time("webnn.test.configure", () => Promise.resolve());

            const entries = WebNNPerf.getEntries();
            assert.equal(entries.length, 1);
            const detail = entries[0].detail;
            assert.equal(detail.model, "resnet-50");
            assert.equal(detail.device, "gpu");
            assert.equal(detail.provider, "webnn");
        });
    });

    describe("time()", () => {
        it("should return the wrapped function result", async () => {
            const result = await WebNNPerf.time("webnn.test.return", () => Promise.resolve(42));
            assert.equal(result, 42);
        });

        it("should create a performance measure entry", async () => {
            await WebNNPerf.time("webnn.test.measure", () => Promise.resolve());

            const measures = performance.getEntriesByType("measure").filter(e => e.name === "webnn.test.measure");
            assert.equal(measures.length, 1);
            assert.ok(measures[0].duration >= 0);
        });

        it("should include metadata in the measure detail", async () => {
            WebNNPerf.configure({ device: "npu" });
            await WebNNPerf.time("webnn.test.meta", () => Promise.resolve(), { model: "unet", iteration: 3 });

            const entries = WebNNPerf.getEntries();
            const entry = entries.find(e => e.name === "webnn.test.meta");
            assert.ok(entry);
            assert.equal(entry.detail.device, "npu");
            assert.equal(entry.detail.model, "unet");
            assert.equal(entry.detail.iteration, 3);
            assert.equal(entry.detail.seq, 1);
            assert.ok(typeof entry.detail.durationMs === "number");
        });

        it("should increment seq counter for repeated calls", async () => {
            await WebNNPerf.time("webnn.test.seq", () => Promise.resolve());
            await WebNNPerf.time("webnn.test.seq", () => Promise.resolve());
            await WebNNPerf.time("webnn.test.seq", () => Promise.resolve());

            const entries = WebNNPerf.getEntries().filter(e => e.name === "webnn.test.seq");
            assert.equal(entries.length, 3);
            assert.equal(entries[0].detail.seq, 1);
            assert.equal(entries[1].detail.seq, 2);
            assert.equal(entries[2].detail.seq, 3);
        });

        it("should measure non-trivial durations", async () => {
            await WebNNPerf.time("webnn.test.duration", () => new Promise(r => setTimeout(r, 50)));

            const entries = WebNNPerf.getEntries().filter(e => e.name === "webnn.test.duration");
            assert.equal(entries.length, 1);
            assert.ok(entries[0].detail.durationMs >= 40, `Expected >= 40ms, got ${entries[0].detail.durationMs}ms`);
        });

        it("should re-throw errors from the wrapped function", async () => {
            await assert.rejects(
                () =>
                    WebNNPerf.time("webnn.test.error", () => {
                        throw new Error("inference failed");
                    }),
                { message: "inference failed" },
            );
        });

        it("should emit a console event on error with error field", async () => {
            const logs = [];
            const origLog = console.log;
            console.log = (...args) => logs.push(args.join(" "));

            try {
                await WebNNPerf.time("webnn.test.errlog", () => {
                    throw new Error("session lost");
                });
            } catch {
                // expected
            } finally {
                console.log = origLog;
            }

            const perfLog = logs.find(l => l.includes("[WebNN:Perf]") && l.includes("webnn.test.errlog"));
            assert.ok(perfLog, "Should have logged a [WebNN:Perf] event");
            const json = JSON.parse(perfLog.slice("[WebNN:Perf] ".length));
            assert.equal(json.error, "session lost");
        });
    });

    describe("console output", () => {
        it("should emit structured JSON with [WebNN:Perf] prefix", async () => {
            const logs = [];
            const origLog = console.log;
            console.log = (...args) => logs.push(args.join(" "));

            try {
                WebNNPerf.configure({ provider: "webnn" });
                await WebNNPerf.time("webnn.test.console", () => Promise.resolve(), { model: "encoder" });
            } finally {
                console.log = origLog;
            }

            const perfLog = logs.find(l => l.startsWith("[WebNN:Perf]"));
            assert.ok(perfLog, "Should have a [WebNN:Perf] prefixed log");

            const json = JSON.parse(perfLog.slice("[WebNN:Perf] ".length));
            assert.equal(json.name, "webnn.test.console");
            assert.equal(json.provider, "webnn");
            assert.equal(json.model, "encoder");
            assert.ok(typeof json.durationMs === "number");
        });
    });

    describe("getEntries()", () => {
        it("should return only webnn-prefixed measures", async () => {
            performance.mark("other-start");
            performance.mark("other-end");
            performance.measure("other.measure", "other-start", "other-end");

            await WebNNPerf.time("webnn.test.filter", () => Promise.resolve());

            const entries = WebNNPerf.getEntries();
            assert.ok(entries.every(e => e.name.startsWith("webnn.")));
            assert.ok(entries.some(e => e.name === "webnn.test.filter"));

            performance.clearMarks("other-start");
            performance.clearMarks("other-end");
            performance.clearMeasures("other.measure");
        });
    });

    describe("reset()", () => {
        it("should clear all webnn entries and counters", async () => {
            WebNNPerf.configure({ device: "gpu" });
            await WebNNPerf.time("webnn.test.reset", () => Promise.resolve());
            assert.ok(WebNNPerf.getEntries().length > 0);

            WebNNPerf.reset();

            assert.equal(WebNNPerf.getEntries().length, 0);

            // Verify seq counter was reset
            await WebNNPerf.time("webnn.test.reset", () => Promise.resolve());
            const entries = WebNNPerf.getEntries();
            assert.equal(entries[0].detail.seq, 1);
        });

        it("should clear configured defaults", async () => {
            WebNNPerf.configure({ device: "gpu" });
            WebNNPerf.reset();

            await WebNNPerf.time("webnn.test.defaults", () => Promise.resolve());
            const entries = WebNNPerf.getEntries();
            assert.equal(entries[0].detail.device, undefined);
        });
    });
});
