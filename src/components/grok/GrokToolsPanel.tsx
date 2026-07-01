"use client";

import { useState } from "react";
import { useGrok } from "@/hooks/useGrok";
import { Button } from "@/components/ui/button";
import { formatUSD } from "@/lib/utils";
import type { AnalyzeListingResult, SuggestPricingResult, HoldAdvisorResult, LiveInsightsResult } from "@/lib/grok/types";
import { Sparkles, Loader2, TrendingUp, Shield, Pause } from "lucide-react";

interface GrokToolsPanelProps {
  mode: "sell-analyze" | "sell-pricing" | "live-buyer" | "live-seller";
  itemDescription?: string;
  category?: string;
  imageBase64?: string;
  imageUrl?: string;
  listing?: {
    title: string;
    category: string;
    currentBid: number;
    targetPrice: number;
    bidCount: number;
    viewerCount?: number;
  };
  onAnalyzeComplete?: (data: AnalyzeListingResult) => void;
  onPricingComplete?: (data: SuggestPricingResult) => void;
}

export function GrokToolsPanel({
  mode,
  itemDescription,
  category,
  imageBase64,
  imageUrl,
  listing,
  onAnalyzeComplete,
  onPricingComplete,
}: GrokToolsPanelProps) {
  const { loading, error, analyzeListing, suggestPricing, holdAdvisor, liveInsights } = useGrok();
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeListingResult | null>(null);
  const [pricingResult, setPricingResult] = useState<SuggestPricingResult | null>(null);
  const [holdResult, setHoldResult] = useState<HoldAdvisorResult | null>(null);
  const [insightsResult, setInsightsResult] = useState<LiveInsightsResult | null>(null);

  const runAnalyze = async () => {
    const res = await analyzeListing({ itemDescription, imageBase64, imageUrl });
    if (res?.data) {
      setAnalyzeResult(res.data);
      onAnalyzeComplete?.(res.data);
    }
  };

  const runPricing = async () => {
    const res = await suggestPricing({
      itemDescription: itemDescription ?? analyzeResult?.title ?? listing?.title ?? "jewelry item",
      category: category ?? analyzeResult?.category ?? listing?.category ?? "jewelry",
    });
    if (res?.data) {
      setPricingResult(res.data);
      onPricingComplete?.(res.data);
    }
  };

  const runHoldAdvisor = async () => {
    if (!listing) return;
    const res = await holdAdvisor(listing);
    if (res?.data) setHoldResult(res.data);
  };

  const runLiveInsights = async () => {
    if (!listing) return;
    const res = await liveInsights(listing);
    if (res?.data) setInsightsResult(res.data);
  };

  return (
    <div className="bling-card border border-bling-gold/20 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-bling-neon" />
        <h3 className="text-sm font-semibold text-gold-gradient">Bling AI Tools</h3>
        <span className="rounded-full bg-bling-gold/10 px-2 py-0.5 text-xs text-bling-gold">
          {mode === "sell-analyze" ? "grok-build" : "grok-4.3"}
        </span>
      </div>

      {error && <p className="mb-3 text-xs text-red-400">{error}</p>}

      {mode === "sell-analyze" && (
        <div className="space-y-3">
          <Button size="sm" onClick={runAnalyze} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            AI Scan & Auto-Fill
          </Button>
          {analyzeResult && (
            <div className="space-y-2 rounded-xl bg-bling-surface p-3 text-sm">
              <p className="font-semibold text-white">{analyzeResult.title}</p>
              <p className="text-bling-gold-light/70">{analyzeResult.description}</p>
              <p className="text-xs text-bling-gold">
                Category: {analyzeResult.category} · Confidence: {Math.round(analyzeResult.confidence * 100)}%
              </p>
              {analyzeResult.materials.length > 0 && (
                <p className="text-xs text-bling-gold-light/60">
                  Materials: {analyzeResult.materials.join(", ")}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {mode === "sell-pricing" && (
        <div className="space-y-3">
          <Button size="sm" onClick={runPricing} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />}
            AI Market Pricing
          </Button>
          {pricingResult && (
            <div className="space-y-2 rounded-xl bg-bling-surface p-3 text-sm">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-bling-gold-light/50">Start</p>
                  <p className="font-bold text-gold-gradient">{formatUSD(pricingResult.startPrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-bling-gold-light/50">Target</p>
                  <p className="font-bold text-white">{formatUSD(pricingResult.targetPrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-bling-gold-light/50">Reserve</p>
                  <p className="font-bold text-bling-gold">{formatUSD(pricingResult.hiddenReserve)}</p>
                </div>
              </div>
              <p className="text-xs text-bling-gold-light/70">{pricingResult.rationale}</p>
              <p className="text-xs text-bling-neon">💡 {pricingResult.cryptoPremiumTip}</p>
            </div>
          )}
        </div>
      )}

      {mode === "live-buyer" && listing && (
        <div className="space-y-3">
          <Button size="sm" variant="outline" onClick={runLiveInsights} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
            Get Bid Insights
          </Button>
          {insightsResult && (
            <div className="space-y-2 rounded-xl bg-bling-surface p-3 text-sm">
              <p className="text-bling-gold-light/80">{insightsResult.itemSummary}</p>
              <p className="font-medium text-bling-neon">{insightsResult.bidStrategy}</p>
              <p className="text-xs text-bling-gold">
                Fair value: {formatUSD(insightsResult.fairValueRange.low)} – {formatUSD(insightsResult.fairValueRange.high)}
              </p>
              <ul className="text-xs text-bling-gold-light/60">
                {insightsResult.watchFor.map((w, i) => (
                  <li key={i}>• {w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {mode === "live-seller" && listing && (
        <div className="space-y-3">
          <Button size="sm" variant="hold" onClick={runHoldAdvisor} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pause className="h-4 w-4" />}
            HOLD Advisor
          </Button>
          {holdResult && (
            <div className="space-y-2 rounded-xl bg-bling-surface p-3 text-sm">
              <p className="font-semibold capitalize text-bling-neon">
                Recommend: {holdResult.recommendedAction.replace("-", " ")}
              </p>
              <p className="text-bling-gold-light/80">{holdResult.reasoning}</p>
              <p className="text-xs text-bling-gold">Urgency: {holdResult.urgency}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
