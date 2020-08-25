import "webextension-polyfill";

function getPageImages() {
  const toProcess: { img: HTMLImageElement; originalSrc: string }[] = [];

  const images = document.body.querySelectorAll("img");
  for (const img of images) {
    if (img.src === "" || img.width < 160 || img.height < 160) {
      continue;
    }
    const originalSrc = img.src;
    toProcess.push({ img, originalSrc });
  }

  return toProcess;
}

const images = getPageImages();
console.log("Processing", images);
for (const image of images) {
  browser.runtime.sendMessage({ src: image.originalSrc });
}
