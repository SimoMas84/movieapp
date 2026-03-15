"use client";

/* ============================================================
   UPCOMING CARD COMPONENT
   Vertical poster card for unreleased movies.
   Shows release date instead of rating.
   Favorites and watchlist synced via UserListsContext.
   ============================================================ */

import { useCallback } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { Calendar, Heart, Bookmark } from "lucide-react";
import { Movie } from "@/types/movie";
import { cardEntry } from "@/lib/animations";
import { useMovieActions } from "@/hooks/useMovieActions";

interface UpcomingCardProps {
  movie: Movie;
  index: number;
  onSelect: (movie: Movie) => void;
}

function formatDateIT(dateStr: string): string {
  if (!dateStr) return "Data da definire";
  return new Date(dateStr).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const TYPE_STYLES = { film: "text-accent", serie: "text-blue-400" } as const;
const TYPE_LABELS = { film: "Film", serie: "Serie" } as const;

export default function UpcomingCard({
  movie,
  index,
  onSelect,
}: UpcomingCardProps) {
  const { isFavorite, isWatchlist, toggleFavorite, toggleWatchlist } =
    useMovieActions(movie);

  const posterUrl = movie.poster
    ? `https://image.tmdb.org/t/p/w500${movie.poster}`
    : null;

  const handleSelect = useCallback(() => onSelect(movie), [movie, onSelect]);

  return (
    <motion.div
      className="relative flex-shrink-0 w-46 md:w-54 cursor-pointer"
      variants={cardEntry}
      initial="hidden"
      animate="visible"
      custom={index}
      onClick={handleSelect}
    >
      <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-surface-2 border border-transparent hover:border-accent hover:brightness-110 transition-all duration-300">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 144px, 176px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-2">
            <span className="text-text-muted text-xs text-center px-2">
              {movie.title}
            </span>
          </div>
        )}

        {/* Top bar — actions only */}
        <div className="absolute top-0 right-0 p-2">
          <div className="flex flex-col gap-1.5">
            <button
              onClick={toggleFavorite}
              aria-label="Aggiungi ai preferiti"
              className="w-7 h-7 flex items-center justify-center rounded-md bg-bg-primary/70 backdrop-blur-sm transition-colors duration-300 cursor-pointer"
            >
              <Heart
                size={13}
                className={
                  isFavorite ? "text-heart fill-heart" : "text-text-secondary"
                }
              />
            </button>
            <button
              onClick={toggleWatchlist}
              aria-label="Aggiungi alla watchlist"
              className="w-7 h-7 flex items-center justify-center rounded-md bg-bg-primary/70 backdrop-blur-sm transition-colors duration-300 cursor-pointer"
            >
              <Bookmark
                size={13}
                className={
                  isWatchlist
                    ? "text-accent fill-accent"
                    : "text-text-secondary"
                }
              />
            </button>
          </div>
        </div>

        {/* Bottom overlay — type · genre + date */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bg-primary to-transparent p-2 pt-6">
          <p className="text-xs truncate mb-1.5">
            <span className={TYPE_STYLES[movie.type]}>
              {TYPE_LABELS[movie.type]}
            </span>
            <span className="text-text-primary"> · {movie.genre[0]}</span>
          </p>
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-accent shrink-0" />
            <span className="text-accent text-sm font-medium">
              {formatDateIT(movie.releaseDate ?? "")}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
