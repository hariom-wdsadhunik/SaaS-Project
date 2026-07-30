export interface RetryPolicyConfig {
  maxAttempts: number;
  initialDelayMs: number;
  backoffFactor: number;
}

export class RetryPolicy {
  private config: RetryPolicyConfig;

  constructor(config?: Partial<RetryPolicyConfig>) {
    this.config = {
      maxAttempts: config?.maxAttempts ?? 3,
      initialDelayMs: config?.initialDelayMs ?? 100,
      backoffFactor: config?.backoffFactor ?? 2,
    };
  }

  public shouldRetry(currentAttempts: number): boolean {
    return currentAttempts < this.config.maxAttempts;
  }

  public getNextDelayMs(attempt: number): number {
    return this.config.initialDelayMs * Math.pow(this.config.backoffFactor, attempt - 1);
  }
}

export const defaultRetryPolicy = new RetryPolicy();
