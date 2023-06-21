import { CircularProgress, Button as MuiButton } from '@mui/material';
import { ReactNode } from 'react';
import { useTheme } from '@mui/material/styles';

interface ButtonProps {
  label: string;
  width?: number | string;
  height?: number | string;
  type: 'primary' | 'secondary' | 'error';
  icon?: ReactNode;
  style?: React.CSSProperties;
  isLoading?: boolean;
  isLoadingText?: string;
  onClick?: (e: any) => void;
  disabled?: boolean;
  disableRipple?: boolean;
}

const Button = ({
  label,
  width,
  height = 40,
  type,
  icon,
  style,
  onClick,
  isLoading,
  isLoadingText = 'Loading...',
  disabled,
  disableRipple,
}: ButtonProps) => {
  const theme = useTheme();
  const colors = theme.palette;
  const returnButtonColors = () => {
    if (type === 'primary') {
      return {
        bg: disabled ? colors.grey[100] : '#6941C6',
        hover: disabled ? colors.grey[100] : '#512DA8',
        active: disabled ? colors.grey[100] : '#371F7E',
        text: 'white',
      };
    }
    if (type === 'secondary') {
      return {
        bg: disabled ? '#EEE' : '#FFF',
        hover: disabled ? '#EEE' : '#F7F7F7',
        active: disabled ? '#EEE' : '#F2F2F2',
        text: '#344054',
      };
    }
    if (type === 'error') {
      return {
        bg: disabled ? '#A66' : '#D92D20',
        hover: disabled ? '#A66' : '#D32F2F',
        active: disabled ? '#A66' : '#B71C1C',
        text: 'white',
      };
    }
    return {
      bg: '#6941C6',
      hover: '#512DA8',
      active: '#371F7E',
      text: 'white',
    };
  };

  return (
    <MuiButton
      startIcon={
        isLoading ? <CircularProgress sx={{ color: returnButtonColors().text }} size={20} thickness={2} /> : icon
      }
      onClick={onClick}
      disabled={disabled}
      disableRipple={disableRipple}
      style={style}
      sx={{
        width,
        height,
        borderRadius: '8px',
        bgcolor: returnButtonColors().bg,
        border: `${type === 'primary' ? '0' : '1.5'}px solid #D0D5DD`,
        color: returnButtonColors().text,
        fontWeight: 600,
        fontSize: 15,
        letterSpacing: '0.02em',
        textTransform: 'none',
        paddingLeft: 3,
        paddingRight: 3,
        transition: 'background-color 0.3s',
        '&:hover': {
          bgcolor: disabled ? returnButtonColors().bg : returnButtonColors().hover,
        },
        '&:active': {
          bgcolor: disabled ? returnButtonColors().bg : returnButtonColors().active,
        },
      }}
    >
      {isLoading ? isLoadingText : label}
    </MuiButton>
  );
};

export default Button;
