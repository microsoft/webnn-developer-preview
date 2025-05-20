/* eslint-disable no-undef */
import { $ } from "../../assets/js/common_utils.js";
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
    output_tokens = [];
    eos = [32007, 32000]; // end tokens
    need_position_ids = true;
    stop = false;
    kv_dims = [];
    dtype = "float16";
    device_type = "gpu";
    max_seq = 128;
    max_cache = 512;
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
        this.ml_context = await navigator.ml.createContext({ deviceType: this.device_type });
        const session_options = {
            executionProviders: [{ name: this.provider, deviceType: this.device_type, context: this.ml_context }],
            externalData: [
                {
                    data: external_data_bytes,
                    path: external_file,
                },
            ],
        };

        log(
            `WebNN EP config: ${model} · ${this.dtype} · ${session_options.executionProviders[0].name} · ${session_options.executionProviders[0].deviceType}`,
        );

        const location_type = this.provider == "webnn" ? "ml-tensor" : "gpu-buffer";
        switch (this.provider) {
            case "webnn":
            case "webgpu":
                // Bind kv cache outputs to ml-tensor or gpu-buffer
                session_options.preferredOutputLocation = {};
                for (let i = 0; i < 32; ++i) {
                    session_options.preferredOutputLocation[`new_present_key_values.${i}.decoder.key`] = location_type;
                    session_options.preferredOutputLocation[`new_present_key_values.${i}.decoder.value`] =
                        location_type;
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

        let progressBarLabel = $("#p-bar-label");
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
        // dispose previous tensors
        for (const name in this.feed) {
            const t = this.feed[name];
            if (t.location === "gpu-buffer" || t.location === "ml-tensor") {
                t.dispose();
            }
        }

        this.feed = {};
        this.feed["sink_range"] = new ort.Tensor("int32", Int32Array.from([0, 1]), [2]);
        if (this.provider == "webnn") {
            // init kv cache ml-tensor
            const kv_desc = { dataType: this.dtype, shape: this.kv_dims };
            const ort_kv_desc = { dataType: this.dtype, dims: this.kv_dims };
            const input_ml_tensor = await this.ml_context.createTensor(kv_desc);
            for (let i = 0; i < this.num_layers; ++i) {
                this.feed[`past_key_values.${i}.decoder.key`] = ort.Tensor.fromMLTensor(input_ml_tensor, ort_kv_desc);
                this.feed[`past_key_values.${i}.decoder.value`] = ort.Tensor.fromMLTensor(input_ml_tensor, ort_kv_desc);
            }
        } else {
            const kv_num_elements = product(this.kv_dims);
            const empty =
                this.dtype === "float16" ? new Uint16Array(kv_num_elements) : new Float32Array(kv_num_elements);
            for (let i = 0; i < this.num_layers; ++i) {
                this.feed[`past_key_values.${i}.decoder.key`] = new ort.Tensor(this.dtype, empty, this.kv_dims);
                this.feed[`past_key_values.${i}.decoder.value`] = new ort.Tensor(this.dtype, empty, this.kv_dims);
            }
        }
    }

    // update key value cache
    update_kv_cache(outputs) {
        for (const name in outputs) {
            if (name.includes("new_present_key_values")) {
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
        let outputs = await this.sess_1.run(this.feed);
        last_token = outputs["token_id"].cpuData[0];
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

            outputs = await this.sess_2.run(this.feed);
            last_token = outputs["token_id"].cpuData[0];

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
