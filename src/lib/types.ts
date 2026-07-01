export type TrustBadge = "bling-verified" | "gia-certified" | "brinks-insured" | "money-back";

export type AuctionType = "live" | "timed";

export type AuctionStatus = "draft" | "pending-verification" | "live" | "paused" | "hold" | "ended" | "settled";

export type PaymentMethod = "solana" | "usd";

export type HoldAction = "accept-now" | "pause-hold" | "extend-supply" | "add-matching";

export interface SellerVerification {
  idVerified: boolean;
  walletConnected: boolean;
  videoAttestationUrl?: string;
  certUploadUrl?: string;
  certType?: "GIA" | "AGS" | "other";
  completedAt?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: "jewelry" | "gold-bar" | "diamond" | "watch" | "chain" | "other";
  images: string[];
  video360Url?: string;
  startPrice: number;
  targetPrice: number;
  hiddenReserve?: number;
  currentBid: number;
  bidCount: number;
  auctionType: AuctionType;
  status: AuctionStatus;
  sellerId: string;
  sellerName: string;
  trustBadges: TrustBadge[];
  certNumber?: string;
  endsAt?: string;
  isLive: boolean;
  viewerCount?: number;
}

export interface Bid {
  id: string;
  listingId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  timestamp: string;
  txSignature?: string;
}

export interface BoostFundStats {
  totalCollected: number;
  totalDistributed: number;
  featuredSlotsSubsidized: number;
  mysteryPrizesAwarded: number;
  lastVaultProofUrl: string;
  lastVaultProofDate: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  type: "message" | "bid" | "emoji-storm" | "system";
  timestamp: string;
}