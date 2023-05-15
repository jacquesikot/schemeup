import { Box, Fade } from '@mui/material';
import { useRef } from 'react';

interface CanvasDrawerProps {
  open?: boolean;
  toggleOpen?: (open: boolean) => void;
  children: any;
}

const CanvasDrawer = ({ open, toggleOpen, children }: CanvasDrawerProps) => {
  const containerRef = useRef<any>(null);

  return (
    <Box ref={containerRef} overflow={'hidden'}>
      <Fade in={open}>
        <Box
          display={'flex'}
          bgcolor={'white'}
          borderLeft={1}
          borderColor={'#EAECF0'}
          width={320}
          height={'100%'}
          position={'absolute'}
          right={0}
          zIndex={1000}
        >
          {children}
        </Box>
      </Fade>
    </Box>
  );
};

export default CanvasDrawer;
