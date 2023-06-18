import { Box, Skeleton, Typography } from '@mui/material';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  dataCount?: number;
  isLoading?: boolean;
  actionButtons?: React.ReactNode;
}

const DashboardHeader = ({ title, subtitle, dataCount, actionButtons, isLoading }: DashboardHeaderProps) => {
  const dataCountLoading = isLoading ? 1 : dataCount;
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
          {dataCountLoading &&
            (isLoading ? (
              <Box ml={1} height={22} width={60} borderRadius={16}>
                <Skeleton />
              </Box>
            ) : (
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
            ))}
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
