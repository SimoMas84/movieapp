"use client";

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

/* ============================================================
   TYPES
   ============================================================ */

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
  /**
   * Toggles favorite state for an item.
   * onRemoved is called after successful removal (used by FavoritesGrid).
   */
  toggleFavorite: (
    e: React.MouseEvent,
    tmdbId: number,
    mediaType: MediaType,
    onRemoved?: () => void,
  ) => Promise<void>;
  /**
   * Toggles watchlist state for an item.
   * onRemoved is called after successful removal (used by WatchlistGrid).
   */
  toggleWatchlist: (
    e: React.MouseEvent,
    tmdbId: number,
    mediaType: MediaType,
    onRemoved?: () => void,
  ) => Promise<void>;
  /** True while the initial load from Supabase is in progress */
  isLoading: boolean;
}

/* ============================================================
   CONTEXT
   ============================================================ */

const UserListsContext = createContext<UserListsContextValue | null>(null);

/* ============================================================
   HELPERS
   A Set of strings like "12345:movie" for O(1) lookup.
   ============================================================ */

const toKey = (tmdbId: number, mediaType: MediaType): string =>
  `${tmdbId}:${mediaType}`;

/* ============================================================
   PROVIDER
   Loads favorites and watchlist IDs once on mount (or on login).
   All toggle operations update local state optimistically and
   sync with Supabase in the background.
   ============================================================ */

export function UserListsProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const supabase = createClient();
  const { toast } = useToast();

  /* ── Keep a stable ref to the current user id ── */
  const userIdRef = useRef<string | null>(null);

  /* ── Load all IDs from Supabase (only IDs, very lightweight) ── */
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

  /* ── Subscribe to auth state changes ── */
  useEffect(() => {
    /* Check current session immediately */
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        userIdRef.current = user.id;
        loadLists(user.id);
      } else {
        setIsLoading(false);
      }
    });

    /* Listen for login / logout */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const userId = session?.user?.id ?? null;
      userIdRef.current = userId;

      if (userId) {
        setIsLoading(true);
        loadLists(userId);
      } else {
        /* User logged out — clear lists */
        setFavorites(new Set());
        setWatchlist(new Set());
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadLists]);

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

      /* Optimistic update */
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
          /* Revert on error */
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
          /* Revert on error */
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

      /* Optimistic update */
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
          /* Revert on error */
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
          /* Revert on error */
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

/* ============================================================
   HOOK
   Throws if used outside UserListsProvider.
   ============================================================ */

export function useUserLists(): UserListsContextValue {
  const ctx = useContext(UserListsContext);
  if (!ctx) {
    throw new Error("useUserLists must be used inside UserListsProvider");
  }
  return ctx;
}
