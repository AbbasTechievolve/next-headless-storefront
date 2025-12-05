import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { cartId } = await request.json();
  if (!cartId) return NextResponse.json({ error: "cartId required" }, { status: 400 });

  const url = process.env.SHOPIFY_API_URL!;
  const token = process.env.SHOPIFY_ACCESS_TOKEN!;

  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
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
    }
  `;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables: { cartId } }),
  });

  const json = await res.json();
  const cart = json.data?.cart;

  if (!cart) return NextResponse.json({ error: json }, { status: 500 });

  return NextResponse.json(cart);
}
