async function classifyImage(pathToImage){ 
  var imageTensor = await getImageTensorFromPath(pathToImage); // Convert image to a tensor
  var predictions = await runModel(imageTensor); // Run inference on the tensor
  console.log(predictions); // Print predictions to console  
  document.getElementById("outputText").innerHTML += predictions[0].name; // Display prediction in HTML
}



