import React, { useEffect, useState } from "react";
import { meApi } from "../services/UserApi";
import NavBar from "./NavBar";
import { handleLogout, reissueToken } from "../utils/Auth";

export function Home() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const fetchUser = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await meApi(accessToken);

      if (res.status === 401) {
        setIsLoggedIn(false);
        await reissueToken(fetchUser);
        return;
      }

      const data = await res.json();
      setUsername(data.username);
      setRole(data.role);
      setIsLoggedIn(true);
    } catch (e: unknown) {
      setIsLoggedIn(false);
      console.error('사용자 정보 가져오기 실패', e);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setIsLoggedIn(false);
      return;
    }
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-blue-gradient flex items-center justify-center">
      <NavBar />
      <div className="bg-white rounded-md shadow-md px-10 py-12 w-full max-w-md text-center">
        {isLoggedIn === null && (
          <>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
              <div className="h-9 bg-gray-300 rounded w-full mb-10"></div>
            </div>
          </>
        )}

        {isLoggedIn === true && (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              환영합니다 <span className="text-[#6C4BA3]">{username}</span>
            </h2>
            <p className="text-sm text-gray-600 mb-8">
              권한: <span className="font-medium point-color">{role}</span>
            </p>
            <button
              onClick={handleLogout}
              className="w-full btn-secondary text-sm py-2 rounded transition mb-10"
            >
              로그아웃
            </button>
          </>
        )}

        {isLoggedIn === false && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">비회원입니다</h2>
            <p className="text-sm text-gray-600 mb-6">
              로그인 없이도 서비스를 이용하실 수 있어요.
            </p>
            <a
              href="/login"
              className="inline-block mb-10 text-sm font-medium text-[#7C4DCC] hover:text-[#5A4E8D] transition"
            >
              👉 로그인하러 가기
            </a>
          </>
        )}

        {/* 공통 서비스 영역 */}
        <div className="text-left">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">🛠 이용 가능한 서비스</h3>
          <div className="flex flex-col gap-2">
            <a
              href="/news"
              className="block w-full btn-primary text-sm font-medium py-2 px-4 rounded-md text-center transition"
            >
              📰 뉴스 요약 분석기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
