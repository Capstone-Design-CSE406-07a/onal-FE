import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
a {
  text-decoration: none;
  color: inherit;
}
*{
  box-sizing: border-box;
}
body{
  background-color: #ffffff;
}
body, html, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: "Pretendard";
  }
  #root {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    background-color: white;
  }
`;
export default GlobalStyles;
