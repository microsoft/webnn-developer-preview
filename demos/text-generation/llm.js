/* eslint-disable no-undef */
import { $, isFloat16ArrayAvailable, convertToSnakeCase } from "../../assets/js/common_utils.js";
import {
    getModelOPFS,
    log,
    updateOnnxCompileProgress,
    updateOnnxDataCompileProgress,
    updateLoadProgress,
    updateProgressBar,
    loadProgress,
    onnxFetchProgress,
    onnxDataFetchProgress,
    onnxCompileProgress,
    onnxDataCompileProgress,
} from "./utils.js";

function product(shape) {
    if (!Array.isArray(shape)) {
        return 0; // Keep the non-array case returning 0
    }
    // A shape of [] should be 1 as a scalar
    // No need for special empty array check since reduce handles it
    return shape.reduce((acc, val) => acc * val, 1);
}

// Class to handle a large language model on top of onnxruntime-web
export class LLM {
    provider = "webnn";
    session1 = undefined;
    session2 = undefined;
    feed = {};
    outputTokens = [];
    stop = false;
    kvDims = [];
    dataType = "float16";
    deviceType = "gpu";
    maxLength = 2048;
    mlContext = undefined;

    constructor(maxLength) {
        this.maxLength = maxLength;
    }

    async load(model, options, flag = true) {
        this.provider = options.provider;
        this.deviceType = options.deviceType;
        const verbose = options.verbose;
        this.eos = model.eos_token_id; // End of sentence token ids
        this.numLayers = model.num_layers;
        this.kvNumHeads = model.kv_num_heads;
        this.headSize = model.head_size;
        this.kvDims = [1, model.kv_num_heads, this.maxLength, model.head_size];
        log(`WebNN EP config: ${model.name} · ${this.dataType} · ${this.provider} · ${this.deviceType}`);

        const path = options.local ? model.local_path : model.remote_path;
        const modelFile = model.file_name;
        const modelPath = path + modelFile;
        const modelName = convertToSnakeCase(model.name);
        const modelBytes = await getModelOPFS(`${modelName}_${modelFile}`, modelPath, false);
        const externalFile = modelFile + ".data";
        const externalDataPath = path + externalFile;
        const externalDataBytes = await getModelOPFS(`${modelName}_${externalFile}`, externalDataPath, false);

        let modelSize = modelBytes.byteLength;
        modelSize += externalDataBytes.byteLength;

        log(`model size: ${Math.round(modelSize / 1024 / 1024)} MB`);
        this.mlContext = await navigator.ml.createContext({ deviceType: this.deviceType });
        const sessionOptions = {
            executionProviders: [{ name: this.provider, deviceType: this.deviceType, context: this.mlContext }],
            externalData: [
                {
                    data: externalDataBytes,
                    path: externalFile,
                },
            ],
        };

        const locationType = this.provider == "webnn" ? "ml-tensor" : "gpu-buffer";
        switch (this.provider) {
            case "webnn":
            case "webgpu":
                // Bind kv cache outputs to ml-tensor or gpu-buffer
                sessionOptions.preferredOutputLocation = {};
                for (let i = 0; i < this.numLayers; ++i) {
                    sessionOptions.preferredOutputLocation[`present.${i}.key`] = locationType;
                    sessionOptions.preferredOutputLocation[`present.${i}.value`] = locationType;
                }
                break;
            case "wasm":
                sessionOptions.preferredOutputLocation = "cpu";
                break;
        }

        if (verbose) {
            sessionOptions.logSeverityLevel = 0;
            sessionOptions.logVerbosityLevel = 0;
        }

        if (this.provider == "webnn") {
            sessionOptions.freeDimensionOverrides = {
                batch_size: 1,
                sequence_length: this.maxLength,
                total_sequence_length: this.maxLength,
                past_sequence_length: this.maxLength,
            };
        }

        let progressBarLabel = $("#p-bar-label");
        log("Create session for prefill process");
        console.log("Create session 1 with option: ");
        console.log({ ...sessionOptions });
        this.session1 = await ort.InferenceSession.create(modelBytes, sessionOptions);
        updateOnnxCompileProgress(10);
        updateLoadProgress(onnxFetchProgress + onnxDataFetchProgress + onnxCompileProgress + onnxDataCompileProgress);
        updateProgressBar(loadProgress.toFixed(2));
        progressBarLabel.innerHTML = `Prefill session created · ${loadProgress.toFixed(2)}%`;

        log("Prefill session created");
        if (this.provider == "webnn") {
            // Decode process
            sessionOptions.freeDimensionOverrides = {
                batch_size: 1,
                sequence_length: 1,
                total_sequence_length: this.maxLength,
                past_sequence_length: this.maxLength,
            };
            log("Create session for decode process");
            console.log("Create session 2 with option: ");
            console.log({ ...sessionOptions });
            this.session2 = await ort.InferenceSession.create(modelBytes, sessionOptions);
            log("Decode process session created");
        }

        updateOnnxDataCompileProgress(10);
        updateLoadProgress(onnxFetchProgress + onnxDataFetchProgress + onnxCompileProgress + onnxDataCompileProgress);
        updateProgressBar(loadProgress.toFixed(2));
        progressBarLabel.innerHTML = `Session for decode created · ${loadProgress.toFixed(2)}%`;

        updateProgressBar(100.0);
        progressBarLabel.innerHTML = "100%";

        if (!flag) {
            this.initializeFeed();
        }
    }

    async initializeFeed() {
        // Dispose previous tensors
        for (const name in this.feed) {
            const t = this.feed[name];
            if (t.location === "gpu-buffer" || t.location === "ml-tensor") {
                t.dispose();
            }
        }

        this.feed = {};
        if (this.provider == "webnn") {
            // Initialize kv cache ml-tensor
            const kvDescriptor = { dataType: this.dataType, shape: this.kvDims };
            const ortKvDescriptor = { dataType: this.dataType, dims: this.kvDims };
            const inputMlTensor = await this.mlContext.createTensor(kvDescriptor);
            for (let i = 0; i < this.numLayers; ++i) {
                this.feed[`past_key_values.${i}.key`] = ort.Tensor.fromMLTensor(inputMlTensor, ortKvDescriptor);
                this.feed[`past_key_values.${i}.value`] = ort.Tensor.fromMLTensor(inputMlTensor, ortKvDescriptor);
            }
        } else {
            // Initialize kv cache as empty tensors for WebGPU or WASM EP
            const emptyDims = [1, this.kvNumHeads, 0, this.headSize];
            const emptyTensor = this.dataType === "float16" ? new Float16Array() : new Float32Array();
            for (let i = 0; i < this.numLayers; ++i) {
                this.feed[`past_key_values.${i}.key`] = new ort.Tensor(this.dataType, emptyTensor, emptyDims);
                this.feed[`past_key_values.${i}.value`] = new ort.Tensor(this.dataType, emptyTensor, emptyDims);
            }
        }
    }

    // Update key value cache
    updateKvCache(outputs) {
        for (const name in outputs) {
            if (name.includes("present.")) {
                let newName = name.replace(name.split(".")[0], "past_key_values");
                const t = this.feed[newName];
                // dispose previous tensors
                if (t.location === "gpu-buffer" || t.location == "ml-tensor") {
                    // ml-tensor in first feed has no dispose method
                    if (t.disposer == undefined && t.location == "ml-tensor") {
                        t.mlTensor.destroy();
                    } else {
                        t.dispose();
                    }
                }

                this.feed[newName] = outputs[name];
            }
        }
    }

    // Padding input array with 0
    paddingInput(originInput, maxLength, reverse = false) {
        let input = originInput.slice();
        if (input.length >= maxLength) return input.slice(0, maxLength);
        const paddingLength = maxLength - input.length;
        const padding = Array.from({ length: paddingLength }, () => 0n);
        if (reverse) {
            return padding.concat(input);
        } else {
            return input.concat(padding);
        }
    }

    // Tell generate() to stop
    abort() {
        this.stop = true;
    }

    // Poor man's argmax
    argmax(t, sequenceLength = 1) {
        let arr = t.cpuData;
        if (t.type == "float16" && !isFloat16ArrayAvailable) {
            throw new Error("Float16Array is not available on this browser, try to use newer version");
        }

        let start = t.dims[2] * (sequenceLength - 1);
        let max = arr[start];
        let maxIndex = 0;

        for (let i = 0; i < t.dims[2]; i++) {
            const val = arr[i + start];
            if (!isFinite(val)) {
                throw new Error("Found infinity in logits");
            }
            if (val > max) {
                max = arr[i + start];
                maxIndex = i;
            }
        }
        return maxIndex;
    }

    // Prefill prompt and generate tokens, greedy search only
    async generate(inputIds, callback) {
        this.outputTokens = [];
        const inputIdsLen = inputIds.length;

        let attnMask = Array.from({ length: inputIdsLen }, () => BigInt(1));
        const positionIds = Array.from({ length: inputIdsLen }, (_, i) => BigInt(i++));
        // Both input_ids and position_ids have shapes of [batch_size, sequence_length].
        // The sequence_length is the length of inputIds, which is dynamic.
        // Since WebNN does not support dynamic shapes, fix the sequence_length to maxLength and
        // pad the rest elements with 0 value.
        // TODO: This may cause an overflow error if maxLength is excessively large,
        // as it could exceed the allowable array size or memory limits.
        // e.g. QWen2.0 supports max_length: 32768, in a matmul of the GQA decomposed op,
        // its input shapes will be [1, 14, 32768, 64] x [1, 14, 64, 32768] = [1, 14, 32768, 32768]
        // which exceeds the 2GB tensor size limitation.
        const doPadding = this.provider === "webnn";
        const inputIdsBuffer = doPadding ? this.paddingInput(inputIds, this.maxLength) : inputIds;
        const positionIdsBuffer = doPadding ? this.paddingInput(positionIds, this.maxLength) : positionIds;

        const attnMaskBuffer = this.paddingInput(attnMask, this.maxLength);
        this.feed["input_ids"] = new ort.Tensor("int64", BigInt64Array.from(inputIdsBuffer), [
            1,
            inputIdsBuffer.length,
        ]);
        this.feed["attention_mask"] = new ort.Tensor("int64", BigInt64Array.from(attnMaskBuffer), [
            1,
            attnMaskBuffer.length,
        ]);
        this.feed["position_ids"] = new ort.Tensor("int64", BigInt64Array.from(positionIdsBuffer), [
            1,
            positionIdsBuffer.length,
        ]);
        this.stop = false;

        let lastToken = 0;
        let outputs = await this.session1.run(this.feed);
        lastToken = this.argmax(outputs["logits"], inputIdsLen);
        let startLen = inputIdsLen;
        this.outputTokens.push(lastToken);
        if (callback) {
            callback(this.outputTokens);
        }

        this.updateKvCache(outputs);
        while (
            this.eos.indexOf(lastToken) == -1 &&
            !this.stop &&
            this.outputTokens.length <= this.maxLength - inputIdsLen
        ) {
            this.feed["input_ids"] = new ort.Tensor("int64", BigInt64Array.from([BigInt(lastToken)]), [1, 1]);
            attnMask.push(BigInt(1));
            const attnMaskBuffer = this.paddingInput(attnMask, this.maxLength);
            this.feed["attention_mask"] = new ort.Tensor("int64", new BigInt64Array(attnMaskBuffer), [
                1,
                this.maxLength,
            ]);
            this.feed["position_ids"] = new ort.Tensor("int64", BigInt64Array.from([BigInt(startLen)]), [1, 1]);
            if (this.provider == "webnn") {
                outputs = await this.session2.run(this.feed);
            } else {
                outputs = await this.session1.run(this.feed);
            }
            lastToken = this.argmax(outputs["logits"]);
            this.outputTokens.push(lastToken);
            if (callback) {
                callback(this.outputTokens);
            }
            this.updateKvCache(outputs);
            startLen += 1;
        }

        return this.outputTokens;
    }

    async dispose() {
        try {
            for (const name in this.feed) {
                const t = this.feed[name];
                if (t.location === "gpu-buffer" || t.location === "ml-tensor") {
                    t.dispose();
                }
            }

            this.feed = {};
            await this.session1.release();
            await this.session2.release();
            this.session1 = undefined;
            this.session2 = undefined;
        } catch (e) {
            console.log("Error releasing session: ", e);
        }

        if (this.mlContext) {
            await this.mlContext.destroy();
        }

        this.outputTokens = [];
        this.kvDims = [];
        this.mlContext = undefined;
    }
}
