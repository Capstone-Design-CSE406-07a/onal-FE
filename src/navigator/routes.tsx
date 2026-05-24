import Login from "../pages/Login";
import MapView from "../pages/MapView";
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
];

export default routes;
