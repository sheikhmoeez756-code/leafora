import type { Metadata } from "next";
import { Marcellus, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { SITE_URL } from "@/lib/site";

const marcellus = Marcellus({
  variable: "--font-marcellus",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const description =
  "Curated plants for every space and every plant parent. Beautiful plants. Happy spaces. Better you.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Leafora — Bring Nature Home",
    template: "%s",
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Leafora — Bring Nature Home",
    description,
    url: "/",
    siteName: "Leafora",
    type: "website",
    images: [{ url: "/plants/monstera.jpg", width: 1200, height: 1200, alt: "Leafora" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leafora — Bring Nature Home",
    description,
    images: ["/plants/monstera.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${marcellus.variable} ${inter.variable} antialiased`}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
