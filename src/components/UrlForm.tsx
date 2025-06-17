import { useState } from 'react';

type Props = {
  onSubmit: (url: string) => void;
};

export default function UrlForm({onSubmit}: Props) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.startsWith('http')) {
      alert('URL 형식을 확인해주세요');
      return;
    }
    onSubmit(url);
    setUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-x-2">
      <input
        className="border px-2 py-1 rounded w-96"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="뉴스 URL 입력"
      />
      <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
        분석
      </button>
    </form>
  );
}
