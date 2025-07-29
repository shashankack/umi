import { withCache } from './cache.js';

const SHOPIFY_DOMAIN = "6ix8jh-qp.myshopify.com";
const STOREFRONT_ACCESS_TOKEN = "2cba03757af47abdf34dea05d931f828";
const endpoint = `https://${SHOPIFY_DOMAIN}/api/2023-07/graphql.json`;

async function shopifyFetch(query, variables = {}) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error("Shopify error:", json.errors);
    throw new Error(json.errors[0].message || "GraphQL error");
  }

  return json.data;
}

// Cached version with 10 minute cache
const fetchShopifyProductsBase = async (limit = 20) => {
  const query = `
    {
      products(first: ${limit}) {
        edges {
          node {
            id
            title
            productType
            tags
            descriptionHtml
            images(first: 10) {
              edges {
                node {
                  url
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
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch(query);
  return data.products.edges.map((edge) => edge.node);
};

export const fetchShopifyProducts = withCache(
  fetchShopifyProductsBase, 
  'shopify_products', 
  10 * 60 * 1000 // 10 minutes cache
);

export async function createCart() {
  const query = `
    mutation {
      cartCreate {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch(query);
  return data.cartCreate.cart;
}

export async function addToCart(cartId, variantId, quantity) {
  const query = `
  mutation AddToCart($cartId: ID!, $variantId: ID!, $quantity: Int!) {
    cartLinesAdd(cartId: $cartId, lines: [
      {
        quantity: $quantity,
        merchandiseId: $variantId
      }
    ]) {
      cart {
        id
        lines(first: 10) {
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
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

  const variables = { cartId, variantId, quantity };
  const data = await shopifyFetch(query, variables);
  return data.cartLinesAdd.cart;
}

export async function removeFromCart(cartId, lineItemId) {
  const query = `
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          lines(first: 10) {
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

  const variables = {
    cartId,
    lineIds: [lineItemId],
  };

  const data = await shopifyFetch(query, variables);
  return data.cartLinesRemove.cart;
}

export async function updateCartItemQuantity(cartId, lineItemId, quantity) {
  const query = `
    mutation {
      cartLinesUpdate(cartId: "${cartId}", lines: [
        {
          id: "${lineItemId}",
          quantity: ${quantity}
        }
      ]) {
        cart {
          id
          lines(first: 10) {
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
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch(query);
  return data.cartLinesUpdate.cart;
}

export async function getCart(cartId) {
  const query = `
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
        lines(first: 10) {
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
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const variables = { cartId };
  const data = await shopifyFetch(query, variables);
  return data.cart;
}

// Cached search with 5 minute cache
const searchProductsBase = async (keyword) => {
  const query = `
    query {
      products(first: 10, query: "tag:*${keyword}*") {
        edges {
          node {
            id
            title
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  return json.data.products.edges.map((edge) => ({
    id: edge.node.id.split("/").pop(),
    title: edge.node.title,
    image: edge.node.images.edges[0]?.node.url || null,
  }));
};

export const searchProducts = withCache(
  searchProductsBase,
  'search_products',
  5 * 60 * 1000 // 5 minutes cache
);
