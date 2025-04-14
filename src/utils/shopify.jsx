const SHOPIFY_DOMAIN = "6ix8jh-qp.myshopify.com";
const STOREFRONT_ACCESS_TOKEN = "2cba03757af47abdf34dea05d931f828";
const endpoint = `https://${SHOPIFY_DOMAIN}/api/2023-07/graphql.json`;

export async function fetchShopifyProducts(limit = 20) {
  const query = `
    {
      products(first: ${limit}) {
        edges {
          node {
            id
            title
            productType
            descriptionHtml
            images(first:10) {
              edges {
                node {
                  url
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                    currencyCode
                  }
                  weight
                  weightUnit
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

  if (json.errors) {
    console.error("Shopify error:", json.errors);
    throw new Error("Failed to fetch products");
  }

  return json.data.products.edges.map((edge) => edge.node);
}

export async function createShopifyCheckout(variantId) {
  const mutation = `
    mutation {
      checkoutCreate(input: {
        lineItems: [
          {
            variantId: "${variantId}"
            quantity: 1
          }
        ]
      }) {
        checkout {
          id
          webUrl
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
    body: JSON.stringify({ query: mutation }),
  });

  const json = await res.json();
  return json.data.checkoutCreate.checkout;
}

export async function addToCart(checkoutId, variantId, quantity) {
  const mutation = `
    mutation {
      checkoutLineItemsAdd(checkoutId: "${checkoutId}", lineItems: [
        {
          variantId: "${variantId}"
          quantity: ${quantity}
        }
      ]) {
        checkout {
          id
          lineItems(first: 5) {
            edges {
              node {
                title
                quantity
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
    body: JSON.stringify({ query: mutation }),
  });

  const json = await res.json();
  return json.data.checkoutLineItemsAdd.checkout;
}

export async function getCheckoutDetails(checkoutId) {
  const query = `
    query {
      checkout(id: "${checkoutId}") {
        id
        lineItems(first: 5) {
          edges {
            node {
              title
              quantity
              variant {
                id
                price {
                  amount
                  currencyCode
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
  return json.data.checkout;
}
