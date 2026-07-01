import Link from "next/link";
import { FileText, Sparkles, AlertTriangle } from "lucide-react";

export default function MerchantPortalPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-gold-gradient">Merchant Portal</h1>
      <p className="mb-8 text-bling-gold-light/70">
        Manage turnover reporting and AI-assisted sale disclosures for Blingbids.com.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/merchant/turnover"
          className="bling-card group p-6 transition-colors hover:border-bling-gold/50"
        >
          <FileText className="mb-3 h-8 w-8 text-bling-gold group-hover:text-bling-neon" />
          <h2 className="mb-2 font-semibold text-white">Submit Turnover Report</h2>
          <p className="text-sm text-bling-gold-light/60">
            File period turnover. All AI sales must be listed on every submission.
          </p>
        </Link>

        <div className="bling-card border border-amber-500/20 p-6">
          <AlertTriangle className="mb-3 h-8 w-8 text-amber-400" />
          <h2 className="mb-2 font-semibold text-white">AI Sales Policy</h2>
          <p className="text-sm text-bling-gold-light/60">
            Any sale using Grok AI tools (listing scan, pricing, images, cert check) must be
            declared in your next turnover report. Missing declarations block submission.
          </p>
        </div>

        <div className="bling-card p-6 md:col-span-2">
          <Sparkles className="mb-3 h-8 w-8 text-bling-neon" />
          <h2 className="mb-2 font-semibold text-white">Tracked AI Tools</h2>
          <div className="flex flex-wrap gap-2 text-xs text-bling-gold-light/70">
            {[
              "Grok AI Scan",
              "Grok Market Pricing",
              "Grok Imagine Photo",
              "Grok Cert Check",
              "HOLD Advisor",
              "Bling AI Chat",
            ].map((t) => (
              <span key={t} className="rounded-full border border-bling-border px-3 py-1">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}