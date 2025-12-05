"use client";

import { useEffect, useState } from "react";

type Line = {
  id: string;
  quantity: number;
  merchandise: any;
};

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Listen for custom toggle event
  useEffect(() => {
    const onToggle = (e: any) => setOpen(Boolean(e?.detail?.open ?? !open));
    window.addEventListener("cart:toggle", onToggle);
    return () => window.removeEventListener("cart:toggle", onToggle);
  }, []);

  // Load cart when drawer opens
  useEffect(() => {
    if (!open) return;
    loadCart();
  }, [open]);

  // -----------------------------
  // LOAD CART
  // -----------------------------
  async function loadCart() {
    setLoading(true);

    const cartId = localStorage.getItem("cartId");
    if (!cartId) {
      setCart(null);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/cart/get", {
      method: "POST",
      body: JSON.stringify({ cartId }),
    });

    const json = await res.json();
    setCart(json);

    // 🔥 Notify header to update cart count
    window.dispatchEvent(new Event("cart:updated"));

    setLoading(false);
  }

  // -----------------------------
  // CHANGE QTY
  // -----------------------------
  async function changeQty(lineId: string, newQty: number) {
    if (newQty <= 0) return removeLine(lineId);

    setLoading(true);

    const res = await fetch("/api/cart/update", {
      method: "POST",
      body: JSON.stringify({
        cartId: localStorage.getItem("cartId"),
        lineId,
        quantity: newQty,
      }),
    });

    const json = await res.json();
    setCart(json);

    // 🔥 Notify header
    window.dispatchEvent(new Event("cart:updated"));

    setLoading(false);
  }

  // -----------------------------
  // REMOVE ITEM
  // -----------------------------
  async function removeLine(lineId: string) {
    setLoading(true);

    const res = await fetch("/api/cart/remove", {
      method: "POST",
      body: JSON.stringify({
        cartId: localStorage.getItem("cartId"),
        lineId,
      }),
    });

    const json = await res.json();
    setCart(json);

    // 🔥 Notify header
    window.dispatchEvent(new Event("cart:updated"));

    setLoading(false);
  }

  // -----------------------------
  // CHECKOUT
  // -----------------------------
  async function goToCheckout() {
    const cartId = localStorage.getItem("cartId");
    if (!cartId) return alert("Cart is empty");

    const res = await fetch("/api/cart/get", {
      method: "POST",
      body: JSON.stringify({ cartId }),
    });

    const json = await res.json();
    if (json.checkoutUrl) {
      window.location.href = json.checkoutUrl;
    } else {
      alert("Checkout URL unavailable");
    }
  }

  return (
    <>
      {/* Background Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: open ? "block" : "none",
          background: "rgba(0,0,0,0.4)",
          zIndex: 90,
        }}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          height: "100vh",
          width: 380,
          maxWidth: "100%",
          background: "#fff",
          boxShadow: "-8px 0 30px rgba(0,0,0,0.12)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 250ms ease",
          zIndex: 100,
          padding: 20,
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>Cart</h3>
          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        {loading && <p>Loading...</p>}

        {!loading && !cart && <p>Your cart is empty.</p>}

        {!loading && cart && (
          <>
            {/* CART ITEMS */}
            <div style={{ marginTop: 12 }}>
              {cart.lines?.edges?.length === 0 && <p>Your cart is empty.</p>}

              {cart.lines.edges.map((edge: any) => {
                const node: Line = edge.node;
                const merch = node.merchandise;

                return (
                  <div
                    key={node.id}
                    style={{
                      display: "flex",
                      gap: 12,
                      marginBottom: 14,
                      borderBottom: "1px solid #eee",
                      paddingBottom: 14,
                    }}
                  >
                    <img
                      src={merch.image?.url}
                      alt={merch.title}
                      style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 6 }}
                    />

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{merch.product?.title}</div>
                      <div style={{ fontSize: 13 }}>{merch.title}</div>

                      {/* Quantity Buttons */}
                      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
                        <button
                          disabled={loading}
                          onClick={() => changeQty(node.id, node.quantity - 1)}
                          style={{
                            padding: "4px 8px",
                            border: "1px solid #ccc",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                        >
                          -
                        </button>

                        <span>{node.quantity}</span>

                        <button
                          disabled={loading}
                          onClick={() => changeQty(node.id, node.quantity + 1)}
                          style={{
                            padding: "4px 8px",
                            border: "1px solid #ccc",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                        >
                          +
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        disabled={loading}
                        onClick={() => removeLine(node.id)}
                        style={{
                          marginTop: 6,
                          fontSize: 13,
                          color: "tomato",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FOOTER TOTAL + CHECKOUT */}
            <div style={{ borderTop: "1px solid #eee", paddingTop: 12, marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: 600 }}>Total</div>
                <div style={{ fontWeight: 600 }}>
                  {cart.estimatedCost?.totalAmount?.amount}{" "}
                  {cart.estimatedCost?.totalAmount?.currencyCode}
                </div>
              </div>

              <button
                onClick={goToCheckout}
                style={{
                  marginTop: 12,
                  width: "100%",
                  padding: "12px 16px",
                  background: "#111",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
