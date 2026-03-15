/* ============================================================
   TMDB API SERVICE
   Centralized layer for all TMDB API calls.
   Uses server-side API key for security.
   Results are cached for 1 hour by default (next.revalidate).
   ============================================================ */

const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL!;
const API_KEY  = process.env.TMDB_API_KEY!;
const IMAGE_BASE = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE!;

/* ============================================================
   IMAGE HELPERS
   ============================================================ */
export const tmdbImage = {
  poster:       (path: string | null) => path ? `${IMAGE_BASE}/w500${path}`     : null,
  posterLarge:  (path: string | null) => path ? `${IMAGE_BASE}/w780${path}`     : null,
  backdrop:     (path: string | null) => path ? `${IMAGE_BASE}/w1280${path}`    : null,
  backdropFull: (path: string | null) => path ? `${IMAGE_BASE}/original${path}` : null,
  profile:      (path: string | null) => path ? `${IMAGE_BASE}/w185${path}`     : null,
};

/* ============================================================
   TYPES
   ============================================================ */

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
  number_of_seasons?: number;
  number_of_episodes?: number;
  budget?: number;
  revenue?: number;
  status?: string;
  tagline?: string;
  profile_path?: string | null;
  media_type?: "movie" | "tv" | "person";
}

export interface TMDBPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  biography?: string;
  birthday?: string;
  deathday?: string | null;
  place_of_birth?: string;
  popularity: number;
  also_known_as?: string[];
  imdb_id?: string;
  homepage?: string | null;
  media_type?: "person";
}

export interface TMDBPersonCredits {
  cast: (TMDBMovie & { character?: string })[];
  crew: (TMDBMovie & { job?: string; department?: string })[];
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
  iso_639_1: string;  /* language code — e.g. "it", "en" */
  iso_3166_1: string; /* country code  — e.g. "IT", "US" */
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

/* ============================================================
   BASE FETCH
   ============================================================ */
async function tmdbFetch<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", "it-IT");
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB error: ${res.status} ${endpoint}`);
  return res.json();
}

/* ============================================================
   INTERNAL UTILITIES
   ============================================================ */

function withPoster<T extends { poster_path: string | null }>(items: T[]): T[] {
  return items.filter((m) => m.poster_path);
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getTomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function getMonthsAgo(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d.toISOString().split("T")[0];
}

function getEndOfYear(): string {
  return `${new Date().getFullYear()}-12-31`;
}

function getYearsAgo(years: number): string {
  return `${new Date().getFullYear() - years}-01-01`;
}

/* ── Prefer Italian trailer, fallback to English ── */
function pickBestTrailer(videos: TMDBVideo[]): TMDBVideo[] {
  const yt = videos.filter((v) => v.site === "YouTube");
  const itOfficial = yt.find((v) => v.type === "Trailer" && v.official && v.iso_639_1 === "it");
  const itTrailer  = yt.find((v) => v.type === "Trailer" && v.iso_639_1 === "it");
  const enOfficial = yt.find((v) => v.type === "Trailer" && v.official && v.iso_639_1 === "en");
  const anyTrailer = yt.find((v) => v.type === "Trailer");
  return [itOfficial ?? itTrailer ?? enOfficial ?? anyTrailer].filter(Boolean) as TMDBVideo[];
}

/* ============================================================
   GENRE FUNCTIONS
   ============================================================ */

export async function getGenres(): Promise<Record<number, string>> {
  const [movies, series] = await Promise.all([
    tmdbFetch<{ genres: { id: number; name: string }[] }>("/genre/movie/list"),
    tmdbFetch<{ genres: { id: number; name: string }[] }>("/genre/tv/list"),
  ]);
  return Object.fromEntries(
    [...movies.genres, ...series.genres].map((g) => [g.id, g.name])
  );
}

export async function getMovieGenres(): Promise<Record<number, string>> {
  const data = await tmdbFetch<{ genres: { id: number; name: string }[] }>("/genre/movie/list");
  return Object.fromEntries(data.genres.map((g) => [g.id, g.name]));
}

export async function getSeriesGenres(): Promise<Record<number, string>> {
  const data = await tmdbFetch<{ genres: { id: number; name: string }[] }>("/genre/tv/list");
  return Object.fromEntries(data.genres.map((g) => [g.id, g.name]));
}

/* ============================================================
   MOVIE & SERIES FUNCTIONS
   ============================================================ */

export async function getTrending(): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBPageResult<TMDBMovie>>("/trending/all/week");
  return withPoster(data.results.filter((m) => m.vote_average >= 7)).slice(0, 20);
}

export async function getMovieDetail(id: number): Promise<TMDBMovie> {
  return tmdbFetch<TMDBMovie>(`/movie/${id}`);
}

export async function getSeriesDetail(id: number): Promise<TMDBMovie> {
  return tmdbFetch<TMDBMovie>(`/tv/${id}`);
}

export async function getMovieCredits(id: number): Promise<TMDBCredits> {
  return tmdbFetch<TMDBCredits>(`/movie/${id}/credits`);
}

export async function getSeriesCredits(id: number): Promise<TMDBCredits> {
  return tmdbFetch<TMDBCredits>(`/tv/${id}/credits`);
}

export async function getMovieVideos(id: number): Promise<TMDBVideo[]> {
  const data = await tmdbFetch<{ results: TMDBVideo[] }>(`/movie/${id}/videos`, {
    include_video_language: "it,en",
  });
  return pickBestTrailer(data.results);
}

export async function getSeriesVideos(id: number): Promise<TMDBVideo[]> {
  const data = await tmdbFetch<{ results: TMDBVideo[] }>(`/tv/${id}/videos`, {
    include_video_language: "it,en",
  });
  return pickBestTrailer(data.results);
}

export async function getWatchProviders(
  id: number,
  type: "movie" | "tv"
): Promise<TMDBWatchProvider[]> {
  const data = await tmdbFetch<{
    results: Record<string, { flatrate?: TMDBWatchProvider[] }>;
  }>(`/${type}/${id}/watch/providers`);
  return data.results?.IT?.flatrate ?? [];
}

export async function getRelatedMovies(id: number): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBPageResult<TMDBMovie>>(`/movie/${id}/recommendations`);
  return withPoster(data.results).slice(0, 20);
}

export async function getRelatedSeries(id: number): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBPageResult<TMDBMovie>>(`/tv/${id}/recommendations`);
  return withPoster(data.results).slice(0, 20);
}

export async function getRecentReleases(): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBPageResult<TMDBMovie>>("/discover/movie", {
    "release_date.gte": getMonthsAgo(2),
    "release_date.lte": getToday(),
    with_release_type: "3|2",
    sort_by: "release_date.desc",
    region: "IT",
    "vote_count.gte": "5",
    with_original_language: "it|en|fr|de|es",
  });
  return withPoster(data.results);
}

export async function getUpcomingTheatrical(): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBPageResult<TMDBMovie>>("/discover/movie", {
    "release_date.gte": getTomorrow(),
    "release_date.lte": getEndOfYear(),
    with_release_type: "3|2",
    sort_by: "release_date.asc",
    region: "IT",
    with_original_language: "it|en|fr|de|es",
  });
  return withPoster(data.results);
}

export async function getUpcomingStreaming(): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBPageResult<TMDBMovie>>("/discover/movie", {
    "release_date.gte": getTomorrow(),
    "release_date.lte": getEndOfYear(),
    with_release_type: "4|5|6",
    sort_by: "release_date.asc",
    region: "IT",
    with_original_language: "it|en|fr|de|es",
  });
  return withPoster(data.results);
}

export async function getUpcomingAll(): Promise<TMDBMovie[]> {
  const [movies, series] = await Promise.all([
    tmdbFetch<TMDBPageResult<TMDBMovie>>("/discover/movie", {
      "release_date.gte": getTomorrow(),
      "release_date.lte": getEndOfYear(),
      with_release_type: "3|2",
      sort_by: "release_date.asc",
      region: "IT",
      with_original_language: "it|en|fr|de|es",
    }),
    tmdbFetch<TMDBPageResult<TMDBMovie>>("/discover/tv", {
      "first_air_date.gte": getTomorrow(),
      "first_air_date.lte": getEndOfYear(),
      sort_by: "first_air_date.asc",
      with_original_language: "it|en|fr|de|es",
    }),
  ]);

  return [
    ...movies.results.map((m) => ({ ...m, media_type: "movie" as const })),
    ...series.results.map((m) => ({ ...m, media_type: "tv" as const })),
  ]
    .filter((m) => m.poster_path)
    .sort((a, b) =>
      (a.release_date ?? a.first_air_date ?? "").localeCompare(
        b.release_date ?? b.first_air_date ?? ""
      )
    )
    .slice(0, 20);
}

export async function getLatestAll(): Promise<TMDBMovie[]> {
  const [movies, series] = await Promise.all([
    tmdbFetch<TMDBPageResult<TMDBMovie>>("/discover/movie", {
      "release_date.gte": getMonthsAgo(2),
      "release_date.lte": getToday(),
      with_release_type: "3|2",
      sort_by: "release_date.desc",
      region: "IT",
      "vote_count.gte": "10",
      with_original_language: "it|en|fr|de|es",
    }),
    tmdbFetch<TMDBPageResult<TMDBMovie>>("/discover/tv", {
      "first_air_date.gte": getMonthsAgo(2),
      "first_air_date.lte": getToday(),
      sort_by: "first_air_date.desc",
      "vote_count.gte": "10",
      with_original_language: "it|en|fr|de|es",
    }),
  ]);

  return [
    ...movies.results.map((m) => ({ ...m, media_type: "movie" as const })),
    ...series.results.map((m) => ({ ...m, media_type: "tv" as const })),
  ]
    .filter((m) => m.poster_path)
    .sort((a, b) =>
      (b.release_date ?? b.first_air_date ?? "").localeCompare(
        a.release_date ?? a.first_air_date ?? ""
      )
    )
    .slice(0, 20);
}

export async function getPopularMovies(): Promise<TMDBMovie[]> {
  const randomPage = Math.floor(Math.random() * 20) + 1;
  const data = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=it-IT&sort_by=popularity.desc&vote_average.gte=7&vote_count.gte=500&primary_release_date.gte=${getYearsAgo(30)}&page=${randomPage}`,
    { cache: "no-store" }
  ).then((r) => r.json()) as TMDBPageResult<TMDBMovie>;
  return withPoster(data.results).slice(0, 20);
}

export async function getPopularSeries(): Promise<TMDBMovie[]> {
  const randomPage = Math.floor(Math.random() * 20) + 1;
  const data = await fetch(
    `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=it-IT&sort_by=popularity.desc&vote_average.gte=7&vote_count.gte=500&first_air_date.gte=${getYearsAgo(30)}&page=${randomPage}`,
    { cache: "no-store" }
  ).then((r) => r.json()) as TMDBPageResult<TMDBMovie>;
  return withPoster(data.results).slice(0, 20);
}

export async function getUpcomingSeries(): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBPageResult<TMDBMovie>>("/discover/tv", {
    "first_air_date.gte": getTomorrow(),
    "first_air_date.lte": getEndOfYear(),
    sort_by: "first_air_date.asc",
    with_original_language: "it|en|fr|de|es",
  });
  return withPoster(data.results);
}

export async function getRecentSeriesReleases(): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBPageResult<TMDBMovie>>("/discover/tv", {
    "first_air_date.gte": getMonthsAgo(2),
    "first_air_date.lte": getToday(),
    sort_by: "first_air_date.desc",
    "vote_count.gte": "5",
    with_original_language: "it|en|fr|de|es",
  });
  return withPoster(data.results);
}

export async function discoverByGenre(
  genreId: string,
  page: number = 1,
  sortBy: string = "vote_average.desc",
  mediaType: "movie" | "tv" = "movie"
): Promise<TMDBPageResult<TMDBMovie>> {
  const data = await tmdbFetch<TMDBPageResult<TMDBMovie>>(`/discover/${mediaType}`, {
    with_genres: genreId,
    sort_by: sortBy,
    "vote_count.gte": "200",
    page: String(page),
  });
  return { ...data, results: withPoster(data.results) };
}

export async function getItemsByIds(
  items: { tmdb_id: number; media_type: "movie" | "tv" }[]
): Promise<TMDBMovie[]> {
  const results = await Promise.allSettled(
    items.map(({ tmdb_id, media_type }) =>
      media_type === "movie" ? getMovieDetail(tmdb_id) : getSeriesDetail(tmdb_id)
    )
  );
  return results
    .filter((r): r is PromiseFulfilledResult<TMDBMovie> => r.status === "fulfilled")
    .map((r, i) => ({ ...r.value, media_type: items[i].media_type }));
}

/* ============================================================
   SEARCH FUNCTIONS
   ============================================================ */

export async function searchMulti(query: string): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBPageResult<TMDBMovie>>("/search/multi", { query });
  return withPoster(
    data.results.filter((r) => r.media_type === "movie" || r.media_type === "tv")
  );
}

export async function searchPeople(query: string): Promise<TMDBPerson[]> {
  const data = await tmdbFetch<TMDBPageResult<TMDBMovie>>("/search/multi", { query });
  return data.results
    .filter((r) => r.media_type === "person" && r.profile_path)
    .map((r) => r as unknown as TMDBPerson);
}

/* ============================================================
   PERSON FUNCTIONS
   ============================================================ */

export async function getPopularActors(): Promise<TMDBPerson[]> {
  const data = await tmdbFetch<TMDBPageResult<TMDBPerson>>("/person/popular", {
    page: "1",
    language: "en-US",
  });
  return data.results.filter(
    (p) => p.known_for_department === "Acting" && p.profile_path
  );
}

export async function getPopularDirectors(): Promise<TMDBPerson[]> {
  const pages = await Promise.all(
    [1, 2, 3, 4, 5].map((page) =>
      tmdbFetch<TMDBPageResult<TMDBPerson>>("/person/popular", {
        page: String(page),
        language: "en-US",
      })
    )
  );
  return pages
    .flatMap((p) => p.results)
    .filter((p) => p.known_for_department === "Directing" && p.profile_path);
}

export async function getPersonDetail(id: number): Promise<TMDBPerson> {
  return tmdbFetch<TMDBPerson>(`/person/${id}`, { language: "en-US" });
}

export async function getPersonMovieCredits(id: number): Promise<TMDBPersonCredits> {
  return tmdbFetch<TMDBPersonCredits>(`/person/${id}/movie_credits`);
}

export async function getPersonTVCredits(id: number): Promise<TMDBPersonCredits> {
  return tmdbFetch<TMDBPersonCredits>(`/person/${id}/tv_credits`);
}