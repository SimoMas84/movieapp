"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ActorCard from "@/components/cards/ActorCard";

/* =============================================
   PROPS INTERFACE
   ============================================= */
interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CastGalleryProps {
  cast: CastMember[];
}

/* =============================================
   CAST GALLERY COMPONENT
   Client wrapper for Swiper cast gallery
   with desktop navigation arrows.
   Same scroll settings as MovieGallery for
   consistent smooth behavior.
   ============================================= */
export default function CastGallery({ cast }: CastGalleryProps) {
  return (
    <div className="relative">
      <Swiper
        modules={[FreeMode, Navigation]}
        cssMode={true}
        freeMode={{
          enabled: true,
          momentum: true,
          momentumRatio: 1,
          momentumVelocityRatio: 1,
          momentumBounce: false,
        }}
        navigation={{
          nextEl: ".cast-next",
          prevEl: ".cast-prev",
        }}
        slidesPerView="auto"
        spaceBetween={12}
        slidesOffsetBefore={24}
        slidesOffsetAfter={24}
        className="w-full"
      >
        {cast.map((actor, i) => (
          <SwiperSlide key={actor.id} className="!w-auto">
            <ActorCard
              id={actor.id}
              name={actor.name}
              character={actor.character}
              profilePath={actor.profile_path}
              index={i}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ── Desktop arrows ── */}
      <button
        aria-label="Scorri a sinistra"
        className="cast-prev hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-md bg-bg-primary/80 backdrop-blur-sm border border-border-subtle text-text-secondary hover:border-accent hover:text-accent transition-all duration-300"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        aria-label="Scorri a destra"
        className="cast-next hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-md bg-bg-primary/80 backdrop-blur-sm border border-border-subtle text-text-secondary hover:border-accent hover:text-accent transition-all duration-300"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

// "use client";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { FreeMode, Navigation } from "swiper/modules";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import ActorCard from "@/components/cards/ActorCard";

// /* =============================================
//    PROPS INTERFACE
//    ============================================= */
// interface CastMember {
//   id: number;
//   name: string;
//   character: string;
//   profile_path: string | null;
// }

// interface CastGalleryProps {
//   cast: CastMember[];
// }

// /* =============================================
//    CAST GALLERY COMPONENT
//    Client wrapper for Swiper cast gallery
//    with desktop navigation arrows
//    ============================================= */
// export default function CastGallery({ cast }: CastGalleryProps) {
//   return (
//     <div className="relative">
//       <Swiper
//         modules={[FreeMode, Navigation]}
//         freeMode={true}
//         navigation={{
//           nextEl: ".cast-next",
//           prevEl: ".cast-prev",
//         }}
//         slidesPerView="auto"
//         spaceBetween={12}
//         slidesOffsetAfter={24}
//         className="w-full"
//       >
//         {cast.map((actor, i) => (
//           <SwiperSlide key={actor.id} className="!w-auto">
//             <ActorCard
//               id={actor.id}
//               name={actor.name}
//               character={actor.character}
//               profilePath={actor.profile_path}
//               index={i}
//             />
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       {/* ── Desktop arrows ── */}
//       <button
//         aria-label="Scorri a sinistra"
//         className="cast-prev hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-md bg-bg-primary/80 backdrop-blur-sm border border-border-subtle text-text-secondary hover:border-accent hover:text-accent transition-all duration-300"
//       >
//         <ChevronLeft size={18} />
//       </button>
//       <button
//         aria-label="Scorri a destra"
//         className="cast-next hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-md bg-bg-primary/80 backdrop-blur-sm border border-border-subtle text-text-secondary hover:border-accent hover:text-accent transition-all duration-300"
//       >
//         <ChevronRight size={18} />
//       </button>
//     </div>
//   );
// }
