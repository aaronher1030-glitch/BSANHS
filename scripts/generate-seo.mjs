// Post-build SEO artifact generator (Node ESM, no dependencies).
// Runs after `vite build`: reads SITE_URL and activity slugs from source via
// regex (Node cannot import the TS modules) and emits dist/sitemap.xml.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist");

function fail(message) {
  console.error(`generate-seo: ${message}`);
  process.exit(1);
}

const configSource = readFileSync(join(root, "src", "config.ts"), "utf8");
const siteUrlMatch = configSource.match(/export const SITE_URL\s*=\s*"([^"]*)"/);
if (!siteUrlMatch) fail("could not find SITE_URL literal in src/config.ts");
const siteUrl = siteUrlMatch[1].trim().replace(/\/+$/, "");
if (!siteUrl) fail("SITE_URL is empty in src/config.ts");
if (!/^https:\/\//.test(siteUrl)) fail(`SITE_URL is not an https URL: ${siteUrl}`);

const activitiesSource = readFileSync(
  join(root, "src", "content", "activities.ts"),
  "utf8",
);
const slugs = [...activitiesSource.matchAll(/slug:\s*"([^"]+)"/g)].map(
  (m) => m[1],
);
if (slugs.length === 0) fail("no activity slugs found in src/content/activities.ts");
if (new Set(slugs).size !== slugs.length) fail("duplicate activity slugs found");

const staticRoutes = [
  "/",
  "/finance",
  "/accomplishments",
  "/transparency",
  "/about-us",
  "/feedback",
];
const routes = [...staticRoutes, ...slugs.map((slug) => `/accomplishments/${slug}`)];

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

// No lastmod: a build-date stamp repeated on all 18 URLs is a synthetic
// freshness signal, and no per-page dates are known. Omit it entirely.
const urls = routes
  .map((route) => `  <url>\n    <loc>${escapeXml(`${siteUrl}${route}`)}</loc>\n  </url>`)
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

if (!existsSync(distDir)) fail("dist/ does not exist; run vite build first");
writeFileSync(join(distDir, "sitemap.xml"), xml, "utf8");
console.log(
  `generate-seo: wrote dist/sitemap.xml (${routes.length} URLs: ${staticRoutes.length} static + ${slugs.length} activities)`,
);
