import Link from "next/link";
import { formatUSD } from "@/lib/utils";
import type { BoostFundStats } from "@/lib/types";
import { Sparkles } from "lucide-react";

interface BoostFundBannerProps {
  stats: BoostFundStats;
  compact?: boolean;
}

export function BoostFundBanner({ stats, compact }: BoostFundBannerProps) {
  if (compact) {
    return (
      <Link
        href="/boost-fund"
        className="flex items-center gap-2 rounded-xl border border-bling-gold/30 bg-bling-gold/5 px-4 py-2 text-sm transition-colors hover:bg-bling-gold/10"
      >
        <Sparkles className="h-4 w-4 text-bling-neon" />
        <span className="text-bling-gold-light">
          Boost Fund: <span className="font-semibold text-bling-neon">{formatUSD(stats.totalCollected)}</span> collected
        </span>
      </Link>
    );
  }

  return (
    <div className="bling-card overflow-hidden">
      <div className="bg-gold-gradient px-5 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-bling-black" />
          <h3 className="font-bold text-bling-black">Bling Boost Fund</h3>
        </div>
        <p className="text-xs text-bling-black/70">25% of every platform fee → free boosts & prizes for ALL</p>
      </div>
      <div className="grid grid-cols-2 gap-4 p-5 md:grid-cols-4">
        <div>
          <p className="text-xs text-bling-gold-light/60">Total Collected</p>
          <p className="text-lg font-bold text-gold-gradient">{formatUSD(stats.totalCollected)}</p>
        </div>
        <div>
          <p className="text-xs text-bling-gold-light/60">Distributed</p>
          <p className="text-lg font-bold text-white">{formatUSD(stats.totalDistributed)}</p>
        </div>
        <div>
          <p className="text-xs text-bling-gold-light/60">Featured Slots</p>
          <p className="text-lg font-bold text-white">{stats.featuredSlotsSubsidized.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-bling-gold-light/60">Mystery Prizes</p>
          <p className="text-lg font-bold text-white">{stats.mysteryPrizesAwarded}</p>
        </div>
      </div>
      <div className="border-t border-bling-border px-5 py-3">
        <Link href="/boost-fund" className="text-sm text-bling-gold hover:text-bling-neon">
          View transparent on-chain ledger →
        </Link>
      </div>
    </div>
  );
}