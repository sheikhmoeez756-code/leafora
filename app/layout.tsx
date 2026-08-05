import type { Metadata } from "next";
import { Marcellus, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";

const marcellus = Marcellus({
  variable: "--font-marcellus",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Leafora — Bring Nature Home",
  description:
    "Curated plants for every space and every plant parent. Beautiful plants. Happy spaces. Better you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${marcellus.variable} ${inter.variable} antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
