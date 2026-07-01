"use client";

import { useCallback, useRef } from "react";
import type { AISaleTool } from "@/lib/merchant/types";
import type { GrokTool } from "@/lib/grok/types";
import { GROK_TOOL_TO_AI_SALE } from "@/lib/merchant/ai-tool-map";

const STORAGE_KEY = "blingbids-ai-tools-session";

export function useAITracking(merchantId = "merchant-1") {
  const toolsRef = useRef<Set<AISaleTool>>(new Set());

  const loadSession = useCallback(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AISaleTool[];
        toolsRef.current = new Set(parsed);
      }
    } catch {
      toolsRef.current = new Set();
    }
  }, []);

  const saveSession = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...toolsRef.current]));
  }, []);

  const trackTool = useCallback(
    (grokTool: GrokTool) => {
      const mapped = GROK_TOOL_TO_AI_SALE[grokTool];
      if (mapped) {
        toolsRef.current.add(mapped);
        saveSession();
      }
    },
    [saveSession]
  );

  const getToolsUsed = useCallback((): AISaleTool[] => {
    loadSession();
    return [...toolsRef.current];
  }, [loadSession]);

  const clearSession = useCallback(() => {
    toolsRef.current.clear();
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const recordAISale = useCallback(
    async (opts: {
      listingId: string;
      listingTitle: string;
      category: string;
      saleAmount: number;
      paymentMethod?: "solana" | "usd";
    }) => {
      loadSession();
      const aiToolsUsed = [...toolsRef.current];
      if (aiToolsUsed.length === 0) return null;

      const res = await fetch("/api/merchant/ai-sales/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantId,
          aiToolsUsed,
          ...opts,
        }),
      });

      const data = await res.json();
      if (res.ok) clearSession();
      return data;
    },
    [merchantId, loadSession, clearSession]
  );

  return { trackTool, getToolsUsed, recordAISale, clearSession };
}