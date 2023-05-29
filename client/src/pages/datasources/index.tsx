import { Box, Button, IconButton, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';

const Datasources = () => {
  const theme = useTheme();
  const colors = tokens();

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h3>Datasources</h3>
      </Box>
    </Box>
  );
};

export default Datasources;
