import { mastra } from "@/mastra";
import { NextRequest } from "next/server";

export const maxDuration = 120;

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface RequestBody {
  messages: Message[];
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as RequestBody;
  const { messages } = body;

  const agent = mastra.getAgent("asoAuditAgent");
  const result = await agent.stream(messages);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const reader = result.textStream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(encoder.encode(value));
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
