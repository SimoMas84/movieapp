"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { X, Heart, Bookmark, ChevronRight, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Movie } from "@/types/movie";
import { formatRating } from "@/lib/utils";
import { modalWrapper, modalBackdrop, modalPanel } from "@/lib/animations";

/* ── Format runtime minutes → "1h 45m" ── */
function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/* =============================================
   PROPS INTERFACE
   ============================================= */
interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

/* =============================================
   MOVIE MODAL COMPONENT
   Reusable modal with trailer, movie info,
   and action buttons. Used in hero banner,
   gallery cards and search results.
   ============================================= */
export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  /* ── Mount check — portal requires client ── */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── Close on Escape key ── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  /* ── Prevent body scroll when open ── */
  useEffect(() => {
    document.body.style.overflow = movie ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [movie]);

  /* ── Handlers ── */
  const handleGoToMovie = useCallback(() => {
    if (!movie) return;
    onClose();
    const path =
      movie.type === "serie" ? `/serie/${movie.id}` : `/movie/${movie.id}`;
    router.push(path);
  }, [movie, onClose, router]);

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
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm"
            onClick={onClose}
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
          />

          {/* Modal panel */}
          <motion.div
            className="relative w-full max-w-lg bg-surface-1 rounded-xl overflow-hidden z-10"
            variants={modalPanel}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* ── Trailer ── */}
            {movie.trailerKey ? (
              <div className="relative w-full aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1&mute=0&controls=1&rel=0`}
                  title={`Trailer — ${movie.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            ) : (
              /* Fallback — backdrop image if no trailer */
              <div className="relative w-full aspect-video">
                {movie.backdrop && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w780${movie.backdrop}`}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-transparent to-transparent" />
              </div>
            )}

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
              {/* Title */}
              <h2 className="text-xl font-light text-text-primary mb-1">
                {movie.title}
              </h2>

              {/* Meta — year, type, runtime/seasons, rating */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {/* Badge tipo */}
                <span
                  className={`text-xs font-medium ${movie.type === "serie" ? "text-blue-400" : "text-accent"}`}
                >
                  {movie.type === "serie" ? "Serie" : "Film"}
                </span>

                {/* Runtime */}
                {movie.type === "film" &&
                  movie.runtime !== undefined &&
                  movie.runtime > 0 && (
                    <>
                      <span className="text-text-muted text-xs">•</span>
                      <span className="text-text-secondary text-xs">
                        {formatRuntime(movie.runtime)}
                      </span>
                    </>
                  )}
                {/* {movie.type === "film" &&
                  movie.runtime &&
                  movie.runtime > 0 && (
                    <>
                      <span className="text-text-muted text-xs">•</span>
                      <span className="text-text-secondary text-xs">
                        {formatRuntime(movie.runtime)}
                      </span>
                    </>
                  )} */}

                {/* Season */}
                {movie.type === "serie" && movie.numberOfSeasons && (
                  <>
                    <span className="text-text-muted text-xs">•</span>
                    <span className="text-text-secondary text-xs">
                      {movie.numberOfSeasons}{" "}
                      {movie.numberOfSeasons === 1 ? "stagione" : "stagioni"}
                    </span>
                  </>
                )}

                {/* Year */}
                <span className="text-text-muted text-xs">•</span>
                <span className="text-text-secondary text-xs">
                  {movie.year}
                </span>

                {/* Rating */}
                <span className="text-text-muted text-xs">•</span>
                <span className="flex items-center gap-1 text-accent text-xs">
                  <Star size={11} />
                  {formatRating(movie.rating)}
                </span>
              </div>

              {/* Genre chips */}
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

              {/* Plot */}
              <p className="text-text-secondary text-sm line-clamp-3 mb-4">
                {movie.plot}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {/* Go to movie page */}
                <button
                  onClick={handleGoToMovie}
                  className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl bg-accent text-bg-primary text-sm font-medium hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  Scheda completa
                  <ChevronRight size={15} />
                </button>

                {/* Add to favorites */}
                <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-subtle text-text-secondary hover:border-heart hover:text-heart transition-all duration-300">
                  <Heart size={16} />
                </button>

                {/* Add to watchlist */}
                <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-subtle text-text-secondary hover:border-accent hover:text-accent transition-all duration-300">
                  <Bookmark size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
