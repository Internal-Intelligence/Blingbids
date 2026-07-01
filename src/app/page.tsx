import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VaultCarousel } from "@/components/vault/VaultCarousel";
import { BoostFundBanner } from "@/components/auction/BoostFundBanner";
import { ListingCard } from "@/components/auction/ListingCard";
import { SparkleOverlay } from "@/components/sparkle/SparkleOverlay";
import { MOCK_LISTINGS, MOCK_BOOST_FUND } from "@/lib/mock-data";
import { Zap, Shield, Gem } from "lucide-react";

export default function HomePage() {
  const liveListings = MOCK_LISTINGS.filter((l) => l.isLive);
  const vaultListings = MOCK_LISTINGS.filter((l) => !l.isLive);

  return (
    <div>
      <section className="relative mb-16 overflow-hidden rounded-3xl border border-bling-gold/20 bg-bling-card py-20 text-center">
        <SparkleOverlay intensity="high" />
        <div className="relative z-10">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            <span className="text-gold-gradient">Bling</span>
            <span className="text-white">bids</span>
            <span className="text-bling-gold/60">.com</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-bling-gold-light/80">
            The fun, interactive marketplace for jewelry & gold RWA. Bid with Solana or USD.
            Maximum trust. Insane prices. Under 90 seconds to sell.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/vault">
                <Gem className="h-5 w-5" />
                Enter Bling Vault
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/sell">
                <Zap className="h-5 w-5" />
                Quick Sell
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-16 grid gap-4 md:grid-cols-3">
        {[
          { icon: Shield, title: "Zero Trust Loss", desc: "Escrow + GIA certs + 7-day inspection + Brink's insured" },
          { icon: Zap, title: "Crypto-Fast", desc: "List in 90 seconds. Bid with SOL or USD. Instant settlement." },
          { icon: Gem, title: "Bling Boost Fund", desc: "25% of fees auto-subsidize boosts & prizes for everyone" },
        ].map((item) => (
          <div key={item.title} className="bling-card p-6 text-center">
            <item.icon className="mx-auto mb-3 h-8 w-8 text-bling-gold" />
            <h3 className="mb-2 font-semibold text-white">{item.title}</h3>
            <p className="text-sm text-bling-gold-light/60">{item.desc}</p>
          </div>
        ))}
      </section>

      <BoostFundBanner stats={MOCK_BOOST_FUND} />

      <div className="my-12">
        <VaultCarousel title="🔴 Live Now" listings={liveListings} />
        <VaultCarousel title="Bling Vault" listings={vaultListings} />
      </div>

      <section>
        <h2 className="mb-6 text-2xl font-bold text-gold-gradient">Featured Pieces</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_LISTINGS.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  );
}