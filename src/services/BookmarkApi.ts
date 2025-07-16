import { reissueToken } from "../utils/Auth";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function addBookmark(summaryHistoryId: number, groupId?: number) {
  const accessToken = localStorage.getItem('accessToken');

  // 기본 그룹 조회
  let finalGroupId = groupId;
  if (!groupId) {
    const groupRes = await fetch(`${API_URL}/api/bookmark-groups`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!groupRes.ok) throw new Error('북마크 그룹 조회에 실패했습니다.');

    const groups = await groupRes.json();
    const defaultGroup = groups.find((g: any) => g.name === '기본');

    if (!defaultGroup) throw new Error('기본 북마크 그룹이 존재하지 않습니다.');
    finalGroupId = defaultGroup.id;
  }

  // 북마크 추가 요청
  const res = await fetch(`${API_URL}/api/bookmarks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      summaryHistoryId,
      groupId: finalGroupId,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || '북마크 추가에 실패했습니다.');
  }

  return await res.json(); // { bookmarkId, groupId }
}

export async function getBookmarkGroups(): Promise<any[]> {
  const accessToken = localStorage.getItem('accessToken');
  const res = await fetch(`${API_URL}/api/bookmark-groups`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 401) {
    let result: any[] = [];
    await reissueToken(async () => {
      result = await getBookmarkGroups();
    });
    return result;
  }

  if (!res.ok) throw new Error('그룹 목록 조회 실패');
  return await res.json();
}

export async function getBookmarks(selectedGroupId: number) {
  const accessToken = localStorage.getItem('accessToken');
  const res = await fetch(`${API_URL}/api/bookmarks?groupId=${selectedGroupId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error('그룹 목록 조회 실패');
  return await res.json();
}

export async function addBookmarkGroup(name: string) {
  const accessToken = localStorage.getItem('accessToken');
  const res = await fetch(`${API_URL}/api/bookmark-groups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      name: name
    }),
  });
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || '그룹 추가에 실패했습니다.');
  }
  return await res.json();
}

export async function deleteBookmark(id: number) {
  const accessToken = localStorage.getItem('accessToken');
  const res = await fetch(`${API_URL}/api/bookmarks/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || '북마크 제거에 실패했습니다.');
  }
  return await res.json();
}

export async function editBookmarkGroupName(bookmarkId: number, groupId: number | null, editGroupId: number) {
  const accessToken = localStorage.getItem('accessToken');
  const res = await fetch(`${API_URL}/api/bookmarks/${bookmarkId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      groupId: groupId,
      afterGroupId: editGroupId
    })
  });
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || '북마크 이동에 실패했습니다.');
  }
  return await res.json();
}