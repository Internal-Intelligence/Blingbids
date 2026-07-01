"use client";

import { useState } from "react";
import { BidPanel } from "@/components/auction/BidPanel";
import { HoldButton } from "@/components/auction/HoldButton";
import { LiveChat } from "@/components/auction/LiveChat";
import { TrustPanel } from "@/components/auction/TrustPanel";
import { BoostFundBanner } from "@/components/auction/BoostFundBanner";
import { TrustBadgeRow } from "@/components/ui/badge";
import { ConfettiWin } from "@/components/sparkle/ConfettiWin";
import { SparkleOverlay } from "@/components/sparkle/SparkleOverlay";
import { MOCK_BOOST_FUND, MOCK_CHAT } from "@/lib/mock-data";
import type { Listing, HoldAction, PaymentMethod } from "@/lib/types";
import { GrokToolsPanel } from "@/components/grok/GrokToolsPanel";
import { Users, Radio } from "lucide-react";

interface LiveRoomProps {
  listing: Listing;
  isSeller?: boolean;
}

export function LiveRoom({ listing, isSeller = false }: LiveRoomProps) {
  const [currentBid, setCurrentBid] = useState(listing.currentBid);
  const [chat, setChat] = useState(MOCK_CHAT);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleBid = (amount: number, method: PaymentMethod) => {
    setCurrentBid(amount);
    setChat((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        userId: "me",
        userName: "You",
        message: `Bid ${amount.toLocaleString("en-US", { style: "currency", currency: "USD" })} via ${method}`,
        type: "bid",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleHold = (action: HoldAction) => {
    setChat((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        userId: "system",
        userName: "Blingbids",
        message: `Seller triggered HOLD: ${action.replace("-", " ")}`,
        type: "system",
        timestamp: new Date().toISOString(),
      },
    ]);
    if (action === "accept-now") setShowConfetti(true);
  };

  return (
    <div className="relative">
      <ConfettiWin show={showConfetti} onComplete={() => setShowConfetti(false)} />

      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold">
              <Radio className="h-3 w-3 animate-pulse" />
              LIVE
            </span>
            <span className="flex items-center gap-1 text-sm text-bling-gold-light/60">
              <Users className="h-4 w-4" />
              {listing.viewerCount} watching
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">{listing.title}</h1>
          <p className="text-bling-gold-light/60">by {listing.sellerName}</p>
        </div>
        <TrustBadgeRow badges={listing.trustBadges} />
      </div>

      <div className="mb-6">
        <BoostFundBanner stats={MOCK_BOOST_FUND} compact />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="relative lg:col-span-7">
          <div className="bling-card relative aspect-video overflow-hidden">
            <SparkleOverlay intensity="medium" />
            <div className="flex h-full items-center justify-center bg-bling-surface text-8xl">
              💎
            </div>
            <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-1 text-sm">
              360° View · Tap to rotate
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-5">
          <BidPanel
            currentBid={currentBid}
            targetPrice={listing.targetPrice}
            onBid={handleBid}
          />
          {isSeller && <HoldButton onAction={handleHold} />}
          <GrokToolsPanel
            mode={isSeller ? "live-seller" : "live-buyer"}
            listing={{
              title: listing.title,
              category: listing.category,
              currentBid,
              targetPrice: listing.targetPrice,
              bidCount: listing.bidCount,
              viewerCount: listing.viewerCount,
            }}
          />
        </div>

        <div className="h-80 lg:col-span-4 lg:h-auto">
          <LiveChat
            messages={chat}
            onSend={(msg) =>
              setChat((prev) => [
                ...prev,
                {
                  id: String(Date.now()),
                  userId: "me",
                  userName: "You",
                  message: msg,
                  type: msg.length <= 2 ? "emoji-storm" : "message",
                  timestamp: new Date().toISOString(),
                },
              ])
            }
          />
        </div>

        <div className="lg:col-span-3">
          <TrustPanel listing={listing} />
        </div>

        <div className="lg:col-span-5">
          <BoostFundBanner stats={MOCK_BOOST_FUND} />
        </div>
      </div>
    </div>
  );
}