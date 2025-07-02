const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function loginApi(username: string, password: string, deviceId: string) {
  console.log(`${username}, ${password}, ${deviceId}`);
  return await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, deviceId }),
  });
}

export async function logoutApi(accessToken: string | null, deviceId: string) {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' ,
      Authorization: `Bearer ${accessToken}`,
      'X-Device-Id': deviceId
    },
  });
}

export async function reissueApi(accessToken: string | null, deviceId: string) {
  return await fetch(`${API_URL}/api/auth/reissue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' ,
      Authorization: `Bearer ${accessToken}`,
      'X-Device-Id': deviceId
    },
  });
}