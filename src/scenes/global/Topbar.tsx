import { Box } from '@mui/material';

import TopTabItem from '../../components/TopTabItem';
import { tokens } from '../../theme';
import TopBarPlus from '../../images/icons/TopBarPlus';
import { useLocation } from 'react-router-dom';

interface TopBarProps {
  items: any[];
}

export default function Topbar({ items }: TopBarProps) {
  const colors = tokens();
  const { pathname } = useLocation();
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      height={44}
      bgcolor={'white'}
      borderBottom={1}
      borderColor={colors.grey[900]}
    >
      {items.map((i) => (
        <TopTabItem active={i.route === pathname ? true : false} title={i.title} id={i.id} />
      ))}

      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        width={50}
        height={'100%'}
        bgcolor={colors.primary[50]}
      >
        <TopBarPlus />
      </Box>
    </Box>
  );
}
