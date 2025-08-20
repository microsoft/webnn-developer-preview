/* eslint-disable no-undef */
import {
    $,
    convertToSnakeCase,
    createMlTensor,
    createGpuTensor,
    downloadMlTensor,
    downloadGpuTensor,
} from "../../assets/js/common_utils.js";
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

// Class to handle a large language model on top of onnxruntime-web
export class LLM {
    provider = "webnn";
    session1 = undefined;
    session2 = undefined;
    feed = {};
    fetches = {};
    outputTokens = [];
    stop = false;
    kvDims = [];
    deviceType = "gpu";
    maxLength = 2048;
    mlContext = undefined;
    startLen = 0;
    decodeLogitsBuffer = undefined;

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
        this.vocabSize = model.vocab_size;
        this.decodeLogitsBuffer = new Float16Array(this.vocabSize * 2);
        log(`WebNN EP config: ${model.name} · ${this.provider} · ${this.deviceType}`);

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
        if (this.provider == "webnn") {
            this.mlContext = await navigator.ml.createContext({ deviceType: this.deviceType });
        }
        const sessionOptions = {
            executionProviders: [{ name: this.provider, deviceType: this.deviceType, context: this.mlContext }],
            externalData: [
                {
                    data: externalDataBytes,
                    path: externalFile,
                },
            ],
        };

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

        if (this.provider == "webgpu") {
            this.gpuDevice = ort.env.webgpu.device;
        }

        updateOnnxDataCompileProgress(10);
        updateLoadProgress(onnxFetchProgress + onnxDataFetchProgress + onnxCompileProgress + onnxDataCompileProgress);
        updateProgressBar(loadProgress.toFixed(2));
        progressBarLabel.innerHTML = `Session for decode created · ${loadProgress.toFixed(2)}%`;

        updateProgressBar(100.0);
        progressBarLabel.innerHTML = "100%";

        if (!flag) {
            this.initialize();
        }
    }

    disposeTensors(tensors) {
        if (tensors && typeof tensors === "object") {
            for (const name in tensors) {
                const t = tensors[name];
                if (t.disposer == undefined) {
                    if (t.location == "ml-tensor") {
                        t.mlTensor.destroy();
                    }
                    if (t.location == "gpu-buffer") {
                        t.gpuBuffer.destroy();
                    }
                } else {
                    t.dispose();
                }
            }
        }
    }

    // Initialize key value caches
    async initialize() {
        // Dispose previous tensors
        this.disposeTensors(this.feed);
        this.disposeTensors(this.fetches);

        this.feed = {};
        if (this.provider == "webnn") {
            // Pre-allocate kv cache ml-tensor
            for (let i = 0; i < this.numLayers; ++i) {
                this.feed[`past_key_values.${i}.key`] = await createMlTensor(
                    this.mlContext,
                    "float16",
                    this.kvDims,
                    false,
                    false,
                );
                this.feed[`past_key_values.${i}.value`] = await createMlTensor(
                    this.mlContext,
                    "float16",
                    this.kvDims,
                    false,
                    false,
                );

                this.fetches[`present.${i}.key`] = await createMlTensor(
                    this.mlContext,
                    "float16",
                    this.kvDims,
                    false,
                    false,
                );
                this.fetches[`present.${i}.value`] = await createMlTensor(
                    this.mlContext,
                    "float16",
                    this.kvDims,
                    false,
                    false,
                );
            }
        } else if (this.provider == "webgpu") {
            // Pre-allocate kv cache gpu-buffer
            const numElements = this.kvDims.reduce((a, b) => a * b, 1);
            const bufferSize = numElements * 2;
            for (let i = 0; i < this.numLayers; ++i) {
                this.feed[`past_key_values.${i}.key`] = createGpuTensor(
                    this.gpuDevice,
                    "float16",
                    this.kvDims,
                    bufferSize,
                );
                this.feed[`past_key_values.${i}.value`] = createGpuTensor(
                    this.gpuDevice,
                    "float16",
                    this.kvDims,
                    bufferSize,
                );

                this.fetches[`present.${i}.key`] = createGpuTensor(this.gpuDevice, "float16", this.kvDims, bufferSize);
                this.fetches[`present.${i}.value`] = createGpuTensor(
                    this.gpuDevice,
                    "float16",
                    this.kvDims,
                    bufferSize,
                );
            }
        } else {
            // Initialize kv cache as empty tensors for WASM EP
            const numElements = this.kvDims.reduce((a, b) => a * b, 1);
            const emptyTensor = new Float16Array(numElements);
            for (let i = 0; i < this.numLayers; ++i) {
                this.feed[`past_key_values.${i}.key`] = new ort.Tensor("float16", emptyTensor, this.kvDims);
                this.feed[`past_key_values.${i}.value`] = new ort.Tensor("float16", emptyTensor, this.kvDims);
            }
        }
    }

    // Update key value cache
    updateKvCache(outputs) {
        for (const name in outputs) {
            if (name.includes("present.")) {
                let newName = name.replace(name.split(".")[0], "past_key_values");
                const t = this.feed[newName];
                if (this.fetches[name]) {
                    this.feed[newName] = this.fetches[name];
                    this.fetches[name] = t;
                } else {
                    this.feed[newName] = outputs[name];
                }
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
    argmax(arr, sequenceLength = 1, vocabSize) {
        let start = vocabSize * (sequenceLength - 1);
        let max = arr[start];
        let maxIndex = 0;

        for (let i = 0; i < vocabSize; i++) {
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
        const attnMaskLen = this.provider == "webnn" ? inputIdsLen : this.startLen + inputIdsLen;
        let attnMask = Array.from({ length: attnMaskLen }, () => BigInt(1));
        let positionIds = Array.from({ length: inputIdsLen }, (_, i) =>
            BigInt(this.provider == "webnn" ? i++ : this.startLen + i++),
        );
        // Both input_ids and position_ids have shapes of [batch_size, sequence_length].
        // The sequence_length is the length of inputIds, which is dynamic.
        // Since WebNN does not support dynamic shapes, fix the sequence_length to maxLength and
        // pad the rest elements with 0 value.
        // TODO: This may cause an overflow error if maxLength is excessively large,
        // as it could exceed the allowable array size or memory limits.
        // e.g. QWen2.0 supports max_length: 32768, in a matmul of the GQA decomposed op,
        // its input shapes will be [1, 14, 32768, 64] x [1, 14, 64, 32768] = [1, 14, 32768, 32768]
        // which exceeds the 2GB tensor size limitation.
        if (this.provider == "webnn") {
            inputIds = this.paddingInput(inputIds, this.maxLength);
            positionIds = this.paddingInput(positionIds, this.maxLength);
            attnMask = this.paddingInput(attnMask, this.maxLength);
        }

        this.feed["input_ids"] = new ort.Tensor("int64", BigInt64Array.from(inputIds), [1, inputIds.length]);
        this.feed["attention_mask"] = new ort.Tensor("int64", BigInt64Array.from(attnMask), [1, attnMask.length]);
        this.feed["position_ids"] = new ort.Tensor("int64", BigInt64Array.from(positionIds), [1, positionIds.length]);
        this.stop = false;

        // shape of logits in prefill
        const prefillLogitsShape = [1, this.provider == "webnn" ? this.maxLength : inputIdsLen, this.vocabSize];
        const numElementsOfPrefillLogits = prefillLogitsShape.reduce((a, b) => a * b, 1);
        let lastToken = 0;
        if (this.provider == "webnn") {
            this.fetches["logits"] = await createMlTensor(this.mlContext, "float16", prefillLogitsShape, false, true);
        } else if (this.provider == "webgpu") {
            const bufferSize = numElementsOfPrefillLogits * 2; // 2 bytes for float16
            this.fetches["logits"] = createGpuTensor(this.gpuDevice, "float16", prefillLogitsShape, bufferSize);
        }
        let outputs = await this.session1.run(this.feed, this.fetches);
        this.prefillLogitsBuffer = new Float16Array(numElementsOfPrefillLogits);
        if (this.provider == "webnn") {
            await downloadMlTensor(this.mlContext, this.fetches["logits"].mlTensor, this.prefillLogitsBuffer);
        } else if (this.provider == "webgpu") {
            await downloadGpuTensor(
                this.gpuDevice,
                this.fetches["logits"].gpuBuffer,
                this.vocabSize * inputIdsLen * 2,
                this.prefillLogitsBuffer,
            );
        } else {
            this.prefillLogitsBuffer = outputs["logits"].cpuData;
        }

        lastToken = this.argmax(this.prefillLogitsBuffer, inputIdsLen, this.vocabSize);

        // Clean up the logits tensor after prefill
        if (this.provider == "webnn") {
            this.fetches["logits"].mlTensor.destroy();
        } else if (this.provider == "webgpu") {
            this.fetches["logits"].gpuBuffer.destroy();
        }
        this.fetches["logits"] = undefined;

        this.startLen = this.provider == "webnn" ? inputIdsLen : this.startLen + inputIdsLen;
        this.outputTokens.push(lastToken);
        if (callback) {
            callback(this.outputTokens);
        }

        this.updateKvCache(outputs);
        while (this.eos.indexOf(lastToken) == -1 && !this.stop && this.startLen < this.maxLength) {
            this.feed["input_ids"] = new ort.Tensor("int64", BigInt64Array.from([BigInt(lastToken)]), [1, 1]);

            if (this.provider == "webnn") {
                attnMask[this.startLen] = 1n;
            } else {
                attnMask.push(1n);
            }
            this.feed["attention_mask"] = new ort.Tensor("int64", BigInt64Array.from(attnMask), [1, attnMask.length]);
            this.feed["position_ids"] = new ort.Tensor("int64", BigInt64Array.from([BigInt(this.startLen)]), [1, 1]);

            if (this.provider == "webnn") {
                // Pre-allocate logits ml-tensor once
                if (!this.fetches["logits"]) {
                    this.fetches["logits"] = await createMlTensor(
                        this.mlContext,
                        "float16",
                        [1, 1, this.vocabSize], // shape of logits in decode
                        false,
                        true,
                    );
                }
                outputs = await this.session2.run(this.feed, this.fetches);
                await downloadMlTensor(this.mlContext, this.fetches["logits"].mlTensor, this.decodeLogitsBuffer);
            } else if (this.provider == "webgpu") {
                const bufferSize = this.vocabSize * 2; // 2 bytes for float16
                if (!this.fetches["logits"]) {
                    // Pre-allocate logits gpu-buffer once
                    this.fetches["logits"] = createGpuTensor(
                        this.gpuDevice,
                        "float16",
                        [1, 1, this.vocabSize],
                        bufferSize,
                    );
                }
                outputs = await this.session1.run(this.feed, this.fetches);
                await downloadGpuTensor(
                    this.gpuDevice,
                    this.fetches["logits"].gpuBuffer,
                    this.vocabSize * 2,
                    this.decodeLogitsBuffer,
                );
            } else {
                outputs = await this.session1.run(this.feed, this.fetches);
                this.decodeLogitsBuffer = outputs["logits"].cpuData;
            }

            lastToken = this.argmax(this.decodeLogitsBuffer, 1, this.vocabSize);

            this.outputTokens.push(lastToken);
            if (callback) {
                callback(this.outputTokens);
            }
            this.updateKvCache(outputs);
            this.startLen++;
        }

        // Clean up the logits tensor after decode
        if (this.provider == "webnn") {
            this.fetches["logits"].mlTensor.destroy();
        } else if (this.provider == "webgpu") {
            this.fetches["logits"].gpuBuffer.destroy();
        }

        return this.outputTokens;
    }

    async dispose() {
        try {
            this.disposeTensors(this.feed);
            this.disposeTensors(this.fetches);

            this.feed = {};
            this.fetches = {};
            await this.session1.release();
            this.session1 = undefined;
            if (this.session2) {
                await this.session2.release();
                this.session2 = undefined;
            }
        } catch (e) {
            console.log("Error releasing session: ", e);
        }

        if (this.mlContext) {
            await this.mlContext.destroy();
        }

        this.outputTokens = [];
        this.kvDims = [];
        this.mlContext = undefined;
        this.startLen = 0;
    }
}
