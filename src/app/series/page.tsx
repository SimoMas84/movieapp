/* ============================================================
   SERIES PAGE — Server Component
   ============================================================ */

import { Tv } from "lucide-react";
import { toMovie } from "@/lib/utils";
import MovieGallery from "@/components/layout/MovieGallery";
import {
  getUpcomingSeries,
  getRecentSeriesReleases,
  getSeriesGenres,
  getPopularSeries,
} from "@/lib/tmdb";
import GenreExplorer from "@/components/layout/GenreExplorer";

export default async function SeriesPage() {
  const [upcoming, recent, genres, popular] = await Promise.all([
    getUpcomingSeries(),
    getRecentSeriesReleases(),
    getSeriesGenres(),
    getPopularSeries(),
  ]);

  const upcomingMovies = upcoming.map((m) => toMovie(m, genres));
  const recentMovies = recent.map((m) => toMovie(m, genres));
  const popularSeries = popular.map((m) => toMovie(m, genres));

  return (
    <div className="pb-16">
      {/* Header */}
      <div className="flex items-end gap-4 px-6 md:px-10 mb-12 pt-32">
        <Tv size={52} className="text-blue-400 mb-1" />
        <h1 className="text-4xl lg:text-5xl font-light text-text-primary">
          Serie
        </h1>
      </div>

      <MovieGallery title="Ultime uscite" movies={recentMovies} />
      <MovieGallery
        title="Prossimamente"
        movies={upcomingMovies}
        variant="upcoming"
      />
      <MovieGallery title="Serie popolari" movies={popularSeries} />

      {/* Genre explorer */}
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
