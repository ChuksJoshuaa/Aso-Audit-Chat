"use client";

import { useRef, useEffect } from "react";
import { useChatStream } from "@/hooks";
import { ChatMessage, ChatInput, TypingIndicator } from "@/components";
import { Sparkles } from "lucide-react";

export default function Home() {
  const { messages, append, isLoading, status } = useChatStream();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (content: string) => {
    await append({ role: "user", content });
  };

  const showTypingIndicator =
    status === "submitted" ||
    (status === "streaming" &&
      messages.length > 0 &&
      messages[messages.length - 1].content === "");

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 flex flex-col">
      <header className="flex-shrink-0 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-zinc-100">
              ASO Audit Chat
            </h1>
            <p className="text-sm text-zinc-500">
              App Store Optimization insights powered by AI
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-100 mb-2">
                Welcome to ASO Audit
              </h2>
              <p className="text-zinc-400 max-w-md mb-8">
                Paste an Apple App Store URL to get a comprehensive ASO audit
                with actionable recommendations.
              </p>
              <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-800">
                <p className="text-sm text-zinc-500 mb-2">Try an example:</p>
                <code className="text-sm text-blue-400 break-all">
                  https://apps.apple.com/us/app/spotify-music-and-podcasts/id324684580
                </code>
              </div>
            </div>
          )}

          {messages.map((message) =>
            message.content ? (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
              />
            ) : null
          )}

          {showTypingIndicator && <TypingIndicator />}
        </div>

        <div className="flex-shrink-0 border-t border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              onSubmit={handleSubmit}
              isLoading={isLoading}
              placeholder={
                messages.length === 0
                  ? "Paste an App Store URL to start..."
                  : "Type your message..."
              }
            />
            <p className="text-xs text-zinc-600 text-center mt-3">
              Powered by Mastra AI • Results may vary based on App Store
              availability
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
