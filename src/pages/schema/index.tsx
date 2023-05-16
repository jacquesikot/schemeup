import { Box, Grid } from '@mui/material';
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
    <Box bgcolor={'white'} display={'flex'} flexDirection={'column'} height={'95%'}>
      {/* HEADER */}
      <SchemaHeader />

      <Box display={'flex'} height={80} borderBottom={1} borderColor={'#EAECF0'} alignItems={'center'} pl={2}>
        <Input placeholder="Search" />
        <Box position={'absolute'} marginLeft={1.5} mt={0.5}>
          <InputSearchIcon />
        </Box>
      </Box>

      <Grid container alignSelf={'center'} width={'85%'} mt={5}>
        {data.map((item) => (
          <Grid xs={12} md={6} lg={3} key={item.id} mb={3}>
            <SchemaCardItem title={item.title} description={item.description} noOfTables={item.noOfTables.toString()} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
