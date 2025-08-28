// src/scripts/build-sitemap.mjs
import { SitemapStream, streamToPromise } from "sitemap";
import fs from "node:fs";
import path from "node:path";
import "dotenv/config";

// 1) Load env vars (support both SHOPIFY_* and VITE_SHOPIFY_*)
const BASE_URL = (process.env.VITE_BASE_URL || "").replace(/\/$/, "");
const SHOPIFY_DOMAIN =
  process.env.SHOPIFY_DOMAIN || process.env.VITE_SHOPIFY_DOMAIN;
const STOREFRONT_TOKEN =
  process.env.STOREFRONT_TOKEN || process.env.VITE_STOREFRONT_TOKEN;

// 2) Validate envs
if (!BASE_URL) {
  console.error("❌ Missing VITE_BASE_URL in .env (e.g. VITE_BASE_URL=https://umimatchashop.com)");
  process.exit(1);
}
if (!SHOPIFY_DOMAIN) {
  console.error("❌ Missing SHOPIFY_DOMAIN (or VITE_SHOPIFY_DOMAIN) in env");
  process.exit(1);
}
if (!STOREFRONT_TOKEN) {
  console.error("❌ Missing STOREFRONT_TOKEN (or VITE_STOREFRONT_TOKEN) in env");
  process.exit(1);
}

console.log("✅ Env loaded:");
console.log("   VITE_BASE_URL:", BASE_URL);
console.log("   SHOPIFY_DOMAIN:", SHOPIFY_DOMAIN);
console.log("   STOREFRONT_TOKEN:", STOREFRONT_TOKEN ? "[set]" : "[missing]");

// 3) Static routes from your <Routes>
const STATIC_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/shop",
  "/our-matcha",
  "/how-to-make-matcha-at-home",
  "/blogs",
  "/terms-of-service",
  "/privacy-policy",
  "/refund-policy",
  "/shipping-policy",
  "/faq",
];

// 4) Slugify function (matches your app's util)
function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// 5) Fetch product titles for PDP URLs
async function getProductTitleSlugs() {
  const endpoint = `https://${SHOPIFY_DOMAIN}/api/2024-07/graphql.json`;
  const query = /* GraphQL */ `
    query ProductTitles($cursor: String) {
      products(first: 250, after: $cursor) {
        edges {
          cursor
          node {
            title
            updatedAt
          }
        }
        pageInfo { hasNextPage }
      }
    }
  `;

  const titles = [];
  let cursor = null;
  for (let i = 0; i < 40; i++) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { cursor } }),
    });
    if (!res.ok) {
      console.error("❌ Shopify fetch failed:", res.status, await res.text());
      break;
    }
    const json = await res.json();
    const edges = json?.data?.products?.edges ?? [];
    titles.push(...edges.map((e) => e.node.title));
    const hasNext = json?.data?.products?.pageInfo?.hasNextPage;
    if (!hasNext || edges.length === 0) break;
    cursor = edges[edges.length - 1].cursor;
  }

  return Array.from(new Set(titles.map((t) => `/shop/${slugify(t)}`)));
}

async function getBlogSlugs() {
  return [];
}

function toUrlEntry(pathname, lastmodISO) {
  const isHome = pathname === "/";
  return {
    url: pathname,
    changefreq: isHome ? "daily" : "weekly",
    priority: isHome ? 1.0 : 0.7,
    ...(lastmodISO ? { lastmodISO } : {}),
  };
}

// 6) Main
async function main() {
  const productPaths = await getProductTitleSlugs();
  const blogPaths = (await getBlogSlugs()).map((s) => `/blogs/${s}`);

  const allPaths = [...STATIC_ROUTES, ...productPaths, ...blogPaths];

  const sitemap = new SitemapStream({ hostname: BASE_URL });
  for (const p of allPaths) sitemap.write(toUrlEntry(p));
  sitemap.end();

  const xml = await streamToPromise(sitemap);
  const outDir = path.resolve("dist");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml);

  console.log(`✅ Wrote ${allPaths.length} URLs to dist/sitemap.xml`);
  console.log(`   + ${productPaths.length} product URLs`);
  console.log(`   + ${blogPaths.length} blog URLs`);
}

main().catch((err) => {
  console.error("Sitemap build failed:", err);
  process.exit(1);
});
