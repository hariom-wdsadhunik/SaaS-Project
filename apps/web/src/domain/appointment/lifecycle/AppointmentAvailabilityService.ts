export const AppointmentAvailabilityService = {
  isWithinBusinessHours(isoDateString: string): boolean {
    const d = new Date(isoDateString);
    const hour = d.getHours();
    return hour >= 8 && hour < 18;
  },
};
