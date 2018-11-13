let app = {
  processedImage: null,
  originalImage: null,
  fileBrowser: null,
  currentEffect: null
};

app.applyEffect = (context, offsets) => {
  const { red, green, blue } = offsets;
  const { naturalWidth, naturalHeight } = app.originalImage;
  const imageData = context.getImageData(0, 0, naturalWidth, naturalHeight);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const brightness = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
    // Set r g b offsets
    data[i] = brightness + red;
    data[i + 1] = brightness + green;
    data[i + 2] = brightness + blue;
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

  switch (app.currentEffect) {
    case "normal":
      break;
    case "grayscale":
      app.applyEffect(context, { red: 0, green: 0, blue: 0 });
      break;
    case "sepia":
      app.applyEffect(context, { red: 100, green: 50, blue: 0 });
      break;
    case "cyanotype":
      app.applyEffect(context, { red: 0, green: 50, blue: 100 });
      break;
    default:
      return;
  }
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
        for (let element of effectPickers) {
          element.classList.remove('active');
        }
        const effect = clickEvent.target.dataset.effect;
        clickEvent.target.classList.add('active');
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
