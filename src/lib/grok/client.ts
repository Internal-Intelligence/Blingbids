/**
 * Server-side xAI Grok client for Blingbids.com
 * Uses /v1/responses (primary) — OpenAI-compatible Agent Tools API.
 * NEVER import in client components — use /api/grok routes instead.
 */

const XAI_BASE_URL = "https://api.x.ai/v1";

export type ReasoningEffort = "none" | "low" | "medium" | "high";

export type GrokInputPart =
  | { type: "input_text"; text: string }
  | { type: "input_image"; image_url: string; detail?: "low" | "high" | "auto" };

export type GrokInputMessage = {
  role: "system" | "user" | "assistant" | "developer";
  content: string | GrokInputPart[];
};

/** @deprecated Use GrokInputMessage — kept for route migration */
export type GrokMessage =
  | { role: "system" | "user" | "assistant"; content: string }
  | {
      role: "user";
      content: Array<
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string; detail?: "low" | "high" | "auto" } }
      >;
    };

export interface GrokRequestOptions {
  instructions?: string;
  input: string | GrokInputMessage[];
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  jsonMode?: boolean;
  reasoningEffort?: ReasoningEffort;
  previousResponseId?: string;
  store?: boolean;
}

export interface GrokResponse {
  content: string;
  model: string;
  responseId: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    reasoning_tokens?: number;
  };
}

interface ResponsesApiOutput {
  type: string;
  role?: string;
  content?: Array<{ type: string; text?: string }>;
}

interface ResponsesApiData {
  id: string;
  model: string;
  status: string;
  output?: ResponsesApiOutput[];
  usage?: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    output_tokens_details?: { reasoning_tokens?: number };
  };
  error?: { message?: string };
}

function getApiKey(): string {
  const key = process.env.XAI_API_KEY;
  if (!key) throw new Error("XAI_API_KEY is not configured. Add it to .env.local");
  return key;
}

export function getGrokModel(): string {
  return process.env.XAI_MODEL ?? "grok-4.3";
}

export function getGrokBuildModel(): string {
  return process.env.XAI_BUILD_MODEL ?? "grok-build-0.1";
}

/** grok-build-0.1: fast structured/build tasks. grok-4.3: reasoning & conversation. */
export const TOOL_MODEL: Record<string, string> = {
  chat: "grok-4.3",
  "analyze-listing": "grok-build-0.1",
  "suggest-pricing": "grok-4.3",
  "verify-cert": "grok-build-0.1",
  "hold-advisor": "grok-4.3",
  "live-insights": "grok-4.3",
  "generate-copy": "grok-build-0.1",
};

export function resolveModelForTool(tool: string): string {
  const mapped = TOOL_MODEL[tool];
  if (mapped === "grok-build-0.1") return getGrokBuildModel();
  if (mapped === "grok-4.3") return getGrokModel();
  return mapped ?? getGrokModel();
}

function modelSupportsReasoning(model: string): boolean {
  return !model.startsWith("grok-build");
}

function extractResponseText(data: ResponsesApiData): string {
  for (const item of data.output ?? []) {
    if (item.type === "message" && item.content) {
      for (const part of item.content) {
        if (part.type === "output_text" && part.text) return part.text;
      }
    }
  }
  return "";
}

/** Convert legacy chat message format → Responses API input */
export function messagesToInput(messages: GrokMessage[]): {
  instructions?: string;
  input: GrokInputMessage[];
} {
  const systemMsgs = messages.filter((m) => m.role === "system");
  const nonSystem = messages.filter((m) => m.role !== "system");

  const instructions =
    systemMsgs.length > 0
      ? systemMsgs.map((m) => (typeof m.content === "string" ? m.content : "")).join("\n\n")
      : undefined;

  const input: GrokInputMessage[] = nonSystem.map((m) => {
    if (typeof m.content === "string") {
      return { role: m.role as "user" | "assistant", content: m.content };
    }
    return {
      role: "user",
      content: m.content.map((part) => {
        if (part.type === "text") return { type: "input_text" as const, text: part.text };
        return {
          type: "input_image" as const,
          image_url: part.image_url.url,
          detail: part.image_url.detail,
        };
      }),
    };
  });

  return { instructions, input };
}

/**
 * Primary Grok call — POST /v1/responses
 * @see https://docs.x.ai/developers/rest-api-reference/inference/chat (Responses)
 */
export async function grokRequest(options: GrokRequestOptions): Promise<GrokResponse> {
  const {
    instructions,
    input,
    model = getGrokModel(),
    temperature = 0.3,
    maxOutputTokens = 2048,
    jsonMode = false,
    reasoningEffort = "low",
    previousResponseId,
    store = true,
  } = options;

  const body: Record<string, unknown> = {
    model,
    input,
    temperature,
    max_output_tokens: maxOutputTokens,
    store,
  };

  if (instructions) body.instructions = instructions;
  if (previousResponseId) body.previous_response_id = previousResponseId;

  // grok-build-0.1 rejects reasoning param — it handles reasoning internally
  if (modelSupportsReasoning(model)) {
    body.reasoning = { effort: reasoningEffort === "none" ? "none" : reasoningEffort };
  }

  if (jsonMode) {
    body.text = { format: { type: "json_object" } };
  }

  const res = await fetch(`${XAI_BASE_URL}/responses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as ResponsesApiData & { error?: string | { message?: string } };

  if (!res.ok) {
    const errMsg =
      typeof data.error === "string"
        ? data.error
        : (data.error as { message?: string })?.message ?? JSON.stringify(data);
    throw new Error(errMsg);
  }

  if (data.status === "failed" || data.error) {
    throw new Error(data.error?.message ?? "Grok response failed");
  }

  const content = extractResponseText(data);

  return {
    content,
    model: data.model,
    responseId: data.id,
    usage: data.usage
      ? {
          input_tokens: data.usage.input_tokens,
          output_tokens: data.usage.output_tokens,
          total_tokens: data.usage.total_tokens,
          reasoning_tokens: data.usage.output_tokens_details?.reasoning_tokens,
        }
      : undefined,
  };
}

/** Legacy wrapper — routes through /v1/responses */
export async function grokChat(
  options: {
    messages: GrokMessage[];
    model?: string;
    temperature?: number;
    maxCompletionTokens?: number;
    jsonMode?: boolean;
    reasoningEffort?: ReasoningEffort;
    previousResponseId?: string;
  }
): Promise<GrokResponse> {
  const { instructions, input } = messagesToInput(options.messages);
  return grokRequest({
    instructions,
    input,
    model: options.model,
    temperature: options.temperature,
    maxOutputTokens: options.maxCompletionTokens,
    jsonMode: options.jsonMode,
    reasoningEffort: options.reasoningEffort,
    previousResponseId: options.previousResponseId,
  });
}

/** Per-tool reasoning effort — only applied to grok-4.3 */
export const TOOL_REASONING: Record<string, ReasoningEffort> = {
  chat: "low",
  "suggest-pricing": "high",
  "hold-advisor": "high",
  "live-insights": "medium",
};

/** Simple build-mode call — matches curl POST /v1/responses with grok-build-0.1 */
export async function grokBuild(
  input: string,
  instructions?: string,
  options?: { jsonMode?: boolean; maxOutputTokens?: number }
): Promise<GrokResponse> {
  return grokRequest({
    model: getGrokBuildModel(),
    input,
    instructions,
    jsonMode: options?.jsonMode,
    maxOutputTokens: options?.maxOutputTokens,
    reasoningEffort: "none",
  });
}

export function parseGrokJson<T>(content: string): T {
  const trimmed = content.trim();
  const jsonMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = jsonMatch ? jsonMatch[1].trim() : trimmed;
  return JSON.parse(raw) as T;
}
