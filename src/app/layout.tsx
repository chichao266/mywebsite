import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/lib/cart-context";
import { HeaderStyles } from "@/components/header-styles";
import { getSiteUrl } from "@/lib/env";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

function getMetadataBase(): URL | undefined {
  try {
    return new URL(getSiteUrl());
  } catch {
    return undefined;
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: { default: "Avoryne — Lab-Grown Diamond & Gemstone Jewelry", template: "%s | Avoryne" },
  description: "Modern lab-grown diamond and colored gemstone jewelry for everyday brilliance.",
  keywords: ["lab-grown diamond jewelry", "lab-grown gemstone jewelry", "colored gemstone jewelry"],
  openGraph: {
    siteName: "Avoryne",
    title: "Avoryne",
    description: "Modern lab-grown diamond and colored gemstone jewelry.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <HeaderStyles />
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
