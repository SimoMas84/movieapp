"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import MovieCard from "@/components/cards/MovieCard";
import MovieModal from "@/components/ui/MovieModal";
import { Movie } from "@/types/movie";
import { filterCard } from "@/lib/animations";
import { getMovieVideos, getSeriesVideos } from "@/lib/tmdb";

/* =============================================
   PROPS INTERFACE
   ============================================= */
interface GenreFilterProps {
  movies: Movie[];
}

/* =============================================
   CONSTANTS
   ============================================= */
const TYPE_FILTERS = [
  { label: "Tutti", value: "all" },
  { label: "Film", value: "film" },
  { label: "Serie", value: "serie" },
] as const;

type TypeFilter = "all" | "film" | "serie";

/* =============================================
   GENRE FILTER COMPONENT
   Dynamic genre filtering with animated grid
   ============================================= */
export default function GenreFilter({ movies }: GenreFilterProps) {
  const [activeType, setActiveType] = useState<TypeFilter>("all");
  const [activeGenres, setActiveGenres] = useState<string[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  /* ── Extract unique genres from movies ── */
  const genres = useMemo(() => {
    return movies
      .flatMap((m) => m.genre)
      .filter((g, i, arr) => arr.indexOf(g) === i)
      .sort();
  }, [movies]);

  /* ── Filter movies by type and genres ── */
  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      const matchType = activeType === "all" || m.type === activeType;
      const matchGenre =
        activeGenres.length === 0 ||
        activeGenres.some((g) => m.genre.includes(g));
      return matchType && matchGenre;
    });
  }, [movies, activeType, activeGenres]);

  /* ── Handlers ── */
  const handleTypeFilter = useCallback((type: TypeFilter) => {
    setActiveType(type);
  }, []);

  const handleGenreToggle = useCallback((genre: string) => {
    setActiveGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  }, []);

  /* ── Fetch trailer and open modal ── */
  const handleSelect = useCallback(async (movie: Movie) => {
    try {
      const res = await fetch(
        `/api/trailer?id=${movie.id}&type=${movie.type === "serie" ? "tv" : "movie"}`,
      );
      const { trailerKey } = await res.json();
      setSelectedMovie({ ...movie, trailerKey });
    } catch {
      setSelectedMovie(movie);
    }
  }, []);

  const handleClose = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  return (
    <>
      <section className="w-full py-8 px-6 md:px-10">
        {/* ── Section title ── */}
        <h2 className="text-xl md:text-2xl font-light text-text-primary mb-6">
          Esplora per genere
        </h2>

        {/* ── Type filters ── */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleTypeFilter(f.value)}
              className={`px-4 py-1.5 text-sm font-medium border border-l-2 rounded-sm transition-all duration-300 ${
                activeType === f.value
                  ? "border-border-subtle border-l-accent bg-accent/10 text-accent"
                  : "border-border-subtle border-l-border-subtle text-text-secondary hover:border-l-accent hover:text-accent"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Genre chips ── */}
        <div className="flex gap-2 flex-wrap mb-8">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreToggle(genre)}
              className={`px-3 py-1 text-xs border border-l-2 rounded-sm transition-all duration-300 cursor-pointer ${
                activeGenres.includes(genre)
                  ? "border-border-subtle border-l-accent bg-accent/10 text-accent"
                  : "border-border-subtle border-l-border-subtle text-text-secondary hover:border-l-accent hover:text-accent"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* ── Results count ── */}
        <p className="text-text-muted text-sm mb-6">
          {filteredMovies.length} risultati
        </p>

        {/* ── Animated grid ── */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredMovies.map((movie, i) => (
              <motion.div
                key={movie.id}
                layout
                variants={filterCard}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <MovieCard movie={movie} index={i} onSelect={handleSelect} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ── Movie modal ── */}
      <MovieModal movie={selectedMovie} onClose={handleClose} />
    </>
  );
}
