import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number | string | null | undefined) {
  const numericValue = Number(value || 0);
  return new Intl.NumberFormat("en-US").format(numericValue);
}

export function formatBytes(bytes: number | null | undefined) {
  const value = Number(bytes || 0);
  if (value === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  const amount = value / Math.pow(1024, exponent);

  return `${amount.toFixed(amount >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "Unknown";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}
