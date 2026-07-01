import { NextRequest, NextResponse } from "next/server";
import { getAISales, getPendingAISales } from "@/lib/merchant/store";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const merchantId = req.nextUrl.searchParams.get("merchantId");
  const pendingOnly = req.nextUrl.searchParams.get("pending") === "true";
  const periodStart = req.nextUrl.searchParams.get("periodStart") ?? undefined;
  const periodEnd = req.nextUrl.searchParams.get("periodEnd") ?? undefined;

  if (!merchantId) {
    return NextResponse.json({ error: "merchantId required" }, { status: 400 });
  }

  const sales = pendingOnly
    ? getPendingAISales(merchantId, periodStart, periodEnd)
    : getAISales(merchantId);

  return NextResponse.json({
    merchantId,
    count: sales.length,
    sales,
    requiresListingOnTurnover: pendingOnly,
  });
}