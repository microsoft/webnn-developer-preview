# WebNN Developer Preview

Run ONNX models in the browser with WebNN. The developer preview unlocks interactive ML on the web that benefits from reduced latency, enhanced privacy and security, and GPU acceleration from DirectML.

[WebNN Developer Preview website](https://microsoft.github.io/webnn-developer-preview/).

_NOTE: Currently, the supported platforms are Edge/Chromium (support for other platforms is coming soon)._

## Use Cases

The website provides four scenarios based on different ONNX pre-trained deep learning models.

### 1. Stable Diffusion 1.5

[Stable Diffusion](https://huggingface.co/onnxruntime-web-temp/demo/tree/main/stable-diffusion-1.5) is a latent text-to-image diffusion model capable of generating photo-realistic images given any text input.

### 2. SD-Turbo

[SD-Turbo](https://huggingface.co/onnxruntime-web-temp/demo/tree/main/sd-turbo) is a fast generative text-to-image model that can synthesize photorealistic images from a text prompt in a single network evaluation. In the demo, you can generate an image in 2s on AI PC devices by leveraging WebNN API, a dedicated low-level API for neural network inference hardware acceleration.

### 3. Segment Anything

[Segment Anything](https://huggingface.co/onnxruntime-web-temp/demo/tree/main/segment-anything) is a new AI model from Meta AI that can "cut out" any object. In the demo, you can segment any object from your uploaded images.

### 4. Whisper Base

[Whisper Base](https://huggingface.co/onnxruntime-web-temp/demo/tree/main/whisper-base) is a pre-trained model for automatic speech recognition (ASR) and speech translation. In the demo, you can experience the speech to text feature by using on-device inference powered by WebNN API and DirectML, especially the NPU acceleration.

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

WebNN requires a compatible browser to run, and Windows* 11 v21H2 (DML 1.6.0) or higher.

1. Download the latest [Microsoft Edge Canary](https://www.microsoft.com/edge/download/insider) browser
2. To enable WebNN, in your browser address bar, enter `chrome://flags`, and then press `Enter`. An Experiments page opens
3. In the Search flags box, enter `webnn`. Enables WebNN API appears
4. In the drop-down menu, select `Enabled`
5. Relaunch your browser

**Run the website in localhost**

```
npm run dev
```

This will start a dev server and run WebNN Developer Preview demos with the WebNN enabled browser on your localhost.

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
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