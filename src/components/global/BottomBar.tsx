import { Box, Typography } from '@mui/material';

const BottomBar = () => {
  return (
    <Box
      display={'flex'}
      position={'absolute'}
      bottom={0}
      bgcolor={'white'}
      height={'44px'}
      zIndex={3000}
      width={'100%'}
      borderTop={1}
      borderColor={'divider'}
      alignItems={'center'}
      justifyContent={'space-between'}
      paddingX={2}
    >
      <Typography fontSize={'14px'} fontWeight={500} color={'#475467'} letterSpacing={1}>
        v1.12.3
      </Typography>

      <Box display={'flex'} alignItems={'center'} bgcolor={'#ECFDF3'} borderRadius={12} paddingX={1} paddingY={0.5}>
        <Box width={8} height={8} borderRadius={4} bgcolor={'#219653'} mr={1} />
        <Typography fontSize={12} fontWeight={500} color={'#027A48'}>
          Online
        </Typography>
      </Box>
    </Box>
  );
};

export default BottomBar;
