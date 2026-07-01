import { QuickSellFlow } from "@/components/seller/QuickSellFlow";

export default function SellPage() {
  return (
    <div>
      <h1 className="mb-2 font-display text-3xl font-semibold text-bling-ivory">Quick Sell</h1>
      <p className="mb-8 text-bling-muted">
        Wallet → scan → verify → price → Go Live in under 90 seconds.
      </p>
      <QuickSellFlow />
    </div>
  );
}