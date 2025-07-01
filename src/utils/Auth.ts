import { logoutApi } from "../services/AuthApi";

export function getDeviceId(): string {
  let id = localStorage.getItem('deviceId');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('deviceId', id);
  }
  return id;
}

export async function handleLogout() {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const deviceId = getDeviceId();
    await logoutApi(accessToken, deviceId);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('deviceId');
    window.location.href = '/';
  } catch {
    alert('로그아웃 실패');
  }
}