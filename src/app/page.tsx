"use client";

import { useRef, useEffect } from "react";
import { useChatStream } from "@/hooks";
import { ChatMessage, ChatInput, TypingIndicator } from "@/components";
import { Sparkles, AppWindow } from "lucide-react";

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
    <div className="flex h-screen flex-col bg-background">
      <header className="shrink-0 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground">ASO Audit</h1>
            <p className="text-xs text-muted-foreground">
              App Store Optimization Analysis
            </p>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-6"
        >
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-purple-600/20">
                  <AppWindow className="h-8 w-8 text-primary" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  Welcome to ASO Audit
                </h2>
                <p className="mb-6 max-w-md text-sm text-muted-foreground">
                  Paste an Apple App Store URL to get a comprehensive audit with
                  actionable recommendations to improve your app&apos;s visibility.
                </p>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="mb-2 text-xs text-muted-foreground">Example URL:</p>
                  <code className="break-all text-xs text-primary">
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
        </div>

        <div className="shrink-0 border-t border-border bg-card/50 backdrop-blur-sm p-4">
          <div className="mx-auto max-w-3xl">
            <ChatInput
              onSubmit={handleSubmit}
              isLoading={isLoading}
              placeholder={
                messages.length === 0
                  ? "Paste an App Store URL to start..."
                  : "Type your message..."
              }
            />
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Powered by Mastra AI
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
