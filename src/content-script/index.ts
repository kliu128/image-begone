import "webextension-polyfill";
import * as tf from "@tensorflow/tfjs";

const toProcess: { img: HTMLImageElement; originalSrc: string }[] = [];

const images = document.body.querySelectorAll("img");
for (const img of images) {
  const originalSrc = img.src;
  // img.src = "";
  toProcess.push({ img, originalSrc });
}

(async () => {
  console.log("Image Begone v1.0 enabled");
  try {
    const model = await tf.loadLayersModel(
      browser.runtime.getURL("spidergod-js/model.json")
    );
    model.summary();
    for (const { img, originalSrc } of toProcess) {
      const load = new Image();
      load.src = originalSrc;
      load.width = 160;
      load.height = 160;
      load.onload = async () => {
        const pixelTensor = tf.browser.fromPixels(load);
        // The first dimension is the batch size (I think?) and since we're only
        // processing one image at a time for now, just do this.
        // TODO: Wait, can you parallelize this??
        const t = pixelTensor.reshape([1, 160, 160, 3]).div(255);
        const prediction = model.predict(t, {
          batchSize: 1,
          verbose: true,
        }) as tf.Tensor<tf.Rank>;
        const softmaxed = await tf.softmax(prediction).reshape([2]).array();

        console.log(
          `${originalSrc} has a ${softmaxed[0] * 100}% chance of being a spider`
        );
      };
    }
  } catch (e) {
    console.error("Image Begone error:", e);
  }
})();
