import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isValid } from "date-fns";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTimestamp = (timestamp?: string | number) => {
  if (!timestamp) return "Unknown";

  let date: Date;

  if (typeof timestamp === "string") {
    date = new Date(timestamp); // Convert ISO string to Date
  } else {
    // Convert seconds to milliseconds if necessary
    const adjustedTimestamp = timestamp < 1e10 ? timestamp * 1000 : timestamp;
    date = new Date(adjustedTimestamp);
  }

  if (!isValid(date)) return "Unknown";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 10) return "just now";
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;

  return format(date, "dd MMM yyyy");
};
