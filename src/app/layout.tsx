import type { Metadata } from "next";
import { Caveat, Fraunces, Inter, Oswald } from "next/font/google";
import { ToastProvider } from "@/frontend/hooks/use-toast";
import { ProductsProvider } from "@/frontend/hooks/use-products";
import { WishlistProvider } from "@/frontend/hooks/use-wishlist";
import { CartProvider } from "@/frontend/hooks/use-cart";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["400", "500"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-navbar",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Nutriagama — Good health, rooted in tradition",
  description:
    "NutriAgama — traditional Indian wellness, thoughtfully crafted for modern life.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${caveat.variable} ${inter.variable} ${oswald.variable}`}
    >
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