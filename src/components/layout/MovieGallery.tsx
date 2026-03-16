"use client";

/* ============================================================
   MOVIE GALLERY COMPONENT
   Horizontal scrolling gallery with free mode,
   desktop navigation arrows and MovieModal.
   Supports "upcoming" variant for unreleased movies.
   Supports onFavoriteRemoved / onWatchlistRemoved
   callbacks for Favorites and Watchlist pages.
   ============================================================ */

import { useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import MovieCard from "@/components/cards/MovieCard";
import UpcomingCard from "@/components/cards/UpcomingCard";
import MovieModal from "@/components/ui/MovieModal";
import { Movie } from "@/types/movie";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MovieGalleryProps {
  title?: string;
  movies: Movie[];
  variant?: "default" | "upcoming";
  onFavoriteRemoved?: (movieId: number) => void;
  onWatchlistRemoved?: (movieId: number) => void;
}

export default function MovieGallery({
  title,
  movies,
  variant = "default",
  onFavoriteRemoved,
  onWatchlistRemoved,
}: MovieGalleryProps) {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const galleryId = (title ?? "gallery").replace(/\s/g, "");

  /* ── Open modal immediately — extra data loads inside modal ── */
  const handleSelect = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  return (
    <>
      <section className="w-full py-8">
        {title && (
          <h2 className="text-xl md:text-2xl font-light text-text-primary px-6 md:px-10 mb-4">
            {title}
          </h2>
        )}

        <div className="relative">
          <Swiper
            modules={[Navigation, FreeMode]}
            cssMode={true}
            freeMode={{
              enabled: true,
              momentum: true,
              momentumRatio: 1,
              momentumVelocityRatio: 1,
              momentumBounce: false,
            }}
            navigation={{
              nextEl: `.next-${galleryId}`,
              prevEl: `.prev-${galleryId}`,
            }}
            slidesPerView="auto"
            spaceBetween={12}
            slidesOffsetBefore={24}
            slidesOffsetAfter={24}
            className="w-full"
          >
            {movies.map((movie, i) => (
              <SwiperSlide key={movie.id} className="!w-auto">
                {variant === "upcoming" ? (
                  <UpcomingCard
                    movie={movie}
                    index={i}
                    onSelect={handleSelect}
                  />
                ) : (
                  <MovieCard
                    movie={movie}
                    index={i}
                    onSelect={handleSelect}
                    onFavoriteRemoved={
                      onFavoriteRemoved
                        ? () => onFavoriteRemoved(movie.id)
                        : undefined
                    }
                    onWatchlistRemoved={
                      onWatchlistRemoved
                        ? () => onWatchlistRemoved(movie.id)
                        : undefined
                    }
                  />
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            aria-label="Scorri a sinistra"
            className={`prev-${galleryId} hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-md bg-bg-primary/80 backdrop-blur-sm border border-border-subtle text-text-secondary hover:border-accent hover:text-accent transition-all duration-300`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label="Scorri a destra"
            className={`next-${galleryId} hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-md bg-bg-primary/80 backdrop-blur-sm border border-border-subtle text-text-secondary hover:border-accent hover:text-accent transition-all duration-300`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </>
  );
}
