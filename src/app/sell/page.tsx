import { QuickSellFlow } from "@/components/seller/QuickSellFlow";

export default function SellPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-gold-gradient">Quick Sell</h1>
      <p className="mb-8 text-bling-gold-light/70">
        Wallet → scan → verify → price → Go Live in under 90 seconds.
      </p>
      <QuickSellFlow />
    </div>
  );
}