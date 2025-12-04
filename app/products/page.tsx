import Link from "next/link";

export default async function Home() {
	
  const url = process.env.SHOPIFY_API_URL!;
  const token = process.env.SHOPIFY_ACCESS_TOKEN!;

  // GraphQL query to fetch products, images, and prices
    const fetchProducts = async (cursor: string | null) => {
	
    const query = `
      {
        shop {
          name
        }
        products(first: 12) {
          edges {
            node {
              id
              title
			  handle   
              images(first: 1) {
                edges {
                  node {
                    src
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
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

    return { data, error };
  };

 const { data, error } = await fetchProducts(null);
 console.log("RESULT:", data);
  // If there's no data or error, return a message
  if (!data || error) {
    return <div style={{ padding: 20 }}>Something went wrong: {error}</div>;
  }

  // Helper to format currency
  const formatCurrency = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(parseFloat(amount));
  };
  
  return (
  
	
    <div style={{ padding: 20 }}>
      <h1>Shopify Products</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
	  
        {data?.products?.edges.map(({ node }: any) => (
		 
		 
          <div
            key={node.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
              textAlign: "center",
            }}
          >
            <img
              src={node.images.edges[0]?.node.src}
              alt={node.images.edges[0]?.node.altText}
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
            <h3>{node.title}</h3>
            <p>{formatCurrency(node.variants.edges[0].node.priceV2.amount, node.variants.edges[0].node.priceV2.currencyCode)}</p>
            <Link href={`/products/${node.handle}`} style={{ textDecoration: "none" }}>
			  <button
				style={{
				  backgroundColor: "#0070f3",
				  color: "white",
				  border: "none",
				  padding: "10px 20px",
				  cursor: "pointer",
				  borderRadius: "5px",
				  width: "100%"
				}}
			  >
				Shop Now
			  </button>
			</Link>

			
          </div>
        ))}
      </div>
	  
	 
       
     
    </div>
  );
}
