"use client";

import { supabase } from "../../lib/supabaseClient";

export default function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition"
    >
      Logout
    </button>
  );
}
