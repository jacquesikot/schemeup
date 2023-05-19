import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import SchemaCardItem from '../../components/schema/SchemaCardItem';
import data from './data';
import MainSeachInput from '../../components/MainSeachInput';
import DashboardHeader from '../../components/global/DashboardHeader';
import Button from '../../components/global/Button';
import SchemaButtonUpload from '../../images/icons/schema/SchemaButtonUpload';
import TopBarPlus from '../../images/icons/Plus';
import newAppTab from '../../utils/newAppTab';
import generateSchemaName from '../../utils/generateSchemaName';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useState } from 'react';
import DeleteModal from '../../components/global/DeleteModal';

const Dashboard = () => {
  const theme = useTheme();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const tabs = useAppSelector((state) => state.appTabs.tabs);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const xsScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const smScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const mdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const lgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const xlScreen = useMediaQuery(theme.breakpoints.up('xl'));

  let itemsPerRow = 4; // Default number of items per row

  if (xsScreen) {
    itemsPerRow = 1;
  } else if (smScreen) {
    itemsPerRow = 2;
  } else if (mdScreen) {
    itemsPerRow = 3;
  } else if (lgScreen) {
    itemsPerRow = 4;
  } else if (xlScreen) {
    itemsPerRow = 6;
  }

  // Calculate the number of placeholder items needed in the last row
  const remainingItems = data.length % itemsPerRow;
  const placeholderItemsCount = remainingItems === 0 ? 0 : itemsPerRow - remainingItems;

  // Create an array of all items including the data items and placeholder items
  const allItems = [...data, ...Array(placeholderItemsCount).fill({ title: '', description: '', noOfTables: 0 })];
  return (
    <Box bgcolor={'white'} display={'flex'} flexDirection={'column'} height={'95%'} id="dashboard-box">
      {/* HEADER */}
      <DashboardHeader
        title="Schemas"
        dataCount={data.length}
        subtitle="Manage and export your schemas"
        actionButtons={
          <>
            <Button label={'Upload'} type={'secondary'} icon={<SchemaButtonUpload />} style={{ marginRight: 10 }} />
            <Button
              label={'New Schema'}
              type={'primary'}
              icon={<TopBarPlus color="#FFF" />}
              onClick={(e: any) => {
                const newSchemaName = generateSchemaName();
                newAppTab(dispatch, `Schema - ${newSchemaName}`, `/schema/new/${newSchemaName}`, tabs, navigate);
              }}
            />
          </>
        }
      />

      <Box display={'flex'} height={80} borderBottom={1} borderColor={'#EAECF0'} alignItems={'center'} pl={2}>
        <MainSeachInput placeholder="Search Schemas" />
      </Box>

      <Grid
        container
        maxHeight={window.innerHeight * 0.7}
        mt={5}
        justifyContent={'center'}
        alignContent={'flex-start'}
        style={{
          overflowY: 'hidden',
        }}
      >
        {allItems.map((item, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={item.id}
            mb={2}
            style={{
              maxWidth: '343px',
              height: '174px',
            }}
          >
            {item.title !== '' && (
              <Box display="flex" justifyContent="center" alignItems="center" maxWidth="343px" height="174px" p={1}>
                <SchemaCardItem
                  title={item.title}
                  description={item.description}
                  noOfTables={item.noOfTables.toString()}
                  handleDelete={() => {
                    setOpenDeleteModal(true);
                  }}
                />
              </Box>
            )}
          </Grid>
        ))}
      </Grid>

      <DeleteModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        containerStyle={{
          width: '400px',
          height: '260px',
          backgroundColor: '#FFFFFF',
        }}
      />
    </Box>
  );
};

export default Dashboard;
