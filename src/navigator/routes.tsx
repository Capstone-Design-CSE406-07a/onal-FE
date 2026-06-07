import { Login } from "../pages/Login";
import MapView from "../pages/MapView";
import { OauthCallback } from "../pages/OauthCallback";
import { OnboardingPage } from "../pages/onboarding";

const routes = [
  // 지도(메인)
  {
    path: "/",
    element: <MapView />,
  },
  // 온보딩
  {
    path: "/onboarding",
    element: <OnboardingPage />,
  },
  // 로그인
  {
    path: "/login",
    element: <Login />,
  },
  // 구글 OAuth 콜백
  {
    path: "/oauth/google",
    element: <OauthCallback />,
  },
];

export default routes;
