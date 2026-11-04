/* eslint-disable no-undef */
import {
    AutoTokenizer,
    env,
} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2/dist/transformers.min.js";
import {
    isFloat16ArrayAvailable,
    getQueryValue,
    getHuggingFaceDomain,
    remapHuggingFaceDomainIfNeeded,
    checkRemoteEnvironment,
} from "../../assets/js/common_utils.js";
const HF_MODEL_REPO = "webnn/stable-diffusion-v1.5-webnn";
let tokenizers;
document.addEventListener("DOMContentLoaded", async () => {
    let path = "";
    // Transformers.js v3+ disables local models in the browser by default. Keep it off for remote repos,
    // otherwise it probes (and 404s on) a local `/models/<repo>/` path before falling back to Hugging Face.
    env.allowLocalModels = false;
    if (checkRemoteEnvironment()) {
        path = HF_MODEL_REPO;
        // Transformers.js loads tokenizer files from the repo root, but they live in `tokenizer/` here.
        env.remotePathTemplate = "{model}/resolve/{revision}/tokenizer/";
        await remapHuggingFaceDomainIfNeeded(env);
    } else {
        env.allowLocalModels = true;
        path = "../../demos/stable-diffusion-1.5/models/tokenizer/";
    }
    tokenizers = await AutoTokenizer.from_pretrained(path);
});

export async function getTokenizers(text) {
    const { input_ids } = await tokenizers(text);
    return Array.from(input_ids.data, number => Number(number)).flat();
}

export function generateTensorFillValue(dataType, shape, value) {
    let size = 1;
    shape.forEach(element => {
        size *= element;
    });
    switch (dataType) {
        case "uint8":
            return new ort.Tensor(
                dataType,
                Uint8Array.from({ length: size }, () => value),
                shape,
            );
        case "int8":
            return new ort.Tensor(
                dataType,
                Int8Array.from({ length: size }, () => value),
                shape,
            );
        case "uint16":
            return new ort.Tensor(
                dataType,
                Uint16Array.from({ length: size }, () => value),
                shape,
            );
        case "int16":
            return new ort.Tensor(
                dataType,
                Int16Array.from({ length: size }, () => value),
                shape,
            );
        case "uint32":
            return new ort.Tensor(
                dataType,
                Uint32Array.from({ length: size }, () => value),
                shape,
            );
        case "int32":
            return new ort.Tensor(
                dataType,
                Int32Array.from({ length: size }, () => value),
                shape,
            );
        case "float16":
            return new ort.Tensor(
                dataType,
                isFloat16ArrayAvailable
                    ? Float16Array.from({ length: size }, () => value)
                    : Uint16Array.from({ length: size }, () => value),
                shape,
            );
        case "float32":
            return new ort.Tensor(
                dataType,
                Float32Array.from({ length: size }, () => value),
                shape,
            );
        case "uint64":
            return new ort.Tensor(
                dataType,
                BigUint64Array.from({ length: size }, () => value),
                shape,
            );
        case "int64":
            return new ort.Tensor(
                dataType,
                BigInt64Array.from({ length: size }, () => value),
                shape,
            );
    }
    throw new Error(`Input tensor type ${dataType} is unknown`);
}

export function generateTensorFromValues(dataType, shape, values) {
    // eslint-disable-next-line no-unused-vars
    let size = 1;
    shape.forEach(element => {
        size *= element;
    });
    //log(`values.byteLength: ${values.byteLength}`;
    //log(`size: ${size}`);
    switch (dataType) {
        case "uint8":
            return new ort.Tensor(dataType, new Uint8Array(values), shape);
        case "int8":
            return new ort.Tensor(dataType, new Int8Array(values), shape);
        case "uint16":
            return new ort.Tensor(dataType, new Uint16Array(values), shape);
        case "int16":
            return new ort.Tensor(dataType, new Int16Array(values), shape);
        case "uint32":
            return new ort.Tensor(dataType, new Uint32Array(values), shape);
        case "int32":
            return new ort.Tensor(dataType, new Int32Array(values), shape);
        case "float16":
            return new ort.Tensor(
                dataType,
                isFloat16ArrayAvailable ? new Float16Array(values) : new Uint16Array(values),
                shape,
            );
        case "float32":
            return new ort.Tensor(dataType, new Float32Array(values), shape);
        case "uint64":
            return new ort.Tensor(dataType, new BigUint64Array(values), shape);
        case "int64":
            return new ort.Tensor(dataType, new BigInt64Array(values), shape);
    }
    throw new Error(`Input tensor type ${dataType} is unknown`);
}

export function generateTensorFromBytes(dataType, shape, values) {
    // eslint-disable-next-line no-unused-vars
    let size = 1;
    shape.forEach(element => {
        size *= element;
    });

    // Coerce TypedArray to actual byte buffer, to avoid constructor behavior that casts to the target type.
    if (!(values instanceof ArrayBuffer)) {
        values = values.buffer;
    }
    switch (dataType) {
        case "uint8":
            return new ort.Tensor(dataType, new Uint8Array(values), shape);
        case "int8":
            return new ort.Tensor(dataType, new Int8Array(values), shape);
        case "uint16":
            return new ort.Tensor(dataType, new Uint16Array(values), shape);
        case "int16":
            return new ort.Tensor(dataType, new Int16Array(values), shape);
        case "uint32":
            return new ort.Tensor(dataType, new Uint32Array(values), shape);
        case "int32":
            return new ort.Tensor(dataType, new Int32Array(values), shape);
        case "float16":
            return new ort.Tensor(
                dataType,
                isFloat16ArrayAvailable ? new Float16Array(values) : new Uint16Array(values),
                shape,
            );
        case "float32":
            return new ort.Tensor(dataType, new Float32Array(values), shape);
        case "uint64":
            return new ort.Tensor(dataType, new BigUint64Array(values), shape);
        case "int64":
            return new ort.Tensor(dataType, new BigInt64Array(values), shape);
    }
    throw new Error(`Input tensor type ${dataType} is unknown`);
}

export function decodeFloat16(binaryValue) /*: float Number*/ {
    "use strict";
    let fraction = binaryValue & 0x03ff;
    let exponent = (binaryValue & 0x7c00) >> 10;
    return (
        (binaryValue >> 15 ? -1 : 1) *
        (exponent
            ? exponent === 0x1f
                ? fraction
                    ? NaN
                    : Infinity
                : Math.pow(2, exponent - 15) * (1 + fraction / 0x400)
            : 6.103515625e-5 * (fraction / 0x400))
    );
}

// https://stackoverflow.com/questions/32633585/how-do-you-convert-to-half-floats-in-javascript
export function encodeFloat16(floatValue) /*: uint16 Number*/ {
    let floatView = new Float32Array(1);
    let int32View = new Int32Array(floatView.buffer);

    floatView[0] = floatValue;
    let x = int32View[0];

    let bits = (x >> 16) & 0x8000; // Get the sign
    let m = (x >> 12) & 0x07ff; // Keep one extra bit for rounding
    let e = (x >> 23) & 0xff; // Using int is faster here

    // If zero, denormal, or underflowing exponent, then return signed zero.
    if (e < 103) {
        return bits;
    }

    // If NaN, return NaN. If Inf or exponent overflow, return Inf.
    if (e > 142) {
        bits |= 0x7c00;
        // If exponent was 0xff and one mantissa bit was set, it means NaN,
        // not Inf, so make sure we set one mantissa bit too.
        bits |= (e == 255 ? 0 : 1) && x & 0x007fffff;
        return bits;
    }

    // If exponent underflows but not too much, return a denormal
    if (e < 113) {
        m |= 0x0800;
        // Extra rounding may overflow and set mantissa to 0 and exponent to 1, which is okay.
        bits |= (m >> (114 - e)) + ((m >> (113 - e)) & 1);
        return bits;
    }

    bits |= ((e - 112) << 10) | (m >> 1);
    // Extra rounding. An overflow will set mantissa to 0 and increment the exponent, which is okay.
    bits += m & 1;
    return bits;
}

// `?model=<base url>` overrides where the models are loaded from, otherwise it is Hugging Face when deployed and
// the local `models/` folder (see fetch_models.js) when running locally.
export const modelUrl = async path => {
    let base = getQueryValue("model");
    if (base) {
        base = base.replace(/\/$/, "");
        if (base.includes("huggingface.co")) {
            base = base.replace("huggingface.co", await getHuggingFaceDomain());
        }
    } else if (checkRemoteEnvironment()) {
        base = `https://${await getHuggingFaceDomain()}/${HF_MODEL_REPO}/resolve/main`;
    } else {
        base = "models";
    }
    return `${base}/${path}`;
};

export const getSafetyChecker = () => {
    if (getQueryValue("safetychecker")) {
        return getQueryValue("safetychecker") === "true" ? true : false;
    } else {
        return true;
    }
};
