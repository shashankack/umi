// utils/shopify.jsx
// Vite-friendly Storefront client (JS + JSDoc types)
// Requires env in .env:
//   VITE_SHOPIFY_DOMAIN=xxxx.myshopify.com
//   VITE_STOREFRONT_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
//
// NOTE: Storefront tokens are public, but do not commit secrets to repo history.

import { withCache } from "./cache.js";

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN;
const STOREFRONT_TOKEN = import.meta.env.VITE_STOREFRONT_TOKEN;

// Keep this aligned with your store's supported version.
const API_VERSION = "2024-07";
const endpoint = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

if (!SHOPIFY_DOMAIN || !STOREFRONT_TOKEN) {
  // Fail fast in dev; in prod you might want a softer fallback.
  console.warn(
    "[shopify] Missing VITE_SHOPIFY_DOMAIN or VITE_STOREFRONT_TOKEN. " +
      "Set them in .env (Vite) before using the client."
  );
}

/**
 * Low-level GraphQL fetch
 * @template T
 * @param {string} query
 * @param {Record<string, any>} [variables]
 * @returns {Promise<T>}
 */
async function shopifyFetch(query, variables = {}) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Shopify response was not JSON (status ${res.status})`);
  }

  if (!res.ok || json.errors) {
    const msg = json?.errors?.[0]?.message ?? `HTTP ${res.status}`;
    console.error("[shopify] error:", json.errors || msg);
    throw new Error(msg);
  }

  return /** @type {T} */ (json.data);
}

/* =========================================
 * PRODUCTS: list, single by handle, handles
 * ======================================= */

/**
 * Fetch products for listing (includes `handle`)
 * Cached 10 minutes.
 * @param {number} limit
 */
const fetchShopifyProductsBase = async (limit = 20) => {
  const query = /* GraphQL */ `
    query Products($limit: Int!) {
      products(first: $limit) {
        edges {
          node {
            id
            handle
            title
            productType
            tags
            descriptionHtml
            updatedAt
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 4) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  weight
                  weightUnit
                  image {
                    url
                    altText
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch(query, { limit });
  return data.products.edges.map((e) => e.node);
};

export const fetchShopifyProducts = withCache(
  fetchShopifyProductsBase,
  "shopify_products",
  10 * 60 * 1000
);

/**
 * Fetch a single product by Shopify handle (for PDP)
 * @param {string} handle
 */
export async function fetchProductByHandle(handle) {
  const query = /* GraphQL */ `
    query ProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        handle
        title
        descriptionHtml
        productType
        tags
        updatedAt
        seo {
          title
          description
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 50) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              image {
                url
                altText
              }
              availableForSale
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch(query, { handle });
  return data.product; // null if not found
}

/**
 * Fetch all product handles (for sitemap, etc.)
 * Returns [{ handle, updatedAt }]
 */
export async function fetchAllProductHandles() {
  const query = /* GraphQL */ `
    query ProductHandles($cursor: String) {
      products(first: 250, after: $cursor) {
        edges {
          cursor
          node {
            handle
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
  const out = [];
  for (let i = 0; i < 40; i++) {
    const data = await shopifyFetch(query, { cursor });
    const edges = data?.products?.edges ?? [];
    out.push(
      ...edges.map((e) => ({
        handle: e.node.handle,
        updatedAt: e.node.updatedAt,
      }))
    );
    const hasNext = data?.products?.pageInfo?.hasNextPage;
    if (!hasNext || edges.length === 0) break;
    cursor = edges[edges.length - 1].cursor;
  }
  // unique by handle
  return Array.from(new Map(out.map((o) => [o.handle, o])).values());
}

/* ===========
 * CART / LINES
 * ========== */

export async function createCart() {
  const query = /* GraphQL */ `
    mutation CreateCart {
      cartCreate {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                  }
                }
                cost {
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const data = await shopifyFetch(query);
  const { cart, userErrors } = data.cartCreate;
  if (userErrors?.length) {
    throw new Error(userErrors.map((e) => e.message).join("; "));
  }
  return cart;
}

/**
 * @param {string} cartId
 * @param {string} variantId
 * @param {number} quantity
 */
export async function addToCart(cartId, variantId, quantity) {
  const query = /* GraphQL */ `
    mutation AddToCart($cartId: ID!, $variantId: ID!, $quantity: Int!) {
      cartLinesAdd(
        cartId: $cartId
        lines: [{ merchandiseId: $variantId, quantity: $quantity }]
      ) {
        cart {
          id
          totalQuantity
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                  }
                }
                cost {
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const variables = { cartId, variantId, quantity };
  const data = await shopifyFetch(query, variables);
  const { cart, userErrors } = data.cartLinesAdd;
  if (userErrors?.length) {
    throw new Error(userErrors.map((e) => e.message).join("; "));
  }
  return cart;
}

/**
 * @param {string} cartId
 * @param {string} lineItemId
 */
export async function removeFromCart(cartId, lineItemId) {
  const query = /* GraphQL */ `
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          totalQuantity
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                  }
                }
                cost {
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const variables = { cartId, lineIds: [lineItemId] };
  const data = await shopifyFetch(query, variables);
  const { cart, userErrors } = data.cartLinesRemove;
  if (userErrors?.length) {
    throw new Error(userErrors.map((e) => e.message).join("; "));
  }
  return cart;
}

/**
 * @param {string} cartId
 * @param {string} lineItemId
 * @param {number} quantity
 */
export async function updateCartItemQuantity(cartId, lineItemId, quantity) {
  const query = /* GraphQL */ `
    mutation UpdateCartLine($cartId: ID!, $lineItemId: ID!, $quantity: Int!) {
      cartLinesUpdate(
        cartId: $cartId
        lines: [{ id: $lineItemId, quantity: $quantity }]
      ) {
        cart {
          id
          totalQuantity
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                  }
                }
                cost {
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const variables = { cartId, lineItemId, quantity };
  const data = await shopifyFetch(query, variables);
  const { cart, userErrors } = data.cartLinesUpdate;
  if (userErrors?.length) {
    throw new Error(userErrors.map((e) => e.message).join("; "));
  }
  return cart;
}

/**
 * @param {string} cartId
 */
export async function getCart(cartId) {
  const query = /* GraphQL */ `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              cost {
                subtotalAmount {
                  amount
                  currencyCode
                }
              }
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch(query, { cartId });
  return data.cart;
}

/* ======
 * SEARCH
 * ====== */

const searchProductsBase = async (keyword) => {
  const query = /* GraphQL */ `
    query Search($q: String!) {
      products(first: 10, query: $q) {
        edges {
          node {
            id
            handle
            title
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;
  // broaden beyond tag: also search title:
  const q = `(title:*${keyword}* OR tag:*${keyword}*)`;
  const data = await shopifyFetch(query, { q });
  return data.products.edges.map(({ node }) => ({
    id: node.id.split("/").pop(),
    handle: node.handle,
    title: node.title,
    image: node.images.edges[0]?.node.url || null,
  }));
};

export const searchProducts = withCache(
  searchProductsBase,
  "search_products",
  5 * 60 * 1000
);
