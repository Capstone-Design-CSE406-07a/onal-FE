import { Route, Routes } from "react-router-dom";

import routes from "./navigator/routes";
import GlobalStyles from "./styles/GlobalStyles";

function App() {
  // const [showSplash, setShowSplash] = useState(true);
  return (
    <>
      <GlobalStyles />
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </>
  );
}

export default App;
