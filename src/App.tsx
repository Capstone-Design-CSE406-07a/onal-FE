import { Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import routes from "./navigator/routes";
import GlobalStyles from "./styles/GlobalStyles";
import Navbar from "./components/Navbar";

const NavPage = ['/'];

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();

  return (
    <>
      <GlobalStyles />
      {NavPage.includes(location.pathname) && <Navbar />}
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
    </>
  );
}

export default App;