---
name: gen-screen
description: Figma 프레임 URL을 입력받아 Figma MCP로 디자인을 가져오고, CLAUDE.md의 시나리오에 맞춰 화면을 그대로 구현합니다. 사용법 `/gen-screen {figma_frame_url}`.
---

# gen-screen

Figma 디자인을 코드로 1:1 구현하는 스킬입니다. 인자로 받은 Figma 프레임 URL을 Figma MCP로 가져와, `.claude/CLAUDE.md`에 정의된 시나리오·기술 스택·컨벤션에 따라 React 화면을 작성합니다.

## 입력

- **인자**: Figma 프레임/노드 URL 1개 (예: `https://www.figma.com/design/<fileKey>/<name>?node-id=<nodeId>`)
- 인자가 없으면 사용자에게 URL을 요청합니다.

## 실행 순서

### 1. 컨텍스트 로드
- `.claude/CLAUDE.md`를 Read로 읽어 다음을 파악합니다:
  - **3개 핵심 시나리오** (온보딩 / 메인 페이지 지도 히트맵 / AI 질문 페이지)
  - **기술 스택** (TypeScript, React, Vite, pnpm, TanStack Query, Tailwind CSS, Shadcn UI, Mapbox GL JS)
  - **폴더 구조** (FSD 아키텍처: `src/{feature}/components|containers|hooks|constants`)
  - **코드 컨벤션** (아래 "구현 규칙" 참조)

### 2. Figma 디자인 추출
사용자가 제공한 URL에서 `node-id` 파라미터를 파싱한 뒤 Figma MCP 도구를 호출합니다:

1. `mcp__figma__get_metadata` (또는 동급 메타 도구) — 프레임 구조/네이밍 확인
2. `mcp__figma__get_code` — React + Tailwind 코드 추출 (있으면 우선 사용)
3. `mcp__figma__get_screenshot` — 시각 비교용 이미지 확보
4. `mcp__figma__get_variable_defs` — 색상·타이포·간격 토큰 확보

> Figma MCP 도구가 다른 이름으로 노출돼 있다면 `ToolSearch`로 `figma` 키워드를 검색해 정확한 도구명을 찾아 사용합니다. MCP가 연결돼 있지 않으면 사용자에게 Figma MCP 설정을 요청하고 중단합니다.

### 3. 시나리오 매칭
프레임 이름/구조와 CLAUDE.md의 시나리오를 매칭해 어느 화면인지 판단합니다:
- "온보딩 / Step1~4 / 민감군 / 활동 시간대 / 관심 장소 / 체감 온도" → `src/pages/onboarding/...`
- "지도 / 히트맵 / 필터 / 시간 슬라이더 / 요약 카드" → `src/pages/main/...`
- "AI / 질문 / 채팅 / 프롬프트" → `src/pages/ai-chat/...`
- 매칭이 모호하면 `AskUserQuestion`으로 어떤 시나리오/페이지인지 확인합니다.

### 4. 구현
다음 규칙을 **모두** 지켜 화면을 생성/수정합니다.

#### 구현 규칙 (CLAUDE.md 컨벤션 강제)
- **TypeScript**
  - 타입 선언은 `type`만 사용 (절대 `interface` 사용 금지)
  - 컴포넌트는 `function Component() {}` 형태로 선언 (화살표 함수 금지)
  - `export`만 사용 (`export default` 금지)
- **네이밍**
  - 컴포넌트/훅: `PascalCase` (`HeatmapLayer`, `useWeatherData`)
  - 상수: `UPPERCASE` (`MAX_LOCATIONS`)
  - 변수: `camelCase`
  - 파일/폴더: `snake-case` (`heatmap-layer.tsx`, `air-quality/`)
  - 타입: `PascalCase` (`type TemperatureType`)
- **폴더 구조 (FSD)**
  ```
  src/{feature}/
  ├── components/     # 순수 UI 컴포넌트
  ├── containers/     # 상태/데이터 바인딩 포함
  ├── hooks/
  ├── constants/
  └── ...
  ```
  이미 존재하는 feature가 있으면 그 안에 추가, 없으면 새 feature 폴더 생성.
- **스타일**
  - Tailwind CSS 유틸리티 우선
  - 공통 UI는 Shadcn UI 컴포넌트 사용 (없으면 `pnpm dlx shadcn@latest add <component>` 명령을 사용자에게 안내)
  - Figma 토큰(variable defs)은 가능한 한 Tailwind 클래스로 매핑, 매핑 불가한 값만 임시 inline 값 사용
- **데이터/서버 상태**: TanStack Query 사용. API 호출이 필요한 화면은 hooks/에 `useXxxQuery` 형태로 분리.
- **지도 화면**: Mapbox GL JS 사용. 컴포넌트는 SSR 고려 없이 클라이언트 렌더 전제.

#### 파일 생성 흐름
1. 라우팅 위치 확인: `src/navigator/` 또는 `src/pages/` 구조에 맞춰 라우트 등록 (이미 있으면 스킵)
2. `components/`에 프레임의 자식 노드를 작은 컴포넌트로 분리
3. `containers/`에 데이터/상태 조립 컴포넌트 생성
4. 페이지 엔트리에서 container를 조립

### 5. 검증
- `pnpm tsc --noEmit`으로 타입 체크
- `pnpm lint`가 설정돼 있으면 실행
- Figma 스크린샷과 결과 화면의 레이아웃/색/간격이 일치하는지 사용자에게 한 줄로 보고
- 누락된 인터랙션/데이터 바인딩은 명시적으로 "TODO: 데이터 연동 필요"로 표시 (절대 가짜 데이터로 우회하지 않음)

### 6. 보고
한두 문장으로 다음을 보고:
- 어떤 시나리오/페이지로 판단했는지
- 생성/수정한 파일 목록 (markdown 링크)
- 남은 작업 (API 연동, Shadcn 추가 설치 등)

## 주의사항
- **Figma 디자인을 그대로** 구현합니다. 디자인에 없는 요소를 임의로 추가하지 않습니다.
- 시나리오 텍스트(라벨/문구)는 CLAUDE.md와 Figma 중 **Figma를 우선**합니다. 단, Figma에 없는 placeholder/빈 영역은 CLAUDE.md 시나리오의 의미를 따라 채웁니다.
- 기존 파일이 있으면 덮어쓰지 말고 Edit로 부분 수정합니다.
- 절대 `interface`, `export default`, 화살표 함수 컴포넌트, `PascalCase.tsx` 파일명을 만들지 않습니다.
