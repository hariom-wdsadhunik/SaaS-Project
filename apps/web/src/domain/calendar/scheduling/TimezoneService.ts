export const TimezoneService = {
  formatInTimezone(isoDateString: string, timeZone: string = "UTC"): string {
    return new Date(isoDateString).toLocaleString("en-US", { timeZone });
  },
  toUtcIso(dateInput: string | Date): string {
    return new Date(dateInput).toISOString();
  },
};
