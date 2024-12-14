import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
