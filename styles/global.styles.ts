import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  padding: 0;
  border: none;
  outline: none;
  font: inherit;
  color: inherit;
  background: none;
  all: unset;
  cursor: pointer;
  box-sizing: border-box;
}

body {
  font-family: ${(props) => props.theme.fonts[0]};
  background: ${(props) => props.theme.grayscale[100]};
  overflow-x: hidden;
}

img, video {
  max-width: 100%;
  height: auto;
}

audio, canvas, embed, iframe, img, object, svg, video {
  display: block;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
}

/* ================== */
/* NextJS */
/* ================== */
html {
  height: 100%;
}

body,
#__next {
  height: 100%;
}
`;

export default GlobalStyle;
