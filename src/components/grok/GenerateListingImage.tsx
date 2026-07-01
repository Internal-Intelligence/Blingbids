"use client";

import Image from "next/image";
import { useState } from "react";
import { useGrok } from "@/hooks/useGrok";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, Sparkles } from "lucide-react";

interface GenerateListingImageProps {
  title?: string;
  description?: string;
  category?: string;
  onGenerated?: (url: string) => void;
  className?: string;
}

export function GenerateListingImage({
  title,
  description,
  category,
  onGenerated,
  className,
}: GenerateListingImageProps) {
  const { generateImage, loading, error } = useGrok();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    const prompt = [title, description].filter(Boolean).join(". ") || undefined;
    const result = await generateImage({
      itemDescription: prompt,
      category: category ?? "jewelry",
    });
    if (result?.data?.url) {
      setImageUrl(result.data.url);
      onGenerated?.(result.data.url);
    }
  };

  return (
    <div className={className}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleGenerate}
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {loading ? "Generating..." : "AI Listing Photo"}
      </Button>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      {imageUrl && (
        <div className="relative mt-3 aspect-square overflow-hidden rounded-xl border border-bling-gold/30 bg-bling-surface">
          <Image
            src={imageUrl}
            alt={title ?? "AI-generated listing"}
            fill
            className="object-cover"
            unoptimized
          />
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-xs text-bling-neon">
            <ImageIcon className="h-3 w-3" />
            Grok Imagine
          </span>
        </div>
      )}
    </div>
  );
}
