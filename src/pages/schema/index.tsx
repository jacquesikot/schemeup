import { Box, Button, IconButton, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens();

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* <Header title="DASHBOARD" subtitle="Welcome to your dashboard" /> */}
        <h3>Schema Home</h3>
      </Box>
    </Box>
  );
};

export default Dashboard;
