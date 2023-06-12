import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { TickIcon } from '../../images/icons/TickIcon';
import { CancelIcon } from '../../images/icons/CancelIcon';
import EditableText from '../global/EditableText';
import { NewRowPlus } from '../../images/icons/canvas-controls/NewRowPlus';
import TableRowV2, { TableRowProps } from './TableRowV2';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Table as TableProps, editTable } from '../../redux/slice/schemas';

function TableV2({ data }: any) {
  const theme = useTheme();
  const colors = theme.palette;
  const params = useParams();
  const dispatch = useAppDispatch();
  const schema = useAppSelector((state) => state.schemas.schemas.filter((s) => s.id === params.id))[0];
  const tableArray = schema?.tables?.filter((t) => t.id === data.id);
  const table = tableArray && tableArray?.length > 0 ? tableArray[0] : ({ name: 'new_table' } as any);
  const [tableName, setTableName] = useState<string>(data.name || table.name);
  const checkIfFkExists = (name: string) => {
    const fk = table.foreignKeys.filter((fk: any) => fk.column === name)[0];

    return {
      hasFk: fk ? true : false,
      fk,
    };
  };
  const [tableRows, setTableRows] = useState<TableRowProps[]>(
    table.columns.map((c: any) => {
      return {
        name: c.name,
        type: c.type,
        primaryKey: c.primaryKey,
        defaultValue: c.default,
        nullable: c.null ? c.null : false,
        unique: c.unique,
        index: c.index ? c.index : false,
        autoUpdateTime: c.autoUpdateTime ? c.autoUpdateTime : false,
        autoInc: c.autoInc,
        foreignKey: checkIfFkExists(c.name).hasFk,
        referenceColumn: checkIfFkExists(c.name).hasFk ? checkIfFkExists(c.name).fk.referenceColumn : '',
        referenceTable: checkIfFkExists(c.name).hasFk ? checkIfFkExists(c.name).fk.referenceTable : '',
        onUpdate: checkIfFkExists(c.name).hasFk ? checkIfFkExists(c.name).fk.onUpdate : '',
        onDelete: checkIfFkExists(c.name).hasFk ? checkIfFkExists(c.name).fk.onDelete : '',
      };
    })
  );

  return (
    <Box
      display={'flex'}
      border={1}
      borderColor={colors.divider}
      bgcolor={'#FFFF'}
      width={420}
      flexDirection={'column'}
      borderRadius={'8px'}
    >
      <Box display={'flex'} padding={'10px'} justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
        <Box display={'flex'} alignItems={'center'}>
          <Box
            style={{
              backgroundColor: '#2D9CDB',
              width: 30,
              height: 30,
              borderRadius: 50,
              marginRight: 10,
            }}
          />
          <EditableText
            value={tableName}
            onSave={(e) => setTableName(e)}
            fontFamily={'Work Sans'}
            fontSize={16}
            fontColor={colors.grey[800]}
            fontWeight={600}
          />
        </Box>

        <Box display={'flex'} alignItems={'center'}>
          <IconButton
            onClick={() => {
              data.handleTableDelete();
            }}
            style={{ marginRight: 15, marginLeft: 10 }}
          >
            <CancelIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              const table: TableProps = {
                ...(schema?.tables?.filter((t) => t.id === data.id)[0] as any),
                name: tableName,
                columns: [
                  ...tableRows.map((row) => {
                    return {
                      name: row.name,
                      type: row.type,
                      default: row.defaultValue,
                      nullable: row.nullable,
                      unique: row.unique,
                      index: row.index,
                      autoInc: row.autoInc,
                      primaryKey: row.primaryKey,
                      comment: '',
                    };
                  }),
                ],
                foreignKeys: [
                  ...tableRows
                    .map((row) => {
                      if (row.foreignKey) {
                        return {
                          column: row.name,
                          referenceTable: row.referenceTable,
                          referenceColumn: row.referenceColumn,
                          onUpdate: row.onUpdate,
                          onDelete: row.onDelete,
                        };
                      } else {
                        return null;
                      }
                    })
                    .filter((key) => key != null),
                ],
                indexes: [
                  ...tableRows
                    .map((row) => {
                      if (row.index) {
                        return {
                          column: row.name,
                          unique: row.unique,
                          sorting: 'ASC',
                        };
                      } else {
                        return null;
                      }
                    })
                    .filter((key) => key != null),
                  ...tableRows
                    .map((row) => {
                      if (row.unique) {
                        return {
                          column: row.name,
                          unique: true,
                          sorting: 'ASC',
                        };
                      } else {
                        return null;
                      }
                    })
                    .filter((key) => key != null),
                ],
                meta: {
                  type: 'table',
                },
              };

              dispatch(editTable({ schemaId: schema.id, table }));
            }}
          >
            <TickIcon />
          </IconButton>
        </Box>
      </Box>

      {tableRows.map((row, index) => {
        return (
          <TableRowV2
            {...{
              ...row,
              canDelete: index > 0,
              handleDelete: () => {
                const filteredRow = tableRows.filter((r, i) => i !== index);
                setTableRows(filteredRow);
              },
              handleUpdate: (updatedRow: TableRowProps) => {
                const updatedRows = tableRows.map((r, i) => {
                  if (i === index) {
                    return updatedRow;
                  } else {
                    return r;
                  }
                });

                setTableRows(updatedRows);
              },
            }}
          />
        );
      })}

      <Box
        display={'flex'}
        borderTop={1}
        borderColor={colors.divider}
        height={40}
        alignItems={'center'}
        justifyContent={'flex-end'}
        paddingRight={'10px'}
      >
        <IconButton
          onClick={() =>
            setTableRows([
              ...tableRows,
              {
                name: 'new_column',
                type: 'text',
                defaultValue: '',
                nullable: false,
                index: false,
                unique: false,
                primaryKey: false,
                autoInc: false,
                foreignKey: false,
                autoUpdateTime: false,
              },
            ])
          }
        >
          <NewRowPlus />
        </IconButton>
      </Box>
    </Box>
  );
}

export default TableV2;
