import React, { useEffect, useState } from 'react';
import {
  getBookmarkGroups,
  getBookmarks,
  addBookmarkGroup,
  deleteBookmark,
  editBookmarkGroup, editBookmarksGroup
} from '../../services/BookmarkApi';
import ReactMarkdown from 'react-markdown';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';
import NavBar from "../NavBar";

interface Bookmark {
  id: number;
  title: string;
  summary: string;
  topic: string;
  keywords: string[];
  url: string;
  groupId: number;
}

interface BookmarkGroup {
  id: number;
  name: string;
  displayOrder: number;
}

export function Bookmarks() {
  const [groups, setGroups] = useState<BookmarkGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editBookmarkId, setEditBookmarkId] = useState<number | null>(null);
  const [editGroupId, setEditGroupId] = useState<number | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedBookmarkIds, setSelectedBookmarkIds] = useState<number[]>([]);
  const [targetGroupId, setTargetGroupId] = useState<number | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const data = await getBookmarkGroups();
        setGroups(data);
        if (data.length > 0) {
          setSelectedGroupId(data[0].id);
        }
      } catch {
        alert('북마크 그룹을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const fetchBookmarks = async (groupId: number) => {
    setLoading(true);
    try {
      const data = await getBookmarks(groupId);
      setBookmarks(data);
    } catch {
      alert('북마크 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedGroupId != null) {
      fetchBookmarks(selectedGroupId);
      setSelectedBookmarkIds([]);
      setSelectionMode(false);
    }
  }, [selectedGroupId]);

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      await addBookmarkGroup(newGroupName.trim());
      setNewGroupName('');
      setShowModal(false);
      const data = await getBookmarkGroups();
      setGroups(data);
    } catch {
      alert('그룹 추가에 실패했습니다.');
    }
  };

  const handleDeleteBookmark = async (bookmarkId: number) => {
    if (!window.confirm('이 북마크를 삭제하시겠습니까?')) return;
    try {
      await deleteBookmark(bookmarkId);
      setDeleteConfirm(true);
      if (selectedGroupId != null) fetchBookmarks(selectedGroupId);
      setTimeout(() => setDeleteConfirm(false), 3000);
    } catch {
      alert('북마크 삭제에 실패했습니다.');
    }
  };

  const handleEditBookmarkGroup = async () => {
    if (editBookmarkId == null || editGroupId == null) return;
    try {
      const bookmark = bookmarks.find(b => b.id === editBookmarkId);
      if (!bookmark) return;
      const updatedBookmarkList = await editBookmarkGroup(editBookmarkId, selectedGroupId, editGroupId);
      setBookmarks(updatedBookmarkList);
      setEditBookmarkId(null);
      setEditGroupId(null);
    } catch {
      alert('북마크 그룹 수정에 실패했습니다.');
    }
  };

  const toggleBookmarkSelection = (id: number) => {
    setSelectedBookmarkIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBatchMove = async () => {
    if (!targetGroupId || selectedBookmarkIds.length === 0) return;
    try {
      if (selectedGroupId === targetGroupId) {
        alert("동일한 그룹으로는 이동할 수 없습니다.");
        return;
      }
      setLoading(true);
      const updatedBookmarkList = await editBookmarksGroup(selectedBookmarkIds, selectedGroupId, targetGroupId);
      setBookmarks(updatedBookmarkList);
    } catch {
      alert('일괄 이동에 실패했습니다.');
    } finally {
      setSelectedBookmarkIds([]);
      setSelectionMode(false);
      setLoading(false);
    }
  };

  const renderSkeleton = () => (
    <ul className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="border p-4 rounded-md bg-white shadow-sm animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded mb-1"></div>
          <div className="h-4 bg-gray-200 rounded mb-1 w-5/6"></div>
          <div className="flex gap-2 mt-2">
            <div className="h-4 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-20 bg-gray-200 rounded-full"></div>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="max-w-4xl mx-auto mt-24 px-4">
      <NavBar />

      <h1 className="text-2xl font-bold mb-6">📁 북마크</h1>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 overflow-x-auto border-b pb-2">
          {groups.length === 0 ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-7 w-20 bg-gray-200 animate-pulse rounded-full"
              ></div>
            ))
          ) : (
            groups.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroupId(group.id)}
                className={`px-3 py-1 text-sm rounded-full border hover:bg-blue-50 transition ${
                  selectedGroupId === group.id
                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                    : 'text-gray-600 border-gray-300'
                }`}
              >
                {group.name}
              </button>
            ))
          )}
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setShowModal(true)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <FiPlus /> 그룹 추가
          </button>
          <button
            onClick={() => setSelectionMode(!selectionMode)}
            className="text-sm text-gray-600 border px-3 py-1 rounded hover:bg-gray-100"
          >
            {selectionMode ? '선택 취소' : '선택 모드'}
          </button>
        </div>
      </div>

      {selectionMode && (
        <div className="mb-4 flex items-center gap-4 text-sm">
          <span>선택된 북마크: {selectedBookmarkIds.length}개</span>
          <button
            onClick={() => setSelectedBookmarkIds([])}
            className="text-gray-500 hover:underline"
          >
            선택 해제
          </button>
          <select
            value={targetGroupId ?? ''}
            onChange={(e) => setTargetGroupId(Number(e.target.value))}
            className="border px-3 py-1 rounded text-sm"
          >
            <option value="">이동할 그룹 선택</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
          <button
            onClick={handleBatchMove}
            disabled={selectedBookmarkIds.length === 0 || !targetGroupId}
            className="bg-blue-600 text-white text-sm px-4 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            선택 항목 이동
          </button>
        </div>
      )}

      {loading ? renderSkeleton() : bookmarks.length === 0 ? (
        <p className="text-sm text-gray-500">해당 그룹에 북마크가 없습니다.</p>
      ) : (
        <ul className="space-y-4 mb-14">
          {bookmarks.map((bookmark) => {
            const isSelected = selectedBookmarkIds.includes(bookmark.id);
            return (
              <li
                key={bookmark.id}
                onClick={() => {
                  if (selectionMode) toggleBookmarkSelection(bookmark.id);
                }}
                className={`border p-4 rounded-md bg-white shadow-sm relative cursor-pointer transition duration-200 ${
                  selectionMode && isSelected ? 'ring-2 ring-blue-400 bg-blue-50' : ''
                }`}
              >
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditBookmarkId(bookmark.id);
                      setEditGroupId(bookmark.groupId);
                    }}
                    className="text-gray-400 hover:text-green-500"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBookmark(bookmark.id);
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                {selectionMode && (
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleBookmarkSelection(bookmark.id);
                    }}
                    className="mb-2 mr-2"
                  />
                )}
                <p className="text-xs text-blue-600 mb-1 font-medium">{bookmark.topic}</p>
                <h3 className="text-base font-semibold mb-2">{bookmark.title}</h3>
                <div className="text-sm text-gray-700 whitespace-pre-line mb-2">
                  <ReactMarkdown>{bookmark.summary}</ReactMarkdown>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-blue-600 mb-2">
                  {bookmark.keywords.map((k, i) => (
                    <span key={i} className="bg-blue-50 px-2 py-1 rounded-full">#{k}</span>
                  ))}
                </div>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline"
                >
                  원문 기사 보기
                </a>
              </li>
            );
          })}
        </ul>
      )}

      {/* 북마크 그룹 수정 모달 */}
      <Transition appear show={editBookmarkId !== null} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setEditBookmarkId(null)}>
          <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
          <div className="fixed inset-0 flex items-start justify-center mt-24 px-4">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
              <Dialog.Title className="text-lg font-semibold mb-4">북마크 그룹 수정</Dialog.Title>
              <select
                className="w-full border px-3 py-2 rounded-md text-sm mb-4"
                value={editGroupId ?? ''}
                onChange={(e) => setEditGroupId(Number(e.target.value))}
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditBookmarkId(null)}
                  className="text-sm text-gray-500 hover:underline"
                >
                  취소
                </button>
                <button
                  onClick={handleEditBookmarkGroup}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                >
                  수정
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={showModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {
          setShowModal(false);
          setNewGroupName('');
        }}>
          <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
          <div className="fixed inset-0 flex items-start justify-center mt-24 px-4">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
              <Dialog.Title className="text-lg font-semibold mb-4">새 북마크 그룹 추가</Dialog.Title>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="그룹 이름을 입력하세요"
                className="w-full border px-3 py-2 rounded-md text-sm mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setNewGroupName('');
                  }}
                  className="text-sm text-gray-500 hover:underline"
                >
                  취소
                </button>
                <button
                  onClick={handleAddGroup}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                >
                  추가
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={deleteConfirm} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 flex items-start justify-center mt-24 px-4" onClose={() => setDeleteConfirm(false)}>
          <Dialog.Panel className="bg-white border border-gray-300 shadow-md rounded-md px-6 py-4 text-sm">
            북마크가 삭제되었습니다.
          </Dialog.Panel>
        </Dialog>
      </Transition>
    </div>
  );
}
