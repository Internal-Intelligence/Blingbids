"use client";

import { useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { Send, Smile } from "lucide-react";

interface LiveChatProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
}

const EMOJI_STORM = ["🔥", "💎", "✨", "🥇", "💰", "👑"];

export function LiveChat({ messages, onSend }: LiveChatProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="bling-card flex h-full flex-col">
      <div className="border-b border-bling-border px-4 py-3">
        <h3 className="font-semibold text-bling-gold">Live Chat</h3>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`text-sm ${
              msg.type === "system"
                ? "text-center text-bling-neon"
                : msg.type === "bid"
                  ? "rounded-lg bg-bling-gold/10 px-3 py-2 text-bling-gold"
                  : msg.type === "emoji-storm"
                    ? "text-center text-2xl"
                    : "text-bling-gold-light/80"
            }`}
          >
            {msg.type !== "emoji-storm" && msg.type !== "system" && (
              <span className="font-semibold text-bling-gold">{msg.userName}: </span>
            )}
            {msg.message}
          </div>
        ))}
      </div>

      <div className="border-t border-bling-border p-3">
        <div className="mb-2 flex gap-1">
          {EMOJI_STORM.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onSend(emoji)}
              className="rounded-lg px-2 py-1 text-lg hover:bg-bling-gold/10"
            >
              {emoji}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Say something..."
            className="flex-1 rounded-xl border border-bling-border bg-bling-surface px-3 py-2 text-sm text-white focus:border-bling-gold focus:outline-none"
          />
          <button type="submit" className="rounded-xl bg-bling-gold/20 p-2 text-bling-neon hover:bg-bling-gold/30">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}