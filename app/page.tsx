"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../hooks/useSession";
import LoginButton from "../components/auth/LoginButton";

export default function LandingPage() {
  const router = useRouter();
  const { session, loading } = useSession();

  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (!loading && session) {
      router.push("/dashboard");
    }

	
  }, [session, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (session) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex flex-col items-center space-y-8 max-w-md w-full">
        {/* Logo */}
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
          </svg>
        </div>

        {/* Title & Subtitle */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Smart Bookmark
          </h1>
          <p className="text-lg text-gray-600">
            A simple, real-time bookmark manager
          </p>
        </div>

        {/* Login Button */}
        <LoginButton />

        {/* Footer text */}
        <p className="text-sm text-gray-500 text-center">
          Your bookmarks sync instantly across devices
        </p>
      </div>
    </div>
  );
}
