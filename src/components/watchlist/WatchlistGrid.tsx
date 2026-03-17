"use client";

/* ============================================================
   WATCHLIST GRID
   Syncs with UserListsContext for realtime updates.
   Cards appear/disappear instantly on all devices.
   ============================================================ */

import { useState, useCallback, useEffect } from "react";
import { Movie } from "@/types/movie";
import MovieGallery from "@/components/layout/MovieGallery";
import { useUserLists } from "@/context/UserListsContext";

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
  const { isWatchlist, isLoading, setOnWatchlistInsert } = useUserLists();

  /* ── Remove cards no longer in watchlist (realtime DELETE) ── */
  useEffect(() => {
    if (isLoading) return;
    setFilms((prev) => prev.filter((m) => isWatchlist(m.id, "movie")));
    setSeries((prev) => prev.filter((m) => isWatchlist(m.id, "tv")));
  }, [isWatchlist, isLoading]);

  /* ── Add card when watchlist item is added on another device (realtime INSERT) ── */
  useEffect(() => {
    setOnWatchlistInsert((movie: Movie) => {
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
    return () => setOnWatchlistInsert(null);
  }, [setOnWatchlistInsert]);

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
            onWatchlistRemoved={handleFilmRemoved}
          />
        </div>
      )}
      {series.length > 0 && (
        <div className="mb-10">
          <MovieGallery
            title="Serie TV"
            movies={series}
            onWatchlistRemoved={handleSeriesRemoved}
          />
        </div>
      )}
    </>
  );
}
