import { Box, Typography } from '@mui/material';
import { Handle, Position } from 'reactflow';
import getTypeColorCode from '../../utils/getTypeColor';
import { PostgresColumnType } from '../../types/tableTypes';

interface CanvasTableColumnProps {
  name: string;
  type: PostgresColumnType;
  primaryKey: boolean;
  foreignKey: boolean;
  notNull: boolean;
  unique: boolean;
  default: string;
  comment?: string;
}

export interface CanvasTableProps {
  title?: string;
  columns: CanvasTableColumnProps[];
}

export const TABLE_WIDTH = 360;

const CanvasTableColumn = ({ name, type, notNull, foreignKey, primaryKey }: CanvasTableColumnProps) => {
  return (
    <Box display={'flex'} height={40} paddingLeft={'10px'} borderTop={1} borderColor={'#EAECF0'} alignItems={'center'}>
      {foreignKey && (
        <>
          <Handle type="target" position={Position.Left} />
          <Handle type="source" position={Position.Right} />
        </>
      )}
      <Typography fontFamily={'IBM Plex Mono'} fontSize={14} color={'#344054'} width={'40%'}>
        {name}
      </Typography>

      <Typography fontFamily={'IBM Plex Mono'} fontSize={14} color={getTypeColorCode(type)} width={'20%'}>
        {type}
      </Typography>

      <Box width={'50px'}>
        {notNull && (
          <Typography fontFamily={'IBM Plex Mono'} fontSize={14} color={'rgba(52, 64, 84, 0.6)'}>
            NULL
          </Typography>
        )}
      </Box>

      <Box display={'flex'} flex={1} alignItems={'center'} justifyContent={'center'}>
        {primaryKey && (
          <Box
            bgcolor={'#F17400'}
            width={25}
            height={25}
            borderRadius={20}
            alignItems={'center'}
            justifyContent={'center'}
            display={'flex'}
          >
            <Typography fontFamily={'IBM Plex Mono'} fontSize={'10px'} fontWeight={600} color={'#FFF'}>
              PK
            </Typography>
          </Box>
        )}
        {foreignKey && (
          <Box
            bgcolor={'#344054'}
            width={25}
            height={25}
            borderRadius={20}
            alignItems={'center'}
            justifyContent={'center'}
            display={'flex'}
          >
            <Typography fontFamily={'IBM Plex Mono'} fontSize={'10px'} fontWeight={600} color={'#FFF'}>
              FK
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const CanvasTable = ({ data }: any) => {
  console.log('data', data);
  return (
    <Box width={TABLE_WIDTH} border={1} borderColor={'#EAECF0'} bgcolor={'white'} borderRadius={'5px'}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <Box display={'flex'} alignItems={'center'} height={40} borderRadius={'5px'} paddingLeft={'10px'}>
        <Typography typography="tableTitle" fontWeight={600} fontSize={16} color={'#344054'}>
          {data.title}
        </Typography>
      </Box>
      {data.columns && data.columns.map((column: CanvasTableColumnProps) => <CanvasTableColumn {...column} />)}
    </Box>
  );
};

export default CanvasTable;
