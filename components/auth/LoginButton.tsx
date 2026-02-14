"use client";

import { supabase } from "../../lib/supabaseClient";

export default function LoginButton() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <button
      onClick={handleLogin}
      className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md transition-all font-medium text-base"
    >
      <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_17_40)">
          <path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.704H24.48v9.12h13.008c-.56 2.96-2.24 5.456-4.768 7.144v5.92h7.712c4.52-4.16 7.1-10.288 7.1-17.48z" fill="#4285F4"/>
          <path d="M24.48 48c6.48 0 11.92-2.144 15.888-5.832l-7.712-5.92c-2.144 1.44-4.88 2.288-8.176 2.288-6.288 0-11.616-4.256-13.528-9.968H2.56v6.16C6.52 43.36 14.016 48 24.48 48z" fill="#34A853"/>
          <path d="M10.952 28.568A14.88 14.88 0 0 1 9.6 24c0-1.584.28-3.128.784-4.568v-6.16H2.56A23.98 23.98 0 0 0 0 24c0 3.92.944 7.624 2.56 10.728l8.392-6.16z" fill="#FBBC05"/>
          <path d="M24.48 9.52c3.528 0 6.656 1.216 9.136 3.6l6.832-6.832C36.392 2.144 30.96 0 24.48 0 14.016 0 6.52 4.64 2.56 13.272l8.392 6.16c1.912-5.712 7.24-9.968 13.528-9.968z" fill="#EA4335"/>
        </g>
        <defs>
          <clipPath id="clip0_17_40">
            <path fill="#fff" d="M0 0h48v48H0z"/>
          </clipPath>
        </defs>
      </svg>
      Continue with Google
    </button>
  );
}
