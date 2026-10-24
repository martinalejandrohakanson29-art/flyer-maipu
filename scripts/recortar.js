// Recorta una imagen.  Uso:
//   node recortar.js entrada.jpg                      -> muestra el tamaño
//   node recortar.js entrada.jpg x y ancho alto salida.png
const path = require("path");
const { abrirNavegador, aDataUri } = require("./navegador");

(async () => {
  const [entrada, x, y, w, h, salida] = process.argv.slice(2);
  if (!entrada) {
    console.error("Uso: node recortar.js entrada [x y ancho alto salida.png]");
    process.exit(1);
  }
  const browser = await abrirNavegador();
  const page = await browser.newPage();
  await page.setContent(
    `<body style="margin:0;background:transparent"><img id="i" src="${aDataUri(path.resolve(entrada))}"></body>`
  );
  const tam = await page.$eval("#i", (img) => img.decode().then(() => [img.naturalWidth, img.naturalHeight]));
  if (!salida) {
    console.log(`${tam[0]}x${tam[1]}`);
  } else {
    await page.setViewportSize({ width: tam[0], height: tam[1] });
    await page.screenshot({
      path: path.resolve(salida),
      omitBackground: true,
      clip: { x: +x, y: +y, width: +w, height: +h },
    });
    console.log(`Guardado ${salida}`);
  }
  await browser.close();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
