Clone from https://huggingface.co/onnx-community/DeepSeek-R1-Distill-Qwen-1.5B-ONNX/tree/main
rather than https://huggingface.co/onnxruntime/DeepSeek-R1-Distill-ONNX/tree/main/deepseek-r1-distill-qwen-1.5B/gpu/gpu-int4-rtn-block-32

Because we are using Tokenizer API from transformers.js, which requires some fixes for tokenizer files.