import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-bling-border bg-bling-surface py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-bold text-gold-gradient">Blingbids.com</h3>
            <p className="text-sm text-bling-gold-light/70">
              The fun, trust-maximizing marketplace for jewelry & gold RWA auctions on Solana.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-bling-gold">Marketplace</h4>
            <ul className="space-y-2 text-sm text-bling-gold-light/70">
              <li><Link href="/vault" className="hover:text-bling-neon">Bling Vault</Link></li>
              <li><Link href="/live" className="hover:text-bling-neon">Live Rooms</Link></li>
              <li><Link href="/sell" className="hover:text-bling-neon">Sell Your Bling</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-bling-gold">Trust</h4>
            <ul className="space-y-2 text-sm text-bling-gold-light/70">
              <li><Link href="/attestation" className="hover:text-bling-neon">Attestation Dashboard</Link></li>
              <li><Link href="/boost-fund" className="hover:text-bling-neon">Boost Fund Transparency</Link></li>
              <li><a href="#" className="hover:text-bling-neon">Vault Proof (Monthly)</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-bling-gold">Legal</h4>
            <ul className="space-y-2 text-sm text-bling-gold-light/70">
              <li><a href="#" className="hover:text-bling-neon">Terms of Service</a></li>
              <li><a href="#" className="hover:text-bling-neon">Escrow Policy</a></li>
              <li><a href="#" className="hover:text-bling-neon">7-Day Inspection Guarantee</a></li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-bling-gold-light/50">
          © 2026 Blingbids.com — Jewelry & Gold RWA Auctions. All rights reserved.
        </p>
      </div>
    </footer>
  );
}