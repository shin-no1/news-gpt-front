import React, { useEffect, useState } from 'react';
import { getBookmarkGroups, getBookmarks, addBookmarkGroup, deleteBookmark } from '../../services/BookmarkApi';
import ReactMarkdown from 'react-markdown';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
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

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getBookmarkGroups();
        setGroups(data);
        if (data.length > 0) {
          setSelectedGroupId(data[0].id);
        }
      } catch (e) {
        alert('북마크 그룹을 불러오는 데 실패했습니다.');
      }
    };
    fetchGroups();
  }, []);

  const fetchBookmarks = async (groupId: number) => {
    try {
      const data = await getBookmarks(groupId);
      setBookmarks(data);
    } catch (e) {
      alert('북마크 목록을 불러오는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    if (selectedGroupId != null) {
      fetchBookmarks(selectedGroupId);
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
    } catch (e) {
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
    } catch (e) {
      alert('북마크 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-24 px-4">
      <NavBar />

      <h1 className="text-2xl font-bold mb-6">📁 북마크</h1>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 overflow-x-auto border-b pb-2">
          {groups.map((group) => (
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
          ))}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <FiPlus /> 그룹 추가
        </button>
      </div>

      {bookmarks.length === 0 ? (
        <p className="text-sm text-gray-500">해당 그룹에 북마크가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id} className="border p-4 rounded-md bg-white shadow-sm relative">
              <button
                onClick={() => handleDeleteBookmark(bookmark.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <FiTrash2 />
              </button>
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
          ))}
        </ul>
      )}

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