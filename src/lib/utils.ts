/* =============================================
   MOVIEAPP — UTILITY FUNCTIONS
   ============================================= */

/**
 * Formats a rating number to one decimal place
 * Returns "N/D" if rating is 0 or undefined
 */
export const formatRating = (rating: number): string => {
  if (!rating || rating === 0) return "N/D";
  return rating.toFixed(1);
};

/**
 * Truncates a string to a given length
 * and appends ellipsis if needed
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
};

/**
 * Builds a TMDB image URL from a path
 * Returns null if path is null or empty
 */
export const tmdbImage = (
  path: string | null,
  size: "w500" | "w780" | "original" = "w500"
): string | null => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

/**
 * Formats an array of strings into a
 * comma-separated readable string
 */
export const formatList = (items: string[]): string => {
  if (!items || items.length === 0) return "";
  return items.join(", ");
};

/**
 * Returns initials from a full name
 * e.g. "Christopher Nolan" → "CN"
 */
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};