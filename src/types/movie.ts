/* ============================================================
   MOVIE TYPE
   Shared type for both films and TV series throughout the app.
   Fields marked optional are type-specific or lazy-loaded
   (e.g. trailerKey is fetched on modal open, not on list load).
   ============================================================ */

export interface Movie {
  id: number;
  title: string;
  originalTitle?: string;
  year: number;
  director: string;
  genre: string[];
  rating: number;
  poster: string | null;
  backdrop: string | null;
  /** Fetched on demand when opening the modal */
  trailerKey: string | null;
  plot: string;
  cast: string[];
  awards: string[];
  upcoming: boolean;
  type: "film" | "serie";
  releaseDate?: string;
  /* ── Film only ── */
  runtime?: number;
  /* ── Serie only ── */
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
}