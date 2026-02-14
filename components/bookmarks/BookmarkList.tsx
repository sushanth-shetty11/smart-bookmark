import BookmarkItem from "./BookmarkItem";
import EmptyState from "../layout/EmptyState";
import type { Bookmark } from "../../lib/types";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onUpdate: (id: string, title: string, url: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function BookmarkList({ bookmarks, onUpdate, onDelete }: BookmarkListProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Bookmarks</h2>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Bookmarks</h2>
      <div className="space-y-2">
        {bookmarks.map((bookmark) => (
          <BookmarkItem
            key={bookmark.id}
            bookmark={bookmark}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
