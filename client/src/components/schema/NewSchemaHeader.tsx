import { Autocomplete, Box, FormHelperText, IconButton, Input, Tooltip, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';

// import Pointer from '../images/icons/canvas-controls/Pointer';
import Comment from '../../images/icons/canvas-controls/Comment';
import Table from '../../images/icons/canvas-controls/Table';
import Share from '../../images/icons/canvas-controls/Share';
import Settings from '../../images/icons/canvas-controls/Settings';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import EditableText from '../global/EditableText';
import { ForeignKey, Role, Schema, setNewChanges, updateSchema } from '../../redux/slice/schemas';
import ImportIcon from '../../images/icons/canvas-controls/ImportIcon';
import Button from '../global/Button';
import SchemaButtonUpload from '../../images/icons/schema/SchemaButtonUpload';
import { useMutation } from 'react-query';
import { createOrUpdateUserSchemaApi } from '../../api/schema';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase.config';
import { triggerSnack } from '../../redux/slice/app';
import { VisibilityIcon } from '../../images/icons/canvas-controls/VisibilityIcon';
import { DownloadIcon } from '../../images/icons/canvas-controls/DownloadIcon';
import { RelationIcon } from '../../images/icons/canvas-controls/RelationIcon';
import MenuPopper from '../global/MenuPopper';
import { useEffect, useRef, useState } from 'react';
import { set } from 'lodash';
import { RelationLineIcon } from '../../images/icons/RelationLineIcon';
import generateForeignKeyName from '../../utils/generateFkName';

interface NewSchemaHeaderProps {
  toggleSettingsDrawer: (open: boolean) => void;
  drawerState: boolean;
  handleNewTable: () => void;
  handleShare: () => void;
  handleImport: () => void;
  showPreview: () => void;
  role: Role;
}

export default function NewSchemaHeader({
  toggleSettingsDrawer,
  drawerState,
  handleNewTable,
  handleShare,
  handleImport,
  showPreview,
  role,
}: NewSchemaHeaderProps) {
  const [user] = useAuthState(auth);
  const theme = useTheme();
  const colors = theme.palette;
  const [openRelation, setOpenRelation] = useState(false);
  const relationAnchorRef = useRef<HTMLButtonElement>(null);
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const schema = useAppSelector((state) => state.schemas.schemas.filter((s) => s.id === id))[0];
  const rightPanelOpen = useAppSelector((state) => state.app.rightPanelOpen);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  interface Relationship extends ForeignKey {
    table: string;
  }

  const [newRelationship, setNewRelationship] = useState<Relationship>({
    table: '',
    name: '',
    column: '',
    referenceTable: '',
    referenceColumn: '',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  const createOrUpdateSchemaMutation = useMutation((schema: Schema) => createOrUpdateUserSchemaApi(user!.uid, schema), {
    onSuccess: (data) => {
      dispatch(
        updateSchema({
          id: data.id,
          userId: data.userId,
          title: data.title,
          tables: data.tables,
          description: data.description,
          users: data.users,
          hasUnsavedChanges: false,
          activeTable: '',
          meta: {
            showColumns: true,
          },
        })
      );
      dispatch(triggerSnack({ message: 'Schema saved!', severity: 'success', hideDuration: 2000 }));
    },
    onError: (error) => {
      dispatch(triggerSnack({ message: 'Error saving schema', severity: 'error', hideDuration: 2000 }));
    },
  });

  const handleToggleRelation = () => {
    setOpenRelation((prevOpen) => !prevOpen);
  };

  const handleCloseRelation = (event: Event | React.SyntheticEvent) => {
    if (relationAnchorRef.current && relationAnchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenRelation(false);
  };

  const handleRelationBlur = (field: keyof Relationship, value: any) => {
    const relationship: Relationship = {
      ...newRelationship,
      [field]: value,
    };
    setNewRelationship(relationship);
  };

  const handleCreateRelation = () => {
    // handle validation
    if (newRelationship.table === '') {
      dispatch(triggerSnack({ message: 'Table is required', severity: 'error', hideDuration: 2000 }));
      return;
    }

    if (newRelationship.column === '') {
      dispatch(triggerSnack({ message: 'Column is required', severity: 'error', hideDuration: 2000 }));
      return;
    }
    if (newRelationship.referenceTable === '') {
      dispatch(triggerSnack({ message: 'Reference table is required', severity: 'error', hideDuration: 2000 }));
      return;
    }
    if (newRelationship.referenceColumn === '') {
      dispatch(triggerSnack({ message: 'Reference column is required', severity: 'error', hideDuration: 2000 }));
      return;
    }

    // check if fk exists in schema
    schema.tables &&
      schema.tables.forEach((table) => {
        table.foreignKeys.forEach((fk) => {
          if (fk.name === newRelationship.name) {
            dispatch(triggerSnack({ message: 'Foreign key already exists', severity: 'error', hideDuration: 2000 }));
            return;
          }
          if (fk.column === newRelationship.column && fk.referenceColumn === newRelationship.referenceColumn) {
            dispatch(triggerSnack({ message: 'Foreign key already exists', severity: 'error', hideDuration: 2000 }));
            return;
          }
        });
      });

    // Update schema
    dispatch(
      updateSchema({
        ...schema,
        tables: schema.tables?.map((table) => {
          if (table.name === newRelationship.table) {
            return {
              ...table,
              foreignKeys: [
                ...table.foreignKeys,
                {
                  name: `fk_${newRelationship.table}_${newRelationship.column}_${newRelationship.referenceTable}_${newRelationship.referenceColumn}`,
                  column: newRelationship.column,
                  referenceColumn: newRelationship.referenceColumn,
                  referenceTable: newRelationship.referenceTable,
                  onDelete: newRelationship.onDelete,
                  onUpdate: newRelationship.onUpdate,
                },
              ],
            };
          }
          return table;
        }),
      })
    );

    setNewRelationship({
      table: '',
      name: '',
      column: '',
      referenceTable: '',
      referenceColumn: '',
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });

    setOpenRelation(false);

    dispatch(triggerSnack({ message: 'Foreign key created!', severity: 'success', hideDuration: 2000 }));
  };

  const iconButtonStyle = {
    width: '70px',
    height: '60px',
    borderRadius: '8px',
    bgcolor: colors.grey[50],
    flexDirection: 'column',
    '&:hover': {
      bgcolor: colors.grey[100],
    },
  };

  const StyledInput = styled('input')({
    border: '0px',
    boxShadow: 'none',
    background: 'none',
    padding: 0,
    outline: 'none',
    color: '#344054',
    fontFamily: 'IBM Plex Mono',
    fontSize: 14,
  });

  return (
    <Box
      bgcolor={'white'}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      height={'69px'}
      pl={'24px'}
      pr={'24px'}
      borderBottom={1}
      borderColor={colors.divider}
      width={'100%'}
    >
      {/* SCHEMA TITLE */}
      <Box display={'flex'} alignItems={'center'}>
        <EditableText
          disableEdit={role === 'viewer'}
          fontSize={18}
          fontColor={colors.grey[900]}
          fontWeight={500}
          value={schema.title}
          onSave={(e) => {
            const updatedSchema = { ...schema, title: e };
            dispatch(updateSchema(updatedSchema));
            dispatch(setNewChanges({ schemaId: schema.id, hasUnsavedChanges: true }));
          }}
        />
        <Box
          height={'22px'}
          width={'77px'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          bgcolor={colors.background.paper}
          borderRadius={16}
          ml={2}
        >
          <Typography fontSize={12} color={colors.primary.main} fontWeight={500}>
            {schema.tables && schema.tables.length > 0 ? `${schema.tables.length} Tables` : 'No Tables'}
          </Typography>
        </Box>
      </Box>

      {/* CANVAS CONTROLS */}
      {role !== 'viewer' ? (
        <Box display={'flex'} width={450} justifyContent={'space-between'}>
          {/* <Tooltip title="Undo">
        <IconButton>
          <Undo />
        </IconButton>
      </Tooltip>

      <Tooltip title="Forward">
        <IconButton>
          <Forward />
        </IconButton>
      </Tooltip> */}

          {/* <Tooltip title="Mouse">
        <IconButton>
          <Pointer />
        </IconButton>
      </Tooltip> */}

          <Tooltip title="New Table">
            <IconButton onClick={handleNewTable} sx={iconButtonStyle}>
              <Table />
              <Typography mt={1} fontSize={11}>
                Table
              </Typography>
            </IconButton>
          </Tooltip>

          {/* <Tooltip title="New Relation">
        <IconButton>
          <Link />
        </IconButton>
      </Tooltip> */}

          <Tooltip title={openRelation ? '' : 'New Relationship'}>
            <IconButton
              ref={relationAnchorRef}
              id="composition-button"
              aria-controls={openRelation ? 'composition-menu' : undefined}
              aria-expanded={openRelation ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleToggleRelation}
              sx={iconButtonStyle}
            >
              <RelationIcon />
              <Typography mt={1} fontSize={11}>
                Relation
              </Typography>
            </IconButton>
          </Tooltip>
          <MenuPopper
            open={openRelation}
            setOpen={setOpenRelation}
            anchorRef={relationAnchorRef}
            handleClose={handleCloseRelation}
            containerStyle={{
              border: '1px solid #EAECF0',
              width: '580px',
              borderRadius: '6px',
              marginTop: '20px',
              padding: '10px',
            }}
            placement="auto"
            menuItems={
              <Box>
                <Typography fontSize={14} fontWeight={500} color={colors.grey[800]}>
                  Create Table Relationship
                </Typography>

                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                  <Box>
                    <FormHelperText sx={{ marginTop: '15px' }}>Primary Table</FormHelperText>
                    <Box border={1} padding={1} borderRadius={'8px'} mt={0.5} borderColor={colors.divider}>
                      <Autocomplete
                        openOnFocus
                        value={newRelationship.table}
                        options={schema.tables ? ['', ...schema.tables.map((t) => t.name)] : []}
                        renderInput={(params) => (
                          <div ref={params.InputProps.ref}>
                            <FormHelperText>Table Name</FormHelperText>
                            <StyledInput
                              style={{
                                border: '1px solid #EAECF0',
                                height: 25,
                                borderRadius: 4,
                                marginBottom: '10px',
                                paddingLeft: '10px',
                                textAlign: 'left',
                              }}
                              type="text"
                              {...params.inputProps}
                              onBlur={(e) => handleRelationBlur('table', e.target.value)}
                            />
                          </div>
                        )}
                      />

                      <Autocomplete
                        disabled={!newRelationship.table || newRelationship.table === ''}
                        openOnFocus
                        value={newRelationship.column}
                        options={
                          schema.tables && schema.tables.length > 0
                            ? schema.tables.find((t) => t.name === newRelationship.table)?.columns.map((c) => c.name) ||
                              []
                            : []
                        }
                        renderInput={(params) => (
                          <div ref={params.InputProps.ref}>
                            <FormHelperText>Column Name</FormHelperText>
                            <StyledInput
                              style={{
                                border: '1px solid #EAECF0',
                                height: 25,
                                borderRadius: 4,
                                paddingLeft: '10px',
                                textAlign: 'left',
                              }}
                              type="text"
                              {...params.inputProps}
                              onBlur={(e) => handleRelationBlur('column', e.target.value)}
                            />
                          </div>
                        )}
                      />
                    </Box>
                  </Box>

                  <Box style={{ marginTop: 50 }}>
                    <RelationLineIcon />
                  </Box>

                  <Box>
                    <FormHelperText sx={{ marginTop: '15px' }}>Referenced Table</FormHelperText>
                    <Box border={1} padding={1} borderRadius={'8px'} mt={0.5} borderColor={colors.divider}>
                      <Autocomplete
                        openOnFocus
                        value={newRelationship.referenceTable}
                        options={
                          schema.tables
                            ? ['', ...schema.tables.map((t) => t.name)].filter((t) => t !== newRelationship.table)
                            : []
                        }
                        renderInput={(params) => (
                          <div ref={params.InputProps.ref}>
                            <FormHelperText>Table Name</FormHelperText>
                            <StyledInput
                              style={{
                                border: '1px solid #EAECF0',
                                height: 25,
                                borderRadius: 4,
                                marginBottom: '10px',
                                paddingLeft: '10px',
                                textAlign: 'left',
                              }}
                              type="text"
                              {...params.inputProps}
                              onBlur={(e) => handleRelationBlur('referenceTable', e.target.value)}
                            />
                          </div>
                        )}
                      />

                      <Autocomplete
                        disabled={!newRelationship.table || newRelationship.table === ''}
                        openOnFocus
                        value={newRelationship.referenceColumn}
                        options={
                          schema.tables && schema.tables.length > 0
                            ? schema.tables
                                .find((t) => t.name === newRelationship.referenceTable)
                                ?.columns.map((c) => c.name) || []
                            : []
                        }
                        renderInput={(params) => (
                          <div ref={params.InputProps.ref}>
                            <FormHelperText>Column Name</FormHelperText>
                            <StyledInput
                              style={{
                                border: '1px solid #EAECF0',
                                height: 25,
                                borderRadius: 4,
                                paddingLeft: '10px',
                                textAlign: 'left',
                              }}
                              type="text"
                              {...params.inputProps}
                              onBlur={(e) => handleRelationBlur('referenceColumn', e.target.value)}
                            />
                          </div>
                        )}
                      />
                    </Box>
                  </Box>
                </Box>

                <Box display={'flex'} marginTop={'20px'}>
                  <Autocomplete
                    openOnFocus
                    value={newRelationship.onUpdate}
                    options={['CASCADE', 'SET NULL', 'RESTRICT', 'NO ACTION', 'SET DEFAULT']}
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <FormHelperText>On Update</FormHelperText>
                        <StyledInput
                          style={{
                            border: '1px solid #EAECF0',
                            height: 25,
                            borderRadius: 4,
                            paddingLeft: '10px',
                            textAlign: 'left',
                            marginRight: '20px',
                          }}
                          type="text"
                          {...params.inputProps}
                          onBlur={(e) => handleRelationBlur('onUpdate', e.target.value)}
                        />
                      </div>
                    )}
                  />

                  <Autocomplete
                    openOnFocus
                    value={newRelationship.onDelete}
                    options={['CASCADE', 'SET NULL', 'RESTRICT', 'NO ACTION', 'SET DEFAULT']}
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <FormHelperText>On Delete</FormHelperText>
                        <StyledInput
                          style={{
                            border: '1px solid #EAECF0',
                            height: 25,
                            borderRadius: 4,
                            paddingLeft: '10px',
                            textAlign: 'left',
                          }}
                          type="text"
                          {...params.inputProps}
                          onBlur={(e) => handleRelationBlur('onDelete', e.target.value)}
                        />
                      </div>
                    )}
                  />
                </Box>

                {/* <Box marginTop={'30px'} marginBottom={'20px'}>
                  <FormHelperText>Relationship Name</FormHelperText>
                  <StyledInput
                    style={{
                      border: '1px solid #EAECF0',
                      height: 25,
                      borderRadius: 4,
                      paddingLeft: '10px',
                      textAlign: 'left',
                    }}
                    type="text"
                  />
                </Box> */}

                <Box display={'flex'} width={'100%'} justifyContent={'flex-end'} marginTop={'40px'}>
                  <Button type="primary" label="Create" onClick={handleCreateRelation} />
                </Box>
              </Box>
            }
          />

          <Tooltip title="Preview">
            <IconButton sx={iconButtonStyle} onClick={showPreview}>
              <VisibilityIcon />
              <Typography mt={1} fontSize={11}>
                Preview
              </Typography>
            </IconButton>
          </Tooltip>

          {role === 'admin' && (
            <Tooltip title="Share Schema">
              <IconButton sx={iconButtonStyle} onClick={handleShare}>
                <Share />
                <Typography mt={1} fontSize={11}>
                  Share
                </Typography>
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Import Schema">
            <IconButton sx={iconButtonStyle} onClick={handleImport}>
              <ImportIcon />
              <Typography mt={1} fontSize={11}>
                Import
              </Typography>
            </IconButton>
          </Tooltip>

          <Tooltip title="Download Schema">
            <IconButton sx={iconButtonStyle} onClick={() => true}>
              <DownloadIcon />
              <Typography mt={1} fontSize={11}>
                Download
              </Typography>
            </IconButton>
          </Tooltip>
        </Box>
      ) : (
        <Box
          height={30}
          display={'flex'}
          borderRadius={1}
          justifyContent={'center'}
          alignItems={'center'}
          paddingLeft={1}
          paddingRight={1}
          bgcolor={colors.success.light}
        >
          <Typography fontSize={12} fontWeight={500} color={colors.success.main}>
            View Only Access
          </Typography>
        </Box>
      )}

      {/* SHARE/EXPORT CONTROLS */}
      <Box display={'flex'} width={role !== 'viewer' ? 150 : 100} justifyContent={'space-between'}>
        <Button
          disabled={!schema.hasUnsavedChanges}
          type="primary"
          label="Save"
          isLoadingText="Saving..."
          isLoading={createOrUpdateSchemaMutation.isLoading}
          onClick={() => createOrUpdateSchemaMutation.mutate(schema)}
          icon={<SchemaButtonUpload color={!schema.hasUnsavedChanges ? colors.grey[300] : colors.grey[100]} />}
        />

        {role !== 'viewer' && (
          <Tooltip title="Settings">
            <IconButton onClick={() => toggleSettingsDrawer(!drawerState)}>
              <Settings color={rightPanelOpen ? colors.primary.main : colors.grey[700]} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}
