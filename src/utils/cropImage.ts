export async function getCroppedImg(imageSrc: string, pixelCrop: { x: number; y: number; width: number; height: number }, rotation = 0): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  const radians = (rotation * Math.PI) / 180;

  // calcular bounding box después de rotar
  const bBoxWidth = Math.abs(Math.cos(radians) * image.width) + Math.abs(Math.sin(radians) * image.height);
  const bBoxHeight = Math.abs(Math.sin(radians) * image.width) + Math.abs(Math.cos(radians) * image.height);

  // setear canvas temporal al bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(radians);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  // ahora extraer el crop
  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

  // canvas final del tamaño exacto del recorte
  const finalCanvas = document.createElement("canvas");
  const finalCtx = finalCanvas.getContext("2d");
  if (!finalCtx) throw new Error("No 2d context");

  finalCanvas.width = pixelCrop.width;
  finalCanvas.height = pixelCrop.height;
  finalCtx.putImageData(data, 0, 0);

  // 👉 máscara circular
  // finalCtx.globalCompositeOperation = "destination-in";
  // finalCtx.beginPath();
  // finalCtx.arc(pixelCrop.width / 2, pixelCrop.height / 2, Math.min(pixelCrop.width, pixelCrop.height) / 2, 0, 2 * Math.PI);
  // finalCtx.closePath();
  // finalCtx.fill();

  return new Promise((resolve, reject) => {
    finalCanvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Canvas is empty"));
      resolve(blob);
    }, "image/png");
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
    image.crossOrigin = "anonymous";
    image.src = url;
  });
}

export async function urlToDataUrl(url: string): Promise<string> {
  const res = await fetch(url, { mode: "cors" });
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}
