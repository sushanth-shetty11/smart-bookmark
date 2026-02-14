"use client";

import { useSession } from "../../hooks/useSession";
import { useBookmarks } from "../../hooks/useBookmarks";
import Header from "../../components/layout/Header";
import Container from "../../components/layout/Container";
import BookmarkForm from "../../components/bookmarks/BookmarkForm";
import BookmarkList from "../../components/bookmarks/BookmarkList";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { session, loading: sessionLoading } = useSession();
  const {
    bookmarks,
    loading: bookmarksLoading,
    addBookmark,
    editBookmark,
    removeBookmark,
  } = useBookmarks(session?.user?.id);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!sessionLoading && !session) {
      router.push("/");
    }
  }, [session, sessionLoading, router]);

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleAddBookmark = async (title: string, url: string) => {
    await addBookmark({ title, url });
  };

  const handleUpdateBookmark = async (id: string, title: string, url: string) => {
    await editBookmark(id, { title, url });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userEmail={session.user.email} />
      <Container>
        <BookmarkForm onSubmit={handleAddBookmark} />
        {bookmarksLoading ? (
          <div className="text-center py-8 text-gray-600">Loading bookmarks...</div>
        ) : (
          <BookmarkList
            bookmarks={bookmarks}
            onUpdate={handleUpdateBookmark}
            onDelete={removeBookmark}
          />
        )}
      </Container>
    </div>
  );
}
