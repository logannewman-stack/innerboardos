// The four 2x desktop captures for the How it works window (IOS_SPEC 1.9).
// Reads the raw 2880 x 1800 PNGs of the capture pass and writes
// public/app/desk-<name>-2x.webp at quality 80, each at most 180 KB (quality
// 74 if over). Before writing one, the raw is downsized to 1600 and compared
// with the shipped 1600 file (mean absolute pixel difference under 3 on the
// 0 to 255 scale); a raw that does not match is skipped and that frame ships
// without `x2`. Run once by hand:
//   npm run desk2x [sourceDir]
// The source directory defaults to the capture scratchpad and is only read;
// the outputs are committed and `astro build` never runs this. `sharp` is a
// devDependency only.
import sharp from "sharp";
import { statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const srcDir = process.argv[2] || "/tmp/claude-0/-home-user/a157628b-2577-5461-b68b-7ff8d5b4dbd2/scratchpad/appdemo2";
const pairs = [
  ["desktop-score-upstream-scored.png", "desk-score-upstream-scored"],
  ["desktop-score-upstream-result-3.png", "desk-score-upstream-lowest"],
  ["desktop-track-home.png", "desk-track-home"],
  ["desktop-leader-blueprint-filled.png", "desk-leader-blueprint"]
];
const limit = 180 * 1024;
const tolerance = 3;
let skipped = 0;

for (const [from, to] of pairs) {
  const input = join(srcDir, from);
  const shipped = join(root, "public", "app", `${to}.webp`);
  const output = join(root, "public", "app", `${to}-2x.webp`);
  if (!existsSync(input)) { console.error(`${to}: missing ${input}; ships without x2`); skipped++; continue; }
  if (!existsSync(shipped)) { console.error(`${to}: missing ${shipped}; ships without x2`); skipped++; continue; }
  const meta = await sharp(input).metadata();
  if (meta.width !== 2880 || meta.height !== 1800) { console.error(`${to}: ${from} is ${meta.width} x ${meta.height}, expected 2880 x 1800; ships without x2`); skipped++; continue; }
  const a = await sharp(input).resize(1600, 1000, { kernel: "lanczos3" }).removeAlpha().raw().toBuffer();
  const b = await sharp(shipped).resize(1600, 1000).removeAlpha().raw().toBuffer();
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += Math.abs(a[i] - b[i]);
  const mad = sum / a.length;
  if (!(mad < tolerance)) { console.error(`${to}: ${from} does not match the shipped 1600 file (mean difference ${mad.toFixed(2)}); ships without x2`); skipped++; continue; }
  let quality = 80;
  await sharp(input).webp({ quality }).toFile(output);
  if (statSync(output).size > limit) { quality = 74; await sharp(input).webp({ quality }).toFile(output); }
  console.log(`${to}-2x.webp ${(statSync(output).size / 1024).toFixed(1)} KB at quality ${quality} (mean difference ${mad.toFixed(2)})`);
}
if (skipped) { console.error(`${skipped} frame(s) ship without x2`); process.exit(1); }
