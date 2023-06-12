import { useRef, useState } from 'react';
import {
  Typography,
  Box,
  Autocomplete,
  styled,
  ButtonBase,
  IconButton,
  Tooltip,
  MenuItem,
  FormHelperText,
  Checkbox,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { PostgresColumnType, PostgresOnDeleteOption, PostgresOnUpdateOption } from '../../types/tableTypes';
import typesArray from './tableTypes';
import getTypeColorCode from '../../utils/getTypeColor';
import MenuPopper from '../global/MenuPopper';
import ThreeDotsV from '../../images/icons/ThreeDotsV';
import { KeyIcon } from '../../images/icons/KeyIcon';
import { UniqueIndexIcon } from '../../images/icons/UniqueIndexIcon';
import { IndexPinIcon } from '../../images/icons/IndexPinIcon';
import { SmallTickIcon } from '../../images/icons/SmallTickIcon';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useParams } from 'react-router-dom';

export interface TableRowProps {
  name: string;
  type: PostgresColumnType;
  defaultValue: string;
  nullable: boolean;
  autoInc: boolean;
  unique: boolean;
  primaryKey: boolean;
  autoUpdateTime: boolean;
  foreignKey: boolean;
  referenceTable?: string;
  referenceColumn?: string;
  onDelete?: PostgresOnDeleteOption;
  onUpdate?: PostgresOnUpdateOption;
  index: boolean;
  canDelete?: boolean;
  isEdit?: boolean;
  comment?: string;
  handleDelete?: () => void;
  handleUpdate?: (row: TableRowProps) => void;
}

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

const indexMenuItemStyle = {
  height: '30px',
};

function TableRowV2(row: TableRowProps) {
  const theme = useTheme();
  const colors = theme.palette;
  const indexAnchorRef = useRef<HTMLButtonElement>(null);
  const moreOptionsAnchorRef = useRef<HTMLButtonElement>(null);
  const params = useParams();
  const dispatch = useAppDispatch();
  const schema = useAppSelector((state) => state.schemas.schemas.filter((s) => s.id === params.id))[0];
  const [nameEditMode, setNameEditMode] = useState<boolean>(false);
  const [typeEditMode, setTypeEditMode] = useState<boolean>(false);
  const [openIndex, setOpenIndex] = useState<boolean>(false);
  const [openMoreOptions, setOpenMoreOptions] = useState<boolean>(false);
  const [rowData, setRowData] = useState<TableRowProps>(row);

  const handleInputBlur = (field: keyof TableRowProps, value: any) => {
    const updatedRow = {
      ...rowData,
      [field]: value,
    };
    setRowData(updatedRow);
    row.handleUpdate && row.handleUpdate(updatedRow);
  };

  const handleIndexClose = (event: Event | React.SyntheticEvent) => {
    if (indexAnchorRef.current && indexAnchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenIndex(false);
  };

  const handleIndexToggle = () => {
    setOpenIndex((prevOpen) => !prevOpen);
  };

  const handleMoreOptionsClose = (event: Event | React.SyntheticEvent) => {
    if (moreOptionsAnchorRef.current && moreOptionsAnchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenMoreOptions(false);
  };

  const handleMoreOptionsToggle = () => {
    setOpenMoreOptions((prevOpen) => !prevOpen);
  };

  return (
    <Box
      height={50}
      width={'100%'}
      borderTop={1}
      borderColor={colors.divider}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      p={'10px'}
    >
      <Box display={'flex'} width={'100%'} alignItems={'center'} justifyContent={'space-between'}>
        <Box width={'20px'} justifyContent={'center'} alignItems={'center'} display={'flex'}>
          {row.canDelete ? (
            <IconButton onClick={row.handleDelete} style={{ width: '20px', height: '20px' }} color={'error'}>
              <CloseRoundedIcon
                style={{
                  width: '16px',
                }}
              />
            </IconButton>
          ) : rowData.primaryKey ? (
            <KeyIcon />
          ) : (
            <Box width={'16px'} />
          )}
        </Box>

        {/* Column Name */}
        <Box width={'20%'} mr={1}>
          <Tooltip title={nameEditMode ? '' : rowData.name}>
            {nameEditMode ? (
              <Autocomplete
                freeSolo
                style={{
                  width: '100%',
                  overflow: 'hidden',
                }}
                options={[]}
                defaultValue={rowData.name}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <StyledInput
                      autoFocus
                      type="text"
                      {...params.inputProps}
                      onBlur={(e) => {
                        handleInputBlur('name', e.target.value);
                      }}
                    />
                  </div>
                )}
              />
            ) : (
              <ButtonBase
                onClick={() => {
                  setNameEditMode(true);
                }}
                style={{
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
              >
                <Typography fontFamily={'IBM Plex Mono'} fontSize={14}>
                  {rowData.name}
                </Typography>
              </ButtonBase>
            )}
          </Tooltip>
        </Box>

        {/* Column Type */}
        <Box
          width={'35%'}
          borderRadius={'6px'}
          border={typesArray.includes(rowData.type) ? 'none' : `1px solid ${colors.error.main}`}
        >
          <Tooltip title={typeEditMode ? '' : rowData.type}>
            {typeEditMode ? (
              <Autocomplete
                style={{
                  width: '100%',
                  overflow: 'hidden',
                }}
                noOptionsText="No type found"
                options={typesArray}
                defaultValue={rowData.type}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <StyledInput
                      autoFocus
                      type="text"
                      width={'35%'}
                      color={getTypeColorCode(rowData.type)}
                      {...params.inputProps}
                      onBlur={(e) => handleInputBlur('type', e.target.value)}
                    />
                  </div>
                )}
              />
            ) : (
              <ButtonBase
                onClick={() => {
                  setTypeEditMode(true);
                }}
                style={{
                  cursor: 'pointer',
                  width: '15%',
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
              >
                <Typography fontFamily={'IBM Plex Mono'} fontSize={14} color={getTypeColorCode(rowData.type)}>
                  {rowData.type}
                </Typography>
              </ButtonBase>
            )}
          </Tooltip>
        </Box>

        <Box>
          {/* Nullable */}
          <Tooltip title="Nullable">
            <IconButton
              onClick={() => handleInputBlur('nullable', !rowData.nullable)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '6px',
              }}
            >
              <Typography
                variant="body1"
                color={rowData.nullable ? colors.primary.main : colors.grey[700]}
                fontSize={'14px'}
              >
                N
              </Typography>
            </IconButton>
          </Tooltip>

          {/* Index type */}
          <Tooltip title="Index">
            <IconButton
              ref={indexAnchorRef}
              id="composition-button"
              aria-controls={openIndex ? 'composition-menu' : undefined}
              aria-expanded={openIndex ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleIndexToggle}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '6px',
                paddingLeft: '10px',
                paddingRight: '10px',
              }}
            >
              <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                {rowData.primaryKey && <KeyIcon style={{ marginRight: 3 }} />}
                {rowData.unique && <UniqueIndexIcon style={{ marginRight: 3 }} />}
                {rowData.index && <IndexPinIcon style={{ marginRight: 3 }} />}
                {!rowData.index && !rowData.unique && !rowData.primaryKey && (
                  <Box
                    style={{
                      width: '10px',
                      height: '10px',
                      marginRight: 1,
                      borderRadius: '10px',
                      border: `1.5px solid ${colors.grey[900]}`,
                    }}
                  />
                )}
              </Box>
            </IconButton>
          </Tooltip>
          <MenuPopper
            open={openIndex}
            setOpen={setOpenIndex}
            anchorRef={indexAnchorRef}
            handleClose={handleIndexClose}
            containerStyle={{ border: `1px solid ${theme.palette.divider}`, width: '160px', borderRadius: '6px' }}
            menuItems={
              <>
                <MenuItem
                  style={indexMenuItemStyle}
                  onClick={(e) => {
                    handleInputBlur('primaryKey', !rowData.primaryKey);
                  }}
                >
                  <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
                    <KeyIcon />
                    <Typography ml={2} flex={1} color={theme.palette.grey[700]} fontSize={12} fontWeight={500}>
                      Primary Key
                    </Typography>
                    {rowData.primaryKey ? <SmallTickIcon color={colors.primary.main} /> : <Box width={12} />}
                  </Box>
                </MenuItem>
                <MenuItem
                  style={indexMenuItemStyle}
                  onClick={(e) => {
                    handleInputBlur('unique', !rowData.unique);
                  }}
                >
                  <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
                    <UniqueIndexIcon />
                    <Typography ml={2} flex={1} color={theme.palette.grey[700]} fontSize={12} fontWeight={500}>
                      Unique Index
                    </Typography>
                    {rowData.unique ? <SmallTickIcon color={colors.primary.main} /> : <Box width={12} />}
                  </Box>
                </MenuItem>
                <MenuItem
                  style={indexMenuItemStyle}
                  onClick={(e) => {
                    handleInputBlur('index', !rowData.index);
                  }}
                >
                  <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
                    <IndexPinIcon />
                    <Typography ml={2} flex={1} color={theme.palette.grey[700]} fontSize={12} fontWeight={500}>
                      Index
                    </Typography>
                    {rowData.index ? <SmallTickIcon color={colors.primary.main} /> : <Box width={12} />}
                  </Box>
                </MenuItem>
                <MenuItem
                  style={indexMenuItemStyle}
                  onClick={(e) => {
                    const updatedRow = {
                      ...rowData,
                      primaryKey: false,
                      unique: false,
                      index: false,
                    };
                    setRowData(updatedRow);
                    row.handleUpdate && row.handleUpdate(updatedRow);
                  }}
                >
                  <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
                    <Box
                      style={{
                        width: '10px',
                        height: '10px',
                        marginRight: 1,
                        borderRadius: '10px',
                        border: `1.5px solid ${colors.grey[900]}`,
                      }}
                    />
                    <Typography
                      textAlign={'left'}
                      flex={1}
                      color={theme.palette.grey[700]}
                      fontSize={12}
                      fontWeight={500}
                      ml={2}
                    >
                      None
                    </Typography>
                    {!rowData.primaryKey && !rowData.unique && !rowData.index ? (
                      <SmallTickIcon color={colors.primary.main} />
                    ) : (
                      <Box width={12} />
                    )}
                  </Box>
                </MenuItem>
              </>
            }
          />

          {/* Other options */}
          <Tooltip title="Other Options">
            <IconButton
              ref={moreOptionsAnchorRef}
              id="composition-button"
              aria-controls={openMoreOptions ? 'composition-menu' : undefined}
              aria-expanded={openMoreOptions ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleMoreOptionsToggle}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '6px',
              }}
            >
              <ThreeDotsV />
            </IconButton>
          </Tooltip>
          <MenuPopper
            open={openMoreOptions}
            setOpen={setOpenMoreOptions}
            anchorRef={moreOptionsAnchorRef}
            handleClose={handleMoreOptionsClose}
            placement="bottom-start"
            containerStyle={{ border: `1px solid ${theme.palette.divider}`, width: '200px', borderRadius: '6px' }}
            menuItems={
              <Box p={1}>
                <FormHelperText>Default Value</FormHelperText>
                <StyledInput
                  style={{
                    border: '1px solid #EAECF0',
                    marginTop: 1,
                    height: 25,
                    paddingLeft: '10px',
                    borderRadius: 4,
                    textAlign: 'left',
                  }}
                  type="text"
                  onBlur={(e) => handleInputBlur('defaultValue', e.target.value)}
                />

                <FormHelperText>Comment</FormHelperText>
                <StyledInput
                  style={{
                    border: '1px solid #EAECF0',
                    marginTop: 1,
                    height: 25,
                    paddingLeft: '10px',
                    borderRadius: 4,
                    textAlign: 'left',
                  }}
                  type="text"
                  onBlur={(e) => handleInputBlur('comment', e.target.value)}
                />

                <Box ml={-1} mt={1} display={'flex'} alignItems={'center'}>
                  <Checkbox
                    size="small"
                    checked={rowData.foreignKey}
                    onChange={() => handleInputBlur('foreignKey', !rowData.foreignKey)}
                  />
                  <FormHelperText style={{ marginBottom: '2px' }}>Foreign Key</FormHelperText>
                </Box>

                {rowData.foreignKey && (
                  <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-end'} alignItems={'center'}>
                    <Autocomplete
                      openOnFocus
                      value={row.isEdit ? row.referenceTable : rowData.referenceTable}
                      options={schema.tables && schema.tables.length > 0 && (schema.tables.map((t) => t.name) as any)}
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <FormHelperText>Referenced Table</FormHelperText>
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
                            onBlur={(e) => handleInputBlur('referenceTable', e.target.value)}
                          />
                        </div>
                      )}
                    />

                    <Autocomplete
                      openOnFocus
                      value={row.isEdit ? row.referenceColumn : rowData.referenceColumn}
                      options={
                        schema.tables && schema.tables.length > 0
                          ? schema.tables.find((t) => t.name === rowData.referenceTable)?.columns.map((c) => c.name) ||
                            []
                          : []
                      }
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <FormHelperText>Referenced Column</FormHelperText>
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
                            onBlur={(e) => handleInputBlur('referenceColumn', e.target.value)}
                          />
                        </div>
                      )}
                    />

                    <Autocomplete
                      openOnFocus
                      value={row.isEdit ? row.onUpdate : rowData.onUpdate}
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
                            }}
                            type="text"
                            {...params.inputProps}
                            onBlur={(e) => handleInputBlur('onUpdate', e.target.value)}
                          />
                        </div>
                      )}
                    />

                    <Autocomplete
                      openOnFocus
                      value={row.isEdit ? row.onDelete : rowData.onDelete}
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
                            onBlur={(e) => handleInputBlur('onDelete', e.target.value)}
                          />
                        </div>
                      )}
                    />
                  </Box>
                )}
              </Box>
            }
          />
        </Box>
      </Box>
    </Box>
  );
}

export default TableRowV2;
