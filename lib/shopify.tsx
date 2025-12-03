const URL = process.env.SHOPIFY_API_URL!;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN!;


async function shopifyFetch<T>(query: string, variables: Record<string, any> = {}) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data as T;
}

export async function getProducts(limit = 12) {
  const query = `
    query ($limit:Int!) {
      products(first: $limit) {
        edges {
          node {
            id
            handle
            title
            description
            priceRange { minVariantPrice { amount currencyCode } }
            images(first: 1) { edges { node { url altText } } }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch<{ products: { edges: any[] } }>(query, { limit });
  return data.products.edges.map(e => e.node);
}
