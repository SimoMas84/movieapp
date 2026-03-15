"use client";

/* ============================================================
   SEARCH BAR COMPONENT
   Full-screen search panel with movie, series and people
   results. Opens modal on movie/series click.
   ============================================================ */

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Search, X, Star, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Movie } from "@/types/movie";
import { TMDBPerson } from "@/lib/tmdb";
import { formatRating } from "@/lib/utils";
import { searchDropdown, searchPanel } from "@/lib/animations";
import MovieModal from "@/components/ui/MovieModal";

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 5;
const MAX_PEOPLE = 3;

export default function SearchBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [people, setPeople] = useState<TMDBPerson[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async (value: string) => {
    setQuery(value);
    if (value.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setPeople([]);
      return;
    }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setResults(data.results.slice(0, MAX_RESULTS));
      setPeople((data.people ?? []).slice(0, MAX_PEOPLE));
    } catch {
      setResults([]);
      setPeople([]);
    }
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setPeople([]);
  }, []);

  const handlePersonSelect = useCallback(
    (person: TMDBPerson) => {
      handleClose();
      router.push(`/person/${person.id}`);
    },
    [handleClose, router],
  );

  const handleSelect = useCallback(
    async (movie: Movie) => {
      try {
        const type = movie.type === "serie" ? "tv" : "movie";
        const [trailerRes, detailRes] = await Promise.all([
          fetch(`/api/trailer?id=${movie.id}&type=${type}`),
          fetch(`/api/detail?id=${movie.id}&type=${type}`),
        ]);
        const { trailerKey } = await trailerRes.json();
        const { runtime, numberOfSeasons, numberOfEpisodes } =
          await detailRes.json();
        setSelectedMovie({
          ...movie,
          trailerKey,
          runtime,
          numberOfSeasons,
          numberOfEpisodes,
        });
      } catch {
        setSelectedMovie(movie);
      }
      handleClose();
    },
    [handleClose],
  );

  /* ── Close on click outside ── */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClose]);

  const hasResults = results.length > 0 || people.length > 0;

  return (
    <div ref={containerRef} className="relative">
      {/* Search icon button */}
      <motion.button
        onClick={isOpen ? handleClose : handleOpen}
        aria-label="Apri ricerca"
        className="w-10 h-10 flex items-center justify-center cursor-pointer rounded-xl border border-border-subtle text-text-secondary hover:border-accent hover:text-accent transition-all duration-300"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X size={17} />
            </motion.span>
          ) : (
            <motion.span
              key="search"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <Search size={17} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Search panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed left-0 right-0 top-20 z-50 px-4 md:px-10 py-4 bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle"
            variants={searchPanel}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Input */}
            <div className="flex items-center gap-3 bg-surface-1 border border-border-subtle rounded-xl px-4 h-12 max-w-2xl mx-auto">
              <Search size={16} className="text-text-muted shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Cerca film, serie, registi, attori..."
                className="bg-transparent text-text-primary text-base md:text-sm placeholder:text-text-muted outline-none w-full"
              />
              {query && (
                <button onClick={() => handleSearch("")}>
                  <X
                    size={13}
                    className="text-text-muted hover:text-text-primary transition-colors"
                  />
                </button>
              )}
            </div>

            {/* Dropdown results */}
            <AnimatePresence>
              {hasResults && (
                <motion.div
                  className="mt-2 bg-surface-1 border border-border-subtle rounded-xl overflow-hidden max-w-2xl mx-auto"
                  variants={searchDropdown}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {/* People */}
                  {people.length > 0 && (
                    <>
                      <div className="px-4 py-2 border-b border-border-subtle">
                        <span className="text-text-muted text-xs uppercase tracking-wider">
                          Persone
                        </span>
                      </div>
                      {people.map((person) => (
                        <div
                          key={person.id}
                          onClick={() => handlePersonSelect(person)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2 cursor-pointer transition-colors duration-200 border-b border-border-subtle last:border-none"
                        >
                          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-surface-2 border border-border-subtle">
                            {person.profile_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w92${person.profile_path}`}
                                alt={person.name}
                                fill
                                className="object-cover object-top"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <User size={16} className="text-text-muted" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-text-primary text-sm font-medium truncate">
                              {person.name}
                            </h4>
                            <p className="text-text-muted text-xs mt-0.5">
                              {person.known_for_department === "Acting"
                                ? "Attore"
                                : "Regista"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Movies and series */}
                  {results.length > 0 && (
                    <>
                      {people.length > 0 && (
                        <div className="px-4 py-2 border-b border-border-subtle">
                          <span className="text-text-muted text-xs uppercase tracking-wider">
                            Film e Serie
                          </span>
                        </div>
                      )}
                      {results.map((movie) => (
                        <div
                          key={movie.id}
                          onClick={() => handleSelect(movie)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2 cursor-pointer transition-colors duration-200 border-b border-border-subtle last:border-none"
                        >
                          {/* Poster */}
                          <div className="relative w-10 h-14 rounded-sm overflow-hidden shrink-0 bg-surface-2">
                            {movie.poster && (
                              <Image
                                src={`https://image.tmdb.org/t/p/w92${movie.poster}`}
                                alt={movie.title}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>

                          {/* Info — title / type · year / rating */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-text-primary text-md truncate mb-0.5">
                              {movie.title}
                            </h4>
                            <p className="text-text-muted text-xs mb-0.5">
                              {movie.type === "serie" ? "Serie" : "Film"}
                              {movie.year ? ` · ${movie.year}` : ""}
                            </p>
                            <div className="flex items-center gap-1">
                              <Star size={10} className="text-accent" />
                              <span className="text-accent text-xs">
                                {formatRating(movie.rating)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* No results */}
            {query.length >= MIN_QUERY_LENGTH && !hasResults && (
              <div className="mt-2 bg-surface-1 border border-border-subtle rounded-xl px-4 py-6 max-w-2xl mx-auto text-center">
                <p className="text-text-muted text-sm">
                  Nessun risultato per{" "}
                  <span className="text-text-primary">"{query}"</span>
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}
