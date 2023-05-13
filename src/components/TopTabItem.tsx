import { Box, IconButton, Typography } from '@mui/material';
import React from 'react';
import { tokens } from '../theme';
import TopBarX from '../images/icons/TopBarX';
import { useAppDispatch } from '../redux/hooks';
import { removeTab } from '../redux/slice/apptabs';

interface TopTabItemProps {
  id: number;
  active: boolean;
  title: string;
  data?: any;
}

export default function TopTabItem({ active, title, data, id }: TopTabItemProps) {
  const colors = tokens();
  const dispatch = useAppDispatch();
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

      <Box justifyContent={'center'} alignItems={'center'} display={'flex'} color={colors.primary[900]}>
        <IconButton onClick={() => dispatch(removeTab(id))}>
          <TopBarX />
        </IconButton>
      </Box>
    </Box>
  );
}
