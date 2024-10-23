import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import ProgressBar from "progress";
import { fileURLToPath } from "url";
import { dirname } from "path";
// Uncomment the following line if proxy is required to fetch files in your network
// import { HttpsProxyAgent } from 'https-proxy-agent';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const models = [
    {
        url: "xenova/resnet-50/resolve/main/onnx/model_fp16.onnx",
        path: "./demos/image-classification/models/xenova/resnet-50/onnx",
    },
    {
        url: "webnn/mobilenet-v2/resolve/main/onnx/model_fp16.onnx",
        path: "./demos/image-classification/models/webnn/mobilenet-v2/onnx",
    },
    {
        url: "webnn/efficientnet-lite4/resolve/main/onnx/model_fp16.onnx",
        path: "./demos/image-classification/models/webnn/efficientnet-lite4/onnx",
    },
    {
        url: "microsoft/sd-turbo-webnn/resolve/main/text_encoder/model_layernorm.onnx",
        path: "./demos/sd-turbo/models/text_encoder",
    },
    {
        url: "microsoft/sd-turbo-webnn/resolve/main/unet/model_layernorm.onnx",
        path: "./demos/sd-turbo/models/unet",
    },
    {
        url: "microsoft/sd-turbo-webnn/resolve/main/vae_decoder/model.onnx",
        path: "./demos/sd-turbo/models/vae_decoder",
    },
    {
        url: "microsoft/sd-turbo-webnn/resolve/main/safety_checker/safety_checker_int32_reduceSum.onnx",
        path: "./demos/sd-turbo/models/safety_checker",
    },
    {
        url: "microsoft/stable-diffusion-v1.5-webnn/resolve/main/text-encoder.onnx",
        path: "./demos/stable-diffusion-1.5/models",
    },
    {
        url: "microsoft/stable-diffusion-v1.5-webnn/resolve/main/sd-unet-v1.5-model-b2c4h64w64s77-float16-compute-and-inputs-layernorm.onnx",
        path: "./demos/stable-diffusion-1.5/models",
    },
    {
        url: "microsoft/stable-diffusion-v1.5-webnn/resolve/main/Stable-Diffusion-v1.5-vae-decoder-float16-fp32-instancenorm.onnx",
        path: "./demos/stable-diffusion-1.5/models",
    },
    {
        url: "microsoft/stable-diffusion-v1.5-webnn/resolve/main/safety_checker_int32_reduceSum.onnx",
        path: "./demos/stable-diffusion-1.5/models",
    },
    {
        url: "microsoft/segment-anything-model-webnn/resolve/main/sam_vit_b_01ec64.encoder-fp16.onnx",
        path: "./demos/segment-anything/models",
    },
    {
        url: "microsoft/segment-anything-model-webnn/resolve/main/sam_vit_b_01ec64.decoder-fp16.onnx",
        path: "./demos/segment-anything/models",
    },
    {
        url: "microsoft/segment-anything-model-webnn/resolve/main/sam_vit_b-encoder-int8.onnx",
        path: "./demos/segment-anything/models",
    },
    {
        url: "microsoft/segment-anything-model-webnn/resolve/main/sam_vit_b-decoder-int8.onnx",
        path: "./demos/segment-anything/models",
    },
    {
        url: "microsoft/whisper-base-webnn/resolve/main/whisper_base_decoder_static_kvcache_128_lm_fp16_layernorm_4dmask.onnx",
        path: "./demos/whisper-base/models",
        note: "Decoder model with 4dmask for WebNN GPU",
    },
    {
        url: "microsoft/whisper-base-webnn/resolve/main/whisper_base_decoder_static_kvcache_128_lm_fp16_layernorm_gelu_4dmask.onnx",
        path: "./demos/whisper-base/models",
        note: "Gelu and 4dmask are used for decoder on WebNN NPU",
    },
    {
        url: "microsoft/whisper-base-webnn/resolve/main/whisper_base_decoder_static_non_kvcache_lm_fp16_layernorm_4dmask.onnx",
        path: "./demos/whisper-base/models",
        note: "Decoder model with 4dmask for WebNN GPU",
    },
    {
        url: "microsoft/whisper-base-webnn/resolve/main/whisper_base_decoder_static_non_kvcache_lm_fp16_layernorm_gelu_4dmask.onnx",
        path: "./demos/whisper-base/models",
        note: "Gelu and 4dmask are used for decoder on WebNN NPU",
    },
    {
        url: "microsoft/whisper-base-webnn/resolve/main/whisper_base_encoder_lm_fp16_layernorm.onnx",
        path: "./demos/whisper-base/models",
        note: "Encoder model for WebNN GPU",
    },
    {
        url: "microsoft/whisper-base-webnn/resolve/main/whisper_base_encoder_lm_fp16_layernorm_gelu.onnx",
        path: "./demos/whisper-base/models",
        note: "Gelu is used for encoder on WebNN NPU",
    },
];

const downloadFile = async (url, outputPath, retries = 2) => {
    // Proxy configuration
    // const proxyHost = '';
    // const proxyPort = 8080;
    // const proxyUrl = `http://${proxyHost}:${proxyPort}`;
    const proxyAgent = undefined;
    // Enable this line to use the proxy:
    // const proxyAgent = new HttpsProxyAgent(proxyUrl);

    try {
        const response = await fetch(url, { agent: proxyAgent });
        if (response.ok) {
            const totalLength = response.headers.get("content-length");
            const progressBar = new ProgressBar("-> downloading [:bar] :percent :etas", {
                width: 40,
                complete: "=",
                incomplete: " ",
                renderThrottle: 1,
                total: parseInt(totalLength),
            });

            const fileStream = fs.createWriteStream(outputPath);
            response.body.on("data", chunk => progressBar.tick(chunk.length));
            response.body.pipe(fileStream);

            return new Promise((resolve, reject) => {
                fileStream.on("finish", resolve);
                fileStream.on("error", reject);
            });
        } else {
            throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        if (retries === 0) {
            console.error(`Failed to download ${url} after multiple attempts`, error);
            throw error;
        } else {
            console.warn(`Retrying download for ${url} (${retries} retries left)`);
            return downloadFile(url, outputPath, retries - 1);
        }
    }
};

(async () => {
    let i = 1;
    for (const model of models) {
        const outputPath = path.join(__dirname, model.path, path.basename(model.url));
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        console.log(`[${i}/${models.length}] Downloading https://huggingface.co/${model.url} to ${outputPath}`);
        try {
            await downloadFile(`https://huggingface.co/${model.url}`, outputPath);
            console.log(`[${i}/${models.length}] Downloaded https://huggingface.co/${model.url} to ${outputPath}`);
        } catch (error) {
            console.error(`Failed to download https://huggingface.co/${model.url}`, error);
        }
        i++;
    }
})();
