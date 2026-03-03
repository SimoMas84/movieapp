import HeroBanner from "@/components/layout/HeroBanner";
import MovieGallery from "@/components/layout/MovieGallery";
import GenreFilter from "@/components/layout/GenreFilter";
import {
  getTrending,
  getNowPlaying,
  getUpcoming,
  getTopRatedMovies,
  getTopRatedSeries,
  getGenres,
} from "@/lib/tmdb";
import { TMDBMovie } from "@/lib/tmdb";
import { Movie } from "@/types/movie";
import { toMovie } from "@/lib/utils";

/* =============================================
   HOME PAGE — SERVER COMPONENT
   Fetches all data in parallel server-side
   ============================================= */
export default async function Home() {
  /* ── Fetch all data in parallel ── */
  const [trending, nowPlaying, upcoming, topMovies, topSeries, genres] =
    await Promise.all([
      getTrending(),
      getNowPlaying(),
      getUpcoming(),
      getTopRatedMovies(),
      getTopRatedSeries(),
      getGenres(),
    ]);

  /* ── Convert to Movie type ── */
  const heroMovies = trending.slice(0, 8).map((m) => toMovie(m, genres));
  const latestMovies = nowPlaying.map((m) => toMovie(m, genres));
  const upcomingMovies = upcoming.map((m) => toMovie(m, genres));
  const topRatedFilms = topMovies.map((m) => toMovie(m, genres));
  const topRatedSeries = topSeries.map((m) => toMovie(m, genres));
  const allMovies = [...latestMovies, ...topRatedFilms, ...topRatedSeries];

  return (
    <>
      <HeroBanner movies={heroMovies} />
      <MovieGallery title="Ultime uscite" movies={latestMovies} />
      <MovieGallery title="Prossime uscite" movies={upcomingMovies} />
      <MovieGallery title="Film più votati" movies={topRatedFilms} />
      <MovieGallery title="Serie più votate" movies={topRatedSeries} />
      <GenreFilter movies={allMovies} />
    </>
  );
}

// // import Hero from "@/components/layout/Hero";
// import HeroBanner from "@/components/layout/HeroBanner";
// import MovieGallery from "@/components/layout/MovieGallery";
// import movies from "@/data/movies.json";
// import { Movie } from "@/types/movie";
// import GenreFilter from "@/components/layout/GenreFilter";

// /* =============================================
//    DATA FILTERING
//    ============================================= */
// const allMovies = movies as Movie[];

// const latestMovies = allMovies
//   .filter((m) => !m.upcoming)
//   .sort((a, b) => b.year - a.year)
//   .slice(0, 12);

// const upcomingMovies = allMovies.filter((m) => m.upcoming).slice(0, 12);

// const topRatedFilms = allMovies
//   .filter((m) => m.type === "film" && !m.upcoming)
//   .sort((a, b) => b.rating - a.rating)
//   .slice(0, 12);

// const topRatedSeries = allMovies
//   .filter((m) => m.type === "serie" && !m.upcoming)
//   .sort((a, b) => b.rating - a.rating)
//   .slice(0, 12);

// const awardFilms = allMovies
//   .filter((m) => m.type === "film" && m.awards.length > 0)
//   .slice(0, 12);

// const awardSeries = allMovies
//   .filter((m) => m.type === "serie" && m.awards.length > 0)
//   .slice(0, 12);

// /* =============================================
//    HOME PAGE
//    ============================================= */
// export default function Home() {
//   const heroMovies = allMovies.slice(0, 8);

//   return (
//     <>
//       {/* Hero banner - mobile & desktop */}
//       <HeroBanner movies={heroMovies} />
//       {/* Hero fullscreen — desktop only */}
//       {/* <div className="hidden md:block">
//             <Hero movies={heroMovies} />
//           </div> */}
//       {/* Galleries */}
//       <MovieGallery title="Ultime uscite" movies={latestMovies} />
//       <MovieGallery title="Prossime uscite" movies={upcomingMovies} />
//       <MovieGallery title="Film più votati" movies={topRatedFilms} />
//       <MovieGallery title="Serie più votate" movies={topRatedSeries} />
//       <MovieGallery title="Film premiati" movies={awardFilms} />
//       <MovieGallery title="Serie premiate" movies={awardSeries} />
//       <GenreFilter movies={allMovies} />;
//     </>
//   );
// }
