"use client";

import { useState } from "react";

export default function ProductPageClient({ product, variants, images }: any) {
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);

  async function addToCart() {
    let cartId = localStorage.getItem("cartId");

    if (!cartId) {
      const res = await fetch("/api/cart/create", { method: "POST" });
      const json = await res.json();
      cartId = json.id;
      localStorage.setItem("cartId", cartId);
    }

    await fetch("/api/cart/add", {
      method: "POST",
      body: JSON.stringify({
        cartId,
        variantId: selectedVariant.id,
      }),
    });

    alert("Added to cart!");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>{product.title}</h1>

      <img
        src={selectedVariant.image?.url || images[0]?.url}
        style={{ width: "400px", borderRadius: 10 }}
      />

      <div
        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        style={{ marginTop: 20 }}
      />

      <h2 style={{ marginTop: 20 }}>
        {selectedVariant.price.amount} {selectedVariant.price.currencyCode}
      </h2>

      <select
        value={selectedVariant.id}
        onChange={(e) => {
          const variant = variants.find((v: any) => v.id === e.target.value);
          setSelectedVariant(variant);
        }}
        style={{ padding: 10, marginTop: 20 }}
      >
        {variants.map((v: any) => (
          <option key={v.id} value={v.id}>
            {v.title}
          </option>
        ))}
      </select>

      <button
        onClick={addToCart}
        disabled={!selectedVariant.availableForSale}
        style={{
          padding: "12px 20px",
          background: selectedVariant.availableForSale ? "black" : "#777",
          color: "white",
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        {selectedVariant.availableForSale ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  );
}
