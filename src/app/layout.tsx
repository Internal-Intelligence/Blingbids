import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BlingAssistant } from "@/components/grok/BlingAssistant";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Blingbids.com — Jewelry & Gold RWA Live Auctions",
  description:
    "The fun, trust-maximizing marketplace for jewelry, gold bars, diamonds & luxury watches. Bid with Solana or USD. Zero trust loss.",
  metadataBase: new URL("https://blingbids.com"),
  openGraph: {
    title: "Blingbids.com",
    description: "Crypto-fast jewelry & gold RWA auctions on Solana",
    url: "https://blingbids.com",
    siteName: "Blingbids",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-body min-h-screen`}>
        <Header />
        <main className="mx-auto min-h-[calc(100vh-8rem)] max-w-7xl px-4 py-8">
          {children}
        </main>
        <Footer />
        <BlingAssistant />
      </body>
    </html>
  );
}