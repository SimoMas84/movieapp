"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeroSlide from "./HeroSlide";
import { Movie } from "@/types/movie";

/* =============================================
   PROPS INTERFACE
   ============================================= */
interface HeroProps {
  movies: Movie[];
}

/* =============================================
   CONSTANTS
   ============================================= */
const SLIDE_INTERVAL = 6000;

/* =============================================
   HERO COMPONENT
   Full screen carousel — desktop only
   Auto-rotation, arrows and dots navigation
   ============================================= */
export default function Hero({ movies }: HeroProps) {
  const [current, setCurrent] = useState<number>(0);

  /* ── Navigation ── */
  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % movies.length);
  }, [movies.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + movies.length) % movies.length);
  }, [movies.length]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  /* ── Auto-rotation ── */
  useEffect(() => {
    const timer = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-svh pt-24 overflow-hidden">
      {/* Slides */}
      {movies.map((movie, i) => (
        <HeroSlide key={movie.id} movie={movie} isActive={i === current} />
      ))}

      {/* Arrow — previous */}
      <button
        onClick={prev}
        aria-label="Film precedente"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-xl border border-border-subtle text-text-secondary hover:border-accent hover:text-accent transition-all duration-300 bg-bg-primary/40 backdrop-blur-sm"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Arrow — next */}
      <button
        onClick={next}
        aria-label="Film successivo"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-xl border border-border-subtle text-text-secondary hover:border-accent hover:text-accent transition-all duration-300 bg-bg-primary/40 backdrop-blur-sm"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Vai al film ${i + 1}`}
            className={`transition-all duration-300 rounded-sm ${
              i === current
                ? "w-6 h-2 bg-accent"
                : "w-2 h-2 bg-text-muted hover:bg-text-secondary"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
