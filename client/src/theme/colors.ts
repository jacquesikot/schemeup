import { alpha } from '@mui/material/styles';

const withAlphas = (color: {
  lightest?: string;
  light?: string;
  main: any;
  dark?: string;
  darkest?: string;
  contrastText?: string;
}) => {
  return {
    ...color,
    alpha4: alpha(color.main, 0.04),
    alpha8: alpha(color.main, 0.08),
    alpha12: alpha(color.main, 0.12),
    alpha30: alpha(color.main, 0.3),
    alpha50: alpha(color.main, 0.5),
  };
};

export const neutral = {
  50: '#F9FAFB',
  100: '#F2F4F7',
  200: '#EAECF0',
  300: '#D0D5DD',
  400: '#98A2B3',
  500: '#667085',
  600: '#475467',
  700: '#344054',
  800: '#1D2939',
  900: '#101828',
};

export const purple = withAlphas({
  lightest: '#F9F5FF',
  light: '#F4EBFF',
  main: '#7F56D9',
  dark: '#53389E',
  darkest: '#42307D',
  contrastText: '#FFFFFF',
});

export const success = withAlphas({
  lightest: '#F6FEF9',
  light: '#6CE9A6',
  main: '#12B76A',
  dark: '#05603A',
  darkest: '#054F31',
  contrastText: '#FFFFFF',
});

export const info = withAlphas({
  lightest: '#F5FAFF',
  light: '#D1E9FF',
  main: '#53B1FD',
  dark: '#1849A9',
  darkest: '#194185',
  contrastText: '#FFFFFF',
});

export const warning = withAlphas({
  lightest: '#FFFCF5',
  light: '#FEF0C7',
  main: '#F79009',
  dark: '#93370D',
  darkest: '#7A2E0E',
  contrastText: '#FFFFFF',
});

export const error = withAlphas({
  lightest: '#FFFBFA',
  light: '#FEF3F2',
  main: '#F04438',
  dark: '#912018',
  darkest: '#7A271A',
  contrastText: '#FFFFFF',
});
