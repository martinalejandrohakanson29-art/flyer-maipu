// Genera un flyer PNG (1080x1350) a partir de un JSON con el contenido.
//   node generar.js datos.json [salida.png]
// Las rutas de imágenes del JSON se resuelven relativas al propio JSON.
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { abrirNavegador, aDataUri } = require("./navegador");

const RAIZ = path.join(__dirname, "..");
const ES_IMAGEN = /\.(png|jpe?g|webp|svg)$/i;

// Lee JSON tolerando el BOM que agregan algunos editores de Windows
const leerJson = (ruta) => JSON.parse(fs.readFileSync(ruta, "utf8").replace(/^﻿/, ""));

// Reemplaza toda ruta de imagen existente por un data URI, en cualquier nivel del objeto
function incrustarImagenes(valor, base) {
  if (typeof valor === "string" && ES_IMAGEN.test(valor)) {
    const ruta = path.resolve(base, valor);
    if (!fs.existsSync(ruta)) throw new Error(`No existe la imagen: ${ruta}`);
    return aDataUri(ruta);
  }
  if (Array.isArray(valor)) return valor.map((v) => incrustarImagenes(v, base));
  if (valor && typeof valor === "object") {
    return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, incrustarImagenes(v, base)]));
  }
  return valor;
}

(async () => {
  const [entrada, salidaArg] = process.argv.slice(2);
  if (!entrada) {
    console.error("Uso: node generar.js datos.json [salida.png]");
    process.exit(1);
  }
  const rutaJson = path.resolve(entrada);
  const datos = leerJson(rutaJson);
  const plantilla = path.join(RAIZ, "plantillas", `${datos.plantilla}.html`);
  if (!fs.existsSync(plantilla)) {
    const hay = fs.readdirSync(path.join(RAIZ, "plantillas")).filter((f) => f.endsWith(".html")).map((f) => f.slice(0, -5));
    throw new Error(`Plantilla "${datos.plantilla}" no existe. Disponibles: ${hay.join(", ")}`);
  }

  const marca = incrustarImagenes(leerJson(path.join(RAIZ, "assets", "marca.json")), RAIZ);
  const data = incrustarImagenes(datos, path.dirname(rutaJson));
  const salida = path.resolve(salidaArg || rutaJson.replace(/\.json$/i, "") + ".png");

  const browser = await abrirNavegador();
  try {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
    await page.addInitScript(([d, m]) => { window.DATA = d; window.MARCA = m; }, [data, marca]);
    await page.goto(pathToFileURL(plantilla).href);
    await page.waitForFunction(() => window.LISTO === true, null, { timeout: 30000 });
    const error = await page.evaluate(() => window.ERROR);
    if (error) throw new Error(`Error en la plantilla: ${error}`);
    await page.screenshot({ path: salida });
    console.log(`Flyer guardado en ${salida}`);
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
