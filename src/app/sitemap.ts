import type { MetadataRoute } from "next";

/* ============================================================
   SITEMAP
   Static routes + dynamic movie/serie/person pages
   fetched from TMDB.
   ============================================================ */

const BASE_URL = "https://www.movieapp.it";

/* ── Fetch helpers ── */
async function fetchPopularMovies(): Promise<number[]> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=it-IT&page=1`,
      { next: { revalidate: 86400 } }
    );
    const data = await res.json();
    return (data.results ?? []).map((m: { id: number }) => m.id);
  } catch {
    return [];
  }
}

async function fetchPopularSeries(): Promise<number[]> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.TMDB_API_KEY}&language=it-IT&page=1`,
      { next: { revalidate: 86400 } }
    );
    const data = await res.json();
    return (data.results ?? []).map((s: { id: number }) => s.id);
  } catch {
    return [];
  }
}

async function fetchPopularPeople(): Promise<number[]> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/person/popular?api_key=${process.env.TMDB_API_KEY}&language=it-IT&page=1`,
      { next: { revalidate: 86400 } }
    );
    const data = await res.json();
    return (data.results ?? []).map((p: { id: number }) => p.id);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* ── Static routes ── */
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,           lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE_URL}/films`,  lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE_URL}/series`, lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE_URL}/people`, lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
  ];

  /* ── Dynamic routes ── */
  const [movieIds, serieIds, peopleIds] = await Promise.all([
    fetchPopularMovies(),
    fetchPopularSeries(),
    fetchPopularPeople(),
  ]);

  const movieRoutes: MetadataRoute.Sitemap = movieIds.map((id) => ({
    url: `${BASE_URL}/movie/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const serieRoutes: MetadataRoute.Sitemap = serieIds.map((id) => ({
    url: `${BASE_URL}/serie/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const peopleRoutes: MetadataRoute.Sitemap = peopleIds.map((id) => ({
    url: `${BASE_URL}/person/${id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...movieRoutes, ...serieRoutes, ...peopleRoutes];
}