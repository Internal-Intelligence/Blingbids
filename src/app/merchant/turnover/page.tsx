import { TurnoverReportForm } from "@/components/merchant/TurnoverReportForm";
import Link from "next/link";

export default function MerchantTurnoverPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="mb-1 text-sm text-bling-gold">Merchant Portal · Blingbids.com</p>
        <h1 className="mb-2 text-3xl font-bold text-gold-gradient">Turnover Report</h1>
        <p className="max-w-2xl text-bling-gold-light/70">
          Submit your period turnover to Blingbids. All AI-assisted sales must be fully listed
          every time you file — this is required for compliance and Boost Fund transparency.
        </p>
        <Link
          href="/merchant"
          className="mt-2 inline-block text-sm text-bling-gold hover:text-bling-neon"
        >
          ← Merchant dashboard
        </Link>
      </div>

      <TurnoverReportForm />
    </div>
  );
}