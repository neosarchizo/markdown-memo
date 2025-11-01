# 📝 Markdown Memo

> 마크다운 기반의 강력한 모바일 메모 애플리케이션

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-51.0-000020.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.74-61dafb.svg)](https://reactnative.dev/)

## 📱 소개

Markdown Memo는 마크다운 포맷을 지원하는 모바일 메모 애플리케이션입니다. TypeScript, Expo, React Native Paper로 구축되어 풍부한 편집 기능, 로컬 저장소, 다양한 내보내기 옵션을 제공합니다.

### ✨ 주요 기능

- **📄 마크다운 편집**: 강력한 마크다운 편집기와 실시간 미리보기
- **🎨 테마 지원**: 라이트/다크 모드 토글
- **🔍 빠른 검색**: 제목, 내용, 태그 전체 검색
- **🏷️ 태그 관리**: 메모를 태그로 분류하고 정리
- **📌 메모 고정**: 중요한 메모를 상단에 고정
- **💾 로컬 저장**: SQLite 기반의 안정적인 로컬 데이터베이스
- **📤 다양한 내보내기**: Markdown, PDF, 일반 텍스트로 내보내기
- **📧 공유 기능**: 이메일, 클립보드, 네이티브 공유 시트 지원
- **⚡ 자동 저장**: 편집 중 자동으로 저장되어 데이터 손실 방지

## 🛠️ 기술 스택

- **[TypeScript](https://www.typescriptlang.org/)** - 타입 안정성
- **[Expo](https://expo.dev/)** ~51.0.0 - React Native 개발 플랫폼
- **[React Native](https://reactnative.dev/)** 0.74.5 - 크로스 플랫폼 모바일 프레임워크
- **[React Native Paper](https://callstack.github.io/react-native-paper/)** - Material Design 3 UI 컴포넌트
- **[Expo Router](https://docs.expo.dev/router/introduction/)** - 파일 기반 라우팅
- **[Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)** - 로컬 데이터베이스
- **[React Native Markdown Display](https://github.com/iamacup/react-native-markdown-display)** - 마크다운 렌더링

## 📦 설치 방법

### 사전 요구사항

- Node.js 18+
- npm 또는 yarn
- Expo CLI (선택사항)

### 설치

```bash
# 저장소 클론
git clone https://github.com/neosarchizo/markdown-memo.git

# 프로젝트 디렉토리로 이동
cd markdown-memo

# 의존성 설치
npm install
```

## 🚀 실행 방법

### 개발 서버 시작

```bash
npm start
# 또는
npx expo start
```

### 플랫폼별 실행

```bash
# Android
npm run android

# iOS (macOS만 가능)
npm run ios

# Web
npm run web
```

### Expo Go 앱으로 실행

1. 스마트폰에 [Expo Go](https://expo.dev/client) 앱 설치
2. `npm start` 실행
3. QR 코드를 Expo Go 앱으로 스캔

## 📖 사용 방법

### 메모 작성

1. 홈 화면의 **+** 버튼을 탭하여 새 메모 생성
2. 제목과 내용을 입력
3. 태그를 추가하여 메모를 분류
4. 자동으로 저장됩니다

### 마크다운 편집

에디터 툴바에서 다음 기능을 사용할 수 있습니다:

- **텍스트 포맷**: 굵게, 기울임, 밑줄, 취소선
- **제목**: H1 ~ H6 레벨 선택
- **리스트**: 글머리 기호, 체크박스, 번호 매기기
- **들여쓰기**: 들여쓰기/내어쓰기
- **링크 삽입**: URL과 텍스트 입력
- **코드 블록**: 프로그래밍 언어 선택 가능
- **표 생성**: 행/열 수를 지정하여 표 삽입

### 뷰 모드 전환

- **편집 모드**: 마크다운 문법으로 편집
- **미리보기 모드**: 렌더링된 결과 확인

### 메모 검색

1. 홈 화면 상단의 검색창에 키워드 입력
2. 제목, 내용, 태그에서 실시간 검색
3. 검색 결과는 고정된 메모가 상단에 표시

### 메모 정렬

설정에서 다음 정렬 옵션을 선택할 수 있습니다:

- **최근 수정순** (기본값)
- **생성일순**
- **제목순** (가나다순)

### 메모 내보내기

1. 메모 편집 화면에서 내보내기 버튼 탭
2. 형식 선택: **Markdown**, **PDF**, **일반 텍스트**
3. 방법 선택:
   - **클립보드**: 내용을 클립보드에 복사
   - **공유**: 네이티브 공유 시트로 공유
   - **저장**: 파일로 저장
   - **이메일**: 이메일로 전송

### 전체 메모 내보내기

1. 설정 화면으로 이동
2. **데이터** 섹션에서 "모든 메모 내보내기" 탭
3. 모든 메모가 하나의 Markdown 파일로 결합되어 공유됩니다

## 📁 프로젝트 구조

```
markdown-memo/
├── app/                      # Expo Router 스크린
│   ├── _layout.tsx          # 루트 레이아웃 (프로바이더, 테마)
│   ├── index.tsx            # 홈 화면 (메모 리스트)
│   ├── editor/
│   │   └── [id].tsx         # 메모 편집기 (동적 라우트)
│   └── settings.tsx         # 설정 화면
├── src/
│   ├── types/               # TypeScript 인터페이스
│   ├── contexts/            # React Context 프로바이더
│   ├── services/            # 비즈니스 로직
│   │   ├── database.ts      # SQLite 데이터베이스 헬퍼
│   │   ├── storage.ts       # 저장소 서비스
│   │   └── export.ts        # 내보내기 서비스
│   ├── hooks/               # 커스텀 React 훅
│   ├── components/          # 재사용 가능한 UI 컴포넌트
│   │   ├── MemoList/        # 메모 리스트 컴포넌트
│   │   ├── Editor/          # 에디터 컴포넌트
│   │   ├── Search/          # 검색 컴포넌트
│   │   └── Common/          # 공통 컴포넌트
│   └── utils/               # 헬퍼 함수
└── documents/               # 프로젝트 문서
    ├── PRD.md              # 제품 요구사항 문서
    ├── LLD.md              # 저수준 설계 문서
    └── PLAN.md             # 구현 계획
```

## 🗄️ 데이터베이스 구조

SQLite 데이터베이스를 사용하여 다음 테이블로 데이터를 관리합니다:

- **memos**: 메모 정보 (id, title, content, createdAt, updatedAt, isPinned)
- **tags**: 태그 정보 (id, name)
- **memo_tags**: 메모-태그 다대다 관계 (memoId, tagId)
- **settings**: 앱 설정 (key, value)

## 🧪 개발

### 코드 품질

```bash
# ESLint 실행
npm run lint

# Prettier로 코드 포맷팅
npm run format
```

### 빌드

```bash
# EAS Build 설정
eas build:configure

# Android 빌드
eas build --platform android

# iOS 빌드 (macOS 필요)
eas build --platform ios
```

## 📋 개발 진행 상황

현재 개발 단계: **Phase 8 - 폴리싱 및 UX 개선 중**

완료된 단계:
- ✅ Phase 0: 프로젝트 설정
- ✅ Phase 1: 핵심 데이터 및 저장소
- ✅ Phase 2: 기본 UI 및 리스트 뷰
- ✅ Phase 3: 에디터 기본 기능
- ✅ Phase 4: 에디터 툴바 및 포맷팅
- ✅ Phase 5: 태그 및 정리 기능
- ✅ Phase 6: 검색 기능
- ✅ Phase 7: 내보내기 기능
- 🔄 Phase 8: 폴리싱 및 UX 개선 (진행 중)

자세한 진행 상황은 [PLAN.md](documents/PLAN.md)를 참조하세요.

## 📚 문서

- **[PRD](documents/PRD.md)** - 제품 요구사항 문서
- **[LLD](documents/LLD.md)** - 저수준 설계 문서
- **[PLAN](documents/PLAN.md)** - 구현 계획 및 진행 상황
- **[CLAUDE](CLAUDE.md)** - AI 어시스턴트를 위한 프로젝트 컨텍스트

## 🤝 기여하기

기여를 환영합니다! 다음과 같이 기여할 수 있습니다:

1. 이 저장소를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

### 버그 리포트 및 기능 요청

[Issues](https://github.com/neosarchizo/markdown-memo/issues) 페이지에서 버그를 보고하거나 새로운 기능을 제안해주세요.

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👨‍💻 개발자

**neosarchizo**

- GitHub: [@neosarchizo](https://github.com/neosarchizo)

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 라이브러리를 사용합니다:

- [Expo](https://expo.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [React Native Markdown Display](https://github.com/iamacup/react-native-markdown-display)
- 그 외 [package.json](package.json)에 명시된 모든 의존성

## 📞 문의

질문이나 제안사항이 있으시면 [Issues](https://github.com/neosarchizo/markdown-memo/issues)에 남겨주세요.

---

**⭐ 이 프로젝트가 유용하다면 Star를 눌러주세요!**
