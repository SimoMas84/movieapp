"use client";

/* ============================================================
   useMovieActions HOOK
   Thin wrapper around UserListsContext for a single movie.
   No Supabase queries here — state comes from the global
   context which loads once on login.
   ============================================================ */

import { useCallback } from "react";
import { Movie } from "@/types/movie";
import { useUserLists } from "@/context/UserListsContext";

interface UseMovieActionsOptions {
  /** Called after the item is successfully removed from favorites */
  onFavoriteRemoved?: () => void;
  /** Called after the item is successfully removed from watchlist */
  onWatchlistRemoved?: () => void;
}

interface UseMovieActionsReturn {
  isFavorite: boolean;
  isWatchlist: boolean;
  toggleFavorite: (e: React.MouseEvent) => Promise<void>;
  toggleWatchlist: (e: React.MouseEvent) => Promise<void>;
}

export function useMovieActions(
  movie: Movie,
  options: UseMovieActionsOptions = {},
): UseMovieActionsReturn {
  const { onFavoriteRemoved, onWatchlistRemoved } = options;
  const { isFavorite, isWatchlist, toggleFavorite, toggleWatchlist } = useUserLists();

  const mediaType = movie.type === "film" ? "movie" : "tv";

  const handleToggleFavorite = useCallback(
    (e: React.MouseEvent) => toggleFavorite(e, movie.id, mediaType, onFavoriteRemoved),
    [toggleFavorite, movie.id, mediaType, onFavoriteRemoved],
  );

  const handleToggleWatchlist = useCallback(
    (e: React.MouseEvent) => toggleWatchlist(e, movie.id, mediaType, onWatchlistRemoved),
    [toggleWatchlist, movie.id, mediaType, onWatchlistRemoved],
  );

  return {
    isFavorite:      isFavorite(movie.id, mediaType),
    isWatchlist:     isWatchlist(movie.id, mediaType),
    toggleFavorite:  handleToggleFavorite,
    toggleWatchlist: handleToggleWatchlist,
  };
}