import { useEffect, useState } from 'react';
import { handleLogout } from '../utils/Auth'

export default function NavBar() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const usernameFromStorage = localStorage.getItem('username');
    if (token && usernameFromStorage) {
      setUsername(usernameFromStorage);
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm px-6 py-3 flex justify-between items-center">
      <a href="/" className="point-color font-bold text-lg">
        NewsGPT
      </a>
      <div className="flex items-center gap-4 text-sm">
        {username ? (
          <>
            <span
              className="text-gray-700 cursor-pointer hover:underline"
              onClick={() => (window.location.href = '/me')}
            >
              👤 {username}
            </span>
            <button
              onClick={handleLogout}
              className="point-color hover:underline"
            >
              로그아웃
            </button>
          </>
        ) : (
          <a href="/login" className="point-color hover:underline">
            로그인
          </a>
        )}
      </div>
    </nav>
  );
}
