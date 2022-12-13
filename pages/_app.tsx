import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { LightTheme } from '../styles/theme.styles';
import GlobalStyle from '../styles/global.styles';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={LightTheme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
