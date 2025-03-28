const SHOPIFY_DOMAIN = "6ix8jh-qp.myshopify.com";
const STOREFRONT_ACCESS_TOKEN = "2cba03757af47abdf34dea05d931f828";

const endpoint = `https://${SHOPIFY_DOMAIN}/api/2023-07/graphql.json`;

export async function fetchShopifyProducts() {
  const query = `
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            description
            images(first: 1) {
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
  return json.data.checkoutCreate.checkout.webUrl;
}
