import { useEffect, useState } from 'react';
import { handleLogout } from '../utils/Auth'

export default function NavBar() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log(token);
    const userIdFromStorage = localStorage.getItem('userId');
    console.log(userIdFromStorage);
    if (token && userIdFromStorage) {
      setUserId(userIdFromStorage);
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm px-6 py-3 flex justify-between items-center">
      <a href="/" className="point-color font-bold text-lg">
        NewsGPT
      </a>
      <div className="flex items-center gap-4 text-sm">
        {userId ? (
          <>
            <span className="text-gray-700">👤 {userId}</span>
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
