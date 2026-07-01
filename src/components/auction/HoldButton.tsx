"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SparkleOverlay } from "@/components/sparkle/SparkleOverlay";
import type { HoldAction } from "@/lib/types";
import { Pause, Check, Clock, Plus } from "lucide-react";

const HOLD_OPTIONS: { action: HoldAction; label: string; icon: React.ReactNode; description: string }[] = [
  { action: "accept-now", label: "Accept Now", icon: <Check className="h-5 w-5" />, description: "Accept highest bid immediately" },
  { action: "pause-hold", label: "Pause & Hold", icon: <Pause className="h-5 w-5" />, description: "Freeze bidding, keep current high bid" },
  { action: "extend-supply", label: "Extend Supply", icon: <Clock className="h-5 w-5" />, description: "Add more time or quantity" },
  { action: "add-matching", label: "Add Matching Pieces", icon: <Plus className="h-5 w-5" />, description: "Bundle matching jewelry items" },
];

interface HoldButtonProps {
  onAction: (action: HoldAction) => void;
  disabled?: boolean;
}

export function HoldButton({ onAction, disabled }: HoldButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="bling-btn-hold relative w-full disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <SparkleOverlay intensity="high" />
        <span className="relative z-10 flex items-center justify-center gap-2">
          <Pause className="h-6 w-6" />
          HOLD
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full left-0 right-0 z-50 mb-2 space-y-2 rounded-2xl border border-bling-gold/30 bg-bling-card p-3 shadow-gold-glow"
          >
            {HOLD_OPTIONS.map((opt) => (
              <button
                key={opt.action}
                type="button"
                onClick={() => {
                  onAction(opt.action);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-bling-gold/10"
              >
                <span className="text-bling-neon">{opt.icon}</span>
                <div>
                  <p className="font-semibold text-white">{opt.label}</p>
                  <p className="text-xs text-bling-gold-light/60">{opt.description}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}