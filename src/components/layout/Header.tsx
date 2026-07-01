"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gem, Wallet, Plus } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-bling-border/50 bg-bling-black/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Gem className="h-8 w-8 text-bling-gold" />
          <span className="font-display text-xl font-bold">
            <span className="text-gold-gradient">Bling</span>
            <span className="text-white">bids</span>
            <span className="text-xs text-bling-gold/60">.com</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/vault" className="text-sm text-bling-gold-light hover:text-bling-neon">
            Bling Vault
          </Link>
          <Link href="/live" className="text-sm text-bling-gold-light hover:text-bling-neon">
            Live Auctions
          </Link>
          <Link href="/boost-fund" className="text-sm text-bling-gold-light hover:text-bling-neon">
            Boost Fund
          </Link>
          <Link href="/attestation" className="text-sm text-bling-gold-light hover:text-bling-neon">
            Trust Dashboard
          </Link>
          <Link href="/merchant" className="text-sm text-bling-gold-light hover:text-bling-neon">
            Merchant
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/sell">
              <Plus className="h-4 w-4" />
              Quick Sell
            </Link>
          </Button>
          <Button size="sm">
            <Wallet className="h-4 w-4" />
            Connect
          </Button>
        </div>
      </div>
    </header>
  );
}