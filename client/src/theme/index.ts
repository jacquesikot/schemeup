import { createTheme as createMuiTheme } from '@mui/material';
import { createPalette } from './create-palette';
import { createShadows } from './create-shadows';
import { createTypography } from './create-typography';

export function createTheme() {
  const palette = createPalette();
  const shadows = createShadows();
  const typography = createTypography();

  return createMuiTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1440,
      },
    },
    palette,
    shadows: shadows as any,
    shape: {
      borderRadius: 8,
    },
    typography: typography as any,
  });
}

// import { createContext, useMemo } from 'react';
// import { createTheme } from '@mui/material/styles';

// // color design tokens export
// export const tokens = () => ({
//   grey: {
//     100: '#141414',
//     200: '#292929',
//     300: '#3d3d3d',
//     400: '#525252',
//     500: '#666666',
//     600: '#858585',
//     700: '#a3a3a3',
//     800: '#c2c2c2',
//     900: '#EAECF0',
//   },
//   primary: {
//     50: '#F9F5FF',
//     100: '#F4EBFF',
//     200: '#E9D7FE',
//     300: '#D6BBFB',
//     400: '#B692F6',
//     500: '#9E77ED',
//     600: '#7F56D9',
//     700: '#6941C6',
//     800: '#53389E',
//     900: '#42307D',
//   },
//   greenAccent: {
//     100: '#0f2922',
//     200: '#1e5245',
//     300: '#2e7c67',
//     400: '#3da58a',
//     500: '#4cceac',
//     600: '#70d8bd',
//     700: '#94e2cd',
//     800: '#b7ebde',
//     900: '#dbf5ee',
//   },
//   redAccent: {
//     100: '#2c100f',
//     200: '#58201e',
//     300: '#832f2c',
//     400: '#af3f3b',
//     500: '#db4f4a',
//     600: '#e2726e',
//     700: '#e99592',
//     800: '#f1b9b7',
//     900: '#f8dcdb',
//   },
//   blueAccent: {
//     100: '#151632',
//     200: '#2a2d64',
//     300: '#3e4396',
//     400: '#535ac8',
//     500: '#6870fa',
//     600: '#868dfb',
//     700: '#a4a9fc',
//     800: '#c3c6fd',
//     900: '#e1e2fe',
//   },
// });

// // mui theme settings
// export const themeSettings = () => {
//   const colors = tokens();
//   return {
//     palette: {
//       // palette values for light mode
//       primary: {
//         main: colors.primary[700],
//       },
//       secondary: {
//         main: colors.greenAccent[500],
//       },
//       neutral: {
//         dark: colors.grey[700],
//         main: colors.grey[500],
//         light: colors.grey[100],
//       },
//       background: {
//         default: '#fcfcfc',
//       },
//     },
//     typography: {
//       fontFamily: ['Inter', 'sans-serif'].join(','),
//       fontSize: 12,
//       h1: {
//         fontFamily: ['Inter', 'sans-serif'].join(','),
//         fontSize: 40,
//       },
//       h2: {
//         fontFamily: ['Inter', 'sans-serif'].join(','),
//         fontSize: 32,
//       },
//       h3: {
//         fontFamily: ['Inter', 'sans-serif'].join(','),
//         fontSize: 24,
//       },
//       h4: {
//         fontFamily: ['Inter', 'sans-serif'].join(','),
//         fontSize: 20,
//       },
//       h5: {
//         fontFamily: ['Inter', 'sans-serif'].join(','),
//         fontSize: 16,
//       },
//       h6: {
//         fontFamily: ['Inter', 'sans-serif'].join(','),
//         fontSize: 14,
//       },
//       tableTitle: {
//         fontFamily: ['Work Sans', 'sans serif'].join(','),
//       },
//       tableColumns: {
//         fontFamily: ['IBM Plex Mono', 'monospace'].join(','),
//       },
//     },
//   };
// };

// // context for color mode
// export const ColorModeContext = createContext({
//   toggleColorMode: () => {},
// });

// export const useMode = () => {
//   const theme = useMemo(() => createTheme(themeSettings()), []);
//   return [theme];
// };
