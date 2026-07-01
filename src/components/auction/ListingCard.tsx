"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrustBadgeRow } from "@/components/ui/badge";
import { SparkleOverlay } from "@/components/sparkle/SparkleOverlay";
import { formatUSD } from "@/lib/utils";
import type { Listing } from "@/lib/types";
import { Users, Radio } from "lucide-react";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const href = listing.isLive ? `/live/${listing.id}` : `/auction/${listing.id}`;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bling-card group relative overflow-hidden"
    >
      <SparkleOverlay intensity="low" />
      <Link href={href} className="block p-4">
        <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-bling-surface">
          <div className="flex h-full items-center justify-center text-6xl">💎</div>
          {listing.isLive && (
            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold">
              <Radio className="h-3 w-3 animate-pulse" />
              LIVE
            </span>
          )}
          {listing.viewerCount && (
            <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs">
              <Users className="h-3 w-3" />
              {listing.viewerCount}
            </span>
          )}
        </div>

        <h3 className="mb-1 font-semibold text-white group-hover:text-bling-neon">
          {listing.title}
        </h3>
        <p className="mb-2 text-sm text-bling-gold-light/60">{listing.sellerName}</p>

        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <p className="text-xs text-bling-gold-light/50">Current Bid</p>
            <p className="text-lg font-bold text-gold-gradient">{formatUSD(listing.currentBid)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-bling-gold-light/50">Target</p>
            <p className="text-sm text-bling-gold">{formatUSD(listing.targetPrice)}</p>
          </div>
        </div>

        <TrustBadgeRow badges={listing.trustBadges} />
      </Link>
    </motion.div>
  );
}