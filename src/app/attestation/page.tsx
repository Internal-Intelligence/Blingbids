import { TrustBadgeRow } from "@/components/ui/badge";
import type { TrustBadge } from "@/lib/types";
import { Shield, Video, FileCheck, Link2 } from "lucide-react";

const ATTESTATIONS = [
  {
    listing: "18K Gold Cuban Link Chain",
    seller: "GoldVault_NYC",
    badges: ["bling-verified", "gia-certified", "brinks-insured", "money-back"] as TrustBadge[],
    videoVerified: true,
    certVerified: true,
    escrowActive: true,
    lastUpdated: "2026-06-30T14:22:00Z",
  },
  {
    listing: "Rolex Submariner Date",
    seller: "LuxTime_Collective",
    badges: ["bling-verified", "gia-certified", "money-back"] as TrustBadge[],
    videoVerified: true,
    certVerified: true,
    escrowActive: true,
    lastUpdated: "2026-06-30T12:10:00Z",
  },
];

export default function AttestationPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-gold-gradient">Live Attestation Dashboard</h1>
      <p className="mb-8 text-bling-gold-light/70">
        Real-time verification status for every active listing on Blingbids.com.
      </p>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {[
          { label: "Verified Sellers", value: "847" },
          { label: "Active Escrows", value: "124" },
          { label: "Certs on File", value: "1,203" },
          { label: "Insured Shipments", value: "98%" },
        ].map((stat) => (
          <div key={stat.label} className="bling-card p-4 text-center">
            <p className="text-2xl font-bold text-gold-gradient">{stat.value}</p>
            <p className="text-xs text-bling-gold-light/60">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {ATTESTATIONS.map((item) => (
          <div key={item.listing} className="bling-card p-5">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-white">{item.listing}</h3>
                <p className="text-sm text-bling-gold-light/60">Seller: {item.seller}</p>
              </div>
              <TrustBadgeRow badges={item.badges} />
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1 text-emerald-400">
                <Video className="h-4 w-4" /> Video ✓
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <FileCheck className="h-4 w-4" /> Cert ✓
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Shield className="h-4 w-4" /> Escrow Active
              </span>
              <span className="flex items-center gap-1 text-bling-gold-light/50">
                <Link2 className="h-4 w-4" /> On-chain logged
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}