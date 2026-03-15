"use client";

/* ============================================================
   FAVORITES GRID
   Client component that manages local movie state so cards
   disappear instantly when removed from favorites.
   Receives initial data from the parent Server Component.
   MovieGallery handles modal internally.
   ============================================================ */

import { useState, useCallback } from "react";
import { Movie } from "@/types/movie";
import MovieGallery from "@/components/layout/MovieGallery";

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

  const handleFilmRemoved = useCallback((movieId: number) => {
    setFilms((prev) => prev.filter((m) => m.id !== movieId));
  }, []);

  const handleSeriesRemoved = useCallback((movieId: number) => {
    setSeries((prev) => prev.filter((m) => m.id !== movieId));
  }, []);

  if (films.length === 0 && series.length === 0) {
    return (
      <p className="text-text-secondary text-sm mt-4">
        Nessun contenuto nei preferiti.
      </p>
    );
  }

  return (
    <>
      {films.length > 0 && (
        <MovieGallery
          title="Film"
          movies={films}
          onFavoriteRemoved={handleFilmRemoved}
        />
      )}
      {series.length > 0 && (
        <MovieGallery
          title="Serie TV"
          movies={series}
          onFavoriteRemoved={handleSeriesRemoved}
        />
      )}
    </>
  );
}
