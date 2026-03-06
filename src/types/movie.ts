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

// export interface Movie {
//   id: number;
//   title: string;
//   originalTitle?: string;
//   year: number;
//   director: string;
//   genre: string[];
//   rating: number;
//   poster: string | null;
//   backdrop: string | null;
//   trailerKey: string | null;
//   plot: string;
//   cast: string[];
//   awards: string[];
//   upcoming: boolean;
//   type: "film" | "serie";
//   releaseDate?: string;
// }