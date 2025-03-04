# WebNN Developer Preview

Run ONNX models in the browser with WebNN. The developer preview unlocks interactive ML on the web that benefits from reduced latency, enhanced privacy and security, and GPU acceleration from DirectML.

[WebNN Developer Preview website](https://microsoft.github.io/webnn-developer-preview/).

_NOTE: Currently, the supported platforms are Edge/Chromium (support for other platforms is coming soon)._

## Use Cases

The website provides four scenarios based on different ONNX pre-trained deep learning models.

### 1. Stable Diffusion 1.5

[Stable Diffusion](https://huggingface.co/microsoft/stable-diffusion-v1.5-webnn/tree/main) is a latent text-to-image diffusion model capable of generating photo-realistic images given any text input.

This Stable Diffusion 1.5 model has been optimized to work with WebNN. This model is licensed under the [CreativeML Open RAIL-M license](https://github.com/CompVis/stable-diffusion/blob/main/LICENSE). For terms of use, please visit [here](https://huggingface.co/runwayml/stable-diffusion-v1-5#uses). If you comply with the license and terms of use, you have the rights described therin. By using this Model, you accept the terms.

This model is meant to be used with the corresponding sample on this repo for educational or testing purposes only.

### 2. SD-Turbo

[SD-Turbo](https://huggingface.co/microsoft/sd-turbo-webnn/tree/main) is a fast generative text-to-image model that can synthesize photorealistic images from a text prompt in a single network evaluation. In the demo, you can generate an image in 2s on AI PC devices by leveraging WebNN API, a dedicated low-level API for neural network inference hardware acceleration.

This Stable Diffusion Turbo model has been optimized to work with WebNN. This model is licensed under the [STABILITY AI NON-COMMERCIAL RESEARCH COMMUNITY LICENSE AGREEMENT](https://huggingface.co/stabilityai/sd-turbo/blob/main/LICENSE). For terms of use, please visit the [Acceptable Use Policy](https://stability.ai/use-policy). If you comply with the license and terms of use, you have the rights described therin. By using this Model, you accept the terms.

This model is meant to be used with the corresponding sample on this repo for educational or testing purposes only.

### 3. Segment Anything

[Segment Anything](https://huggingface.co/microsoft/segment-anything-model-webnn/tree/main) is a new AI model from Meta AI that can "cut out" any object. In the demo, you can segment any object from your uploaded images.

This Segment Anything Model has been optimized to work with WebNN. This model is licensed under the [Apache-2.0 License](https://github.com/facebookresearch/segment-anything?tab=Apache-2.0-1-ov-file#readme). For terms of use, please visit the [Code of Conduct](https://github.com/facebookresearch/segment-anything?tab=coc-ov-file#readme). If you comply with the license and terms of use, you have the rights described therin. By using this Model, you accept the terms.

This model is meant to be used with the corresponding sample on this repo for educational or testing purposes only.

### 4. Whisper Base

[Whisper Base](https://huggingface.co/microsoft/whisper-base-webnn/tree/main) is a pre-trained model for automatic speech recognition (ASR) and speech translation. In the demo, you can experience the speech to text feature by using on-device inference powered by WebNN API and DirectML, especially the NPU acceleration.

This Whisper-base model has been optimized to work with WebNN. This model is licensed under the [Apache-2.0 license](https://huggingface.co/datasets/choosealicense/licenses/blob/main/markdown/apache-2.0.md). For terms of use, please visit the [Intended use](https://huggingface.co/openai/whisper-base#evaluated-use). If you comply with the license and terms of use, you have the rights described therin. By using this Model, you accept the terms.

This model is meant to be used with the corresponding sample on this repo for educational or testing purposes only.

### 5. Image Classification

[MobileNet](https://github.com/onnx/models/tree/main/validated/vision/classification/mobilenet) and [ResNet](https://github.com/onnx/models/tree/main/validated/vision/classification/resnet) models perform image classification - they take images as input and classify the major object in the image into a set of pre-defined classes.

## Run WebNN Developer Preview

### Install Dependencies

```
cd webnn-developer-preview
npm install
```

### Run the website

**WebNN installation guides**

WebNN requires a compatible browser to run, and Windows\* 11 v21H2 (DML 1.6.0) or higher.

1. Download the latest [Microsoft Edge Canary](https://www.microsoft.com/edge/download/insider) browser
2. To enable WebNN, in your browser address bar, enter `about://flags`, and then press `Enter`. An Experiments page opens
3. In the Search flags box, enter `webnn`. Enables WebNN API appears
4. In the drop-down menu, select `Enabled`
5. Relaunch your browser

**Run the website in localhost**

```
npm run dev
```

This will start a dev server and run WebNN Developer Preview demos with the WebNN enabled browser on your localhost.

Please run the following command to download demos required models if you run the demos the first time. You can also modify [fetch_models.js](./fetch_models.js) to add network proxy configuration when needed.

```
npm run fetch-models
```

### Breaking Changes

WebNN is a living specification and still subject to breaking changes, which may impact the samples depending on your browser version:

-   2025-03-03 Enable Float16Array by default - spec change NA, [Chromium change](https://chromium-review.googlesource.com/c/chromium/src/+/6275531), [ORT change](https://github.com/microsoft/onnxruntime/pull/23827)
-   2024-11-12 Remove grace-period support for MLTensorUsage - [spec change](https://github.com/webmachinelearning/webnn/pull/754), [Chromium change](https://chromium-review.googlesource.com/c/chromium/src/+/6015318)
-   2024-10-29 Convert MLOperand methods into readonly attributes - [spec change](https://github.com/webmachinelearning/webnn/pull/774), [Chromium change](https://chromium-review.googlesource.com/c/chromium/src/+/5975719)
-   2024-09-30 Replace MLContext.compute() with MLContext.dispatch() - [spec change](https://github.com/webmachinelearning/webnn/pull/754), [Chromium change](https://chromium-review.googlesource.com/c/chromium/src/+/5874589), [ORT change](https://github.com/microsoft/onnxruntime/pull/21301/), [sample change](https://github.com/webmachinelearning/webnn-samples/issues/275)
-   2024-09-24 Make MLOperandDescriptor.shape a required dictionary member - [spec change](https://github.com/webmachinelearning/webnn/issues/758), [Chromium change](https://chromium-review.googlesource.com/c/chromium/src/+/5850659)
-   2024-09-17 Rename MLOperandDescriptor's "dimensions" key to "shape" - [spec change](https://github.com/webmachinelearning/webnn/pull/676), [Chromium change](https://chromium-review.googlesource.com/c/chromium/src/+/5502631), [Chromium change 2](https://chromium-review.googlesource.com/c/chromium/src/+/5502631)
-   2024-07-24 `MLContextOptions::MLPowerPreference` rename `auto` to `default` - [Chromium change](https://chromium-review.googlesource.com/c/chromium/src/+/5716629)
-   2024-07-24 Allow `MLGraphBuilder.build()` to be called only once - [spec change](https://github.com/webmachinelearning/webnn/pull/717), [Chromium change](https://chromium-review.googlesource.com/c/chromium/src/+/5684454), [ORT change](https://github.com/microsoft/onnxruntime/pull/21514), [sample change](https://github.com/microsoft/webnn-developer-preview/pull/21)
-   2024-07-22 `LSTM`/`GRU` activation enum `MLRecurrentNetworkActivation` - [spec change](https://github.com/webmachinelearning/webnn/pull/718), [Chromium change](https://chromium-review.googlesource.com/c/chromium/src/+/5689531)
-   2024-07-22 `argMin`/`argMax` change to take scalar `axis` parameter - [spec change](https://github.com/webmachinelearning/webnn/pull/724]), [Chromium change](https://chromium-review.googlesource.com/c/chromium/src/+/5721028)
-   2024-07-15 `argMin`/`argMax` add `outputDataType` parameter - [spec change](https://github.com/webmachinelearning/webnn/pull/730), [Chromium change](https://chromium-review.googlesource.com/c/chromium/src/+/5692538), [sample change](https://github.com/microsoft/webnn-developer-preview/pull/19])
-   2024-06-12 `softmax` axis argument - [spec change](https://github.com/webmachinelearning/webnn/pull/649), [Chromium change](https://chromium-review.googlesource.com/c/chromium/src/+/5495877)
-   2024-06-07 Remove incompatible `MLActivations` for recurrent ops [spec change](https://github.com/webmachinelearning/webnn/pull/703/files), [Chromium change](https://chromium-review.googlesource.com/c/chromium/src/+/5494397), [baseline change](https://github.com/webmachinelearning/webnn-baseline/pull/95)

| Model                  | Known compatible Chromium version |
| ---------------------- | --------------------------------- |
| Segment Anything       | 129.0.6617.0                      |
| Stable Diffusion Turbo | 129.0.6617.0                      |
| Stable Diffusion 1.5   | 129.0.6617.0                      |
| Whisper Base           | 129.0.6617.0                      |
| ResNet50               | 129.0.6617.0                      |
| MobileNet V2           | 129.0.6617.0                      |
| EfficientNet Lite4     | 129.0.6617.0                      |

You can check the version via "about://version" in the address bar. In Chrome, look for "Google Chrome". In Edge, heed the "Chromium version".

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
