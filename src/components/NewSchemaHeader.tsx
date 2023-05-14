import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Forward from '../images/icons/canvas-controls/Forward';
import Pointer from '../images/icons/canvas-controls/Pointer';
import Undo from '../images/icons/canvas-controls/Undo';
import Link from '../images/icons/canvas-controls/Link';
import Comment from '../images/icons/canvas-controls/Comment';
import Table from '../images/icons/canvas-controls/Table';

export default function NewSchemaHeader() {
  const { name } = useParams<{ name: string }>();

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
      borderColor={'#EAECF0'}
      width={'100%'}
    >
      {/* SCHEMA TITLE */}
      <Box display={'flex'} alignItems={'center'}>
        <Typography fontSize={18} color={'#101828'} fontWeight={500}>
          {name}
        </Typography>
        <Box
          height={'22px'}
          width={'77px'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          bgcolor={'#F9F5FF'}
          borderRadius={16}
          ml={2}
        >
          <Typography fontSize={12} color={'#6941C6'} fontWeight={500}>
            No Tables
          </Typography>
        </Box>
      </Box>

      {/* CANVAS CONTROLS */}
      <Box display={'flex'} width={'30%'} justifyContent={'space-between'}>
        <Tooltip title="Undo">
          <IconButton>
            <Undo />
          </IconButton>
        </Tooltip>

        <Tooltip title="Forward">
          <IconButton>
            <Forward />
          </IconButton>
        </Tooltip>

        <Tooltip title="Mouse">
          <IconButton>
            <Pointer />
          </IconButton>
        </Tooltip>

        <Tooltip title="New Table">
          <IconButton>
            <Table />
          </IconButton>
        </Tooltip>

        <Tooltip title="New Relation">
          <IconButton>
            <Link />
          </IconButton>
        </Tooltip>

        <Tooltip title="Comment">
          <IconButton>
            <Comment />
          </IconButton>
        </Tooltip>
      </Box>

      {/* SHARE/EXPORT CONTROLS */}
      <Box>
        <h4>Share Controls</h4>
      </Box>
    </Box>
  );
}
