// Writes the site's app captures into public/app from the raw PNGs of `node scripts/capture.mjs <rawDir>`.
//   node scripts/encode.mjs <rawDir> [only,names]
// Phone (780 x 1688): {name}.webp at quality 82 and {name}-390.webp (390 x 844, quality 80) for small 1x phones.
// Desk (2880 x 1800): {name}.webp at 1600 x 1000, quality 82, for 1x screens, and {name}-2x.webp at full size,
// quality 80 (74 if over 180 KB), for 2x screens. The Get Certified desk frame fades to the app's ivory over its
// main column above the certification cards' availability notes (rows 1270 to 1450 of 1800, from column 496), the
// one edit made to a capture; nothing is drawn or added. `sharp` is a devDependency; `astro build` never runs this.
import sharp from "sharp";
import { existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const [raw, onlyArg] = process.argv.slice(2);
if (!raw) { console.error("usage: node scripts/encode.mjs <rawDir> [only,names]"); process.exit(1); }
const only = onlyArg ? new Set(onlyArg.split(",")) : null;
const dst = join(dirname(dirname(fileURLToPath(import.meta.url))), "public", "app");
const PHONE = ["score-upstream-scored", "score-upstream-scored-2", "score-upstream-result", "score-upstream-result-2", "track-home",
  "leader-blueprint", "os-curriculum", "os-curriculum-2", "get-certified", "os-assessments"];
const DESK = ["desk-score-upstream-scored", "desk-score-upstream-lowest", "desk-track-home", "desk-leader-blueprint", "desk-os-curriculum", "desk-get-certified"];
const FADE = { "desk-get-certified": { x0: 496, y0: 1270, y1: 1450 } };
const IVORY = [242, 236, 224]; /* #f2ece0, the app's page ground */
const kb = (p) => `${(statSync(p).size / 1024).toFixed(1)} KB`;

for (const name of [...PHONE, ...DESK]) {
  if (only && !only.has(name)) continue;
  const src = join(raw, `${name}.png`);
  if (!existsSync(src)) { console.error(`${name}: no ${src}, skipped`); continue; }
  const desk = name.startsWith("desk-");
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const [W, H] = desk ? [2880, 1800] : [780, 1688];
  if (info.width !== W || info.height !== H) { console.error(`${name}: ${info.width} x ${info.height}, expected ${W} x ${H}; skipped`); continue; }
  const f = FADE[name];
  if (f) {
    for (let y = f.y0; y < H; y++) {
      const t = Math.min(1, (y - f.y0) / (f.y1 - f.y0)), a = t * t * (3 - 2 * t);
      for (let x = f.x0; x < W; x++) for (let c = 0; c < 3; c++) { const i = (y * W + x) * 3 + c; data[i] = Math.round(data[i] + (IVORY[c] - data[i]) * a); }
    }
  }
  const img = () => sharp(data, { raw: { width: W, height: H, channels: 3 } });
  if (desk) {
    const one = join(dst, `${name}.webp`), two = join(dst, `${name}-2x.webp`);
    await img().resize(1600, 1000, { kernel: "lanczos3" }).webp({ quality: 82 }).toFile(one);
    await img().webp({ quality: 80 }).toFile(two);
    if (statSync(two).size > 180 * 1024) await img().webp({ quality: 74 }).toFile(two);
    console.log(`${name}.webp ${kb(one)}, ${name}-2x.webp ${kb(two)}`);
  } else {
    const one = join(dst, `${name}.webp`), small = join(dst, `${name}-390.webp`);
    await img().webp({ quality: 82 }).toFile(one);
    await img().resize(390, 844, { kernel: "lanczos3" }).webp({ quality: 80 }).toFile(small);
    console.log(`${name}.webp ${kb(one)}, ${name}-390.webp ${kb(small)}`);
  }
}
