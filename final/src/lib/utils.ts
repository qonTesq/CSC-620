import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge Tailwind classes while preserving the last conflicting utility.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
