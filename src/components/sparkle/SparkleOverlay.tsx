"use client";

import { motion } from "framer-motion";

const SPARKLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 2,
  size: Math.random() * 8 + 4,
}));

interface SparkleOverlayProps {
  intensity?: "low" | "medium" | "high";
  className?: string;
}

export function SparkleOverlay({ intensity = "medium", className }: SparkleOverlayProps) {
  const count = intensity === "low" ? 6 : intensity === "high" ? 20 : 12;

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}>
      {SPARKLES.slice(0, count).map((s) => (
        <motion.span
          key={s.id}
          className="absolute text-bling-neon"
          style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: s.size }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 2, delay: s.delay, repeat: Infinity }}
        >
          ✦
        </motion.span>
      ))}
    </div>
  );
}