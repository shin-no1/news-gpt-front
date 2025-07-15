import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getBookmarkGroups, addBookmark } from '../services/BookmarkApi';

export default function BookmarkGroupPopover({
                                               summaryHistoryId,
                                               onClose,
                                               position = { top: 0, left: 0 }
                                             }: {
  summaryHistoryId: number;
  onClose: () => void;
  position?: { top: number; left: number };
}) {
  const [groups, setGroups] = useState<{ id: number; name: string }[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const popoverRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setIsLoggedIn(false);
      return;
    }

    getBookmarkGroups()
      .then(setGroups)
      .catch(() => {
        alert('그룹을 불러오지 못했습니다.');
        onClose();
      });
  }, [onClose]);

  const handleSelect = async (groupId: number) => {
    try {
      await addBookmark(summaryHistoryId, groupId);
      alert('북마크가 추가되었습니다!');
      onClose();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const popover = (
    <div
      ref={popoverRef}
      className="absolute z-50 bg-white border border-gray-300 shadow-lg rounded-md p-3 w-64"
      style={{
        top: position.top,
        left: undefined,
        right: Math.max(8, window.innerWidth - position.left - 200), // 최소 여백 확보
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold">
          {isLoggedIn ? '북마크 그룹 선택' : '로그인 필요'}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
        >
          ✕
        </button>
      </div>

      {!isLoggedIn ? (
        <p className="text-sm text-gray-600">로그인 후 이용 가능합니다.</p>
      ) : (
        <ul className="space-y-1">
          {groups.map((group) => (
            <li key={group.id}>
              <button
                onClick={() => handleSelect(group.id)}
                className="text-sm w-full text-left px-3 py-1 rounded hover:bg-blue-50 cursor-pointer"
              >
                📁 {group.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // ✅ createPortal로 body 하위로 렌더링 (레이아웃 영향 제거)
  return createPortal(popover, document.body);
}
