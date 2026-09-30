import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const checked = new Set();

function fail(message) {
  errors.push(message);
}

function cleanRef(ref) {
  if (!ref) return null;
  const trimmed = ref.trim();
  if (!trimmed) return null;
  if (/^(?:https?:|data:|mailto:|tel:|javascript:|#)/i.test(trimmed)) return null;
  return trimmed.split('#')[0].split('?')[0];
}

function checkFile(ref, source) {
  const clean = cleanRef(ref);
  if (!clean) return;

  const normalized = clean.startsWith('/') ? clean.slice(1) : clean;
  const full = path.resolve(root, normalized);

  if (!full.startsWith(root + path.sep) && full !== root) {
    fail(`${source}: path escapes repository root: ${ref}`);
    return;
  }

  const key = `${source}:${normalized}`;
  if (checked.has(key)) return;
  checked.add(key);

  if (!fs.existsSync(full)) {
    fail(`${source}: missing referenced file: ${normalized}`);
    return;
  }

  if (!fs.statSync(full).isFile()) {
    fail(`${source}: referenced path is not a file: ${normalized}`);
  }
}

function pngDimensions(file) {
  const buf = fs.readFileSync(file);
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (buf.length < 24 || !buf.subarray(0, 8).equals(signature)) {
    return null;
  }
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

function extractHtmlRefs(html) {
  const refs = [];
  const re = /\b(?:src|href)\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/gi;
  let match;
  while ((match = re.exec(html))) refs.push(match[1] || match[2] || match[3]);
  return refs;
}

function extractStaticAssetRefs(text) {
  const refs = [];
  const re = /["'`](assets\/[A-Za-z0-9_./%+@()\-]+(?:\?[A-Za-z0-9_=&.%-]+)?)["'`]/g;
  let match;
  while ((match = re.exec(text))) refs.push(match[1]);
  return refs;
}

const indexPath = path.join(root, 'index.html');
if (!fs.existsSync(indexPath)) {
  fail('Missing index.html');
} else {
  const html = fs.readFileSync(indexPath, 'utf8');
  for (const ref of extractHtmlRefs(html)) checkFile(ref, 'index.html');

  const appleMatch = html.match(/<link\b[^>]*rel=["']apple-touch-icon["'][^>]*>/i);
  if (!appleMatch) {
    fail('index.html: missing apple-touch-icon link');
  } else {
    const href = appleMatch[0].match(/href=["']([^"']+)["']/i)?.[1];
    const sizes = appleMatch[0].match(/sizes=["']([^"']+)["']/i)?.[1];
    const clean = cleanRef(href);

    if (!clean) {
      fail('index.html: apple-touch-icon has no local href');
    } else {
      const full = path.resolve(root, clean.startsWith('/') ? clean.slice(1) : clean);
      if (fs.existsSync(full)) {
        const dims = pngDimensions(full);
        if (!dims) {
          fail(`index.html: apple-touch-icon is not a valid PNG: ${clean}`);
        } else {
          if (dims.width !== 180 || dims.height !== 180) {
            fail(`index.html: apple-touch-icon must be 180x180, got ${dims.width}x${dims.height}`);
          }
          if (sizes && sizes !== `${dims.width}x${dims.height}`) {
            fail(`index.html: apple-touch-icon sizes=${sizes} does not match ${dims.width}x${dims.height}`);
          }
        }
      }
    }
  }
}

const manifestPath = path.join(root, 'manifest.webmanifest');
if (!fs.existsSync(manifestPath)) {
  fail('Missing manifest.webmanifest');
} else {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
      fail('manifest.webmanifest: icons array is missing or empty');
    } else {
      for (const icon of manifest.icons) {
        if (!icon?.src) {
          fail('manifest.webmanifest: icon entry missing src');
          continue;
        }
        checkFile(icon.src, 'manifest.webmanifest');

        const clean = cleanRef(icon.src);
        if (clean?.toLowerCase().endsWith('.png')) {
          const full = path.resolve(root, clean.startsWith('/') ? clean.slice(1) : clean);
          if (fs.existsSync(full)) {
            const dims = pngDimensions(full);
            if (!dims) {
              fail(`manifest.webmanifest: invalid PNG: ${clean}`);
            } else if (icon.sizes && /^\d+x\d+$/.test(icon.sizes)) {
              const [w, h] = icon.sizes.split('x').map(Number);
              if (dims.width !== w || dims.height !== h) {
                fail(`manifest.webmanifest: ${clean} declares ${icon.sizes} but is ${dims.width}x${dims.height}`);
              }
            }
          }
        }
      }
    }
  } catch (error) {
    fail(`manifest.webmanifest: invalid JSON (${error.message})`);
  }
}

for (const name of ['app.js', 'data.js', 'media.js', 'progress.js', 'premium.css', 'polish.css']) {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, 'utf8');
  for (const ref of extractStaticAssetRefs(text)) checkFile(ref, name);
}

if (errors.length) {
  console.error(`MGL validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`MGL validation passed (${checked.size} local references checked).`);
