export interface MemoryRecord {
  id: string;
  text: string;
  relevanceScore: number;
}

export const MemoryRanking = {
  rankRecords(records: MemoryRecord[], topK: number = 3): MemoryRecord[] {
    return records.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, topK);
  },
};
