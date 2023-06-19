import { Button as MuiButton } from '@mui/material';
import { ReactNode } from 'react';

interface ButtonProps {
  label: string;
  width?: number | string;
  height?: number | string;
  type: 'primary' | 'secondary' | 'error';
  icon?: ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
}

const Button = ({ label, width, height = 40, type, icon, style, onClick }: ButtonProps) => {
  const returnButtonColors = () => {
    if (type === 'primary') {
      return {
        bg: '#6941C6',
        hover: '#512DA8',
        active: '#371F7E',
        text: 'white',
      };
    }
    if (type === 'secondary') {
      return {
        bg: '#FFF',
        hover: '#F7F7F7',
        active: '#F2F2F2',
        text: '#344054',
      };
    }
    if (type === 'error') {
      return {
        bg: '#D92D20',
        hover: '#D32F2F',
        active: '#B71C1C',
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
      startIcon={icon}
      onClick={onClick}
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
        paddingLeft: 2,
        paddingRight: 2,
        transition: 'background-color 0.3s',
        '&:hover': {
          bgcolor: returnButtonColors().hover,
        },
        '&:active': {
          bgcolor: returnButtonColors().active,
        },
      }}
    >
      {label}
    </MuiButton>
  );
};

export default Button;
