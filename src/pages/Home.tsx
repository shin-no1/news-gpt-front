import { useState } from 'react';
import UrlForm from '../components/UrlForm';
import { analyzeUrl } from '../services/api';
import type { NewsResultType } from '../types/NewsType';

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
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NewsResultType | null>(null);

  const handleSubmit = async (url: string) => {
    const key = getTodayKey();
    const currentCount = parseInt(getCookie(key) || '0');

    if (currentCount >= 5) {
      alert('비회원은 하루 최대 5회까지 분석할 수 있습니다.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await analyzeUrl(url);
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || '알 수 없는 오류가 발생했습니다.');
        return;
      }
      setResult(data);
      setCookie(key, String(currentCount + 1), 1);
    } catch (err) {
      console.error(err);
      alert('서버와 통신 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          📰 뉴스 요약 분석기
        </h1>

        <UrlForm onSubmit={handleSubmit} />

        {loading && <p className="text-gray-500 mt-4">요약 중입니다...</p>}

        {result && (
          <div className="mt-6 space-y-6 border-t pt-6">
            {/* 주제 */}
            {result.topic && (
              <p className="text-sm text-gray-600 mb-1">
                {result.topic}
              </p>
            )}

            {/* 제목 */}
            {result.title && (
              <h2 className="text-2xl font-bold text-gray-900">
                {result.title}
              </h2>
            )}

            {/* 요약 */}
            {result.summary && (
              <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                  {result.summary}
                </p>
              </div>
            )}

            {/* 키워드 */}
            {Array.isArray(result.keywords) && result.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((k: string, i: number) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                  #{k}
                </span>
                ))}
              </div>
            )}

            {/* 원문 링크 */}
            {result.url && (
              <div className="mt-2">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  👉 원문 기사 보기
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
