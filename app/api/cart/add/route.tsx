import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { cartId, variantId, quantity = 1 } = await request.json();

  if (!cartId || !variantId) {
    return NextResponse.json({ error: "cartId and variantId required" }, { status: 400 });
  }

  const url = process.env.SHOPIFY_API_URL!;
  const token = process.env.SHOPIFY_ACCESS_TOKEN!;

  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product { title handle }
                    image { url altText }
                    price { amount currencyCode }
                  }
                }
              }
            }
          }
          estimatedCost { totalAmount { amount currencyCode } }
        }
        userErrors { field message }
      }
    }
  `;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({
      query,
      variables: { cartId, lines: [{ merchandiseId: variantId, quantity }] },
    }),
  });

  const json = await res.json();
  const payload = json.data?.cartLinesAdd;

  if (!payload?.cart) {
    return NextResponse.json({ error: json }, { status: 500 });
  }

  return NextResponse.json(payload.cart);
}
