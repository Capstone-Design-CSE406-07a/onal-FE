import { Route, Routes } from "react-router-dom";

import routes from "./navigator/routes";
import Navbar from "./shared/Navbar";

const NavPage = ["/"];

function App() {
  return (
    <>
      {NavPage.includes(location.pathname) && <Navbar />}
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </>
  );
}

export default App;
