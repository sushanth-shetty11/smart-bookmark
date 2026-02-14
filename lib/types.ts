export interface Bookmark {
  id: string;
  title: string;
  url: string;
  user_id: string;
  created_at: string;
}

export interface BookmarkInsert {
  title: string;
  url: string;
}

export interface BookmarkUpdate {
  title?: string;
  url?: string;
}
