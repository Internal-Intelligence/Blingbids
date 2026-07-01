import { NextRequest, NextResponse } from "next/server";
import { addAISale, getMerchant } from "@/lib/merchant/store";
import { calculateFees } from "@/lib/utils";
import type { AISaleTool } from "@/lib/merchant/types";

export const runtime = "nodejs";

interface TrackBody {
  merchantId: string;
  listingId: string;
  listingTitle: string;
  category: string;
  saleAmount: number;
  aiToolsUsed: AISaleTool[];
  paymentMethod?: "solana" | "usd";
  txSignature?: string;
  saleDate?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TrackBody;

    if (!body.merchantId || !body.listingId || !body.aiToolsUsed?.length) {
      return NextResponse.json(
        { error: "merchantId, listingId, and aiToolsUsed are required" },
        { status: 400 }
      );
    }

    const merchant = getMerchant(body.merchantId);
    if (!merchant) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
    }

    const sale = addAISale({
      merchantId: body.merchantId,
      merchantName: merchant.name,
      listingId: body.listingId,
      listingTitle: body.listingTitle,
      category: body.category,
      saleAmount: body.saleAmount,
      platformFees: calculateFees(body.saleAmount).totalFee,
      saleDate: body.saleDate ?? new Date().toISOString(),
      aiToolsUsed: body.aiToolsUsed,
      paymentMethod: body.paymentMethod ?? "solana",
      txSignature: body.txSignature,
    });

    return NextResponse.json({
      tracked: true,
      sale,
      message: "AI-assisted sale recorded — must be listed on next turnover report",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Track failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}