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
import { Movie } from "@/types/movie";

/* ── Types ── */
type MediaType = "movie" | "tv";

interface ListItem {
  tmdb_id: number;
  media_type: MediaType;
}

interface UserListsContextValue {
  isFavorite: (tmdbId: number, mediaType: MediaType) => boolean;
  isWatchlist: (tmdbId: number, mediaType: MediaType) => boolean;
  toggleFavorite: (
    e: React.MouseEvent,
    tmdbId: number,
    mediaType: MediaType,
    onRemoved?: () => void,
  ) => Promise<void>;
  toggleWatchlist: (
    e: React.MouseEvent,
    tmdbId: number,
    mediaType: MediaType,
    onRemoved?: () => void,
  ) => Promise<void>;
  isLoading: boolean;
  /** Register a callback fired when a favorite is added on another device */
  setOnFavoriteInsert: (cb: ((movie: Movie) => void) | null) => void;
  /** Register a callback fired when a watchlist item is added on another device */
  setOnWatchlistInsert: (cb: ((movie: Movie) => void) | null) => void;
}

/* ── Context ── */
const UserListsContext = createContext<UserListsContextValue | null>(null);

/* ── Key helper — "12345:movie" for O(1) Set lookup ── */
const toKey = (tmdbId: number, mediaType: MediaType): string =>
  `${tmdbId}:${mediaType}`;

/* ── Fetch a single movie/serie via API route and convert to Movie ── */
async function fetchMovieById(
  tmdbId: number,
  mediaType: MediaType,
): Promise<Movie | null> {
  try {
    const type = mediaType === "movie" ? "movie" : "tv";
    const res = await fetch(`/api/detail?id=${tmdbId}&type=${type}&full=true`);
    const data = await res.json();

    return {
      id: tmdbId,
      title: data.title ?? "",
      type: mediaType === "movie" ? "film" : "serie",
      poster: data.poster_path ?? null,
      backdrop: data.backdrop_path ?? null,
      year: new Date(data.release_date ?? "").getFullYear() || 0,
      rating: data.vote_average ?? 0,
      genre: (data.genres ?? []).map((g: { name: string }) => g.name),
      plot: data.overview ?? "",
      director: "",
      cast: [],
      awards: [],
      upcoming: false,
      trailerKey: null,
      runtime: data.runtime,
      numberOfSeasons: data.number_of_seasons,
      numberOfEpisodes: data.number_of_episodes,
    };
  } catch {
    return null;
  }
}

/* ── Provider ── */
export function UserListsProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();
  const { toast } = useToast();
  const userIdRef = useRef<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  /* ── Insert callbacks — registered by FavoritesGrid / WatchlistGrid ── */
  const onFavoriteInsertRef = useRef<((movie: Movie) => void) | null>(null);
  const onWatchlistInsertRef = useRef<((movie: Movie) => void) | null>(null);

  const setOnFavoriteInsert = useCallback(
    (cb: ((movie: Movie) => void) | null) => {
      onFavoriteInsertRef.current = cb;
    },
    [],
  );
  const setOnWatchlistInsert = useCallback(
    (cb: ((movie: Movie) => void) | null) => {
      onWatchlistInsertRef.current = cb;
    },
    [],
  );

  /* ── Load all IDs from Supabase ── */
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

  /* ── Realtime subscription ── */
  const subscribeRealtime = useCallback(
    (userId: string) => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);

      channelRef.current = supabase
        .channel(`user-lists-${userId}`)

        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "favorites" },
          async (payload) => {
            const row = payload.new as ListItem & { user_id: string };
            /* ── Update Set ── */
            setFavorites(
              (prev) => new Set([...prev, toKey(row.tmdb_id, row.media_type)]),
            );
            /* ── Notify FavoritesGrid if registered ── */
            if (onFavoriteInsertRef.current) {
              const movie = await fetchMovieById(row.tmdb_id, row.media_type);
              if (movie) onFavoriteInsertRef.current(movie);
            }
          },
        )

        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "favorites" },
          () => {
            loadLists(userId);
          },
        )

        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "watchlist" },
          async (payload) => {
            const row = payload.new as ListItem & { user_id: string };
            setWatchlist(
              (prev) => new Set([...prev, toKey(row.tmdb_id, row.media_type)]),
            );
            if (onWatchlistInsertRef.current) {
              const movie = await fetchMovieById(row.tmdb_id, row.media_type);
              if (movie) onWatchlistInsertRef.current(movie);
            }
          },
        )

        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "watchlist" },
          () => {
            loadLists(userId);
          },
        )

        .subscribe();
    },
    [supabase, loadLists],
  );

  /* ── Auth state changes ── */
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
        setOnFavoriteInsert,
        setOnWatchlistInsert,
      }}
    >
      {children}
    </UserListsContext.Provider>
  );
}

/* ── Hook ── */
export function useUserLists(): UserListsContextValue {
  const ctx = useContext(UserListsContext);
  if (!ctx)
    throw new Error("useUserLists must be used inside UserListsProvider");
  return ctx;
}
