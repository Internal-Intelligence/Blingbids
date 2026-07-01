"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { VerificationWizard } from "@/components/seller/VerificationWizard";
import { GrokToolsPanel } from "@/components/grok/GrokToolsPanel";
import { GenerateListingImage } from "@/components/grok/GenerateListingImage";
import { SparkleOverlay } from "@/components/sparkle/SparkleOverlay";
import type { SellerVerification } from "@/lib/types";
import type { AnalyzeListingResult, SuggestPricingResult } from "@/lib/grok/types";
import { useGrok } from "@/hooks/useGrok";
import { Camera, Upload, Zap } from "lucide-react";

type SellStep = "scan" | "details" | "verify" | "pricing" | "live";

export function QuickSellFlow() {
  const [step, setStep] = useState<SellStep>("scan");
  const [verification, setVerification] = useState<SellerVerification | null>(null);
  const [imageBase64, setImageBase64] = useState<string | undefined>();
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const previewImage = imageBase64 ?? imageUrl;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "jewelry",
    startPrice: "",
    targetPrice: "",
    hiddenReserve: "",
  });

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImageBase64(result);
      setStep("details");
    };
    reader.readAsDataURL(file);
  };

  const applyAnalyze = (data: AnalyzeListingResult) => {
    setForm((prev) => ({
      ...prev,
      title: data.title,
      description: data.description,
      category: data.category,
    }));
  };

  const applyPricing = (data: SuggestPricingResult) => {
    setForm((prev) => ({
      ...prev,
      startPrice: String(data.startPrice),
      targetPrice: String(data.targetPrice),
      hiddenReserve: String(data.hiddenReserve),
    }));
  };

  const { recordAISale, getAIToolsUsed } = useGrok();

  const goLive = async () => {
    const saleAmount = Number(form.targetPrice) || Number(form.startPrice) || 0;
    if (getAIToolsUsed().length > 0 && saleAmount > 0) {
      await recordAISale({
        listingId: `listing-${Date.now()}`,
        listingTitle: form.title || "Untitled listing",
        category: form.category,
        saleAmount,
      });
    }
    setStep("live");
  };

  if (step === "live") {
    return (
      <motion.div
        className="relative py-20 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <SparkleOverlay intensity="high" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mx-auto mb-6 text-6xl"
        >
          ✦
        </motion.div>
        <h2 className="mb-2 text-3xl font-bold text-gold-gradient">You&apos;re Live!</h2>
        <p className="mb-6 text-bling-gold-light/80">Your auction is now live on Blingbids.com</p>
        <Button asChild>
          <a href="/live/1?seller=1">Enter Live Room →</a>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
        }}
      />

      {step === "scan" && (
        <div className="bling-card p-6 text-center">
          <h2 className="mb-4 text-xl font-bold text-gold-gradient">Quick Sell — Under 90 Seconds</h2>
          <div className="mx-auto mb-6 flex h-48 w-full max-w-md items-center justify-center rounded-2xl border-2 border-dashed border-bling-gold/40 bg-bling-surface">
            <div className="text-center">
              <Camera className="mx-auto mb-2 h-12 w-12 text-bling-gold/60" />
              <p className="text-sm text-bling-gold-light/60">Scan or photograph your item</p>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Camera className="h-4 w-4" />
              Take Photo
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </div>
          <div className="mx-auto mt-6 max-w-xs">
            <p className="mb-2 text-xs text-bling-gold-light/50">No photo? Generate one with Grok Imagine</p>
            <GenerateListingImage
              category={form.category}
              onGenerated={(url) => {
                setImageUrl(url);
                setStep("details");
              }}
            />
          </div>
          <div className="mt-4">
            <Button variant="ghost" size="sm" onClick={() => setStep("details")}>
              Skip scan — enter manually
            </Button>
          </div>
        </div>
      )}

      {step === "details" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="bling-card space-y-4 p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-gold-gradient">Item Details</h2>
            {previewImage ? (
              <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-xl bg-bling-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewImage} alt="Item preview" className="max-h-full object-contain" />
              </div>
            ) : (
              <GenerateListingImage
                title={form.title}
                description={form.description}
                category={form.category}
                onGenerated={setImageUrl}
              />
            )}
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-bling-border bg-bling-surface px-4 py-3 text-white focus:border-bling-gold focus:outline-none"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-bling-border bg-bling-surface px-4 py-3 text-white focus:border-bling-gold focus:outline-none"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl border border-bling-border bg-bling-surface px-4 py-3 text-white"
            >
              <option value="jewelry">Jewelry</option>
              <option value="gold-bar">Gold Bar</option>
              <option value="diamond">Diamond</option>
              <option value="watch">Luxury Watch</option>
              <option value="chain">Gold Chain</option>
            </select>
            <Button onClick={() => setStep("verify")}>Continue to Verification</Button>
          </div>
          <GrokToolsPanel
            mode="sell-analyze"
            itemDescription={form.description || form.title}
            category={form.category}
            imageBase64={imageBase64}
            imageUrl={imageUrl}
            onAnalyzeComplete={applyAnalyze}
          />
        </div>
      )}

      {step === "verify" && (
        <VerificationWizard
          itemDescription={form.title}
          onComplete={(v) => {
            setVerification(v);
            setStep("pricing");
          }}
        />
      )}

      {step === "pricing" && verification && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="bling-card space-y-4 p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-gold-gradient">Set Your Prices</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-xs text-bling-gold-light/60">Start Price</label>
                <input
                  type="number"
                  value={form.startPrice}
                  onChange={(e) => setForm({ ...form, startPrice: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-bling-border bg-bling-surface px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-bling-gold-light/60">Target Price (visible)</label>
                <input
                  type="number"
                  value={form.targetPrice}
                  onChange={(e) => setForm({ ...form, targetPrice: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-bling-border bg-bling-surface px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-bling-gold-light/60">Hidden Reserve (optional)</label>
                <input
                  type="number"
                  value={form.hiddenReserve}
                  onChange={(e) => setForm({ ...form, hiddenReserve: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-bling-border bg-bling-surface px-4 py-3 text-white"
                />
              </div>
            </div>
            <Button size="lg" onClick={goLive}>
              <Zap className="h-5 w-5" />
              Go Live
            </Button>
          </div>
          <GrokToolsPanel
            mode="sell-pricing"
            itemDescription={`${form.title}. ${form.description}`}
            category={form.category}
            onPricingComplete={applyPricing}
          />
        </div>
      )}
    </div>
  );
}