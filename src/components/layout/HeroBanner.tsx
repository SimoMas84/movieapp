"use client";

/* ============================================================
   HERO BANNER COMPONENT
   Swiper coverflow carousel — mobile and desktop.
   Opens MovieModal on slide tap.
   ============================================================ */

import { useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules";
import HeroBannerSlide from "./HeroBannerSlide";
import MovieModal from "@/components/ui/MovieModal";
import { Movie } from "@/types/movie";

interface HeroBannerProps {
  movies: Movie[];
}

const AUTOPLAY_DELAY = 5000;

export default function HeroBanner({ movies }: HeroBannerProps) {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  /* ── Open modal immediately — extra data loads inside modal ── */
  const handleSelect = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
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
          speed={700}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 90,
            modifier: 1.8,
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
          className="w-full"
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id} className="rounded-xl overflow-hidden">
              <div className="relative aspect-video">
                <HeroBannerSlide
                  movie={movie}
                  onClick={() => handleSelect(movie)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </>
  );
}
