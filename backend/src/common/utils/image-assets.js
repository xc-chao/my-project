import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const manifestPath = fileURLToPath(
  new URL('../../../../frontend/miniprogram/src/static/local-images/source-manifest.json', import.meta.url)
);

const sourceManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const imageUrlByFilename = new Map(sourceManifest.map((item) => [item.filename, item.imageUrl]));

const DEFAULT_FALLBACK_URL =
  'https://images.unsplash.com/photo-1760302318620-261f5e4d1940?fm=jpg&q=80&w=1600&auto=format&fit=crop';

export function normalizeImageUrl(input, fallbackUrl = DEFAULT_FALLBACK_URL) {
  if (!input || typeof input !== 'string') {
    return fallbackUrl;
  }

  if (input.startsWith('http://') || input.startsWith('https://')) {
    return input;
  }

  if (input.startsWith('/static/local-images/')) {
    const filename = input.split('/').pop();
    return (filename && imageUrlByFilename.get(filename)) || fallbackUrl;
  }

  return input;
}

export function normalizeImageList(list, fallbackUrl = DEFAULT_FALLBACK_URL) {
  return Array.isArray(list) ? list.map((item) => normalizeImageUrl(item, fallbackUrl)) : [];
}
