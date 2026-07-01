/** AI tools that flag a listing/sale as AI-assisted for turnover reporting */
export type AISaleTool =
  | "grok-analyze-listing"
  | "grok-suggest-pricing"
  | "grok-generate-image"
  | "grok-verify-cert"
  | "grok-generate-copy"
  | "grok-hold-advisor"
  | "grok-live-insights"
  | "bling-ai-chat";

export type AISaleStatus = "pending-report" | "reported" | "disputed";

export interface Merchant {
  id: string;
  name: string;
  walletAddress?: string;
  email?: string;
  verified: boolean;
}

export interface AISale {
  id: string;
  merchantId: string;
  merchantName: string;
  listingId: string;
  listingTitle: string;
  category: string;
  saleAmount: number;
  platformFees: number;
  saleDate: string;
  aiToolsUsed: AISaleTool[];
  paymentMethod: "solana" | "usd";
  txSignature?: string;
  status: AISaleStatus;
  reportedInTurnoverId?: string;
  createdAt: string;
}

export interface AISaleDeclaration {
  aiSaleId: string;
  listingTitle: string;
  saleAmount: number;
  saleDate: string;
  aiToolsUsed: AISaleTool[];
  notes?: string;
}

export interface TurnoverReport {
  id: string;
  merchantId: string;
  merchantName: string;
  periodStart: string;
  periodEnd: string;
  totalTurnover: number;
  totalPlatformFees: number;
  totalTransactions: number;
  /** Every AI sale in period — mandatory, must match all pending AI sales */
  aiSalesListed: AISaleDeclaration[];
  aiSalesCount: number;
  submittedAt: string;
  status: "submitted" | "accepted" | "rejected";
}

export interface TurnoverReportSubmission {
  merchantId: string;
  periodStart: string;
  periodEnd: string;
  totalTurnover: number;
  totalPlatformFees: number;
  totalTransactions: number;
  aiSalesListed: AISaleDeclaration[];
}