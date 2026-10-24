# flyer-maipu

Skill para agentes de IA que genera flyers de Instagram (PNG 1080×1350) del **Club Maipú**, siempre con la misma identidad visual: colores verde oliva y crema, logo del club y tipografía condensada.

Le pasás el texto y una foto, y el agente elige la plantilla, acomoda el contenido y genera la imagen. El diseño lo dibuja un script con plantillas fijas, no el modelo. Por eso el resultado es el mismo con Claude, Gemini o cualquier otro.

| agenda | evento | anuncio |
|---|---|---|
| ![agenda](ejemplos/agenda-basquet.png) | ![evento](ejemplos/evento-desarrollo.png) | ![anuncio](ejemplos/anuncio-alquiler.png) |

## Requisitos

- [Node.js](https://nodejs.org) 18 o superior
- Google Chrome o Microsoft Edge instalado. Si el navegador está en otra ruta, definí la variable `FLYER_BROWSER` con la ruta del ejecutable.

## Instalación

Cloná el repo dentro de la carpeta de skills de tu herramienta e instalá la dependencia:

| Herramienta | Carpeta |
|---|---|
| Antigravity (proyecto) | `<proyecto>/.agents/skills/` |
| Antigravity (global) | `~/.gemini/config/skills/` |
| Claude Code (proyecto) | `<proyecto>/.claude/skills/` |
| Claude Code (global) | `~/.claude/skills/` |

Por ejemplo, para Antigravity en un proyecto:

```bash
git clone https://github.com/martinalejandrohakanson29-art/flyer-maipu.git .agents/skills/flyer-maipu
cd .agents/skills/flyer-maipu/scripts
npm install
```

Otros agentes que puedan ejecutar comandos también sirven: alcanza con indicarles que lean `SKILL.md`.

## Uso

Pedile al agente algo como:

> Hacé un flyer del partido del sábado 7/11 vs Hindú, 10hs U17 y 12hs U19, cancha Maipú. Usá esta foto.

También se puede usar a mano, sin agente:

```bash
cd scripts
node generar.js ../ejemplos/evento-desarrollo.json salida.png
```

En [`SKILL.md`](SKILL.md) están los campos de cada plantilla y en `ejemplos/` hay un JSON por plantilla.

## Usarla para otro club

Toda la identidad está en [`assets/marca.json`](assets/marca.json): colores, fuentes y logo. Para adaptarla:

1. Reemplazá el logo. Si tiene fondo blanco, `node scripts/preparar-logo.js logo.png assets/logo.png` se lo quita.
2. Cambiá los colores y fuentes en `marca.json` (cualquier fuente de Google Fonts).
3. Actualizá el nombre del club en `SKILL.md` y cambiá las imágenes de `assets/referencias/`.

## Estructura

```
SKILL.md              instrucciones para el agente
assets/marca.json     identidad del club
assets/logo.png       logo sin fondo
assets/referencias/   flyers reales publicados, como referencia de estilo
plantillas/           diseños en HTML/CSS
scripts/generar.js    JSON + foto -> PNG
ejemplos/             un JSON de ejemplo por plantilla
```

## Nota

El logo, los flyers de referencia y la identidad visual pertenecen al Club Maipú.
