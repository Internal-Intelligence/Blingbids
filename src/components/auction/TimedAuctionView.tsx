"use client";

import { BidPanel } from "@/components/auction/BidPanel";
import { TrustPanel } from "@/components/auction/TrustPanel";
import { TrustBadgeRow } from "@/components/ui/badge";
import type { Listing } from "@/lib/types";
import { Clock } from "lucide-react";

export function TimedAuctionView({ listing }: { listing: Listing }) {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="bling-card mb-6 flex aspect-video items-center justify-center text-8xl">
          💎
        </div>
        <h1 className="mb-2 text-2xl font-bold text-white">{listing.title}</h1>
        <p className="mb-4 text-bling-gold-light/70">{listing.description}</p>
        <TrustBadgeRow badges={listing.trustBadges} />
        {listing.endsAt && (
          <p className="mt-4 flex items-center gap-2 text-sm text-bling-gold">
            <Clock className="h-4 w-4" />
            Ends {new Date(listing.endsAt).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="space-y-4">
        <BidPanel
          currentBid={listing.currentBid}
          targetPrice={listing.targetPrice}
          onBid={() => {}}
        />
        <TrustPanel listing={listing} />
      </div>
    </div>
  );
}