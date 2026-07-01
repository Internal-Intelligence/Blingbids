"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SparkleOverlay } from "@/components/sparkle/SparkleOverlay";
import { useGrok } from "@/hooks/useGrok";
import type { SellerVerification } from "@/lib/types";
import type { VerifyCertResult } from "@/lib/grok/types";
import { Check, Upload, Video, Wallet, IdCard, Sparkles, Loader2 } from "lucide-react";

const STEPS = [
  { id: "wallet", label: "Connect Wallet", icon: Wallet },
  { id: "id", label: "Verify ID", icon: IdCard },
  { id: "video", label: "15-sec Video", icon: Video },
  { id: "cert", label: "Upload Cert", icon: Upload },
] as const;

interface VerificationWizardProps {
  onComplete: (verification: SellerVerification) => void;
  itemDescription?: string;
}

export function VerificationWizard({ onComplete, itemDescription }: VerificationWizardProps) {
  const [step, setStep] = useState(0);
  const [certType, setCertType] = useState<"GIA" | "AGS" | "other">("GIA");
  const [certNumber, setCertNumber] = useState("");
  const [certAnalysis, setCertAnalysis] = useState<VerifyCertResult | null>(null);
  const { verifyCert, loading, error } = useGrok();
  const [verification, setVerification] = useState<SellerVerification>({
    idVerified: false,
    walletConnected: false,
  });

  const completeStep = (updates: Partial<SellerVerification>) => {
    const next = { ...verification, ...updates };
    setVerification(next);
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete({ ...next, completedAt: new Date().toISOString() });
    }
  };

  const runCertCheck = async () => {
    const res = await verifyCert({
      certNumber: certNumber || "PENDING",
      certType,
      itemDescription,
    });
    if (res?.data) setCertAnalysis(res.data);
  };

  return (
    <div className="bling-card relative overflow-hidden p-6">
      <SparkleOverlay intensity="low" />
      <h2 className="mb-6 text-xl font-bold text-gold-gradient">Seller Verification Wizard</h2>

      <div className="mb-8 flex justify-between">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex flex-col items-center gap-2">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                i <= step ? "border-bling-gold bg-bling-gold/20 text-bling-neon" : "border-bling-border text-bling-gold-light/40"
              }`}
            >
              {i < step ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
            </div>
            <span className="text-xs text-bling-gold-light/60">{s.label}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="min-h-[200px]"
        >
          {step === 0 && (
            <div className="text-center">
              <p className="mb-4 text-bling-gold-light/80">Connect your Solana wallet to verify ownership</p>
              <Button onClick={() => completeStep({ walletConnected: true })}>Connect Phantom Wallet</Button>
            </div>
          )}
          {step === 1 && (
            <div className="text-center">
              <p className="mb-4 text-bling-gold-light/80">Upload government-issued ID for KYC verification</p>
              <div className="mx-auto mb-4 flex h-32 w-64 items-center justify-center rounded-xl border-2 border-dashed border-bling-gold/40">
                <IdCard className="h-12 w-12 text-bling-gold/40" />
              </div>
              <Button onClick={() => completeStep({ idVerified: true })}>Upload ID Document</Button>
            </div>
          )}
          {step === 2 && (
            <div className="text-center">
              <p className="mb-4 text-bling-gold-light/80">Record a 15-second video holding your item next to your ID</p>
              <div className="mx-auto mb-4 flex h-40 w-64 items-center justify-center rounded-xl border-2 border-dashed border-bling-gold/40 bg-bling-surface">
                <Video className="h-12 w-12 text-bling-gold/40" />
              </div>
              <Button onClick={() => completeStep({ videoAttestationUrl: "/attestations/video-placeholder.mp4" })}>
                Record Video
              </Button>
            </div>
          )}
          {step === 3 && (
            <div className="text-center">
              <p className="mb-4 text-bling-gold-light/80">Upload GIA, AGS, or other certification</p>
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value as "GIA" | "AGS" | "other")}
                className="mb-4 rounded-xl border border-bling-border bg-bling-surface px-4 py-2 text-white"
              >
                <option value="GIA">GIA Certificate</option>
                <option value="AGS">AGS Certificate</option>
                <option value="other">Other Certification</option>
              </select>
              <input
                placeholder="Cert number (e.g. GIA-2145988776)"
                value={certNumber}
                onChange={(e) => setCertNumber(e.target.value)}
                className="mb-4 w-full max-w-xs rounded-xl border border-bling-border bg-bling-surface px-4 py-2 text-white"
              />
              <div className="mx-auto mb-4 flex h-32 w-64 items-center justify-center rounded-xl border-2 border-dashed border-bling-gold/40">
                <Upload className="h-12 w-12 text-bling-gold/40" />
              </div>
              <div className="mb-4 flex justify-center gap-2">
                <Button variant="outline" size="sm" onClick={runCertCheck} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  AI Cert Check
                </Button>
              </div>
              {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
              {certAnalysis && (
                <div className="mx-auto mb-4 max-w-sm rounded-xl bg-bling-surface p-3 text-left text-sm">
                  <p className="font-semibold text-bling-neon">
                    Trust Score: {certAnalysis.trustScore}/100 — {certAnalysis.recommendation}
                  </p>
                  <ul className="mt-2 text-xs text-bling-gold-light/70">
                    {certAnalysis.findings.map((f, i) => (
                      <li key={i}>✓ {f}</li>
                    ))}
                    {certAnalysis.redFlags.map((f, i) => (
                      <li key={i} className="text-red-400">⚠ {f}</li>
                    ))}
                  </ul>
                </div>
              )}
              <Button
                onClick={() =>
                  completeStep({
                    certUploadUrl: "/certs/placeholder.pdf",
                    certType,
                  })
                }
              >
                Upload Certificate
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}