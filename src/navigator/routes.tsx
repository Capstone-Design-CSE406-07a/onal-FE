/* eslint-disable react-refresh/only-export-components -- 라우트 데이터 모듈: lazy 컴포넌트와 routes 배열을 함께 export */
import { lazy } from "react";

// 라우트별 코드 스플리팅 — 각 페이지를 별도 청크로 분리해 진입 번들을 가볍게 한다.
// (특히 MapView는 mapbox-gl을 끌어와 무거우므로 메인 진입 시점에 동반 로드되지 않게 한다.)
const MapView = lazy(() => import("../pages/MapView"));
const IntroPage = lazy(() => import("../pages/intro").then((m) => ({ default: m.IntroPage })));
const OnboardingPage = lazy(() =>
  import("../pages/onboarding").then((m) => ({ default: m.OnboardingPage })),
);
const ChatPage = lazy(() => import("../pages/chat").then((m) => ({ default: m.ChatPage })));
const Login = lazy(() => import("../pages/Login").then((m) => ({ default: m.Login })));
const SettingsView = lazy(() =>
  import("@/pages/SettingsView").then((m) => ({ default: m.SettingsView })),
);
const OauthCallback = lazy(() =>
  import("../pages/OauthCallback").then((m) => ({ default: m.OauthCallback })),
);

const routes = [
  // 지도(메인)
  {
    path: "/",
    element: <MapView />,
  },
  // 서비스 소개 인트로(캐러셀) — 로그인 전 진입 화면
  {
    path: "/intro",
    element: <IntroPage />,
  },
  // 온보딩
  {
    path: "/onboarding",
    element: <OnboardingPage />,
  },
  // AI 질문(채팅)
  {
    path: "/chat",
    element: <ChatPage />,
  },
  // 로그인
  {
    path: "/login",
    element: <Login />,
  },
  // 설정
  {
    path: "/setting",
    element: <SettingsView />,
  },
  // 구글 OAuth 콜백
  {
    path: "/oauth/google",
    element: <OauthCallback />,
  },
];

export default routes;
