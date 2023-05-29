import { useState } from 'react';
import { Autocomplete, Box, ButtonBase, FormHelperText, IconButton, Tooltip, Typography, styled } from '@mui/material';
import { useParams } from 'react-router-dom';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';

import getTypeColorCode from '../../utils/getTypeColor';
import { PostgresColumnType, PostgresOnDeleteOption, PostgresOnUpdateOption } from '../../types/tableTypes';
import TableCheckbox from './TableCheckbox';
import { useAppSelector } from '../../redux/hooks';
import typesArray from './tableTypes';

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

const TableRow = (row: TableRowProps) => {
  const { id } = useParams();
  const schema = useAppSelector((state) => state.schemas.schemas).filter((s) => s.id === id)[0];

  const [nameEditMode, setNameEditMode] = useState<boolean>(false);
  const [typeEditMode, setTypeEditMode] = useState<boolean>(false);
  const [defaultEditMode, setDefaultEditMode] = useState<boolean>(false);
  const [rowData, setRowData] = useState<TableRowProps>(row);

  const handleInputBlur = (field: keyof TableRowProps, value: any) => {
    const updatedRow = {
      ...rowData,
      [field]: value,
    };
    setRowData(updatedRow);
    row.handleUpdate && row.handleUpdate(updatedRow);
  };

  return (
    <Box
      height={rowData.foreignKey ? 100 : 60}
      width={'100%'}
      borderTop={1}
      borderColor={'#EAECF0'}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      p={'10px'}
    >
      <Box display={'flex'} width={'100%'} alignItems={'center'}>
        {row.canDelete ? (
          <IconButton
            onClick={row.handleDelete}
            style={{ width: '20px', height: '20px', marginRight: 5 }}
            color={'error'}
          >
            <CloseRoundedIcon
              style={{
                width: '16px',
              }}
            />
          </IconButton>
        ) : (
          <KeyRoundedIcon
            style={{
              width: '16px',
              marginRight: 5,
            }}
          />
        )}

        {nameEditMode ? (
          <Autocomplete
            freeSolo
            style={{
              width: '20%',
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
              width: '20%',
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <Typography fontFamily={'IBM Plex Mono'} fontSize={14}>
              {rowData.name}
            </Typography>
          </ButtonBase>
        )}

        {typeEditMode ? (
          <Autocomplete
            style={{
              width: '15%',
              overflow: 'hidden',
            }}
            options={typesArray}
            defaultValue={rowData.type}
            renderInput={(params) => (
              <div ref={params.InputProps.ref}>
                <StyledInput
                  autoFocus
                  type="text"
                  width={'15%'}
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

        {defaultEditMode ? (
          <Autocomplete
            id="custom-input-demo"
            style={{
              width: '15%',
              overflow: 'hidden',
              justifyContent: 'center',
              textAlign: 'center',
            }}
            freeSolo
            options={[]}
            defaultValue={rowData.defaultValue || 'no default'}
            renderInput={(params) => (
              <div ref={params.InputProps.ref}>
                <StyledInput
                  autoFocus
                  type="text"
                  color={getTypeColorCode(rowData.type)}
                  {...params.inputProps}
                  onBlur={(e) => {
                    handleInputBlur('defaultValue', e.target.value);
                    setDefaultEditMode(false);
                  }}
                />
              </div>
            )}
          />
        ) : (
          <ButtonBase
            onClick={() => {
              setDefaultEditMode(true);
            }}
            style={{
              cursor: 'pointer',
              width: '15%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Typography fontFamily={'IBM Plex Mono'} fontSize={14} color={'#344054'} textAlign={'center'}>
              {rowData.defaultValue || 'no default'}
            </Typography>
          </ButtonBase>
        )}

        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
          width={'50%'}
          height={'100%'}
          flexWrap={'wrap'}
        >
          {!rowData.primaryKey && (
            <Box
              style={{
                display: 'flex',
                height: 17,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FFFAEB',
                paddingLeft: 10,
                paddingRight: 10,
                borderRadius: 16,
              }}
            >
              <ButtonBase onClick={() => handleInputBlur('nullable', !rowData.nullable)}>
                <TableCheckbox checked={rowData.nullable} />
                <Typography fontFamily={'IBM Plex Mono'} color={'#B54708'} fontSize={12} marginLeft={'5px'}>
                  null
                </Typography>
              </ButtonBase>
            </Box>
          )}

          {rowData.primaryKey && (
            <Box
              style={{
                display: 'flex',
                height: 17,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ECFDF3',
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 2,
                paddingBottom: 2,
                borderRadius: 16,
              }}
            >
              <ButtonBase onClick={() => handleInputBlur('autoInc', !rowData.autoInc)}>
                <TableCheckbox checked={rowData.autoInc} />
                <Typography fontFamily={'IBM Plex Mono'} color={'#027A48'} fontSize={12} marginLeft={'5px'}>
                  auto inc
                </Typography>
              </ButtonBase>
            </Box>
          )}

          <Box
            style={{
              display: 'flex',
              height: 17,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F8F9FC',
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 2,
              paddingBottom: 2,
              borderRadius: 16,
            }}
          >
            <ButtonBase
              onClick={() => {
                const updatedRow = {
                  ...rowData,
                  unique: !rowData.unique,
                };
                setRowData(updatedRow);
              }}
            >
              <TableCheckbox checked={rowData.unique} />
              <Typography fontFamily={'IBM Plex Mono'} color={'#363F72'} fontSize={12} marginLeft={'5px'}>
                unique
              </Typography>
            </ButtonBase>
          </Box>

          {!rowData.type.includes('time') && (
            <Tooltip title="primary key">
              <Box
                style={{
                  display: 'flex',
                  height: 17,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#F0F9FF',
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 2,
                  paddingBottom: 2,
                  borderRadius: 16,
                }}
              >
                <ButtonBase onClick={() => handleInputBlur('primaryKey', !rowData.primaryKey)}>
                  <TableCheckbox checked={rowData.primaryKey} />
                  <Typography fontFamily={'IBM Plex Mono'} color={'#363F72'} fontSize={12} marginLeft={'5px'}>
                    pk
                  </Typography>
                </ButtonBase>
              </Box>
            </Tooltip>
          )}

          {!rowData.type.includes('time') && (
            <Tooltip title="foreign key">
              <Box
                style={{
                  display: 'flex',
                  height: 17,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FFF4ED',
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 2,
                  paddingBottom: 2,
                  borderRadius: 16,
                }}
              >
                <ButtonBase onClick={() => handleInputBlur('foreignKey', !rowData.foreignKey)}>
                  <TableCheckbox checked={rowData.foreignKey} />
                  <Typography fontFamily={'IBM Plex Mono'} color={'#B93815'} fontSize={12} marginLeft={'5px'}>
                    fk
                  </Typography>
                </ButtonBase>
              </Box>
            </Tooltip>
          )}

          {rowData.type.includes('time') && (
            <Tooltip title="auto update time field">
              <Box
                style={{
                  display: 'flex',
                  height: 17,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FFF4ED',
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 2,
                  paddingBottom: 2,
                  borderRadius: 16,
                  marginTop: rowData.primaryKey ? 5 : 0,
                }}
              >
                <ButtonBase onClick={() => handleInputBlur('autoUpdateTime', !rowData.autoUpdateTime)}>
                  <TableCheckbox checked={rowData.autoUpdateTime} />
                  <Typography fontFamily={'IBM Plex Mono'} color={'#B93815'} fontSize={12} marginLeft={'5px'}>
                    auto update
                  </Typography>
                </ButtonBase>
              </Box>
            </Tooltip>
          )}

          <Tooltip title="index">
            <Box
              style={{
                display: 'flex',
                height: 17,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F2F4F7',
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 2,
                paddingBottom: 2,
                borderRadius: 16,
                marginTop: rowData.primaryKey ? 5 : 0,
              }}
            >
              <ButtonBase onClick={() => handleInputBlur('index', !rowData.index)}>
                <TableCheckbox checked={rowData.index} />
                <Typography fontFamily={'IBM Plex Mono'} color={'#344054'} fontSize={12} marginLeft={'5px'}>
                  index
                </Typography>
              </ButtonBase>
            </Box>
          </Tooltip>
        </Box>
      </Box>

      {rowData.foreignKey && (
        <Box
          display={'flex'}
          justifyContent={'flex-end'}
          alignItems={'center'}
          width={'100%'}
          height={30}
          marginTop={'20px'}
        >
          <Autocomplete
            openOnFocus
            value={row.isEdit ? row.referenceTable : rowData.referenceTable}
            options={schema.tables && schema.tables.length > 0 && (schema.tables.map((t) => t.name) as any)}
            renderInput={(params) => (
              <div ref={params.InputProps.ref}>
                <StyledInput
                  style={{
                    border: '1px solid #EAECF0',
                    height: 20,
                    borderRadius: 4,
                    width: 150,
                    marginRight: 10,
                    textAlign: 'center',
                  }}
                  type="text"
                  {...params.inputProps}
                  onBlur={(e) => handleInputBlur('referenceTable', e.target.value)}
                />
                <FormHelperText>Referenced Table</FormHelperText>
              </div>
            )}
          />

          <Autocomplete
            openOnFocus
            value={row.isEdit ? row.referenceColumn : rowData.referenceColumn}
            options={
              schema.tables && schema.tables.length > 0
                ? schema.tables.find((t) => t.name === rowData.referenceTable)?.columns.map((c) => c.name) || []
                : []
            }
            renderInput={(params) => (
              <div ref={params.InputProps.ref}>
                <StyledInput
                  style={{
                    border: '1px solid #EAECF0',
                    height: 20,
                    borderRadius: 4,
                    width: 150,
                    paddingLeft: 5,
                    marginRight: 10,
                    textAlign: 'center',
                  }}
                  type="text"
                  {...params.inputProps}
                  onBlur={(e) => handleInputBlur('referenceColumn', e.target.value)}
                />
                <FormHelperText>Referenced Column</FormHelperText>
              </div>
            )}
          />

          <Autocomplete
            openOnFocus
            value={row.isEdit ? row.onUpdate : rowData.onUpdate}
            options={['CASCADE', 'SET NULL', 'RESTRICT', 'NO ACTION', 'SET DEFAULT']}
            renderInput={(params) => (
              <div ref={params.InputProps.ref}>
                <StyledInput
                  style={{
                    border: '1px solid #EAECF0',
                    height: 20,
                    borderRadius: 4,
                    width: 150,
                    marginRight: 10,
                    textAlign: 'center',
                  }}
                  type="text"
                  {...params.inputProps}
                  onBlur={(e) => handleInputBlur('onUpdate', e.target.value)}
                />
                <FormHelperText>On Update</FormHelperText>
              </div>
            )}
          />

          <Autocomplete
            openOnFocus
            value={row.isEdit ? row.onDelete : rowData.onDelete}
            options={['CASCADE', 'SET NULL', 'RESTRICT', 'NO ACTION', 'SET DEFAULT']}
            renderInput={(params) => (
              <div ref={params.InputProps.ref}>
                <StyledInput
                  style={{
                    border: '1px solid #EAECF0',
                    height: 20,
                    borderRadius: 4,
                    width: 150,
                    textAlign: 'center',
                  }}
                  type="text"
                  {...params.inputProps}
                  onBlur={(e) => handleInputBlur('onDelete', e.target.value)}
                />
                <FormHelperText>On Delete</FormHelperText>
              </div>
            )}
          />
        </Box>
      )}
    </Box>
  );
};

export default TableRow;
