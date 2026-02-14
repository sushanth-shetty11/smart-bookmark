"use client";

import { useState } from "react";
import { isValidUrl } from "../../lib/utils";

interface BookmarkFormProps {
  onSubmit: (title: string, url: string) => Promise<void>;
}

export default function BookmarkForm({ onSubmit }: BookmarkFormProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const urlHasError = url.length > 0 && !isValidUrl(url);
  const isFormValid = title.trim().length > 0 && url.length > 0 && isValidUrl(url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(title, url);
      setTitle("");
      setUrl("");
    } catch (error) {
      console.error("Failed to add bookmark:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Bookmark</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>
        <div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 ${
              urlHasError
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {urlHasError && (
            <p className="text-red-600 text-xs mt-1">Please enter a valid URL.</p>
          )}
        </div>
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md transition ${
            isFormValid && !isSubmitting
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Adding..." : "Add Bookmark"}
        </button>
      </form>
    </div>
  );
}
