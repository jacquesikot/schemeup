import { Box, IconButton, Typography } from '@mui/material';
import { tokens } from '../theme';
import TopBarX from '../images/icons/TopBarX';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { removeTab } from '../redux/slice/apptabs';
import { useLocation, useNavigate } from 'react-router-dom';

interface TopTabItemProps {
  active: boolean;
  title: string;
  index: number;
}

export default function TopTabItem({ active, title, index }: TopTabItemProps) {
  const colors = tokens();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const tabs = useAppSelector((state) => state.appTabs.tabs);

  const activeTab = tabs.filter((t) => t.title === title)[0].route === pathname;
  return (
    <Box
      display={'flex'}
      width={266}
      justifyContent={'space-between'}
      alignItems={'center'}
      pl={2}
      pr={2}
      bgcolor={active ? colors.primary[50] : '#FFF'}
      height={'100%'}
      borderRight={1}
      borderColor={colors.grey[900]}
    >
      <Typography
        variant="h5"
        fontWeight={600}
        color={active ? '#6941C6' : '#667085'}
        width={'100%'}
        textAlign={'center'}
      >
        {title}
      </Typography>

      {tabs.length > 1 && (
        <Box justifyContent={'center'} alignItems={'center'} display={'flex'} color={colors.primary[900]}>
          <IconButton
            onClick={() => {
              const newIndex = index - 1 >= 0 ? index - 1 : 0;
              if (activeTab) {
                dispatch(removeTab(title));
                navigate(tabs[newIndex].route);
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
