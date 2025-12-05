"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HeaderCart() {
  const [count, setCount] = useState<number>(0);

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
    const total = lines.reduce(
      (acc: number, edge: any) => acc + (edge.node.quantity || 0),
      0
    );
    setCount(total);
  }

  function openDrawer() {
    window.dispatchEvent(
      new CustomEvent("cart:toggle", { detail: { open: true } })
    );
  }

  return (
    <header
      style={{
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "#fff",
        borderBottom: "1px solid #e5e5e5",
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "15px 25px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "40px",
        }}
      >
        {/* LEFT — LOGO */}
        <Link
          href="/"
          style={{
            fontSize: "22px",
            fontWeight: "700",
            whiteSpace: "nowrap",
            color: "#111",
            textDecoration: "none",
          }}
        >
          My Store
        </Link>

        {/* MIDDLE — NAVIGATION */}
        <nav
          style={{
            display: "flex",
            gap: "35px",
            flexGrow: 1,
            justifyContent: "center",
            fontSize: "16px",
          }}
        >
          <Link
            href="/products"
            style={{
              color: "#333",
              textDecoration: "none",
              transition: "0.2s",
            }}
          >
            Collections
          </Link>

          <Link
            href="/about"
            style={{
              color: "#333",
              textDecoration: "none",
              transition: "0.2s",
            }}
          >
            About Us
          </Link>
        </nav>

        {/* RIGHT — CART */}
        <button
          onClick={openDrawer}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 18px",
            borderRadius: "30px",
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          🛒 Cart
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "22px",
              height: "22px",
              background: "#000",
              color: "#fff",
              borderRadius: "50%",
              fontSize: "12px",
              padding: "3px",
            }}
          >
            {count}
          </span>
        </button>
      </div>
    </header>
  );
}
