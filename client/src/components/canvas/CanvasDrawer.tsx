import { Box, Fade } from '@mui/material';
import { useRef } from 'react';

export const CANVAS_DRAWER_WIDTH = 365;

interface CanvasDrawerProps {
  open?: boolean;
  children: any;
}

const CanvasDrawer = ({ open, children }: CanvasDrawerProps) => {
  const containerRef = useRef<any>(null);

  return (
    <Box ref={containerRef} overflow={'hidden'}>
      <Fade in={open}>
        <Box
          display={'flex'}
          bgcolor={'white'}
          borderLeft={1}
          borderColor={'#EAECF0'}
          width={CANVAS_DRAWER_WIDTH}
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
