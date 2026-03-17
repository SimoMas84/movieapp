"use client";

/* ============================================================
   FAVORITES GRID
   Syncs with UserListsContext for realtime updates.
   Cards appear/disappear instantly on all devices.
   ============================================================ */

import { useState, useCallback, useEffect } from "react";
import { Movie } from "@/types/movie";
import MovieGallery from "@/components/layout/MovieGallery";
import { useUserLists } from "@/context/UserListsContext";

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
  const { isFavorite, isLoading, setOnFavoriteInsert } = useUserLists();

  /* ── Remove cards no longer in favorites (realtime DELETE) ── */
  useEffect(() => {
    if (isLoading) return;
    setFilms((prev) => prev.filter((m) => isFavorite(m.id, "movie")));
    setSeries((prev) => prev.filter((m) => isFavorite(m.id, "tv")));
  }, [isFavorite, isLoading]);

  /* ── Add card when favorite is added on another device (realtime INSERT) ── */
  useEffect(() => {
    setOnFavoriteInsert((movie: Movie) => {
      if (movie.type === "film") {
        setFilms((prev) =>
          prev.some((m) => m.id === movie.id) ? prev : [movie, ...prev],
        );
      } else {
        setSeries((prev) =>
          prev.some((m) => m.id === movie.id) ? prev : [movie, ...prev],
        );
      }
    });
    return () => setOnFavoriteInsert(null);
  }, [setOnFavoriteInsert]);

  const handleFilmRemoved = useCallback(
    (movieId: number) =>
      setFilms((prev) => prev.filter((m) => m.id !== movieId)),
    [],
  );
  const handleSeriesRemoved = useCallback(
    (movieId: number) =>
      setSeries((prev) => prev.filter((m) => m.id !== movieId)),
    [],
  );

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
