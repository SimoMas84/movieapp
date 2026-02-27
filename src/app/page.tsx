import Hero from "@/components/layout/Hero";
import HeroBanner from "@/components/layout/HeroBanner";
import movies from "@/data/movies.json";
import { Movie } from "@/types/movie";

/* =============================================
   HOME PAGE
   ============================================= */
export default function Home() {
  const heroMovies = (movies as Movie[]).slice(0, 8);

  return (
    <>
      {/* Hero fullscreen — desktop only */}
      {/* <div className="hidden md:block">
        <Hero movies={heroMovies} />
      </div> */}

      {/* Hero banner — mobile & desktop */}
      <div>
        <HeroBanner movies={heroMovies} />
      </div>
    </>
  );
}

// import Hero from "@/components/layout/Hero";
// import HeroBanner from "@/components/layout/HeroBanner";
// import movies from "@/data/movies.json";
// import { Movie } from "@/types/movie";

// /* =============================================
//    HOME PAGE
//    ============================================= */
// export default function Home() {
//   const heroMovies = (movies as Movie[]).slice(0, 8);

//   return (
//     <>
//       {/* Hero fullscreen — desktop only */}
//       <div className="hidden md:block">
//         <Hero movies={heroMovies} />
//       </div>

//       {/* Hero banner — mobile only */}
//       <div className="md:hidden">
//         <HeroBanner movies={heroMovies} />
//       </div>
//     </>
//   );
// }
