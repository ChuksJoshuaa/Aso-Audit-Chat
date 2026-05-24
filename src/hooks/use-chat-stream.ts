"use client";

import { useState, useCallback } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

type Status = "idle" | "submitted" | "streaming" | "error";

export function useChatStream() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<Error | null>(null);

  const append = useCallback(
    async (message: { role: "user" | "assistant"; content: string }) => {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: message.role,
        content: message.content,
      };

      setMessages((prev) => [...prev, userMessage]);
      setStatus("submitted");
      setError(null);

      const assistantMessageId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: "assistant", content: "" },
      ]);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        setStatus("streaming");
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessageId
                ? { ...m, content: m.content + chunk }
                : m
            )
          );
        }

        setStatus("idle");
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setStatus("error");
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? {
                  ...m,
                  content:
                    "Sorry, an error occurred while processing your request. Please try again.",
                }
              : m
          )
        );
      }
    },
    [messages]
  );

  const reset = useCallback(() => {
    setMessages([]);
    setStatus("idle");
    setError(null);
  }, []);

  return {
    messages,
    append,
    status,
    error,
    reset,
    isLoading: status === "submitted" || status === "streaming",
  };
}
