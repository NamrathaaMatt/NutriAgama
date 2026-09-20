import type { Metadata } from "next";
<<<<<<< HEAD
import { Fraunces, Inter } from "next/font/google";
=======
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@/frontend/hooks/use-toast";
import { WishlistProvider } from "@/frontend/hooks/use-wishlist";
import { CartProvider } from "@/frontend/hooks/use-cart";

>>>>>>> origin/main
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
<<<<<<< HEAD
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable}`}>
        {children}
=======
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ToastProvider>
          <WishlistProvider>
            <CartProvider>{children}</CartProvider>
          </WishlistProvider>
        </ToastProvider>
>>>>>>> origin/main
      </body>
    </html>
  );
}