import { Button as MuiButton } from '@mui/material';
import { ReactNode } from 'react';

interface ButtonProps {
  label: string;
  width?: number | string;
  height?: number | string;
  type: 'primary' | 'secondary';
  icon?: ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
}

const Button = ({ label, width, height = 40, type, icon, style, onClick }: ButtonProps) => {
  return (
    <MuiButton
      startIcon={icon}
      onClick={onClick}
      style={style}
      sx={{
        width,
        height,
        borderRadius: '8px',
        bgcolor: type === 'primary' ? '#6941C6' : '#FFF',
        border: `${type === 'primary' ? '0' : '1.5'}px solid #D0D5DD`,
        color: type === 'primary' ? 'white' : '#344054',
        fontWeight: 600,
        fontSize: 14,
        letterSpacing: '0.02em',
        textTransform: 'none',
        paddingLeft: 2,
        paddingRight: 2,
        transition: 'background-color 0.3s',
        '&:hover': {
          bgcolor: type === 'primary' ? '#512DA8' : '#F7F7F7',
        },
        '&:active': {
          bgcolor: type === 'primary' ? '#371F7E' : '#F2F2F2',
        },
      }}
    >
      {label}
    </MuiButton>
  );
};

export default Button;
