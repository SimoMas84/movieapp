"use client";

import { useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules";
import HeroBannerSlide from "./HeroBannerSlide";
import MovieModal from "@/components/ui/MovieModal";
import { Movie } from "@/types/movie";

/* =============================================
   PROPS INTERFACE
   ============================================= */
interface HeroBannerProps {
  movies: Movie[];
}

/* =============================================
   CONSTANTS
   ============================================= */
const AUTOPLAY_DELAY = 5000;

/* =============================================
   HERO BANNER COMPONENT
   Swiper coverflow effect — mobile & desktop
   Opens MovieModal on slide tap (not swipe)
   ============================================= */
export default function HeroBanner({ movies }: HeroBannerProps) {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  /* ── Handlers ── */
  const handleSelect = useCallback(
    async (movie: Movie) => {
      if (isDragging) return;
      try {
        const res = await fetch(
          `/api/trailer?id=${movie.id}&type=${movie.type === "serie" ? "tv" : "movie"}`,
        );
        const { trailerKey } = await res.json();
        setSelectedMovie({ ...movie, trailerKey });
      } catch {
        setSelectedMovie(movie);
      }
    },
    [isDragging],
  );

  const handleSliderMove = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setTimeout(() => setIsDragging(false), 100);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  return (
    <>
      <section className="w-full pt-24">
        <Swiper
          modules={[EffectCoverflow, Autoplay, Pagination]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={1.2}
          breakpoints={{
            768: { slidesPerView: 1.4 },
            1024: { slidesPerView: 1.6 },
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 120,
            modifier: 2.5,
            slideShadows: false,
          }}
          autoplay={{
            delay: AUTOPLAY_DELAY,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-bullet",
            bulletActiveClass: "swiper-bullet-active",
          }}
          onSliderMove={handleSliderMove}
          onTouchEnd={handleTouchEnd}
          className="w-full"
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id} className="rounded-xl overflow-hidden">
              <div className="relative aspect-video">
                <HeroBannerSlide
                  movie={movie}
                  isActive={true}
                  onClick={() => handleSelect(movie)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Movie modal */}
      <MovieModal movie={selectedMovie} onClose={handleClose} />
    </>
  );
}
