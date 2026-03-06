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

import { TMDBMovie } from "@/lib/tmdb";
import { Movie } from "@/types/movie";

export function toMovie(m: TMDBMovie, genres: Record<number, string>): Movie {
  const isTV = !m.title;
  return {
    id: m.id,
    title: m.title ?? m.name ?? "",
    originalTitle: m.original_title ?? m.original_name ?? "",
    year: new Date(m.release_date ?? m.first_air_date ?? "").getFullYear(),
    director: "",
    genre: m.genre_ids?.map((id) => genres[id]).filter(Boolean) ?? [],
    rating: Math.round(m.vote_average * 10) / 10,
    poster: m.poster_path,
    backdrop: m.backdrop_path,
    trailerKey: null,
    plot: m.overview,
    cast: [],
    awards: [],
    upcoming: false,
    type: isTV ? "serie" : "film",
    releaseDate: m.release_date ?? m.first_air_date ?? undefined,
  };
}