import "webextension-polyfill";

const blockedUrl = browser.extension.getURL("block.svg");

function isImageAcceptable(img: HTMLImageElement) {
  return img.src !== "" && img.width >= 160 && img.height >= 160;
}

function queueImageEvaluation({ src }: HTMLImageElement) {
  browser.runtime.sendMessage({ src });
}

const runImagePipeline = (imgs: HTMLImageElement[]) =>
  imgs.filter(isImageAcceptable).forEach(queueImageEvaluation);

// Process incoming spider detection results
browser.runtime.onMessage.addListener(
  (
    message: { src: string; err: Error } | { src: string; spiderPct: number }
  ) => {
    if ("err" in message) {
      // L
      console.error("Image Begone error:", message.err);
    } else {
      const { src, spiderPct } = message;
      console.log(src, ":", spiderPct);

      if (spiderPct > 0.5) {
        const img = Array.from(document.getElementsByTagName("img")).filter(
          (img) => img.src === src
        )[0];
        if (img) {
          console.log(img);
          img.src = blockedUrl;
        } else {
          console.warn("Image not found");
        }
      }
    }
  }
);

const images = Array.from(document.body.querySelectorAll("img"));
console.log("Processing", images);
runImagePipeline(images);

// Watch for new images added to the DOM
new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    // Filter to only find image elements
    const images = Array.from(mutation.addedNodes).filter(
      (el) => el instanceof HTMLImageElement
    ) as HTMLImageElement[];

    // Run our image pipeline
    runImagePipeline(images);
  });
}).observe(document.body, {
  attributes: false,
  childList: true,
  subtree: true,
});
