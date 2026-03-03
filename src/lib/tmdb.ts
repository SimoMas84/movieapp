/* =============================================
   TMDB API SERVICE
   Centralized layer for all TMDB API calls.
   Uses server-side API key for security.
   ============================================= */

const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL!;
const API_KEY = process.env.TMDB_API_KEY!;
const IMAGE_BASE = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE!;

/* =============================================
   IMAGE HELPERS
   ============================================= */
export const tmdbImage = {
  poster: (path: string | null) =>
    path ? `${IMAGE_BASE}/w500${path}` : null,
  posterLarge: (path: string | null) =>
    path ? `${IMAGE_BASE}/w780${path}` : null,
  backdrop: (path: string | null) =>
    path ? `${IMAGE_BASE}/w1280${path}` : null,
  backdropFull: (path: string | null) =>
    path ? `${IMAGE_BASE}/original${path}` : null,
  profile: (path: string | null) =>
    path ? `${IMAGE_BASE}/w185${path}` : null,
};

/* =============================================
   BASE FETCH
   Reusable fetch with auth header and
   error handling
   ============================================= */
async function tmdbFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", "it-IT");
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // cache 1 ora
  });

  if (!res.ok) throw new Error(`TMDB error: ${res.status} ${endpoint}`);
  return res.json();
}

/* =============================================
   TMDB TYPES
   ============================================= */
export interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  budget?: number;
  revenue?: number;
  status?: string;
  tagline?: string;
  media_type?: "movie" | "tv";
}

export interface TMDBCredits {
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
  }[];
  crew: {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  }[];
}

export interface TMDBVideo {
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface TMDBWatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface TMDBPageResult<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

/* =============================================
   MOVIE FUNCTIONS
   ============================================= */

/* ── Trending movies and series this week ── */
export async function getTrending(): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBPageResult<TMDBMovie>>("/trending/all/week");
  return data.results.slice(0, 12);
}

/* ── Latest movies in theatres ── */
export async function getNowPlaying(): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBPageResult<TMDBMovie>>("/movie/now_playing");
  return data.results.slice(0, 12);
}

/* ── Upcoming movies ── */
export async function getUpcoming(): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBPageResult<TMDBMovie>>("/movie/upcoming");
  return data.results.slice(0, 12);
}

/* ── Top rated movies ── */
export async function getTopRatedMovies(): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBPageResult<TMDBMovie>>("/movie/top_rated");
  return data.results.slice(0, 12);
}

/* ── Top rated series ── */
export async function getTopRatedSeries(): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBPageResult<TMDBMovie>>("/tv/top_rated");
  return data.results.slice(0, 12);
}

/* ── Movie detail by ID ── */
export async function getMovieDetail(id: number): Promise<TMDBMovie> {
  return tmdbFetch<TMDBMovie>(`/movie/${id}`);
}

/* ── Series detail by ID ── */
export async function getSeriesDetail(id: number): Promise<TMDBMovie> {
  return tmdbFetch<TMDBMovie>(`/tv/${id}`);
}

/* ── Movie credits (cast and crew) ── */
export async function getMovieCredits(id: number): Promise<TMDBCredits> {
  return tmdbFetch<TMDBCredits>(`/movie/${id}/credits`);
}

/* ── Series credits (cast and crew) ── */
export async function getSeriesCredits(id: number): Promise<TMDBCredits> {
  return tmdbFetch<TMDBCredits>(`/tv/${id}/credits`);
}

/* ── Movie videos — prefer italian trailer ── */
export async function getMovieVideos(id: number): Promise<TMDBVideo[]> {
  const data = await tmdbFetch<{ results: TMDBVideo[] }>(`/movie/${id}/videos`, {
    include_video_language: "it,en",
  });
  const videos = data.results.filter((v) => v.site === "YouTube");

  /* Priorità: trailer ufficiale italiano → trailer italiano → trailer ufficiale inglese → qualsiasi trailer */
  const itOfficial = videos.find((v) => v.type === "Trailer" && v.official && v.name.toLowerCase().includes("ital"));
  const itTrailer = videos.find((v) => v.type === "Trailer" && v.name.toLowerCase().includes("ital"));
  const enTrailer = videos.find((v) => v.type === "Trailer" && v.official);
  const anyTrailer = videos.find((v) => v.type === "Trailer");

  return [itOfficial ?? itTrailer ?? enTrailer ?? anyTrailer].filter(Boolean) as TMDBVideo[];
}

/* ── Series videos — prefer italian trailer ── */
export async function getSeriesVideos(id: number): Promise<TMDBVideo[]> {
  const data = await tmdbFetch<{ results: TMDBVideo[] }>(`/tv/${id}/videos`, {
    include_video_language: "it,en",
  });
  const videos = data.results.filter((v) => v.site === "YouTube");

  /* Priorità: trailer ufficiale italiano → trailer italiano → trailer ufficiale inglese → qualsiasi trailer */
  const itOfficial = videos.find((v) => v.type === "Trailer" && v.official && v.name.toLowerCase().includes("ital"));
  const itTrailer = videos.find((v) => v.type === "Trailer" && v.name.toLowerCase().includes("ital"));
  const enTrailer = videos.find((v) => v.type === "Trailer" && v.official);
  const anyTrailer = videos.find((v) => v.type === "Trailer");

  return [itOfficial ?? itTrailer ?? enTrailer ?? anyTrailer].filter(Boolean) as TMDBVideo[];
}

/* ── Watch providers by country ── */
export async function getWatchProviders(
  id: number,
  type: "movie" | "tv"
): Promise<TMDBWatchProvider[]> {
  const data = await tmdbFetch<{
    results: Record<string, { flatrate?: TMDBWatchProvider[] }>;
  }>(`/${type}/${id}/watch/providers`);
  return data.results?.IT?.flatrate ?? [];
}

/* ── Related movies ── */
export async function getRelatedMovies(id: number): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBPageResult<TMDBMovie>>(`/movie/${id}/similar`);
  return data.results.slice(0, 12);
}

/* ── Related series ── */
export async function getRelatedSeries(id: number): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBPageResult<TMDBMovie>>(`/tv/${id}/similar`);
  return data.results.slice(0, 12);
}

/* ── Search movies and series ── */
export async function searchMulti(query: string): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBPageResult<TMDBMovie>>("/search/multi", {
    query,
  });
  return data.results.filter(
    (r) => r.media_type === "movie" || r.media_type === "tv"
  );
}

/* ── Genre list ── */
export async function getGenres(): Promise<Record<number, string>> {
  const [movies, series] = await Promise.all([
    tmdbFetch<{ genres: { id: number; name: string }[] }>("/genre/movie/list"),
    tmdbFetch<{ genres: { id: number; name: string }[] }>("/genre/tv/list"),
  ]);
  const all = [...movies.genres, ...series.genres];
  return Object.fromEntries(all.map((g) => [g.id, g.name]));
}