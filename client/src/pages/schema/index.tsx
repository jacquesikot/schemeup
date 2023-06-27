import { useEffect, useRef, useState } from 'react';
import { Box, Divider, Grid, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useMutation, useQuery } from 'react-query';
import { useAuthState } from 'react-firebase-hooks/auth';

import SchemaCardItem from '../../components/schema/SchemaCardItem';
import MainSearchInput from '../../components/global/MainSearchInput';
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
import { deleteSchemaApi, getUserSchemasApi } from '../../api/schema';
import queryKeys from '../../utils/keys/query';
import { auth } from '../../firebase.config';
import useAppTab from '../../hooks/useAppTab';
import Switch from '../../components/global/Switch';
import SchemaTemplateCard from '../../components/schema/SchemaTemplateCard';
import PageController from '../../components/schema/PageController';

const Dashboard = () => {
  const theme = useTheme();
  const gridRef = useRef<any>(null);
  const { newAppTab } = useAppTab();
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const [prevScrollTop, setPrevScrollTop] = useState<number>(0);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [activeScreen, setActiveScreen] = useState<string>("My Schemas");
  const [activeSchema, setActiveSchema] = useState<any>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const schemas = useAppSelector((state) => state.schemas.schemas);
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
          const existingSchema = schemaMap.get(schema.id);
          // only set in map if not already set
          if (!existingSchema) {
            schemaMap.set(schema.id, schema);
          } else {
            // If both schemas have updatedAt, we keep the most recent one.
            if (schema.updatedAt && existingSchema.updatedAt) {
              if (new Date(schema.updatedAt) > new Date(existingSchema.updatedAt)) {
                schemaMap.set(schema.id, schema);
              }
            } else {
              // If one of them doesn't have updatedAt, we use the one from the response.
              schemaMap.set(schema.id, schema);
            }
          }
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
        dispatch(
          triggerSnack({
            message: 'Error fetching user schemas',
            severity: 'error',
            hideDuration: 3000,
          })
        );
      },
    }
  );

  const deleteSchemaMutation = useMutation(() => deleteSchemaApi(user!.uid, activeSchema.id), {
    onSuccess: () => {
      dispatch(deleteSchema(activeSchema.id));
      setOpenDeleteModal(false);
      dispatch(triggerSnack({ message: 'Schema deleted', severity: 'success', hideDuration: 3000 }));
    },
    onError: (err) => {
      dispatch(triggerSnack({ message: 'Error deleting schema', severity: 'error', hideDuration: 3000 }));
    },
  });

  const handlePageChange = (newPage: any) => {
    // Perform any necessary logic or API calls here
    // For demonstration purposes, we'll just log the new page number
    console.log('Navigating to page', newPage);

    // Update the current page state in your parent component
    // For example:
    setCurrentPage(newPage);
  };


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
        hasUnsavedChanges: s.hasUnsavedChanges,
        userId: s.userId,
        users: s.users,
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
        userId: user!.uid as string,
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

      <Box display={'flex'} height={80} borderBottom={1} borderColor={'#EAECF0'} justifyContent={'space-between'} alignItems={'center'} px={2}>
        <MainSearchInput placeholder="Search Schemas" />
        <Box width={330}>
          <Switch value={activeScreen} setValue={setActiveScreen} badgeValue={0} tabs={["My Schemas", "Templates"]} />
        </Box>
      </Box>
      {/* </Box> */}

      {/* HEADER-END */}

      <Grid container height={"100%"}>
        {activeScreen === "My Schemas" ?
          (<Grid item md={12} lg={9.5}>
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
                          isShared={user?.uid !== item.userId || item.users?.length > 0}
                          hasUnsavedChanges={item.hasUnsavedChanges}
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
            {/* DELETE MODAL */}
            <DeleteSchemaModal
              deleteLoading={deleteSchemaMutation.isLoading}
              open={openDeleteModal}
              handleClose={() => setOpenDeleteModal(false)}
              handleSchemaDelete={() => deleteSchemaMutation.mutate()}
              schemaId={activeSchema?.id}
              containerStyle={{
                width: '400px',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                padding: '20px',
              }}
            />
          </Grid>
          ) : (
            <Grid item md={12} lg={9.5}>
              <Box
                marginTop={1.5} px={2}
                display={"flex"}
                gap={3}
                maxHeight={'75vh'}
                alignContent={'flex-start'}
                flexWrap={'wrap'}
                sx={{
                  overflowY: 'scroll' /* To allow main grid scroll vertically but not entire screen */,
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
                }}>
                <SchemaTemplateCard />
                <SchemaTemplateCard />
                <SchemaTemplateCard />
                <SchemaTemplateCard />
                <SchemaTemplateCard />
                <SchemaTemplateCard />
                <SchemaTemplateCard />
              </Box>
            </Grid>
          )}
        <Divider orientation="vertical" flexItem sx={{ height: "100%" }} />
        {/* FILTER SYSTEM GRID FOR SCHEMAS AND TEMPLATES */}
        <Grid item md={0} lg={2} px={2} py={2} mx={"auto"}>
          <Box position={"relative"} minHeight={"95%"} justifyContent={"center"}>
            {/* Filter system goes here... */}

            <Box position={"absolute"} bottom={5}>
              <PageController currentPage={currentPage} totalPages={10} onPageChange={handlePageChange} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;