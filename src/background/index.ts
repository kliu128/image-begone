import "webextension-polyfill";
import * as tf from "@tensorflow/tfjs";

let modelPromise: Promise<tf.LayersModel> = new Promise(async (res, rej) => {
  try {
    const model = await tf.loadLayersModel(
      browser.runtime.getURL("spidergod-js/model.json")
    );
    res(model);
  } catch (e) {
    rej(e);
  }
});

console.log("Image Begone v1.0 enabled");

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.src = src;
    img.width = 160;
    img.height = 160;
    img.crossOrigin = "anonymous";
    img.onerror = rej;
    img.onload = () => res(img);
  });

  // TODO this doesn't actually resize the image data, I think
}

browser.runtime.onMessage.addListener(
  async (message: { src: string }, sender) => {
    const model = await modelPromise;
    const { src } = message;

    console.log("Tab id", sender.tab?.id);
    console.log("Loading", src);
    try {
      const img = await loadImage(src);
      const pixelTensor = tf.browser.fromPixels(img);
      // The first dimension is the batch size (I think?) and since we're only
      // processing one image at a time for now, just do this.
      // TODO: Wait, can you parallelize this??
      const t = pixelTensor.reshape([1, 160, 160, 3]).div(255);
      const prediction = model.predict(t, {
        batchSize: 1,
        verbose: true,
      }) as tf.Tensor<tf.Rank>;
      const softmaxed = await tf.softmax(prediction).reshape([2]).array();
      const spiderPct = softmaxed[0];

      console.log(`${src} has a ${spiderPct * 100}% chance of being a spider`);

      browser.tabs.sendMessage(sender.tab?.id, { src, spiderPct });
    } catch (e) {
      console.error(e);
      browser.tabs.sendMessage(sender.tab?.id, { src, err: e });
    }
  }
);
(async () => {
  const model = await modelPromise;
  model.summary();
})();
