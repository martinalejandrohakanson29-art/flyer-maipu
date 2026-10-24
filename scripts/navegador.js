// Abre un Chromium ya instalado en el sistema (Edge o Chrome) con playwright-core,
// así no hace falta descargar ningún navegador.
const fs = require("fs");
const { chromium } = require("playwright-core");

const CANDIDATOS = [
  process.env.FLYER_BROWSER,
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

async function abrirNavegador() {
  const ruta = CANDIDATOS.find((p) => fs.existsSync(p));
  if (!ruta) {
    throw new Error(
      "No encontré Chrome ni Edge. Instalá uno o definí FLYER_BROWSER con la ruta del ejecutable."
    );
  }
  return chromium.launch({ executablePath: ruta });
}

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml" };

function aDataUri(ruta) {
  const ext = require("path").extname(ruta).toLowerCase();
  const tipo = MIME[ext];
  if (!tipo) throw new Error(`Formato de imagen no soportado: ${ruta}`);
  return `data:${tipo};base64,${fs.readFileSync(ruta).toString("base64")}`;
}

module.exports = { abrirNavegador, aDataUri };
