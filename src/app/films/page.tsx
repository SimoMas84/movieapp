import { toMovie } from "@/lib/utils";
import MovieGallery from "@/components/layout/MovieGallery";
import {
  getUpcomingTheatrical,
  getUpcomingStreaming,
  getRecentReleases,
  getMovieGenres,
  getPopularMovies, // ← aggiunto
} from "@/lib/tmdb";
import GenreExplorer from "@/components/layout/GenreExplorer";

/* =============================================
   FILM PAGE — SERVER COMPONENT
   ============================================= */
export default async function FilmPage() {
  const [theatrical, streaming, recent, genres, popular] = await Promise.all([
    getUpcomingTheatrical(),
    getUpcomingStreaming(),
    getRecentReleases(),
    getMovieGenres(),
    getPopularMovies(), // ← aggiunto
  ]);

  /* ── Convert to Movie type ── */
  const theatricalMovies = theatrical.map((m) => toMovie(m, genres));
  const streamingMovies = streaming.map((m) => toMovie(m, genres));
  const recentMovies = recent.map((m) => toMovie(m, genres));
  const popularMovies = popular.map((m) => toMovie(m, genres)); // ← aggiunto

  return (
    <div className="pt-24 pb-16">
      {/* ── Page title ── */}
      <div className="px-6 md:px-10 mb-12">
        <h1 className="text-4xl md:text-5xl font-light text-text-primary mb-2">
          Film
        </h1>
        <p className="text-text-secondary">Ultime uscite e prossimi arrivi</p>
      </div>

      {/* ── Recent releases gallery ── */}
      <MovieGallery title="Ultime uscite" movies={recentMovies} />

      {/* ── Upcoming theatrical gallery ── */}
      <MovieGallery
        title="Prossimamente al cinema"
        movies={theatricalMovies}
        variant="upcoming"
      />

      {/* ── Upcoming streaming gallery ── */}
      <MovieGallery
        title="Prossimamente in streaming"
        movies={streamingMovies}
        variant="upcoming"
      />

      {/* ── Popular movies gallery ── */}
      <MovieGallery title="Film popolari" movies={popularMovies} />

      {/* ── Genre explorer ── */}
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
