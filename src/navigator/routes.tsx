import { SettingsView } from "@/pages/SettingsView";

import Login from "../pages/Login";
import MapView from "../pages/MapView";

const routes = [
  // 지도(메인)
  {
    path: "/",
    element: <MapView />,
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
];

export default routes;
