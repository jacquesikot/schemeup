import { Button as MuiButton } from '@mui/material';
import { ReactNode } from 'react';

interface ButtonProps {
  label: string;
  width?: number | string;
  height?: number | string;
  type: 'primary' | 'secondary';
  icon?: ReactNode;
}

const Button = ({ label, width, height = 40, type, icon }: ButtonProps) => {
  return (
    <MuiButton
      startIcon={icon}
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
        '&:hover': {
          bgcolor: type === 'primary' ? '#6941C6' : '#FFF',
        },
        '&:active': {
          bgcolor: type === 'primary' ? '#6941C6' : '#FFF',
        },
      }}
    >
      {label}
    </MuiButton>
  );
};

export default Button;
