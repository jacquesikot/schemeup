import { Box } from '@mui/material';

const TableRow = () => {
  return (
    <Box bgcolor={'red'} height={40} width={768} color={'rgba(255, 255, 255, 0.2)'} border={1} borderColor={'#EAECF0'}>
      <Box />

      <Box>
        <p>cancel</p>
        <p>cancel</p>
      </Box>
    </Box>
  );
};

const Table = () => {
  return (
    <Box>
      <TableRow />
    </Box>
  );
};

export default Table;
