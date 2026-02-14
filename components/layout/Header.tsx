import LogoutButton from "../auth/LogoutButton";

interface HeaderProps {
  userEmail?: string;
}

export default function Header({ userEmail }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
          <h1 className="text-xl font-bold text-gray-900">Smart Bookmark</h1>
        </div>

        <div className="flex items-center gap-4">
          {userEmail && (
            <span className="text-sm text-gray-600 hidden sm:block">{userEmail}</span>
          )}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
