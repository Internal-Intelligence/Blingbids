"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { formatUSD } from "@/lib/utils";
import { AI_TOOL_LABELS } from "@/lib/merchant/ai-tool-map";
import type { AISale, AISaleDeclaration } from "@/lib/merchant/types";
import { AlertTriangle, Check, FileText, Loader2, Shield } from "lucide-react";

const DEMO_MERCHANT_ID = "merchant-1";

export function TurnoverReportForm() {
  const [periodStart, setPeriodStart] = useState("2026-06-01");
  const [periodEnd, setPeriodEnd] = useState("2026-06-30");
  const [pendingSales, setPendingSales] = useState<AISale[]>([]);
  const [declarations, setDeclarations] = useState<AISaleDeclaration[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);

  const [totals, setTotals] = useState({
    totalTurnover: "",
    totalPlatformFees: "",
    totalTransactions: "",
  });

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        merchantId: DEMO_MERCHANT_ID,
        pending: "true",
        periodStart,
        periodEnd,
      });
      const res = await fetch(`/api/merchant/ai-sales?${params}`);
      const data = await res.json();
      const sales: AISale[] = data.sales ?? [];
      setPendingSales(sales);
      setDeclarations(
        sales.map((s) => ({
          aiSaleId: s.id,
          listingTitle: s.listingTitle,
          saleAmount: s.saleAmount,
          saleDate: s.saleDate,
          aiToolsUsed: s.aiToolsUsed,
          notes: "",
        }))
      );
      const turnover = sales.reduce((sum, s) => sum + s.saleAmount, 0);
      const fees = sales.reduce((sum, s) => sum + s.platformFees, 0);
      setTotals({
        totalTurnover: String(turnover || ""),
        totalPlatformFees: String(Math.round(fees * 100) / 100 || ""),
        totalTransactions: String(sales.length || ""),
      });
    } catch {
      setError("Failed to load pending AI sales");
    } finally {
      setLoading(false);
    }
  }, [periodStart, periodEnd]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const allListed = pendingSales.length > 0 && declarations.length === pendingSales.length;
  const missingCount = pendingSales.filter(
    (s) => !declarations.some((d) => d.aiSaleId === s.id)
  ).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    setFieldErrors([]);

    try {
      const res = await fetch("/api/merchant/turnover-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantId: DEMO_MERCHANT_ID,
          periodStart: new Date(periodStart).toISOString(),
          periodEnd: new Date(periodEnd + "T23:59:59").toISOString(),
          totalTurnover: Number(totals.totalTurnover),
          totalPlatformFees: Number(totals.totalPlatformFees),
          totalTransactions: Number(totals.totalTransactions),
          aiSalesListed: declarations,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Submission failed");
        setFieldErrors(data.errors ?? []);
        return;
      }

      setSuccess(data.message);
      fetchPending();
    } catch {
      setError("Network error submitting report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bling-card border border-amber-500/30 bg-amber-500/5 p-4">
        <div className="flex gap-3">
          <Shield className="h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="font-semibold text-amber-200">Mandatory AI Sales Disclosure</p>
            <p className="text-sm text-amber-200/70">
              Every AI-assisted sale must be listed by the merchant each time a turnover report is
              submitted. Reports are blocked until all pending AI sales in the period are declared.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs text-bling-gold-light/60">Period Start</label>
          <input
            type="date"
            value={periodStart}
            onChange={(e) => setPeriodStart(e.target.value)}
            className="mt-1 w-full rounded-xl border border-bling-border bg-bling-surface px-4 py-3 text-white"
          />
        </div>
        <div>
          <label className="text-xs text-bling-gold-light/60">Period End</label>
          <input
            type="date"
            value={periodEnd}
            onChange={(e) => setPeriodEnd(e.target.value)}
            className="mt-1 w-full rounded-xl border border-bling-border bg-bling-surface px-4 py-3 text-white"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {(["totalTurnover", "totalPlatformFees", "totalTransactions"] as const).map((key) => (
          <div key={key}>
            <label className="text-xs capitalize text-bling-gold-light/60">
              {key.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="number"
              value={totals[key]}
              onChange={(e) => setTotals({ ...totals, [key]: e.target.value })}
              className="mt-1 w-full rounded-xl border border-bling-border bg-bling-surface px-4 py-3 text-white"
              required
            />
          </div>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gold-gradient">
            AI Sales Listing ({pendingSales.length} required)
          </h2>
          {loading && <Loader2 className="h-4 w-4 animate-spin text-bling-gold" />}
        </div>

        {pendingSales.length === 0 && !loading && (
          <p className="rounded-xl border border-bling-border bg-bling-surface p-4 text-sm text-bling-gold-light/60">
            No pending AI-assisted sales in this period. You may still submit turnover totals.
          </p>
        )}

        <div className="space-y-4">
          {declarations.map((decl, i) => (
            <div key={decl.aiSaleId} className="bling-card p-4">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">{decl.listingTitle}</p>
                  <p className="text-sm text-gold-gradient">{formatUSD(decl.saleAmount)}</p>
                  <p className="text-xs text-bling-gold-light/50">
                    {new Date(decl.saleDate).toLocaleDateString()}
                  </p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
                  <Check className="h-3 w-3" />
                  Listed
                </span>
              </div>
              <div className="mb-3 flex flex-wrap gap-1">
                {decl.aiToolsUsed.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-bling-gold/30 bg-bling-gold/10 px-2 py-0.5 text-xs text-bling-gold"
                  >
                    {AI_TOOL_LABELS[tool]}
                  </span>
                ))}
              </div>
              <input
                placeholder="Merchant notes (optional)"
                value={decl.notes ?? ""}
                onChange={(e) => {
                  const next = [...declarations];
                  next[i] = { ...decl, notes: e.target.value };
                  setDeclarations(next);
                }}
                className="w-full rounded-xl border border-bling-border bg-bling-surface px-3 py-2 text-sm text-white"
              />
            </div>
          ))}
        </div>

        {missingCount > 0 && (
          <p className="mt-3 flex items-center gap-2 text-sm text-red-400">
            <AlertTriangle className="h-4 w-4" />
            {missingCount} AI sale(s) not listed — submission will be blocked
          </p>
        )}
      </section>

      {fieldErrors.length > 0 && (
        <ul className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {fieldErrors.map((err) => (
            <li key={err}>• {err}</li>
          ))}
        </ul>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && (
        <p className="flex items-center gap-2 text-sm text-emerald-400">
          <Check className="h-4 w-4" />
          {success}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={submitting || (pendingSales.length > 0 && !allListed)}
        className="w-full md:w-auto"
      >
        {submitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <FileText className="h-5 w-5" />
        )}
        Submit Turnover Report
        {pendingSales.length > 0 && ` (${pendingSales.length} AI sales)`}
      </Button>
    </form>
  );
}