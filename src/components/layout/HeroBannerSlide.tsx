/* ============================================================
   HERO BANNER SLIDE COMPONENT
   Single slide with backdrop, title, type, year,
   rating and genre badges. Visibility managed by Swiper.
   ============================================================ */

import Image from "next/image";
import { Star } from "lucide-react";
import { Movie } from "@/types/movie";
import { formatRating } from "@/lib/utils";
import { tmdbImage } from "@/lib/tmdb";

interface HeroBannerSlideProps {
  movie: Movie;
  onClick?: () => void;
  priority?: boolean;
}

const TYPE_STYLES = {
  film: "text-accent",
  serie: "text-blue-400",
} as const;

const TYPE_LABELS = {
  film: "Film",
  serie: "Serie",
} as const;

export default function HeroBannerSlide({
  movie,
  onClick,
  priority = false,
}: HeroBannerSlideProps) {
  const backdropUrl = tmdbImage.backdropHero(movie.backdrop);

  return (
    <div className="absolute inset-0 cursor-pointer" onClick={onClick}>
      {backdropUrl && (
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          className="object-cover"
          priority={priority}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-bg-primary/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/60 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 md:px-10 md:pb-6">
        {/* Title */}
        <h2 className="text-base md:text-2xl lg:text-4xl font-light text-text-primary leading-tight mb-1.5 md:mb-2">
          {movie.title}
        </h2>

        {/* Meta */}
        <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3 flex-wrap">
          <span className={`text-xs font-medium ${TYPE_STYLES[movie.type]}`}>
            {TYPE_LABELS[movie.type]}
          </span>
          <span className="text-text-muted text-xs">·</span>
          <span className="text-text-secondary text-xs md:text-sm">
            {movie.year}
          </span>
          <span className="text-text-muted text-xs">·</span>
          <div className="flex items-center gap-1">
            <Star size={10} className="text-accent" />
            <span className="text-accent text-xs md:text-sm font-medium">
              {formatRating(movie.rating)}
            </span>
          </div>
        </div>

        {/* Genre badges — hidden on mobile, visible from md up */}
        <div className="hidden md:flex gap-1.5 flex-wrap">
          {movie.genre.slice(0, 3).map((g) => (
            <span
              key={g}
              className="text-xs px-2 py-0.5 rounded-sm border border-border-subtle text-text-secondary"
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
