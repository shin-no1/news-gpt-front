import { useState } from 'react';
import UrlForm from '../components/UrlForm';
import { analyzeUrl } from '../services/api';

function getTodayKey() {
  return `analyze_count_${new Date().toISOString().slice(0, 10)}`;
}

function getCookie(name: string): string | null {
  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith(name + '='));
  return value ? decodeURIComponent(value.split('=')[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
}

export default function Home() {
  const [result, setResult] = useState<any | null>(null);

  const handleSubmit = async (url: string) => {
    const key = getTodayKey();
    const currentCount = parseInt(getCookie(key) || '0');

    if (currentCount >= 5) {
      alert('비회원은 하루 최대 5회까지 분석할 수 있습니다.');
      return;
    }

    try {
      const data = await analyzeUrl(url);
      setResult(data);
      setCookie(key, String(currentCount + 1), 1);
    } catch (err) {
      alert('분석에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          📰 뉴스 요약 분석기
        </h1>

        <UrlForm onSubmit={handleSubmit}/>

        {result && (
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">{result.title}</h2>
            <p className="text-gray-600">{result.summary}</p>
            <p className="text-sm text-gray-500">주제: {result.topic}</p>
            <div className="flex flex-wrap gap-2">
              {result.keywords.map((k: string) => (
                <span
                  key={k}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  #{k}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
