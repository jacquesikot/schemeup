import { useEffect, useRef, useState } from 'react';
import { Box, Grid, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useQuery } from 'react-query';
import { useAuthState } from 'react-firebase-hooks/auth';

import SchemaCardItem from '../../components/schema/SchemaCardItem';
import MainSeachInput from '../../components/MainSearchInput';
import DashboardHeader from '../../components/global/DashboardHeader';
import Button from '../../components/global/Button';
import TopBarPlus from '../../images/icons/Plus';
import generateSchemaName from '../../utils/generateSchemaName';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Schema, deleteSchema, newSchema, setSchemas } from '../../redux/slice/schemas';
import routes from '../../routes';
import { hideCodeEditor, triggerSnack } from '../../redux/slice/app';
import DeleteSchemaModal from '../../components/modals/DeleteSchemaModal';
import EmptyState from '../../components/global/EmptyState';
import { getUserSchemasApi } from '../../api/schema';
import queryKeys from '../../utils/keys/query';
import { auth } from '../../firebase.config';
import useAppTab from '../../hooks/useAppTab';

const Dashboard = () => {
  const theme = useTheme();
  const gridRef = useRef<any>(null);
  const { newAppTab } = useAppTab();
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const [prevScrollTop, setPrevScrollTop] = useState<number>(0);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const schemas = useAppSelector((state) => state.schemas.schemas);
  const [activeSchema, setActiveSchema] = useState<any>();
  const dispatch = useAppDispatch();
  const [user] = useAuthState(auth);
  const { isLoading: fetchUserSchemaLoading } = useQuery(
    [queryKeys.USER_SCHEMAS, user?.uid],
    () => {
      return getUserSchemasApi(user!.uid);
    },
    {
      enabled: !!user?.uid,
      onSuccess: (res) => {
        // create a new Map
        const schemaMap = new Map();

        // iterate over the existing schemas
        schemas.forEach((schema) => {
          schemaMap.set(schema.id, schema);
        });

        // iterate over the fetched schemas
        res.forEach((schema: Schema) => {
          schemaMap.set(schema.id, schema);
        });

        // convert the Map back to an array
        const uniqueSchemas = Array.from(schemaMap.values());

        dispatch(
          setSchemas(
            uniqueSchemas.map((s) => {
              return {
                ...s,
                meta: {
                  showColumns: true,
                },
                activeTable: '',
              };
            })
          )
        );
      },
      onError: (err) => {
        dispatch(triggerSnack({ message: 'Error fetching user schemas', severity: 'error', hideDuration: 3000 }));
      },
    }
  );

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
    if (gridElement) {
      gridElement.addEventListener('scroll', handleScroll);

      return () => {
        gridElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isHeaderVisible, prevScrollTop]);

  // Do not allow codeEditor show up when user is in dashboard
  useEffect(() => {
    dispatch(hideCodeEditor());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const data = schemas
    ? schemas.map((s) => {
        return {
          id: s.id,
          title: s.title,
          description: s.description,
          noOfTables: s.tables?.length || 0,
        };
      })
    : [];

  // Calculate the number of placeholder items needed in the last row
  const remainingItems = data.length % itemsPerRow;
  const placeholderItemsCount = remainingItems === 0 ? 0 : itemsPerRow - remainingItems;

  // Create an array of all items including the data items and placeholder items
  const allItems = fetchUserSchemaLoading
    ? [
        ...Array(6).fill({
          title: '',
          description: '',
          noOfTables: 0,
        }),
      ]
    : [
        ...data,
        ...Array(placeholderItemsCount).fill({
          title: '',
          description: '',
          noOfTables: 0,
        }),
      ];

  const handleNewSchema = () => {
    const id = uuidv4();
    const newSchemaName = generateSchemaName();
    dispatch(
      newSchema({
        id: id,
        title: newSchemaName,
        tables: [],
      })
    );
    newAppTab(`${routes.EDIT_SCHEMA}/${id}`);
  };

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

      <DashboardHeader
        title="Schemas"
        dataCount={data.length > 0 ? data.length : undefined}
        subtitle="Manage and export your schemas"
        isLoading={fetchUserSchemaLoading}
        actionButtons={
          <>
            <Button
              label={'New Schema'}
              type={'primary'}
              icon={<TopBarPlus color="#FFF" />}
              onClick={handleNewSchema}
            />
          </>
        }
      />

      <Box display={'flex'} height={80} borderBottom={1} borderColor={'#EAECF0'} alignItems={'center'} pl={2}>
        <MainSeachInput placeholder="Search Schemas" />
      </Box>
      {/* </Box> */}

      {/* HEADER-END */}
      {allItems.length === 0 ? (
        // Render the EmptyState component when data is empty
        <Box marginTop={'20%'}>
          <EmptyState
            title="No schemas found"
            message="Create a new schema or import an existing one to get started."
            actionButtons={
              <>
                <Button
                  label="New Schema"
                  type={'primary'}
                  icon={<TopBarPlus color="#FFF" />}
                  onClick={handleNewSchema}
                />
              </>
            }
          />
        </Box>
      ) : (
        <Grid
          // ref={gridRef}
          container
          // maxHeight={isHeaderVisible ? '75vh' : '100vh'}
          maxHeight={'75vh'}
          pt={5}
          pb={5}
          // justifyContent={'center'}
          ml={1.5}
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
          {allItems.map((item) => (
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
                    handleDelete={() => {
                      setActiveSchema(item);
                      setOpenDeleteModal(true);
                    }}
                  />
                </Box>
              ) : fetchUserSchemaLoading ? (
                <>
                  <Box display="flex" justifyContent="center" alignItems="center" maxWidth="343px" height="174px" p={1}>
                    <Skeleton
                      variant="rectangular"
                      animation="pulse"
                      width={'343px'}
                      height={174}
                      sx={{ borderRadius: '12px' }}
                    />
                  </Box>
                </>
              ) : (
                <Box width={'343px'} />
              )}
            </Grid>
          ))}
        </Grid>
      )}

      <DeleteSchemaModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        handleSchemaDelete={() => dispatch(deleteSchema(activeSchema.id))}
        itemId={activeSchema?.id}
        containerStyle={{
          width: '400px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          padding: '20px',
        }}
      />
    </Box>
  );
};

export default Dashboard;
