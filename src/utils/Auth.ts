import { logoutApi, reissueApi } from "../services/AuthApi";

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


export async function reissueToken(retryCallback?: () => void) {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const deviceId = getDeviceId();
    const res = await reissueApi(refreshToken, deviceId);

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || '알 수 없는 오류가 발생했습니다.');
    }

    const data = await res.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userId', data.userId);

    if (retryCallback) retryCallback(); // 토큰 재발급 성공했을 때만 재시도
  } catch {
    alert('세션이 만료되어 로그인 페이지로 이동합니다.');
    localStorage.clear();
    window.location.href = '/';
  }
}