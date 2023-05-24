import { useState } from 'react';
import { Box, IconButton } from '@mui/material';

import EditableText from '../global/EditableText';
import { CancelIcon } from '../../images/icons/CancelIcon';
import { TickIcon } from '../../images/icons/TickIcon';
import { NewRowPlus } from '../../images/icons/canvas-controls/NewRowPlus';
import TableRow, { TableRowProps } from './TableRow';

const Table = () => {
  const [tableName, setTableName] = useState<string>('new_table');
  const [tableRows, setTableRows] = useState<TableRowProps[]>([
    {
      name: 'id',
      type: 'int',
      defaultValue: '',
      notNull: false,
      unique: true,
      primaryKey: true,
      autoInc: true,
      foreignKey: false,
    },
  ]);
  return (
    <Box
      display={'flex'}
      border={1}
      borderColor={'#EAECF0'}
      bgcolor={'#FFFF'}
      width={768}
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
            fontColor="#344054"
            fontWeight={600}
          />
        </Box>

        <Box display={'flex'} alignItems={'center'}>
          <IconButton onClick={() => true} style={{ marginRight: 15, marginLeft: 10 }}>
            <CancelIcon />
          </IconButton>
          <IconButton onClick={() => true}>
            <TickIcon />
          </IconButton>
        </Box>
      </Box>

      {tableRows.map((row) => {
        return <TableRow {...{ ...row }} />;
      })}

      <Box
        display={'flex'}
        borderTop={1}
        borderColor={'#EAECF0'}
        height={40}
        alignItems={'center'}
        justifyContent={'flex-end'}
        paddingRight={'10px'}
      >
        <IconButton>
          <NewRowPlus />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Table;
