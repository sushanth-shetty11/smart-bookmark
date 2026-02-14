import { supabase } from "./supabaseClient";
import type { Bookmark, BookmarkInsert, BookmarkUpdate } from "./types";

/**
 * All Supabase database operations for bookmarks.
 * Only this file should call supabase.from("bookmarks").
 */

export async function fetchBookmarks(): Promise<Bookmark[]> {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("id, title, url, user_id, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Bookmark[];
}

export async function insertBookmark(bookmark: BookmarkInsert): Promise<Bookmark> {
  const { data, error } = await supabase
    .from("bookmarks")
    .insert(bookmark)
    .select()
    .single();

  if (error) throw error;
  return data as Bookmark;
}

export async function updateBookmark(id: string, updates: BookmarkUpdate): Promise<Bookmark> {
  const { data, error } = await supabase
    .from("bookmarks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Bookmark;
}

export async function deleteBookmark(id: string): Promise<void> {
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
