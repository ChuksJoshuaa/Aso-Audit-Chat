import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";

export type ModelProvider = "openai" | "anthropic";

export interface ModelConfig {
  provider: ModelProvider;
  modelId: string;
}

const MODEL_CONFIGS: Record<string, ModelConfig> = {
  "gpt-4o": { provider: "openai", modelId: "gpt-4o" },
  "gpt-4o-mini": { provider: "openai", modelId: "gpt-4o-mini" },
  "gpt-4-turbo": { provider: "openai", modelId: "gpt-4-turbo" },
  "claude-sonnet-4": { provider: "anthropic", modelId: "claude-sonnet-4-20250514" },
  "claude-3-5-sonnet": { provider: "anthropic", modelId: "claude-3-5-sonnet-20241022" },
  "claude-3-opus": { provider: "anthropic", modelId: "claude-3-opus-20240229" },
};

export function getModelName(): string {
  return process.env.AI_MODEL || "gpt-4o";
}

export function getModel() {
  const modelName = getModelName();
  const config = MODEL_CONFIGS[modelName];

  if (!config) {
    throw new Error(
      `Unknown model: ${modelName}. Available models: ${Object.keys(MODEL_CONFIGS).join(", ")}`
    );
  }

  if (config.provider === "openai") {
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    return openai(config.modelId);
  }

  if (config.provider === "anthropic") {
    const anthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    return anthropic(config.modelId);
  }

  throw new Error(`Unknown provider: ${config.provider}`);
}
