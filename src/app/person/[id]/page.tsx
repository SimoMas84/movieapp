import { notFound } from "next/navigation";
import Image from "next/image";
import {
  getPersonDetail,
  getPersonMovieCredits,
  getPersonTVCredits,
  getMovieGenres,
  getSeriesGenres,
  tmdbImage,
} from "@/lib/tmdb";
import MovieGallery from "@/components/layout/MovieGallery";
import { toMovie } from "@/lib/utils";

/* =============================================
   PROPS
   ============================================= */
interface PersonPageProps {
  params: Promise<{ id: string }>;
}

/* =============================================
   HELPERS
   ============================================= */
function formatDate(date?: string): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* =============================================
   PERSON DETAIL PAGE — SERVER COMPONENT
   Fetches person details, movie and TV credits,
   and genre lists in parallel.
   ============================================= */
export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;
  const personId = Number(id);

  /* ── Fetch all data in parallel ── */
  const [person, movieCredits, tvCredits, movieGenres, tvGenres] =
    await Promise.all([
      getPersonDetail(personId),
      getPersonMovieCredits(personId),
      getPersonTVCredits(personId),
      getMovieGenres(),
      getSeriesGenres(),
    ]).catch(() => notFound());

  /* ── Movies as actor or director — sorted by year descending ── */
  const movies = [
    ...movieCredits.cast,
    ...movieCredits.crew.filter((c) => c.job === "Director"),
  ]
    .filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i)
    .filter((m) => m.poster_path)
    .sort((a, b) => (b.release_date ?? "").localeCompare(a.release_date ?? ""))
    .map((m) => toMovie({ ...m, media_type: "movie" }, movieGenres));

  /* ── Series as actor or creator — sorted by year descending ── */
  const series = [
    ...tvCredits.cast,
    ...tvCredits.crew.filter(
      (c) => c.job === "Executive Producer" || c.job === "Director",
    ),
  ]
    .filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i)
    .filter((m) => m.poster_path)
    .sort((a, b) =>
      (b.first_air_date ?? "").localeCompare(a.first_air_date ?? ""),
    )
    .map((m) => toMovie({ ...m, media_type: "tv" }, tvGenres));

  const profileUrl = tmdbImage.posterLarge(person.profile_path);
  const isActor = person.known_for_department === "Acting";

  return (
    <div className="pt-28 pb-16">
      {/* ── Hero ── */}
      <div className="px-6 md:px-10 max-w-screen-2xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* ── Profile photo ── */}
          {profileUrl && (
            <div className="relative shrink-0 w-48 md:w-62 lg:w-80 mb-4 aspect-[2/3] rounded-xl overflow-hidden border border-border-subtle shadow-2xl mx-auto md:mx-0">
              <Image
                src={profileUrl}
                alt={person.name}
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          )}

          {/* ── Info ── */}
          <div className="flex-1 max-w-3xl">
            {/* Department badge */}
            <span
              className={`text-xs px-2 py-1 rounded-sm border inline-block ${
                isActor
                  ? "border-accent/30 text-accent bg-accent/10"
                  : "border-blue-400/30 text-blue-400 bg-blue-400/10"
              }`}
            >
              {isActor ? "Attore" : "Regista"}
            </span>

            {/* Name */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-text-primary mb-4 mt-4 leading-tight">
              {person.name}
            </h1>

            {/* Birth date and place */}
            {/* Birth date and place */}
            <div className="flex flex-col gap-2 mb-6">
              {person.birthday && (
                <p className="text-text-secondary text-sm">
                  Data di nascita:{" "}
                  <span className="text-text-primary">
                    {formatDate(person.birthday)}
                  </span>
                </p>
              )}
              {person.place_of_birth && (
                <p className="text-text-secondary text-sm">
                  Luogo di nascita:{" "}
                  <span className="text-text-primary">
                    {person.place_of_birth}
                  </span>
                </p>
              )}
              {person.deathday && (
                <p className="text-text-secondary text-sm">
                  Scomparso il:{" "}
                  <span className="text-text-primary">
                    {formatDate(person.deathday)}
                  </span>
                </p>
              )}
            </div>

            {/* Biography */}
            {person.biography && (
              <p className="text-text-primary text-sm md:text-base leading-relaxed line-clamp-6 md:line-clamp-none">
                {person.biography}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* ── Filmografia ── */}
      {(movies.length > 0 || series.length > 0) && (
        <div className="px-6 md:px-10 max-w-screen-2xl mx-auto mb-6 mt-4">
          <div className="border-t border-border-subtle pt-10">
            <h2 className="text-2xl font-light text-text-primary mb-1">
              Filmografia
            </h2>
            <p className="text-text-secondary text-sm">
              Film e serie TV in cui {person.name} ha recitato o preso parte
            </p>
          </div>
        </div>
      )}

      {/* ── Movie filmography ── */}
      {movies.length > 0 && <MovieGallery title="Film" movies={movies} />}

      {/* ── TV series filmography ── */}
      {series.length > 0 && <MovieGallery title="Serie TV" movies={series} />}
    </div>
  );
}
