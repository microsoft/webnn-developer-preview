async function classifyImage(pathToImage){ 
  var imageTensor = await getImageTensorFromPath(pathToImage); // Convert image to a tensor
  var predictions = await runModel(imageTensor); // Run inference on the tensor
  console.log(predictions); // Print predictions to console  
  document.getElementById("outputText").innerHTML += predictions[0].name; // Display prediction in HTML
}

async function getImageTensorFromPath(path, dims = [1, 3, 224, 224]) { 
    var image = await loadImagefromPath(path, dims[2], dims[3]); // 1. load the image 
    var imageTensor = imageDataToTensor(image, dims); // 2. convert to tensor 
    return imageTensor; // 3. return the tensor 
} 

async function loadImagefromPath(path, width = 224, height = 224) { 
  var imageData = await Jimp.read(path).then(imageBuffer => { // Use Jimp to load the image and resize it. 
  return imageBuffer.resize(width, height); 
  })

  return imageData.bitmap;
}

function imageDataToTensor(image, dims) {
    
  var imageBufferData = image.data;
  let pixelCount = image.width * image.height;
  const float32Data = new Float32Array(3 * pixelCount); 
	
  // Loop through the image buffer, extracting the (R, G, B) channels, rearranging from
  // packed channels to planar channels, and converting to floating point.
  for (let i = 0; i < pixelCount; i++) {
	float32Data[pixelCount * 0 + i] = imageBufferData[i * 4 + 0] / 255.0; // Red
	float32Data[pixelCount * 1 + i] = imageBufferData[i * 4 + 1] / 255.0; // Green
	float32Data[pixelCount * 2 + i] = imageBufferData[i * 4 + 2] / 255.0; // Blue
	// Skip the unused alpha channel: imageBufferData[i * 4 + 3].
  }
  const inputTensor = new ort.Tensor("float32", float32Data, dims);
  return inputTensor;
}

