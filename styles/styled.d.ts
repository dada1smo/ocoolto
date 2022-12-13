import 'styled-components';
import { ThemeType } from './theme.styles';

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
