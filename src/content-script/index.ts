import "webextension-polyfill";
import * as tf from "@tensorflow/tfjs";

const toProcess: { img: HTMLImageElement; originalSrc: string }[] = [];

const images = document.body.querySelectorAll("img");
for (const img of images) {
  const originalSrc = img.src;
  // img.src = "";
  toProcess.push({ img, originalSrc });
}

async function processImg(src: string) {}

(async () => {
  try {
    const model = await tf.loadLayersModel(
      browser.runtime.getURL("spidergod-js/model.json")
    );
    for (const { img, originalSrc } of toProcess) {
      const load = new Image();
      load.src = originalSrc;
      load.width = 160;
      load.height = 160;
      const pixelTensor = tf.browser.fromPixels(load);
      console.log(pixelTensor);
    }
  } catch (e) {
    console.error("Image Begone error:", e);
  }
})();
