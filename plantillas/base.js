// Utilidades compartidas por las plantillas. generar.js inyecta window.DATA y window.MARCA.
const D = window.DATA || {};
const M = window.MARCA || { colores: {}, fuentes: {} };

for (const [k, v] of Object.entries(M.colores || {})) document.documentElement.style.setProperty(`--${k}`, v);
document.documentElement.style.setProperty("--f-titulo", `'${M.fuentes.titulo}'`);
document.documentElement.style.setProperty("--f-texto", `'${M.fuentes.texto}'`);

function esc(s) {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

// "MAIPÚ vs RACING" -> el "vs" queda más chico y en minúscula
function conVs(s) {
  return esc(s).replace(/\s+vs\.?\s+/i, ' <span class="vs">vs</span> ');
}

function lista(x) {
  return x == null ? [] : Array.isArray(x) ? x : [x];
}

// sobreOscuro: el logo va sobre fondo verde; si la marca pide fondo claro, se le pone una placa crema
function logoHtml(clase = "", alto = 130, sobreOscuro = false) {
  if (!M.logo) return "";
  const fondo = sobreOscuro && M.logo_fondo_claro ? " con-fondo" : "";
  return `<img class="logo${fondo} ${clase}" src="${M.logo}" style="height:${alto}px" alt="">`;
}

function escudoHtml(img, nombre) {
  if (img) return `<div class="escudo"><img src="${img}" alt=""></div>`;
  const ini = String(nombre || "?").replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ ]/g, "").split(/\s+/).filter(Boolean).map((p) => p[0]).join("").slice(0, 2);
  return `<div class="escudo"><span class="iniciales">${esc(ini)}</span></div>`;
}

const ICONOS = {
  basquet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20M5 5c3 3 3 11 0 14M19 5c-3 3-3 11 0 14"/></svg>',
  voley: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><path d="M12 12c0-4 2-8 6-9M12 12c-3.5 2-8 2-10.5-.5M12 12c3.5 2 5.5 6 4.5 9.5"/></svg>',
  futbol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><path d="M12 7l4 3-1.5 4.5h-5L8 10z"/><path d="M12 7V2.5M16 10l4.5-1.5M14.5 14.5l2.5 4M9.5 14.5L7 18.5M8 10L3.5 8.5"/></svg>',
  reloj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  calendario: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  ubicacion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s7-7.2 7-12.5a7 7 0 1 0-14 0C5 14.8 12 22 12 22z"/><circle cx="12" cy="9.5" r="2.6"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3.5 20.5l1.3-4.2A8.8 8.8 0 1 1 8 19.4z"/><path d="M9 8.2c.3-.6.8-.6 1.1 0l.6 1.4c.1.3 0 .6-.2.8l-.5.5c.6 1.3 1.6 2.3 2.9 2.9l.5-.5c.2-.2.5-.3.8-.2l1.4.6c.6.3.6.8 0 1.1-1 .9-2.4 1-3.6.3a9 9 0 0 1-3.4-3.4c-.7-1.2-.6-2.6.4-3.5z" fill="currentColor" stroke="none"/></svg>',
  telefono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7.5v.5"/></svg>',
};
function icono(n) {
  return `<span class="icono">${ICONOS[n] || ICONOS[D.deporte] || ICONOS.basquet}</span>`;
}

// Achica la fuente de cada .ajustar hasta que el texto entre en su ancho máximo
function ajustarAnchos(raiz = document) {
  raiz.querySelectorAll(".ajustar").forEach((el) => {
    let fs = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > el.clientWidth + 1 && fs > 16) {
      fs -= 2;
      el.style.fontSize = fs + "px";
    }
  });
}

// Si un bloque es más alto que el espacio disponible, lo escala hacia abajo
function ajustarAlto(el, maximo) {
  const h = el.scrollHeight;
  if (h > maximo) {
    el.style.transformOrigin = el.dataset.origen || "top left";
    el.style.transform = `scale(${maximo / h})`;
  }
}

async function cargarFuentes() {
  if (M.fuentes.google_fonts) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = M.fuentes.google_fonts;
    await new Promise((ok) => { link.onload = link.onerror = ok; document.head.appendChild(link); });
  }
  await Promise.all(
    [M.fuentes.titulo, M.fuentes.texto].flatMap((f) => [500, 600, 700, 800].map((w) => document.fonts.load(`${w} 60px '${f}'`).catch(() => {})))
  );
  await document.fonts.ready;
}

// Cada plantilla llama a esto: arma el HTML, espera fuentes e imágenes, ajusta y avisa que terminó
async function renderizar(armar, ajustar) {
  try {
    await cargarFuentes();
    armar();
    await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
    ajustarAnchos();
    if (ajustar) ajustar();
  } catch (e) {
    window.ERROR = String(e && e.stack || e);
  }
  window.LISTO = true;
}
