"use client";

/* ============================================================
   USER LISTS CONTEXT
   Loads favorites and watchlist IDs once on mount (or on login).
   All toggle operations update local state optimistically and
   sync with Supabase in the background.
   Supabase Realtime keeps all devices in sync instantly.
   ============================================================ */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";

/* ── Types ── */
type MediaType = "movie" | "tv";

interface ListItem {
  tmdb_id: number;
  media_type: MediaType;
}

interface UserListsContextValue {
  /** Returns true if the given item is in favorites */
  isFavorite: (tmdbId: number, mediaType: MediaType) => boolean;
  /** Returns true if the given item is in watchlist */
  isWatchlist: (tmdbId: number, mediaType: MediaType) => boolean;
  /** Toggles favorite state. onRemoved is called after successful removal */
  toggleFavorite: (
    e: React.MouseEvent,
    tmdbId: number,
    mediaType: MediaType,
    onRemoved?: () => void,
  ) => Promise<void>;
  /** Toggles watchlist state. onRemoved is called after successful removal */
  toggleWatchlist: (
    e: React.MouseEvent,
    tmdbId: number,
    mediaType: MediaType,
    onRemoved?: () => void,
  ) => Promise<void>;
  /** True while the initial load from Supabase is in progress */
  isLoading: boolean;
}

/* ── Context ── */
const UserListsContext = createContext<UserListsContextValue | null>(null);

/* ── Key helper — "12345:movie" for O(1) Set lookup ── */
const toKey = (tmdbId: number, mediaType: MediaType): string =>
  `${tmdbId}:${mediaType}`;

/* ── Provider ── */
export function UserListsProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();
  const { toast } = useToast();
  const userIdRef = useRef<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  /* ── Load all IDs from Supabase (IDs only, very lightweight) ── */
  const loadLists = useCallback(async (userId: string): Promise<void> => {
    const [{ data: favRows }, { data: watchRows }] = await Promise.all([
      supabase
        .from("favorites")
        .select("tmdb_id, media_type")
        .eq("user_id", userId),
      supabase
        .from("watchlist")
        .select("tmdb_id, media_type")
        .eq("user_id", userId),
    ]);
    setFavorites(
      new Set(
        (favRows ?? []).map((r: ListItem) => toKey(r.tmdb_id, r.media_type)),
      ),
    );
    setWatchlist(
      new Set(
        (watchRows ?? []).map((r: ListItem) => toKey(r.tmdb_id, r.media_type)),
      ),
    );
    setIsLoading(false);
  }, []);

  /* ── Realtime subscription — starts only after userId is confirmed ── */
  const subscribeRealtime = useCallback(
    (userId: string) => {
      /* ── Remove existing channel if any ── */
      if (channelRef.current) supabase.removeChannel(channelRef.current);

      channelRef.current = supabase
        .channel(`user-lists-${userId}`)

        /* ── Favorites INSERT ── */
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "favorites",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const { tmdb_id, media_type } = payload.new as ListItem;
            setFavorites(
              (prev) => new Set([...prev, toKey(tmdb_id, media_type)]),
            );
          },
        )

        /* ── Favorites DELETE ── */
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "favorites",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const { tmdb_id, media_type } = payload.old as ListItem;
            setFavorites((prev) => {
              const next = new Set(prev);
              next.delete(toKey(tmdb_id, media_type));
              return next;
            });
          },
        )

        /* ── Watchlist INSERT ── */
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "watchlist",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const { tmdb_id, media_type } = payload.new as ListItem;
            setWatchlist(
              (prev) => new Set([...prev, toKey(tmdb_id, media_type)]),
            );
          },
        )

        /* ── Watchlist DELETE ── */
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "watchlist",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const { tmdb_id, media_type } = payload.old as ListItem;
            setWatchlist((prev) => {
              const next = new Set(prev);
              next.delete(toKey(tmdb_id, media_type));
              return next;
            });
          },
        )

        .subscribe();
    },
    [supabase],
  );

  /* ── Subscribe to auth state changes + start Realtime ── */
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        userIdRef.current = user.id;
        loadLists(user.id);
        subscribeRealtime(user.id);
      } else {
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const userId = session?.user?.id ?? null;
      userIdRef.current = userId;
      if (userId) {
        setIsLoading(true);
        loadLists(userId);
        subscribeRealtime(userId);
      } else {
        /* ── User logged out — clear lists and channel ── */
        if (channelRef.current) supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        setFavorites(new Set());
        setWatchlist(new Set());
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [loadLists, subscribeRealtime]);

  /* ── Lookup helpers ── */
  const isFavorite = useCallback(
    (tmdbId: number, mediaType: MediaType): boolean =>
      favorites.has(toKey(tmdbId, mediaType)),
    [favorites],
  );

  const isWatchlist = useCallback(
    (tmdbId: number, mediaType: MediaType): boolean =>
      watchlist.has(toKey(tmdbId, mediaType)),
    [watchlist],
  );

  /* ── Toggle favorite ── */
  const toggleFavorite = useCallback(
    async (
      e: React.MouseEvent,
      tmdbId: number,
      mediaType: MediaType,
      onRemoved?: () => void,
    ): Promise<void> => {
      e.stopPropagation();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.warning("Accedi per aggiungere ai preferiti");
        return;
      }

      const key = toKey(tmdbId, mediaType);
      const wasInList = favorites.has(key);

      setFavorites((prev) => {
        const next = new Set(prev);
        wasInList ? next.delete(key) : next.add(key);
        return next;
      });

      if (wasInList) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("tmdb_id", tmdbId)
          .eq("media_type", mediaType);
        if (error) {
          setFavorites((prev) => new Set([...prev, key]));
          toast.error("Errore durante la rimozione dai preferiti");
        } else {
          onRemoved?.();
        }
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, tmdb_id: tmdbId, media_type: mediaType });
        if (error) {
          setFavorites((prev) => {
            const next = new Set(prev);
            next.delete(key);
            return next;
          });
          toast.error("Errore durante l'aggiunta ai preferiti");
        }
      }
    },
    [favorites, supabase, toast],
  );

  /* ── Toggle watchlist ── */
  const toggleWatchlist = useCallback(
    async (
      e: React.MouseEvent,
      tmdbId: number,
      mediaType: MediaType,
      onRemoved?: () => void,
    ): Promise<void> => {
      e.stopPropagation();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.warning("Accedi per aggiungere alla watchlist");
        return;
      }

      const key = toKey(tmdbId, mediaType);
      const wasInList = watchlist.has(key);

      setWatchlist((prev) => {
        const next = new Set(prev);
        wasInList ? next.delete(key) : next.add(key);
        return next;
      });

      if (wasInList) {
        const { error } = await supabase
          .from("watchlist")
          .delete()
          .eq("user_id", user.id)
          .eq("tmdb_id", tmdbId)
          .eq("media_type", mediaType);
        if (error) {
          setWatchlist((prev) => new Set([...prev, key]));
          toast.error("Errore durante la rimozione dalla watchlist");
        } else {
          onRemoved?.();
        }
      } else {
        const { error } = await supabase
          .from("watchlist")
          .insert({ user_id: user.id, tmdb_id: tmdbId, media_type: mediaType });
        if (error) {
          setWatchlist((prev) => {
            const next = new Set(prev);
            next.delete(key);
            return next;
          });
          toast.error("Errore durante l'aggiunta alla watchlist");
        }
      }
    },
    [watchlist, supabase, toast],
  );

  return (
    <UserListsContext.Provider
      value={{
        isFavorite,
        isWatchlist,
        toggleFavorite,
        toggleWatchlist,
        isLoading,
      }}
    >
      {children}
    </UserListsContext.Provider>
  );
}

/* ── Hook — throws if used outside UserListsProvider ── */
export function useUserLists(): UserListsContextValue {
  const ctx = useContext(UserListsContext);
  if (!ctx)
    throw new Error("useUserLists must be used inside UserListsProvider");
  return ctx;
}
// "use client";

// /* ============================================================
//    USER LISTS CONTEXT
//    Loads favorites and watchlist IDs once on mount (or on login).
//    All toggle operations update local state optimistically and
//    sync with Supabase in the background.
//    Supabase Realtime keeps all devices in sync instantly.
//    ============================================================ */

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
//   useRef,
//   ReactNode,
// } from "react";
// import { createClient } from "@/lib/supabase/client";
// import { useToast } from "@/hooks/useToast";

// /* ── Types ── */
// type MediaType = "movie" | "tv";

// interface ListItem {
//   tmdb_id: number;
//   media_type: MediaType;
// }

// interface UserListsContextValue {
//   /** Returns true if the given item is in favorites */
//   isFavorite: (tmdbId: number, mediaType: MediaType) => boolean;
//   /** Returns true if the given item is in watchlist */
//   isWatchlist: (tmdbId: number, mediaType: MediaType) => boolean;
//   /** Toggles favorite state. onRemoved is called after successful removal */
//   toggleFavorite: (
//     e: React.MouseEvent,
//     tmdbId: number,
//     mediaType: MediaType,
//     onRemoved?: () => void,
//   ) => Promise<void>;
//   /** Toggles watchlist state. onRemoved is called after successful removal */
//   toggleWatchlist: (
//     e: React.MouseEvent,
//     tmdbId: number,
//     mediaType: MediaType,
//     onRemoved?: () => void,
//   ) => Promise<void>;
//   /** True while the initial load from Supabase is in progress */
//   isLoading: boolean;
// }

// /* ── Context ── */
// const UserListsContext = createContext<UserListsContextValue | null>(null);

// /* ── Key helper — "12345:movie" for O(1) Set lookup ── */
// const toKey = (tmdbId: number, mediaType: MediaType): string =>
//   `${tmdbId}:${mediaType}`;

// /* ── Provider ── */
// export function UserListsProvider({ children }: { children: ReactNode }) {
//   const [favorites, setFavorites] = useState<Set<string>>(new Set());
//   const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
//   const [isLoading, setIsLoading] = useState(true);

//   const supabase = createClient();
//   const { toast } = useToast();
//   const userIdRef = useRef<string | null>(null);

//   /* ── Load all IDs from Supabase (IDs only, very lightweight) ── */
//   const loadLists = useCallback(async (userId: string): Promise<void> => {
//     const [{ data: favRows }, { data: watchRows }] = await Promise.all([
//       supabase
//         .from("favorites")
//         .select("tmdb_id, media_type")
//         .eq("user_id", userId),
//       supabase
//         .from("watchlist")
//         .select("tmdb_id, media_type")
//         .eq("user_id", userId),
//     ]);
//     setFavorites(
//       new Set(
//         (favRows ?? []).map((r: ListItem) => toKey(r.tmdb_id, r.media_type)),
//       ),
//     );
//     setWatchlist(
//       new Set(
//         (watchRows ?? []).map((r: ListItem) => toKey(r.tmdb_id, r.media_type)),
//       ),
//     );
//     setIsLoading(false);
//   }, []);

//   /* ── Supabase Realtime — keeps all devices in sync ── */
//   useEffect(() => {
//     const userId = userIdRef.current;
//     if (!userId) return;

//     const channel = supabase
//       .channel(`user-lists-${userId}`)

//       /* ── Favorites INSERT ── */
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "favorites",
//           filter: `user_id=eq.${userId}`,
//         },
//         (payload) => {
//           const { tmdb_id, media_type } = payload.new as ListItem;
//           setFavorites(
//             (prev) => new Set([...prev, toKey(tmdb_id, media_type)]),
//           );
//         },
//       )

//       /* ── Favorites DELETE ── */
//       .on(
//         "postgres_changes",
//         {
//           event: "DELETE",
//           schema: "public",
//           table: "favorites",
//           filter: `user_id=eq.${userId}`,
//         },
//         (payload) => {
//           const { tmdb_id, media_type } = payload.old as ListItem;
//           setFavorites((prev) => {
//             const next = new Set(prev);
//             next.delete(toKey(tmdb_id, media_type));
//             return next;
//           });
//         },
//       )

//       /* ── Watchlist INSERT ── */
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "watchlist",
//           filter: `user_id=eq.${userId}`,
//         },
//         (payload) => {
//           const { tmdb_id, media_type } = payload.new as ListItem;
//           setWatchlist(
//             (prev) => new Set([...prev, toKey(tmdb_id, media_type)]),
//           );
//         },
//       )

//       /* ── Watchlist DELETE ── */
//       .on(
//         "postgres_changes",
//         {
//           event: "DELETE",
//           schema: "public",
//           table: "watchlist",
//           filter: `user_id=eq.${userId}`,
//         },
//         (payload) => {
//           const { tmdb_id, media_type } = payload.old as ListItem;
//           setWatchlist((prev) => {
//             const next = new Set(prev);
//             next.delete(toKey(tmdb_id, media_type));
//             return next;
//           });
//         },
//       )

//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [userIdRef.current]);

//   /* ── Subscribe to auth state changes ── */
//   useEffect(() => {
//     supabase.auth.getUser().then(({ data: { user } }) => {
//       if (user) {
//         userIdRef.current = user.id;
//         loadLists(user.id);
//       } else {
//         setIsLoading(false);
//       }
//     });

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       const userId = session?.user?.id ?? null;
//       userIdRef.current = userId;
//       if (userId) {
//         setIsLoading(true);
//         loadLists(userId);
//       } else {
//         setFavorites(new Set());
//         setWatchlist(new Set());
//         setIsLoading(false);
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, [loadLists]);

//   /* ── Lookup helpers ── */
//   const isFavorite = useCallback(
//     (tmdbId: number, mediaType: MediaType): boolean =>
//       favorites.has(toKey(tmdbId, mediaType)),
//     [favorites],
//   );

//   const isWatchlist = useCallback(
//     (tmdbId: number, mediaType: MediaType): boolean =>
//       watchlist.has(toKey(tmdbId, mediaType)),
//     [watchlist],
//   );

//   /* ── Toggle favorite ── */
//   const toggleFavorite = useCallback(
//     async (
//       e: React.MouseEvent,
//       tmdbId: number,
//       mediaType: MediaType,
//       onRemoved?: () => void,
//     ): Promise<void> => {
//       e.stopPropagation();

//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) {
//         toast.warning("Accedi per aggiungere ai preferiti");
//         return;
//       }

//       const key = toKey(tmdbId, mediaType);
//       const wasInList = favorites.has(key);

//       setFavorites((prev) => {
//         const next = new Set(prev);
//         wasInList ? next.delete(key) : next.add(key);
//         return next;
//       });

//       if (wasInList) {
//         const { error } = await supabase
//           .from("favorites")
//           .delete()
//           .eq("user_id", user.id)
//           .eq("tmdb_id", tmdbId)
//           .eq("media_type", mediaType);
//         if (error) {
//           setFavorites((prev) => new Set([...prev, key]));
//           toast.error("Errore durante la rimozione dai preferiti");
//         } else {
//           onRemoved?.();
//         }
//       } else {
//         const { error } = await supabase
//           .from("favorites")
//           .insert({ user_id: user.id, tmdb_id: tmdbId, media_type: mediaType });
//         if (error) {
//           setFavorites((prev) => {
//             const next = new Set(prev);
//             next.delete(key);
//             return next;
//           });
//           toast.error("Errore durante l'aggiunta ai preferiti");
//         }
//       }
//     },
//     [favorites, supabase, toast],
//   );

//   /* ── Toggle watchlist ── */
//   const toggleWatchlist = useCallback(
//     async (
//       e: React.MouseEvent,
//       tmdbId: number,
//       mediaType: MediaType,
//       onRemoved?: () => void,
//     ): Promise<void> => {
//       e.stopPropagation();

//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) {
//         toast.warning("Accedi per aggiungere alla watchlist");
//         return;
//       }

//       const key = toKey(tmdbId, mediaType);
//       const wasInList = watchlist.has(key);

//       setWatchlist((prev) => {
//         const next = new Set(prev);
//         wasInList ? next.delete(key) : next.add(key);
//         return next;
//       });

//       if (wasInList) {
//         const { error } = await supabase
//           .from("watchlist")
//           .delete()
//           .eq("user_id", user.id)
//           .eq("tmdb_id", tmdbId)
//           .eq("media_type", mediaType);
//         if (error) {
//           setWatchlist((prev) => new Set([...prev, key]));
//           toast.error("Errore durante la rimozione dalla watchlist");
//         } else {
//           onRemoved?.();
//         }
//       } else {
//         const { error } = await supabase
//           .from("watchlist")
//           .insert({ user_id: user.id, tmdb_id: tmdbId, media_type: mediaType });
//         if (error) {
//           setWatchlist((prev) => {
//             const next = new Set(prev);
//             next.delete(key);
//             return next;
//           });
//           toast.error("Errore durante l'aggiunta alla watchlist");
//         }
//       }
//     },
//     [watchlist, supabase, toast],
//   );

//   return (
//     <UserListsContext.Provider
//       value={{
//         isFavorite,
//         isWatchlist,
//         toggleFavorite,
//         toggleWatchlist,
//         isLoading,
//       }}
//     >
//       {children}
//     </UserListsContext.Provider>
//   );
// }

// /* ── Hook — throws if used outside UserListsProvider ── */
// export function useUserLists(): UserListsContextValue {
//   const ctx = useContext(UserListsContext);
//   if (!ctx)
//     throw new Error("useUserLists must be used inside UserListsProvider");
//   return ctx;
// }

// "use client";

// /* ============================================================
//    USER LISTS CONTEXT
//    Loads favorites and watchlist IDs once on mount (or on login).
//    All toggle operations update local state optimistically and
//    sync with Supabase in the background.
//    ============================================================ */

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
//   useRef,
//   ReactNode,
// } from "react";
// import { createClient } from "@/lib/supabase/client";
// import { useToast } from "@/hooks/useToast";

// /* ── Types ── */
// type MediaType = "movie" | "tv";

// interface ListItem {
//   tmdb_id: number;
//   media_type: MediaType;
// }

// interface UserListsContextValue {
//   /** Returns true if the given item is in favorites */
//   isFavorite: (tmdbId: number, mediaType: MediaType) => boolean;
//   /** Returns true if the given item is in watchlist */
//   isWatchlist: (tmdbId: number, mediaType: MediaType) => boolean;
//   /** Toggles favorite state. onRemoved is called after successful removal */
//   toggleFavorite: (
//     e: React.MouseEvent,
//     tmdbId: number,
//     mediaType: MediaType,
//     onRemoved?: () => void,
//   ) => Promise<void>;
//   /** Toggles watchlist state. onRemoved is called after successful removal */
//   toggleWatchlist: (
//     e: React.MouseEvent,
//     tmdbId: number,
//     mediaType: MediaType,
//     onRemoved?: () => void,
//   ) => Promise<void>;
//   /** True while the initial load from Supabase is in progress */
//   isLoading: boolean;
// }

// /* ── Context ── */
// const UserListsContext = createContext<UserListsContextValue | null>(null);

// /* ── Key helper — "12345:movie" for O(1) Set lookup ── */
// const toKey = (tmdbId: number, mediaType: MediaType): string =>
//   `${tmdbId}:${mediaType}`;

// /* ── Provider ── */
// export function UserListsProvider({ children }: { children: ReactNode }) {
//   const [favorites, setFavorites] = useState<Set<string>>(new Set());
//   const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
//   const [isLoading, setIsLoading] = useState(true);

//   const supabase = createClient();
//   const { toast } = useToast();
//   const userIdRef = useRef<string | null>(null);

//   /* ── Load all IDs from Supabase (IDs only, very lightweight) ── */
//   const loadLists = useCallback(async (userId: string): Promise<void> => {
//     const [{ data: favRows }, { data: watchRows }] = await Promise.all([
//       supabase
//         .from("favorites")
//         .select("tmdb_id, media_type")
//         .eq("user_id", userId),
//       supabase
//         .from("watchlist")
//         .select("tmdb_id, media_type")
//         .eq("user_id", userId),
//     ]);

//     setFavorites(
//       new Set(
//         (favRows ?? []).map((r: ListItem) => toKey(r.tmdb_id, r.media_type)),
//       ),
//     );
//     setWatchlist(
//       new Set(
//         (watchRows ?? []).map((r: ListItem) => toKey(r.tmdb_id, r.media_type)),
//       ),
//     );
//     setIsLoading(false);
//   }, []);

//   /* ── Subscribe to auth state changes ── */
//   useEffect(() => {
//     supabase.auth.getUser().then(({ data: { user } }) => {
//       if (user) {
//         userIdRef.current = user.id;
//         loadLists(user.id);
//       } else {
//         setIsLoading(false);
//       }
//     });

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       const userId = session?.user?.id ?? null;
//       userIdRef.current = userId;
//       if (userId) {
//         setIsLoading(true);
//         loadLists(userId);
//       } else {
//         setFavorites(new Set());
//         setWatchlist(new Set());
//         setIsLoading(false);
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, [loadLists]);

//   /* ── Lookup helpers ── */
//   const isFavorite = useCallback(
//     (tmdbId: number, mediaType: MediaType): boolean =>
//       favorites.has(toKey(tmdbId, mediaType)),
//     [favorites],
//   );

//   const isWatchlist = useCallback(
//     (tmdbId: number, mediaType: MediaType): boolean =>
//       watchlist.has(toKey(tmdbId, mediaType)),
//     [watchlist],
//   );

//   /* ── Toggle favorite ── */
//   const toggleFavorite = useCallback(
//     async (
//       e: React.MouseEvent,
//       tmdbId: number,
//       mediaType: MediaType,
//       onRemoved?: () => void,
//     ): Promise<void> => {
//       e.stopPropagation();

//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) {
//         toast.warning("Accedi per aggiungere ai preferiti");
//         return;
//       }

//       const key = toKey(tmdbId, mediaType);
//       const wasInList = favorites.has(key);

//       setFavorites((prev) => {
//         const next = new Set(prev);
//         wasInList ? next.delete(key) : next.add(key);
//         return next;
//       });

//       if (wasInList) {
//         const { error } = await supabase
//           .from("favorites")
//           .delete()
//           .eq("user_id", user.id)
//           .eq("tmdb_id", tmdbId)
//           .eq("media_type", mediaType);
//         if (error) {
//           setFavorites((prev) => new Set([...prev, key]));
//           toast.error("Errore durante la rimozione dai preferiti");
//         } else {
//           onRemoved?.();
//         }
//       } else {
//         const { error } = await supabase
//           .from("favorites")
//           .insert({ user_id: user.id, tmdb_id: tmdbId, media_type: mediaType });
//         if (error) {
//           setFavorites((prev) => {
//             const next = new Set(prev);
//             next.delete(key);
//             return next;
//           });
//           toast.error("Errore durante l'aggiunta ai preferiti");
//         }
//       }
//     },
//     [favorites, supabase, toast],
//   );

//   /* ── Toggle watchlist ── */
//   const toggleWatchlist = useCallback(
//     async (
//       e: React.MouseEvent,
//       tmdbId: number,
//       mediaType: MediaType,
//       onRemoved?: () => void,
//     ): Promise<void> => {
//       e.stopPropagation();

//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) {
//         toast.warning("Accedi per aggiungere alla watchlist");
//         return;
//       }

//       const key = toKey(tmdbId, mediaType);
//       const wasInList = watchlist.has(key);

//       setWatchlist((prev) => {
//         const next = new Set(prev);
//         wasInList ? next.delete(key) : next.add(key);
//         return next;
//       });

//       if (wasInList) {
//         const { error } = await supabase
//           .from("watchlist")
//           .delete()
//           .eq("user_id", user.id)
//           .eq("tmdb_id", tmdbId)
//           .eq("media_type", mediaType);
//         if (error) {
//           setWatchlist((prev) => new Set([...prev, key]));
//           toast.error("Errore durante la rimozione dalla watchlist");
//         } else {
//           onRemoved?.();
//         }
//       } else {
//         const { error } = await supabase
//           .from("watchlist")
//           .insert({ user_id: user.id, tmdb_id: tmdbId, media_type: mediaType });
//         if (error) {
//           setWatchlist((prev) => {
//             const next = new Set(prev);
//             next.delete(key);
//             return next;
//           });
//           toast.error("Errore durante l'aggiunta alla watchlist");
//         }
//       }
//     },
//     [watchlist, supabase, toast],
//   );

//   return (
//     <UserListsContext.Provider
//       value={{
//         isFavorite,
//         isWatchlist,
//         toggleFavorite,
//         toggleWatchlist,
//         isLoading,
//       }}
//     >
//       {children}
//     </UserListsContext.Provider>
//   );
// }

// /* ── Hook — throws if used outside UserListsProvider ── */
// export function useUserLists(): UserListsContextValue {
//   const ctx = useContext(UserListsContext);
//   if (!ctx)
//     throw new Error("useUserLists must be used inside UserListsProvider");
//   return ctx;
// }
