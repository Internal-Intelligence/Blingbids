import Link from "next/link";
import { MOCK_LISTINGS } from "@/lib/mock-data";
import { Radio, Users } from "lucide-react";

export default function LiveIndexPage() {
  const live = MOCK_LISTINGS.filter((l) => l.isLive);

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-gold-gradient">Live Auction Rooms</h1>
      <p className="mb-8 text-bling-gold-light/70">Join live jewelry & gold auctions happening right now.</p>

      <div className="grid gap-4 md:grid-cols-2">
        {live.map((listing) => (
          <Link
            key={listing.id}
            href={`/live/${listing.id}`}
            className="bling-card group flex gap-4 p-4 transition-colors hover:border-bling-gold/50"
          >
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-bling-surface text-4xl">
              💎
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold">
                  <Radio className="h-3 w-3 animate-pulse" />
                  LIVE
                </span>
                <span className="flex items-center gap-1 text-xs text-bling-gold-light/60">
                  <Users className="h-3 w-3" />
                  {listing.viewerCount}
                </span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-bling-neon">{listing.title}</h3>
              <p className="text-sm text-gold-gradient">
                ${listing.currentBid.toLocaleString()} · Target ${listing.targetPrice.toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}