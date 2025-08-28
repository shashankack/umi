// scripts/build-sitemap.mjs
import { SitemapStream, streamToPromise } from "sitemap";
import fs from "node:fs";
import path from "node:path";
import "dotenv/config";

/** Required: absolute site origin, no trailing slash */
const BASE_URL = (process.env.VITE_BASE_URL || "").replace(/\/$/, "");
if (!BASE_URL) {
  console.error(
    "❌ Missing VITE_BASE_URL in .env (e.g., VITE_BASE_URL=https://yourdomain.com)"
  );
  process.exit(1);
}

/** Static routes mirrored from <Routes> (exclude 404/wildcard). */
const STATIC_ROUTES = [
  "/", // Intro (wraps Home)
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

/** Same slug rule you use in the app */
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

/**
 * C) Shopify Storefront API (server-side, token from .env)
 * NOTE: We fetch product *titles* (not only handles) to build URLs
 * that match your PDP route which expects slugified titles.
 *   SHOPIFY_DOMAIN=myshop.myshopify.com
 *   STOREFRONT_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 */
async function getProductTitleSlugs() {
  const domain = process.env.SHOPIFY_DOMAIN;
  const token = process.env.STOREFRONT_TOKEN;
  if (!domain || !token) return [];

  const endpoint = `https://${domain}/api/2024-07/graphql.json`;
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
        pageInfo {
          hasNextPage
        }
      }
    }
  `;

  let cursor = null;
  const titles = [];
  for (let i = 0; i < 40; i++) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { cursor } }),
    });

    if (!res.ok) {
      console.warn("Shopify fetch failed:", res.status, await res.text());
      break;
    }
    const json = await res.json();
    const edges = json?.data?.products?.edges ?? [];
    titles.push(...edges.map((e) => e.node.title));
    const hasNext = json?.data?.products?.pageInfo?.hasNextPage;
    if (!hasNext || edges.length === 0) break;
    cursor = edges[edges.length - 1].cursor;
  }

  // Unique, then map to route paths
  const uniqueSlugs = Array.from(new Set(titles.map((t) => slugify(t))));
  return uniqueSlugs.map((s) => `/shop/${s}`);
}

async function getBlogSlugs() {
  // If your blogs come from a CMS/Shopify, mirror the pattern above.
  return [];
}

/** Helpers */
function toUrlEntry(pathname) {
  const isHome = pathname === "/";
  return {
    url: pathname,
    changefreq: isHome ? "daily" : "weekly",
    priority: isHome ? 1.0 : 0.7,
  };
}

async function main() {
  const productPaths = await getProductTitleSlugs(); // matches your PDP URL shape
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
  if (productPaths.length)
    console.log(`   + ${productPaths.length} product URLs`);
  if (blogPaths.length) console.log(`   + ${blogPaths.length} blog URLs`);
}

main().catch((err) => {
  console.error("Sitemap build failed:", err);
  process.exit(1);
});

