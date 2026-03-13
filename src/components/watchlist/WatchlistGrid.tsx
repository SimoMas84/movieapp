"use client";

import { useState, useCallback } from "react";
import { Movie } from "@/types/movie";
import MovieGallery from "@/components/layout/MovieGallery";
import MovieModal from "@/components/ui/MovieModal";

/* ============================================================
   WATCHLIST GRID
   Client component that manages local movie state so cards
   disappear instantly when removed from watchlist.
   Receives initial data from the parent Server Component.
   ============================================================ */

interface WatchlistGridProps {
  initialFilms: Movie[];
  initialSeries: Movie[];
}

export default function WatchlistGrid({
  initialFilms,
  initialSeries,
}: WatchlistGridProps) {
  const [films, setFilms] = useState<Movie[]>(initialFilms);
  const [series, setSeries] = useState<Movie[]>(initialSeries);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  /* ── Remove a film from local state instantly ── */
  const handleFilmRemoved = useCallback((movieId: number) => {
    setFilms((prev) => prev.filter((m) => m.id !== movieId));
  }, []);

  /* ── Remove a series from local state instantly ── */
  const handleSeriesRemoved = useCallback((movieId: number) => {
    setSeries((prev) => prev.filter((m) => m.id !== movieId));
  }, []);

  const totalCount = films.length + series.length;

  if (totalCount === 0) {
    return (
      <p className="text-text-secondary text-sm mt-4">
        Nessun contenuto nella watchlist.
      </p>
    );
  }

  return (
    <>
      {films.length > 0 && (
        <div className="mb-10">
          <MovieGallery
            title="Film"
            movies={films}
            onSelect={setSelectedMovie}
            onWatchlistRemoved={handleFilmRemoved}
          />
        </div>
      )}

      {series.length > 0 && (
        <div className="mb-10">
          <MovieGallery
            title="Serie TV"
            movies={series}
            onSelect={setSelectedMovie}
            onWatchlistRemoved={handleSeriesRemoved}
          />
        </div>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}
