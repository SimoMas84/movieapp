"use client";

/* ============================================================
   MOVIE MODAL COMPONENT
   Opens immediately with available card data.
   Trailer and extra details load in background.
   ============================================================ */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { X, Heart, Bookmark, ChevronRight, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Movie } from "@/types/movie";
import { formatRating } from "@/lib/utils";
import { modalWrapper, modalBackdrop, modalPanel } from "@/lib/animations";
import { useMovieActions } from "@/hooks/useMovieActions";
import ShareButton from "@/components/ui/ShareButton";

/* ── Format runtime minutes → "1h 45m" ── */
function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

/* ── Inner modal content — separated so hooks are never called conditionally ── */
function ModalContent({
  movie,
  onClose,
}: {
  movie: Movie;
  onClose: () => void;
}) {
  const router = useRouter();
  const { isFavorite, isWatchlist, toggleFavorite, toggleWatchlist } =
    useMovieActions(movie);

  /* ── Extra data loaded in background after modal opens ── */
  const [trailerKey, setTrailerKey] = useState<string | null>(
    movie.trailerKey ?? null,
  );
  const [runtime, setRuntime] = useState<number | undefined>(movie.runtime);
  const [numberOfSeasons, setNumberOfSeasons] = useState<number | undefined>(
    movie.numberOfSeasons,
  );
  const [trailerLoading, setTrailerLoading] = useState(!movie.trailerKey);

  useEffect(() => {
    const type = movie.type === "serie" ? "tv" : "movie";

    const fetchExtra = async () => {
      try {
        const [trailerRes, detailRes] = await Promise.all([
          fetch(`/api/trailer?id=${movie.id}&type=${type}`),
          fetch(`/api/detail?id=${movie.id}&type=${type}`),
        ]);
        const { trailerKey: key } = await trailerRes.json();
        const { runtime: rt, numberOfSeasons: ns } = await detailRes.json();
        setTrailerKey(key ?? null);
        setRuntime(rt);
        setNumberOfSeasons(ns);
      } catch {
        /* keep whatever was already available */
      } finally {
        setTrailerLoading(false);
      }
    };

    fetchExtra();
  }, [movie.id, movie.type]);

  const handleGoToMovie = useCallback(() => {
    onClose();
    router.push(
      movie.type === "serie" ? `/serie/${movie.id}` : `/movie/${movie.id}`,
    );
  }, [movie, onClose, router]);

  return (
    <motion.div
      className="relative w-full max-w-lg bg-surface-1 rounded-xl overflow-hidden z-10"
      variants={modalPanel}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {/* ── Trailer / backdrop ── */}
      <div className="relative w-full aspect-video bg-surface-2">
        {trailerLoading ? (
          /* Shimmer while trailer loads */
          <>
            {movie.backdrop && (
              <Image
                src={`https://image.tmdb.org/t/p/w780${movie.backdrop}`}
                alt={movie.title}
                fill
                className="object-cover opacity-40"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-transparent to-transparent" />
            <div className="absolute inset-0 animate-pulse bg-surface-2/40" />
          </>
        ) : trailerKey ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0&controls=1&rel=0`}
            title={`Trailer — ${movie.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <>
            {movie.backdrop && (
              <Image
                src={`https://image.tmdb.org/t/p/w780${movie.backdrop}`}
                alt={movie.title}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-transparent to-transparent" />
          </>
        )}
      </div>

      {/* ── Close button ── */}
      <button
        onClick={onClose}
        aria-label="Chiudi"
        className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-md bg-bg-primary/70 backdrop-blur-sm text-text-secondary hover:text-text-primary transition-colors duration-300 cursor-pointer"
      >
        <X size={16} />
      </button>

      {/* ── Info ── */}
      <div className="px-5 pt-4 pb-6">
        <h2 className="text-xl font-light text-text-primary mb-1">
          {movie.title}
        </h2>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className={`text-xs font-medium ${movie.type === "serie" ? "text-blue-400" : "text-accent"}`}
          >
            {movie.type === "serie" ? "Serie" : "Film"}
          </span>

          {movie.type === "film" && runtime !== undefined && runtime > 0 && (
            <>
              <span className="text-text-muted text-xs">•</span>
              <span className="text-text-secondary text-xs">
                {formatRuntime(runtime)}
              </span>
            </>
          )}

          {movie.type === "serie" && numberOfSeasons && (
            <>
              <span className="text-text-muted text-xs">•</span>
              <span className="text-text-secondary text-xs">
                {numberOfSeasons}{" "}
                {numberOfSeasons === 1 ? "stagione" : "stagioni"}
              </span>
            </>
          )}

          <span className="text-text-muted text-xs">•</span>
          <span className="text-text-secondary text-xs">{movie.year}</span>
          <span className="text-text-muted text-xs">•</span>
          <span className="flex items-center gap-1 text-accent text-xs">
            <Star size={11} />
            {formatRating(movie.rating)}
          </span>
        </div>

        <div className="flex gap-1.5 flex-wrap mb-3">
          {movie.genre.map((g) => (
            <span
              key={g}
              className="text-xs px-2 py-1 rounded-sm border border-border-subtle text-text-secondary"
            >
              {g}
            </span>
          ))}
        </div>

        <p className="text-text-secondary text-sm line-clamp-3 mb-4">
          {movie.plot}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGoToMovie}
            className="flex-1 h-10 flex items-center justify-center rounded-xl bg-accent text-bg-primary text-xs hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            Scheda completa
            <ChevronRight size={15} />
          </button>

          <button
            onClick={toggleFavorite}
            aria-label="Aggiungi ai preferiti"
            className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-300 cursor-pointer ${
              isFavorite
                ? "border-heart text-heart"
                : "border-border-subtle text-text-secondary hover:border-heart hover:text-heart"
            }`}
          >
            <Heart size={16} className={isFavorite ? "fill-heart" : ""} />
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
            <Bookmark size={16} className={isWatchlist ? "fill-accent" : ""} />
          </button>

          <ShareButton
            title={movie.title}
            description={movie.plot ?? undefined}
            url={`https://www.movieapp.it/${movie.type === "serie" ? "serie" : "movie"}/${movie.id}`}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = movie ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [movie]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {movie && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={modalWrapper}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm"
            onClick={onClose}
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
          />
          <ModalContent movie={movie} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
