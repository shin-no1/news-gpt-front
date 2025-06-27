import { useState, useEffect } from 'react';
import { sendEmailCodeApi, verifyEmailCodeApi, signupApi } from '../services/api';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [nicknameValid, setNicknameValid] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const isEmailValid = (email: string) =>
    email.endsWith('@kakao.com') || email.endsWith('@naver.com');

  const isPasswordValid = (pw: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pw);
  };

  const isNicknameValid = (name: string) => {
    const regex = /^[a-zA-Z0-9_]{3,16}$/;
    return regex.test(name);
  };

  useEffect(() => {
    setPasswordValid(isPasswordValid(password));
    setPasswordsMatch(password === passwordConfirm);
    setNicknameValid(isNicknameValid(nickname));
  }, [password, passwordConfirm, nickname]);

  useEffect(() => {
    if (resendTimer > 0 && !codeVerified) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer, codeVerified]);

  const sendEmailCode = async () => {
    if (isSending || codeVerified || resendTimer > 0) return;

    if (!isEmailValid(email)) {
      alert('이메일은 naver.com 또는 kakao.com 도메인만 사용 가능합니다.');
      return;
    }

    setIsSending(true);
    try {
      const res = await sendEmailCodeApi(email);
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || '알 수 없는 오류가 발생했습니다.');
        return;
      }
      alert('인증번호가 이메일로 발송되었습니다.');
      setCodeSent(true);
      setResendTimer(120);
    } catch {
      alert('이메일 인증번호 발송 실패');
    } finally {
      setIsSending(false);
    }
  };

  const verifyEmailCode = async () => {
    try {
      const res = await verifyEmailCodeApi(email, emailCode);
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || '알 수 없는 오류가 발생했습니다.');
        return;
      }
      setCodeVerified(true);
      setVerificationError('');
      setResendTimer(0);
      alert('이메일 인증 완료');
    } catch {
      setCodeVerified(false);
      setVerificationError('인증번호가 올바르지 않습니다.');
    }
  };

  const handleSignup = async () => {
    if (!nickname || !email || !password || !passwordConfirm) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    if (!nicknameValid) {
      alert('아이디 형식을 확인해주세요.');
      return;
    }
    if (!passwordValid) {
      alert('비밀번호 형식을 확인해주세요.');
      return;
    }
    if (!passwordsMatch) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!codeVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }

    try {
      const res = await signupApi(email, nickname, password);
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || '알 수 없는 오류가 발생했습니다.');
        return;
      }
      alert('회원가입이 완료되었습니다!');
    } catch {
      alert('회원가입 실패');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">회원가입</h2>

      <input
        className="w-full mb-1 px-4 py-2 border rounded"
        placeholder="아이디 (닉네임)"
        value={nickname}
        onChange={(e) => setNickname(e.target.value.replace(/\s/g, ''))}
      />
      <p className={`text-sm mb-3 ${nickname ? (nicknameValid ? 'text-green-600' : 'text-red-500') : 'text-gray-400'}`}>
        {nickname ? (nicknameValid ? '사용 가능한 아이디입니다.' : '아이디는 영문, 숫자, 밑줄(_) 조합 3~16자여야 합니다.') : '아이디를 입력해주세요.'}
      </p>

      <input
        className="w-full mb-1 px-4 py-2 border rounded"
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <p className={`text-sm mb-2 ${password ? (passwordValid ? 'text-green-600' : 'text-red-500') : 'text-gray-400'}`}>
        {password ? (passwordValid ? '' : '비밀번호는 영문 + 숫자 + 특수문자(@$!%*?&) 조합 8자 이상이어야 합니다.') : '비밀번호를 입력해주세요.'}
      </p>

      <input
        className="w-full mb-1 px-4 py-2 border rounded"
        type="password"
        placeholder="비밀번호 확인"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
      />
      <p className={`text-sm mb-3 ${passwordConfirm ? (passwordsMatch ? 'text-green-600' : 'text-red-500') : 'text-gray-400'}`}>
        {passwordConfirm ? (passwordsMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.') : '비밀번호를 다시 입력해주세요.'}
      </p>

      <div className="flex gap-2 mb-2">
        <input
          className={`flex-1 px-4 py-2 border rounded ${codeVerified ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
          disabled={codeVerified}
        />
        <button
          type="button"
          onClick={sendEmailCode}
          disabled={isSending || codeVerified || resendTimer > 0}
          className={`text-white px-3 rounded ${
            codeVerified || resendTimer > 0 || isSending
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {codeVerified
            ? '인증 완료'
            : resendTimer > 0
              ? `${resendTimer}초 후 재전송`
              : '인증번호 받기'}
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-2">※ 이메일은 kakao.com / naver.com 만 가능합니다.</p>

      {codeSent && (
        <div className="mb-4">
          <div className="flex gap-2 mb-1">
            <input
              className={`flex-1 px-4 py-2 border rounded ${codeVerified ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
              placeholder="인증번호 입력"
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value)}
              disabled={codeVerified}
            />
            <button
              type="button"
              className={`px-3 rounded text-white ${codeVerified ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'}`}
              onClick={verifyEmailCode}
              disabled={codeVerified}
            >
              인증 확인
            </button>
          </div>
          {verificationError && <p className="text-red-500 text-sm">{verificationError}</p>}
          {codeVerified && <p className="text-green-600 text-sm">✅ 인증 완료</p>}
        </div>
      )}

      <button
        onClick={handleSignup}
        disabled={!codeVerified}
        className={`w-full py-2 rounded text-white font-bold ${codeVerified ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
      >
        가입하기
      </button>
    </div>
  );
}
