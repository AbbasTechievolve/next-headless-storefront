import ProductPageClient from "./ProductPageClient";
export default async function ProductPage({ params }: { params: { producthandle: string } }) {
  const url = process.env.SHOPIFY_API_URL!;
  const token = process.env.SHOPIFY_ACCESS_TOKEN!;
  const { producthandle } = await params;

  // GraphQL Query
  const query = `
    query ProductByHandle($producthandle: String!) {
      product(handle: $producthandle) {
        id
        title
        descriptionHtml
        images(first: 20) {
          edges { node { url altText } }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              availableForSale
              image { url }
              price { amount currencyCode }
            }
          }
        }
      }
    }
  `;
  // Fetch Product
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({
      query,
      variables: { producthandle },
    }),
    cache: "no-store",
  });

  const result = await response.json();
  const product = result.data?.product;

  if (!product) {
      return <div style={{ padding: 20 }}>Product not found.</div>;
  }
  const variants = product.variants.edges.map((v: any) => v.node);
  const images = product.images.edges.map((i: any) => i.node);
 
  

  const firstImage = product.images.edges[0]?.node;
  const firstVariant = product.variants.edges[0]?.node;
 {/*<pre>{JSON.stringify(variants)}</pre>*/}
 {/* <pre>{JSON.stringify(product.variants.edges, null, 2)}</pre> */}
 
  return (
    <ProductPageClient
      product={product}
      variants={variants}
      images={images}
    />
  );
}
