// import Hero from "@/components/layout/Hero";
import HeroBanner from "@/components/layout/HeroBanner";
import MovieGallery from "@/components/layout/MovieGallery";
import movies from "@/data/movies.json";
import { Movie } from "@/types/movie";

/* =============================================
   DATA FILTERING
   ============================================= */
const allMovies = movies as Movie[];

const latestMovies = allMovies
  .filter((m) => !m.upcoming)
  .sort((a, b) => b.year - a.year)
  .slice(0, 12);

const upcomingMovies = allMovies.filter((m) => m.upcoming).slice(0, 12);

const topRatedFilms = allMovies
  .filter((m) => m.type === "film" && !m.upcoming)
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 12);

const topRatedSeries = allMovies
  .filter((m) => m.type === "serie" && !m.upcoming)
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 12);

const awardFilms = allMovies
  .filter((m) => m.type === "film" && m.awards.length > 0)
  .slice(0, 12);

const awardSeries = allMovies
  .filter((m) => m.type === "serie" && m.awards.length > 0)
  .slice(0, 12);

/* =============================================
   HOME PAGE
   ============================================= */
export default function Home() {
  const heroMovies = allMovies.slice(0, 8);

  return (
    <>
      {/* Hero banner */}
      <HeroBanner movies={heroMovies} />

      {/* Galleries */}
      <MovieGallery title="Ultime uscite" movies={latestMovies} />
      <MovieGallery title="Prossime uscite" movies={upcomingMovies} />
      <MovieGallery title="Film più votati" movies={topRatedFilms} />
      <MovieGallery title="Serie più votate" movies={topRatedSeries} />
      <MovieGallery title="Film premiati" movies={awardFilms} />
      <MovieGallery title="Serie premiate" movies={awardSeries} />
    </>
  );
}

{
  /* Hero fullscreen — desktop only */
}
{
  /* <div className="hidden md:block">
  <Hero movies={heroMovies} />
</div> */
}

{
  /* Hero banner — mobile & desktop */
}
