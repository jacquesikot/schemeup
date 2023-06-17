import { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

import emptyStateIcon from '../../images/empty_state_icon.svg';

interface EmptyStateProps {
  title: string;
  message: string;
  actionButtons?: ReactNode;
}

const EmptyState = ({ title, message, actionButtons }: EmptyStateProps) => {
  return (
    <Box display={'flex'} flexDirection={'column'} width={512} m="auto" alignContent="center" alignItems="center">
      <img src={emptyStateIcon} alt="no schema" />
      <Box mt={2} sx={{ width: 352 }}>
        <Typography textAlign="center" variant="h6" sx={{ fontWeight: 600, fontSize: 18 }}>
          {title}
        </Typography>
        <Typography textAlign="center" variant="subtitle2" sx={{ fontWeight: 400, fontSize: 14, marginTop: 2 }}>
          {message}
        </Typography>
      </Box>
      <Box mt={4}>{actionButtons}</Box>
    </Box>
  );
};

export default EmptyState;
