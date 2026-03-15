"use client";

/* ============================================================
   GENRE EXPLORER COMPONENT
   Allows filtering movies or series by genre with infinite
   scroll and sort options.
   ============================================================ */

import { useState, useCallback, useEffect, useRef } from "react";
import { toMovie } from "@/lib/utils";
import { TMDBMovie } from "@/lib/tmdb";
import ExploreCard from "@/components/cards/ExploreCard";
import MovieModal from "@/components/ui/MovieModal";
import { Movie } from "@/types/movie";

const SORT_OPTIONS = [
  { label: "Valutazione", value: "vote_average.desc" },
  { label: "Popolarità", value: "popularity.desc" },
  { label: "Più recenti", value: "primary_release_date.desc" },
] as const;

type SortOption = (typeof SORT_OPTIONS)[number]["value"];

interface GenreExplorerProps {
  genres: Record<number, string>;
  mediaType?: "movie" | "tv";
}

/* ── Skeleton grid shown while loading ── */
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="w-full aspect-[2/3] rounded-xl bg-surface-2 animate-pulse"
        />
      ))}
    </div>
  );
}

/* ── Paginated movie grid with infinite scroll ── */
function MovieGrid({
  genreIds,
  sortBy,
  mediaType,
  genres,
  onSelect,
}: {
  genreIds: number[];
  sortBy: SortOption;
  mediaType: "movie" | "tv";
  genres: Record<number, string>;
  onSelect: (movie: Movie) => void;
}) {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const pageRef = useRef(1);

  const fetchPage = useCallback(
    async (pageNum: number) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      try {
        const res = await fetch(
          `/api/discover?genre=${genreIds.join(",")}&page=${pageNum}&sort=${sortBy}&type=${mediaType}`,
        );
        const data = await res.json();
        setMovies((prev) =>
          pageNum === 1 ? data.results : [...prev, ...data.results],
        );
        setHasMore(pageNum < Math.min(data.total_pages, 50));
        pageRef.current = pageNum;
      } catch {
        setHasMore(false);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [genreIds, sortBy, mediaType],
  );

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  /* ── Infinite scroll ── */
  useEffect(() => {
    if (movies.length === 0) return;
    const handleScroll = () => {
      if (loadingRef.current || !hasMore) return;
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 300
      ) {
        fetchPage(pageRef.current + 1);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, fetchPage, movies.length]);

  const converted = movies.map((m) => toMovie(m, genres));

  if (!loading && movies.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-text-muted text-sm">
          Nessun risultato per i generi selezionati
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {converted.map((movie, i) => (
          <ExploreCard
            key={movie.id}
            movie={movie}
            index={i}
            onSelect={onSelect}
          />
        ))}
      </div>
      {loading && <SkeletonGrid />}
      <div className="h-10 mt-4" />
    </>
  );
}

/* ── Main component ── */
export default function GenreExplorer({
  genres,
  mediaType = "movie",
}: GenreExplorerProps) {
  const [activeGenres, setActiveGenres] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("vote_average.desc");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const genreList = Object.entries(genres)
    .map(([id, name]) => ({ id: Number(id), name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleSelect = useCallback(async (movie: Movie) => {
    const type = movie.type === "serie" ? "tv" : "movie";
    try {
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
  }, []);

  const handleGenreToggle = useCallback((genreId: number) => {
    setActiveGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId],
    );
  }, []);

  const handleReset = useCallback(() => {
    setActiveGenres([]);
    setSortBy("vote_average.desc");
  }, []);

  const hasFilters = activeGenres.length > 0;
  const gridKey = `${[...activeGenres].sort().join("-")}-${sortBy}`;

  return (
    <>
      <div>
        {/* Genre chips */}
        <div className="flex gap-2 flex-wrap mb-6">
          {genreList.map((g) => (
            <button
              key={g.id}
              onClick={() => handleGenreToggle(g.id)}
              className={`text-xs px-3 py-1.5 rounded-sm border-l-2 border transition-all duration-200 ${
                activeGenres.includes(g.id)
                  ? "border-border-subtle border-l-accent bg-accent/10 text-accent"
                  : "border-border-subtle border-l-border-subtle text-text-secondary hover:border-l-accent hover:text-accent"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Sort + reset — shown when genres are active */}
        {hasFilters && (
          <div className="flex flex-col gap-2 mb-8">
            <span className="text-text-muted text-xs">Ordina per:</span>
            <div className="flex items-center gap-2 flex-wrap">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`text-xs px-3 py-1.5 rounded-sm border-l-2 border transition-all duration-200 ${
                    sortBy === opt.value
                      ? "border-border-subtle border-l-accent bg-accent/10 text-accent"
                      : "border-border-subtle border-l-border-subtle text-text-secondary hover:border-l-accent hover:text-accent"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-sm border border-red-500/30 border-l-2 border-l-red-500 text-red-400 hover:bg-red-500/10 transition-all duration-200"
              >
                Reset filtri
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!hasFilters && (
          <div className="text-center py-16">
            <p className="text-text-muted text-sm">
              Seleziona un genere per scoprire{" "}
              {mediaType === "tv" ? "le serie" : "i film"}
            </p>
          </div>
        )}

        {/* Movie grid */}
        {hasFilters && (
          <MovieGrid
            key={gridKey}
            genreIds={activeGenres}
            sortBy={sortBy}
            mediaType={mediaType}
            genres={genres}
            onSelect={handleSelect}
          />
        )}
      </div>

      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </>
  );
}
