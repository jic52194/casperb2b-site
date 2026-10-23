// One-time: shrink oversized images in static/img to at most 900px wide (WebP, quality 80) and update data/images.json.
// Content images are shown at ≤ 760px (cards ~400px), so 900px stays sharp on high-density screens. Run: node scripts/resize-images.mjs
import { readFileSync, writeFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
const ROOT = fileURLToPath(new URL("../", import.meta.url));
const I = JSON.parse(readFileSync(ROOT + "data/images.json", "utf8"));
const KEEP = ["og-image-"]; // social card keeps 1200+ px
const MAX = 900; let saved = 0, n = 0;
const done = new Map();
for (const [k, v] of Object.entries(I)) {
  if (v.w <= MAX || KEEP.some((x) => v.src.includes(x))) continue;
  if (done.has(v.src)) { Object.assign(v, done.get(v.src)); continue; }
  const file = ROOT + "static" + v.src, before = statSync(file).size;
  const isSvg = v.src.endsWith(".svg");
  const outSrc = isSvg ? v.src.replace(/\.svg$/, ".webp") : v.src;
  const buf = await sharp(readFileSync(file), { density: isSvg ? 144 : undefined }).resize({ width: MAX, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
  const meta = await sharp(buf).metadata();
  writeFileSync(ROOT + "static" + outSrc, buf);
  const upd = { src: outSrc, w: meta.width, h: meta.height };
  done.set(v.src, upd); Object.assign(v, upd);
  saved += before - buf.length; n++;
  console.log(`${v.src}  ${Math.round(before / 1024)}KB → ${Math.round(buf.length / 1024)}KB (${meta.width}×${meta.height})`);
}
writeFileSync(ROOT + "data/images.json", JSON.stringify(I, null, 1) + "\n");
console.log(`resized ${n} images, saved ${Math.round(saved / 1024)}KB`);
