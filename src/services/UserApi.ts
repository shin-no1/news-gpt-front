const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function meApi(accessToken: string | null) {
  return await fetch(`${API_URL}/api/user/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
  });
}