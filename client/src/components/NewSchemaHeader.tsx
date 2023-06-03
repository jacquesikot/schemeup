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
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import EditableText from './global/EditableText';
import { updateSchema } from '../redux/slice/schemas';

interface NewSchemaHeaderProps {
  toggleSettingsDrawer: (open: boolean) => void;
  drawerState: boolean;
  handleNewTable: () => void;
  handleShare: () => void;
  handleImport: () => void;
}

export default function NewSchemaHeader({
  toggleSettingsDrawer,
  drawerState,
  handleNewTable,
  handleShare,
  handleImport,
}: NewSchemaHeaderProps) {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
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
        <EditableText
          fontSize={18}
          fontColor={'#101828'}
          fontWeight={500}
          value={schema.title}
          onSave={(e) => {
            const updatedSchema = { ...schema, title: e };
            dispatch(updateSchema(updatedSchema));
          }}
        />
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
      <Box display={'flex'} width={300} justifyContent={'space-between'}>
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

        <Tooltip title="Mouse">
          <IconButton>
            <Pointer />
          </IconButton>
        </Tooltip>

        <Tooltip title="New Table">
          <IconButton onClick={handleNewTable}>
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
      <Box display={'flex'} width={200} justifyContent={'space-between'}>
        <Tooltip title="Share Schema">
          <IconButton onClick={handleShare}>
            <Share />
          </IconButton>
        </Tooltip>

        <Tooltip title="Import Schema">
          <IconButton onClick={handleImport}>
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
