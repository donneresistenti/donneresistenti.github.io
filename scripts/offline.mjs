// Prepara una copia di dist/ apribile con doppio click su index.html (protocollo file://).
// Astro genera percorsi assoluti (/_astro/…, /storie/…/) che da file:// puntano alla radice del disco:
// qui li riscriviamo in percorsi relativi e aggiungiamo index.html ai link alle cartelle.
import { cp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const src = 'dist';
const out = 'dist-offline';

await rm(out, { recursive: true, force: true });
await cp(src, out, { recursive: true });

/** Riscrive un URL assoluto del sito (`/…`) in un percorso relativo alla cartella `fromDir`. */
function relativize(url, fromDir) {
  if (!url.startsWith('/') || url.startsWith('//')) return url;
  const [, target, suffix = ''] = url.match(/^([^?#]*)(.*)$/);
  const file = target.endsWith('/') ? `${target}index.html` : target;
  const rel = path.posix.relative(fromDir, file.slice(1));
  return rel + suffix;
}

const rewriteCss = (text, fromDir) =>
  text.replace(/url\((["']?)(\/[^)"']*)\1\)/g, (_, q, url) => `url(${q}${relativize(url, fromDir)}${q})`);

function rewriteHtml(text, fromDir) {
  const attrs = text.replace(/\b(href|src|srcset|poster)="([^"]*)"/g, (_, name, value) => {
    // srcset: elenco "url larghezza, url larghezza"
    const next =
      name === 'srcset'
        ? value.replace(/(^|,\s*)(\S+)/g, (_, sep, url) => sep + relativize(url, fromDir))
        : relativize(value, fromDir);
    return `${name}="${next}"`;
  });
  return rewriteCss(attrs, fromDir);
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let count = 0;
for await (const file of walk(out)) {
  const ext = path.extname(file);
  if (ext !== '.html' && ext !== '.css') continue;
  const fromDir = path.posix.dirname(path.relative(out, file).split(path.sep).join('/'));
  const text = await readFile(file, 'utf8');
  await writeFile(file, ext === '.html' ? rewriteHtml(text, fromDir) : rewriteCss(text, fromDir));
  count++;
}

console.log(`Versione offline pronta in ${out}/ (${count} file riscritti): apri ${out}/index.html`);
