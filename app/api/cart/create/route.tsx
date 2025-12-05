import { NextResponse } from "next/server";

export async function POST() {
  const url = process.env.SHOPIFY_API_URL!;
  const token = process.env.SHOPIFY_ACCESS_TOKEN!;

  const query = `
    mutation {
      cartCreate {
        cart {
          id
          checkoutUrl
          lines(first:10) {
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
                    image {
                      url
                      altText
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          estimatedCost {
            totalAmount {
              amount
              currencyCode
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

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  const cart = json.data?.cartCreate?.cart;

  if (!cart) {
    return NextResponse.json({ error: json }, { status: 500 });
  }

  return NextResponse.json(cart);
}
