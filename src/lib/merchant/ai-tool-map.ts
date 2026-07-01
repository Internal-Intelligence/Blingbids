import type { AISaleTool } from "./types";
import type { GrokTool } from "@/lib/grok/types";

export const GROK_TOOL_TO_AI_SALE: Partial<Record<GrokTool, AISaleTool>> = {
  "analyze-listing": "grok-analyze-listing",
  "suggest-pricing": "grok-suggest-pricing",
  "generate-image": "grok-generate-image",
  "verify-cert": "grok-verify-cert",
  "generate-copy": "grok-generate-copy",
  "hold-advisor": "grok-hold-advisor",
  "live-insights": "grok-live-insights",
  chat: "bling-ai-chat",
};

export const AI_TOOL_LABELS: Record<AISaleTool, string> = {
  "grok-analyze-listing": "Grok AI Scan & Auto-Fill",
  "grok-suggest-pricing": "Grok AI Market Pricing",
  "grok-generate-image": "Grok Imagine Listing Photo",
  "grok-verify-cert": "Grok AI Cert Check",
  "grok-generate-copy": "Grok Listing Copy",
  "grok-hold-advisor": "Grok HOLD Advisor",
  "grok-live-insights": "Grok Bid Insights",
  "bling-ai-chat": "Bling AI Assistant",
};