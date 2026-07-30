import { AIProvider } from "../types";

export interface ModelRouteSelection {
  provider: AIProvider;
  model: string;
}

export const ModelRouter = {
  route(taskType: "summary" | "chat" | "completion" | "embedding"): ModelRouteSelection {
    switch (taskType) {
      case "summary":
        return { provider: "OPENAI", model: "gpt-4o-mini" };
      case "chat":
        return { provider: "ANTHROPIC", model: "claude-3-5-sonnet" };
      case "completion":
        return { provider: "OPENAI", model: "gpt-4o" };
      case "embedding":
        return { provider: "OPENAI", model: "text-embedding-3-small" };
    }
  },
};
