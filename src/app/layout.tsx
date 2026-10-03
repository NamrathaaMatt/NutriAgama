import type { Metadata } from "next";
import { ToastProvider } from "@/frontend/hooks/use-toast";
import { ProductsProvider } from "@/frontend/hooks/use-products";
import { WishlistProvider } from "@/frontend/hooks/use-wishlist";
import { CartProvider } from "@/frontend/hooks/use-cart";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nutriagama — Good health, rooted in tradition",
  description:
    "Everyday nutrition inspired by Karnataka's timeless food wisdom.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <ProductsProvider>
            <WishlistProvider>
              <CartProvider>{children}</CartProvider>
            </WishlistProvider>
          </ProductsProvider>
        </ToastProvider>
      </body>
    </html>
  );
}