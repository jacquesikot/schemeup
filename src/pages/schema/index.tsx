import { useEffect, useRef, useState } from 'react';
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import SchemaCardItem from '../../components/schema/SchemaCardItem';
// import data from './data';
import MainSeachInput from '../../components/MainSearchInput';
import DashboardHeader from '../../components/global/DashboardHeader';
import Button from '../../components/global/Button';
import SchemaButtonUpload from '../../images/icons/schema/SchemaButtonUpload';
import TopBarPlus from '../../images/icons/Plus';
import newAppTab from '../../utils/newAppTab';
import generateSchemaName from '../../utils/generateSchemaName';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { clearSchemas, newSchema } from '../../redux/slice/schemas';
import routes from '../../routes';
import DownloadSchemaModal from '../../components/modals/DownloadSchemaModal';

interface ModalActions {
  open: boolean;
  itemId?: string;
}

const Dashboard = () => {
  const theme = useTheme();
  const gridRef = useRef<any>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const [prevScrollTop, setPrevScrollTop] = useState<number>(0);
  const [downloadModal, toggleDownloadModal] = useState<ModalActions>({open: false});
  const tabs = useAppSelector((state) => state.appTabs.tabs);
  const schemas = useAppSelector((state) => state.schemas.schemas);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // for dev only
  // useEffect(() => {
  //   dispatch(clearSchemas());
  // }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = gridRef.current.scrollTop;

      if (scrollTop > prevScrollTop && isHeaderVisible) {
        setIsHeaderVisible(false); // Hide the header when scrolling down
      } else if (scrollTop < prevScrollTop && !isHeaderVisible) {
        setIsHeaderVisible(true); // Show the header when scrolling up
      }

      setPrevScrollTop(scrollTop);
    };

    const gridElement = gridRef.current;
    gridElement.addEventListener('scroll', handleScroll);

    return () => {
      gridElement.removeEventListener('scroll', handleScroll);
    };
  }, [isHeaderVisible, prevScrollTop]);

  const xsScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const smScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const mdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const lgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const xlScreen = useMediaQuery(theme.breakpoints.up('xl'));

  let itemsPerRow = 3; // Default number of items per row

  if (xsScreen) {
    itemsPerRow = 1;
  } else if (smScreen) {
    itemsPerRow = 2;
  } else if (mdScreen) {
    itemsPerRow = 3;
  } else if (lgScreen) {
    itemsPerRow = 3;
  } else if (xlScreen) {
    itemsPerRow = 4;
  }

  const data = schemas.map((s) => {
    return {
      id: s.id,
      title: s.title,
      description: s.description,
      noOfTables: s.tables?.length || 0,
    };
  });

  // Calculate the number of placeholder items needed in the last row
  const remainingItems = data.length % itemsPerRow;
  const placeholderItemsCount = remainingItems === 0 ? 0 : itemsPerRow - remainingItems;

  // Create an array of all items including the data items and placeholder items
  const allItems = [...data, ...Array(placeholderItemsCount).fill({ title: '', description: '', noOfTables: 0 })];

  return (
    <Box
      overflow={'hidden'}
      bgcolor={'white'}
      display={'flex'}
      flexDirection={'column'}
      height={'95%'}
      id="dashboard-box"
    >
      {/* HEADER-START */}

      {/* <Box className={`header ${isHeaderVisible ? 'visible' : ''}`}> */}
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
                const id = uuidv4();
                const newSchemaName = generateSchemaName();
                dispatch(newSchema({ id, title: newSchemaName, tables: [] }));
                newAppTab(dispatch, `Schema - ${newSchemaName}`, `${routes.EDIT_SCHEMA}/${id}`, tabs, navigate);
              }}
            />
          </>
        }
      />

      <Box display={'flex'} height={80} borderBottom={1} borderColor={'#EAECF0'} alignItems={'center'} pl={2}>
        <MainSeachInput placeholder="Search Schemas" />
      </Box>
      {/* </Box> */}

      {/* HEADER-END */}

      <Grid
        ref={gridRef}
        container
        // maxHeight={isHeaderVisible ? '75vh' : '100vh'}
        maxHeight={'75vh'}
        pt={5}
        pb={5}
        justifyContent={'center'}
        alignContent={'flex-start'}
        sx={{
          overflowY: 'auto' /* To allow main grid scroll vertically but not entire screen */,
          scrollbarWidth: 'none' /* Firefox */,
          '-ms-overflow-style': 'none' /* IE 10+ */,
          '&::-webkit-scrollbar': {
            width: 0,
            height: 0,
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'transparent',
          },
          '-webkit-overflow-scrolling': 'touch' /* For hide on scroll */,
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
            {item.title !== '' ? (
              <Box display="flex" justifyContent="center" alignItems="center" maxWidth="343px" height="174px" p={1}>
                <SchemaCardItem
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  noOfTables={item.noOfTables.toString()}
                  handleExport={() => {
                    toggleDownloadModal({open: true, itemId: item.id});
                  }}
                  handleDelete={() => {}}
                />
              </Box>
            ) : (
              <Box width={'343px'} />
            )}
          </Grid>
        ))}
      </Grid>

      {/* Exporting schema triggers Download Schema Modal */}
      <DownloadSchemaModal
        open={downloadModal.open}
        handleClose={() => toggleDownloadModal({open: false})}
        itemId={downloadModal.itemId}
        containerStyle={{
          width: '370px',
          height: '470px',
          backgroundColor: '#FFFFFF',
        }}
      />
    </Box>
  );
};

export default Dashboard;
