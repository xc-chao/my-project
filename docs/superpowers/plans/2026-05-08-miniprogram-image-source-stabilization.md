# Mini Program Image Source Stabilization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the mini program previewable while restoring visible project imagery through stable remote image URLs and safe fallbacks.

**Architecture:** The mini program will use the existing `source-manifest.json` as the single image source of truth, but the mapping layer will stop assuming every filename is present. A small fallback resolver will return a known-good remote image when a requested asset is missing, so the UI can render instead of throwing. The editor build will keep ignoring the old local image archive so the preview package stays small.

**Tech Stack:** UniApp, Vue 3, TypeScript, WeChat Mini Program build output, JSON asset manifest.

---

### Task 1: Add a safe image resolver

**Files:**
- Modify: `frontend/miniprogram/src/constants/page-image-map.ts`

- [ ] **Step 1: Replace the hard failure path with a fallback lookup**

```ts
import sourceManifest from '../static/local-images/source-manifest.json';

type SourceImage = {
  filename: string;
  imageUrl: string;
};

const sourceUrlByFilename = new Map(
  (sourceManifest as SourceImage[]).map(({ filename, imageUrl }) => [filename, imageUrl] as const)
);

const fallbackUrls = {
  storeBanner:
    'https://images.unsplash.com/photo-1760302318620-261f5e4d1940?fm=jpg&q=80&w=1600&auto=format&fit=crop',
  productCover:
    'https://images.unsplash.com/photo-1622760807301-4d2351a5a942?fm=jpg&q=80&w=1600&auto=format&fit=crop'
} as const;

function asset(filename: string, fallback: string) {
  return sourceUrlByFilename.get(filename) || fallback;
}

function buildSeries(prefix: string, count: number, fallback: string) {
  return Array.from({ length: count }, (_, index) => {
    return asset(`${prefix}-${String(index + 1).padStart(2, '0')}.jpg`, fallback);
  });
}

export const assetCatalog = {
  hero: {
    store: asset('store-banner.jpg', fallbackUrls.storeBanner),
    featured: buildSeries('hero-dewu-style', 20, fallbackUrls.storeBanner)
  },
  lifestyle: {
    login: asset('login-style.jpg', fallbackUrls.productCover),
    denim: asset('denim-style.jpg', fallbackUrls.productCover),
    featured: buildSeries('lifestyle-dewu-style', 20, fallbackUrls.productCover)
  },
  products: {
    shoeBlack: asset('shoe-black.jpg', fallbackUrls.productCover),
    shirtBlue: asset('shirt-blue.jpg', fallbackUrls.productCover),
    jacketBrown: asset('jacket-brown.jpg', fallbackUrls.productCover),
    featured: buildSeries('products-dewu-style', 20, fallbackUrls.productCover)
  },
  details: {
    featured: buildSeries('details-dewu-style', 20, fallbackUrls.productCover)
  },
  avatars: {
    featured: buildSeries('avatars-dewu-style', 20, fallbackUrls.productCover)
  }
} as const;
```

- [ ] **Step 2: Run type check**

Run: `npm run type-check`
Expected: PASS.

### Task 2: Keep the preview package small

**Files:**
- Modify: `frontend/miniprogram/project.config.json`

- [ ] **Step 1: Keep the local image archive excluded**

```json
{
  "setting": {
    "es6": true,
    "postcss": true,
    "minified": true,
    "uglifyFileName": false,
    "enhance": true,
    "packNpmRelationList": [],
    "babelSetting": {
      "ignore": [],
      "disablePlugins": [],
      "outputPath": ""
    },
    "useCompilerPlugins": false,
    "minifyWXML": true
  },
  "compileType": "miniprogram",
  "simulatorPluginLibVersion": {},
  "packOptions": {
    "ignore": [
      "src/static/local-images/**"
    ],
    "include": []
  },
  "appid": "touristappid",
  "editorSetting": {}
}
```

- [ ] **Step 2: Rebuild the mini program**

Run: `npm run build:mp-weixin`
Expected: Build completes and `dist/build/mp-weixin` stays small.

### Task 3: Verify the preview path

**Files:**
- None

- [ ] **Step 1: Re-import the rebuilt `dist/build/mp-weixin` into WeChat DevTools**
- [ ] **Step 2: Confirm the home page renders images instead of throwing `Missing source image`**
- [ ] **Step 3: Confirm preview and page navigation still work**

