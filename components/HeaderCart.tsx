"use client";

import { useEffect, useState } from "react";

export default function HeaderCart() {
  const [count, setCount] = useState<number>(0);

  // on load, fetch cart
  useEffect(() => {
    fetchCount();
    const onUpdate = () => fetchCount();
    window.addEventListener("cart:updated", onUpdate);
    return () => window.removeEventListener("cart:updated", onUpdate);
  }, []);

  async function fetchCount() {
    const cartId = localStorage.getItem("cartId");
    if (!cartId) {
      setCount(0);
      return;
    }
    const res = await fetch("/api/cart/get", {
      method: "POST",
      body: JSON.stringify({ cartId }),
    });
    const json = await res.json();
    const lines = json?.lines?.edges || [];
    const total = lines.reduce((acc: number, edge: any) => acc + (edge.node.quantity || 0), 0);
    setCount(total);
  }

  function openDrawer() {
    window.dispatchEvent(new CustomEvent("cart:toggle", { detail: { open: true } }));
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <button onClick={openDrawer} style={{ position: "relative", padding: "6px 10px", cursor: "pointer" }}>
        Cart
        <span style={{
          marginLeft: 8,
          background: "#000",
          color: "#fff",
          borderRadius: 999,
          padding: "4px 8px",
          fontSize: 12,
        }}>
          {count}
        </span>
      </button>
    </div>
  );
}
