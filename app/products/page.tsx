// app/products/page.tsx
import { getProducts } from '../../lib/shopify'; // Import the function to fetch products

export default async function ProductsPage() {
  const products = await getProducts(); // Fetch the products from Shopify

  return (
    <div>
      <h1>Product Listing</h1>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.node.id} className="product-card">
            <h2>{product.node.title}</h2>
            <p>{product.node.descriptionHtml}</p>
            <p>${product.node.priceRange.minVariantPrice.amount}</p>
            {product.node.images.edges.length > 0 && (
              <img
                src={product.node.images.edges[0].node.transformedSrc}
                alt={product.node.title}
                width="200"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Fetch product data at build time
export async function getProducts() {
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

  const res = await fetch(process.env.SHOPIFY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query }),
  });

  const { data } = await res.json();
  return data.products.edges;
}

/* 
import Image from "next/image";
export default function Home() {
 return (
 <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
	<div>{process.env.SHOPIFY_API_URL} - {process.env.SHOPIFY_ACCESS_TOKEN}</div>
	
	
 </div>
  );
} */
