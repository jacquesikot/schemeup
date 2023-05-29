import { Box, Typography } from '@mui/material';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  dataCount?: number;
  actionButtons?: React.ReactNode;
}

const DashboardHeader = ({ title, subtitle, dataCount, actionButtons }: DashboardHeaderProps) => {
  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      height={'96px'}
      width={'100%'}
      borderBottom={1}
      borderColor={'#EAECF0'}
      pl={2}
      pr={2}
    >
      <Box>
        <Box display={'flex'} alignItems={'center'}>
          <Typography fontSize={18} color={'#101828'} fontWeight={600}>
            {title}
          </Typography>
          {dataCount && (
            <Box
              ml={1}
              display={'flex'}
              pl={1}
              pr={1}
              bgcolor={'#F9F5FF'}
              height={22}
              justifyContent={'center'}
              alignItems={'center'}
              borderRadius={16}
            >
              <Typography color={'#6941C6'} fontWeight={500} fontSize={12}>
                {dataCount + ' ' + title}
              </Typography>
            </Box>
          )}
        </Box>

        <Typography fontSize={14} color={'#475467'}>
          {subtitle}
        </Typography>
      </Box>

      <Box>{actionButtons}</Box>
    </Box>
  );
};

export default DashboardHeader;
