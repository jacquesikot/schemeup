import { useLocation, useParams } from 'react-router-dom';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { Handle, Position } from 'reactflow';

import EditIcon from '../../images/icons/EditIcon';
import getTypeColorCode from '../../utils/getTypeColor';
import { PostgresColumnType } from '../../types/tableTypes';
import { useAppSelector } from '../../redux/hooks';
import routes from '../../routes';

interface CanvasTableColumnProps {
  name: string;
  type: PostgresColumnType;
  primaryKey: boolean;
  foreignKey: boolean;
  nullable: boolean;
  unique: boolean;
  default: string;
  comment?: string;
}

export interface CanvasTableProps {
  title?: string;
  columns: CanvasTableColumnProps[];
  handleEdit: () => void;
}

export const TABLE_WIDTH = 450;

const CanvasTableColumn = ({ name, type, nullable, foreignKey, primaryKey }: CanvasTableColumnProps) => {
  return (
    <Box display={'flex'} height={40} paddingLeft={'10px'} borderTop={1} borderColor={'#EAECF0'} alignItems={'center'}>
      <Typography fontFamily={'IBM Plex Mono'} fontSize={14} color={'#344054'} width={'35%'} mr={1}>
        {name}
      </Typography>

      <Tooltip title={type}>
        <Typography
          fontFamily={'IBM Plex Mono'}
          fontSize={14}
          color={getTypeColorCode(type)}
          width={'30%'}
          height={'100%'}
          display={'flex'}
          alignItems={'center'}
          noWrap
          marginRight={2}
        >
          {type}
        </Typography>
      </Tooltip>

      <Box width={'50px'}>
        {nullable && (
          <Typography fontFamily={'IBM Plex Mono'} fontSize={14} color={'rgba(52, 64, 84, 0.6)'}>
            NULL
          </Typography>
        )}
      </Box>

      <Box display={'flex'} flex={1} alignItems={'center'} justifyContent={'space-between'} pr={2}>
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
  const { id } = useParams();
  const location = useLocation();
  const activeTableId = useAppSelector((state) => state.schemas.schemas.filter((s) => s.id === id)[0].activeTable);
  const schema = useAppSelector((state) => state.schemas.schemas.filter((s) => s.id === id))[0];

  return (
    <Box
      width={TABLE_WIDTH}
      border={activeTableId === data.id ? 2 : 1}
      borderColor={activeTableId === data.id ? '#6941C6' : '#EAECF0'}
      bgcolor={'white'}
      borderRadius={'5px'}
    >
      <Handle type="source" position={Position.Right} />

      <Handle type="target" position={Position.Left} />

      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
        height={40}
        borderRadius={'5px'}
        paddingLeft={'10px'}
        paddingRight={'10px'}
      >
        <Typography typography="tableTitle" fontWeight={600} fontSize={16} color={'#344054'}>
          {data.title}
        </Typography>

        {!location.pathname.includes(routes.SHARE_SCHEMA) && (
          <IconButton>
            <EditIcon onClick={() => data.handleUpdate()} />
          </IconButton>
        )}
      </Box>
      {schema.meta.showColumns &&
        data.columns &&
        data.columns.map((column: CanvasTableColumnProps, index: number) => (
          <CanvasTableColumn key={index} {...column} />
        ))}
    </Box>
  );
};

export default CanvasTable;
