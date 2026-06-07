import { Route, Routes, useLocation } from "react-router-dom";

import { useAuthInit } from "./shared/hooks/use-auth-init";
import routes from "./navigator/routes";
import Navbar from "./shared/Navbar";

const NavPage = ["/"];

function App() {
  useAuthInit();
  const { pathname } = useLocation();

  return (
    <>
      {NavPage.includes(pathname) && <Navbar />}
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </>
  );
}

export default App;
