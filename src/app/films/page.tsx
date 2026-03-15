/* ============================================================
   FILMS PAGE — Server Component
   ============================================================ */

import { Film } from "lucide-react";
import { toMovie } from "@/lib/utils";
import MovieGallery from "@/components/layout/MovieGallery";
import {
  getUpcomingTheatrical,
  getUpcomingStreaming,
  getRecentReleases,
  getMovieGenres,
  getPopularMovies,
} from "@/lib/tmdb";
import GenreExplorer from "@/components/layout/GenreExplorer";

export default async function FilmPage() {
  const [theatrical, streaming, recent, genres, popular] = await Promise.all([
    getUpcomingTheatrical(),
    getUpcomingStreaming(),
    getRecentReleases(),
    getMovieGenres(),
    getPopularMovies(),
  ]);

  const theatricalMovies = theatrical.map((m) => toMovie(m, genres));
  const streamingMovies = streaming.map((m) => toMovie(m, genres));
  const recentMovies = recent.map((m) => toMovie(m, genres));
  const popularMovies = popular.map((m) => toMovie(m, genres));

  return (
    <div className="pb-16">
      {/* Header */}
      <div className="flex items-end gap-4 px-6 md:px-10 mb-12 pt-32">
        <Film size={52} className="text-accent mb-1" />
        <h1 className="text-4xl lg:text-5xl font-light text-text-primary">
          Film
        </h1>
      </div>

      <MovieGallery title="Ultime uscite" movies={recentMovies} />
      <MovieGallery
        title="Prossimamente al cinema"
        movies={theatricalMovies}
        variant="upcoming"
      />
      <MovieGallery
        title="Prossimamente in streaming"
        movies={streamingMovies}
        variant="upcoming"
      />
      <MovieGallery title="Film popolari" movies={popularMovies} />

      {/* Genre explorer */}
      <div className="px-6 md:px-10 mt-16 max-w-screen-2xl mx-auto">
        <h2 className="text-2xl font-light text-text-primary mb-2">
          Esplora per genere
        </h2>
        <p className="text-text-muted text-sm mb-8">
          Trova i tuoi film preferiti
        </p>
        <GenreExplorer genres={genres} mediaType="movie" />
      </div>
    </div>
  );
}
