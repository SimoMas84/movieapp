"use client";

import { Heart, Bookmark } from "lucide-react";
import { Movie } from "@/types/movie";
import { useMovieActions } from "@/hooks/useMovieActions";

/* ============================================================
   MOVIE ACTIONS
   Client component for favorite and watchlist buttons.
   Used in detail pages (Server Components) that cannot
   use hooks directly.
   ============================================================ */

interface MovieActionsProps {
  movie: Movie;
}

export default function MovieActions({ movie }: MovieActionsProps) {
  const { isFavorite, isWatchlist, toggleFavorite, toggleWatchlist } =
    useMovieActions(movie);

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleFavorite}
        aria-label="Aggiungi ai preferiti"
        className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-300 cursor-pointer ${
          isFavorite
            ? "border-heart text-heart"
            : "border-border-subtle text-text-secondary hover:border-heart hover:text-heart"
        }`}
      >
        <Heart size={18} className={isFavorite ? "fill-heart" : ""} />
      </button>
      <button
        onClick={toggleWatchlist}
        aria-label="Aggiungi alla watchlist"
        className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-300 cursor-pointer ${
          isWatchlist
            ? "border-accent text-accent"
            : "border-border-subtle text-text-secondary hover:border-accent hover:text-accent"
        }`}
      >
        <Bookmark size={18} className={isWatchlist ? "fill-accent" : ""} />
      </button>
    </div>
  );
}
