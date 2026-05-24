import { Mastra } from "@mastra/core";
import { asoAuditAgent } from "./agents";

export const mastra = new Mastra({
  agents: { asoAuditAgent },
});
