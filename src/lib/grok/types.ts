export type GrokTool =
  | "chat"
  | "analyze-listing"
  | "suggest-pricing"
  | "verify-cert"
  | "hold-advisor"
  | "live-insights"
  | "generate-copy"
  | "generate-image";

export interface GenerateImageResult {
  url: string;
  mimeType: string;
  prompt: string;
  revisedPrompt?: string;
}

export interface AnalyzeListingResult {
  title: string;
  category: string;
  description: string;
  estimatedWeightGrams?: number | null;
  materials: string[];
  suggestedTrustBadges: string[];
  certRecommendation: string;
  confidence: number;
}

export interface SuggestPricingResult {
  startPrice: number;
  targetPrice: number;
  hiddenReserve: number;
  rationale: string;
  comparableRange: { low: number; high: number };
  cryptoPremiumTip: string;
}

export interface VerifyCertResult {
  certType: string;
  isValidFormat: boolean;
  findings: string[];
  redFlags: string[];
  trustScore: number;
  recommendation: "approve" | "needs-review" | "reject";
}

export interface HoldAdvisorResult {
  recommendedAction: string;
  reasoning: string;
  urgency: "low" | "medium" | "high";
  expectedOutcome: string;
}

export interface LiveInsightsResult {
  itemSummary: string;
  bidStrategy: string;
  authenticityNotes: string[];
  fairValueRange: { low: number; high: number };
  watchFor: string[];
}

export interface GrokChatMessage {
  role: "user" | "assistant";
  content: string;
}
