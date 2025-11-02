import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow, isBefore } from "date-fns";
import { twMerge } from "tailwind-merge";

import type { Post } from "@/content.config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitialsFromFullName(name: string | null) {
  if (!name) return "";
  // If no spaces, just use first letter (handles emails, single-word names, etc.)
  if (!name.includes(" ")) return name.charAt(0).toUpperCase();
  const names = name.split(" ");
  return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
}

export function getAvatarColour(name: string | undefined) {
  if (!name) return "bg-gray-3 text-primary";
  const initial = name.slice(0, 1).toLowerCase();

  if (/[a-d]/i.test(initial)) return "bg-red-200 text-red-900";
  if (/[e-h]/i.test(initial)) return "bg-green-200 text-green-900";
  if (/[i-l]/i.test(initial)) return "bg-yellow-200 text-yellow-900";
  if (/[m-q]/i.test(initial)) return "bg-blue-200 text-blue-900";
  if (/[r-t]/i.test(initial)) return "bg-indigo-200 text-indigo-900";
  if (/[u-w]/i.test(initial)) return "bg-purple-200 text-purple-900";
  if (/[x-z]/i.test(initial)) return "bg-pink-200 text-pink-900";

  return "bg-gray-3 text-primary";
}

export function fromNow(date: Date, verbose?: boolean) {
  const distance = formatDistanceToNow(date, { addSuffix: false });

  if (verbose) return `${distance} ago`;

  // Remove qualifiers like "about", "almost", "over", "less than"
  const cleanDistance = distance.replace(/^(about|almost|over|less than) /, "");

  // Split the cleaned distance string into value and unit
  const [value, unit] = cleanDistance.split(" ");

  // Define custom abbreviations
  const unitAbbreviations: { [key: string]: string } = {
    second: "s",
    minute: "min",
    hour: "h",
    day: "d",
    week: "w",
    month: "mo",
    year: "y",
  };

  const singularUnit = unit.endsWith("s") ? unit.slice(0, -1) : unit;

  // Get the appropriate abbreviation, defaulting to the first character if not found
  const abbreviatedUnit =
    unitAbbreviations[
      singularUnit.toLowerCase() as keyof typeof unitAbbreviations
    ] ?? singularUnit.charAt(0).toLowerCase();

  return `${value} ${abbreviatedUnit} ago`;
}

export async function waitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function filterPosts(posts: Post[]) {
  const isDev = process.env.NODE_ENV === "development";

  /** If prod, then filter out future posts */
  const validPosts = !isDev
    ? posts.filter(
        (post) => isBefore(post.data.date, new Date()) && !post.data.hide,
      )
    : posts.filter((post) => !post.data.hide);
  return validPosts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );
}

export function clamp(val: number, [min, max]: [number, number]): number {
  return Math.min(Math.max(val, min), max);
}

export function getEmptyTipTapContent() {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [],
      },
    ],
  };
}
