import { Route, Routes, useLocation } from "react-router-dom";

import routes from "./navigator/routes";
import { useAuthInit } from "./shared/hooks/use-auth-init";

const NavPage = ["/"];

function App() {
  useAuthInit();
  const { pathname } = useLocation();

  return (
    <>
      {NavPage.includes(pathname)}
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </>
  );
}

export default App;
