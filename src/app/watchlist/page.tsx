/* ============================================================
   WATCHLIST PAGE — Server Component
   Loads data from Supabase + TMDB once, then delegates
   rendering and interaction to the WatchlistGrid client
   component which handles instant removal from the list.
   ============================================================ */

import { redirect } from "next/navigation";
import { Bookmark } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  getMovieDetail,
  getSeriesDetail,
  getGenres,
  TMDBMovie,
} from "@/lib/tmdb";
import { toMovie } from "@/lib/utils";
import WatchlistGrid from "@/components/watchlist/WatchlistGrid";

export default async function WatchlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: rows } = await supabase
    .from("watchlist")
    .select("tmdb_id, media_type")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!rows?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh gap-4 text-center px-6">
        <Bookmark size={48} className="text-accent opacity-30" />
        <h1 className="text-3xl font-light text-text-primary">Watchlist</h1>
        <p className="text-text-secondary max-w-sm">
          Non hai ancora aggiunto nessun film o serie alla watchlist. Esplora il
          catalogo e clicca il segnalibro per salvarli qui!
        </p>
      </div>
    );
  }

  const [genres, tmdbResults] = await Promise.all([
    getGenres(),
    Promise.allSettled(
      rows.map(({ tmdb_id, media_type }) =>
        media_type === "movie"
          ? getMovieDetail(tmdb_id).then((m) => ({
              ...m,
              media_type: "movie" as const,
            }))
          : getSeriesDetail(tmdb_id).then((m) => ({
              ...m,
              media_type: "tv" as const,
            })),
      ),
    ),
  ]);

  const movies = tmdbResults
    .filter(
      (
        r,
      ): r is PromiseFulfilledResult<
        TMDBMovie & { media_type: "movie" | "tv" }
      > => r.status === "fulfilled",
    )
    .map((r) => toMovie(r.value, genres))
    .filter((m) => !!m.poster);

  return (
    <div className="min-h-svh pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end gap-4 mb-12">
        <Bookmark size={52} className="text-accent" />
        <h1 className="text-4xl lg:text-5xl font-light text-text-primary">
          Watchlist
        </h1>
        <span className="text-text-secondary text-sm mb-1.5">
          ({movies.length})
        </span>
      </div>

      <WatchlistGrid
        initialFilms={movies.filter((m) => m.type === "film")}
        initialSeries={movies.filter((m) => m.type === "serie")}
      />
    </div>
  );
}
