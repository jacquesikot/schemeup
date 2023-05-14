import { Drawer } from '@mui/material';
import { ReactNode } from 'react';

interface CanvasDrawerProps {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
  children: ReactNode;
}

const CanvasDrawer = ({ open, toggleDrawer, children }: CanvasDrawerProps) => {
  return (
    <Drawer anchor={'right'} open={open} onClose={() => toggleDrawer(false)}>
      {children}
    </Drawer>
  );
};

export default CanvasDrawer;
