"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ConfettiWinProps {
  show: boolean;
  onComplete?: () => void;
}

const PARTICLES = ["✦", "💎", "🥇", "⭐", "💰"];

export function ConfettiWin({ show, onComplete }: ConfettiWinProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl"
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400 - 100,
                opacity: 0,
                rotate: Math.random() * 720,
              }}
              transition={{ duration: 1.5, delay: i * 0.02 }}
            >
              {PARTICLES[i % PARTICLES.length]}
            </motion.span>
          ))}
          <motion.h2
            className="text-4xl font-bold text-gold-gradient"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5 }}
          >
            YOU WON! 🎉
          </motion.h2>
        </motion.div>
      )}
    </AnimatePresence>
  );
}