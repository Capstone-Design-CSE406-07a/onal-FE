import { Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import routes from "./navigator/routes";
import { useAuthInit } from "./shared/hooks/use-auth-init";
import { Navbar } from "./shared/ui/Navbar";

const NAV_PATHS = ["/", "/setting"];

function RouteFallback() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

function App() {
  useAuthInit();
  const { pathname } = useLocation();

  return (
    <>
      {NAV_PATHS.includes(pathname) && <Navbar />}
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
