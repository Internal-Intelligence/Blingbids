"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatUSD } from "@/lib/utils";
import type { PaymentMethod } from "@/lib/types";
import { Zap, DollarSign, Coins } from "lucide-react";

interface BidPanelProps {
  currentBid: number;
  targetPrice: number;
  minIncrement?: number;
  onBid: (amount: number, method: PaymentMethod) => void;
}

const QUICK_BIDS = [100, 250, 500, 1000];

export function BidPanel({ currentBid, targetPrice, minIncrement = 100, onBid }: BidPanelProps) {
  const [amount, setAmount] = useState(currentBid + minIncrement);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("solana");

  const progress = Math.min((currentBid / targetPrice) * 100, 100);

  return (
    <div className="bling-card space-y-4 p-5">
      <div>
        <div className="mb-1 flex justify-between text-xs text-bling-gold-light/60">
          <span>Progress to Target</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-bling-surface">
          <motion.div
            className="h-full bg-gold-gradient"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="mt-1 text-right text-xs text-bling-gold">Target: {formatUSD(targetPrice)}</p>
      </div>

      <div className="text-center">
        <p className="text-xs text-bling-gold-light/60">Current High Bid</p>
        <p className="text-3xl font-bold text-gold-gradient">{formatUSD(currentBid)}</p>
      </div>

      <div className="flex rounded-xl border border-bling-border bg-bling-surface p-1">
        <button
          type="button"
          onClick={() => setPaymentMethod("solana")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
            paymentMethod === "solana" ? "bg-bling-gold/20 text-bling-neon" : "text-bling-gold-light/60"
          }`}
        >
          <Coins className="h-4 w-4" />
          Solana
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod("usd")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
            paymentMethod === "usd" ? "bg-bling-gold/20 text-bling-neon" : "text-bling-gold-light/60"
          }`}
        >
          <DollarSign className="h-4 w-4" />
          USD
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_BIDS.map((inc) => (
          <Button
            key={inc}
            variant="outline"
            size="sm"
            onClick={() => setAmount(currentBid + inc)}
          >
            +{formatUSD(inc)}
          </Button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="flex-1 rounded-xl border border-bling-border bg-bling-surface px-4 py-3 text-white focus:border-bling-gold focus:outline-none"
          min={currentBid + minIncrement}
        />
        <Button size="lg" onClick={() => onBid(amount, paymentMethod)}>
          <Zap className="h-5 w-5" />
          Bid
        </Button>
      </div>

      <p className="text-center text-xs text-bling-gold-light/50">
        1.5% buyer fee · Funds held in escrow until 7-day inspection passes
      </p>
    </div>
  );
}