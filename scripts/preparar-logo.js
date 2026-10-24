// Quita el fondo blanco de un logo (solo el blanco conectado a los bordes,
// así se conserva el blanco interno del dibujo).  Uso:
//   node preparar-logo.js logo-original.png ../assets/logo.png
const fs = require("fs");
const path = require("path");
const { abrirNavegador, aDataUri } = require("./navegador");

(async () => {
  const [entrada, salida] = process.argv.slice(2);
  if (!entrada || !salida) {
    console.error("Uso: node preparar-logo.js entrada.png salida.png");
    process.exit(1);
  }
  const browser = await abrirNavegador();
  const page = await browser.newPage();
  const png = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const { naturalWidth: w, naturalHeight: h } = img;
    const cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
    const cx = cv.getContext("2d");
    cx.drawImage(img, 0, 0);
    const im = cx.getImageData(0, 0, w, h);
    const p = im.data;
    const claro = (i) => Math.min(p[i], p[i + 1], p[i + 2]);

    // Relleno desde los bordes sobre píxeles casi blancos
    const fondo = new Uint8Array(w * h);
    const pila = [];
    for (let x = 0; x < w; x++) pila.push(x, (h - 1) * w + x);
    for (let y = 0; y < h; y++) pila.push(y * w, y * w + w - 1);
    while (pila.length) {
      const k = pila.pop();
      if (fondo[k] || claro(k * 4) < 225) continue;
      fondo[k] = 1;
      const x = k % w, y = (k / w) | 0;
      if (x > 0) pila.push(k - 1);
      if (x < w - 1) pila.push(k + 1);
      if (y > 0) pila.push(k - w);
      if (y < h - 1) pila.push(k + w);
    }
    // Borde suave: píxeles claros pegados al fondo quedan semitransparentes
    for (let k = 0; k < w * h; k++) {
      if (fondo[k]) { p[k * 4 + 3] = 0; continue; }
      const x = k % w, y = (k / w) | 0;
      const vecino = (x > 0 && fondo[k - 1]) || (x < w - 1 && fondo[k + 1]) || (y > 0 && fondo[k - w]) || (y < h - 1 && fondo[k + w]);
      const c = claro(k * 4);
      if (vecino && c > 150) p[k * 4 + 3] = Math.round(255 * (255 - c) / 105);
    }
    cx.putImageData(im, 0, 0);
    return cv.toDataURL("image/png").split(",")[1];
  }, aDataUri(path.resolve(entrada)));
  fs.writeFileSync(path.resolve(salida), Buffer.from(png, "base64"));
  console.log(`Logo guardado en ${salida}`);
  await browser.close();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
