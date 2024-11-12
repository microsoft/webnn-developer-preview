/* eslint-disable no-undef */
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
    if (!Array.isArray(shape) || shape.length === 0) {
        return 0;
    }
    return shape.reduce((acc, val) => acc * val, 1);
}

// class to handle a large language model on top of onnxruntime-web
export class LLM {
    provider = "webnn";
    sess = undefined;
    feed = {};
    prefill_fetches = {};
    decode_fetches = {};
    decode_tmp_fetches = {};
    output_tokens = [];
    eos = [32007, 32000]; // end tokens
    need_position_ids = true;
    stop = false;
    kv_dims = [];
    dtype = "float16";
    max_seq = 128;
    max_cache = 256;
    attn_mask_len = 384;
    start_len = 0;
    ml_context = undefined;

    constructor(max_seq, max_cache, dataType) {
        this.dtype = dataType;
        this.max_seq = max_seq;
        this.max_cache = max_cache;
        this.attn_mask_len = max_seq + max_cache;
    }

    async load(model, options, flag = true) {
        this.provider = options.provider;
        const verbose = options.verbose;
        this.kv_dims = [1, 32, this.max_cache, 96];
        this.num_layers = 32;
        log(`WebNN EP config: ${model} · ${this.dtype} · ${this.provider}`);

        const path = location.href.includes("github.io")
            ? "https://huggingface.co/webnn/Phi3-mini-4k-instruct-static/resolve/main/"
            : "models/";

        const type_suffix = this.dtype == "float16" ? "_fp16" : "";
        const model_file = `Phi_3_mini_4k_instruct_static_kvcache_uint4_sink_simlayernorm${type_suffix}.onnx`;
        const model_path = path + model_file;
        const model_bytes = await getModelOPFS(`id_${model_file}`, model_path, false);
        const external_file = model_file + ".data";
        const external_data_path = path + external_file;
        const external_data_bytes = await getModelOPFS(`id_${external_file}`, external_data_path, false);

        let model_size = model_bytes.byteLength;
        model_size += external_data_bytes.byteLength;

        log(`Phi-3 Mini model size: ${Math.round(model_size / 1024 / 1024)} MB`);
        this.ml_context = await navigator.ml.createContext({ deviceType: "gpu" });
        const session_options = {
            executionProviders: [{ name: this.provider, deviceType: "gpu", context: this.ml_context }],
            preferredOutputLocation: "ml-tensor",
            // graphOptimizationLevel: 'basic',
            externalData: [
                {
                    data: external_data_bytes,
                    path: external_file,
                },
            ],
        };

        switch (this.provider) {
            //     case 'webnn':
            //         // Bind kv cache outputs to ml-tensor
            //         for (let i = 0; i < 32; ++i) {
            //             session_options.preferredOutputLocation[`new_present_key_values.${i}.decoder.key`] = 'ml-tensor';
            //             session_options.preferredOutputLocation[`new_present_key_values.${i}.decoder.value`] = 'ml-tensor';
            //         }
            //         break;
            case "webgpu":
                session_options.preferredOutputLocation = {};
                for (let i = 0; i < this.num_layers; ++i) {
                    session_options.preferredOutputLocation[`new_present_key_values.${i}.decoder.key`] = "gpu-buffer";
                    session_options.preferredOutputLocation[`new_present_key_values.${i}.decoder.value`] = "gpu-buffer";
                }
                break;
            case "wasm":
                session_options.preferredOutputLocation = "cpu";
                break;
        }

        if (verbose) {
            session_options.logSeverityLevel = 0;
            session_options.logVerbosityLevel = 0;
        }

        if (this.provider == "webnn") {
            session_options.freeDimensionOverrides = {
                max_seq_len: this.max_seq,
                "max_cache_len+max_seq_len": this.attn_mask_len,
                max_cache_len: this.max_cache,
                sink_len: 2,
            };
        }

        let progressBarLabel = document.getElementById("p-bar-label");
        log("Create session for prefill process");
        console.log("Create session 1 with option: ");
        console.log({ ...session_options });
        this.sess_1 = await ort.InferenceSession.create(model_bytes, session_options);

        updateOnnxCompileProgress(10);
        updateLoadProgress(onnxFetchProgress + onnxDataFetchProgress + onnxCompileProgress + onnxDataCompileProgress);
        updateProgressBar(loadProgress.toFixed(2));
        progressBarLabel.innerHTML = `Prefill session created · ${loadProgress.toFixed(2)}%`;

        log("Prefill session created");
        if (this.provider == "webnn") {
            session_options.freeDimensionOverrides = {
                max_seq_len: 1,
                "max_cache_len+max_seq_len": 1 + this.max_cache,
                max_cache_len: this.max_cache,
                sink_len: 2,
            };
            log("Create session for decode process");
            console.log("Create session 2 with option: ");
            console.log({ ...session_options });
            this.sess_2 = await ort.InferenceSession.create(model_bytes, session_options);
            log("Decode process session created");
        }

        updateOnnxDataCompileProgress(10);
        updateLoadProgress(onnxFetchProgress + onnxDataFetchProgress + onnxCompileProgress + onnxDataCompileProgress);
        updateProgressBar(loadProgress.toFixed(2));
        progressBarLabel.innerHTML = `Session for decode created · ${loadProgress.toFixed(2)}%`;

        updateProgressBar(100.0);
        progressBarLabel.innerHTML = `100%`;

        if (!flag) {
            this.initialize_feed();
        }
    }

    async initialize_feed() {
        // dispose of previous tensor
        for (const name in this.feed) {
            const t = this.feed[name];
            if (t.location === "gpu-buffer") {
                t.dispose();
            }
            if (t.location === "ml-tensor") {
                t.mlTensor.destroy();
            }
        }

        for (const name in this.decode_fetches) {
            const t1 = this.prefill_fetches[name];
            const t2 = this.decode_fetches[name];
            const t3 = this.decode_tmp_fetches[name];
            if (t1.location === "ml-tensor") {
                t1.mlTensor.destroy();
                t2.mlTensor.destroy();
                t3.mlTensor.destroy();
            }
        }

        this.feed = {};
        if (this.provider == "webnn") {
            const sink_range_tensor = await this.ml_context.createTensor({
                dataType: "int32",
                shape: [2],
                usage: MLTensorUsage.WRITE,
                writable: true,
            });
            this.ml_context.writeTensor(sink_range_tensor, Int32Array.from([0, 1]));
            this.feed["sink_range"] = ort.Tensor.fromMLTensor(sink_range_tensor, {
                dataType: "int32",
                dims: [2],
            });
            const kv_desc = { dataType: this.dtype, shape: this.kv_dims };
            const ort_kv_desc = { dataType: this.dtype, dims: this.kv_dims };
            const input_ml_tensor = await this.ml_context.createTensor(kv_desc);
            for (let i = 0; i < this.num_layers; ++i) {
                // The same MLTensor cannot be used more than once as output.
                const prefill_key_ml_tensor = await this.ml_context.createTensor(kv_desc);
                const prefill_value_ml_tensor = await this.ml_context.createTensor(kv_desc);
                const decode_key_ml_tensor = await this.ml_context.createTensor(kv_desc);
                const decode_value_ml_tensor = await this.ml_context.createTensor(kv_desc);
                const decode_tmp_key_ml_tensor = await this.ml_context.createTensor(kv_desc);
                const decode_tmp_value_ml_tensor = await this.ml_context.createTensor(kv_desc);
                // input feed
                this.feed[`past_key_values.${i}.decoder.key`] = ort.Tensor.fromMLTensor(input_ml_tensor, ort_kv_desc);
                this.feed[`past_key_values.${i}.decoder.value`] = ort.Tensor.fromMLTensor(input_ml_tensor, ort_kv_desc);
                // output fetches
                this.prefill_fetches[`new_present_key_values.${i}.decoder.key`] = ort.Tensor.fromMLTensor(
                    prefill_key_ml_tensor,
                    ort_kv_desc,
                );
                this.prefill_fetches[`new_present_key_values.${i}.decoder.value`] = ort.Tensor.fromMLTensor(
                    prefill_value_ml_tensor,
                    ort_kv_desc,
                );
                this.decode_fetches[`new_present_key_values.${i}.decoder.key`] = ort.Tensor.fromMLTensor(
                    decode_key_ml_tensor,
                    ort_kv_desc,
                );
                this.decode_fetches[`new_present_key_values.${i}.decoder.value`] = ort.Tensor.fromMLTensor(
                    decode_value_ml_tensor,
                    ort_kv_desc,
                );
                this.decode_tmp_fetches[`new_present_key_values.${i}.decoder.key`] = ort.Tensor.fromMLTensor(
                    decode_tmp_key_ml_tensor,
                    ort_kv_desc,
                );
                this.decode_tmp_fetches[`new_present_key_values.${i}.decoder.value`] = ort.Tensor.fromMLTensor(
                    decode_tmp_value_ml_tensor,
                    ort_kv_desc,
                );
            }
            const token_id_desc = {
                dataType: "int32",
                shape: [1, 1],
                usage: MLTensorUsage.READ,
                readable: true,
            };
            const ort_token_id_desc = {
                dataType: "int32",
                dims: [1, 1],
            };
            this.prefill_token_id_tensor = await this.ml_context.createTensor(token_id_desc);
            this.prefill_fetches["token_id"] = ort.Tensor.fromMLTensor(this.prefill_token_id_tensor, ort_token_id_desc);

            this.decode_token_id_tensor = await this.ml_context.createTensor(token_id_desc);
            this.decode_fetches["token_id"] = ort.Tensor.fromMLTensor(this.decode_token_id_tensor, ort_token_id_desc);
            this.decode_tmp_fetches["token_id"] = ort.Tensor.fromMLTensor(
                this.decode_token_id_tensor,
                ort_token_id_desc,
            );
        } else if (this.provider == "webgpu" || this.provider == "wasm") {
            // key value cache is zero copy, just pass gpu buffer as referece
            this.feed["sink_range"] = new ort.Tensor("int32", Int32Array.from([0, 1]), [2]);
            const kv_num_elements = product(this.kv_dims);
            const empty =
                this.dtype === "float16" ? new Uint16Array(kv_num_elements) : new Float32Array(kv_num_elements);
            for (let i = 0; i < this.num_layers; ++i) {
                this.feed[`past_key_values.${i}.decoder.key`] = new ort.Tensor(this.dtype, empty, this.kv_dims);
                this.feed[`past_key_values.${i}.decoder.value`] = new ort.Tensor(this.dtype, empty, this.kv_dims);
            }
        } else {
            throw new Error(`unsupported provider: ${this.provider}`);
        }
    }

    // update key value cache
    update_kv_cache(outputs) {
        for (const name in outputs) {
            if (name.includes("new_present_key_values")) {
                let newName = name.replace(name.split(".")[0], "past_key_values");
                // dispose previous gpu buffers
                const t = this.feed[newName];
                if (t.location === "gpu-buffer") {
                    t.dispose();
                }

                this.feed[newName] = outputs[name];
            }
        }
    }

    // padding input array with 0
    padding_input(input, max_length, reverse = false) {
        if (input.length >= max_length) return input;
        const padding_length = max_length - input.length;
        const padding = Array.from({ length: padding_length }, () => 0);
        if (reverse) {
            padding.push(...input);
            return padding;
        } else {
            input.push(...padding);
            return input;
        }
    }
    //
    // tell generate to stop()
    //
    abort() {
        this.stop = true;
    }

    // prefill prompt and generate tokens, greedy search only
    async generate(input_ids, cleanKV, callback) {
        if (this.output_tokens.length == 0) {
            // first question for sink 2
            input_ids = [1, 1].concat(input_ids);
        }
        this.output_tokens = [];
        if (cleanKV) {
            // clear cache
            this.start_len = 0;
        }
        const input_ids_len = input_ids.length;
        let attn_mask;
        if (this.start_len == 0) {
            attn_mask = Array.from({ length: this.max_cache }, () => 0);
        } else {
            attn_mask = Array.from({ length: Math.min(this.start_len, this.max_cache) }, () => 1);
        }

        // padding input_ids and attn_mask
        input_ids = this.padding_input(input_ids, this.max_seq);
        attn_mask = this.padding_input(attn_mask, this.max_cache, true);
        attn_mask = this.padding_input(attn_mask, this.attn_mask_len);
        for (let i = this.max_cache; i < this.max_cache + input_ids_len; i++) {
            attn_mask[i] = 1;
        }

        this.feed["input_ids"] = new ort.Tensor("int32", Int32Array.from(input_ids), [1, this.max_seq]);
        const attention_mask = new ort.Tensor("int32", Int32Array.from(attn_mask), [1, this.attn_mask_len]);
        this.feed["attention_mask"] = attention_mask;
        const position_ids = Array.from({ length: this.max_seq }, (_, i) => this.start_len + i);
        this.feed["position_ids"] = new ort.Tensor("int32", Int32Array.from(position_ids), [1, this.max_seq]);
        this.stop = false;

        let last_token = 0;
        let outputs;
        if (this.provider == "webnn") {
            await this.sess_1.run(this.feed, this.prefill_fetches);
            let token_id = await this.ml_context.readTensor(this.prefill_fetches["token_id"].mlTensorData);
            last_token = new Int32Array(token_id)[0];
            outputs = this.prefill_fetches;
        } else {
            outputs = await this.sess_1.run(this.feed);
            last_token = outputs["token_id"].cpuData[0];
        }

        console.log("first token: ", last_token);
        this.start_len += input_ids_len;
        this.output_tokens.push(last_token);
        if (callback) {
            callback(this.output_tokens);
        }
        let seqlen = input_ids_len;

        this.update_kv_cache(outputs);
        log(`Max length of output tokens: 1024`);
        while (this.eos.indexOf(last_token) == -1 && !this.stop && this.output_tokens.length <= 1024) {
            this.feed["input_ids"] = new ort.Tensor("int32", Int32Array.from([last_token]), [1, 1]);
            attn_mask = Array.from({ length: Math.min(this.start_len, this.max_cache) }, () => 1);
            attn_mask = this.padding_input(attn_mask, this.max_cache, true);
            attn_mask = this.padding_input(attn_mask, this.max_cache + 1);
            attn_mask[this.max_cache] = 1;
            this.feed["attention_mask"] = new ort.Tensor("int32", new Int32Array(attn_mask), [1, this.max_cache + 1]);
            this.feed["position_ids"] = new ort.Tensor("int32", Int32Array.from([this.start_len]), [1, 1]);

            if (this.provider == "webnn") {
                outputs = this.start_len % 2 == 0 ? this.decode_fetches : this.decode_tmp_fetches;
                await this.sess_2.run(this.feed, outputs);
                let token_id = await this.ml_context.readTensor(outputs["token_id"].mlTensorData);
                last_token = new Int32Array(token_id)[0];
            } else {
                outputs = await this.sess_1.run(this.feed);
                last_token = outputs["token_id"].cpuData[0];
            }

            console.log("next token: ", last_token);
            this.output_tokens.push(last_token);
            if (callback) {
                callback(this.output_tokens);
            }
            this.update_kv_cache(outputs);
            this.start_len += 1;
            // eslint-disable-next-line no-unused-vars
            seqlen += 1;
        }
        return this.output_tokens;
    }
}
