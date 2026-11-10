# BSANHS · SSLG website

The public website of the Supreme Secondary Learner Government of Benigno S.
Aquino National High School, Concepcion, Tarlac. Built with React 19, Vite,
TypeScript and Cloudflare Pages Functions.

Live: https://bsanhs.pages.dev

## Layout

| Path | Purpose |
| --- | --- |
| `src/` | Pages, components, styles and typed content |
| `src/content/` | Officers, activities, documents and the Drive snapshot |
| `functions/api/` | Cloudflare Pages Functions that proxy Drive and cache in KV |
| `scripts/` | Drive snapshot sync and SEO generation |
| `tests/` | Vitest suite |

## Assets are not in this repository

The school and SSLG seals, officer portraits, activity photographs, the
letterhead-derived figure and the social share image are school-owned and are
deliberately excluded. In the deployment checkout they live in
`public/brand/`, `public/media/` and `public/og.png`.

A fresh clone runs; those images simply 404 until you supply your own. The
portrait-file test skips itself when `public/brand/officers/` is empty, so
`npm test` still passes.

## Run

```bash
npm install
npm run dev        # local site
npm test           # Vitest
npm run build      # typecheck, bundle, generate sitemap
npm run deploy     # refresh Drive snapshot, build, deploy to Cloudflare Pages
```

`npm run deploy` expects Wrangler to be authenticated. The Functions read a
`GOOGLE_API_KEY` environment secret from the Pages project at runtime; no
credential is stored in this repository.

## Content data

`src/content/drive-snapshot.json` is a build-time snapshot of the SSLG's
public Drive folders: document titles, links and short preview lines. It is
published so the transparency pages render without a key. Refresh it with
`npm run sync:drive`.

## Licence

The source code is MIT licensed (see `LICENSE`). The school name, seals,
portraits, photographs and official documents remain the property of
Benigno S. Aquino National High School and its Supreme Secondary Learner
Government. They are published here and on the live site for public reading,
not for reuse under the code licence.
