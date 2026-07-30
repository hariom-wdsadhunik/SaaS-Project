export interface EmbeddingProvider {
  embedText(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
}

export class MockEmbeddingProvider implements EmbeddingProvider {
  public async embedText(text: string): Promise<number[]> {
    // Generate deterministic 1536-dimensional mock embedding vector
    const vector = new Array(1536).fill(0).map((_, i) => Math.sin(text.length + i) * 0.1);
    return vector;
  }

  public async embedBatch(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((t) => this.embedText(t)));
  }
}
