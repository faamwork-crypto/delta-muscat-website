/**
 * Delta Muscat Steel & Aluminium — brand asset generator.
 *
 * Generates all placeholder artwork for the website as self-contained SVG
 * files (plus a raster OG image) into /public, using the site's architectural
 * palette. Every file is a placeholder to be replaced with official company
 * photography — same filename, drop-in replacement.
 *
 * Run: node scripts/generate-assets.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const IMG = (p) => path.join(ROOT, "public", "images", p);

/* ------------------------------------------------------------------ */
/* Palette — architectural materials: warm off-white, charcoal,        */
/* graphite, muted bronze, sand.                                      */
/* ------------------------------------------------------------------ */
const C = {
  paper: "#F7F4EE",
  paperDeep: "#EFE9DE",
  sand: "#E5DCCB",
  sandDeep: "#D9CDB6",
  ink: "#1C1B18",
  inkSoft: "#3A3831",
  graphite: "#232220",
  graphiteDeep: "#191917",
  graphiteMid: "#26241F",
  bronze: "#A87C4F",
  bronzeDeep: "#8F663F",
  bronzeSoft: "#C9A876",
  steel: "#6F6E68",
  steelLight: "#9B9A92",
  white: "#FBFAF6",
};

/* ------------------------------------------------------------------ */
/* SVG helpers                                                         */
/* ------------------------------------------------------------------ */
const grainDef = `
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/>
    <feColorMatrix in="n" type="saturate" values="0"/>
  </filter>`;

function svg(w, h, body, { grain = true } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" role="img">
<defs>${grain ? grainDef : ""}</defs>
${body}
${grain ? `<rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.045" style="mix-blend-mode:overlay"/>` : ""}
</svg>`;
}

const lin = (id, stops, rot = 90) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${
    rot === 90 ? 0 : 1
  }" y2="${rot === 90 ? 1 : 0}">${stops
    .map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`)
    .join("")}</linearGradient>`;

const rad = (id, stops) =>
  `<radialGradient id="${id}">${stops
    .map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`)
    .join("")}</radialGradient>`;

const r = (x, y, w, h, fill, extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;

const c = (cx, cy, cr, fill, extra = "") =>
  `<circle cx="${cx}" cy="${cy}" r="${cr}" fill="${fill}" ${extra}/>`;

const ln = (x1, y1, x2, y2, stroke, sw = 2, extra = "") =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`;

/* ------------------------------------------------------------------ */
/* Motifs                                                              */
/* ------------------------------------------------------------------ */

/** Dusk sky + sun + ridge — shared backdrop for hero scenes. */
function duskScene(w, h, defs, sunX = 0.68, sunY = 0.5, sunR = 0.075) {
  const sx = w * sunX, sy = h * sunY, sr = w * sunR;
  return `
  ${defs}
  <rect width="${w}" height="${h}" fill="url(#sky)"/>
  <circle cx="${sx}" cy="${sy}" r="${sr * 2.6}" fill="url(#sunglow)"/>
  <circle cx="${sx}" cy="${sy}" r="${sr}" fill="url(#sun)"/>
  <path d="M0 ${h * 0.72} L ${w * 0.16} ${h * 0.63} L ${w * 0.3} ${h * 0.7} L ${w * 0.46} ${h * 0.6} L ${w * 0.62} ${h * 0.69} L ${w * 0.78} ${h * 0.64} L ${w} ${h * 0.71} L ${w} ${h} L 0 ${h} Z" fill="#1B1A16"/>
  <path d="M0 ${h * 0.78} L ${w * 0.22} ${h * 0.73} L ${w * 0.42} ${h * 0.79} L ${w * 0.6} ${h * 0.72} L ${w * 0.82} ${h * 0.78} L ${w} ${h * 0.74} L ${w} ${h} L 0 ${h} Z" fill="#161511"/>`;
}

/** Framing pergola: beams + slats across the top edge, lit gaps. */
function pergolaFrame(w, h, slats = 7) {
  let out = `
  <rect x="0" y="0" width="${w}" height="${h * 0.075}" fill="#121110"/>
  <rect x="0" y="${h * 0.075}" width="${w}" height="${h * 0.012}" fill="${C.bronzeSoft}" opacity="0.55"/>`;
  const zoneTop = h * 0.087, zoneH = h * 0.145;
  const gap = zoneH / slats;
  for (let i = 0; i < slats; i++) {
    const t = i / slats;
    const y = zoneTop + i * gap;
    const th = gap * 0.52;
    out += `<rect x="${-w * 0.05}" y="${y}" width="${w * 1.1}" height="${th}" fill="#131210" opacity="${0.68 + t * 0.3}"/>`;
    out += `<rect x="${-w * 0.05}" y="${y}" width="${w * 1.1}" height="${Math.max(2, th * 0.22)}" fill="${C.bronzeSoft}" opacity="${0.32 * (1 - t) + 0.08}"/>`;
  }
  return out;
}

/** Water shimmer at bottom of a scene. */
function water(w, h, top = 0.8) {
  let out = `<rect x="0" y="${h * top}" width="${w}" height="${h * (1 - top)}" fill="#14130F"/>`;
  for (let i = 0; i < 9; i++) {
    const y = h * top + (h * (1 - top) * i) / 10 + 6;
    const lw = w * (0.2 + 0.5 * Math.abs(Math.sin(i * 1.7)));
    const x = w * (0.12 + 0.3 * Math.abs(Math.cos(i * 2.3)));
    out += `<rect x="${x}" y="${y}" width="${lw}" height="3" rx="1.5" fill="${C.bronzeSoft}" opacity="${0.26 - i * 0.022}"/>`;
  }
  return out;
}

/* --- motif: louver pergola, daylight technical-elegant ------------- */
function motifLouvers(w, h, dark = false) {
  const bg = dark ? C.graphite : C.paper;
  const defs = lin("floor", dark
    ? [[0, "#1D1C19"], [1, "#141311"]]
    : [[0, C.paperDeep], [1, C.sand]]);
  let slats = "";
  const n = 9;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const yTop = h * (0.14 + t * 0.3);
    const yBot = yTop + h * (0.052 + t * 0.02);
    const inset = w * (0.07 - t * 0.05);
    const face = dark ? "#2A2823" : C.white;
    slats += `
    <polygon points="${inset},${yTop} ${w - inset},${yTop - h * 0.018} ${w - inset},${yTop - h * 0.018 + h * 0.02} ${inset},${yTop + h * 0.02}" fill="${dark ? "#33302A" : C.sand}" opacity="${0.6 + t * 0.3}"/>
    <rect x="${inset}" y="${yTop}" width="${w - inset * 2}" height="${yBot - yTop}" fill="${face}"/>
    <rect x="${inset}" y="${yTop}" width="${w - inset * 2}" height="${(yBot - yTop) * 0.28}" fill="${dark ? C.bronzeDeep : C.bronzeSoft}" opacity="${dark ? 0.85 : 0.6}"/>`;
  }
  let shadow = "";
  for (let i = 0; i < 12; i++) {
    const x = w * 0.08 + (i * w * 0.88) / 12;
    shadow += `<rect x="${x}" y="${h * 0.62}" width="${w * 0.032}" height="${h * 0.3}" fill="${dark ? "#000" : C.ink}" opacity="${dark ? 0.28 : 0.07}" transform="skewX(-18)"/>`;
  }
  return svg(w, h, `
  ${defs}
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <rect y="${h * 0.58}" width="${w}" height="${h * 0.42}" fill="url(#floor)"/>
  ${shadow}
  ${slats}
  ${ln(w * 0.07, h * 0.08, w * 0.07, h * 0.66, dark ? "#141311" : C.ink, w * 0.012)}
  ${ln(w * 0.93, h * 0.08, w * 0.93, h * 0.66, dark ? "#141311" : C.ink, w * 0.012)}`);
}

/* --- motif: tension sails ------------------------------------------ */
function motifSails(w, h, dark = false) {
  const bg = dark ? C.graphiteDeep : C.sand;
  const defs = `${lin("sail1", dark ? [[0, "#3B372E"], [1, "#2A2823"]] : [[0, C.white], [1, C.paperDeep]])}
  ${lin("sail2", dark ? [[0, "#2F2C25"], [1, "#232119"]] : [[0, C.paperDeep], [1, C.sandDeep]])}`;
  return svg(w, h, `
  ${defs}
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <rect y="${h * 0.74}" width="${w}" height="${h * 0.26}" fill="${dark ? "#141311" : C.sandDeep}" opacity="0.75"/>
  <path d="M ${w * 0.1} ${h * 0.2} Q ${w * 0.42} ${h * 0.44} ${w * 0.86} ${h * 0.16} L ${w * 0.8} ${h * 0.44} Q ${w * 0.45} ${h * 0.66} ${w * 0.13} ${h * 0.47} Z" fill="url(#sail1)"/>
  <path d="M ${w * 0.2} ${h * 0.55} Q ${w * 0.5} ${h * 0.72} ${w * 0.9} ${h * 0.5} L ${w * 0.94} ${h * 0.68} Q ${w * 0.55} ${h * 0.88} ${w * 0.18} ${h * 0.72} Z" fill="url(#sail2)" opacity="0.96"/>
  ${ln(w * 0.1, h * 0.2, w * 0.06, h * 0.74, dark ? "#0F0E0C" : C.ink, w * 0.006)}
  ${ln(w * 0.86, h * 0.16, w * 0.93, h * 0.7, dark ? "#0F0E0C" : C.ink, w * 0.006)}
  ${ln(w * 0.2, h * 0.55, w * 0.14, h * 0.78, dark ? "#0F0E0C" : C.ink, w * 0.005)}
  ${ln(w * 0.9, h * 0.5, w * 0.96, h * 0.72, dark ? "#0F0E0C" : C.ink, w * 0.005)}
  <ellipse cx="${w * 0.52}" cy="${h * 0.8}" rx="${w * 0.42}" ry="${h * 0.05}" fill="${dark ? "#000" : C.ink}" opacity="${dark ? 0.3 : 0.06}"/>`);
}

/* --- motif: cantilever parking shades ------------------------------ */
function motifCantilever(w, h, dark = false) {
  const bg = dark ? "#1B1A17" : C.paperDeep;
  const ground = dark ? "#141311" : C.sand;
  const mast = dark ? "#0F0E0C" : C.ink;
  let bays = "";
  const n = 4;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const x = w * (0.06 + t * 0.72);
    const s = 0.55 + t * 0.45;
    const bw = w * 0.24 * s, bh = h * 0.34 * s;
    const yRoof = h * (0.46 - t * 0.14);
    bays += `
    <rect x="${x}" y="${yRoof}" width="${bw}" height="${bh * 0.16}" fill="${dark ? "#2E2B24" : C.white}" transform="skewX(-14)"/>
    <rect x="${x + bw * 0.08}" y="${yRoof}" width="${bw * 0.92}" height="${bh * 0.13}" fill="${dark ? C.bronzeDeep : C.bronze}" opacity="${dark ? 0.9 : 0.55}" transform="skewX(-14)"/>
    <rect x="${x + bw * 0.16}" y="${yRoof + bh * 0.12}" width="${w * 0.014}" height="${h * (0.36 + t * 0.12)}" fill="${mast}"/>
    <line x1="${x + bw * 0.16}" y1="${yRoof + bh * 0.06}" x2="${x + bw * 0.72}" y2="${yRoof + bh * 0.04}" stroke="${mast}" stroke-width="${w * 0.005}"/>`;
  }
  let marks = "";
  for (let i = 0; i < 6; i++) {
    const x = w * (0.1 + i * 0.16);
    marks += ln(x, h * 0.9, x - w * 0.04, h * 0.99, dark ? C.steel : C.steelLight, 2, `opacity="0.5"`);
  }
  return svg(w, h, `
  ${lin("gr", dark ? [[0, "#171613"], [1, "#100F0D"]] : [[0, C.sand], [1, C.sandDeep]])}
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <rect y="${h * 0.62}" width="${w}" height="${h * 0.38}" fill="url(#gr)"/>
  ${bays}
  ${marks}`);
}

/* --- motif: laser-cut screen (mashrabiya geometry) ------------------ */
function starTile(size, stroke, fill, sw) {
  const k = size / 2, m = size * 0.31;
  return `<g>
    <path d="M ${k} 0 L ${k + m} ${k - m} L ${size} ${k} L ${k + m} ${k + m} L ${size} ${size} L ${k} ${size - 0} L ${0} ${size} L ${k - m} ${k + m} L 0 ${k} L ${k - m} ${k - m} Z"
      fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="miter"/>
    <circle cx="${k}" cy="${k}" r="${size * 0.16}" fill="none" stroke="${stroke}" stroke-width="${sw}"/>
  </g>`;
}
function motifScreen(w, h, dark = false) {
  const tile = w / 7;
  let tiles = "";
  for (let y = 0; y * tile < h + tile; y++)
    for (let x = 0; x * tile < w + tile; x++)
      tiles += `<g transform="translate(${x * tile} ${y * tile})">${starTile(tile, dark ? C.bronzeSoft : C.bronze, dark ? "#242119" : C.sandDeep, tile * 0.03)}</g>`;
  return svg(w, h, `
  <clipPath id="panel"><rect x="${w * 0.14}" y="${h * 0.09}" width="${w * 0.72}" height="${h * 0.82}" rx="6"/></clipPath>
  <rect width="${w}" height="${h}" fill="${dark ? C.graphiteDeep : C.paper}"/>
  <g clip-path="url(#panel)">${tiles}</g>
  <rect x="${w * 0.14}" y="${h * 0.09}" width="${w * 0.72}" height="${h * 0.82}" rx="6" fill="none" stroke="${dark ? C.steelLight : C.ink}" stroke-width="${w * 0.006}"/>
  <rect x="${w * 0.2}" y="${h * 0.16}" width="${w * 0.2}" height="${h * 0.68}" fill="${dark ? C.graphiteDeep : C.paper}" opacity="0.92"/>
  <rect x="${w * 0.2}" y="${h * 0.16}" width="${w * 0.2}" height="${h * 0.68}" fill="none" stroke="${dark ? C.bronzeSoft : C.bronze}" stroke-width="2" opacity="0.7"/>`);
}

/* --- motif: minimal villa with terrace pergola ---------------------- */
function motifVilla(w, h, dark = false) {
  const wall = dark ? "#28261F" : C.white;
  const ground = dark ? "#15140F" : C.sand;
  let stripes = "";
  for (let i = 0; i < 8; i++)
    stripes += r(w * (0.47 + i * 0.045), h * 0.58, w * 0.02, h * 0.1, dark ? "#0F0E0C" : C.ink, `opacity="${dark ? 0.5 : 0.13}"`);
  return svg(w, h, `
  ${lin("sk", dark ? [[0, "#171613"], [0.8, "#26221A"], [1, "#2E2818"]] : [[0, C.paper], [1, C.paperDeep]])}
  ${rad("sg", dark ? [[0, C.bronzeSoft, 0.9], [1, C.bronzeSoft, 0]] : [[0, C.bronze, 0.35], [1, C.bronze, 0]])}
  <rect width="${w}" height="${h}" fill="url(#sk)"/>
  <circle cx="${w * 0.78}" cy="${h * 0.26}" r="${w * 0.05}" fill="url(#sg)"/>
  <rect y="${h * 0.68}" width="${w}" height="${h * 0.32}" fill="${ground}"/>
  <rect x="${w * 0.08}" y="${h * 0.34}" width="${w * 0.38}" height="${h * 0.34}" fill="${wall}"/>
  <rect x="${w * 0.08}" y="${h * 0.34}" width="${w * 0.38}" height="${h * 0.02}" fill="${dark ? "#0F0E0C" : C.ink}"/>
  <rect x="${w * 0.12}" y="${h * 0.42}" width="${w * 0.09}" height="${h * 0.12}" fill="${dark ? C.bronzeSoft : C.sand}" opacity="${dark ? 0.75 : 0.9}"/>
  <rect x="${w * 0.26}" y="${h * 0.42}" width="${w * 0.09}" height="${h * 0.12}" fill="${dark ? C.bronze : C.sandDeep}" opacity="${dark ? 0.6 : 0.8}"/>
  <rect x="${w * 0.46}" y="${h * 0.3}" width="${w * 0.4}" height="${h * 0.04}" fill="${dark ? "#121110" : C.ink}"/>
  <rect x="${w * 0.44}" y="${h * 0.34}" width="${w * 0.42}" height="${h * 0.016}" fill="${dark ? C.bronzeDeep : C.bronze}" opacity="0.9"/>
  <rect x="${w * 0.46}" y="${h * 0.356}" width="${w * 0.42}" height="${h * 0.34}" fill="${dark ? "#211F19" : C.paper}" opacity="${dark ? 0.55 : 0.45}"/>
  ${stripes}
  ${ln(w * 0.46, h * 0.34, w * 0.46, h * 0.68, dark ? "#121110" : C.ink, w * 0.008)}
  ${ln(w * 0.88, h * 0.34, w * 0.88, h * 0.68, dark ? "#121110" : C.ink, w * 0.008)}`);
}

/* --- motif: hospitality terrace ------------------------------------ */
function motifTerrace(w, h, dark = true) {
  let tables = "";
  for (let i = 0; i < 3; i++) {
    const x = w * (0.18 + i * 0.27), y = h * (0.72 + (i % 2) * 0.08);
    tables += `
    <ellipse cx="${x}" cy="${y}" rx="${w * 0.055}" ry="${w * 0.02}" fill="${dark ? "#2B2822" : C.white}"/>
    ${ln(x, y, x, y + h * 0.06, dark ? "#0F0E0C" : C.ink, 3)}
    <ellipse cx="${x}" cy="${y + h * 0.06}" rx="${w * 0.03}" ry="${w * 0.01}" fill="${dark ? "#0F0E0C" : C.ink}" opacity="0.8"/>
    <circle cx="${x + w * 0.05}" cy="${y - h * 0.03}" r="${w * 0.006}" fill="${C.bronzeSoft}" opacity="0.9"/>`;
  }
  let slats = "";
  for (let i = 0; i < 8; i++)
    slats += r(w * (-0.02 + i * 0.14), h * 0.1, w * 0.11, h * 0.018, "#121110", `opacity="0.9"`);
  return svg(w, h, `
  ${lin("sk2", [[0, "#191813"], [0.75, "#242019"], [1, "#2B2519"]])}
  ${rad("lamp", [[0, C.bronzeSoft, 0.85], [1, C.bronzeSoft, 0]])}
  <rect width="${w}" height="${h}" fill="url(#sk2)"/>
  <rect y="${h * 0.84}" width="${w}" height="${h * 0.16}" fill="#12110D"/>
  <rect x="0" y="0" width="${w}" height="${h * 0.09}" fill="#0E0D0B"/>
  ${slats}
  ${Array.from({ length: 3 }, (_, i) =>
    `<circle cx="${w * (0.3 + i * 0.22)}" cy="${h * 0.3}" r="${w * 0.11}" fill="url(#lamp)" opacity="0.5"/>`
  ).join("")}
  ${tables}`);
}

/* --- motif: commercial facade with brise-soleil --------------------- */
function motifFacade(w, h, dark = false) {
  const bg = dark ? C.graphiteDeep : C.paper;
  const body = dark ? "#26241E" : C.white;
  let fins = "";
  for (let i = 0; i < 14; i++)
    fins += r(w * (0.12 + i * 0.055), h * 0.08, w * 0.012, h * 0.56, dark ? C.bronzeDeep : C.bronze, `opacity="${0.35 + (i % 3) * 0.22}"`);
  let grid = "";
  for (let y = 0; y < 5; y++)
    for (let x = 0; x < 8; x++)
      grid += r(w * (0.13 + x * 0.094), h * (0.1 + y * 0.115), w * 0.078, h * 0.09, dark ? "#1B1A16" : C.sandDeep, `opacity="${(x + y) % 4 === 0 ? (dark ? 0.7 : 1) : dark ? 0.35 : 0.5}"`);
  return svg(w, h, `
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <rect x="${w * 0.11}" y="${h * 0.07}" width="${w * 0.78}" height="${h * 0.62}" fill="${body}"/>
  ${grid}
  ${fins}
  <rect x="${w * 0.11}" y="${h * 0.69}" width="${w * 0.78}" height="${h * 0.015}" fill="${dark ? "#0F0E0C" : C.ink}"/>
  <rect x="${w * 0.11}" y="${h * 0.705}" width="${w * 0.78}" height="${h * 0.2}" fill="${dark ? "#161511" : C.sand}"/>
  ${Array.from({ length: 5 }, (_, i) => r(w * (0.16 + i * 0.16), h * 0.74, w * 0.06, h * 0.16, dark ? "#211F19" : C.paperDeep, `opacity="0.9"`)).join("")}`);
}

/* --- motif: public plaza walkway canopy ----------------------------- */
function motifWalkway(w, h, dark = false) {
  let cols = "";
  const n = 6;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const x = w * (0.5 + (t - 0.5) * 0.86 * 0.5);
    const yTop = h * (0.3 + Math.abs(t - 0.5) * 0.1);
    const cw = w * (0.012 + Math.abs(t - 0.5) * 0.016);
    cols += `<rect x="${x - cw / 2}" y="${yTop}" width="${cw}" height="${h - yTop - h * 0.06}" fill="${dark ? "#141311" : C.ink}"/>`;
  }
  return svg(w, h, `
  ${lin("r2", dark ? [[0, "#1D1C18"], [1, "#141311"]] : [[0, C.paperDeep], [1, C.sandDeep]])}
  <rect width="${w}" height="${h}" fill="${dark ? C.graphite : C.paper}"/>
  <polygon points="0,${h * 0.3} ${w * 0.5},${h * 0.18} ${w},${h * 0.3} ${w},${h * 0.36} ${w * 0.5},${h * 0.24} 0,${h * 0.36}" fill="${dark ? "#2A2721" : C.white}"/>
  <polygon points="0,${h * 0.36} ${w * 0.5},${h * 0.24} ${w},${h * 0.36} ${w},${h * 0.385} ${w * 0.5},${h * 0.265} 0,${h * 0.385}" fill="${dark ? C.bronzeDeep : C.bronze}" opacity="0.75"/>
  <rect y="${h * 0.385}" width="${w}" height="${h * 0.615}" fill="url(#r2)"/>
  ${cols}`);
}

/* --- motif: technical drawing / architect sheet ---------------------- */
function motifDrawing(w, h) {
  let grid = "";
  for (let x = 0; x <= 16; x++) grid += ln((x * w) / 16, 0, (x * w) / 16, h, C.ink, 1, `opacity="${x % 4 === 0 ? 0.16 : 0.07}"`);
  for (let y = 0; y <= 11; y++) grid += ln(0, (y * h) / 11, w, (y * h) / 11, C.ink, 1, `opacity="${y % 4 === 0 ? 0.16 : 0.07}"`);
  return svg(w, h, `
  <rect width="${w}" height="${h}" fill="${C.paper}"/>
  ${grid}
  <rect x="${w * 0.08}" y="${h * 0.1}" width="${w * 0.84}" height="${h * 0.72}" fill="none" stroke="${C.ink}" stroke-width="2"/>
  <rect x="${w * 0.16}" y="${h * 0.22}" width="${w * 0.68}" height="${h * 0.12}" fill="none" stroke="${C.bronze}" stroke-width="3"/>
  ${Array.from({ length: 6 }, (_, i) => ln(w * (0.16 + i * 0.136), h * 0.22, w * (0.16 + i * 0.136), h * 0.34, C.ink, 2, `opacity="0.65"`)).join("")}
  <line x1="${w * 0.16}" y1="${h * 0.5}" x2="${w * 0.84}" y2="${h * 0.5}" stroke="${C.ink}" stroke-width="2"/>
  <line x1="${w * 0.5}" y1="${h * 0.34}" x2="${w * 0.5}" y2="${h * 0.82}" stroke="${C.ink}" stroke-width="2" stroke-dasharray="10 6"/>
  ${Array.from({ length: 2 }, (_, i) => `
    <line x1="${w * (0.16 + i * 0.68)}" y1="${h * 0.44}" x2="${w * (0.16 + i * 0.68)}" y2="${h * 0.56}" stroke="${C.bronze}" stroke-width="2"/>
    <line x1="${w * (0.13 + i * 0.68)}" y1="${h * 0.44}" x2="${w * (0.19 + i * 0.68)}" y2="${h * 0.44}" stroke="${C.bronze}" stroke-width="2"/>
    <line x1="${w * (0.13 + i * 0.68)}" y1="${h * 0.56}" x2="${w * (0.19 + i * 0.68)}" y2="${h * 0.56}" stroke="${C.bronze}" stroke-width="2"/>`).join("")}
  <circle cx="${w * 0.5}" cy="${h * 0.5}" r="${w * 0.018}" fill="${C.bronze}"/>`);
}

/* --- motif: factory interior ---------------------------------------- */
function motifFactory(w, h) {
  let rays = "";
  for (let i = 0; i < 4; i++) {
    const x = w * (0.16 + i * 0.22);
    rays += `<polygon points="${x},${h * 0.06} ${x + w * 0.05},${h * 0.06} ${x + w * 0.14},${h * 0.78} ${x + w * 0.02},${h * 0.78}" fill="${C.bronzeSoft}" opacity="0.1"/>`;
  }
  return svg(w, h, `
  ${lin("f1", [[0, "#211F1A"], [1, "#161512"]])}
  <rect width="${w}" height="${h}" fill="url(#f1)"/>
  <polygon points="0,0 ${w * 0.5},${h * 0.16} ${w},0" fill="#141311"/>
  ${rays}
  <rect x="${w * 0.04}" y="${h * 0.3}" width="${w * 0.92}" height="${h * 0.02}" fill="#0F0E0C"/>
  <rect x="${w * 0.3}" y="${h * 0.16}" width="${w * 0.05}" height="${h * 0.66}" fill="#0F0E0C" opacity="0.9"/>
  <rect x="0" y="${h * 0.74}" width="${w}" height="${h * 0.26}" fill="#1A1916"/>
  <rect x="${w * 0.6}" y="${h * 0.52}" width="${w * 0.22}" height="${h * 0.22}" fill="#26241E"/>
  <rect x="${w * 0.63}" y="${h * 0.56}" width="${w * 0.05}" height="${h * 0.05}" fill="${C.bronzeSoft}" opacity="0.8"/>
  <rect x="${w * 0.12}" y="${h * 0.6}" width="${w * 0.16}" height="${h * 0.14}" fill="#26241E"/>
  <rect x="${w * 0.15}" y="${h * 0.63}" width="${w * 0.04}" height="${h * 0.04}" fill="${C.bronze}" opacity="0.7"/>`);
}

/* --- motif: extrusion profiles --------------------------------------- */
function motifProfiles(w, h) {
  const shapes = [
    `<rect x="0" y="0" width="60" height="80" rx="4" fill="none"/>`,
    `<path d="M0 0 H60 V14 H14 V66 H60 V80 H0 Z" fill="none"/>`,
    `<path d="M0 0 H70 V70 H56 V14 H0 Z" fill="none"/>`,
    `<path d="M0 0 L34 0 L68 40 L34 80 L0 80 L34 40 Z" fill="none"/>`,
    `<circle cx="40" cy="40" r="38" fill="none"/><circle cx="40" cy="40" r="24" fill="none"/>`,
    `<rect x="0" y="0" width="78" height="24" rx="3" fill="none"/><rect x="0" y="34" width="78" height="12" rx="3" fill="none"/>`,
  ];
  return svg(w, h, `
  <rect width="${w}" height="${h}" fill="${C.paperDeep}"/>
  ${shapes
    .map(
      (s, i) =>
        `<g transform="translate(${w * (0.08 + (i % 3) * 0.3)} ${h * (0.16 + Math.floor(i / 3) * 0.38)}) scale(${(w / 1600) * 1.5})" stroke="${C.ink}" stroke-width="4">${s}</g>`
    )
    .join("")}
  ${Array.from({ length: 3 }, (_, i) => ln(w * (0.06 + i * 0.3), h * 0.92, w * (0.26 + i * 0.3), h * 0.92, C.bronze, 3)).join("")}`);
}

/* --- motif: steel stack ------------------------------------------------ */
function motifSteel(w, h) {
  let beams = "";
  const rows = [
    { y: 0.18, n: 2, bh: 0.16 },
    { y: 0.42, n: 3, bh: 0.12 },
    { y: 0.62, n: 2, bh: 0.14 },
  ];
  for (const row of rows) {
    for (let i = 0; i < row.n; i++) {
      const bw = w * (0.5 / row.n);
      const x = w * (0.12 + i * (0.62 / row.n));
      const y = h * row.y;
      beams += `
      <rect x="${x}" y="${y}" width="${bw}" height="${h * row.bh}" fill="${C.graphite}" stroke="${C.ink}" stroke-width="3"/>
      <rect x="${x}" y="${y}" width="${bw}" height="${h * 0.018}" fill="${C.steelLight}" opacity="0.7"/>
      <rect x="${x}" y="${y + h * row.bh * 0.5}" width="${bw}" height="${h * 0.026}" fill="${C.steel}" opacity="0.35"/>`;
    }
  }
  return svg(w, h, `
  <rect width="${w}" height="${h}" fill="${C.paperDeep}"/>
  ${beams}
  ${ln(w * 0.06, h * 0.88, w * 0.94, h * 0.88, C.bronze, 3, `opacity="0.85"`)}`);
}

/* --- motif: fabric drape --------------------------------------------- */
function motifFabrics(w, h) {
  const drape = (x, s, op, id) => `
    <path d="M ${x} ${h * 0.2} Q ${x + w * 0.09 * s} ${h * 0.5} ${x} ${h * 0.8}" stroke="${C.steel}" stroke-width="2" fill="none" opacity="0.6"/>`;
  let folds = "";
  for (let i = 0; i < 4; i++) folds += drape(w * (0.16 + i * 0.028), 1 - i * 0.12, 0.6);
  return svg(w, h, `
  ${lin("fb1", [[0, C.white], [1, C.sandDeep]])}
  ${lin("fb2", [[0, C.paperDeep], [1, C.sand]])}
  <rect width="${w}" height="${h}" fill="${C.paper}"/>
  <path d="M ${w * 0.1} ${h * 0.18} Q ${w * 0.3} ${h * 0.58} ${w * 0.1} ${h * 0.82} L ${w * 0.26} ${h * 0.82} Q ${w * 0.44} ${h * 0.56} ${w * 0.28} ${h * 0.18} Z" fill="url(#fb1)"/>
  <path d="M ${w * 0.4} ${h * 0.22} Q ${w * 0.58} ${h * 0.6} ${w * 0.4} ${h * 0.84} L ${w * 0.54} ${h * 0.84} Q ${w * 0.7} ${h * 0.6} ${w * 0.56} ${h * 0.22} Z" fill="url(#fb2)"/>
  <path d="M ${w * 0.66} ${h * 0.2} Q ${w * 0.82} ${h * 0.55} ${w * 0.66} ${h * 0.82} L ${w * 0.78} ${h * 0.82} Q ${w * 0.92} ${h * 0.56} ${w * 0.8} ${h * 0.2} Z" fill="${C.bronzeSoft}" opacity="0.75"/>
  ${folds}
  ${Array.from({ length: 26 }, (_, i) => c(w * (0.42 + (i % 7) * 0.026), h * (0.3 + Math.floor(i / 7) * 0.14), 2.4, C.ink, `opacity="0.25"`)).join("")}`);
}

/* --- motif: finish chips --------------------------------------------- */
function motifFinishes(w, h) {
  const chips = [C.white, C.sandDeep, C.bronze, "#4A4842", "#2B2A27"];
  let wood = "";
  for (let i = 0; i < 9; i++)
    wood += `<path d="M ${w * 0.08} ${h * (0.66 + i * 0.033)} q ${w * 0.15} ${h * 0.014} ${w * 0.3} 0 t ${w * 0.3} 0" stroke="#8A6A44" stroke-width="2.5" fill="none" opacity="${0.35 + (i % 3) * 0.2}"/>`;
  return svg(w, h, `
  <rect width="${w}" height="${h}" fill="${C.paper}"/>
  ${chips
    .map(
      (cc, i) =>
        `<g transform="rotate(${-14 + i * 7} ${w * (0.16 + i * 0.15)} ${h * 0.34})"><rect x="${w * (0.06 + i * 0.15)}" y="${h * 0.12}" width="${w * 0.19}" height="${h * 0.42}" rx="4" fill="${cc}" stroke="${C.ink}" stroke-opacity="0.16" stroke-width="2"/></g>`
    )
    .join("")}
  <rect x="${w * 0.06}" y="${h * 0.6}" width="${w * 0.88}" height="${h * 0.32}" rx="6" fill="#B98F62"/>
  ${wood}
  <rect x="${w * 0.06}" y="${h * 0.6}" width="${w * 0.88}" height="${h * 0.32}" rx="6" fill="none" stroke="${C.ink}" stroke-opacity="0.2" stroke-width="2"/>`);
}

/* --- motif: hardware -------------------------------------------------- */
function motifHardware(w, h) {
  const bolt = (x, y, s) => `
    <circle cx="${x}" cy="${y}" r="${26 * s}" fill="none" stroke="${C.ink}" stroke-width="${5 * s}"/>
    <circle cx="${x}" cy="${y}" r="${12 * s}" fill="none" stroke="${C.ink}" stroke-width="${4 * s}"/>
    ${Array.from({ length: 6 }, (_, i) => {
      const a = (i * Math.PI) / 3;
      return ln(x + Math.cos(a) * 18 * s, y + Math.sin(a) * 18 * s, x + Math.cos(a) * 26 * s, y + Math.sin(a) * 26 * s, C.ink, 4 * s);
    }).join("")}`;
  return svg(w, h, `
  <rect width="${w}" height="${h}" fill="${C.paperDeep}"/>
  ${bolt(w * 0.24, h * 0.32, (w / 1200) * 1.6)}
  ${bolt(w * 0.72, h * 0.3, (w / 1200) * 1.6)}
  <g stroke="${C.ink}" stroke-width="${6 * (w / 1200)}" fill="none">
    <path d="M ${w * 0.5} ${h * 0.16} v ${h * 0.18} h ${w * 0.16} v ${h * 0.08}"/>
    <rect x="${w * 0.42}" y="${h * 0.6}" width="${w * 0.16}" height="${h * 0.2}"/>
    <path d="M ${w * 0.42} ${h * 0.6} l ${w * -0.05} ${h * 0.06} M ${w * 0.58} ${h * 0.6} l ${w * 0.05} ${h * 0.06}"/>
  </g>
  <rect x="${w * 0.12}" y="${h * 0.44}" width="${w * 0.2}" height="${h * 0.14}" rx="4" fill="none" stroke="${C.bronze}" stroke-width="${6 * (w / 1200)}"/>
  <rect x="${w * 0.68}" y="${h * 0.5}" width="${w * 0.2}" height="${h * 0.14}" rx="4" fill="none" stroke="${C.bronze}" stroke-width="${6 * (w / 1200)}"/>`);
}

/* --- motif: sample box ----------------------------------------------- */
function motifSampleBox(w, h) {
  const sw = [C.white, C.sandDeep, C.bronze, "#4A4842", "#2B2A27", C.paperDeep, C.bronzeSoft, C.steel];
  return svg(w, h, `
  <rect width="${w}" height="${h}" fill="${C.sand}"/>
  <rect x="${w * 0.1}" y="${h * 0.12}" width="${w * 0.8}" height="${h * 0.1}" fill="#B98F62" opacity="0.9"/>
  <rect x="${w * 0.1}" y="${h * 0.22}" width="${w * 0.8}" height="${h * 0.66}" fill="${C.paperDeep}"/>
  ${sw
    .map((cc, i) => r(w * (0.14 + (i % 4) * 0.19), h * (0.28 + Math.floor(i / 4) * 0.28), w * 0.16, h * 0.22, cc, `stroke="${C.ink}" stroke-opacity="0.14" stroke-width="2"`))
    .join("")}
  ${ln(w * 0.1, h * 0.88, w * 0.9, h * 0.88, C.ink, 3, `opacity="0.3"`)}`);
}

/* --- motif: gate / entry ---------------------------------------------- */
function motifGate(w, h) {
  let bars = "";
  for (let i = 0; i < 9; i++)
    bars += `<rect x="${w * (0.09 + i * 0.093)}" y="${h * 0.3}" width="${w * 0.012}" height="${h * 0.5}" fill="${C.ink}" opacity="0.75"/>`;
  return svg(w, h, `
  ${lin("g1", [[0, C.paper], [1, C.paperDeep]])}
  <rect width="${w}" height="${h}" fill="url(#g1)"/>
  <rect x="${w * 0.07}" y="${h * 0.24}" width="${w * 0.86}" height="${h * 0.62}" fill="none" stroke="${C.ink}" stroke-width="${w * 0.008}"/>
  <rect x="${w * 0.11}" y="${h * 0.3}" width="${w * 0.78}" height="${h * 0.06}" fill="${C.sandDeep}"/>
  <g transform="translate(${w * 0.36} ${h * 0.42}) scale(${(w / 1200) * 1.1})">${starTile(240, C.bronze, C.sand, 6)}</g>
  <g transform="translate(${w * 0.55} ${h * 0.42}) scale(${(w / 1200) * 1.1})">${starTile(240, C.bronze, C.sand, 6)}</g>
  ${bars}
  <circle cx="${w * 0.47}" cy="${h * 0.56}" r="${w * 0.02}" fill="${C.bronze}"/>`);
}

/* --- motif: hero dusk scene ------------------------------------------- */
function motifHeroDusk(w, h) {
  const defs = `
    ${lin("sky", [[0, "#121110"], [0.55, "#211E18"], [0.8, "#2E2818"], [1, "#372E1B"]], 90)}
    ${rad("sun", [[0, "#E8C28E"], [0.65, C.bronzeSoft], [1, C.bronze]])}
    ${rad("sunglow", [[0, C.bronzeSoft, 0.34], [0.5, C.bronzeSoft, 0.12], [1, C.bronzeSoft, 0]])}`;
  let villa = "";
  for (let i = 0; i < 5; i++) {
    const x = w * (0.06 + i * 0.19), vw = w * (0.07 + (i % 3) * 0.02), vh = h * (0.05 + (i % 2) * 0.025);
    villa += `<rect x="${x}" y="${h * 0.745 - vh}" width="${vw}" height="${vh}" fill="#14130F"/>`;
    villa += `<rect x="${x + vw * 0.2}" y="${h * 0.745 - vh * 0.5}" width="${vw * 0.18}" height="${h * 0.008}" fill="${C.bronzeSoft}" opacity="0.5"/>`;
  }
  return svg(
    w,
    h,
    `
  ${duskScene(w, h, defs, 0.66, 0.5, 0.058)}
  ${villa}
  ${water(w, h, 0.815)}
  ${pergolaFrame(w, h, 8)}`
  );
}

/* --- motif: wide CTA banner ------------------------------------------- */
function motifCtaBanner(w, h) {
  const defs = `
    ${lin("sky2", [[0, "#16150F"], [1, "#242019"]])}
    ${rad("sunglow2", [[0, C.bronzeSoft, 0.22], [1, C.bronzeSoft, 0]])}`;
  let slats = "";
  for (let i = 0; i < 5; i++) {
    const y = h * (0.3 + i * 0.09);
    slats += `<rect x="${-w * 0.02}" y="${y}" width="${w * 1.04}" height="${h * 0.024}" fill="#121110" opacity="0.85"/><rect x="${-w * 0.02}" y="${y}" width="${w * 1.04}" height="${3}" fill="${C.bronzeSoft}" opacity="0.28"/>`;
  }
  return svg(w, h, `
  ${defs}
  <rect width="${w}" height="${h}" fill="url(#sky2)"/>
  <circle cx="${w * 0.5}" cy="${h * 0.62}" r="${w * 0.09}" fill="url(#sunglow2)"/>
  <circle cx="${w * 0.5}" cy="${h * 0.62}" r="${w * 0.028}" fill="${C.bronzeSoft}" opacity="0.85"/>
  ${slats}
  <rect y="0" width="${w}" height="${h * 0.09}" fill="#100F0D"/>`);
}

/* ------------------------------------------------------------------ */
/* Logo                                                                */
/* ------------------------------------------------------------------ */
function logoMarkSvg(size = 96) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 96 96" role="img" aria-label="Delta Muscat">
  <rect width="96" height="96" rx="14" fill="#232220"/>
  <path d="M48 20 L74 66 L66 66 L48 35 L30 66 L22 66 Z" fill="#C9A876"/>
  <path d="M36 70 H60" stroke="#C9A876" stroke-width="3" stroke-linecap="round" opacity="0.65"/>
  <path d="M41 77 H55" stroke="#C9A876" stroke-width="3" stroke-linecap="round" opacity="0.4"/>
  <circle cx="48" cy="49" r="2.6" fill="#232220"/>
</svg>`;
}

function logoHorizontalSvg(w = 420, dark = true) {
  const text = dark ? "#F7F4EE" : "#1C1B18";
  const sub = dark ? "#9B9A92" : "#6F6E68";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${(w / 420) * 72}" viewBox="0 0 420 72" role="img" aria-label="Delta Muscat Steel &amp; Aluminium">
  <path d="M31 12 L58 60 L49 60 L31 28 L13 60 L4 60 Z" fill="#C9A876"/>
  <path d="M17 64 H45" stroke="#C9A876" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
  <text x="76" y="34" font-family="Georgia, 'Times New Roman', serif" font-size="28" letter-spacing="6" fill="${text}">DELTA</text>
  <text x="76" y="56" font-family="Arial, Helvetica, sans-serif" font-size="11.5" letter-spacing="4.2" fill="${sub}">MUSCAT · STEEL &amp; ALUMINIUM</text>
</svg>`;
}

function faviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#232220"/>
  <path d="M32 14 L50 46 L43 46 L32 26 L21 46 L14 46 Z" fill="#C9A876"/>
  <path d="M24 50 H40" stroke="#C9A876" stroke-width="3" stroke-linecap="round" opacity="0.65"/>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* OG image — pure-Node PNG encoder with a 5x7 bitmap font            */
/* ------------------------------------------------------------------ */
const FONT = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  C: ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  "&": ["00100", "01010", "01000", "00100", "01010", "10001", "01110"],
  "·": ["00000", "00000", "00000", "00110", "00110", "00000", "00000"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
};

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let cc = n;
    for (let k = 0; k < 8; k++) cc = cc & 1 ? 0xedb88320 ^ (cc >>> 1) : cc >>> 1;
    t[n] = cc;
  }
  return t;
})();
function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ buf[i]) & 0xff];
  return (crc ^ -1) >>> 0;
}
function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function encodePng(w, h, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0; // filter none
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function hex(cch) {
  return [parseInt(cch.slice(1, 3), 16), parseInt(cch.slice(3, 5), 16), parseInt(cch.slice(5, 7), 16)];
}
const mix = (a, b, t) => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];

function drawText(px, w, h, text, x0, y0, scale, rgb) {
  let cx = x0;
  for (const ch of text) {
    const g = FONT[ch] ?? FONT[" "];
    for (let gy = 0; gy < 7; gy++)
      for (let gx = 0; gx < 5; gx++)
        if (g[gy][gx] === "1")
          for (let sy = 0; sy < scale; sy++)
            for (let sx = 0; sx < scale; sx++) {
              const X = cx + gx * scale + sx, Y = y0 + gy * scale + sy;
              if (X < w && Y < h) {
                const o = (Y * w + X) * 4;
                px[o] = rgb[0]; px[o + 1] = rgb[1]; px[o + 2] = rgb[2]; px[o + 3] = 255;
              }
            }
    cx += 6 * scale + scale; // char cell + tracking
  }
  return cx;
}

function generateOgImage() {
  const W = 1200, H = 630;
  const px = Buffer.alloc(W * H * 4);
  const top = hex("#191917"), mid = hex("#232220"), low = hex("#2A2519");
  for (let y = 0; y < H; y++) {
    const t = y / H;
    const row = t < 0.7 ? mix(top, mid, t / 0.7) : mix(mid, low, (t - 0.7) / 0.3);
    for (let x = 0; x < W; x++) {
      const o = (y * W + x) * 4;
      px[o] = row[0]; px[o + 1] = row[1]; px[o + 2] = row[2]; px[o + 3] = 255;
    }
  }
  // sun with soft glow
  const sun = hex("#C9A876"), sunCore = hex("#E8C28E");
  const scx = 950, scy = 240, sr = 78;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const d = Math.hypot(x - scx, y - scy);
      const o = (y * W + x) * 4;
      if (d < sr) {
        const col = mix(sunCore, sun, d / sr);
        px[o] = col[0]; px[o + 1] = col[1]; px[o + 2] = col[2];
      } else if (d < sr * 3.4) {
        const a = Math.max(0, 1 - (d - sr) / (sr * 2.4)) * 0.22;
        const col = mix([px[o], px[o + 1], px[o + 2]], sun, a);
        px[o] = col[0]; px[o + 1] = col[1]; px[o + 2] = col[2];
      }
    }
  // louver bands
  const bandDark = hex("#121110");
  for (let i = 0; i < 5; i++) {
    const y = Math.round(H * (0.52 + i * 0.095));
    const bh = 14;
    for (let yy = y; yy < y + bh; yy++)
      for (let x = 0; x < W; x++) {
        const o = (yy * W + x) * 4;
        px[o] = bandDark[0]; px[o + 1] = bandDark[1]; px[o + 2] = bandDark[2];
      }
    // lit top edge
    for (let x = 0; x < W; x++) {
      const o = (y * W + x) * 4;
      const col = mix([px[o], px[o + 1], px[o + 2]], sun, 0.25);
      px[o] = col[0]; px[o + 1] = col[1]; px[o + 2] = col[2];
    }
  }
  // delta mark (outline triangle)
  const bronze = hex("#C9A876");
  const markAt = (x, y) => {
    // simple filled triangle between apex (600,105) base (560..640, 175)
    const apex = [92, 96], bl = [56, 168], br = [128, 168];
    const v0 = [bl[0] - apex[0], bl[1] - apex[1]], v1 = [br[0] - apex[0], br[1] - apex[1]], v2 = [x - apex[0], y - apex[1]];
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
    const den = v0[0] * v1[1] - v1[0] * v0[1];
    const u = (v2[0] * v1[1] - v1[0] * v2[1]) / den;
    const v = (v0[0] * v2[1] - v2[0] * v0[1]) / den;
    return u >= 0 && v >= 0 && u + v <= 1;
  };
  for (let y = 90; y < 180; y++)
    for (let x = 50; x < 140; x++)
      if (markAt(x, y)) {
        const o = (y * W + x) * 4;
        px[o] = bronze[0]; px[o + 1] = bronze[1]; px[o + 2] = bronze[2];
      }
  // wordmark
  drawText(px, W, H, "DELTA MUSCAT", 92, 230, 9, hex("#F7F4EE"));
  drawText(px, W, H, "STEEL & ALUMINIUM", 94, 320, 3, hex("#9B9A92"));
  // thin bronze rule
  for (let x = 94; x < 470; x++) {
    const o = (385 * W + x) * 4;
    px[o] = bronze[0]; px[o + 1] = bronze[1]; px[o + 2] = bronze[2];
  }
  drawText(px, W, H, "THE ARCHITECTURE OF SHADE", 94, 420, 3, hex("#C9A876"));
  return encodePng(W, H, px);
}

/* ------------------------------------------------------------------ */
/* Emit everything                                                     */
/* ------------------------------------------------------------------ */
const dirs = [
  "hero", "solutions", "sectors", "process", "materials", "gallery", "cta", "og",
];
for (const d of dirs) mkdirSync(IMG(d), { recursive: true });
mkdirSync(path.join(ROOT, "public", "brand"), { recursive: true });
mkdirSync(path.join(ROOT, "src", "app"), { recursive: true });

const write = (file, content) => {
  const p = file.startsWith("public/") || file.startsWith("src/")
    ? path.join(ROOT, file)
    : IMG(file);
  writeFileSync(p, content);
  console.log("✓", path.relative(ROOT, p));
};

/* hero + cta */
write("hero/dusk-pergola.svg", motifHeroDusk(2100, 1400));
write("cta/cta-dusk.svg", motifCtaBanner(2100, 820));

/* solutions */
write("solutions/pergolas.svg", motifLouvers(1600, 1100));
write("solutions/parking-shades.svg", motifCantilever(1600, 1100));
write("solutions/shade-structures.svg", motifSails(1600, 1100));
write("solutions/metal-decoration.svg", motifScreen(1600, 1100));

/* sectors */
write("sectors/luxury-villas.svg", motifVilla(1600, 1000));
write("sectors/hospitality.svg", motifTerrace(1600, 1000, true));
write("sectors/commercial.svg", motifFacade(1600, 1000));
write("sectors/government.svg", motifWalkway(1600, 1000));
write("sectors/architects.svg", motifDrawing(1600, 1000));

/* about / process */
write("process/factory.svg", motifFactory(1920, 1000));

/* materials */
write("materials/profiles.svg", motifProfiles(1200, 900));
write("materials/steel.svg", motifSteel(1200, 900));
write("materials/fabrics.svg", motifFabrics(1200, 900));
write("materials/finishes.svg", motifFinishes(1200, 900));
write("materials/hardware.svg", motifHardware(1200, 900));
write("materials/sample-box.svg", motifSampleBox(1200, 900));

/* gallery concept studies — varied motifs & palettes */
write("gallery/concept-01.svg", motifLouvers(1400, 1000, true));
write("gallery/concept-02.svg", motifSails(1400, 1000, true));
write("gallery/concept-03.svg", motifCantilever(1400, 1000, true));
write("gallery/concept-04.svg", motifScreen(1400, 1000, true));
write("gallery/concept-05.svg", motifWalkway(1400, 1000, true));
write("gallery/concept-06.svg", motifVilla(1400, 1000, true));
write("gallery/concept-07.svg", motifGate(1400, 1000));
write("gallery/concept-08.svg", motifFacade(1400, 1000, true));

/* brand */
write("public/brand/logo-mark.svg", logoMarkSvg(96));
write("public/brand/logo-horizontal-light.svg", logoHorizontalSvg(420, true));
write("public/brand/logo-horizontal-dark.svg", logoHorizontalSvg(420, false));

/* favicon (Next.js auto-detects src/app/icon.svg) */
write("src/app/icon.svg", faviconSvg());

/* OG image */
write("public/images/og/og-default.png", generateOgImage());

console.log("\nAll assets generated.");
