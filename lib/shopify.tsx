// lib/shopify.js
const SHOPIFY_API_URL = process.env.SHOPIFY_API_URL; // Shopify API URL from environment variables
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN; // Shopify Access Token from environment variables

// Helper function to make requests to Shopify Storefront API
const fetchShopifyData = async (query) => {
  const res = await fetch(SHOPIFY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query,
    }),
  });

  const data = await res.json();
  return data.data;
};

// Function to get products from Shopify
export const getProducts = async () => {
  const query = `
    {
      products(first: 5) {
        edges {
          node {
            id
            title
            descriptionHtml
            priceRange {
              minVariantPrice {
                amount
              }
            }
            images(first: 1) {
              edges {
                node {
                  transformedSrc
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await fetchShopifyData(query);
  return data.products.edges; // Return the products data
};
