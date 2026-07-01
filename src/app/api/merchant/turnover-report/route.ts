import { NextRequest, NextResponse } from "next/server";
import {
  addTurnoverReport,
  getTurnoverReports,
  getMerchant,
  markAISalesReported,
  getPendingAISales,
} from "@/lib/merchant/store";
import { validateTurnoverReport } from "@/lib/merchant/validation";
import type { TurnoverReport, TurnoverReportSubmission } from "@/lib/merchant/types";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const merchantId = req.nextUrl.searchParams.get("merchantId") ?? undefined;
  const reports = getTurnoverReports(merchantId);
  return NextResponse.json({ reports, count: reports.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TurnoverReportSubmission;
    const validation = validateTurnoverReport(body);

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: "Turnover report rejected — all AI sales must be listed",
          errors: validation.errors,
          missingAISales: validation.missingAISales,
          unlistedSaleIds: validation.unlistedSaleIds,
        },
        { status: 422 }
      );
    }

    const merchant = getMerchant(body.merchantId)!;
    const pendingCount = getPendingAISales(
      body.merchantId,
      body.periodStart,
      body.periodEnd
    ).length;

    const report: TurnoverReport = {
      id: `turnover-${Date.now()}`,
      merchantId: body.merchantId,
      merchantName: merchant.name,
      periodStart: body.periodStart,
      periodEnd: body.periodEnd,
      totalTurnover: body.totalTurnover,
      totalPlatformFees: body.totalPlatformFees,
      totalTransactions: body.totalTransactions,
      aiSalesListed: body.aiSalesListed,
      aiSalesCount: body.aiSalesListed.length,
      submittedAt: new Date().toISOString(),
      status: "submitted",
    };

    addTurnoverReport(report);
    markAISalesReported(
      body.aiSalesListed.map((d) => d.aiSaleId),
      report.id
    );

    return NextResponse.json({
      success: true,
      report,
      message: `Turnover report submitted. ${pendingCount} AI sale(s) listed and marked reported.`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Submission failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}