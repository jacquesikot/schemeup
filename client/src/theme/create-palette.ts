import { common } from '@mui/material/colors';
import { PaletteOptions, alpha } from '@mui/material/styles';
import { error, purple, info, neutral, success, warning } from './colors';

export function createPalette(): PaletteOptions {
  return {
    action: {
      active: neutral[500],
      disabled: alpha(neutral[900], 0.38),
      disabledBackground: alpha(neutral[900], 0.12),
      focus: alpha(neutral[900], 0.16),
      hover: alpha(neutral[900], 0.04),
      selected: alpha(neutral[900], 0.12),
    },
    background: {
      default: common.white,
      paper: common.white,
    },
    divider: '#EAECF0',
    error,
    info,
    mode: 'light',
    grey: neutral,
    primary: purple,
    success,
    text: {
      primary: neutral[900],
      secondary: neutral[500],
      disabled: alpha(neutral[900], 0.38),
    },
    warning,
  };
}
