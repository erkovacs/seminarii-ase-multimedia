let app = {
  processedImage: null,
  originalImage: null,
  fileBrowser: null,
  currentEffect: null
};

app.grayscale = context => {
  const { naturalWidth, naturalHeight } = app.originalImage;
  let imageData = context.getImageData(0, 0, naturalWidth, naturalHeight);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
    // red
    data[i] = brightness;
    // green
    data[i + 1] = brightness;
    // blue
    data[i + 2] = brightness;
  }

  // overwrite original image
  context.putImageData(imageData, 0, 0);
};

app.drawImage = () => {
  let processingCanvas = document.createElement("canvas");
  processingCanvas.width = app.originalImage.naturalWidth;
  processingCanvas.height = app.originalImage.naturalHeight;
  const context = processingCanvas.getContext("2d");
  context.drawImage(app.originalImage, 0, 0);
  app[app.currentEffect](context);
  // switch (app.currentEffect) {
  //   case "normal":
  //     break;
  //   case "grayscale":
  //     app.grayscale(context);
  //     break;
  //   default:
  //     return;
  // }
  processingCanvas.toBlob(blob => {
    app.processedImage.src = URL.createObjectURL(blob);
  }, "image/png");
};

app.setEffect = effect => {
  if (effect !== app.currentEffect) {
    app.currentEffect = effect;
    app.drawImage();
  }
};

app.load = () => {
  app.processedImage = document.getElementById("processedImage");
  app.originalImage = document.createElement("img");
  app.fileBrowser = document.getElementById("fileBrowser");
  app.originalImage.addEventListener("load", loadEvent => {
    const effectPickers = document.getElementsByClassName("effect");
    for (let element of effectPickers) {
      element.addEventListener("click", clickEvent => {
        const effect = clickEvent.target.dataset.effect;
        app.setEffect(null);
        app.setEffect(effect);
      });
    }
  });

  app.fileBrowser.addEventListener("change", changeEvent => {
    const image = changeEvent.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", loadEvent => {
      const url = loadEvent.target.result;
      app.originalImage.src = url;
      app.processedImage.src = url;
    });
    reader.readAsDataURL(image);
  });
};
