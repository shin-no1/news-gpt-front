import { useState, useEffect } from 'react';
import { FaCog } from 'react-icons/fa';
import Modal from '../components/Modal';

export function Me() {
  const [username, setUsername] = useState<string | null>(null);
  const [modalText, setModalText] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('username');
    setUsername(stored);
  }, []);

  return (
    <div className="max-w-md mx-auto mt-24 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">
          👤 {username}
        </h2>
        <button
          onClick={() => setModalText('개발 중인 기능입니다!')}
          className="text-gray-600 hover:text-gray-800"
        >
          <FaCog className="text-lg cursor-pointer" />
        </button>
      </div>

      <div className="space-y-3">
        <button
          className="w-full text-left px-4 py-3 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
          onClick={() => (window.location.href = '/me/bookmark')}
        >
          📁 북마크 보러가기
        </button>
        <button
          className="w-full text-left px-4 py-3 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
          onClick={() => setModalText('개발 중인 기능입니다!')}
        >
          📜 히스토리 보러가기
        </button>
      </div>

      {/* Dialog 기반 Modal */}
      <Modal isOpen={!!modalText} onClose={() => setModalText(null)}>
        <p>🚧 {modalText}</p>
      </Modal>
    </div>
  );
}
