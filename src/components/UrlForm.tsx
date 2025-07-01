import React, { useState } from 'react';

type Props = {
  onSubmit: (url: string) => void;
  loading: boolean;
};

export default function UrlForm({ onSubmit, loading }: Props) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 서버에서 분기처리 되면 URL 로직 제거
    if (!url.startsWith('https://n.news.naver.com/')) {
      alert('네이버 뉴스만 요약 가능합니다.');
      return;
    }
    onSubmit(url);
    setUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#8661C1] text-sm"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="네이버 뉴스 URL 입력"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded-md text-sm text-white inline-flex items-center justify-center whitespace-nowrap
          ${loading ? 'bg-gray-400 cursor-not-allowed' : 'btn-primary'}`}
      >
        {loading ? '분석 중...' : '분석'}
      </button>
    </form>
  );
}
