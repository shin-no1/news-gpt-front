import ReactMarkdown from "react-markdown";
import { useState } from 'react';
import UrlForm from '../components/UrlForm';
import { analyzeUrl } from '../services/api';
import type { NewsResultType } from '../types/NewsType';
import NavBar from "./NavBar";
import { reissueToken } from "../utils/Auth";

export default function News() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NewsResultType | null>(null);

  const handleSubmit = async (url: string) => {
    setLoading(true);
    setResult(null);

    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await analyzeUrl(url, accessToken, !!accessToken);

      if (res.status === 401) {
        await reissueToken(() => handleSubmit(url));
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || '알 수 없는 오류가 발생했습니다.');
        return;
      }
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('서버와 통신 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-gradient p-8 flex items-start justify-center">
      <NavBar />
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-md p-6 mt-24">
        <h1 className="text-2xl font-bold mb-6 point-color text-center">
          📰 뉴스 요약 분석기
        </h1>

        <UrlForm onSubmit={handleSubmit} loading={loading} />

        {loading && <p className="text-sm text-gray-500 mt-4">요약 중입니다...</p>}

        {result && (
          <div className="mt-6 space-y-6 border-t pt-6">
            {/* 주제 */}
            {result.topic && (
              <p className="text-sm text-[#4a4ecb] mb-1 font-medium">
                {result.topic}
              </p>
            )}

            {/* 제목 */}
            {result.title && (
              <h2 className="text-xl font-bold text-gray-800">
                {result.title}
              </h2>
            )}

            {/* 요약 */}
            {result.summary && (
              <div className="bg-gray-50 p-4 rounded-lg shadow-inner border border-[#c7d6f8]">
                <div className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                  <ReactMarkdown>
                    {result.summary}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* 키워드 */}
            {Array.isArray(result.keywords) && result.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((k: string, i: number) => (
                  <span
                    key={i}
                    className="bg-[#e1ecff] text-[#4a6edb] px-3 py-1 rounded-full text-xs font-medium"
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
                  className="text-[#4a4ecb] hover:underline text-sm"
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
