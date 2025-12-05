import HeaderCart from "@/components/HeaderCart";
import CartDrawer from "@/components/CartDrawer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <header style={{ padding: 16, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between" }}>
   
          <HeaderCart />
        </header>

        <main>{children}</main>

        <CartDrawer />
      </body>
    </html>
  );
}
