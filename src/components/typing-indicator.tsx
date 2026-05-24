"use client";

import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-zinc-800">
        <Bot className="w-4 h-4 text-zinc-300" />
      </div>
      <div className="flex items-center gap-1 bg-zinc-800/50 rounded-2xl px-4 py-3">
        <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" />
      </div>
    </div>
  );
}
