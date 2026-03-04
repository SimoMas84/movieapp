import { notFound } from "next/navigation";
import Image from "next/image";
import { Star, Heart, Bookmark } from "lucide-react";
import { formatRating } from "@/lib/utils";
import CastGallery from "@/components/ui/CastGallery";
import TrailerPlayer from "@/components/ui/TrailerPlayer";
import {
  getMovieDetail,
  getMovieCredits,
  getMovieVideos,
  getWatchProviders,
  getRelatedMovies,
  tmdbImage,
} from "@/lib/tmdb";

/* =============================================
   PROPS
   ============================================= */
interface MoviePageProps {
  params: Promise<{ id: string }>;
}

/* =============================================
   MOVIE DETAIL PAGE — SERVER COMPONENT
   Fetches all movie data in parallel
   ============================================= */
export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movieId = Number(id);

  /* ── Fetch all data in parallel ── */
  const [movie, credits, videos, providers, related] = await Promise.all([
    getMovieDetail(movieId),
    getMovieCredits(movieId),
    getMovieVideos(movieId),
    getWatchProviders(movieId, "movie"),
    getRelatedMovies(movieId),
  ]).catch(() => notFound());

  /* ── Data helpers ── */
  const trailer = videos[0] ?? null;
  const director = credits.crew.find((c) => c.job === "Director");
  const cast = credits.cast.slice(0, 12);
  const backdropUrl = tmdbImage.backdropFull(movie.backdrop_path);
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;
  const budget = movie.budget
    ? new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(movie.budget)
    : null;
  const revenue = movie.revenue
    ? new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(movie.revenue)
    : null;

  return (
    <>
      {/* ── Hero — fullscreen backdrop ── */}
      <section className="relative w-full h-svh">
        {/* Backdrop image */}
        {backdropUrl && (
          <Image
            src={backdropUrl}
            alt={movie.title ?? ""}
            fill
            className="object-cover"
            priority
          />
        )}

        {/* Gradients overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/80 via-transparent to-transparent" />

        {/* ── Hero content ── */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-16">
          <div className="max-w-screen-2xl mx-auto flex items-end gap-12">
            {/* ── Left — poster (desktop only) ── */}
            <div className="hidden lg:block relative shrink-0 w-74 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-border-subtle">
              {movie.poster_path && (
                <Image
                  src={tmdbImage.posterLarge(movie.poster_path) ?? ""}
                  alt={movie.title ?? ""}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* ── Right — info ── */}
            <div className="flex-1 w-full">
              {/* Title */}
              <h1 className="text-3xl md:text-6xl font-light text-text-primary mb-5 leading-tight">
                {movie.title}
              </h1>

              {/* Meta — year, runtime, rating ── */}
              <div className="flex items-center gap-3 flex-wrap mb-3">
                <span className="text-text-secondary md:text-base">
                  {new Date(movie.release_date ?? "").getFullYear()}
                </span>
                {runtime && (
                  <>
                    <span className="text-text-muted">·</span>
                    <span className="text-text-secondary md:text-base">
                      {runtime}
                    </span>
                  </>
                )}
                <span className="text-text-muted">·</span>
                <div className="flex items-center gap-1">
                  <Star size={15} className="text-accent" />
                  <span className="text-accent md:text-base font-medium">
                    {formatRating(movie.vote_average)}
                  </span>
                </div>
              </div>

              {/* Director ── */}
              {director && (
                <p className="text-text-secondary md:text-base mb-5">
                  Regia{" "}
                  <span className="text-text-primary">{director.name}</span>
                </p>
              )}

              {/* Genre chips + type badge */}
              <div className="flex gap-2 flex-wrap mb-5">
                <span className="text-xs px-2 py-1 rounded-sm border border-accent/30 text-accent bg-accent/10">
                  Film
                </span>
                {movie.genres?.map((g) => (
                  <span
                    key={g.id}
                    className="text-xs px-2 py-1 rounded-sm border border-border-subtle text-text-secondary"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              {/* Plot */}
              <p className="text-text-secondary md:text-base leading-relaxed line-clamp-4 mb-6">
                {movie.overview}
              </p>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <button className="w-11 h-11 flex items-center justify-center rounded-xl border border-border-subtle text-text-secondary hover:border-heart hover:text-heart transition-all duration-300">
                  <Heart size={18} />
                </button>
                <button className="w-11 h-11 flex items-center justify-center rounded-xl border border-border-subtle text-text-secondary hover:border-accent hover:text-accent transition-all duration-300">
                  <Bookmark size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Content sections ── */}
      <div className="px-6 md:px-10 py-16 max-w-screen-2xl mx-auto space-y-16">
        {/* ── Trailer ── */}
        {trailer && (
          <TrailerPlayer trailerKey={trailer.key} title={movie.title ?? ""} />
        )}

        {/* ── Cast ── */}
        <section>
          <h2 className="text-xl font-light text-text-primary mb-6">Cast</h2>
          <CastGallery cast={cast} />
        </section>

        {/* ── Watch providers ── */}
        {providers.length > 0 && (
          <section>
            <h2 className="text-xl font-light text-text-primary mb-6">
              Disponibile su
            </h2>
            <div className="flex gap-4 flex-wrap">
              {providers.map((p) => (
                <div
                  key={p.provider_id}
                  className="relative w-14 h-14 rounded-xl overflow-hidden border border-border-subtle"
                >
                  <Image
                    src={tmdbImage.profile(p.logo_path) ?? ""}
                    alt={p.provider_name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Box Office ── */}
        {(budget || revenue) && (
          <section>
            <h2 className="text-xl font-light text-text-primary mb-6">
              Box Office
            </h2>
            <div className="flex gap-8 flex-wrap">
              {budget && (
                <div>
                  <p className="text-text-muted text-xs mb-1">Budget</p>
                  <p className="text-text-primary text-lg font-light">
                    {budget}
                  </p>
                </div>
              )}
              {revenue && (
                <div>
                  <p className="text-text-muted text-xs mb-1">Incassi</p>
                  <p className="text-accent text-lg font-light">{revenue}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Related movies ── */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-light text-text-primary mb-6">
              Film correlati
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {related.slice(0, 6).map((m) => (
                <a href={`/movie/${m.id}`} key={m.id} className="group">
                  <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-surface-2 border border-transparent group-hover:border-accent transition-all duration-300">
                    {m.poster_path && (
                      <Image
                        src={tmdbImage.poster(m.poster_path) ?? ""}
                        alt={m.title ?? ""}
                        fill
                        className="object-cover group-hover:brightness-110 transition-all duration-300"
                      />
                    )}
                  </div>
                  <p className="text-text-secondary text-xs mt-2 truncate group-hover:text-text-primary transition-colors duration-300">
                    {m.title}
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
