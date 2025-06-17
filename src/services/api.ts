const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function analyzeUrl(newsUrl: string, userId?: string) {
  const res = await fetch(`${API_URL}/api/analyze-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 추후 로그인 토큰 헤더 추가 가능
      // ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({url: newsUrl, userId}),
  });

  if (!res.ok) {
    throw new Error('서버 요청 실패');
  }

  return res.json();
}