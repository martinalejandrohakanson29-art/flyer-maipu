---
name: flyer-maipu
description: Genera flyers para Instagram (PNG 1080x1350) del Club Maipú respetando su identidad visual (verde oliva y crema, logo, tipografía condensada). Usar cuando el usuario pida un flyer, placa, posteo o diseño para Instagram del club, por ejemplo agenda de partidos, resultado, torneo, alquiler de cancha, inscripciones o cualquier anuncio, y pase un texto y opcionalmente una foto.
---

# Flyers del Club Maipú

Esta skill arma flyers con **plantillas fijas**. El diseño (colores, logo, fuentes, texturas) nunca se inventa: lo pone el código. Tu trabajo es elegir la plantilla, ordenar el texto del usuario en los campos correctos y revisar el resultado.

## Flujo

1. Leé el texto y la foto que pasó el usuario.
2. Elegí la plantilla (ver tabla).
3. Escribí un JSON con los campos (podés guardarlo junto a la foto, por ejemplo `flyer.json`).
4. Ejecutá desde la carpeta `scripts/` de esta skill:
   ```
   node generar.js <ruta/al/flyer.json> [salida.png]
   ```
   La primera vez, si falta `node_modules`, corré antes `npm install` en `scripts/`.
5. **Mirá el PNG generado** antes de entregarlo. Si algo se ve mal (texto muy chico porque era largo, foto mal encuadrada), ajustá el JSON y volvé a generar.
6. Entregá el PNG.

## Plantillas

| Plantilla | Cuándo | Estilo |
|---|---|---|
| `agenda` | Partidos con fecha, horarios, rival, cancha. Con foto de jugador/a. | Panel crema a la izquierda, foto a la derecha. Si los partidos tienen `visitante`, muestra escudos "MAIPÚ vs RIVAL". |
| `evento` | Un partido o fecha puntual con una imagen protagonista (pelota, aro, trofeo). | Fondo crema, esquinas verdes, todo centrado. |
| `anuncio` | Avisos que no son partidos: alquiler de cancha, inscripciones, rifas, horarios, contacto. | Fondo verde oscuro, título grande inclinado, filas con íconos. |

## Campos

Todas las rutas de imágenes son relativas al JSON. Todo campo es opcional salvo `plantilla` y `titulo`.

**Comunes**: `plantilla`, `titulo` (lista de líneas, de 1 a 3, cortas), `foto`, `foto_posicion` (CSS, ej. `"center top"`), `deporte` (`basquet` | `voley` | `futbol`, define el ícono).

**agenda**: `etiqueta` (texto chico espaciado, ej. "CATEGORÍA"), `subtitulo`, `fecha`, `enfrentamiento` ("MAIPÚ vs RACING"), `lugar`, `lema`, y `partidos`:
- lista simple: `[{ "hora": "09:00", "texto": "CAT U16" }]`
- con escudos: `[{ "hora": "16:00", "local": "MAIPÚ", "visitante": "LAS VETES", "escudo_visitante": "vetes.png" }]` (sin escudo, se muestran las iniciales).

**evento**: `subtitulo`, `fecha`, `enfrentamiento`, `lugar`, `partidos` (lista simple), `foto_modo` (`"recorte"` por defecto, para imágenes sin fondo; `"marco"` para fotos comunes).

**anuncio**: `destacado` (frase central, ej. "FINES DE SEMANA"), `nota`, `foto_modo`, `info`: lista de filas `{ "icono": "whatsapp|ubicacion|telefono|calendario|reloj|instagram|info", "titulo": "...", "grande": "...", "texto": "..." }`.

Hay un JSON de ejemplo por plantilla en `ejemplos/`.

## Reglas de marca (no romper)

- Colores, fuentes y logo salen **solo** de `assets/marca.json`. No los cambies por pedido puntual. Si el club cambia su identidad, se edita ese archivo.
- Todo el texto va en MAYÚSCULAS (lo hace la plantilla). Respetá tildes: MAIPÚ, SÁBADO, CATEGORÍA.
- Títulos cortos: 1 a 3 líneas de pocas palabras. Si el usuario manda un texto largo, resumilo para el título y pasá el detalle a los otros campos. Nunca inventes datos (horarios, direcciones, teléfonos) que el usuario no dio.
- Horas como `09:00` (la plantilla agrega "hs.").
- Fotos: para `evento` y `anuncio` lo ideal es un PNG sin fondo (`foto_modo: "recorte"`). Si es una foto común, usá `"marco"`. En `agenda` cualquier foto vertical funciona; ajustá `foto_posicion` para que no se corte la cara.
- Foto horizontal (la típica de un partido): usá `evento` con `foto_modo: "marco"`. La foto ocupa el espacio que dejan los textos, así que con un título de una sola línea se ve más grande. Si la foto trae elementos ajenos (flechas de carrusel, marcas de agua), recortala antes con `recortar.js`.
- No uses generadores de imágenes por IA para el flyer en sí.

## Archivos

- `assets/marca.json`: identidad del club (colores, fuentes, logo, lema). `logo_fondo_claro: true` hace que sobre fondos verdes el logo lleve una placa crema, porque las letras negras no se leen sobre verde oscuro.
- `assets/logo.png`: logo sin fondo, generado desde `assets/logo-original.png`. Si cambia el logo: `node preparar-logo.js logo-nuevo.png ../assets/logo.png`.
- `assets/referencias/`: flyers reales publicados, para comparar el estilo.
- `plantillas/`: HTML/CSS de cada diseño (`base.css` y `base.js` son compartidos).
- `scripts/generar.js`: renderiza con Chrome o Edge instalados (vía `playwright-core`). Otra ruta de navegador: variable `FLYER_BROWSER`.
- `scripts/recortar.js`: recorta imágenes (`node recortar.js foto.jpg x y ancho alto salida.png`).
