import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSOL(lamports: number): string {
  return `${(lamports / 1e9).toFixed(2)} SOL`;
}

export const PLATFORM_FEES = {
  sellerFeePercent: 8,
  buyerFeePercent: 1.5,
  boostFundReroutePercent: 25,
  creatorRoyaltyPercent: 2,
} as const;

export function calculateFees(salePrice: number) {
  const sellerFee = salePrice * (PLATFORM_FEES.sellerFeePercent / 100);
  const buyerFee = salePrice * (PLATFORM_FEES.buyerFeePercent / 100);
  const totalFee = sellerFee + buyerFee;
  const boostFundAmount = totalFee * (PLATFORM_FEES.boostFundReroutePercent / 100);
  return { sellerFee, buyerFee, totalFee, boostFundAmount };
}