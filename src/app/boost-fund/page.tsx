import { BoostFundBanner } from "@/components/auction/BoostFundBanner";
import { MOCK_BOOST_FUND } from "@/lib/mock-data";
import { formatUSD } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

const LEDGER_ENTRIES = [
  { date: "2026-06-28", type: "Fee Reroute", amount: 1240, auction: "Cuban Link Chain" },
  { date: "2026-06-27", type: "Featured Subsidy", amount: -500, auction: "Rolex Submariner" },
  { date: "2026-06-27", type: "Mystery Prize", amount: -250, auction: "Platform-wide" },
  { date: "2026-06-26", type: "Creator Royalty", amount: 180, auction: "2.5ct Diamond" },
  { date: "2026-06-25", type: "Fee Reroute", amount: 890, auction: "PAMP Gold Bar" },
];

export default function BoostFundPage() {
  return (
    <div>
      <h1 className="mb-2 font-display text-3xl font-semibold text-bling-ivory">Bling Boost Fund</h1>
      <p className="mb-8 max-w-2xl text-bling-muted">
        25% of every platform fee is instantly routed on-chain to this transparent fund.
        It auto-subsidizes featured slots, boosts, mystery prizes, and promotions for ALL auctions.
      </p>

      <BoostFundBanner stats={MOCK_BOOST_FUND} />

      <section className="mt-12">
        <h2 className="mb-4 font-display text-xl font-semibold text-bling-ivory">On-Chain Transparency Ledger</h2>
        <div className="bling-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-bling-muted">
                <th className="p-4">Date</th>
                <th className="p-4">Type</th>
                <th className="p-4">Auction</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {LEDGER_ENTRIES.map((entry, i) => (
                <tr key={i} className="border-b border-white/[0.06]">
                  <td className="p-4 text-bling-muted">{entry.date}</td>
                  <td className="p-4 text-bling-ivory">{entry.type}</td>
                  <td className="p-4 text-bling-muted">{entry.auction}</td>
                  <td className={`p-4 text-right font-mono ${entry.amount > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {entry.amount > 0 ? "+" : ""}{formatUSD(Math.abs(entry.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 bling-card p-6">
        <h3 className="mb-2 font-semibold text-bling-ivory">Monthly Vault Proof</h3>
        <p className="mb-4 text-sm text-bling-muted">
          Third-party attestation of fund reserves — updated monthly (Oro/PAXG-style).
        </p>
        <a
          href={MOCK_BOOST_FUND.lastVaultProofUrl}
          className="inline-flex items-center gap-2 text-sm text-bling-ice hover:underline"
        >
          View June 2026 Vault Proof
          <ExternalLink className="h-4 w-4" />
        </a>
      </section>
    </div>
  );
}