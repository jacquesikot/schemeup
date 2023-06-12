import { Box, Fade } from '@mui/material';
import { useRef } from 'react';
import { useTheme } from '@mui/material/styles';

export const CANVAS_DRAWER_WIDTH = 460;

interface CanvasDrawerProps {
  open?: boolean;
  children: any;
}

const CanvasDrawer = ({ open, children }: CanvasDrawerProps) => {
  const theme = useTheme();
  const colors = theme.palette;
  const containerRef = useRef<any>(null);

  return (
    <Box ref={containerRef} overflow={'hidden'}>
      <Fade in={open}>
        <Box
          display={'flex'}
          bgcolor={'white'}
          borderLeft={1}
          borderColor={colors.divider}
          width={CANVAS_DRAWER_WIDTH}
          height={'100%'}
          position={'absolute'}
          right={0}
          zIndex={900}
        >
          {children}
        </Box>
      </Fade>
    </Box>
  );
};

export default CanvasDrawer;
