import { redirect } from "next/navigation";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getMovieDetail, getSeriesDetail, getGenres } from "@/lib/tmdb";
import { toMovie } from "@/lib/utils";
import FavoritesGrid from "@/components/favorites/FavoritesGrid";

/* ============================================================
   FAVORITES PAGE — Server Component
   Loads data from Supabase + TMDB once, then delegates
   rendering and interaction to the FavoritesGrid client
   component which handles instant removal from the list.
   ============================================================ */

export default async function FavoritesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  /* ── Fetch favorites rows from Supabase ── */
  const { data: rows } = await supabase
    .from("favorites")
    .select("tmdb_id, media_type")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  /* ── Empty state ── */
  if (!rows || rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh gap-4 text-center px-6">
        <Heart size={48} className="text-heart opacity-30" />
        <h1 className="text-3xl font-light text-text-primary">Preferiti</h1>
        <p className="text-text-secondary max-w-sm">
          Non hai ancora aggiunto nessun film o serie ai preferiti. Esplora il
          catalogo e clicca il cuore per salvarli qui!
        </p>
      </div>
    );
  }

  /* ── Fetch TMDB details and genres in parallel ── */
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
        Awaited<ReturnType<typeof getMovieDetail>> & {
          media_type: "movie" | "tv";
        }
      > => r.status === "fulfilled",
    )
    .map((r) => toMovie(r.value, genres))
    .filter((m) => !!m.poster);

  const initialFilms = movies.filter((m) => m.type === "film");
  const initialSeries = movies.filter((m) => m.type === "serie");

  return (
    <div className="min-h-svh pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <Heart size={28} className="text-heart" />
        <h1 className="text-3xl font-light text-text-primary">Preferiti</h1>
        <span className="text-text-secondary text-sm ml-1">
          ({movies.length})
        </span>
      </div>

      <FavoritesGrid
        initialFilms={initialFilms}
        initialSeries={initialSeries}
      />
    </div>
  );
}

// import { redirect } from "next/navigation";
// import { Heart } from "lucide-react";
// import { createClient } from "@/lib/supabase/server";
// import { getMovieDetail, getSeriesDetail, getGenres } from "@/lib/tmdb";
// import { toMovie } from "@/lib/utils";
// import MovieGallery from "@/components/layout/MovieGallery";

// /* ============================================================
//    FAVORITES PAGE
//    Displays all movies and series saved by the logged-in user.
//    Reads from Supabase favorites table, fetches details from
//    TMDB in parallel, and renders using MovieGallery.
//    ============================================================ */

// export default async function FavoritesPage() {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) redirect("/login");

//   /* ── Fetch favorites from Supabase ── */
//   const { data: rows } = await supabase
//     .from("favorites")
//     .select("tmdb_id, media_type")
//     .eq("user_id", user.id)
//     .order("created_at", { ascending: false });

//   if (!rows || rows.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-svh gap-4 text-center px-6">
//         <Heart size={48} className="text-heart opacity-30" />
//         <h1 className="text-3xl font-light text-text-primary">Preferiti</h1>
//         <p className="text-text-secondary max-w-sm">
//           Non hai ancora aggiunto nessun film o serie ai preferiti. Esplora il
//           catalogo e clicca il cuore per salvarli qui!
//         </p>
//       </div>
//     );
//   }

//   /* ── Fetch TMDB details and genres in parallel ── */
//   const [genres, tmdbResults] = await Promise.all([
//     getGenres(),
//     Promise.allSettled(
//       rows.map(({ tmdb_id, media_type }) =>
//         media_type === "movie"
//           ? getMovieDetail(tmdb_id).then((m) => ({
//               ...m,
//               media_type: "movie" as const,
//             }))
//           : getSeriesDetail(tmdb_id).then((m) => ({
//               ...m,
//               media_type: "tv" as const,
//             })),
//       ),
//     ),
//   ]);

//   const movies = tmdbResults
//     .filter(
//       (
//         r,
//       ): r is PromiseFulfilledResult<
//         typeof r extends PromiseFulfilledResult<infer T> ? T : never
//       > => r.status === "fulfilled",
//     )
//     .map((r) => toMovie(r.value, genres))
//     .filter((m) => m.poster);

//   const films = movies.filter((m) => m.type === "film");
//   const series = movies.filter((m) => m.type === "serie");

//   return (
//     <div className="min-h-svh pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center gap-3 mb-10">
//         <Heart size={28} className="text-heart" />
//         <h1 className="text-3xl font-light text-text-primary">Preferiti</h1>
//         <span className="text-text-secondary text-sm ml-1">
//           ({movies.length})
//         </span>
//       </div>

//       {/* Film section */}
//       {films.length > 0 && (
//         <div className="mb-10">
//           <MovieGallery title="Film" movies={films} />
//         </div>
//       )}

//       {/* Series section */}
//       {series.length > 0 && (
//         <div className="mb-10">
//           <MovieGallery title="Serie TV" movies={series} />
//         </div>
//       )}
//     </div>
//   );
// }
