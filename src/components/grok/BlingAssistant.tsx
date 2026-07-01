"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGrok } from "@/hooks/useGrok";
import type { GrokChatMessage } from "@/lib/grok/types";
import { Sparkles, X, Send, Loader2 } from "lucide-react";

const STARTER_PROMPTS = [
  "How does Blingbids escrow work?",
  "What's the Boost Fund?",
  "How do I quick-sell gold?",
  "Explain the HOLD button",
];

export function BlingAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<GrokChatMessage[]>([
    {
      role: "assistant",
      content: "✦ Hey! I'm Bling AI — your Blingbids.com expert. Ask me about selling, bidding, trust, fees, or the Boost Fund!",
    },
  ]);
  const [responseId, setResponseId] = useState<string | undefined>();
  const { chat, loading, error } = useGrok();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg = text.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);

    const history = messages.filter((m) => m.role !== "assistant" || !m.content.startsWith("✦ Hey!"));
    const result = await chat(userMsg, responseId ? [] : history, responseId);

    if (result?.responseId) setResponseId(result.responseId);

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: result?.reply ?? "Sorry, I couldn't respond. Try again!" },
    ]);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 z-50 flex h-[480px] w-[360px] flex-col overflow-hidden rounded-2xl border border-bling-gold/30 bg-bling-card shadow-gold-glow md:w-[400px]"
          >
            <div className="flex items-center justify-between bg-gold-gradient px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-bling-black" />
                <span className="font-bold text-bling-black">Bling AI</span>
                <span className="rounded-full bg-bling-black/20 px-2 py-0.5 text-xs text-bling-black">Grok</span>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="text-bling-black/70 hover:text-bling-black">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`rounded-xl px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "ml-8 bg-bling-gold/20 text-white"
                      : "mr-4 bg-bling-surface text-bling-gold-light"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-sm text-bling-gold-light/60">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </div>
              )}
              {error && <p className="text-xs text-red-400">{error}</p>}
              <div ref={bottomRef} />
            </div>

            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {STARTER_PROMPTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => send(p)}
                    className="rounded-full border border-bling-gold/30 px-3 py-1 text-xs text-bling-gold hover:bg-bling-gold/10"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2 border-t border-bling-border p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Bling AI anything..."
                className="flex-1 rounded-xl border border-bling-border bg-bling-surface px-3 py-2 text-sm text-white focus:border-bling-gold focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-bling-gold/20 p-2 text-bling-neon hover:bg-bling-gold/30 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gold-gradient shadow-gold-glow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {open ? <X className="h-6 w-6 text-bling-black" /> : <Sparkles className="h-6 w-6 text-bling-black" />}
      </motion.button>
    </>
  );
}
