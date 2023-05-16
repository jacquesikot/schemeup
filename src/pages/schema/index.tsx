import { Box } from '@mui/material';
import SchemaCardItem from '../../components/schema/SchemaCardItem';
import SchemaHeader from '../../components/schema/SchemaHeader';
import styled from '@emotion/styled';
import InputSearchIcon from '../../images/icons/InputSeachIcon';
import data from './data';

const Input = styled('input')({
  borderRadius: 8,
  width: 400,
  height: 44,
  border: '1px solid #EAECF0',
  color: '#667085',
  fontFamily: 'Inter',
  fontWeight: 500,
  fontSize: 14,
  letterSpacing: '0.02em',
  paddingLeft: 40,
});

const Dashboard = () => {
  return (
    <Box bgcolor={'white'}>
      {/* HEADER */}
      <SchemaHeader />

      <Box display={'flex'} height={68} borderBottom={1} borderColor={'#EAECF0'} alignItems={'center'} pl={2}>
        <Input placeholder="Search" />
        <Box position={'absolute'} marginLeft={1.5} mt={0.5}>
          <InputSearchIcon />
        </Box>
      </Box>

      <Box display={'flex'} flexWrap={'wrap'}>
        {data.map((item) => (
          <SchemaCardItem title={item.title} description={item.description} noOfTables={item.noOfTables.toString()} />
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard;
