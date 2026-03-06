import Image from "next/image";
import { Star } from "lucide-react";
import { Movie } from "@/types/movie";
import { formatRating } from "@/lib/utils";

/* =============================================
   PROPS INTERFACE
   ============================================= */
interface HeroBannerSlideProps {
  movie: Movie;
  isActive: boolean;
  onClick?: () => void;
}

/* =============================================
   TYPE STYLES
   ============================================= */
const TYPE_STYLES = {
  film: "text-accent border-accent/30 bg-accent/10",
  serie: "text-blue-400 border-blue-400/30 bg-blue-400/10",
} as const;

const TYPE_LABELS = {
  film: "Film",
  serie: "Serie",
} as const;

/* =============================================
   HERO BANNER SLIDE COMPONENT
   Single slide with backdrop, title,
   type, year, rating and genre badges
   ============================================= */
export default function HeroBannerSlide({
  movie,
  isActive,
  onClick,
}: HeroBannerSlideProps) {
  const backdropUrl = movie.backdrop
    ? `https://image.tmdb.org/t/p/original${movie.backdrop}`
    : null;

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-700 cursor-pointer ${
        isActive ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClick}
    >
      {/* ── Backdrop image ── */}
      {backdropUrl && (
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          className="object-cover"
          priority={isActive}
        />
      )}

      {/* ── Gradient overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-bg-primary/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/60 via-transparent to-transparent" />

      {/* ── Content ── */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 md:px-10 md:pb-6">
        {/* Title */}
        <h2 className="text-lg md:text-4xl font-light text-text-primary leading-tight mb-2">
          {movie.title}
        </h2>

        {/* Type · Year · Rating */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className={`text-xs font-medium ${TYPE_STYLES[movie.type].split(" ")[0]}`}
          >
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

        {/* Genre badges */}
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

// import Image from "next/image";
// import { Heart, Bookmark, Star } from "lucide-react";
// import { Movie } from "@/types/movie";
// import { formatRating } from "@/lib/utils";

// /* =============================================
//    PROPS INTERFACE
//    ============================================= */
// interface HeroBannerSlideProps {
//   movie: Movie;
//   isActive: boolean;
//   onClick?: () => void;
// }

// /* =============================================
//    HERO BANNER SLIDE COMPONENT
//    Single slide with backdrop, title,
//    rating, genre chips and action icons
//    ============================================= */
// export default function HeroBannerSlide({
//   movie,
//   isActive,
//   onClick,
// }: HeroBannerSlideProps) {
//   /* ── Image URL ── */
//   const backdropUrl = movie.backdrop
//     ? `https://image.tmdb.org/t/p/original${movie.backdrop}`
//     : null;

//   /* ── Stop click propagation on action row ── */
//   const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

//   return (
//     <div
//       className={`absolute inset-0 transition-opacity duration-700 cursor-pointer ${
//         isActive ? "opacity-100" : "opacity-0 pointer-events-none"
//       }`}
//       onClick={onClick}
//     >
//       {/* Backdrop image */}
//       {backdropUrl && (
//         <Image
//           src={backdropUrl}
//           alt={movie.title}
//           fill
//           className="object-cover"
//           priority={isActive}
//         />
//       )}

//       {/* Overlays */}
//       <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-bg-primary/20 to-transparent" />
//       <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/60 via-transparent to-transparent" />

//       {/* Content */}
//       <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 md:px-10 md:pb-6">
//         {/* Row 1 — title */}
//         <h2 className="text-lg md:text-4xl font-light text-text-primary leading-tight mb-2">
//           {movie.title}
//         </h2>

//         {/* Row 2 — year + director + rating + action icons */}
//         <div
//           className="flex items-center gap-2 mb-2 flex-wrap"
//           onClick={stopPropagation}
//         >
//           <span className="text-text-secondary text-xs md:text-sm">
//             {movie.year}
//           </span>
//           <span className="text-text-muted text-xs">•</span>
//           <span className="text-text-secondary text-xs md:text-sm">
//             {movie.director}
//           </span>
//           <span className="text-text-muted text-xs">•</span>
//           <span className="flex items-center gap-1 text-accent text-xs md:text-sm">
//             <Star size={12} />
//             {formatRating(movie.rating)}
//           </span>
//           <span className="text-text-muted text-xs">•</span>

//           {/* Action icons */}
//           <div className="flex gap-2">
//             <button className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-md bg-bg-primary/70 backdrop-blur-sm text-text-secondary hover:text-heart transition-colors duration-300">
//               <Heart size={13} />
//             </button>
//             <button className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-md bg-bg-primary/70 backdrop-blur-sm text-text-secondary hover:text-accent transition-colors duration-300">
//               <Bookmark size={13} />
//             </button>
//           </div>
//         </div>

//         {/* Row 3 — genre chips */}
//         <div className="flex gap-1.5 flex-wrap">
//           {movie.genre.slice(0, 3).map((g) => (
//             <span
//               key={g}
//               className="text-xs md:text-sm px-2 py-1 rounded-sm border border-border-subtle text-text-secondary"
//             >
//               {g}
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
