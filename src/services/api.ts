const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function analyzeUrl(url: string, accessToken: string | null, login: boolean) {
  return await fetch(`${API_URL}/api/news/analyze-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({url, login}),
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

export async function signupApi(email: string, username: string, password: string) {
  return await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password }),
  });
}
