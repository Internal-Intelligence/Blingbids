import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import type { AISale, Merchant, TurnoverReport } from "./types";
import { calculateFees } from "@/lib/utils";

const DATA_DIR = join(process.cwd(), "data", "merchant");
const AI_SALES_FILE = join(DATA_DIR, "ai-sales.json");
const REPORTS_FILE = join(DATA_DIR, "turnover-reports.json");
const MERCHANTS_FILE = join(DATA_DIR, "merchants.json");

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readJson<T>(file: string, fallback: T): T {
  ensureDataDir();
  if (!existsSync(file)) return fallback;
  try {
    return JSON.parse(readFileSync(file, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(file: string, data: T) {
  ensureDataDir();
  writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}

const SEED_MERCHANTS: Merchant[] = [
  { id: "merchant-1", name: "GoldVault_NYC", walletAddress: "7xKX...", verified: true },
  { id: "merchant-2", name: "LuxTime_Collective", verified: true },
  { id: "merchant-3", name: "DiamondDirect", verified: true },
];

const SEED_AI_SALES: AISale[] = [
  {
    id: "ai-sale-1",
    merchantId: "merchant-1",
    merchantName: "GoldVault_NYC",
    listingId: "1",
    listingTitle: "18K Gold Cuban Link Chain — 120g",
    category: "chain",
    saleAmount: 10200,
    platformFees: calculateFees(10200).totalFee,
    saleDate: "2026-06-28T14:30:00Z",
    aiToolsUsed: ["grok-analyze-listing", "grok-suggest-pricing", "grok-generate-image"],
    paymentMethod: "solana",
    status: "pending-report",
    createdAt: "2026-06-28T14:35:00Z",
  },
  {
    id: "ai-sale-2",
    merchantId: "merchant-1",
    merchantName: "GoldVault_NYC",
    listingId: "4",
    listingTitle: "1oz PAMP Suisse Gold Bar — Sealed",
    category: "gold-bar",
    saleAmount: 2450,
    platformFees: calculateFees(2450).totalFee,
    saleDate: "2026-06-29T09:15:00Z",
    aiToolsUsed: ["grok-analyze-listing", "grok-verify-cert"],
    paymentMethod: "usd",
    status: "pending-report",
    createdAt: "2026-06-29T09:20:00Z",
  },
  {
    id: "ai-sale-3",
    merchantId: "merchant-2",
    merchantName: "LuxTime_Collective",
    listingId: "2",
    listingTitle: "Rolex Submariner Date — 41mm Black Dial",
    category: "watch",
    saleAmount: 13800,
    platformFees: calculateFees(13800).totalFee,
    saleDate: "2026-06-27T18:00:00Z",
    aiToolsUsed: ["grok-suggest-pricing", "grok-hold-advisor"],
    paymentMethod: "solana",
    status: "pending-report",
    createdAt: "2026-06-27T18:05:00Z",
  },
];

function initIfEmpty() {
  ensureDataDir();
  if (!existsSync(MERCHANTS_FILE)) writeJson(MERCHANTS_FILE, SEED_MERCHANTS);
  if (!existsSync(AI_SALES_FILE)) writeJson(AI_SALES_FILE, SEED_AI_SALES);
  if (!existsSync(REPORTS_FILE)) writeJson(REPORTS_FILE, []);
}

export function getMerchants(): Merchant[] {
  initIfEmpty();
  return readJson<Merchant[]>(MERCHANTS_FILE, SEED_MERCHANTS);
}

export function getMerchant(id: string): Merchant | undefined {
  return getMerchants().find((m) => m.id === id);
}

export function getAISales(merchantId?: string): AISale[] {
  initIfEmpty();
  const sales = readJson<AISale[]>(AI_SALES_FILE, SEED_AI_SALES);
  return merchantId ? sales.filter((s) => s.merchantId === merchantId) : sales;
}

export function getPendingAISales(
  merchantId: string,
  periodStart?: string,
  periodEnd?: string
): AISale[] {
  return getAISales(merchantId).filter((s) => {
    if (s.status !== "pending-report") return false;
    if (periodStart && s.saleDate < periodStart) return false;
    if (periodEnd && s.saleDate > periodEnd) return false;
    return true;
  });
}

export function addAISale(sale: Omit<AISale, "id" | "createdAt" | "status">): AISale {
  initIfEmpty();
  const sales = getAISales();
  const newSale: AISale = {
    ...sale,
    id: `ai-sale-${Date.now()}`,
    status: "pending-report",
    createdAt: new Date().toISOString(),
  };
  sales.push(newSale);
  writeJson(AI_SALES_FILE, sales);
  return newSale;
}

export function markAISalesReported(saleIds: string[], reportId: string) {
  const sales = getAISales();
  const updated = sales.map((s) =>
    saleIds.includes(s.id)
      ? { ...s, status: "reported" as const, reportedInTurnoverId: reportId }
      : s
  );
  writeJson(AI_SALES_FILE, updated);
}

export function getTurnoverReports(merchantId?: string): TurnoverReport[] {
  initIfEmpty();
  const reports = readJson<TurnoverReport[]>(REPORTS_FILE, []);
  return merchantId ? reports.filter((r) => r.merchantId === merchantId) : reports;
}

export function addTurnoverReport(report: TurnoverReport) {
  initIfEmpty();
  const reports = getTurnoverReports();
  reports.push(report);
  writeJson(REPORTS_FILE, reports);
}