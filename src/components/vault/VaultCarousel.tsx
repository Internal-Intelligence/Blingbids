"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ListingCard } from "@/components/auction/ListingCard";
import type { Listing } from "@/lib/types";

interface VaultCarouselProps {
  title: string;
  listings: Listing[];
}

export function VaultCarousel({ title, listings }: VaultCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          <span className="text-gold-gradient">{title}</span>
          <span className="diamond-sparkle" />
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="rounded-full border border-bling-border p-2 hover:bg-bling-card"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="rounded-full border border-bling-border p-2 hover:bg-bling-card"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {listings.map((listing, i) => (
          <motion.div
            key={listing.id}
            className="w-72 shrink-0"
            style={{ scrollSnapAlign: "start" }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <ListingCard listing={listing} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}