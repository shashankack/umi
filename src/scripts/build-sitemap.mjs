// src/scripts/build-sitemap.mjs
import { SitemapStream, streamToPromise } from "sitemap";
import fs from "node:fs";
import path from "node:path";
import "dotenv/config";

// 1) Required site origin (no trailing slash)
const BASE_URL = (process.env.VITE_BASE_URL || "").replace(/\/$/, "");
if (!BASE_URL) {
  console.error(
    "❌ Missing VITE_BASE_URL in .env (e.g., VITE_BASE_URL=https://yourdomain.com)"
  );
  process.exit(1);
}

// 2) Static routes from your <Routes> (exclude 404 wildcard)
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

// 3) Same slug logic as your app's util
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

// 4) Pull product TITLES from Shopify (match PDP route /shop/:productName)
async function getProductTitleSlugs() {
  const domain = process.env.VITE_SHOPIFY_DOMAIN;
  const token = process.env.VITE_STOREFRONT_TOKEN;
  if (!domain || !token) return []; // silently skip if not configured

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

  const titles = [];
  let cursor = null;
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

  // Unique slugs → `/shop/:productName`
  return Array.from(new Set(titles.map((t) => `/shop/${slugify(t)}`)));
}

// (Optional) blog slugs if/when you have them
async function getBlogSlugs() {
  return []; // implement when blogs are dynamic
}

// helpers
function toUrlEntry(pathname, lastmodISO) {
  const isHome = pathname === "/";
  return {
    url: pathname,
    changefreq: isHome ? "daily" : "weekly",
    priority: isHome ? 1.0 : 0.7,
    ...(lastmodISO ? { lastmodISO } : {}),
  };
}

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
}
main().catch((err) => {
  console.error("Sitemap build failed:", err);
  process.exit(1);
});
