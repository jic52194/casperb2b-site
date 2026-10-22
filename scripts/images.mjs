// One-time image import: downloads every image the content references from the live site's CDNs (the owner's own
// assets), optimizes it with sharp (WebP, max 1600px wide; SVG copied as-is) into static/img/, and writes
// data/images.json { "<original url>": { "src": "/img/<file>", "w": <width>, "h": <height> } }.
// build.mjs swaps every <img src> through that map, so the built site never hot-links the old CDN.
// Run after changing content: `npm run images` (needs network + sharp). Already-downloaded files are skipped.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import sharp from "sharp";

const ROOT = new URL("../", import.meta.url).pathname;
const OUT = ROOT + "static/img/";
const MAP = ROOT + "data/images.json";
mkdirSync(OUT, { recursive: true });
const pages = JSON.parse(readFileSync(ROOT + "content/pages.json", "utf8"));
const map = existsSync(MAP) ? JSON.parse(readFileSync(MAP, "utf8")) : {};

const urls = new Set(JSON.parse(readFileSync(ROOT + "data/extra-images.json", "utf8")));
for (const p of pages) for (const m of p.html.matchAll(/<(?:img|video)\b[^>]*?\s(?:src|poster)="(https?:[^"]+)"/g)) if (!/\.mp4($|\?)/.test(m[1])) urls.add(m[1].replace(/&amp;/g, "&"));
for (const p of pages) for (const m of p.html.matchAll(/\sposter="(https?:[^"]+)"/g)) urls.add(m[1].replace(/&amp;/g, "&"));

const slug = (u) => {
  const base = decodeURIComponent(u.split("?")[0].split("/").pop()).replace(/\.[a-z0-9]+$/i, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 40);
  return `${base}-${createHash("sha1").update(u).digest("hex").slice(0, 6)}`;
};
let done = 0, failed = 0;
for (const u of urls) {
  if (map[u] && existsSync(ROOT + "static" + map[u].src)) continue;
  try {
    const res = await fetch(u); if (!res.ok) throw new Error("HTTP " + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    const isSvg = /svg/.test(res.headers.get("content-type") || "") || /\.svg($|\?)/i.test(u);
    if (isSvg) {
      const name = slug(u) + ".svg"; writeFileSync(OUT + name, buf);
      const meta = await sharp(buf).metadata().catch(() => ({}));
      map[u] = { src: "/img/" + name, w: meta.width || 0, h: meta.height || 0 };
    } else {
      const name = slug(u) + ".webp";
      const img = sharp(buf, { animated: false }).rotate().resize({ width: 1600, withoutEnlargement: true });
      const { data, info } = await img.webp({ quality: 80 }).toBuffer({ resolveWithObject: true });
      writeFileSync(OUT + name, data);
      map[u] = { src: "/img/" + name, w: info.width, h: info.height };
    }
    done++;
  } catch (e) { failed++; console.warn("image failed", u, e.message); }
}
writeFileSync(MAP, JSON.stringify(map, null, 1));
console.log(`images: ${done} downloaded, ${failed} failed, ${Object.keys(map).length} in map`);
