const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function analyzeUrl(newsUrl: string, userId?: string) {
  return await fetch(`${API_URL}/api/news/analyze-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 추후 로그인 토큰 헤더 추가 가능
      // ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({url: newsUrl, userId}),
  });
}

export async function sendEmailCodeApi(email: string) {
  return await fetch(`${API_URL}/api/auth/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}

export async function verifyEmailCodeApi(email: string, code: string) {
  return await fetch(`${API_URL}/api/auth/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
}

export async function signupApi(email: string, nickname: string, password: string) {
  return await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, nickname, password }),
  });
}
