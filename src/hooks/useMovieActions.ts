"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Movie } from "@/types/movie";
import { useToast } from "@/hooks/useToast";

/* ============================================================
   useMovieActions HOOK
   Manages favorites and watchlist state for a single movie.
   - Reads initial state from Supabase on mount
   - Toggles state optimistically on user interaction
   - Reverts on error
   - Shows toast when user is not authenticated
   ============================================================ */

interface UseMovieActionsReturn {
  isFavorite: boolean;
  isWatchlist: boolean;
  toggleFavorite: (e: React.MouseEvent) => Promise<void>;
  toggleWatchlist: (e: React.MouseEvent) => Promise<void>;
}

export function useMovieActions(movie: Movie): UseMovieActionsReturn {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isWatchlist, setIsWatchlist] = useState<boolean>(false);

  const supabase = createClient();
  const mediaType = movie.type === "film" ? "movie" : "tv";
  const { toast } = useToast();

  /* ── Load initial state from Supabase ── */
  useEffect(() => {
    async function loadState(): Promise<void> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: fav }, { data: watch }] = await Promise.all([
        supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("tmdb_id", movie.id)
          .eq("media_type", mediaType)
          .maybeSingle(),
        supabase
          .from("watchlist")
          .select("id")
          .eq("user_id", user.id)
          .eq("tmdb_id", movie.id)
          .eq("media_type", mediaType)
          .maybeSingle(),
      ]);

      setIsFavorite(!!fav);
      setIsWatchlist(!!watch);
    }

    loadState();
  }, [movie.id, mediaType]);

  /* ── Toggle favorite ── */
  const toggleFavorite = useCallback(
    async (e: React.MouseEvent): Promise<void> => {
      e.stopPropagation();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.warning("Accedi per aggiungere ai preferiti");
        return;
      }

      const prev = isFavorite;
      setIsFavorite(!prev);

      if (prev) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("tmdb_id", movie.id)
          .eq("media_type", mediaType);

        if (error) {
          setIsFavorite(prev);
          toast.error("Errore durante la rimozione dai preferiti");
        }
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, tmdb_id: movie.id, media_type: mediaType });

        if (error) {
          setIsFavorite(prev);
          toast.error("Errore durante l'aggiunta ai preferiti");
        }
      }
    },
    [isFavorite, movie.id, mediaType]
  );

  /* ── Toggle watchlist ── */
  const toggleWatchlist = useCallback(
    async (e: React.MouseEvent): Promise<void> => {
      e.stopPropagation();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.warning("Accedi per aggiungere alla watchlist");
        return;
      }

      const prev = isWatchlist;
      setIsWatchlist(!prev);

      if (prev) {
        const { error } = await supabase
          .from("watchlist")
          .delete()
          .eq("user_id", user.id)
          .eq("tmdb_id", movie.id)
          .eq("media_type", mediaType);

        if (error) {
          setIsWatchlist(prev);
          toast.error("Errore durante la rimozione dalla watchlist");
        }
      } else {
        const { error } = await supabase
          .from("watchlist")
          .insert({ user_id: user.id, tmdb_id: movie.id, media_type: mediaType });

        if (error) {
          setIsWatchlist(prev);
          toast.error("Errore durante l'aggiunta alla watchlist");
        }
      }
    },
    [isWatchlist, movie.id, mediaType]
  );

  return { isFavorite, isWatchlist, toggleFavorite, toggleWatchlist };
}

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { createClient } from "@/lib/supabase/client";
// import { Movie } from "@/types/movie";

// /* ============================================================
//    useMovieActions HOOK
//    Manages favorites and watchlist state for a single movie.
//    - Reads initial state from Supabase on mount
//    - Toggles state optimistically on user interaction
//    - Reverts on error
//    - No-ops gracefully when user is not authenticated
//    ============================================================ */

// interface UseMovieActionsReturn {
//   isFavorite: boolean;
//   isWatchlist: boolean;
//   toggleFavorite: (e: React.MouseEvent) => Promise<void>;
//   toggleWatchlist: (e: React.MouseEvent) => Promise<void>;
// }

// export function useMovieActions(movie: Movie): UseMovieActionsReturn {
//   const [isFavorite, setIsFavorite] = useState<boolean>(false);
//   const [isWatchlist, setIsWatchlist] = useState<boolean>(false);

//   const supabase = createClient();
//   const mediaType = movie.type === "film" ? "movie" : "tv";


//   /* ── Load initial state from Supabase ── */
//   useEffect(() => {
//     async function loadState(): Promise<void> {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) return;

//       const [{ data: fav }, { data: watch }] = await Promise.all([
//         supabase
//           .from("favorites")
//           .select("id")
//           .eq("user_id", user.id)
//           .eq("tmdb_id", movie.id)
//           .eq("media_type", mediaType)
//           .maybeSingle(),
//         supabase
//           .from("watchlist")
//           .select("id")
//           .eq("user_id", user.id)
//           .eq("tmdb_id", movie.id)
//           .eq("media_type", mediaType)
//           .maybeSingle(),
//       ]);

//       setIsFavorite(!!fav);
//       setIsWatchlist(!!watch);
//     }

//     loadState();
//   }, [movie.id, mediaType]);

//   /* ── Toggle favorite ── */
//   const toggleFavorite = useCallback(async (e: React.MouseEvent): Promise<void> => {
//     e.stopPropagation();

//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return;

//     /* Optimistic update */
//     const prev = isFavorite;
//     setIsFavorite(!prev);

//     if (prev) {
//       const { error } = await supabase
//         .from("favorites")
//         .delete()
//         .eq("user_id", user.id)
//         .eq("tmdb_id", movie.id)
//         .eq("media_type", mediaType);

//       if (error) setIsFavorite(prev);
//     } else {
//       const { error } = await supabase
//         .from("favorites")
//         .insert({ user_id: user.id, tmdb_id: movie.id, media_type: mediaType });

//       if (error) setIsFavorite(prev);
//     }
//   }, [isFavorite, movie.id, mediaType]);

//   /* ── Toggle watchlist ── */
//   const toggleWatchlist = useCallback(async (e: React.MouseEvent): Promise<void> => {
//     e.stopPropagation();

//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return;

//     /* Optimistic update */
//     const prev = isWatchlist;
//     setIsWatchlist(!prev);

//     if (prev) {
//       const { error } = await supabase
//         .from("watchlist")
//         .delete()
//         .eq("user_id", user.id)
//         .eq("tmdb_id", movie.id)
//         .eq("media_type", mediaType);

//       if (error) setIsWatchlist(prev);
//     } else {
//       const { error } = await supabase
//         .from("watchlist")
//         .insert({ user_id: user.id, tmdb_id: movie.id, media_type: mediaType });

//       if (error) setIsWatchlist(prev);
//     }
//   }, [isWatchlist, movie.id, mediaType]);

//   return { isFavorite, isWatchlist, toggleFavorite, toggleWatchlist };
// }

// // "use client";

// // import { useState, useEffect, useCallback } from "react";
// // import { createClient } from "@/lib/supabase/client";
// // import { Movie } from "@/types/movie";

// // /* ============================================================
// //    useMovieActions HOOK
// //    Manages favorites and watchlist state for a single movie.
// //    - Reads initial state from Supabase on mount
// //    - Toggles state optimistically on user interaction
// //    - Reverts on error
// //    - No-ops gracefully when user is not authenticated
// //    ============================================================ */

// // interface UseMovieActionsReturn {
// //   isFavorite: boolean;
// //   isWatchlist: boolean;
// //   toggleFavorite: (e: React.MouseEvent) => Promise<void>;
// //   toggleWatchlist: (e: React.MouseEvent) => Promise<void>;
// // }

// // export function useMovieActions(movie: Movie): UseMovieActionsReturn {
// //   const [isFavorite, setIsFavorite] = useState<boolean>(false);
// //   const [isWatchlist, setIsWatchlist] = useState<boolean>(false);

// //   const supabase = createClient();
// //   const mediaType = movie.type === "film" ? "movie" : "tv";


// //   /* ── Load initial state from Supabase ── */
// //   useEffect(() => {
// //     async function loadState(): Promise<void> {
// //       const { data: { user } } = await supabase.auth.getUser();
// //       if (!user) return;

// //       const [{ data: fav }, { data: watch }] = await Promise.all([
// //         supabase
// //           .from("favorites")
// //           .select("id")
// //           .eq("user_id", user.id)
// //           .eq("tmdb_id", movie.id)
// //           .eq("media_type", mediaType)
// //           .maybeSingle(),
// //         supabase
// //           .from("watchlist")
// //           .select("id")
// //           .eq("user_id", user.id)
// //           .eq("tmdb_id", movie.id)
// //           .eq("media_type", mediaType)
// //           .maybeSingle(),
// //       ]);

// //       setIsFavorite(!!fav);
// //       setIsWatchlist(!!watch);
// //     }

// //     loadState();
// //   }, [movie.id, mediaType]);

// //   /* ── Toggle favorite ── */
// //   const toggleFavorite = useCallback(async (e: React.MouseEvent): Promise<void> => {
// //     e.stopPropagation();

// //     const { data: { user } } = await supabase.auth.getUser();
// //     if (!user) return;

// //     /* Optimistic update */
// //     const prev = isFavorite;
// //     setIsFavorite(!prev);

// //     if (prev) {
// //       const { error } = await supabase
// //         .from("favorites")
// //         .delete()
// //         .eq("user_id", user.id)
// //         .eq("tmdb_id", movie.id)
// //         .eq("media_type", mediaType);

// //       if (error) setIsFavorite(prev);
// //     } else {
// //       const { error } = await supabase
// //         .from("favorites")
// //         .insert({ user_id: user.id, tmdb_id: movie.id, media_type: mediaType });

// //       if (error) setIsFavorite(prev);
// //     }
// //   }, [isFavorite, movie.id, mediaType]);

// //   /* ── Toggle watchlist ── */
// //   const toggleWatchlist = useCallback(async (e: React.MouseEvent): Promise<void> => {
// //     e.stopPropagation();

// //     const { data: { user } } = await supabase.auth.getUser();
// //     if (!user) return;

// //     /* Optimistic update */
// //     const prev = isWatchlist;
// //     setIsWatchlist(!prev);

// //     if (prev) {
// //       const { error } = await supabase
// //         .from("watchlist")
// //         .delete()
// //         .eq("user_id", user.id)
// //         .eq("tmdb_id", movie.id)
// //         .eq("media_type", mediaType);

// //       if (error) setIsWatchlist(prev);
// //     } else {
// //       const { error } = await supabase
// //         .from("watchlist")
// //         .insert({ user_id: user.id, tmdb_id: movie.id, media_type: mediaType });

// //       if (error) setIsWatchlist(prev);
// //     }
// //   }, [isWatchlist, movie.id, mediaType]);

// //   return { isFavorite, isWatchlist, toggleFavorite, toggleWatchlist };
// // }