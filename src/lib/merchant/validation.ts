import type { AISale, AISaleDeclaration, TurnoverReportSubmission } from "./types";
import { getPendingAISales, getMerchant } from "./store";

export interface TurnoverValidationResult {
  valid: boolean;
  errors: string[];
  missingAISales: AISale[];
  unlistedSaleIds: string[];
}

/**
 * Every AI sale in the reporting period MUST be listed by the merchant
 * before a turnover report can be submitted.
 */
export function validateTurnoverReport(
  submission: TurnoverReportSubmission
): TurnoverValidationResult {
  const errors: string[] = [];
  const merchant = getMerchant(submission.merchantId);

  if (!merchant) {
    return { valid: false, errors: ["Merchant not found"], missingAISales: [], unlistedSaleIds: [] };
  }

  if (!submission.periodStart || !submission.periodEnd) {
    errors.push("Reporting period start and end dates are required");
  }

  if (submission.periodStart >= submission.periodEnd) {
    errors.push("Period end must be after period start");
  }

  const pendingAISales = getPendingAISales(
    submission.merchantId,
    submission.periodStart,
    submission.periodEnd
  );

  const listedIds = new Set(submission.aiSalesListed.map((d) => d.aiSaleId));
  const missingAISales = pendingAISales.filter((s) => !listedIds.has(s.id));
  const unlistedSaleIds = missingAISales.map((s) => s.id);

  if (pendingAISales.length === 0 && submission.aiSalesListed.length > 0) {
    errors.push("No pending AI sales in this period — remove extra declarations or adjust dates");
  }

  if (missingAISales.length > 0) {
    errors.push(
      `All ${pendingAISales.length} AI-assisted sale(s) must be listed. Missing ${missingAISales.length}: ${missingAISales.map((s) => s.listingTitle).join(", ")}`
    );
  }

  for (const decl of submission.aiSalesListed) {
    const sale = pendingAISales.find((s) => s.id === decl.aiSaleId);
    if (!sale) {
      if (pendingAISales.length > 0) {
        errors.push(`Declaration references unknown or already-reported sale: ${decl.aiSaleId}`);
      }
      continue;
    }
    if (Math.abs(decl.saleAmount - sale.saleAmount) > 0.01) {
      errors.push(
        `Amount mismatch for "${sale.listingTitle}": declared ${decl.saleAmount}, recorded ${sale.saleAmount}`
      );
    }
    if (!decl.aiToolsUsed?.length) {
      errors.push(`AI tools must be listed for sale "${sale.listingTitle}"`);
    }
  }

  const declaredTotal = submission.aiSalesListed.reduce((sum, d) => sum + d.saleAmount, 0);
  const expectedMin = pendingAISales.reduce((sum, s) => sum + s.saleAmount, 0);
  if (pendingAISales.length > 0 && declaredTotal < expectedMin * 0.99) {
    errors.push("Declared AI sales total does not match platform records");
  }

  return {
    valid: errors.length === 0,
    errors,
    missingAISales,
    unlistedSaleIds,
  };
}

export function declarationsFromAISales(sales: AISale[]): AISaleDeclaration[] {
  return sales.map((s) => ({
    aiSaleId: s.id,
    listingTitle: s.listingTitle,
    saleAmount: s.saleAmount,
    saleDate: s.saleDate,
    aiToolsUsed: s.aiToolsUsed,
  }));
}