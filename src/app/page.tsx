import HeroBanner from "@/components/layout/HeroBanner";
import MovieGallery from "@/components/layout/MovieGallery";
import {
  getTrending,
  getLatestAll,
  getUpcomingAll,
  getPopularMovies,
  getPopularSeries,
  getGenres,
} from "@/lib/tmdb";
import { toMovie } from "@/lib/utils";

/* =============================================
   HOME PAGE — SERVER COMPONENT
   Fetches all data in parallel server-side
   ============================================= */
export default async function Home() {
  /* ── Fetch all data in parallel ── */
  const [trending, latest, upcoming, topMovies, topSeries, genres] =
    await Promise.all([
      getTrending(),
      getLatestAll(),
      getUpcomingAll(),
      getPopularMovies(),
      getPopularSeries(),
      getGenres(),
    ]);

  /* ── Convert to Movie type ── */
  const heroMovies = trending.slice(0, 10).map((m) => toMovie(m, genres));
  const latestMovies = latest.map((m) => toMovie(m, genres));
  const upcomingMovies = upcoming.map((m) => toMovie(m, genres));
  const topRatedFilms = topMovies.map((m) => toMovie(m, genres));
  const topRatedSeries = topSeries.map((m) => toMovie(m, genres));

  return (
    <>
      <HeroBanner movies={heroMovies} />
      <MovieGallery title="Ultime uscite" movies={latestMovies} />
      <MovieGallery
        title="Prossime uscite"
        movies={upcomingMovies}
        variant="upcoming"
      />
      <MovieGallery title="Film popolari" movies={topRatedFilms} />
      <MovieGallery title="Serie popolari" movies={topRatedSeries} />
    </>
  );
}
