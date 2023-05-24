import { useState } from 'react';
import { Autocomplete, Box, ButtonBase, FormHelperText, Tooltip, Typography, styled } from '@mui/material';
import { useParams } from 'react-router-dom';

import getTypeColorCode from '../../utils/getTypeColor';
import { PostgresColumnType, PostgresOnDeleteOption, PostgresOnUpdateOption } from '../../types/tableTypes';
import TableCheckbox from './TableCheckbox';
import { useAppSelector } from '../../redux/hooks';

export interface TableRowProps {
  name: string;
  type: PostgresColumnType;
  defaultValue: string;
  notNull: boolean;
  autoInc: boolean;
  unique: boolean;
  primaryKey: boolean;
  foreignKey: boolean;
  referencedTable?: string;
  referencedColumn?: string;
  onDelete?: PostgresOnDeleteOption;
  onUpdate?: PostgresOnUpdateOption;
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
  };
  return (
    <Box
      height={rowData.foreignKey ? 90 : 40}
      width={'100%'}
      borderTop={1}
      borderColor={'#EAECF0'}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'space-between'}
      alignItems={'center'}
      p={'10px'}
    >
      <Box display={'flex'} width={'100%'}>
        {nameEditMode ? (
          <Autocomplete
            id="custom-input-demo"
            style={{
              width: '20%',
            }}
            options={['id']}
            defaultValue={rowData.name}
            renderInput={(params) => (
              <div ref={params.InputProps.ref}>
                <StyledInput
                  autoFocus
                  type="text"
                  {...params.inputProps}
                  onBlur={(e) => {
                    const updatedRow = {
                      ...rowData,
                      name: e.target.value,
                    };
                    setRowData(updatedRow);
                    setNameEditMode(false);
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
            id="custom-input-demo"
            style={{
              width: '15%',
            }}
            options={['id']}
            defaultValue={rowData.type}
            renderInput={(params) => (
              <div ref={params.InputProps.ref}>
                <StyledInput
                  autoFocus
                  type="text"
                  width={'15%'}
                  color={getTypeColorCode(rowData.type)}
                  {...params.inputProps}
                  onBlur={(e) => {
                    const updatedRow = {
                      ...row,
                      type: e.target.value as PostgresColumnType,
                    };
                    setRowData(updatedRow);
                    setTypeEditMode(false);
                  }}
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
            }}
            options={['id']}
            defaultValue={rowData.defaultValue}
            renderInput={(params) => (
              <div ref={params.InputProps.ref}>
                <StyledInput
                  autoFocus
                  type="text"
                  color={getTypeColorCode(rowData.type)}
                  {...params.inputProps}
                  onBlur={(e) => {
                    const updatedRow = {
                      ...rowData,
                      defaultValue: e.target.value,
                    };
                    setRowData(updatedRow);
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
              justifyContent: 'flex-start',
            }}
          >
            <Typography fontFamily={'IBM Plex Mono'} fontSize={14} color={'#344054'}>
              {rowData.defaultValue || 'no default'}
            </Typography>
          </ButtonBase>
        )}

        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} width={'50%'}>
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
            <ButtonBase
              onClick={() => {
                const updatedRow = {
                  ...rowData,
                  notNull: !rowData.notNull,
                };
                setRowData(updatedRow);
              }}
            >
              <TableCheckbox checked={rowData.notNull} />
              <Typography fontFamily={'IBM Plex Mono'} color={'#B54708'} fontSize={12} marginLeft={'5px'}>
                null
              </Typography>
            </ButtonBase>
          </Box>

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
            <ButtonBase
              onClick={() => {
                const updatedRow = {
                  ...rowData,
                  autoInc: !rowData.autoInc,
                };
                setRowData(updatedRow);
              }}
            >
              <TableCheckbox checked={rowData.autoInc} />
              <Typography fontFamily={'IBM Plex Mono'} color={'#027A48'} fontSize={12} marginLeft={'5px'}>
                auto inc
              </Typography>
            </ButtonBase>
          </Box>

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
                  pk
                </Typography>
              </ButtonBase>
            </Box>
          </Tooltip>

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
              <ButtonBase
                onClick={() => {
                  const updatedRow = {
                    ...rowData,
                    foreignKey: !rowData.foreignKey,
                  };
                  setRowData(updatedRow);
                }}
              >
                <TableCheckbox checked={rowData.foreignKey} />
                <Typography fontFamily={'IBM Plex Mono'} color={'#B93815'} fontSize={12} marginLeft={'5px'}>
                  fk
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
          marginTop={'10px'}
        >
          <Autocomplete
            id="custom-input-demo"
            openOnFocus
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
                  placeholder="Referenced Table"
                  {...params.inputProps}
                  onBlur={(e) => handleInputBlur('referencedTable', e.target.value)}
                />
                <FormHelperText>Referenced Table</FormHelperText>
              </div>
            )}
          />

          <Autocomplete
            openOnFocus
            options={
              schema.tables &&
              schema.tables.length > 0 &&
              (schema.tables.find((t) => t.name === rowData.referencedTable)?.columns.map((c) => c.name) as any)
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
                  placeholder="Referenced Column"
                  {...params.inputProps}
                  onBlur={(e) => handleInputBlur('referencedColumn', e.target.value)}
                />
                <FormHelperText>Referenced Column</FormHelperText>
              </div>
            )}
          />

          <Autocomplete
            openOnFocus
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
                  placeholder="On Update"
                  {...params.inputProps}
                  onBlur={(e) => handleInputBlur('onUpdate', e.target.value)}
                />
                <FormHelperText>On Update</FormHelperText>
              </div>
            )}
          />

          <Autocomplete
            openOnFocus
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
                  placeholder="On Delete"
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
