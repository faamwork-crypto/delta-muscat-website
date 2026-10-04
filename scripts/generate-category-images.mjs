/**
 * Category illustration generator (Phase 1).
 *
 * Generates one brand-consistent SVG illustration per product subcategory
 * (and per main category) into /public/images/categories/. These are honest
 * placeholder illustrations — NOT photography — and are drop-in replaceable
 * by real photos with the same filename (minus extension).
 *
 * Run: node scripts/generate-category-images.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, "public", "images", "categories");

const C = {
  paper: "#F7F4EE",
  panel: "#FBFAF6",
  sand: "#E5DCCB",
  sandDeep: "#D9CDB6",
  green: "#123C2E",
  greenDeep: "#0C2A20",
  greenSoft: "#1B4A3A",
  bronze: "#A87C4F",
  bronzeSoft: "#C9A876",
  steel: "#6F6E68",
  ink: "#1C1B18",
};

/* Line-art motifs, drawn in a 1600x1000 canvas, centred around (800, 480).
   Stroke-only architectural sketches in bronze over a paper panel. */
const S = `stroke="${C.bronze}" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
const SG = `stroke="${C.green}" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"`;

const MOTIFS = {
  door: `<rect x="640" y="180" width="320" height="520" rx="6" ${S}/>
    <rect x="688" y="228" width="224" height="180" rx="4" ${S} opacity="0.55"/>
    <rect x="688" y="448" width="224" height="200" rx="4" ${S} opacity="0.55"/>
    <circle cx="905" cy="440" r="12" fill="${C.bronze}"/>`,
  window: `<rect x="580" y="240" width="440" height="380" rx="6" ${S}/>
    <line x1="800" y1="240" x2="800" y2="620" ${S}/>
    <line x1="580" y1="430" x2="1020" y2="430" ${S}/>
    <line x1="540" y1="240" x2="540" y2="620" ${SG}/>`,
  slider: `<rect x="480" y="230" width="330" height="440" rx="6" ${S}/>
    <rect x="790" y="230" width="330" height="440" rx="6" ${S} opacity="0.6"/>
    <path d="M700 450 h120 m0 0 l-36 -28 m36 28 l-36 28" ${SG}/>
    <path d="M900 450 h-120 m0 0 l36 -28 m-36 28 l36 28" ${SG}/>`,
  pergola: `<line x1="500" y1="240" x2="500" y2="700" ${S}/>
    <line x1="1100" y1="240" x2="1100" y2="700" ${S}/>
    <line x1="440" y1="240" x2="1160" y2="240" ${S}/>
    ${[510, 590, 670, 750, 830, 910, 990, 1070]
      .map((x) => `<line x1="${x}" y1="240" x2="${x - 40}" y2="310" ${SG}/>`).join("\n    ")}
    <line x1="440" y1="700" x2="1160" y2="700" ${S} opacity="0.4"/>`,
  carport: `<path d="M470 330 L800 230 L1130 330" ${S}/>
    <line x1="500" y1="322" x2="500" y2="700" ${S}/>
    <line x1="1100" y1="322" x2="1100" y2="700" ${S}/>
    <path d="M640 700 v-70 h60 l40 -60 h140 l40 60 h60 v70" ${SG}/>
    <circle cx="700" cy="700" r="26" ${SG}/><circle cx="920" cy="700" r="26" ${SG}/>`,
  awning: `<path d="M470 320 Q800 210 1130 320 L1130 400 Q800 300 470 400 Z" ${S}/>
    ${[510, 610, 710, 810, 910, 1010, 1110]
      .map((x) => `<line x1="${x}" y1="365" x2="${x}" y2="398" ${SG}/>`).join("\n    ")}
    <line x1="520" y1="400" x2="520" y2="700" ${S} opacity="0.5"/>
    <line x1="1080" y1="400" x2="1080" y2="700" ${S} opacity="0.5"/>`,
  pool: `<path d="M450 330 Q800 220 1150 330" ${S}/>
    <line x1="520" y1="326" x2="520" y2="560" ${S}/>
    <line x1="1080" y1="326" x2="1080" y2="560" ${S}/>
    ${[640, 740, 840, 940].map((x, i) => `<path d="M${x - 40} ${640 + (i % 2) * 16} q40 -28 80 0" ${SG}/>`).join("\n    ")}
    <line x1="470" y1="700" x2="1130" y2="700" ${S} opacity="0.4"/>`,
  railing: `<line x1="480" y1="260" x2="1120" y2="260" ${S}/>
    <line x1="480" y1="380" x2="1120" y2="380" ${S} opacity="0.55"/>
    ${[500, 580, 660, 740, 820, 900, 980, 1060].map((x) => `<line x1="${x}" y1="260" x2="${x}" y2="620" ${SG}/>`).join("\n    ")}
    <line x1="450" y1="620" x2="1150" y2="620" ${S}/>`,
  stair: `<path d="M470 660 h120 v-90 h120 v-90 h120 v-90 h120 v-90 h180" ${S}/>
    <line x1="470" y1="700" x2="1130" y2="700" ${S} opacity="0.4"/>
    <line x1="590" y1="570" x2="590" y2="440" ${SG} opacity="0.6"/>
    <line x1="950" y1="390" x2="1080" y2="390" ${SG} opacity="0.6"/>`,
  gate: `<line x1="800" y1="200" x2="800" y2="700" ${SG}/>
    ${[0, 1].map((s) => `<rect x="${440 + s * 370}" y="220" width="350" height="440" rx="6" ${S}/>
    ${[0, 1, 2, 3].map((i) => `<line x1="${480 + s * 370 + i * 90}" y1="240" x2="${480 + s * 370 + i * 90}" y2="640" ${S} opacity="0.5"/>`).join("")}`).join("\n    ")}
    <circle cx="770" cy="430" r="12" fill="${C.bronze}"/><circle cx="830" cy="430" r="12" fill="${C.bronze}"/>`,
  shield: `<path d="M800 190 L1070 260 V470 Q1070 620 800 710 Q530 620 530 470 V260 Z" ${S}/>
    <path d="M660 450 l90 90 l190 -200" ${SG}/>`,
  mesh: `<rect x="540" y="230" width="520" height="450" rx="6" ${S}/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="${600 + i * 80}" y1="230" x2="${600 + i * 80}" y2="680" ${SG} opacity="0.4"/>`).join("\n    ")}
    ${[0, 1, 2, 3, 4].map((i) => `<line x1="540" y1="${300 + i * 80}" x2="1060" y2="${300 + i * 80}" ${SG} opacity="0.4"/>`).join("\n    ")}`,
  skylight: `<path d="M500 620 L800 220 L1100 620" ${S}/>
    <path d="M610 480 h380 v140 h-380 Z" ${S}/>
    <line x1="800" y1="480" x2="800" y2="620" ${S} opacity="0.5"/>
    <path d="M700 700 h200 m-240 40 h280" ${SG} opacity="0.5"/>`,
  cladding: `${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="480" y="${230 + i * 80}" width="640" height="62" rx="4" ${S} opacity="${i % 2 ? 0.55 : 1}"/>`).join("\n    ")}
    <line x1="1180" y1="230" x2="1180" y2="700" ${SG}/>`,
  mashrabiya: `<rect x="540" y="230" width="520" height="450" rx="6" ${S}/>
    ${[0, 1, 2].map((r) => [0, 1, 2].map((cX) => `<rect x="${600 + cX * 140}" y="${290 + r * 120}" width="90" height="90" rx="14" transform="rotate(45 ${645 + cX * 140} ${335 + r * 120})" ${SG}/>`).join("")).join("\n    ")}`,
  arch: `<path d="M540 700 V420 Q540 250 800 250 Q1060 250 1060 420 V700" ${S}/>
    <path d="M620 700 V440 Q620 330 800 330 Q980 330 980 440 V700" ${SG} opacity="0.6"/>
    <line x1="470" y1="700" x2="1130" y2="700" ${S} opacity="0.4"/>`,
  cabinet: `<rect x="560" y="200" width="480" height="500" rx="6" ${S}/>
    <line x1="800" y1="200" x2="800" y2="700" ${S}/>
    ${[0, 1].map((s) => `<line x1="${680 + s * 240}" y1="380" x2="${680 + s * 240}" y2="700" ${SG} opacity="0.5"/>`).join("\n    ")}
    <line x1="560" y1="380" x2="1040" y2="380" ${S}/>`,
  partition: `<rect x="500" y="220" width="280" height="480" rx="6" ${S}/>
    <rect x="780" y="220" width="280" height="480" rx="6" ${S} opacity="0.5"/>
    <rect x="1060" y="220" width="120" height="480" rx="6" ${S} opacity="0.8"/>
    <line x1="640" y1="220" x2="640" y2="700" ${SG} opacity="0.4"/>
    <line x1="920" y1="220" x2="920" y2="700" ${SG} opacity="0.4"/>`,
  shopfront: `<path d="M470 330 Q800 230 1130 330 L1130 410 Q800 320 470 410 Z" ${S}/>
    <rect x="540" y="410" width="520" height="290" rx="6" ${S}/>
    <line x1="800" y1="410" x2="800" y2="700" ${SG} opacity="0.5"/>
    <rect x="600" y="470" width="120" height="120" rx="4" ${SG} opacity="0.5"/>
    <rect x="880" y="470" width="120" height="120" rx="4" ${SG} opacity="0.5"/>`,
  curtainwall: `${[0, 1, 2, 3].map((cX) => [0, 1, 2, 3].map((r) => `<rect x="${470 + cX * 170}" y="${210 + r * 130}" width="160" height="120" rx="4" ${S} opacity="${(cX + r) % 2 ? 0.5 : 1}"/>`).join("")).join("\n    ")}
    <line x1="450" y1="700" x2="1150" y2="700" ${SG} opacity="0.5"/>`,
  fins: `${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${520 + i * 100} 220 q30 120 0 240" ${SG} opacity="${i % 2 ? 0.6 : 1}"/>`).join("\n    ")}
    <line x1="480" y1="220" x2="480" y2="460" ${S}/>
    <path d="M460 700 q340 -80 680 0" ${S} opacity="0.4"/>`,
  canopy: `<path d="M470 320 L800 240 L1130 320" ${S}/>
    <line x1="540" y1="305" x2="540" y2="700" ${S}/>
    <line x1="1060" y1="305" x2="1060" y2="700" ${S}/>
    <line x1="470" y1="700" x2="1130" y2="700" ${SG} opacity="0.4"/>
    <line x1="470" y1="380" x2="1130" y2="380" ${S} opacity="0.5"/>`,
  walkway: `<path d="M480 260 L700 330 V700 H480 Z" ${S}/>
    <path d="M1120 260 L900 330 V700 H1120 Z" ${S}/>
    <path d="M700 330 L900 260" ${S} opacity="0.7"/>
    ${[0, 1, 2].map((i) => `<line x1="${730 + i * 60}" y1="${345 + i * 18}" x2="${730 + i * 60}" y2="700" ${SG} opacity="0.35"/>`).join("\n    ")}`,
  parking: `${[0, 1, 2].map((i) => `<path d="M${470 + i * 240} 320 L${590 + i * 240} 260 L${710 + i * 240} 320" ${S}/>
    <line x1="${500 + i * 240}" y1="312" x2="${500 + i * 240}" y2="660" ${S}/>
    <line x1="${680 + i * 240}" y1="312" x2="${680 + i * 240}" y2="660" ${S}/>`).join("\n    ")}
    <line x1="440" y1="660" x2="1160" y2="660" ${SG} opacity="0.5"/>`,
  umbrella: `<path d="M800 220 Q560 300 520 420 Q660 380 680 420 Q720 370 760 420 Q800 365 840 420 Q880 370 920 420 Q940 380 1080 420 Q1040 300 800 220 Z" ${S}/>
    <line x1="800" y1="300" x2="800" y2="640" ${S}/>
    <path d="M620 700 h360 m-300 0 l30 -60 h180 l30 60" ${SG} opacity="0.7"/>`,
  restaurant: `<path d="M520 320 Q800 220 1080 320 L1040 400 Q800 310 560 400 Z" ${S}/>
    <line x1="800" y1="290" x2="800" y2="620" ${S}/>
    <path d="M660 620 h280 m-200 0 v80 m120 -80 v80" ${SG}/>
    <path d="M600 700 h400" ${SG} opacity="0.5"/>`,
  sails: `<path d="M480 240 Q700 300 820 260 L560 560 Q500 400 480 240 Z" ${S}/>
    <path d="M1120 300 Q980 340 880 320 L1060 600 Q1120 460 1120 300 Z" ${S} opacity="0.7"/>
    <line x1="560" y1="560" x2="560" y2="700" ${SG}/>
    <line x1="1060" y1="600" x2="1060" y2="700" ${SG}/>
    <line x1="450" y1="700" x2="1150" y2="700" ${S} opacity="0.4"/>`,
  shed: `<path d="M470 640 V420 Q470 300 600 300 H1000 Q1130 300 1130 420 V640" ${S}/>
    <rect x="560" y="470" width="200" height="170" rx="4" ${SG} opacity="0.6"/>
    <rect x="850" y="470" width="180" height="170" rx="4" ${SG} opacity="0.6"/>
    <line x1="440" y1="640" x2="1160" y2="640" ${S}/>`,
  factory: `<path d="M470 660 V420 l130 -80 v80 l130 -80 v80 l130 -80 v80 h90 v240" ${S}/>
    <rect x="540" y="520" width="140" height="140" rx="4" ${SG} opacity="0.6"/>
    <rect x="760" y="520" width="140" height="140" rx="4" ${SG} opacity="0.6"/>
    <line x1="440" y1="660" x2="1160" y2="660" ${S}/>`,
  exhibition: `${[0, 1, 2].map((i) => `<path d="M${560 + i * 200} 250 v360" ${S}/>
    <path d="M${560 + i * 200} 250 q90 40 150 20 v130 q-80 20 -150 -20 Z" ${SG} opacity="${i % 2 ? 0.6 : 1}"/>`).join("\n    ")}
    <line x1="480" y1="660" x2="1120" y2="660" ${S} opacity="0.4"/>`,
  mosque: `<path d="M620 700 V480 Q620 380 800 320 Q980 380 980 480 V700" ${S}/>
    <path d="M800 320 v-80 m0 0 q26 20 0 44 q-26 -24 0 -44" ${SG}/>
    <rect x="760" y="540" width="80" height="160" rx="40" ${SG} opacity="0.6"/>
    <line x1="560" y1="700" x2="1040" y2="700" ${S} opacity="0.4"/>`,
  bridge: `<path d="M440 420 Q800 260 1160 420" ${S}/>
    <path d="M440 480 Q800 330 1160 480" ${S} opacity="0.55"/>
    ${[560, 680, 800, 920, 1040].map((x) => `<line x1="${x}" y1="432" x2="${x}" y2="480" ${SG}/>`).join("\n    ")}
    <path d="M470 480 h660 v40 h-660 Z" ${S} opacity="0.7"/>
    <path d="M520 700 q140 -60 280 0 q140 -60 280 0" ${SG} opacity="0.4"/>`,
  park: `<circle cx="620" cy="330" r="90" ${S}/>
    <line x1="620" y1="420" x2="620" y2="560" ${SG}/>
    <path d="M760 700 v-120 h280 v120" ${S}/>
    <line x1="760" y1="620" x2="1040" y2="620" ${SG} opacity="0.6"/>
    <line x1="740" y1="700" x2="740" y2="580" ${SG}/>
    <line x1="1060" y1="700" x2="1060" y2="580" ${SG}/>
    <line x1="480" y1="700" x2="1130" y2="700" ${S} opacity="0.4"/>`,
  swing: `<path d="M520 280 L800 220 L1080 280" ${S}/>
    <line x1="560" y1="272" x2="560" y2="700" ${S}/>
    <line x1="1040" y1="272" x2="1040" y2="700" ${S}/>
    ${[0, 1].map((i) => `<line x1="${700 + i * 140}" y1="250" x2="${700 + i * 140}" y2="520" ${SG} opacity="0.7"/>`).join("\n    ")}
    <line x1="700" y1="520" x2="840" y2="520" ${SG}/>
    <line x1="480" y1="700" x2="1130" y2="700" ${S} opacity="0.4"/>`,
  pavilion: `<path d="M800 220 L1080 360 H520 Z" ${S}/>
    <line x1="560" y1="360" x2="560" y2="680" ${S}/>
    <line x1="1040" y1="360" x2="1040" y2="680" ${S}/>
    <path d="M660 680 v-140 a60 60 0 0 1 120 0 v140" ${SG} opacity="0.6"/>
    <line x1="480" y1="680" x2="1120" y2="680" ${SG} opacity="0.4"/>`,
  booth: `<rect x="620" y="300" width="360" height="400" rx="6" ${S}/>
    <path d="M580 300 L800 220 L1020 300" ${S}/>
    <rect x="700" y="380" width="200" height="130" rx="4" ${SG} opacity="0.7"/>
    <line x1="700" y1="570" x2="900" y2="570" ${SG} opacity="0.5"/>`,
  bike: `<path d="M470 330 L800 240 L1130 330" ${S}/>
    <line x1="540" y1="322" x2="540" y2="700" ${S}/>
    <line x1="1060" y1="322" x2="1060" y2="700" ${S}/>
    <circle cx="680" cy="620" r="70" ${SG}/>
    <circle cx="920" cy="620" r="70" ${SG}/>
    <path d="M680 620 l90 -110 h80 l70 110 m-240 0 h70 l30 -60 h80" ${SG}/>
    <line x1="470" y1="700" x2="1130" y2="700" ${S} opacity="0.4"/>`,
  tank: `<rect x="620" y="280" width="360" height="220" rx="18" ${S}/>
    <line x1="660" y1="500" x2="660" y2="700" ${SG}/>
    <line x1="940" y1="500" x2="940" y2="700" ${SG}/>
    <path d="M700 340 q100 -40 200 0" ${SG} opacity="0.5"/>
    <line x1="480" y1="700" x2="1120" y2="700" ${S} opacity="0.4"/>`,
  billboard: `<rect x="520" y="230" width="560" height="280" rx="8" ${S}/>
    <line x1="660" y1="510" x2="660" y2="700" ${SG}/>
    <line x1="940" y1="510" x2="940" y2="700" ${SG}/>
    <path d="M580 320 h320 m-320 80 h200" ${SG} opacity="0.5"/>
    <line x1="480" y1="700" x2="1120" y2="700" ${S} opacity="0.4"/>`,
  barrier: `<rect x="620" y="420" width="180" height="280" rx="6" ${S}/>
    <path d="M800 460 L1080 420" ${SG}/>
    ${[0, 1, 2, 3].map((i) => `<line x1="${850 + i * 55}" y1="450" x2="${868 + i * 55}" y2="422" ${SG}/>`).join("\n    ")}
    <rect x="660" y="480" width="100" height="90" rx="4" ${SG} opacity="0.5"/>`,
  market: `${[0, 1, 2].map((i) => `<path d="M${460 + i * 260} 340 q90 -70 200 -20 l-16 60 q-84 -40 -168 20 Z" ${S}/>
    <line x1="${560 + i * 260}" y1="400" x2="${560 + i * 260}" y2="680" ${SG} opacity="0.6"/>`).join("\n    ")}
    <line x1="440" y1="680" x2="1160" y2="680" ${S} opacity="0.4"/>`,
  obelisk: `<path d="M760 700 L780 260 L800 220 L820 260 L840 700 Z" ${S}/>
    <path d="M680 700 q120 -50 240 0" ${SG} opacity="0.5"/>
    <circle cx="1060" cy="300" r="40" ${SG} opacity="0.5"/>
    <line x1="480" y1="700" x2="1130" y2="700" ${S} opacity="0.4"/>`,
  tensile: `<line x1="560" y1="240" x2="560" y2="700" ${S}/>
    <line x1="1040" y1="320" x2="1040" y2="700" ${S}/>
    <path d="M560 240 Q700 420 1040 320" ${S}/>
    <path d="M560 240 Q760 380 1040 320" ${S} opacity="0.5"/>
    <line x1="480" y1="700" x2="1130" y2="700" ${SG} opacity="0.4"/>`,
  court: `<path d="M470 300 L800 220 L1130 300" ${S}/>
    <line x1="540" y1="290" x2="540" y2="700" ${S}/>
    <line x1="1060" y1="290" x2="1060" y2="700" ${S}/>
    <line x1="800" y1="250" x2="800" y2="560" ${SG}/>
    <path d="M720 560 h160 v-60 h-160 Z" ${SG} opacity="0.6"/>
    <line x1="480" y1="700" x2="1130" y2="700" ${S} opacity="0.4"/>`,
  metro: `<rect x="520" y="360" width="460" height="240" rx="24" ${S}/>
    <rect x="570" y="410" width="150" height="110" rx="8" ${SG} opacity="0.6"/>
    <rect x="780" y="410" width="150" height="110" rx="8" ${SG} opacity="0.6"/>
    <path d="M470 300 L800 220 L1130 300" ${S} opacity="0.8"/>
    <circle cx="620" cy="650" r="26" ${SG}/><circle cx="880" cy="650" r="26" ${SG}/>
    <line x1="460" y1="700" x2="1140" y2="700" ${S} opacity="0.4"/>`,
  bus: `<rect x="560" y="330" width="420" height="280" rx="20" ${S}/>
    <rect x="610" y="380" width="140" height="110" rx="8" ${SG} opacity="0.6"/>
    <rect x="790" y="380" width="140" height="110" rx="8" ${SG} opacity="0.6"/>
    <path d="M470 300 L800 230 L1130 300" ${S} opacity="0.8"/>
    <circle cx="660" cy="650" r="26" ${SG}/><circle cx="890" cy="650" r="26" ${SG}/>
    <line x1="460" y1="700" x2="1140" y2="700" ${S} opacity="0.4"/>`,
  columns: `<path d="M540 300 h520" ${S}/>
    ${[0, 1, 2, 3].map((i) => `<line x1="${600 + i * 140}" y1="300" x2="${600 + i * 140}" y2="640" ${S}/>`).join("\n    ")}
    <line x1="540" y1="640" x2="1060" y2="640" ${S}/>
    <line x1="500" y1="700" x2="1100" y2="700" ${SG} opacity="0.4"/>`,
  stage: `<path d="M500 300 Q800 200 1100 300" ${S}/>
    <path d="M560 300 Q800 230 1040 300" ${S} opacity="0.5"/>
    <line x1="520" y1="295" x2="520" y2="700" ${S}/>
    <line x1="1080" y1="295" x2="1080" y2="700" ${S}/>
    ${[0, 1, 2].map((i) => `<path d="M${600 + i * 100} 700 a30 30 0 0 1 60 0" ${SG} opacity="0.6"/>`).join("\n    ")}
    <line x1="480" y1="700" x2="1130" y2="700" ${SG} opacity="0.4"/>`,
};

/* slug → motif. Motifs are reused across related subcategories — these are
   illustrative placeholders, one consistent visual language per family. */
const SUB_MOTIFS = {
  // Residential
  "doors-windows": "door",
  "sliding-folding-doors": "slider",
  pergolas: "pergola",
  carports: "carport",
  "terrace-awnings": "awning",
  "swimming-pool-shades": "pool",
  "balconies-railings": "railing",
  staircases: "stair",
  "gates-fences": "gate",
  "security-screens": "shield",
  "mosquito-screens": "mesh",
  skylights: "skylight",
  "facade-cladding": "cladding",
  "mashrabiya-screens": "mashrabiya",
  "garden-structures": "arch",
  "rooftop-terraces": "pergola",
  "outdoor-kitchens": "pergola",
  "wardrobe-cabinets": "cabinet",
  "room-partitions": "partition",
  // Commercial
  shopfronts: "shopfront",
  "curtain-walls": "curtainwall",
  "glass-facades": "curtainwall",
  "aluminium-cladding": "cladding",
  "brise-soleil": "fins",
  "office-partitions": "partition",
  "entrance-canopies": "canopy",
  "drop-off-canopies": "canopy",
  "walkway-covers": "walkway",
  "parking-canopies": "parking",
  "restaurant-terraces": "restaurant",
  "hotel-poolside": "pool",
  "resort-shade": "sails",
  "mall-kiosks": "booth",
  "showroom-structures": "shopfront",
  "warehouse-sheds": "shed",
  "industrial-sheds": "factory",
  "factory-canopies": "factory",
  "loading-bay-covers": "canopy",
  "exhibition-structures": "exhibition",
  "stadium-stands": "stage",
  "school-canopies": "canopy",
  "university-structures": "walkway",
  "hospital-walkways": "walkway",
  "mosque-shade": "mosque",
  "bank-facades": "columns",
  "rooftop-amenity": "pergola",
  "gym-covers": "shed",
  "signage-structures": "billboard",
  // Urban Structures
  "bus-shelters": "bus",
  "pedestrian-bridges": "bridge",
  "shade-sails": "sails",
  "park-shelters": "park",
  "playground-shades": "swing",
  "sports-court-covers": "court",
  "amphitheatre-covers": "stage",
  "street-furniture": "park",
  "public-plaza-canopies": "canopy",
  "metro-station-canopies": "metro",
  "taxi-waiting-shelters": "carport",
  "prayer-shelters": "mosque",
  kiosks: "booth",
  "ticket-booths": "booth",
  "guard-cabins": "booth",
  "information-booths": "booth",
  "public-amenities": "booth",
  "bicycle-shelters": "bike",
  "motorcycle-shelters": "bike",
  "waste-enclosures": "gate",
  "water-tank-structures": "tank",
  "billboard-frames": "billboard",
  "tensile-structures": "tensile",
  gazebos: "pavilion",
  "monument-structures": "obelisk",
  "event-structures": "exhibition",
  "market-shades": "market",
  "beach-structures": "umbrella",
  "checkpoint-canopies": "barrier",
};

const CATEGORY_MOTIFS = {
  residential: "pergola",
  commercial: "curtainwall",
  "urban-structures": "sails",
};

function svgDocument(motif, accent = C.green) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" role="img">
<defs>
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/>
    <feColorMatrix in="n" type="saturate" values="0"/>
  </filter>
  <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
    <path d="M80 0 H0 V80" fill="none" stroke="${C.sand}" stroke-width="1.5" opacity="0.55"/>
  </pattern>
</defs>
<rect width="1600" height="1000" fill="${C.paper}"/>
<rect width="1600" height="1000" fill="url(#grid)" opacity="0.5"/>
<rect x="96" y="76" width="1408" height="848" fill="${C.panel}"/>
<rect x="96" y="76" width="1408" height="848" fill="none" stroke="${C.sandDeep}" stroke-width="3"/>
<rect x="120" y="100" width="1360" height="800" fill="none" stroke="${accent}" stroke-width="3" opacity="0.35"/>
<g opacity="0.5" transform="translate(0,20)" stroke="${accent}" stroke-width="2.5" fill="none">
  <path d="M120 900 L1480 120" opacity="0.18"/>
  <path d="M120 940 L1480 160" opacity="0.12"/>
</g>
<g transform="translate(0,10)">${motif}</g>
<rect x="96" y="76" width="1408" height="848" filter="url(#grain)" opacity="0.05"/>
<rect x="96" y="880" width="1408" height="8" fill="${accent}" opacity="0.85"/>
</svg>`;
}

mkdirSync(OUT, { recursive: true });

let count = 0;
for (const [slug, motifName] of Object.entries({ ...SUB_MOTIFS, ...CATEGORY_MOTIFS })) {
  const motif = MOTIFS[motifName];
  if (!motif) throw new Error(`Unknown motif "${motifName}" for ${slug}`);
  writeFileSync(path.join(OUT, `${slug}.svg`), svgDocument(motif));
  count++;
}
console.log(`Generated ${count} category illustrations in public/images/categories/`);
