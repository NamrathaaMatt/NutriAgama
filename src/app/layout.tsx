
import type { Metadata } from "next";
import { ToastProvider } from "@/frontend/hooks/use-toast";
import { ProductsProvider } from "@/frontend/hooks/use-products";
import { WishlistProvider } from "@/frontend/hooks/use-wishlist";
import { CartProvider } from "@/frontend/hooks/use-cart";
import Footer from "@/frontend/home/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nutriagama — Good health, rooted in tradition",
  description:
    "NutriAgama — traditional Indian wellness, thoughtfully crafted for modern life.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <ProductsProvider>
            <WishlistProvider>
              <CartProvider>
                {children}
                <Footer />
              </CartProvider>
            </WishlistProvider>
          </ProductsProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
