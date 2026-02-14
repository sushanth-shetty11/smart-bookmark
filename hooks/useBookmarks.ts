"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import * as bookmarkService from "../lib/bookmarkService";
import type { Bookmark, BookmarkInsert, BookmarkUpdate } from "../lib/types";

/**
 * Single hook for bookmark state, CRUD, and realtime sync.
 * - Fetches once when userId is available
 * - Subscribes to INSERT / UPDATE / DELETE via Supabase realtime
 * - Cleans up channel on logout or unmount
 * - Prevents duplicate rows on INSERT
 */
export function useBookmarks(userId: string | undefined) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── fetch + realtime subscription, keyed on userId ──
  useEffect(() => {
    if (!userId) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    // 1. Initial fetch
    setLoading(true);
    bookmarkService
      .fetchBookmarks()
      .then((data) => {
        if (!cancelled) {
          setBookmarks(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to fetch bookmarks:", err);
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // 2. Realtime channel (unique name per user prevents collisions)
    const channel = supabase
      .channel(`bookmarks-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const incoming = payload.new as Bookmark;
          // Deduplicate: skip if we already have this id
          setBookmarks((prev) =>
            prev.some((b) => b.id === incoming.id)
              ? prev
              : [incoming, ...prev]
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const updated = payload.new as Bookmark;
          setBookmarks((prev) =>
            prev.map((b) => (b.id === updated.id ? updated : b))
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
          // No filter — DELETE events only have payload.old, which Supabase filters ignore
        },
        (payload) => {
          const deletedId = (payload.old as { id: string }).id;
          setBookmarks((prev) => prev.filter((b) => b.id !== deletedId));
        }
      )
      .subscribe();

    // 3. Cleanup on userId change or unmount
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // ── CRUD wrappers (call service, realtime updates state) ──

  const addBookmark = useCallback(
    async (bookmark: BookmarkInsert) => {
      await bookmarkService.insertBookmark(bookmark);
    },
    []
  );

  const editBookmark = useCallback(
    async (id: string, updates: BookmarkUpdate) => {
      // Optimistic: apply immediately so UI feels instant
      setBookmarks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
      );
      try {
        await bookmarkService.updateBookmark(id, updates);
        // Realtime UPDATE will reconcile with server data
      } catch (err) {
        // Revert on failure — re‑fetch for clean state
        const data = await bookmarkService.fetchBookmarks();
        setBookmarks(data);
        throw err;
      }
    },
    []
  );

  const removeBookmark = useCallback(
    async (id: string) => {
      // Optimistic: remove from UI immediately
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      try {
        await bookmarkService.deleteBookmark(id);
        // Realtime DELETE will confirm across other tabs
      } catch (err) {
        // Refetch from DB on failure — never restore a stale snapshot
        const data = await bookmarkService.fetchBookmarks();
        setBookmarks(data);
        throw err;
        
      }
    },
    []
  );

  return {
    bookmarks,
    loading,
    error,
    addBookmark,
    editBookmark,
    removeBookmark,
  };
}
