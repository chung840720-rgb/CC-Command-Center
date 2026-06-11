import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  if (value >= 10000000) return `NT$${(value / 10000).toFixed(0)}萬`;
  if (value >= 10000) return `NT$${(value / 10000).toFixed(1)}萬`;
  return `NT$${value.toLocaleString()}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString();
}
