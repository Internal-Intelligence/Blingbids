/**
 * xAI Grok Imagine — POST /v1/images/generations
 * Server-side only. Use /api/grok with tool: generate-image.
 */

const XAI_BASE_URL = "https://api.x.ai/v1";

export interface GrokImageOptions {
  prompt: string;
  model?: string;
  n?: number;
}

export interface GrokImageResult {
  url: string;
  mimeType: string;
  model: string;
  revisedPrompt?: string;
}

function getApiKey(): string {
  const key = process.env.XAI_API_KEY;
  if (!key) throw new Error("XAI_API_KEY is not configured. Add it to .env.local");
  return key;
}

export function getGrokImageModel(): string {
  return process.env.XAI_IMAGE_MODEL ?? "grok-imagine-image-quality";
}

/** Blingbids-branded jewelry listing prompt */
export function buildListingImagePrompt(opts: {
  title?: string;
  description?: string;
  category?: string;
}): string {
  const category = opts.category ?? "jewelry";
  const subject = opts.title ?? opts.description ?? `luxury ${category.replace("-", " ")}`;

  return [
    `Professional luxury jewelry product photography for Blingbids.com auction listing.`,
    `Subject: ${subject}.`,
    `Category: ${category}.`,
    `Style: dark neon-gold theme, black velvet or marble surface, dramatic studio lighting,`,
    `diamond sparkle highlights, high-end catalog quality, photorealistic, no text or watermarks.`,
  ].join(" ");
}

/**
 * Generate image via grok-imagine-image-quality
 * @see curl POST https://api.x.ai/v1/images/generations
 */
export async function grokGenerateImage(options: GrokImageOptions): Promise<GrokImageResult> {
  const { prompt, model = getGrokImageModel(), n = 1 } = options;

  const res = await fetch(`${XAI_BASE_URL}/images/generations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, prompt, n }),
  });

  const data = await res.json();

  if (!res.ok) {
    const errMsg =
      typeof data.error === "string"
        ? data.error
        : data.error?.message ?? JSON.stringify(data);
    throw new Error(errMsg);
  }

  const image = data.data?.[0];
  if (!image?.url && !image?.b64_json) {
    throw new Error("No image returned from Grok Imagine");
  }

  return {
    url: image.url ?? `data:${image.mime_type ?? "image/jpeg"};base64,${image.b64_json}`,
    mimeType: image.mime_type ?? "image/jpeg",
    model,
    revisedPrompt: image.revised_prompt,
  };
}
