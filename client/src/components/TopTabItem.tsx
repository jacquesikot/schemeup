import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import { tokens } from '../theme';
import TopBarX from '../images/icons/TopBarX';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { Tab, removeTab } from '../redux/slice/apptabs';

interface TopTabItemProps {
  active: boolean;
  title: string;
  index: number;
  tabs: Tab[];
  width: number;
  meta?: { id: string; type: string };
}

export default function TopTabItem({ active, title, index, tabs, width, meta }: TopTabItemProps) {
  const colors = tokens();
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
      bgcolor={active ? colors.primary[50] : '#FFF'}
      height={44}
      borderRight={1}
      borderColor={colors.grey[900]}
    >
      <Tooltip title={title}>
        <Typography
          variant="h5"
          fontWeight={600}
          color={active ? '#6941C6' : '#667085'}
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
        <Box justifyContent={'center'} alignItems={'center'} display={'flex'} color={colors.primary[900]} zIndex={1}>
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
