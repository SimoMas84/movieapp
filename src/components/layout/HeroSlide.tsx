import Image from "next/image";
import Link from "next/link";
import { Heart, Bookmark, ChevronRight, Star } from "lucide-react";
import { Movie } from "@/types/movie";
import { formatRating } from "@/lib/utils";

/* =============================================
   PROPS INTERFACE
   ============================================= */
interface HeroSlideProps {
  movie: Movie;
  isActive: boolean;
}

/* =============================================
   HERO SLIDE COMPONENT
   Full screen slide with movie backdrop,
   title, info and action buttons
   ============================================= */
export default function HeroSlide({ movie, isActive }: HeroSlideProps) {
  /* ── Image URL ── */
  const backdropUrl = movie.backdrop
    ? `https://image.tmdb.org/t/p/original${movie.backdrop}`
    : null;

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-1000 ${
        isActive ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop image */}
      {backdropUrl && (
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          className="object-cover"
          priority={isActive}
        />
      )}

      {/* Dark overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-24 md:px-16 md:pb-20 max-w-7xl mx-auto">
        {/* Genre chips */}
        <div className="flex gap-2 mb-4">
          {movie.genre.slice(0, 3).map((g) => (
            <span
              key={g}
              className="text-xs font-medium px-3 py-1 rounded-sm border border-border-subtle text-text-secondary"
            >
              {g}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-light text-text-primary mb-2 leading-tight">
          {movie.title}
        </h1>

        {/* Meta info */}
        <div className="flex items-center gap-4 mb-4 text-text-secondary text-sm">
          <span>{movie.year}</span>
          <span>•</span>
          <span>{movie.director}</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-accent font-medium">
            <Star size={13} />
            {formatRating(movie.rating)}
          </span>
        </div>

        {/* Plot */}
        <p className="text-text-secondary text-sm md:text-base max-w-xl mb-8 line-clamp-2 md:line-clamp-3">
          {movie.plot}
        </p>

        {/* Action buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Go to movie page */}
          <Link
            href={`/movie/${movie.id}`}
            className="flex items-center gap-2 h-11 px-6 rounded-xl bg-accent text-bg-primary text-sm font-medium hover:scale-105 transition-transform duration-300"
          >
            Scopri di più
            <ChevronRight size={16} />
          </Link>

          {/* Add to favorites */}
          <button className="flex items-center justify-center w-11 h-11 rounded-xl border border-border-subtle text-text-secondary hover:border-heart hover:text-heart transition-all duration-300">
            <Heart size={18} />
          </button>

          {/* Add to watchlist */}
          <button className="flex items-center justify-center w-11 h-11 rounded-xl border border-border-subtle text-text-secondary hover:border-accent hover:text-accent transition-all duration-300">
            <Bookmark size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
