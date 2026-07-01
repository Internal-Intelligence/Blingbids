import { TrustBadgeRow } from "@/components/ui/badge";
import type { Listing } from "@/lib/types";
import { Shield, FileCheck, Truck, RotateCcw } from "lucide-react";

interface TrustPanelProps {
  listing: Listing;
}

const TRUST_ITEMS = [
  { icon: Shield, label: "Platform Escrow", desc: "Solana smart contract + fiat partner" },
  { icon: Truck, label: "Insured Shipping", desc: "Brink's insured delivery worldwide" },
  { icon: RotateCcw, label: "7-Day Inspection", desc: "Full money-back guarantee" },
  { icon: FileCheck, label: "On-Chain Logging", desc: "Every bid & HOLD action recorded" },
];

export function TrustPanel({ listing }: TrustPanelProps) {
  return (
    <div className="bling-card space-y-4 p-5">
      <h3 className="font-semibold text-gold-gradient">Trust & Verification</h3>

      <TrustBadgeRow badges={listing.trustBadges} />

      {listing.certNumber && (
        <div className="rounded-xl border border-blue-400/30 bg-blue-400/5 p-3">
          <p className="text-xs text-blue-300/60">Certificate Number</p>
          <p className="font-mono text-sm text-blue-200">{listing.certNumber}</p>
          <button type="button" className="mt-1 text-xs text-blue-400 underline hover:text-blue-300">
            View Certificate →
          </button>
        </div>
      )}

      <div className="space-y-3">
        {TRUST_ITEMS.map((item) => (
          <div key={item.label} className="flex items-start gap-3">
            <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-bling-gold" />
            <div>
              <p className="text-sm font-medium text-white">{item.label}</p>
              <p className="text-xs text-bling-gold-light/60">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <a
        href="https://blingbids.com/attestation"
        className="block rounded-xl border border-bling-gold/30 bg-bling-gold/5 p-3 text-center text-sm text-bling-gold hover:bg-bling-gold/10"
      >
        View Live Attestation Dashboard →
      </a>
    </div>
  );
}