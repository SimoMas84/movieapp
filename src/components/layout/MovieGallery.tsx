"use client";

import { useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import MovieCard from "@/components/cards/MovieCard";
import MovieModal from "@/components/ui/MovieModal";
import { Movie } from "@/types/movie";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMovieVideos, getSeriesVideos } from "@/lib/tmdb";

/* =============================================
   PROPS INTERFACE
   ============================================= */
interface MovieGalleryProps {
  title: string;
  movies: Movie[];
}

/* =============================================
   MOVIE GALLERY COMPONENT
   Horizontal scrolling gallery with free mode,
   desktop navigation arrows and MovieModal
   ============================================= */
export default function MovieGallery({ title, movies }: MovieGalleryProps) {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  /* ── Handlers ── */
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
      <section className="w-full py-8">
        {/* ── Section title ── */}
        <h2 className="text-xl md:text-2xl font-light text-text-primary px-6 md:px-10 mb-4">
          {title}
        </h2>

        {/* ── Gallery ── */}
        <div className="relative">
          {/* Swiper */}
          <Swiper
            modules={[Navigation, FreeMode]}
            freeMode={true}
            navigation={{
              nextEl: `.next-${title.replace(/\s/g, "")}`,
              prevEl: `.prev-${title.replace(/\s/g, "")}`,
            }}
            slidesPerView="auto"
            spaceBetween={12}
            slidesOffsetBefore={24}
            slidesOffsetAfter={24}
            className="w-full"
          >
            {movies.map((movie, i) => (
              <SwiperSlide key={movie.id} className="!w-auto">
                <MovieCard movie={movie} index={i} onSelect={handleSelect} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ── Desktop arrows ── */}
          <button
            aria-label="Scorri a sinistra"
            className={`prev-${title.replace(/\s/g, "")} hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-md bg-bg-primary/80 backdrop-blur-sm border border-border-subtle text-text-secondary hover:border-accent hover:text-accent transition-all duration-300`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label="Scorri a destra"
            className={`next-${title.replace(/\s/g, "")} hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-md bg-bg-primary/80 backdrop-blur-sm border border-border-subtle text-text-secondary hover:border-accent hover:text-accent transition-all duration-300`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* ── Movie modal ── */}
      <MovieModal movie={selectedMovie} onClose={handleClose} />
    </>
  );
}
