import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { cartId, lineId } = await request.json();

  if (!cartId || !lineId) {
    return NextResponse.json({ error: "cartId and lineId required" }, { status: 400 });
  }

  const url = process.env.SHOPIFY_API_URL!;
  const token = process.env.SHOPIFY_ACCESS_TOKEN!;

  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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
      variables: {
        cartId,
        lineIds: [lineId],
      },
    }),
  });

  const json = await res.json();
  const payload = json.data?.cartLinesRemove;

  if (!payload?.cart) {
    return NextResponse.json({ error: json }, { status: 500 });
  }

  return NextResponse.json(payload.cart);
}
