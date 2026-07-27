import { AIProvider } from "../types";

export interface ProviderCapability {
  provider: AIProvider;
  supportedModels: string[];
  maxContextTokens: number;
}

export class ProviderRegistry {
  private providers: Map<AIProvider, ProviderCapability> = new Map();

  constructor() {
    this.register({
      provider: "OPENAI",
      supportedModels: ["gpt-4o", "gpt-4o-mini"],
      maxContextTokens: 128000,
    });
    this.register({
      provider: "ANTHROPIC",
      supportedModels: ["claude-3-5-sonnet", "claude-3-haiku"],
      maxContextTokens: 200000,
    });
    this.register({
      provider: "GOOGLE",
      supportedModels: ["gemini-1.5-pro", "gemini-1.5-flash"],
      maxContextTokens: 1000000,
    });
    this.register({
      provider: "MOCK",
      supportedModels: ["mock-gpt-4o"],
      maxContextTokens: 32000,
    });
  }

  register(cap: ProviderCapability): void {
    this.providers.set(cap.provider, cap);
  }

  getProvider(provider: AIProvider): ProviderCapability {
    const p = this.providers.get(provider);
    if (!p) throw new Error(`AI Provider not registered: ${provider}`);
    return p;
  }
}

export const providerRegistry = new ProviderRegistry();
