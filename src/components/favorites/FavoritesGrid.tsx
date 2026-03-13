"use client";

import { useState, useCallback } from "react";
import { Movie } from "@/types/movie";
import MovieGallery from "@/components/layout/MovieGallery";
import MovieModal from "@/components/ui/MovieModal";

/* ============================================================
   FAVORITES GRID
   Client component that manages local movie state so cards
   disappear instantly when removed from favorites.
   Receives initial data from the parent Server Component.
   ============================================================ */

interface FavoritesGridProps {
  initialFilms: Movie[];
  initialSeries: Movie[];
}

export default function FavoritesGrid({
  initialFilms,
  initialSeries,
}: FavoritesGridProps) {
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
        Nessun contenuto nei preferiti.
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
            onFavoriteRemoved={handleFilmRemoved}
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
