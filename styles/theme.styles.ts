import { DefaultTheme } from 'styled-components';

interface PaletteProps {
  100?: string;
  200?: string;
  300?: string;
  400?: string;
  500: string;
  600?: string;
  700?: string;
  800?: string;
  900?: string;
}

interface FeedbackProps {
  success: PaletteProps;
  warning: PaletteProps;
  error: PaletteProps;
}

export interface ThemeType {
  id: string;
  feedback: FeedbackProps;
  primary: PaletteProps;
  secondary: PaletteProps;
  highlight: PaletteProps;
  grayscale: PaletteProps;
  fonts: string[];
}

export const FeedbackColors: FeedbackProps = {
  success: {
    100: '#F5F7FF',
    200: '#ECF0FF',
    300: '#CFD9FE',
    400: '#9EB3FD',
    500: '#3E66FB',
    600: '#2E4CBC',
    700: '#1F337E',
  },
  warning: {
    100: '#Fefcf4',
    200: '#FEF8E8',
    300: '#fceec6',
    400: '#f9dd8d',
    500: '#f3bb1c',
    600: '#b68c15',
    700: '#7a5e0e',
  },
  error: {
    100: '#fef5f5',
    200: '#feebeb',
    300: '#fbcdcd',
    400: '#f89b9c',
    500: '#f03738',
    600: '#b4292a',
    700: '#781c1c',
  },
};

export const GrayscaleColors: PaletteProps = {
  100: '#fcfcfc',
  200: '#f9fafa',
  300: '#f0f2f4',
  400: '#e0e4e8',
  500: '#c2c9d1',
  600: '#91979d',
  700: '#616469',
  900: '#000000',
};

export const LightTheme: DefaultTheme = {
  id: 'light',
  feedback: FeedbackColors,
  grayscale: GrayscaleColors,
  primary: {
    100: '#f2fcf5',
    200: '#e5f8ea',
    300: '#bfeecb',
    400: '#80dd98',
    500: '#00bb31',
    600: '#008c25',
    700: '#005e18',
  },
  secondary: {
    100: '#f6f6f6',
    200: '#ececec',
    300: '#d1d1d1',
    400: '#a2a2a2',
    500: '#464646',
    600: '#343434',
    700: '#232323',
  },
  highlight: {
    100: '#f7f3fc',
    200: '#efe7f8',
    300: '#d6c4ee',
    400: '#ae89dd',
    500: '#5c13ba',
    600: '#430e8b',
    700: '#2e0a5d',
  },
  fonts: ['"Montserrat", "Futura", "Roboto", sans-serif'],
};
