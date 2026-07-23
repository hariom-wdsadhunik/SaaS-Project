/**
 * LeadPilot AI CRM - Formatters & Helper Utilities
 */

export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatDate(
  dateInput: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "N/A";

  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  };

  return new Intl.DateTimeFormat("en-US", defaultOptions).format(date);
}

export function formatRelativeTime(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(date);
}

export function formatPhoneNumber(phoneNumberString: string): string {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = match[1] ? "+1 " : "";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }
  return phoneNumberString;
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error writing to localStorage", error);
  }
}
