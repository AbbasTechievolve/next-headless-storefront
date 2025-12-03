import { getProducts } from '../../lib/shopify';

export default async function ProductsPage() {
  const products = await getProducts(12);

  return (
    <main className="p-6 grid gap-6 md:grid-cols-3">
      {products.map((p: any) => (
        <a key={p.id} href={`/products/${p.handle}`} className="border rounded-lg p-4 block">
          {p.images?.[0]?.url && (
            <img
              src={p.images[0].url}
              alt={p.images[0].altText ?? p.title}
              className="w-full h-48 object-cover mb-3"
            />
          )}
          <h2 className="font-semibold">{p.title}</h2>
          <p className="text-sm opacity-70 line-clamp-2">{p.description}</p>
          <p className="mt-2">
            {p.priceRange.minVariantPrice.amount} {p.priceRange.minVariantPrice.currencyCode}
          </p>
        </a>
      ))}
    </main>
  );
}

