"use client";

import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-primary-foreground">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-card px-4 py-3 border border-border">
        <div className="prose prose-sm max-w-none text-foreground">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-xl font-bold mt-4 mb-2 text-foreground">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-semibold mt-4 mb-2 text-foreground">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-base font-semibold mt-3 mb-1 text-foreground">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-sm leading-relaxed mb-2 text-foreground">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-2 text-sm text-foreground">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-2 text-sm text-foreground">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="mb-1 text-foreground">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-muted-foreground">{children}</em>
              ),
              code: ({ children, className }) => {
                const isBlock = className?.includes("language-");
                if (isBlock) {
                  return (
                    <code className="block bg-secondary rounded-lg p-3 text-xs overflow-x-auto my-2 text-foreground">
                      {children}
                    </code>
                  );
                }
                return (
                  <code className="bg-secondary px-1.5 py-0.5 rounded text-xs text-primary">
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="bg-secondary rounded-lg p-0 overflow-x-auto my-2">{children}</pre>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-primary pl-3 my-2 italic text-muted">
                  {children}
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-2">
                  <table className="min-w-full text-sm border border-border">{children}</table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-border bg-secondary px-3 py-2 text-left font-semibold text-foreground">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-border px-3 py-2 text-foreground">{children}</td>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {children}
                </a>
              ),
              hr: () => <hr className="my-4 border-border" />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
