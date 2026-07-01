import { NextRequest, NextResponse } from "next/server";
import {
  grokRequest,
  grokChat,
  parseGrokJson,
  TOOL_REASONING,
  resolveModelForTool,
  type GrokMessage,
} from "@/lib/grok/client";
import {
  BLINGBIDS_SYSTEM,
  ANALYZE_LISTING_PROMPT,
  SUGGEST_PRICING_PROMPT,
  VERIFY_CERT_PROMPT,
  HOLD_ADVISOR_PROMPT,
  LIVE_INSIGHTS_PROMPT,
} from "@/lib/grok/prompts";
import { grokGenerateImage, buildListingImagePrompt } from "@/lib/grok/images";
import type {
  GrokTool,
  AnalyzeListingResult,
  SuggestPricingResult,
  VerifyCertResult,
  HoldAdvisorResult,
  LiveInsightsResult,
  GenerateImageResult,
} from "@/lib/grok/types";

export const runtime = "nodejs";
export const maxDuration = 60;

interface GrokRequestBody {
  tool: GrokTool;
  message?: string;
  messages?: Array<{ role: "user" | "assistant"; content: string }>;
  previousResponseId?: string;
  imageBase64?: string;
  imageUrl?: string;
  itemDescription?: string;
  category?: string;
  certNumber?: string;
  certType?: string;
  listing?: {
    title: string;
    category: string;
    currentBid: number;
    targetPrice: number;
    bidCount: number;
    viewerCount?: number;
  };
}

function jsonResponse(tool: string, result: { content: string; model: string; responseId: string }, data?: unknown) {
  return NextResponse.json({
    tool,
    model: result.model,
    responseId: result.responseId,
    ...(data !== undefined ? { data } : { reply: result.content }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GrokRequestBody;
    const { tool } = body;
    const effort = TOOL_REASONING[tool] ?? "low";
    const model = resolveModelForTool(tool);

    switch (tool) {
      case "chat": {
        const history = body.messages ?? [];
        const userMsg = body.message;
        if (!userMsg && history.length === 0) {
          return NextResponse.json({ error: "message required" }, { status: 400 });
        }

        if (body.previousResponseId && userMsg) {
          const result = await grokRequest({
            model,
            instructions: BLINGBIDS_SYSTEM,
            input: userMsg,
            previousResponseId: body.previousResponseId,
            reasoningEffort: effort,
          });
          return NextResponse.json({
            tool,
            reply: result.content,
            model: result.model,
            responseId: result.responseId,
          });
        }

        const messages: GrokMessage[] = [
          { role: "system", content: BLINGBIDS_SYSTEM },
          ...history.map((m) => ({ role: m.role, content: m.content })),
        ];
        if (userMsg) messages.push({ role: "user", content: userMsg });

        const result = await grokChat({ messages, model, reasoningEffort: effort });
        return NextResponse.json({
          tool,
          reply: result.content,
          model: result.model,
          responseId: result.responseId,
        });
      }

      case "analyze-listing": {
        const instructions = `${BLINGBIDS_SYSTEM}\n\n${ANALYZE_LISTING_PROMPT}`;
        const imageSource = body.imageUrl ?? body.imageBase64;
        if (imageSource) {
          const url = imageSource.startsWith("http") || imageSource.startsWith("data:")
            ? imageSource
            : `data:image/jpeg;base64,${imageSource}`;
          const result = await grokRequest({
            model,
            instructions,
            input: [{ role: "user", content: [{ type: "input_text", text: body.itemDescription ?? "Identify this jewelry/gold item for a Blingbids.com auction listing." }, { type: "input_image", image_url: url, detail: "high" }] }],
            jsonMode: true,
            maxOutputTokens: 1024,
          });
          const data = parseGrokJson<AnalyzeListingResult>(result.content);
          return jsonResponse(tool, result, data);
        }
        const result = await grokRequest({ model, instructions, input: body.itemDescription ?? "18K gold Cuban link chain, 120 grams, excellent condition", jsonMode: true, maxOutputTokens: 1024 });
        const data = parseGrokJson<AnalyzeListingResult>(result.content);
        return jsonResponse(tool, result, data);
      }

      case "suggest-pricing": {
        const item = body.itemDescription ?? body.listing?.title ?? "jewelry item";
        const category = body.category ?? body.listing?.category ?? "jewelry";
        const result = await grokRequest({ model, instructions: `${BLINGBIDS_SYSTEM}\n\n${SUGGEST_PRICING_PROMPT}`, input: `Suggest auction pricing for Blingbids.com:\nCategory: ${category}\nItem: ${item}\nUse current jewelry/gold RWA market comparables for crypto luxury buyers.`, jsonMode: true, maxOutputTokens: 1024, reasoningEffort: effort });
        const data = parseGrokJson<SuggestPricingResult>(result.content);
        return jsonResponse(tool, result, data);
      }

      case "verify-cert": {
        const result = await grokRequest({ model, instructions: `${BLINGBIDS_SYSTEM}\n\n${VERIFY_CERT_PROMPT}`, input: `Verify certification for Blingbids seller onboarding:\nType: ${body.certType ?? "GIA"}\nCert Number: ${body.certNumber ?? "unknown"}\nItem: ${body.itemDescription ?? "unspecified"}`, jsonMode: true });
        const data = parseGrokJson<VerifyCertResult>(result.content);
        return jsonResponse(tool, result, data);
      }

      case "hold-advisor": {
        const listing = body.listing;
        if (!listing) return NextResponse.json({ error: "listing context required" }, { status: 400 });
        const result = await grokRequest({ model, instructions: `${BLINGBIDS_SYSTEM}\n\n${HOLD_ADVISOR_PROMPT}`, input: JSON.stringify({ title: listing.title, currentBid: listing.currentBid, targetPrice: listing.targetPrice, bidCount: listing.bidCount, viewerCount: listing.viewerCount, progressPercent: Math.round((listing.currentBid / listing.targetPrice) * 100) }), jsonMode: true, reasoningEffort: effort });
        const data = parseGrokJson<HoldAdvisorResult>(result.content);
        return jsonResponse(tool, result, data);
      }

      case "live-insights": {
        const listing = body.listing;
        if (!listing) return NextResponse.json({ error: "listing context required" }, { status: 400 });
        const result = await grokRequest({ model, instructions: `${BLINGBIDS_SYSTEM}\n\n${LIVE_INSIGHTS_PROMPT}`, input: `Live auction insights needed:\n${JSON.stringify(listing)}`, jsonMode: true, reasoningEffort: effort });
        const data = parseGrokJson<LiveInsightsResult>(result.content);
        return jsonResponse(tool, result, data);
      }

      case "generate-copy": {
        const result = await grokRequest({ model, instructions: BLINGBIDS_SYSTEM, input: `Write compelling Blingbids.com listing copy (title + 2 paragraph description + 3 bullet highlights) for:\n${body.itemDescription ?? "luxury jewelry piece"}\nCategory: ${body.category ?? "jewelry"}`, maxOutputTokens: 800 });
        return NextResponse.json({ tool, reply: result.content, model: result.model, responseId: result.responseId });
      }

      case "generate-image": {
        const prompt = body.itemDescription?.trim() || buildListingImagePrompt({ title: body.listing?.title, description: body.itemDescription, category: body.category ?? body.listing?.category });
        const image = await grokGenerateImage({ prompt });
        const data: GenerateImageResult = { url: image.url, mimeType: image.mimeType, prompt, revisedPrompt: image.revisedPrompt };
        return NextResponse.json({ tool, model: image.model, data });
      }

      default:
        return NextResponse.json({ error: `Unknown tool: ${tool}` }, { status: 400 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Grok API error";
    console.error("[grok]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
