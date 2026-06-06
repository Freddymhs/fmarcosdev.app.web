import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const sitemap = readFileSync(join(ROOT, "public/sitemap.xml"), "utf-8");
const constants = readFileSync(join(ROOT, "src/constants.ts"), "utf-8");

const sitemapPaths = [...sitemap.matchAll(/<loc>https:\/\/fmarcos\.dev([^<]*)<\/loc>/g)]
  .map(([, path]) => path || "/");

const routeValues = [...constants.matchAll(/(?:HOME_PAGE|CERTIFICATES_PAGE|PROJECTS_PAGE|BLOG_PAGE|INITIAL_ROUTE)\s*=\s*"([^"]+)"/g)]
  .map(([, path]) => path);

const missing = routeValues.filter((route) => !sitemapPaths.includes(route));

if (missing.length > 0) {
  console.error("❌ Rutas en ACTIVE_ROUTES no encontradas en sitemap.xml:");
  missing.forEach((r) => console.error(`   • ${r}`));
  console.error("\nActualiza public/sitemap.xml antes de hacer commit.");
  process.exit(1);
}

console.log("✅ sitemap.xml sincronizado con ACTIVE_ROUTES");
