"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Search, X, Star } from "lucide-react";
import { Movie } from "@/types/movie";
import { formatRating } from "@/lib/utils";
import { searchDropdown, searchPanel } from "@/lib/animations";
import MovieModal from "@/components/ui/MovieModal";

/* =============================================
   CONSTANTS
   ============================================= */
const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 6;

/* =============================================
   SEARCH BAR COMPONENT
   Expanding search input in navbar with
   live search on TMDB full database
   and MovieModal on result click
   ============================================= */
export default function SearchBar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Search logic — calls TMDB via API route ── */
  const handleSearch = useCallback(async (value: string) => {
    setQuery(value);
    if (value.length < MIN_QUERY_LENGTH) {
      setResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      const { results } = await res.json();
      setResults(results.slice(0, MAX_RESULTS));
    } catch {
      setResults([]);
    }
  }, []);

  /* ── Open search and focus input ── */
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  /* ── Close and reset ── */
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  }, []);

  /* ── Select movie — fetch trailer and open modal ── */
  const handleSelect = useCallback(
    async (movie: Movie) => {
      try {
        const res = await fetch(
          `/api/trailer?id=${movie.id}&type=${movie.type === "serie" ? "tv" : "movie"}`,
        );
        const { trailerKey } = await res.json();
        setSelectedMovie({ ...movie, trailerKey });
      } catch {
        setSelectedMovie(movie);
      }
      handleClose();
    },
    [handleClose],
  );

  /* ── Close modal ── */
  const handleModalClose = useCallback(() => {
    setSelectedMovie(null);
  }, []);

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

  return (
    <div ref={containerRef} className="relative">
      {/* ── Search icon button ── */}
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

      {/* ── Search panel — drops below navbar ── */}
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
                placeholder="Cerca film, serie, registi..."
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

            {/* ── Dropdown results ── */}
            <AnimatePresence>
              {results.length > 0 && (
                <motion.div
                  className="mt-2 bg-surface-1 border border-border-subtle rounded-xl overflow-hidden max-w-2xl mx-auto"
                  variants={searchDropdown}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {results.map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => handleSelect(movie)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2 cursor-pointer transition-colors duration-200 border-b border-border-subtle last:border-none"
                    >
                      {/* Poster */}
                      <div className="relative w-10 h-14 rounded-md overflow-hidden shrink-0 bg-surface-2">
                        {movie.poster && (
                          <Image
                            src={`https://image.tmdb.org/t/p/w92${movie.poster}`}
                            alt={movie.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-text-primary text-sm font-medium truncate">
                          {movie.title}
                        </h4>
                        <p className="text-text-muted text-xs mt-0.5">
                          {movie.year} · {movie.director}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={10} className="text-accent" />
                          <span className="text-accent text-xs">
                            {formatRating(movie.rating)}
                          </span>
                          <span className="text-text-muted text-xs ml-2">
                            {movie.type === "serie" ? "Serie" : "Film"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── No results ── */}
            {query.length >= MIN_QUERY_LENGTH && results.length === 0 && (
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

      {/* Movie modal */}
      <MovieModal movie={selectedMovie} onClose={handleModalClose} />
    </div>
  );
}

// "use client";

// import { useState, useCallback, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import Image from "next/image";
// import { Search, X, Star } from "lucide-react";
// import { Movie } from "@/types/movie";
// import { formatRating } from "@/lib/utils";
// import { searchDropdown, searchPanel } from "@/lib/animations";
// import MovieModal from "@/components/ui/MovieModal";

// /* =============================================
//    PROPS INTERFACE
//    ============================================= */
// interface SearchBarProps {
//   movies: Movie[];
// }

// /* =============================================
//    CONSTANTS
//    ============================================= */
// const MIN_QUERY_LENGTH = 2;
// const MAX_RESULTS = 6;

// /* =============================================
//    SEARCH BAR COMPONENT
//    Expanding search input in navbar with
//    live dropdown results and MovieModal
//    ============================================= */
// export default function SearchBar({ movies }: SearchBarProps) {
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [query, setQuery] = useState<string>("");
//   const [results, setResults] = useState<Movie[]>([]);
//   const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   /* ── Search logic ── */
//   const handleSearch = useCallback(
//     (value: string) => {
//       setQuery(value);
//       if (value.length < MIN_QUERY_LENGTH) {
//         setResults([]);
//         return;
//       }
//       const filtered = movies.filter(
//         (m) =>
//           m.title.toLowerCase().includes(value.toLowerCase()) ||
//           m.director.toLowerCase().includes(value.toLowerCase()) ||
//           m.genre.some((g) => g.toLowerCase().includes(value.toLowerCase())),
//       );
//       setResults(filtered.slice(0, MAX_RESULTS));
//     },
//     [movies],
//   );

//   /* ── Open search and focus input ── */
//   const handleOpen = useCallback(() => {
//     setIsOpen(true);
//     setTimeout(() => inputRef.current?.focus(), 100);
//   }, []);

//   /* ── Close and reset ── */
//   const handleClose = useCallback(() => {
//     setIsOpen(false);
//     setQuery("");
//     setResults([]);
//   }, []);

//   /* ── Select movie from results ── */
//   const handleSelect = useCallback(
//     (movie: Movie) => {
//       setSelectedMovie(movie);
//       handleClose();
//     },
//     [handleClose],
//   );

//   /* ── Close modal ── */
//   const handleModalClose = useCallback(() => {
//     setSelectedMovie(null);
//   }, []);

//   /* ── Close on click outside ── */
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(e.target as Node)
//       ) {
//         handleClose();
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [handleClose]);

//   return (
//     <div ref={containerRef} className="relative">
//       {/* ── Search icon button ── */}
//       <motion.button
//         onClick={isOpen ? handleClose : handleOpen}
//         aria-label="Apri ricerca"
//         className="w-10 h-10 flex items-center justify-center cursor-pointer rounded-xl border border-border-subtle text-text-secondary hover:border-accent hover:text-accent transition-all duration-300"
//       >
//         <AnimatePresence mode="wait">
//           {isOpen ? (
//             <motion.span
//               key="close"
//               initial={{ opacity: 0, rotate: -90 }}
//               animate={{ opacity: 1, rotate: 0 }}
//               exit={{ opacity: 0, rotate: 90 }}
//               transition={{ duration: 0.2 }}
//             >
//               <X size={17} />
//             </motion.span>
//           ) : (
//             <motion.span
//               key="search"
//               initial={{ opacity: 0, rotate: 90 }}
//               animate={{ opacity: 1, rotate: 0 }}
//               exit={{ opacity: 0, rotate: -90 }}
//               transition={{ duration: 0.2 }}
//             >
//               <Search size={17} />
//             </motion.span>
//           )}
//         </AnimatePresence>
//       </motion.button>

//       {/* ── Search panel — drops below navbar ── */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             className="fixed left-0 right-0 top-20 z-50 px-4 md:px-10 py-4 bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle"
//             variants={searchPanel}
//             initial="hidden"
//             animate="visible"
//             exit="hidden"
//           >
//             {/* Input */}
//             <div className="flex items-center gap-3 bg-surface-1 border border-border-subtle rounded-xl px-4 h-12 max-w-2xl mx-auto">
//               <Search size={16} className="text-text-muted shrink-0" />
//               <input
//                 ref={inputRef}
//                 type="text"
//                 value={query}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 placeholder="Cerca film, serie, registi..."
//                 className="bg-transparent text-text-primary text-base md:text-sm placeholder:text-text-muted outline-none w-full"
//               />
//               {query && (
//                 <button onClick={() => handleSearch("")}>
//                   <X
//                     size={13}
//                     className="text-text-muted hover:text-text-primary transition-colors"
//                   />
//                 </button>
//               )}
//             </div>

//             {/* ── Dropdown results ── */}
//             <AnimatePresence>
//               {results.length > 0 && (
//                 <motion.div
//                   className="mt-2 bg-surface-1 border border-border-subtle rounded-xl overflow-hidden max-w-2xl mx-auto"
//                   variants={searchDropdown}
//                   initial="hidden"
//                   animate="visible"
//                   exit="hidden"
//                 >
//                   {results.map((movie) => (
//                     <div
//                       key={movie.id}
//                       onClick={() => handleSelect(movie)}
//                       className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2 cursor-pointer transition-colors duration-200 border-b border-border-subtle last:border-none"
//                     >
//                       {/* Poster */}
//                       <div className="relative w-10 h-14 rounded-md overflow-hidden shrink-0 bg-surface-2">
//                         {movie.poster && (
//                           <Image
//                             src={`https://image.tmdb.org/t/p/w92${movie.poster}`}
//                             alt={movie.title}
//                             fill
//                             className="object-cover"
//                           />
//                         )}
//                       </div>

//                       {/* Info */}
//                       <div className="flex-1 min-w-0">
//                         <h4 className="text-text-primary text-sm font-medium truncate">
//                           {movie.title}
//                         </h4>
//                         <p className="text-text-muted text-xs mt-0.5">
//                           {movie.year} · {movie.director}
//                         </p>
//                         <div className="flex items-center gap-1 mt-1">
//                           <Star size={10} className="text-accent" />
//                           <span className="text-accent text-xs">
//                             {formatRating(movie.rating)}
//                           </span>
//                           <span className="text-text-muted text-xs ml-2">
//                             {movie.type === "serie" ? "Serie" : "Film"}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* ── No results ── */}
//             {query.length >= MIN_QUERY_LENGTH && results.length === 0 && (
//               <div className="mt-2 bg-surface-1 border border-border-subtle rounded-xl px-4 py-6 max-w-2xl mx-auto text-center">
//                 <p className="text-text-muted text-sm">
//                   Nessun risultato per{" "}
//                   <span className="text-text-primary">"{query}"</span>
//                 </p>
//               </div>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Movie modal */}
//       <MovieModal movie={selectedMovie} onClose={handleModalClose} />
//     </div>
//   );
// }
