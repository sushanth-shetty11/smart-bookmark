"use client";

import { useState } from "react";
import { isValidUrl } from "../../lib/utils";
import type { Bookmark } from "../../lib/types";

interface BookmarkItemProps {
  bookmark: Bookmark;
  onUpdate: (id: string, title: string, url: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function BookmarkItem({ bookmark, onUpdate, onDelete }: BookmarkItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(bookmark.title);
  const [editUrl, setEditUrl] = useState(bookmark.url);

  const urlHasError = editUrl.length > 0 && !isValidUrl(editUrl);
  const isFormValid = editTitle.trim().length > 0 && editUrl.length > 0 && isValidUrl(editUrl);

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(bookmark.title);
    setEditUrl(bookmark.url);
  };

  const handleSave = async () => {
    if (!isFormValid) return;

    try {
      await onUpdate(bookmark.id, editTitle, editUrl);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(bookmark.title);
    setEditUrl(bookmark.url);
  };

  const handleDelete = async () => {
    try {
      await onDelete(bookmark.id);
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  if (isEditing) {
    return (
      <div className="border border-gray-200 rounded-md p-4 bg-white">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Title"
          />
          <div>
            <input
              type="text"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 ${
                urlHasError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="URL"
            />
            {urlHasError && (
              <p className="text-red-600 text-xs mt-1">Please enter a valid URL.</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!isFormValid}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition ${
                isFormValid
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 mb-1 truncate">{bookmark.title}</h3>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm break-all"
          >
            {bookmark.url}
          </a>
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={handleEdit}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
            aria-label="Edit bookmark"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition"
            aria-label="Delete bookmark"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
