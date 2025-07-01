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