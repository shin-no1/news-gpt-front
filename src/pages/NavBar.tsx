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
      {/* 좌측 로고 및 메뉴 */}
      <div className="flex items-center gap-6 text-sm">
        <a href="/" className="point-color font-bold text-lg">
          NewsGPT
        </a>
        <a href="/" className="text-gray-700 hover:underline">
          Home
        </a>
        <a href="/about" className="text-gray-700 hover:underline">
          About
        </a>
        <a href="/news" className="text-gray-700 hover:underline">
          News 요약
        </a>
      </div>

      {/* 우측 유저 관련 메뉴 */}
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
