import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Forward from '../images/icons/canvas-controls/Forward';
import Pointer from '../images/icons/canvas-controls/Pointer';
import Undo from '../images/icons/canvas-controls/Undo';
import Link from '../images/icons/canvas-controls/Link';
import Comment from '../images/icons/canvas-controls/Comment';
import Table from '../images/icons/canvas-controls/Table';
import Share from '../images/icons/canvas-controls/Share';
import Export from '../images/icons/canvas-controls/Export';
import Settings from '../images/icons/canvas-controls/Settings';
import { useAppSelector } from '../redux/hooks';

interface NewSchemaHeaderProps {
  toggleSettingsDrawer: (open: boolean) => void;
  drawerState: boolean;
}

export default function NewSchemaHeader({ toggleSettingsDrawer, drawerState }: NewSchemaHeaderProps) {
  const { id } = useParams<{ id: string }>();
  const schema = useAppSelector((state) => state.schemas.schemas.filter((s) => s.id === id))[0];

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
          {schema.title}
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
            {schema.tables && schema.tables.length > 0 ? `${schema.tables.length} Tables` : 'No Tables'}
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
      <Box display={'flex'} width={'13%'} justifyContent={'space-between'}>
        <Tooltip title="Share Schema">
          <IconButton>
            <Share />
          </IconButton>
        </Tooltip>

        <Tooltip title="Export Schema">
          <IconButton>
            <Export />
          </IconButton>
        </Tooltip>

        <Tooltip title="Settings">
          <IconButton onClick={() => toggleSettingsDrawer(!drawerState)}>
            <Settings />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
