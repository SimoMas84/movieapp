import type { MetadataRoute } from "next";

/* ============================================================
   SITEMAP
   Static routes + dynamic movie/serie/person pages
   fetched from TMDB. Updates every 24 hours.
   ============================================================ */

const BASE_URL    = "https://www.movieapp.it";
const TMDB_KEY    = process.env.TMDB_API_KEY;
const REVALIDATE  = { next: { revalidate: 86400 } };

/* ── Fetch helpers ── */
async function fetchIds(url: string): Promise<number[]> {
  try {
    const res  = await fetch(url, REVALIDATE);
    const data = await res.json();
    return (data.results ?? []).map((m: { id: number }) => m.id);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* ── Static routes ── */
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,             lastModified: new Date(), changeFrequency: "daily",  priority: 1.0 },
    { url: `${BASE_URL}/films`,  lastModified: new Date(), changeFrequency: "daily",  priority: 0.9 },
    { url: `${BASE_URL}/series`, lastModified: new Date(), changeFrequency: "daily",  priority: 0.9 },
    { url: `${BASE_URL}/people`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  /* ── Fetch all sources in parallel ── */
  const [
    popularMovieIds,
    topMovieIds,
    popularSerieIds,
    topSerieIds,
    peopleIds,
  ] = await Promise.all([
    /* Film popolari del momento */
    fetchIds(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=it-IT&page=1`),
    /* Film top qualità — vote_average >= 7, vote_count >= 500 */
    fetchIds(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&language=it-IT&sort_by=popularity.desc&vote_average.gte=7&vote_count.gte=500&page=1`),
    /* Serie popolari del momento */
    fetchIds(`https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_KEY}&language=it-IT&page=1`),
    /* Serie top qualità — vote_average >= 7, vote_count >= 500 */
    fetchIds(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_KEY}&language=it-IT&sort_by=popularity.desc&vote_average.gte=7&vote_count.gte=500&page=1`),
    /* Persone popolari */
    fetchIds(`https://api.themoviedb.org/3/person/popular?api_key=${TMDB_KEY}&language=it-IT&page=1`),
  ]);

  /* ── Deduplica IDs ── */
  const movieIds  = [...new Set([...popularMovieIds,  ...topMovieIds])];
  const serieIds  = [...new Set([...popularSerieIds,  ...topSerieIds])];

  /* ── Dynamic routes ── */
  const movieRoutes: MetadataRoute.Sitemap = movieIds.map((id) => ({
    url:             `${BASE_URL}/movie/${id}`,
    lastModified:    new Date(),
    changeFrequency: "weekly",
    priority:        0.7,
  }));

  const serieRoutes: MetadataRoute.Sitemap = serieIds.map((id) => ({
    url:             `${BASE_URL}/serie/${id}`,
    lastModified:    new Date(),
    changeFrequency: "weekly",
    priority:        0.7,
  }));

  const peopleRoutes: MetadataRoute.Sitemap = peopleIds.map((id) => ({
    url:             `${BASE_URL}/person/${id}`,
    lastModified:    new Date(),
    changeFrequency: "monthly",
    priority:        0.6,
  }));

  return [...staticRoutes, ...movieRoutes, ...serieRoutes, ...peopleRoutes];
}