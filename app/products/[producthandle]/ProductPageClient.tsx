"use client";

import { useState, useEffect } from "react";

export default function ProductPageClient({ product, variants, images }: any) {
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [qty, setQty] = useState(1);

  // ---- MAIN IMAGE STATE ----
  const initialImage =
    selectedVariant.image?.url || images[0]?.url || "/placeholder.jpg";

  const [activeImage, setActiveImage] = useState(initialImage);

  // When variant changes → update main image
  useEffect(() => {
    setActiveImage(
      selectedVariant.image?.url ||
        images[0]?.url ||
        "/placeholder.jpg"
    );
  }, [selectedVariant]);

  // ---- ADD TO CART ----
  async function addToCart() {
    let cartId = localStorage.getItem("cartId");

    if (!cartId) {
      const res = await fetch("/api/cart/create", { method: "POST" });
      const json = await res.json();
      cartId = json.id;
      localStorage.setItem("cartId", cartId ?? "");
    }

    const res2 = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartId,
        variantId: selectedVariant.id,
        quantity: qty,
      }),
    });

    const cart = await res2.json();

    // Notify global system
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: cart }));
    window.dispatchEvent(new CustomEvent("cart:toggle", { detail: { open: true } }));

    alert("Added to cart!");
  }

  return (
    <div
      style={{
        padding: 40,
        display: "flex",
        gap: 40,
        alignItems: "flex-start",
      }}
    >
      {/* ---------------------------------------------------------------- */}
      {/* LEFT SIDE — IMAGES & THUMBNAILS */}
      {/* ---------------------------------------------------------------- */}
      <div style={{ flex: 1, maxWidth: "600px" }}>
        {/* MAIN IMAGE */}
        <img
          src={activeImage}
          style={{
            width: "100%",
            borderRadius: 12,
            marginBottom: 20,
          }}
        />

        {/* THUMBNAIL GALLERY */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {images.map((img: any, index: number) => {
            const isActive = activeImage === img.url;

            return (
              <img
                key={index}
                src={img.url}
                onClick={() => {
                  // Always update main image
                  setActiveImage(img.url);

                  // Auto-select variant if image belongs to a variant
                  const match = variants.find(
                    (v: any) => v.image?.url === img.url
                  );

                  if (match) setSelectedVariant(match);
                }}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: isActive ? "2px solid black" : "1px solid #ccc",
                  cursor: "pointer",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* RIGHT SIDE — PRODUCT CONTENT */}
      {/* ---------------------------------------------------------------- */}
      <div style={{ flex: 1 }}>
        <h1 style={{ marginBottom: 10 }}>{product.title}</h1>

        <h2>
          {selectedVariant.price.amount} {selectedVariant.price.currencyCode}
        </h2>

        <div
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          style={{ margin: "20px 0" }}
        />

        {/* VARIANT DROPDOWN */}
        <label style={{ fontWeight: 600 }}>Select Variant</label>
        <select
          value={selectedVariant.id}
          onChange={(e) => {
            const variant = variants.find((v: any) => v.id === e.target.value);
            if (variant) setSelectedVariant(variant);
          }}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 8,
            marginBottom: 20,
            fontSize: 16,
          }}
        >
          {variants.map((v: any) => (
            <option key={v.id} value={v.id}>
              {v.title}
            </option>
          ))}
        </select>

        {/* QUANTITY SELECTOR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <button
            onClick={() => qty > 1 && setQty(qty - 1)}
            style={{
              padding: "6px 12px",
              border: "1px solid #ccc",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            -
          </button>

          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            style={{
              width: 60,
              padding: 8,
              textAlign: "center",
              fontSize: 16,
              border: "1px solid #ccc",
              borderRadius: 6,
            }}
          />

          <button
            onClick={() => setQty(qty + 1)}
            style={{
              padding: "6px 12px",
              border: "1px solid #ccc",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            +
          </button>
        </div>

        {/* ADD TO CART BUTTON */}
        <button
          onClick={addToCart}
          disabled={!selectedVariant.availableForSale}
          style={{
            padding: "14px 20px",
            width: "100%",
            background: selectedVariant.availableForSale ? "black" : "#777",
            color: "white",
            borderRadius: 10,
            fontSize: 18,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {selectedVariant.availableForSale ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
