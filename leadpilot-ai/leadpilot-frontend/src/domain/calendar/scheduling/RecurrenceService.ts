export type RecurrencePattern = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | "NONE";

export const RecurrenceService = {
  generateOccurrences(startIso: string, pattern: RecurrencePattern, count: number = 5): string[] {
    if (pattern === "NONE") return [startIso];

    const dates: string[] = [];
    const base = new Date(startIso);

    for (let i = 0; i < count; i++) {
      const d = new Date(base);
      if (pattern === "DAILY") d.setDate(base.getDate() + i);
      if (pattern === "WEEKLY") d.setDate(base.getDate() + i * 7);
      if (pattern === "MONTHLY") d.setMonth(base.getMonth() + i);
      if (pattern === "YEARLY") d.setFullYear(base.getFullYear() + i);
      dates.push(d.toISOString());
    }

    return dates;
  },
};
