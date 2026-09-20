import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { ToastProvider } from "@/frontend/hooks/use-toast";
import { WishlistProvider } from "@/frontend/hooks/use-wishlist";
import { CartProvider } from "@/frontend/hooks/use-cart";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Nutriagama — Good health, rooted in tradition",
  description:
    "Everyday nutrition inspired by Karnataka's timeless food wisdom.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <ToastProvider>
          <WishlistProvider>
            <CartProvider>{children}</CartProvider>
          </WishlistProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
