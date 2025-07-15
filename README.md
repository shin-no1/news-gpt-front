# 📰 NewsGPT Frontend

AI 기반 뉴스 요약 서비스 **NewsGPT**의 프론트엔드 레포지토리입니다.  
사용자가 뉴스 URL을 입력하면, 해당 뉴스의 요약 결과를 확인하고 북마크 기능으로 관리할 수 있는 UI를 제공합니다.

> 🔗 [Backend GitHub 보기](https://github.com/shin-no1/news-gpt-back)  
> 🔗 [API 문서 보기](https://api.know-that.dev/docs/index.html)  
> 🔗 [구현 보기](https://newsgpt.know-that.dev/))  
---

## 주요 기능

- 뉴스 URL 입력 → AI 요약 결과 출력
- JWT 로그인 및 사용자 인증 흐름
- 뉴스 북마크 등록, 그룹화, 편집 기능 (예정)
- 요약 히스토리 조회 (예정)


---

## Screenshots

(추가 예정)

---

## 기술 스택

| 구분       | 내용                         |
|------------|------------------------------|
| 프레임워크  | React 18 + Vite              |
| 상태관리    | React Context API            |
| 스타일링    | Tailwind CSS                 |
| 인증       | JWT 기반 인증 + 로컬스토리지 |
| API 통신    | Axios + API 분리 구조 (`*Api.ts`) |


---

## 주요 구현 포인트

### 뉴스 요약 뷰
- 사용자로부터 뉴스 URL을 입력받아 POST 요청 전송
- 요약 결과 출력 시 HTML 태그 제거 및 줄바꿈 처리
- 요약 실패 시 예외 메시지

### 인증 처리
- 로그인 성공 시 JWT 토큰을 로컬 스토리지에 저장
- 인증이 필요한 페이지 접근 시 토큰 검증 → 리다이렉트 처리

### 반응형 대응
- 모바일 기준의 반응형 대응 완료
- 팝업 위치 및 레이아웃 구성도 디바이스별로 조정

### 북마크 기능
- 북마크 그룹을 직접 생성 및 정렬 가능 (예정)
- 뉴스 요약 결과를 원하는 그룹에 저장
- 북마크 추가/수정 팝오버 UI 구현


---

## 🔧 프로젝트 구조

<pre>
news-gpt-front/
├── src/
│   ├── services/         # Axios 기반 API 정의 (*.ts)
│   ├── components/       # 공통 및 개별 UI 컴포넌트
│   ├── pages/            # 주요 페이지 구성
│   ├── types/            # 타입 정의
│   └── App.tsx           # 라우팅 및 전역 레이아웃
</pre>

---

## 🚀 실행 방법

### 1. 의존성 설치

