/* ============================================================
   UTILITY FUNCTIONS
   Shared helpers used across the app.
   ============================================================ */

import { TMDBMovie } from "@/lib/tmdb";
import { Movie } from "@/types/movie";

/* ── Format a rating to one decimal place ──
   Returns "N/D" if rating is 0 or falsy */
export const formatRating = (rating: number): string => {
  if (!rating) return "N/D";
  return rating.toFixed(1);
};

/* ── Return up to 2 initials from a full name ──
   e.g. "Christopher Nolan" → "CN" */
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/* ── Convert a TMDBMovie to the app Movie type ──
   Handles both movies and TV series.
   genres is a Record<id, name> map from getGenres(). */
export function toMovie(m: TMDBMovie, genres: Record<number, string>): Movie {
  const isTV =
    m.media_type === "tv" || (!m.title && !!m.name) || !!m.first_air_date;

  return {
    id: m.id,
    title: m.title ?? m.name ?? "",
    originalTitle: m.original_title ?? m.original_name ?? "",
    year: new Date(m.release_date ?? m.first_air_date ?? "").getFullYear(),
    director: "",
    genre:
      m.genre_ids?.map((id) => genres[id]).filter(Boolean) ??
      m.genres?.map((g) => g.name) ??
      [],
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
    runtime: m.runtime,
    numberOfSeasons: m.number_of_seasons,
    numberOfEpisodes: m.number_of_episodes,
  };
}