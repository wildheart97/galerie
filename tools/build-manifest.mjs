// Génère manifest.json à partir du contenu du dossier images/.
import { readdirSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL("..", import.meta.url));
const root = join(here, "images");
const IMG_RE = /\.(png|jpe?g|gif|webp|avif|svg)$/i;

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".")) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (IMG_RE.test(e.name)) out.push(relative(root, p).split(sep).join("/").normalize("NFC"));
  }
  return out;
}

const collator = new Intl.Collator("fr", { numeric: true, sensitivity: "base" });
const files = walk(root).sort(collator.compare);
writeFileSync(join(here, "manifest.json"), JSON.stringify({ generated: new Date().toISOString(), files }, null, 2) + "\n");
console.log(`manifest.json : ${files.length} images`);
