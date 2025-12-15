/* eslint-disable no-undef */
import { AutoProcessor, AutoTokenizer, env } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.15.1";

//'@xenova/transformers';
import { get_new_tokens } from "./generation_utils.js";
import { attention_mask_update, cache_update } from "./post_processing.js";
import {
    $,
    isFloat16ArrayAvailable,
    convertToFloat16OrUint16Array,
    convertToFloat32Array,
    remapHuggingFaceDomainIfNeeded,
} from "../../assets/js/common_utils.js";
import {
    log,
    getModelOPFS,
    updateDecoderCachedCompileProgress,
    updateDecoderCompileProgress,
    updateEncoderCompileProgress,
    updateLoadProgress,
    updateProgressBar,
    loadProgress,
    encoderFetchProgress,
    decoderFetchProgress,
    decoderCachedFetchProgress,
    encoderCompileProgress,
    decoderCompileProgress,
    decoderCachedCompileProgress,
} from "./utils.js";

let tokenizerPath = "";
let processerPath = "";
if (
    location.href.toLowerCase().indexOf("github.io") > -1 ||
    location.href.toLowerCase().indexOf("huggingface.co") > -1 ||
    location.href.toLowerCase().indexOf("vercel.app") > -1
) {
    let path = "webnn/whisper-base-webnn";
    tokenizerPath = `${path}`;
    processerPath = `${path}`;
} else {
    let path = "../../demos/whisper-base/models";
    tokenizerPath = `${path}/tokenizer/`;
    processerPath = `${path}/processor/`;
}

// wrapper around onnxruntime and model
export class Whisper {
    constructor(url, provider, deviceType = "gpu", dataType, mask_4d = true, ioBinding) {
        this.url = url;
        this.provider = provider;
        this.deviceType = deviceType;
        this.dataType = dataType;
        this.mask_4d = mask_4d;
        this.ioBinding = ioBinding;
        this.mlContext = null;
        ort.env.wasm.simd = true;

        this.models = {
            encoder: {
                url: "whisper_base_encoder_lm.onnx",
                sess: null,
                fp16size: "39.3MB",
                fp32size: "78.5MB",
                title: "Whisper Base Encoder",
            },
            decoder: {
                url: "whisper_base_decoder_static_non_kvcache_lm.onnx",
                sess: null,
                fp16size: "149MB",
                fp32size: "298MB",
                title: "Whisper Base Decoder",
            },
            decoder_cached: {
                url: "whisper_base_decoder_static_kvcache_128_lm.onnx",
                sess: null,
                fp16size: "143MB",
                fp32size: "287MB",
                title: "Whisper Base Decoder (Cached)",
            },
        };
        this.hidden_state_shape = [1, 1500, 512];
        this.kv_encoder_shape = [1, 8, 1500, 64];
        this.kv_decoder_shape = [1, 8, 127, 64];
        this.first_logits_shape = [1, 4, 51865];
        this.kv_logits_shape = [1, 1, 51865];

        // Set up preallocated TypedArrays for IO binding reuse.
        this.logits_buffer = null;
        this.kv_logits_buffer = null;

        // Set up preallocated MLTensors for IO binding (initialized once).
        this.pre_allocated_mltensors = {
            encoder: {
                last_hidden_state: null,
            },
            decoder: {
                logits: null,
                kv_cache: null,
            },
            decoder_cached: {
                logits: null,
                kv_cache: null,
            },
        };

        this.max_sequence_length = 128;
        // No. of tokens to be used for decoder 1st inference
        this.num_init_tokens = 4;
        // Whisper was trained using 16000 Hz as sampling rate, fixing this value for dataset preparation
        this.sampling_rate = 16000;
        this.processor = null;
        this.tokenizer = null;
    }

    async create_whisper_processor() {
        // processor contains feature extractor
        if (
            location.href.toLowerCase().indexOf("github.io") > -1 ||
            location.href.toLowerCase().indexOf("huggingface.co") > -1 ||
            location.href.toLowerCase().indexOf("vercel.app") > -1
        ) {
            await remapHuggingFaceDomainIfNeeded(env);
        }
        this.processor = await AutoProcessor.from_pretrained(processerPath);
    }

    async create_whisper_tokenizer() {
        // processor contains feature extractor
        if (
            location.href.toLowerCase().indexOf("github.io") > -1 ||
            location.href.toLowerCase().indexOf("huggingface.co") > -1 ||
            location.href.toLowerCase().indexOf("vercel.app") > -1
        ) {
            await remapHuggingFaceDomainIfNeeded(env);
        }
        this.tokenizer = await AutoTokenizer.from_pretrained(tokenizerPath, {
            config: { do_normalize: true },
        });
    }

    async create_ort_sessions() {
        // Create shared MLContext for IO binding
        if (this.ioBinding && !this.mlContext) {
            this.mlContext = await navigator.ml.createContext({
                deviceType: this.deviceType,
            });
        }

        const options = {
            executionProviders: [
                {
                    name: this.provider,
                    deviceType: this.deviceType,
                    context: this.mlContext,
                },
            ],
            logSeverityLevel: 0,
        };

        log(`WebNN EP Config: ` + JSON.stringify(options.executionProviders));

        for (let name of Object.keys(this.models)) {
            try {
                let url = this.url + this.models[name]["url"];
                if (this.dataType == "float16") {
                    url = url.replace(".onnx", "_fp16_layernorm_gelu.onnx");
                    if (name.includes("decoder")) {
                        if (this.mask_4d) {
                            url = url.replace(".onnx", "_4dmask.onnx");
                        }
                        if (this.ioBinding) {
                            url = url.replace(".onnx", "_iobinding.onnx");
                        }
                    }
                    log(`Loading ${this.models[name]["title"]} · ${this.dataType} · ${this.models[name]["fp16size"]}`);
                } else {
                    url = url.replace(".onnx", "_layernorm.onnx");
                    log(`Loading ${this.models[name]["title"]} · ${this.dataType} · ${this.models[name]["fp32size"]}`);
                }

                const modelBuffer = await getModelOPFS(
                    `${this.ioBinding}_${this.deviceType}_${name}_${this.dataType}`,
                    url,
                    false,
                );
                log(`${this.models[name]["title"]} loaded`);

                log(`Creating session for ${this.models[name]["title"]}`);
                this.models[name]["sess"] = await ort.InferenceSession.create(modelBuffer, options);
                log(`${this.models[name]["title"]} session created`);

                let progressBarLabel = $("#p-bar-label");
                if (name.toLowerCase().indexOf("decoder_cached") > -1) {
                    updateDecoderCachedCompileProgress(4.0);
                    updateLoadProgress(
                        encoderFetchProgress +
                            decoderFetchProgress +
                            encoderCompileProgress +
                            decoderCompileProgress +
                            decoderCachedFetchProgress +
                            decoderCachedCompileProgress,
                    );
                    updateProgressBar(loadProgress.toFixed(2));
                    progressBarLabel.innerHTML = `Whisper Base Decoder (KV-Cache) created · ${loadProgress.toFixed(
                        2,
                    )}%`;
                    // await sleep(1000);
                    updateProgressBar(100.0);
                    progressBarLabel.innerHTML = `100%`;
                } else if (name.toLowerCase().indexOf("decoder") > -1) {
                    updateDecoderCompileProgress(4.0);
                    updateLoadProgress(
                        encoderFetchProgress +
                            decoderFetchProgress +
                            encoderCompileProgress +
                            decoderCompileProgress +
                            decoderCachedFetchProgress +
                            decoderCachedCompileProgress,
                    );
                    updateProgressBar(loadProgress.toFixed(2));
                    progressBarLabel.innerHTML = `Whisper Base Decoder created · ${loadProgress.toFixed(2)}%`;
                } else if (name.toLowerCase().indexOf("encoder") > -1) {
                    updateEncoderCompileProgress(2.0);
                    updateLoadProgress(
                        encoderFetchProgress +
                            decoderFetchProgress +
                            encoderCompileProgress +
                            decoderCompileProgress +
                            decoderCachedFetchProgress +
                            decoderCachedCompileProgress,
                    );
                    updateProgressBar(loadProgress.toFixed(2));
                    progressBarLabel.innerHTML = `Whisper Base Encoder created · ${loadProgress.toFixed(2)}%`;
                }
            } catch (e) {
                log(`Error · ${e.message}`);
            }
        }
    }

    // Helper method to create preallocated MLTensor
    async createOutputMLTensor(shape, dataType = "float32", readable = false) {
        if (!this.ioBinding || !this.mlContext) {
            return null;
        }
        // Create preallocated MLTensor
        const mlTensor = await this.mlContext.createTensor({
            dataType,
            shape,
            readable,
        });

        // Create ORT tensor from MLTensor
        return ort.Tensor.fromMLTensor(mlTensor, {
            dataType,
            dims: shape,
        });
    }

    // Initialize all preallocated MLTensors for optimal real-time performance
    async initialize_preallocated_mltensors() {
        log("Initializing preallocated MLTensors and buffers...");

        // Encoder outputs
        this.pre_allocated_mltensors.encoder.last_hidden_state = await this.createOutputMLTensor(
            this.hidden_state_shape,
            this.dataType,
        );

        // First decoder outputs (non-KV cache)
        this.pre_allocated_mltensors.decoder.logits = await this.createOutputMLTensor(
            this.first_logits_shape,
            this.dataType,
            true,
        );

        // Pre-allocate all KV cache tensors for first decoder
        this.pre_allocated_mltensors.decoder.kv_cache = {};
        for (let i = 0; i < 6; i++) {
            this.pre_allocated_mltensors.decoder.kv_cache[`present_key_values.${i}.encoder.key`] =
                await this.createOutputMLTensor(this.kv_encoder_shape, this.dataType);
            this.pre_allocated_mltensors.decoder.kv_cache[`present_key_values.${i}.encoder.value`] =
                await this.createOutputMLTensor(this.kv_encoder_shape, this.dataType);
            this.pre_allocated_mltensors.decoder.kv_cache[`padded_present_key_values.${i}.decoder.key`] =
                await this.createOutputMLTensor(this.kv_decoder_shape, this.dataType);
            this.pre_allocated_mltensors.decoder.kv_cache[`padded_present_key_values.${i}.decoder.value`] =
                await this.createOutputMLTensor(this.kv_decoder_shape, this.dataType);
        }

        // Cached decoder outputs
        this.pre_allocated_mltensors.decoder_cached.logits = await this.createOutputMLTensor(
            this.kv_logits_shape,
            this.dataType,
            true,
        );

        // Pre-allocate updated KV cache tensors for cached decoder
        this.pre_allocated_mltensors.decoder_cached.kv_cache = {};
        for (let j = 0; j < 6; j++) {
            this.pre_allocated_mltensors.decoder_cached.kv_cache[`updated_present_key_values.${j}.decoder.key`] =
                await this.createOutputMLTensor(this.kv_decoder_shape, this.dataType);
            this.pre_allocated_mltensors.decoder_cached.kv_cache[`updated_present_key_values.${j}.decoder.value`] =
                await this.createOutputMLTensor(this.kv_decoder_shape, this.dataType);
        }

        // Pre-allocate TypedArray buffers
        const logits_elements = this.first_logits_shape.reduce((a, b) => a * b, 1);
        this.logits_buffer =
            this.dataType == "float32"
                ? new Float32Array(logits_elements)
                : isFloat16ArrayAvailable
                  ? new Float16Array(logits_elements)
                  : new Uint16Array(logits_elements);
        const kv_logits_elements = this.kv_logits_shape.reduce((a, b) => a * b, 1);
        this.kv_logits_buffer =
            this.dataType == "float32"
                ? new Float32Array(kv_logits_elements)
                : isFloat16ArrayAvailable
                  ? new Float16Array(kv_logits_elements)
                  : new Uint16Array(kv_logits_elements);

        log("Preallocated MLTensors and buffers initialization complete!");
    }

    async run(audio_data) {
        // -----------------------------------FEATURE EXTRACTION-----------------------------------------
        // const audio = await read_audio('https://huggingface.co/datasets/Narsil/asr_dummy/resolve/main/mlk.flac', 16000);
        // const audio = await read_audio(audio_data, sampling_rate);
        let start = performance.now();
        const { input_features } = await this.processor(audio_data);
        // -----------------------------------ENCODER INFERENCE-----------------------------------------
        // run encoder to get output
        const encoder_input = {
            type: this.dataType,
            data: input_features.data,
            dims: input_features.dims,
        };
        if (this.dataType == "float16") {
            encoder_input.data = convertToFloat16OrUint16Array(encoder_input.data);
        }
        // log(`Pre-processing time: ${(performance.now() - start).toFixed(2)}ms`);
        // start = performance.now();
        let encoder_outputs;
        const encoder_inputs = {
            input_features: new ort.Tensor(encoder_input.type, encoder_input.data, encoder_input.dims),
        };
        if (this.ioBinding) {
            encoder_outputs = {
                last_hidden_state: this.pre_allocated_mltensors.encoder.last_hidden_state,
            };
            await this.models["encoder"]["sess"].run(encoder_inputs, encoder_outputs);
        } else {
            encoder_outputs = await this.models["encoder"]["sess"].run(encoder_inputs);
        }

        // log(`Encoder inference time: ${(performance.now() - start).toFixed(2)}ms`);
        // start = performance.now();
        // -----------------------------------DECODER 1ST INFERENCE-----------------------------------------
        // create list of tokens for english language and transcribe task, no need of time stamps
        // TODO: CHANGE FROM HARDCODED VALUES
        let tokens = [50258, 50259, 50359, 50363];
        // let tokens = [50258, 50259, 50359, 50364]; // keep timestep token
        let attention_mask;
        if (this.mask_4d) {
            const min_val = -65500;
            const mask_data = [0, min_val, min_val, min_val, 0, 0, min_val, min_val, 0, 0, 0, min_val, 0, 0, 0, 0];
            attention_mask = new ort.Tensor("float16", convertToFloat16OrUint16Array(mask_data), [1, 1, 4, 4]);
        } else {
            attention_mask = new ort.Tensor("int32", new Int32Array(4).fill([1, 1, 1, 1]), [1, 4]);
        }
        // create decoder input for the first inference
        const decoder_inputs = {
            input_ids: new ort.Tensor("int32", new Int32Array(tokens), [1, 4]),
            attention_mask: attention_mask,
            encoder_hidden_states: encoder_outputs.last_hidden_state,
        };
        // console.log(`Non-KV cache decoder input preparation time: ${(performance.now() - start).toFixed(2)}ms`);
        // start = performance.now();
        // run the first inference which generates SA and CA KV cache
        // Create inputs object with preallocated outputs for IO binding
        let logits, decoder_outputs;
        if (this.ioBinding) {
            decoder_outputs = {
                logits: this.pre_allocated_mltensors.decoder.logits,
                ...this.pre_allocated_mltensors.decoder.kv_cache,
            };

            await this.models["decoder"]["sess"].run(decoder_inputs, decoder_outputs);
            await this.mlContext.readTensor(decoder_outputs.logits.mlTensor, this.logits_buffer);
            logits = this.logits_buffer;
        } else {
            decoder_outputs = await this.models["decoder"]["sess"].run(decoder_inputs);
            logits = decoder_outputs["logits"]["cpuData"];
        }
        // console.log(`Non-KV cache decoder inference time: ${(performance.now() - start).toFixed(2)}ms`);
        // start = performance.now();

        if (this.dataType == "float16") {
            logits = convertToFloat32Array(logits);
        }
        // find out the token with highest probability, cast INT64 to INT32
        const new_token = get_new_tokens(logits, this.first_logits_shape);

        // add token to final buffer
        tokens = tokens.concat(new_token);
        const time_to_first_token = performance.now() - start; // TTFT

        // -----------------------------------DECODER 2 INFERENCE-----------------------------------------
        // prepare inputs for decoder kv cache
        const kv_decoder_inputs = {};
        // create 1x1 array for input_ids
        kv_decoder_inputs["input_ids"] = new ort.Tensor("int32", new Int32Array([new_token]), [1, 1]);

        // pad attention mask to max_seq_length
        const mask_data = attention_mask_update(
            this.mask_4d ? convertToFloat16OrUint16Array([0, 0, 0, 0]) : new BigInt64Array(4).fill(1n),
            0,
            this.max_sequence_length,
            this.num_init_tokens,
            0,
            this.mask_4d,
        );
        if (this.mask_4d) {
            attention_mask = new ort.Tensor("float16", mask_data, [1, 1, 1, 128]);
        } else {
            attention_mask = new ort.Tensor("int64", mask_data, [1, 128]);
        }
        kv_decoder_inputs["attention_mask"] = attention_mask;
        // create position_ids as input, value should be same of No. of prefill tokens
        kv_decoder_inputs["position_ids"] = new ort.Tensor("int32", new Int32Array([this.num_init_tokens]), [1]);

        // fill decoder kv cache model inputs with cross attention KV cache data from decoder 1st inference
        for (let i = 0; i < 6; i++) {
            kv_decoder_inputs[`past_key_values.${i}.encoder.key`] =
                decoder_outputs[`present_key_values.${i}.encoder.key`];
            kv_decoder_inputs[`past_key_values.${i}.encoder.value`] =
                decoder_outputs[`present_key_values.${i}.encoder.value`];
        }

        // modify the self attention kv cache in place
        if (this.ioBinding) {
            for (let i = 0; i < 6; i++) {
                kv_decoder_inputs[`past_key_values.${i}.decoder.key`] =
                    decoder_outputs[`padded_present_key_values.${i}.decoder.key`];
                kv_decoder_inputs[`past_key_values.${i}.decoder.value`] =
                    decoder_outputs[`padded_present_key_values.${i}.decoder.value`];
            }
        } else {
            cache_update(
                kv_decoder_inputs,
                decoder_outputs,
                0,
                this.max_sequence_length,
                this.num_init_tokens,
                this.num_init_tokens,
                this.dataType,
            );
        }

        // Create output MLTensor for cached decoder before the loop
        let kv_decoder_outputs;
        if (this.ioBinding) {
            kv_decoder_outputs = {
                logits: this.pre_allocated_mltensors.decoder_cached.logits,
                ...this.pre_allocated_mltensors.decoder_cached.kv_cache,
            };
        }

        const position_ids = new Int32Array(kv_decoder_inputs["position_ids"].cpuData.buffer);

        // run complete inference for every item in dataset
        for (let i = 4; i < this.max_sequence_length; i++) {
            // console.log(`Decoder input preparation time · iteration ${i-3}: ${(performance.now() - start).toFixed(2)}ms`);
            // start = performance.now();
            if (this.ioBinding) {
                await this.models["decoder_cached"]["sess"].run(kv_decoder_inputs, kv_decoder_outputs);
                await this.mlContext.readTensor(kv_decoder_outputs.logits.mlTensor, this.kv_logits_buffer);
                logits = this.kv_logits_buffer;
            } else {
                kv_decoder_outputs = await this.models["decoder_cached"]["sess"].run(kv_decoder_inputs);
                logits = kv_decoder_outputs["logits"]["cpuData"];
            }
            // console.log(`Decoder inference time · Iteration ${i-3}: ${(performance.now() - start).toFixed(2)}ms`);
            // start = performance.now();
            // find out the token with highest probability, cast INT64 to INT32
            if (this.dataType == "float16") {
                logits = convertToFloat32Array(logits);
            }
            const new_token = get_new_tokens(logits, this.kv_logits_shape);

            // add token to final buffer
            tokens = tokens.concat(new_token);
            // break if the new token is eos_token_id: 50257 (end of sequence)
            if (new_token == 50257) {
                break;
            }
            // ----------------------------------POST PROCESSING---------------------------------------
            // the following code creates decoder input for the next inference
            kv_decoder_inputs["input_ids"] = new ort.Tensor("int32", new Int32Array([new_token]), [1, 1]);

            // increment the position_ids
            position_ids[0] = position_ids[0] + 1;

            // update mask using position id
            attention_mask_update(
                kv_decoder_inputs["attention_mask"].cpuData,
                i,
                this.max_sequence_length,
                this.num_init_tokens,
                position_ids[0],
                this.mask_4d,
            );

            // modify the kv cache in place
            if (this.ioBinding) {
                // Swap tensors to reuse MLTensor resources efficiently
                // This avoids creating new MLTensors in each iteration
                for (let j = 0; j < 6; j++) {
                    // Save current input tensors
                    const tempKey = kv_decoder_inputs[`past_key_values.${j}.decoder.key`];
                    const tempValue = kv_decoder_inputs[`past_key_values.${j}.decoder.value`];

                    // Move output to input for next iteration
                    kv_decoder_inputs[`past_key_values.${j}.decoder.key`] =
                        kv_decoder_outputs[`updated_present_key_values.${j}.decoder.key`];
                    kv_decoder_inputs[`past_key_values.${j}.decoder.value`] =
                        kv_decoder_outputs[`updated_present_key_values.${j}.decoder.value`];

                    // Reuse previous input tensors as output for next iteration
                    kv_decoder_outputs[`updated_present_key_values.${j}.decoder.key`] = tempKey;
                    kv_decoder_outputs[`updated_present_key_values.${j}.decoder.value`] = tempValue;
                }
            } else {
                cache_update(
                    kv_decoder_inputs,
                    kv_decoder_outputs,
                    i,
                    this.max_sequence_length,
                    this.num_init_tokens,
                    position_ids[0],
                    this.dataType,
                );
            }
        }

        // add token to sentence decode time
        const sentence = await this.tokenizer.decode(tokens, {
            skip_special_tokens: true,
        });

        const num_tokens = tokens.length - 4;
        // log(`Post-processing time: ${(performance.now() - start).toFixed(2)}ms`);
        return { sentence, time_to_first_token, num_tokens };
    }
}
