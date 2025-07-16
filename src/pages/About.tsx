import NavBar from "./NavBar";

export default function About() {
  return (
    <div className="min-h-screen bg-blue-gradient flex items-start justify-center">
      <NavBar />

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-md p-6 mt-24">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">NewsGPT 프로젝트 소개</h1>

        <section className="mb-6">
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-md px-4 py-3">
            현재는 <strong>네이버 뉴스 URL만 지원</strong>되며, <strong>비로그인 사용자는 하루 5회</strong>, <strong>로그인 사용자는 하루 10회</strong>까지 요약 요청이 가능합니다.
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">프로젝트 개요</h2>
          <p className="text-base text-gray-700 leading-relaxed">
            NewsGPT는 사용자가 입력한 뉴스 URL을 기반으로 AI가 해당 기사를 요약해주는 서비스입니다.
            <br/>
            사용자는 요약 결과를 저장하거나 북마크를 통해 관리할 수 있으며, 이전 요약 기록도 확인 가능합니다.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">주요 기능</h2>
          <ul className="list-disc list-inside space-y-1 text-base text-gray-700">
            <li>뉴스 URL 입력 → AI 요약 결과 출력</li>
            <li>요약 히스토리 및 북마크 그룹별 관리</li>
            <li>JWT 기반 로그인/회원가입 및 이메일 인증</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">기술 스택</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">💻 프론트엔드</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>React + Vite</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">🧑‍💻 백엔드</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Java 17, Spring Boot 3</li>
                <li>Spring Security, JWT</li>
                <li>MariaDB + Spring Data JPA</li>
                <li>Redis, Docker, REST Docs</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">시스템 구성도</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm text-gray-800">
{`[사용자]
   ↓ URL 입력
[프론트엔드: React]
   ↓ Axios 호출
[백엔드: Spring Boot]
   ├─ Jsoup HTML 파싱
   ├─ GPT 요약 처리
   ├─ Redis 캐싱
   └─ DB 저장 (MariaDB)`}
          </pre>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">프로젝트 저장소</h2>
          <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
            <li>
              🔗 프론트엔드 GitHub:&nbsp;
              <a
                href="https://github.com/shin-no1/news-gpt-front"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                https://github.com/shin-no1/news-gpt-front
              </a>
            </li>
            <li>
              🔗 백엔드 GitHub:&nbsp;
              <a
                href="https://github.com/shin-no1/news-gpt-back"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                https://github.com/shin-no1/news-gpt-back
              </a>
            </li>
            <li>
              📘 API 문서 (RestDocs):&nbsp;
              <a
                href="https://api.know-that.dev/docs/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                https://api.know-that.dev/docs/index.html
              </a>
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🖥️ 주요 화면</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <img
                src="../../screenshots/main.png"
                alt="메인화면"
                className="rounded-lg shadow-md border border-gray-200"
              />
              <p className="text-sm mt-2 text-gray-600">메인화면</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="../../screenshots/login.png"
                alt="로그인화면"
                className="rounded-lg shadow-md border border-gray-200"
              />
              <p className="text-sm mt-2 text-gray-600">로그인화면</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="../../screenshots/signup.png"
                alt="회원가입화면"
                className="rounded-lg shadow-md border border-gray-200"
              />
              <p className="text-sm mt-2 text-gray-600">회원가입화면</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="../../screenshots/summary.png"
                alt="뉴스요약화면"
                className="rounded-lg shadow-md border border-gray-200"
              />
              <p className="text-sm mt-2 text-gray-600">뉴스요약화면</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="../../screenshots/me.png"
                alt="회원화면"
                className="rounded-lg shadow-md border border-gray-200"
              />
              <p className="text-sm mt-2 text-gray-600">회원화면</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="../../screenshots/me_bookmark.png"
                alt="북마크화면"
                className="rounded-lg shadow-md border border-gray-200"
              />
              <p className="text-sm mt-2 text-gray-600">북마크화면</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
