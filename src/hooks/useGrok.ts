"use client";

import { useState, useCallback, useRef } from "react";
import { GROK_TOOL_TO_AI_SALE } from "@/lib/merchant/ai-tool-map";
import type { AISaleTool } from "@/lib/merchant/types";
import type {
  GrokTool,
  GrokChatMessage,
  AnalyzeListingResult,
  SuggestPricingResult,
  VerifyCertResult,
  HoldAdvisorResult,
  LiveInsightsResult,
  GenerateImageResult,
} from "@/lib/grok/types";

interface GrokState {
  loading: boolean;
  error: string | null;
}

async function callGrok<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch("/api/grok", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Grok request failed");
  return data as T;
}

export function useGrok() {
  const [state, setState] = useState<GrokState>({ loading: false, error: null });
  const aiToolsUsedRef = useRef<Set<AISaleTool>>(new Set());

  const trackAITool = useCallback((tool: GrokTool) => {
    const mapped = GROK_TOOL_TO_AI_SALE[tool];
    if (mapped) aiToolsUsedRef.current.add(mapped);
  }, []);

  const getAIToolsUsed = useCallback(() => [...aiToolsUsedRef.current], []);

  const clearAIToolsUsed = useCallback(() => {
    aiToolsUsedRef.current.clear();
  }, []);

  const run = useCallback(async <T,>(body: Record<string, unknown>): Promise<T | null> => {
    setState({ loading: true, error: null });
    try {
      const result = await callGrok<T>(body);
      if (result && body.tool) trackAITool(body.tool as GrokTool);
      setState({ loading: false, error: null });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setState({ loading: false, error: message });
      return null;
    }
  }, [trackAITool]);

  const chat = useCallback(
    (message: string, history: GrokChatMessage[] = [], previousResponseId?: string) =>
      run<{ reply: string; responseId?: string }>({
        tool: "chat" as GrokTool,
        message,
        messages: history,
        previousResponseId,
      }),
    [run]
  );

  const analyzeListing = useCallback(
    (opts: { itemDescription?: string; imageBase64?: string; imageUrl?: string }) =>
      run<{ data: AnalyzeListingResult }>({ tool: "analyze-listing", ...opts }),
    [run]
  );

  const suggestPricing = useCallback(
    (opts: { itemDescription: string; category: string }) =>
      run<{ data: SuggestPricingResult }>({ tool: "suggest-pricing", ...opts }),
    [run]
  );

  const verifyCert = useCallback(
    (opts: { certNumber: string; certType: string; itemDescription?: string }) =>
      run<{ data: VerifyCertResult }>({ tool: "verify-cert", ...opts }),
    [run]
  );

  const holdAdvisor = useCallback(
    (listing: {
      title: string;
      category: string;
      currentBid: number;
      targetPrice: number;
      bidCount: number;
      viewerCount?: number;
    }) => run<{ data: HoldAdvisorResult }>({ tool: "hold-advisor", listing }),
    [run]
  );

  const liveInsights = useCallback(
    (listing: {
      title: string;
      category: string;
      currentBid: number;
      targetPrice: number;
      bidCount: number;
      viewerCount?: number;
    }) => run<{ data: LiveInsightsResult }>({ tool: "live-insights", listing }),
    [run]
  );

  const generateImage = useCallback(
    (opts: { itemDescription?: string; category?: string; title?: string }) =>
      run<{ data: GenerateImageResult; model: string }>({
        tool: "generate-image",
        itemDescription: opts.itemDescription ?? opts.title,
        category: opts.category,
      }),
    [run]
  );

  const recordAISale = useCallback(
    async (opts: {
      merchantId?: string;
      listingId: string;
      listingTitle: string;
      category: string;
      saleAmount: number;
      paymentMethod?: "solana" | "usd";
    }) => {
      const aiToolsUsed = getAIToolsUsed();
      if (aiToolsUsed.length === 0) return null;

      const res = await fetch("/api/merchant/ai-sales/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantId: opts.merchantId ?? "merchant-1",
          aiToolsUsed,
          listingId: opts.listingId,
          listingTitle: opts.listingTitle,
          category: opts.category,
          saleAmount: opts.saleAmount,
          paymentMethod: opts.paymentMethod ?? "solana",
        }),
      });

      const data = await res.json();
      if (res.ok) clearAIToolsUsed();
      return data;
    },
    [getAIToolsUsed, clearAIToolsUsed]
  );

  return {
    ...state,
    chat,
    analyzeListing,
    suggestPricing,
    verifyCert,
    holdAdvisor,
    liveInsights,
    generateImage,
    getAIToolsUsed,
    recordAISale,
  };
}
