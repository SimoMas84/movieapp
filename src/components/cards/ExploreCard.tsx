"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { Star, Heart, Bookmark } from "lucide-react";
import { Movie } from "@/types/movie";
import { formatRating } from "@/lib/utils";
import { cardEntry } from "@/lib/animations";

/* =============================================
   PROPS INTERFACE
   ============================================= */
interface ExploreCardProps {
  movie: Movie;
  index: number;
  onSelect: (movie: Movie) => void;
}

/* =============================================
   CONSTANTS
   ============================================= */
const TYPE_STYLES = {
  film: "text-accent",
  serie: "text-blue-400",
} as const;

const TYPE_LABELS = {
  film: "Film",
  serie: "Serie",
} as const;

/* =============================================
   EXPLORE CARD COMPONENT
   Same style as MovieCard but w-full
   to adapt to GenreExplorer grid layout.
   ============================================= */
export default function ExploreCard({
  movie,
  index,
  onSelect,
}: ExploreCardProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isWatchlist, setIsWatchlist] = useState<boolean>(false);

  const posterUrl = movie.poster
    ? `https://image.tmdb.org/t/p/w500${movie.poster}`
    : null;

  const handleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  }, []);

  const handleWatchlist = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWatchlist((prev) => !prev);
  }, []);

  const handleSelect = useCallback(() => {
    onSelect(movie);
  }, [movie, onSelect]);

  return (
    <motion.div
      className="w-full cursor-pointer"
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
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-2">
            <span className="text-text-muted text-xs text-center px-2">
              {movie.title}
            </span>
          </div>
        )}

        {/* ── Top bar — rating + actions ── */}
        <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-2">
          <div className="flex items-center gap-1 bg-bg-primary/70 backdrop-blur-sm rounded-md px-1.5 py-1">
            <Star size={10} className="text-accent" />
            <span className="text-accent text-xs font-medium">
              {formatRating(movie.rating)}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <button
              onClick={handleFavorite}
              aria-label="Aggiungi ai preferiti"
              className="w-7 h-7 flex items-center justify-center rounded-md bg-bg-primary/70 backdrop-blur-sm transition-colors duration-300"
            >
              <Heart
                size={13}
                className={
                  isFavorite ? "text-heart fill-heart" : "text-text-secondary"
                }
              />
            </button>
            <button
              onClick={handleWatchlist}
              aria-label="Aggiungi alla watchlist"
              className="w-7 h-7 flex items-center justify-center rounded-md bg-bg-primary/70 backdrop-blur-sm transition-colors duration-300"
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

        {/* ── Bottom overlay ── */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bg-primary to-transparent p-2 pt-8">
          <p className="text-xs truncate">
            <span className={TYPE_STYLES[movie.type]}>
              {TYPE_LABELS[movie.type]}
            </span>
            <span className="text-text-primary">
              {" "}
              · {movie.genre[0]} · {movie.year}
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
