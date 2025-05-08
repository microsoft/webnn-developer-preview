/* eslint-disable no-undef */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
//
// An example how to run LLM in onnxruntime-web.
//

import { log, logUser, logError } from "./utils.js";
import {
    $,
    $$,
    getQueryValue,
    getWebnnStatus,
    setupORT,
    showCompatibleChromiumVersion,
    updateQueryStringParameter,
} from "../../assets/js/common_utils.js";
import { env, AutoTokenizer } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.4.2";
import { LLM } from "./llm.js";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

const MODELS = {
    tinyllama: {
        name: "TinyLlama 1.1B Chat v1.0",
        desc: "Meta TinyLlama-1.1B-Chat-v1.0",
        id: "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
        file_name: "model.onnx",
        local_path: "models/TinyLlama/TinyLlama-1.1B-Chat-v1.0/",
        remote_path: "https://huggingface.co/webnn/TinyLlama-1.1B-Chat-v1.0-onnx/resolve/main/",
        eos_token_id: [151645, 151643, 2],
        max_length: 2048,
        num_layers: 22,
        kv_num_heads: 4,
        head_size: 64,
        system_content: "You are a friendly chatbot who always responds in the style of a pirate", // "You are MiniThinky, a helpful AI assistant. You always think before giving the answer. Use <|thinking|> before thinking and <|answer|> before giving the answer."
    },
    phi3mini: {
        name: "Phi-3 Mini 4k Instruct",
        desc: "Microsoft Phi-3-mini-4k-instruct-onnx",
        id: "microsoft/directml-int4-awq-block-128",
        remote_id: "microsoft/Phi-3-mini-4k-instruct",
        file_name: "model.onnx",
        local_path: "models/microsoft/directml-int4-awq-block-128/",
        remote_path:
            "https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-onnx/resolve/main/directml/directml-int4-awq-block-128/",
        eos_token_id: [32000, 32001, 32007],
        max_length: 4096,
        num_layers: 32,
        kv_num_heads: 32,
        head_size: 96,
        system_content: "You are a helpful AI assistant.",
    },
    qwen2: {
        name: "Qwen2 0.5B Instruct",
        desc: "Alibaba Qwen2-0.5B-Instruct",
        id: "Qwen/Qwen2-0.5B-Instruct",
        file_name: "model.onnx",
        local_path: "models/Qwen/Qwen2-0.5B-Instruct/",
        remote_path: "https://huggingface.co/webnn/Qwen2-0.5B-Instruct-onnx/resolve/main/",
        eos_token_id: [151645, 151643],
        max_length: 32768,
        num_layers: 24,
        kv_num_heads: 2,
        head_size: 64,
        system_content: "You are a helpful assistant.",
    },
    deepseekr1: {
        name: "DeepSeek R1 Distill Qwen 1.5B",
        desc: "DeepSeek R1 Distill Qwen 1.5B",
        id: "onnxruntime/DeepSeek-R1-Distill-ONNX",
        remote_id: "onnx-community/DeepSeek-R1-Distill-Qwen-1.5B-ONNX", // we actually use tokenizer files from this repo
        file_name: "model.onnx",
        local_path: "models/onnxruntime/DeepSeek-R1-Distill-ONNX/",
        remote_path:
            "https://huggingface.co/onnxruntime/DeepSeek-R1-Distill-ONNX/resolve/main/deepseek-r1-distill-qwen-1.5B/gpu/gpu-int4-rtn-block-32/",
        eos_token_id: [151643],
        max_length: 131072,
        num_layers: 28,
        kv_num_heads: 2,
        head_size: 128,
        system_content: "",
    },
};

let performanceIndicator;
let userInput, chatHistory;
let sendButton, stopButton, buttons, scrollWrapper;
let modelSelectors;
let provider = "webnn";
let deviceType = "gpu";
let device;
let badge;
let ctrl = false;
let ready = false;
let cleanCache = false;

const clipboardIcon = `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-clipboard' viewBox='0 0 16 16'>
<path d='M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z'/>
<path d='M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z'/>
</svg>`;

marked.use({ mangle: false, headerIds: false });

//
// Auto scroll the content area until a user scrolls up
//
let isAutoScrollOn = true;
let lastKnownScrollPosition = 0;
let ticking = false;

const autoScroller = new ResizeObserver(() => {
    if (isAutoScrollOn) {
        scrollWrapper.scrollIntoView({ behavior: "smooth", block: "end" });
    }
});

document.addEventListener("scroll", () => {
    if (!ticking && isAutoScrollOn && window.scrollY < lastKnownScrollPosition) {
        window.requestAnimationFrame(() => {
            isAutoScrollOn = false;
            ticking = false;
        });
        ticking = true;
    } else if (
        !ticking &&
        !isAutoScrollOn &&
        window.scrollY > lastKnownScrollPosition &&
        window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 30
    ) {
        window.requestAnimationFrame(() => {
            isAutoScrollOn = true;
            ticking = false;
        });
        ticking = true;
    }
    lastKnownScrollPosition = window.scrollY;
});

//
// Make response available for copying to clipboard
//
function copyTextToClipboard(responseDiv) {
    const copyButton = document.createElement("button");
    copyButton.className = "copy-button";
    copyButton.setAttribute("title", "Copy response to clipboard");
    copyButton.innerHTML = clipboardIcon;
    copyButton.onclick = () => {
        navigator.clipboard.writeText(responseDiv.innerText);
        logUser("Copied response to clipboard");
    };
    let responseMessageOuter = $$(".response-message-outer");
    let lastResponseMessageOuter = responseMessageOuter[responseMessageOuter.length - 1];
    lastResponseMessageOuter.appendChild(copyButton);
}

//
// User hits send, Enter or Ctrl + Enter
//
async function submitRequest(e) {
    if (ready === false) {
        return;
    }
    if (userInput.innerText.length < 1 && sendButton.disabled === false && ctrl === false) {
        logUser("Please type a message");
        return;
    }
    if (sendButton.disabled === true) {
        llm.abort();
        buttons.setAttribute("class", "button-group key");
        sendButton.disabled = false;
        return;
    }

    // Enter will continue the conversation, Ctrl + Enter will clear the chat history and start a new conversation
    const continuation = !(e.ctrlKey && e.key === "Enter");

    if (continuation) {
        logUser(`Continuation: ${continuation}`);
    } else {
        performanceIndicator.innerHTML = "";
        logUser(`Continuation: ${continuation}. New conversation started.`);
    }

    let input = userInput.innerText;
    if (input.length == 0) {
        chatHistory.context = "";
        while (chatHistory.firstChild) {
            chatHistory.firstChild.remove();
        }
        return;
    }
    let context = chatHistory.context;
    if (context === undefined) {
        context = "";
    }

    // Append to chat history
    let messageElement = document.createElement("div");
    messageElement.className = "message-element";
    let userMessageDiv = document.createElement("div");
    userMessageDiv.className = "user-message";
    userMessageDiv.innerText = input;
    messageElement.appendChild(userMessageDiv);
    chatHistory.appendChild(messageElement);

    // Container for llm response
    let responseDiv = document.createElement("div");
    responseDiv.className = "response-message";
    let responseOuter = document.createElement("div");
    responseOuter.className = "response-message-outer";
    let spinner = document.createElement("div");
    spinner.innerHTML = `<span class="dots"></span>`;
    responseDiv.appendChild(spinner);
    responseOuter.appendChild(responseDiv);
    chatHistory.appendChild(responseOuter);

    // Toggle button to stop text generation
    sendButton.disabled = true;
    buttons.setAttribute("class", "button-group key inferencing");

    // Change autoScroller to keep track of our new responseDiv
    autoScroller.observe(responseDiv);

    Query(continuation, input, word => {
        responseDiv.innerHTML = marked.parse(word);
    })
        .then(() => {
            chatHistory.context = responseDiv.innerHTML;
            copyTextToClipboard(responseDiv, true);
            sendButton.disabled = false;
            buttons.setAttribute("class", "button-group key");
            spinner.remove();
        })
        .catch(error => {
            console.error(error);
            sendButton.disabled = false;
            buttons.setAttribute("class", "button-group key");
            spinner.remove();
        });

    // Clear user input
    userInput.innerHTML = "";
}

//
// Event listener for Ctrl + Enter or Enter
//
$("#user-input").addEventListener("keydown", async function (e) {
    if (e.ctrlKey && e.key === "Enter") {
        ctrl = true;
        cleanCache = true;
        submitRequest(e);
    } else if (e.key === "Enter") {
        e.preventDefault();
        ctrl = false;
        submitRequest(e);
    }
});

function getConfig() {
    const query = window.location.search.substring(1);
    var config = {
        model: "phi3mini",
        provider: "webnn",
        deviceType: "gpu",
        profiler: 0,
        verbose: 0,
        threads: 1,
        show_special: 0,
        csv: 0,
        max_length: 512,
        local: 0,
    };
    let vars = query.split("&");
    let errorMessage = "";
    for (var i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] in config) {
            const key = pair[0];
            const value = decodeURIComponent(pair[1]);
            if (typeof config[key] == "number") {
                config[key] = parseInt(value);
            } else {
                config[key] = value;
            }
        }
    }
    if (MODELS[config.model] !== undefined) {
        config.model = MODELS[config.model];
    } else {
        errorMessage = `Unsupported model name: ${config.model}`;
        logError(errorMessage);
        throw new Error(errorMessage);
    }
    if (config.max_length < 0 || config.max_length > config.model.context_length) {
        errorMessage = `max_length should not execeed ${config.model.context_length}`;
        logError(errorMessage);
        throw new Error(errorMessage);
    }
    return config;
}

const config = getConfig();

location.hostname.includes("github.io") ? (config.local = 0) : (config.local = 1);

// Setup for transformers.js tokenizer
env.localModelPath = "models";
env.allowRemoteModels = config.local == 0;
env.allowLocalModels = config.local == 1;

let tokenizer;

const llm = new LLM(config.max_length);
let messages = [];

if (config.model.system_content) {
    messages.push({ role: "system", content: config.model.system_content });
}

function tokenToText(tokenizer, tokens) {
    const text = tokenizer.decode(tokens, { skip_special_tokens: config.show_special != 1 });
    return text;
}

async function Query(continuation, query, cb) {
    performanceIndicator.innerHTML = "";
    logUser(`Prompt: ${query}`);
    let userChatTemplate = { role: "user", content: query };
    messages.push(userChatTemplate);
    let inputIds = tokenizer.apply_chat_template(messages, {
        add_generation_prompt: true,
        tokenize: true,
        return_tensor: false,
    });

    // Clean up
    if (llm.outputTokens.length == 0 || !continuation || cleanCache || inputIds.length > llm.maxLength) {
        // Initialize kv cache
        await llm.initializeFeed();
        cleanCache = true;
        if (inputIds.length > llm.maxLength) {
            console.log(`Context length exceeds max new tokens, clean up...`);
        }
        // Clean up messages if there is a cache
        if (messages.length > 2) {
            if (messages[0]["role"] == "system") {
                messages = messages.slice(0, 1);
            } else {
                messages = [];
            }
            messages.push(userChatTemplate);
            inputIds = tokenizer.apply_chat_template(messages, {
                add_generation_prompt: true,
                tokenize: true,
                return_tensor: false,
            });
        }
    }
    console.log("messages: ", messages);
    // Convert inputIds to BigInt
    inputIds = inputIds.map(num => BigInt(num));
    logUser(`Prompt length: ${inputIds.length}`);

    let timeToFirstToken;
    const startTimer = performance.now();
    const outputTokens = await llm.generate(inputIds, outputTokens => {
        if (outputTokens.length == 1) {
            // Time to first token
            timeToFirstToken = (performance.now() - startTimer) / 1000;
        }
        cb(tokenToText(tokenizer, outputTokens));
    });

    const outputContent = tokenizer.decode(outputTokens, {
        skip_special_tokens: config.show_special != 1,
    });
    let assistentChatTemplate = { role: "assistant", content: outputContent };
    messages.push(assistentChatTemplate);
    cleanCache = false;

    const took = (performance.now() - startTimer) / 1000;
    const timeToNewTokens = took - timeToFirstToken;
    const sequenceLength = outputTokens.length;
    log(`${sequenceLength} tokens in ${took.toFixed(2)} sec<br/>
    Time to first token: ${timeToFirstToken.toFixed(2)} sec<br/>
    New tokens per second: ${((sequenceLength - 1) / timeToNewTokens).toFixed(2)} tokens/sec`);

    const timeToFirstTokenPerformanceUnit = document.createElement("div");
    timeToFirstTokenPerformanceUnit.className = "tokens-per-second-performance-unit";
    timeToFirstTokenPerformanceUnit.innerHTML = `time to first token`;
    const timeToFirstTokenPerformance = document.createElement("div");
    timeToFirstTokenPerformance.className = "tokens-per-second-performance-data";
    timeToFirstTokenPerformance.innerHTML = `${timeToFirstToken.toFixed(2)}s`;
    const performanceDataTtfs = document.createElement("div");
    performanceDataTtfs.className = "performance-data";
    performanceDataTtfs.setAttribute("title", "Time to first token");
    performanceDataTtfs.appendChild(timeToFirstTokenPerformanceUnit);
    performanceDataTtfs.appendChild(timeToFirstTokenPerformance);

    const tokensPerSecondPerformance = document.createElement("div");
    tokensPerSecondPerformance.className = "tokens-per-second-performance-data";
    tokensPerSecondPerformance.innerHTML = `${((sequenceLength - 1) / timeToNewTokens).toFixed(2)}`;
    const tokensPerSecondPerformanceUnit = document.createElement("div");
    tokensPerSecondPerformanceUnit.className = "tokens-per-second-performance-unit";
    tokensPerSecondPerformanceUnit.innerHTML = `tokens/s`;

    const performanceDataTps = document.createElement("div");
    performanceDataTps.className = "performance-data";
    performanceDataTps.setAttribute("title", "tokens per second");
    performanceDataTps.appendChild(tokensPerSecondPerformance);
    performanceDataTps.appendChild(tokensPerSecondPerformanceUnit);
    performanceIndicator.innerHTML = "";
    performanceIndicator.appendChild(performanceDataTtfs);
    performanceIndicator.appendChild(performanceDataTps);
}

const main = async () => {
    await setupORT("text-generation", "dev");
    showCompatibleChromiumVersion("text-generation");

    ort.env.wasm.numThreads = 4;
    ort.env.wasm.simd = true;
    ort.env.wasm.proxy = false;
    ort.env.logLevel = "warning";

    log(`ONNX Runtime Web Execution Provider loaded · ${provider.toLowerCase()}`);

    sendButton.addEventListener("click", submitRequest);
    stopButton.addEventListener("click", submitRequest);
    userInput.focus();

    try {
        let modelId = config.model.id;
        if (!config.local && config.model.remote_id) {
            modelId = config.model.remote_id;
        }
        tokenizer = await AutoTokenizer.from_pretrained(modelId);
        await llm.load(config.model, {
            provider: config.provider,
            deviceType: config.deviceType,
            profiler: config.profiler,
            verbose: config.verbose,
            local: config.local,
        });
        sendButton.disabled = false;
        ready = true;
        log("Ready to type your message ...");
    } catch (error) {
        logError(`[Error] ${error}`);
    }
};

const ui = async () => {
    if (!getQueryValue("provider") && !getQueryValue("devicetype")) {
        location.href = `./?provider=${provider}&devicetype=${deviceType}&model=phi3mini`;
        return;
    }

    const currentUrl = window.location.href;

    let model = getQueryValue("model");
    if (model) {
        $(`#${model}`).setAttribute("class", "button active");
    }

    modelSelectors = document.querySelectorAll(".models button");
    for (const selector of modelSelectors) {
        selector.addEventListener("click", async function () {
            await llm.dispose();
            location.href = updateQueryStringParameter(currentUrl, "model", this.id);
        });
    }

    device = $("#device");
    badge = $("#badge");
    sendButton = $("#send-button");
    stopButton = $("#stop-button");
    buttons = $("#buttons");
    performanceIndicator = $("#performance-indicator");
    scrollWrapper = $("#scroll-wrapper");
    userInput = $("#user-input");
    chatHistory = $("#chat-history");

    let status = $("#webnnstatus");
    let info = $("#info");
    sendButton.disabled = true;

    document.querySelector("#model").innerHTML = config.model.name;

    if (getQueryValue("devicetype")) {
        deviceType = getQueryValue("devicetype").toLowerCase();
        config.deviceType = deviceType;
    }

    if (getQueryValue("provider")) {
        provider = getQueryValue("provider")?.toLowerCase();
    }

    if (deviceType === "cpu" || provider === "wasm") {
        device.innerHTML = "CPU";
        badge.setAttribute("class", "cpu");
        document.body.setAttribute("class", "cpu");
    } else if (deviceType === "gpu" || provider === "webgpu") {
        device.innerHTML = "GPU";
        badge.setAttribute("class", "");
        document.body.setAttribute("class", "gpu");
    } else if (deviceType === "npu") {
        device.innerHTML = "NPU";
        badge.setAttribute("class", "npu");
        document.body.setAttribute("class", "npu");
    }

    let webnnStatus = await getWebnnStatus();

    if (provider === "wasm") {
        status.innerHTML = "";
        title.innerHTML = "WebAssembly";
        await main();
    } else if (provider === "webgpu") {
        status.innerHTML = "";
        title.innerHTML = "WebGPU";
        await main();
    } else {
        if (webnnStatus.webnn) {
            status.setAttribute("class", "green");
            info.innerHTML = `WebNN supported`;
            const gpuUrl = updateQueryStringParameter(currentUrl, "devicetype", "gpu");
            const npuUrl = updateQueryStringParameter(currentUrl, "devicetype", "npu");
            info.innerHTML = `WebNN supported · <a href="${gpuUrl}">GPU</a> · <a href="${npuUrl}">NPU</a>`;
            if (deviceType.toLowerCase() === "npu") {
                try {
                    await navigator.ml.createContext({ deviceType: "npu" });
                    await main();
                } catch (error) {
                    status.setAttribute("class", "red");
                    info.innerHTML = `
            ${error}<br>
            Your device probably doesn't have an AI processor (NPU) or the NPU driver is not successfully installed.`;
                    logError(`[Error] ${error}`);
                    logError(
                        `[Error] Your device probably doesn't have an AI processor (NPU) or the NPU driver is not successfully installed`,
                    );
                    log(`<a href="${gpuUrl}">Switch to WebNN GPU</a>`);
                }
            } else {
                await main();
            }
        } else {
            if (webnnStatus.error) {
                status.setAttribute("class", "red");
                info.innerHTML = `WebNN not supported: ${webnnStatus.error} <a id="webnn_na" href="../../install.html" title="WebNN Installation Guide">Set up WebNN</a>`;
                logError(`[Error] ${webnnStatus.error}`);
                log(`<a href="../../install.html" title="WebNN Installation Guide">WebNN Installation Guide</a>`);
            } else {
                status.setAttribute("class", "red");
                info.innerHTML = "WebNN not supported";
                logError("[Error] WebNN not supported");
            }
        }
    }

    function togglePlaceholder() {
        userInput.classList.toggle("empty", userInput.textContent.trim() === "");
    }

    userInput.addEventListener("input", togglePlaceholder);
    userInput.addEventListener("focus", togglePlaceholder);
    userInput.addEventListener("blur", togglePlaceholder);

    // Initial check
    togglePlaceholder();
};

document.addEventListener("DOMContentLoaded", ui, false);
