import { toMovie } from "@/lib/utils";
import MovieGallery from "@/components/layout/MovieGallery";
import {
  getUpcomingSeries,
  getRecentSeriesReleases,
  getSeriesGenres,
  getPopularSeries,
} from "@/lib/tmdb";
import GenreExplorer from "@/components/layout/GenreExplorer";

/* =============================================
   SERIES PAGE — SERVER COMPONENT
   ============================================= */
export default async function SeriesPage() {
  const [upcoming, recent, genres, popular] = await Promise.all([
    getUpcomingSeries(),
    getRecentSeriesReleases(),
    getSeriesGenres(),
    getPopularSeries(),
  ]);

  /* ── Convert to Movie type ── */
  const upcomingMovies = upcoming.map((m) => toMovie(m, genres));
  const recentMovies = recent.map((m) => toMovie(m, genres));
  const popularSeries = popular.map((m) => toMovie(m, genres));

  return (
    <div className="pt-24 pb-16">
      {/* ── Page title ── */}
      <div className="px-6 md:px-10 mb-12">
        <h1 className="text-4xl md:text-5xl font-light text-text-primary mb-2">
          Serie TV
        </h1>
        <p className="text-text-secondary">Ultime uscite e prossimi arrivi</p>
      </div>

      {/* ── Recent releases gallery ── */}
      <MovieGallery title="Ultime uscite" movies={recentMovies} />

      {/* ── Upcoming series gallery ── */}
      <MovieGallery
        title="Prossimamente"
        movies={upcomingMovies}
        variant="upcoming"
      />

      {/* ── Popular series gallery ── */}
      <MovieGallery title="Serie popolari" movies={popularSeries} />

      {/* ── Genre explorer ── */}
      <div className="px-6 md:px-10 mt-16 max-w-screen-2xl mx-auto">
        <h2 className="text-2xl font-light text-text-primary mb-2">
          Esplora per genere
        </h2>
        <p className="text-text-muted text-sm mb-8">
          Trova le tue serie preferite
        </p>
        <GenreExplorer genres={genres} mediaType="tv" />
      </div>
    </div>
  );
}
