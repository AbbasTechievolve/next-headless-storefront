// app/page.tsx
export const dynamic = "force-dynamic"; // Prevent prerender errors while testing

export default async function Home() {
  const url = process.env.SHOPIFY_API_URL;
  const token = process.env.SHOPIFY_ACCESS_TOKEN;

  // Query for testing
  const query = `
    {
      shop {
        name
      }
      products(first: 3) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `;

  let data: any = null;
  let error: any = null;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });

    const result = await res.json();

    if (result.errors) {
      error = result.errors;
    } else {
      data = result.data;
    }
  } catch (e: any) {
    error = e.toString();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Shopify API Test</h1>

      <h2>Environment Check</h2>
      <pre>{JSON.stringify({
        hasUrl: Boolean(url),
        hasToken: Boolean(token),
        tokenPrefix: token?.slice(0, 6)
      }, null, 2)}</pre>

      <h2>API Response</h2>
      <pre>{JSON.stringify(data || error, null, 2)}</pre>
    </div>
  );
}
