/* eslint-disable no-undef */
import { AutoProcessor, AutoTokenizer } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.15.1";

//'@xenova/transformers';
import { get_new_tokens } from "./generation_utils.js";
import { attention_mask_update, cache_update } from "./post_processing.js";
import { $, convertToFloat16OrUint16Array, convertToFloat32Array } from "../../assets/js/common_utils.js";
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
    let path = "microsoft/whisper-base-webnn/resolve/main";
    tokenizerPath = `${path}/tokenizer`;
    processerPath = `${path}/processer`;
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
        this.ioBinding = ioBinding && deviceType == 'gpu';
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
        this.processor = await AutoProcessor.from_pretrained(processerPath);
    }

    async create_whisper_tokenizer() {
        // processor contains feature extractor
        this.tokenizer = await AutoTokenizer.from_pretrained(tokenizerPath, {
            config: { do_normalize: true },
        });
    }

    async create_ort_sessions() {
        const options = {
            executionProviders: [
                {
                    name: this.provider,
                    deviceType: this.deviceType,
                },
            ],
            preferredOutputLocation: this.ioBinding ? (() => {
                let pairs = {};
                pairs['last_hidden_state'] = "ml-tensor";
                for (let i = 0; i < 6; i++) {
                    pairs[`padded_present_key_values.${i}.decoder.key`] = "ml-tensor";
                    pairs[`padded_present_key_values.${i}.decoder.value`] = "ml-tensor";
                    pairs[`present_key_values.${i}.encoder.key`] = "ml-tensor";
                    pairs[`present_key_values.${i}.encoder.value`] = "ml-tensor";
                    pairs[`updated_present_key_values.${i}.decoder.key`] = "ml-tensor";
                    pairs[`updated_present_key_values.${i}.decoder.value`] = "ml-tensor";
                }
                return pairs;
            })() : undefined,
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

                const modelBuffer = await getModelOPFS(`${this.ioBinding}_${this.deviceType}_${name}_${this.dataType}`,
                    url, false);
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

    async run(audio_data) {
        // -----------------------------------FEATURE EXTRACTION-----------------------------------------
        // const audio = await read_audio('https://huggingface.co/datasets/Narsil/asr_dummy/resolve/main/mlk.flac', 16000);
        // const audio = await read_audio(audio_data, sampling_rate);
        let start = performance.now();
        const { input_features } = await this.processor(audio_data);
        // -----------------------------------ENCODER INFERENCE-----------------------------------------
        // run encoder to get output
        let encoder_inputs = {
            type: this.dataType,
            data: input_features.data,
            dims: input_features.dims,
        };
        if (this.dataType == "float16") {
            encoder_inputs.data = convertToFloat16OrUint16Array(encoder_inputs.data);
        }
        // log(`Pre-processing time: ${(performance.now() - start).toFixed(2)}ms`);
        // start = performance.now();
        const { last_hidden_state } = await this.models["encoder"]["sess"].run({
            input_features: new ort.Tensor(encoder_inputs.type, encoder_inputs.data, encoder_inputs.dims),
        });
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
        const decoder_input = {
            input_ids: new ort.Tensor("int32", new Int32Array(tokens), [1, 4]),
            attention_mask: attention_mask,
            encoder_hidden_states: last_hidden_state,
        };
        // console.log(`Non-KV cache decoder input preparation time: ${(performance.now() - start).toFixed(2)}ms`);
        // start = performance.now();
        // run the first inference which generates SA and CA KV cache
        const decoder_output = await this.models["decoder"]["sess"].run(decoder_input);
        // console.log(`Non-KV cache decoder inference time: ${(performance.now() - start).toFixed(2)}ms`);
        // start = performance.now();
        let logits = decoder_output["logits"]["cpuData"];

        if (this.dataType == "float16") {
            logits = convertToFloat32Array(logits);
        }
        // find out the token with highest probability, cast INT64 to INT32
        const new_token = get_new_tokens(logits, [1, 4, 51865]);

        // add token to final buffer
        tokens = tokens.concat(new_token);
        const time_to_first_token = performance.now() - start; // TTFT

        // for 2+ inference, we don't need encoder hidden states as input to OV model
        delete decoder_input.encoder_hidden_states;

        // -----------------------------------DECODER 2 INFERENCE-----------------------------------------
        // prepare inputs for decoder kv cache

        // create 1x1 array for input_ids
        decoder_input["input_ids"] = new ort.Tensor("int32", new Int32Array([new_token]), [1, 1]);

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
        decoder_input["attention_mask"] = attention_mask;
        // create position_ids as input, value should be same of No. of prefill tokens
        decoder_input["position_ids"] = new ort.Tensor("int32", new Int32Array([this.num_init_tokens]), [1]);

        // fill decoder kv cache model inputs with cross attention KV cache data from decoder 1st inference
        for (let i = 0; i < 6; i++) {
            decoder_input[`past_key_values.${i}.encoder.key`] = decoder_output[`present_key_values.${i}.encoder.key`];
            decoder_input[`past_key_values.${i}.encoder.value`] =
                decoder_output[`present_key_values.${i}.encoder.value`];
        }

        // modify the self attention kv cache in place
        if (this.ioBinding) {
            for (let i = 0; i < 6; i++) {
                decoder_input[`past_key_values.${i}.decoder.key`] =
                    decoder_output[`padded_present_key_values.${i}.decoder.key`];
                decoder_input[`past_key_values.${i}.decoder.value`] =
                    decoder_output[`padded_present_key_values.${i}.decoder.value`];
            }
        } else {
            cache_update(
                decoder_input,
                decoder_output,
                0,
                this.max_sequence_length,
                this.num_init_tokens,
                this.num_init_tokens,
                this.dataType
            );
        }

        const position_ids = new Int32Array(decoder_input["position_ids"].cpuData.buffer);
        // run complete inference for every item in dataset
        for (let i = 4; i < this.max_sequence_length; i++) {
            // console.log(`Decoder input preparation time · iteration ${i-3}: ${(performance.now() - start).toFixed(2)}ms`);
            // start = performance.now();
            const decoder_cached_output = await this.models["decoder_cached"]["sess"].run(decoder_input);

            // console.log(`Decoder inference time · Iteration ${i-3}: ${(performance.now() - start).toFixed(2)}ms`);
            // start = performance.now();
            // find out the token with highest probability, cast INT64 to INT32
            let logits = decoder_cached_output["logits"]["cpuData"];
            if (this.dataType == "float16") {
                logits = convertToFloat32Array(logits);
            }
            const new_token = get_new_tokens(logits, [1, 1, 51865]);

            // add token to final buffer
            tokens = tokens.concat(new_token);
            // break if the new token is eos_token_id: 50257 (end of sequence)
            if (new_token == 50257) {
                break;
            }
            // ----------------------------------POST PROCESSING---------------------------------------
            // the following code creates decoder input for the next inference
            decoder_input["input_ids"] = new ort.Tensor("int32", new Int32Array([new_token]), [1, 1]);

            // increment the position_ids
            position_ids[0] = position_ids[0] + 1;

            // update mask using position id
            attention_mask_update(
                decoder_input["attention_mask"].cpuData,
                i,
                this.max_sequence_length,
                this.num_init_tokens,
                position_ids[0],
                this.mask_4d,
            );

          // modify the kv cache in place
          if (this.ioBinding) {
              for (let i = 0; i < 6; i++) {
                  // dispose previous tensors
                  decoder_input[`past_key_values.${i}.decoder.key`].mlTensor.destroy();
                  decoder_input[`past_key_values.${i}.decoder.value`].mlTensor.destroy();
                  // update the kv cache
                  decoder_input[`past_key_values.${i}.decoder.key`] =
                      decoder_cached_output[`updated_present_key_values.${i}.decoder.key`];
                  decoder_input[`past_key_values.${i}.decoder.value`] =
                      decoder_cached_output[`updated_present_key_values.${i}.decoder.value`];
              }
          } else {
              cache_update(
                  decoder_input,
                  decoder_cached_output,
                  i,
                  this.max_sequence_length,
                  this.num_init_tokens,
                  position_ids[0],
                  this.dataType
              );
          }

        }

        if (this.ioBinding) {
            for (let i = 0; i < 6; i++) {
                decoder_output[`padded_present_key_values.${i}.decoder.key`].mlTensor.destroy();
                decoder_output[`padded_present_key_values.${i}.decoder.value`].mlTensor.destroy();
                decoder_input[`past_key_values.${i}.encoder.key`].mlTensor.destroy();
                decoder_input[`past_key_values.${i}.encoder.value`].mlTensor.destroy();
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
