import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';

// import Pointer from '../images/icons/canvas-controls/Pointer';
import Comment from '../images/icons/canvas-controls/Comment';
import Table from '../images/icons/canvas-controls/Table';
import Share from '../images/icons/canvas-controls/Share';
import Settings from '../images/icons/canvas-controls/Settings';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import EditableText from './global/EditableText';
import { Schema, setNewChanges, updateSchema } from '../redux/slice/schemas';
import ImportIcon from '../images/icons/canvas-controls/ImportIcon';
import Button from './global/Button';
import SchemaButtonUpload from '../images/icons/schema/SchemaButtonUpload';
import { useMutation } from 'react-query';
import { createOrUpdateUserSchemaApi } from '../api/schema';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase.config';
import { triggerSnack } from '../redux/slice/app';

interface NewSchemaHeaderProps {
  toggleSettingsDrawer: (open: boolean) => void;
  drawerState: boolean;
  handleNewTable: () => void;
  handleShare: () => void;
  handleImport: () => void;
  showPreview: () => void;
}

export default function NewSchemaHeader({
  toggleSettingsDrawer,
  drawerState,
  handleNewTable,
  handleShare,
  handleImport,
  showPreview,
}: NewSchemaHeaderProps) {
  const theme = useTheme();
  const colors = theme.palette;
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const schema = useAppSelector((state) => state.schemas.schemas.filter((s) => s.id === id))[0];
  const rightPanelOpen = useAppSelector((state) => state.app.rightPanelOpen);
  const [user] = useAuthState(auth);

  const createOrUpdateSchemaMutation = useMutation((schema: Schema) => createOrUpdateUserSchemaApi(user!.uid, schema), {
    onSuccess: (data) => {
      dispatch(
        updateSchema({
          id: data.id,
          title: data.title,
          tables: data.tables,
          description: data.description,
          hasUnsavedChanges: false,
          activeTable: '',
          meta: {
            showColumns: true,
          },
        })
      );
      dispatch(triggerSnack({ message: 'Schema saved!', severity: 'success', hideDuration: 2000 }));
    },
    onError: (error) => {
      dispatch(triggerSnack({ message: 'Error saving schema', severity: 'error', hideDuration: 2000 }));
    },
  });

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
      borderColor={colors.divider}
      width={'100%'}
    >
      {/* SCHEMA TITLE */}
      <Box display={'flex'} alignItems={'center'}>
        <EditableText
          fontSize={18}
          fontColor={colors.grey[900]}
          fontWeight={500}
          value={schema.title}
          onSave={(e) => {
            const updatedSchema = { ...schema, title: e };
            dispatch(updateSchema(updatedSchema));
            dispatch(setNewChanges({ schemaId: schema.id, hasUnsavedChanges: true }));
          }}
        />
        <Box
          height={'22px'}
          width={'77px'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          bgcolor={colors.background.paper}
          borderRadius={16}
          ml={2}
        >
          <Typography fontSize={12} color={colors.primary.main} fontWeight={500}>
            {schema.tables && schema.tables.length > 0 ? `${schema.tables.length} Tables` : 'No Tables'}
          </Typography>
        </Box>
      </Box>

      {/* CANVAS CONTROLS */}
      <Box display={'flex'} width={350} justifyContent={'space-between'}>
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

        {/* <Tooltip title="Mouse">
          <IconButton>
            <Pointer />
          </IconButton>
        </Tooltip> */}

        <Tooltip title="New Table">
          <IconButton onClick={handleNewTable}>
            <Table />
          </IconButton>
        </Tooltip>

        {/* <Tooltip title="New Relation">
          <IconButton>
            <Link />
          </IconButton>
        </Tooltip> */}

        <Tooltip title="Comment">
          <IconButton>
            <Comment />
          </IconButton>
        </Tooltip>

        <Tooltip title="Preview">
          <IconButton onClick={showPreview}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Share Schema">
          <IconButton onClick={handleShare}>
            <Share />
          </IconButton>
        </Tooltip>

        <Tooltip title="Import Schema">
          <IconButton onClick={handleImport}>
            <ImportIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* SHARE/EXPORT CONTROLS */}
      <Box display={'flex'} width={150} justifyContent={'space-between'}>
        <Button
          disabled={!schema.hasUnsavedChanges}
          type="primary"
          label="Save"
          isLoadingText="Saving..."
          isLoading={createOrUpdateSchemaMutation.isLoading}
          onClick={() => createOrUpdateSchemaMutation.mutate(schema)}
          icon={<SchemaButtonUpload color={!schema.hasUnsavedChanges ? colors.grey[300] : colors.grey[100]} />}
        />

        <Tooltip title="Settings">
          <IconButton onClick={() => toggleSettingsDrawer(!drawerState)}>
            <Settings color={rightPanelOpen ? colors.primary.main : colors.grey[700]} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
