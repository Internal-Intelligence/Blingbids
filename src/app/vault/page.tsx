import { VaultCarousel } from "@/components/vault/VaultCarousel";
import { ListingCard } from "@/components/auction/ListingCard";
import { MOCK_LISTINGS } from "@/lib/mock-data";

export default function VaultPage() {
  const categories = ["jewelry", "gold-bar", "diamond", "watch", "chain"] as const;

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-gold-gradient">Bling Vault</h1>
      <p className="mb-8 text-bling-gold-light/70">
        Browse verified jewelry, gold bars, diamonds & luxury watches — all escrow-protected.
      </p>

      <VaultCarousel title="🔴 Live Auctions" listings={MOCK_LISTINGS.filter((l) => l.isLive)} />

      {categories.map((cat) => {
        const items = MOCK_LISTINGS.filter((l) => l.category === cat);
        if (items.length === 0) return null;
        return (
          <section key={cat} className="mb-12">
            <h2 className="mb-4 text-xl font-bold capitalize text-white">{cat.replace("-", " ")}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}