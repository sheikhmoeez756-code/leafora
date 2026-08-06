/**
 * Re-encodes the repository's images in place, capping dimensions and quality.
 *
 *   node scripts/optimize-images.mjs --dry    report only, change nothing
 *   node scripts/optimize-images.mjs          rewrite anything that shrinks
 *
 * Sources are deliberately larger than any single rendered size: next/image
 * derives its responsive variants from them, so the source has to be at least
 * as wide as the largest variant. It does not need to be 3000px wide.
 *
 * Idempotent — a file already at or under its target is skipped, and nothing is
 * written if re-encoding would make a file bigger.
 */

import sharp from "sharp";
import { readFile, readdir, rm, stat, writeFile } from "fs/promises";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DRY = process.argv.includes("--dry");

/** maxWidth is chosen per role, not globally. */
const TARGETS = [
  {
    dir: "public/plants",
    maxWidth: 1200, // largest card/hero variant is ~640px; 1200 covers 2x
    quality: 78,
    note: "catalogue photography",
  },
  {
    dir: "public/bg",
    maxWidth: 1600,
    quality: 62, // rendered behind blur(12px) — detail is thrown away anyway
    note: "blurred backdrop",
  },
  {
    dir: "docs/screenshots",
    maxWidth: 1000, // README renders these at 260–800px
    quality: 82, // higher than the photos: these contain UI text
    note: "readme screenshots",
  },
];

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png"]);
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

let before = 0;
let after = 0;
let rewritten = 0;

for (const target of TARGETS) {
  const dir = join(ROOT, target.dir);
  let entries;
  try {
    entries = await readdir(dir);
  } catch {
    console.log(`skip ${target.dir} (not found)`);
    continue;
  }

  console.log(`\n${target.dir} — ${target.note}`);

  for (const name of entries) {
    const path = join(dir, name);
    if (!IMAGE_EXT.has(extname(name).toLowerCase())) continue;
    if ((await stat(path)).isDirectory()) continue;

    const originalSize = (await stat(path)).size;
    // Read into memory first: on Windows sharp keeps a handle on the source
    // open, and writing back to the same path then fails with UNKNOWN.
    const input = await readFile(path);
    const meta = await sharp(input).metadata();

    const pipeline = sharp(input).rotate();
    if (meta.width > target.maxWidth) {
      pipeline.resize({ width: target.maxWidth, withoutEnlargement: true });
    }

    // These are all photographs or screenshots of photographs, so JPEG beats
    // PNG comfortably. A .png source becomes a real .jpg file rather than
    // JPEG bytes hiding behind a .png extension — references get updated.
    const buf = await pipeline
      .jpeg({ quality: target.quality, mozjpeg: true, progressive: true })
      .toBuffer();

    const isPng = extname(name).toLowerCase() === ".png";
    const outName = isPng ? name.replace(/\.png$/i, ".jpg") : name;
    const outPath = join(dir, outName);

    before += originalSize;

    if (buf.length >= originalSize) {
      after += originalSize;
      console.log(
        `  = ${name.padEnd(24)} ${kb(originalSize).padStart(8)}  already small enough`
      );
      continue;
    }

    after += buf.length;
    rewritten++;
    const pct = (100 * (1 - buf.length / originalSize)).toFixed(0);
    console.log(
      `  ${DRY ? "·" : "→"} ${name.padEnd(24)} ${kb(originalSize).padStart(8)} → ${kb(
        buf.length
      ).padStart(8)}  (-${pct}%)  ${meta.width}px → ${Math.min(
        meta.width,
        target.maxWidth
      )}px${isPng ? `  [${name} → ${outName}]` : ""}`
    );

    if (!DRY) {
      await writeFile(outPath, buf);
      if (outPath !== path) await rm(path);
    }
  }
}

console.log(
  `\n${DRY ? "would rewrite" : "rewrote"} ${rewritten} file(s): ${kb(before)} → ${kb(
    after
  )} (-${(100 * (1 - after / before)).toFixed(0)}%)`
);
if (DRY) console.log("dry run — nothing was written");
