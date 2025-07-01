import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../services/AuthApi'
import { getDeviceId } from '../utils/Auth';

export function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const deviceId = getDeviceId();
      const res = await loginApi(userId, password, deviceId);

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || '알 수 없는 오류가 발생했습니다.');
        return;
      }

      const data = await res.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userId', data.userId);
      navigate('/'); // 성공할 때만 이동
    } catch {
      alert('로그인 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-blue-gradient flex items-center justify-center">
      <div className="bg-white w-full max-w-sm rounded-md px-8 py-10 text-center">
        <div className="mb-6">
          <div className="text-[32px] font-bold point-color mb-1">NewsGPT</div>
          <h2 className="text-sm text-gray-600">Log in to your account</h2>
        </div>

        <div className="space-y-4 text-left">
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8661C1]"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">👤</span>
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8661C1]"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">🔒</span>
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full mt-6 btn-primary text-sm py-2 rounded focus:outline-none"
        >
          Log In
        </button>

        {error && <p className="text-red-500 text-xs mt-3">{error}</p>}

        {/*<div className="flex justify-between text-xs text-[#8661C1] mt-4">*/}
        {/*  <a href="#" className="hover:underline">Log in via SSO</a>*/}
        {/*  <a href="#" className="hover:underline">Forgot your password?</a>*/}
        {/*</div>*/}

        <div className="text-xs text-gray-500 mt-6">
          New to NewsGPT?{' '}
          <a href="/signup" className="point-color font-medium hover:underline">Sign Up</a>
        </div>
      </div>
    </div>
  );
}

// export function HomePage() {
//   const [userId, setUserId] = useState('');
//   const [role, setRole] = useState('');
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
//
//   const fetchUser = async () => {
//     try {
//       const accessToken = localStorage.getItem('accessToken');
//       const res = await meApi(accessToken);
//
//       if (res.status === 401) {
//         setIsLoggedIn(false);
//         console.log("fetchUser ERROR")
//         await reissueToken(fetchUser);
//         return;
//       }
//
//       const data = await res.json();
//       setUserId(data.userId);
//       setRole(data.role);
//       setIsLoggedIn(true);
//     } catch (e: unknown) {
//       setIsLoggedIn(false);
//       console.error('사용자 정보 가져오기 실패', e);
//     }
//   };
//
//   useEffect(() => {
//     const accessToken = localStorage.getItem('accessToken');
//     if (!accessToken) {
//       setIsLoggedIn(false);
//       return;
//     }
//     fetchUser();
//   }, []);
//
//   return (
//     <div className="min-h-screen bg-blue-gradient flex items-center justify-center">
//       <NavBar />
//       <div className="bg-white rounded-md shadow-md px-10 py-12 w-full max-w-md text-center">
//         {isLoggedIn === true && (
//           <>
//             <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//               환영합니다 <span className="text-[#6C4BA3]">{userId}</span>
//             </h2>
//             <p className="text-sm text-gray-600 mb-8">
//               권한: <span className="font-medium text-[#8661C1]">{role}</span>
//             </p>
//             <button
//               onClick={handleLogout}
//               className="w-full bg-[#8661C1] hover:bg-[#7551AF] text-white text-sm py-2 rounded transition mb-10"
//             >
//               로그아웃
//             </button>
//           </>
//         )}
//
//         {isLoggedIn === false && (
//           <>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">비회원입니다</h2>
//             <p className="text-sm text-gray-600 mb-6">
//               로그인 없이도 서비스를 이용하실 수 있어요.
//             </p>
//             <a
//               href="/login"
//               className="inline-block mb-10 text-sm text-[#8661C1] font-medium hover:underline"
//             >
//               👉 로그인하러 가기
//             </a>
//           </>
//         )}
//
//         {/* 공통 서비스 영역 */}
//         <div className="text-left">
//           <h3 className="text-sm font-semibold text-gray-600 mb-2">🛠 이용 가능한 서비스</h3>
//           <div className="flex flex-col gap-2">
//             <a
//               href="/news"
//               className="block w-full bg-[#F2EDFB] hover:bg-[#E5DBFA] text-[#5A4E8D] text-sm font-medium py-2 px-4 rounded-md text-center transition"
//             >
//               📰 뉴스 요약 분석기
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
//
// async function reissueToken(retryCallback?: () => void) {
//   try {
//     const refreshToken = localStorage.getItem('refreshToken');
//     const deviceId = getDeviceId();
//     const res = await reissueApi(refreshToken, deviceId);
//
//     if (!res.ok) {
//       const data = await res.json();
//       throw new Error(data.message || '알 수 없는 오류가 발생했습니다.');
//     }
//
//     const data = await res.json();
//     localStorage.setItem('accessToken', data.accessToken);
//     localStorage.setItem('refreshToken', data.refreshToken);
//
//     if (retryCallback) retryCallback(); // 토큰 재발급 성공했을 때만 재시도
//   } catch {
//     alert('세션이 만료되어 로그인 페이지로 이동합니다.');
//     localStorage.clear();
//     window.location.href = '/';
//   }
// }
