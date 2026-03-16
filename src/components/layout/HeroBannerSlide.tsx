/* ============================================================
   HERO BANNER SLIDE COMPONENT
   Single slide with backdrop, title, type, year,
   rating and genre badges. Visibility managed by Swiper.
   ============================================================ */

import Image from "next/image";
import { Star } from "lucide-react";
import { Movie } from "@/types/movie";
import { formatRating } from "@/lib/utils";

interface HeroBannerSlideProps {
  movie: Movie;
  onClick?: () => void;
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
}: HeroBannerSlideProps) {
  const backdropUrl = movie.backdrop
    ? `https://image.tmdb.org/t/p/original${movie.backdrop}`
    : null;

  return (
    <div className="absolute inset-0 cursor-pointer" onClick={onClick}>
      {/* Backdrop image */}
      {backdropUrl && (
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-bg-primary/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 md:px-10 md:pb-6">
        <h2 className="text-lg md:text-4xl font-light text-text-primary leading-tight mb-2">
          {movie.title}
        </h2>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`text-xs font-medium ${TYPE_STYLES[movie.type]}`}>
            {TYPE_LABELS[movie.type]}
          </span>
          <span className="text-text-muted text-xs">·</span>
          <span className="text-text-secondary text-xs md:text-sm">
            {movie.year}
          </span>
          <span className="text-text-muted text-xs">·</span>
          <div className="flex items-center gap-1">
            <Star size={11} className="text-accent" />
            <span className="text-accent text-xs md:text-sm font-medium">
              {formatRating(movie.rating)}
            </span>
          </div>
        </div>

        <div className="flex gap-1.5 flex-wrap">
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
