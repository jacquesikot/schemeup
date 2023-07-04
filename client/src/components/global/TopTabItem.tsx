import { Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import TopBarX from '../../images/icons/TopBarX';
import { useAppDispatch } from '../../redux/hooks';
import { Tab, removeTab } from '../../redux/slice/apptabs';

interface TopTabItemProps {
  active: boolean;
  title: string;
  index: number;
  tabs: Tab[];
  width: number;
  meta?: { id: string; type: string };
}

export default function TopTabItem({ active, title, index, tabs, width, meta }: TopTabItemProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        cursor: 'pointer',
      }}
      display={'flex'}
      flexGrow={1}
      width={width}
      justifyContent={'space-between'}
      alignItems={'center'}
      pl={2}
      pr={2}
      bgcolor={active ? theme.palette.primary.light : '#FFF'}
      height={'100%'}
      borderRight={1}
      borderColor={theme.palette.grey[300]}
    >
      <Tooltip title={title}>
        <Typography
          fontSize={13}
          fontWeight={500}
          color={active ? theme.palette.primary.main : theme.palette.grey[700]}
          width={'100%'}
          height={'100%'}
          alignItems={'center'}
          justifyContent={'center'}
          display={'flex'}
          noWrap
          textAlign={'center'}
          onClick={() => {
            navigate(tabs[index].route);
          }}
        >
          {title}
        </Typography>
      </Tooltip>

      {tabs.length > 1 && (
        <Box
          justifyContent={'center'}
          alignItems={'center'}
          display={'flex'}
          color={theme.palette.primary.main}
          zIndex={1}
        >
          <IconButton
            onClick={() => {
              const indexValue = index - 1 < 0 ? 1 : index - 1;
              if (active) {
                dispatch(removeTab(title));
                navigate(tabs[indexValue].route);
              } else {
                dispatch(removeTab(title));
              }
            }}
          >
            <TopBarX />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
