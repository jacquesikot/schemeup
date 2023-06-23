import { useState } from 'react';
import { Box, FormControl, FormControlLabel, Icon, IconButton, List, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { useAuthState } from 'react-firebase-hooks/auth';

import BaseModal, { SingleModalProps } from '../BaseModal';
import { CancelIcon } from '../../../images/icons/CancelIcon';
import ShareModalIcon from '../../../images/icons/modals/ShareModalIcon';
import SharedUser from './SharedUser';
import AddUsers from './AddUsers';
import Button from '../../global/Button';
import CopyIcon from '../../../images/icons/modals/CopyIcon';
import CheckboxIcon from '../../../images/icons/modals/CheckboxIcon';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { SchemaUser, setNewChanges, updateSchema } from '../../../redux/slice/schemas';
import { updateSchemaUsersApi } from '../../../api/schema';
import { useMutation } from 'react-query';
import { auth } from '../../../firebase.config';
import { triggerSnack } from '../../../redux/slice/app';

// Can be managed with state for all users who have access to schema
const DUMMY_SHARED_USERS = [
  {
    name: 'Candice Wu',
    email: 'cane@untitledui.com',
    image: 'https://mkorostoff.github.io/hundred-thousand-faces/img/f/4.jpg',
  },
  {
    name: 'Demi Wikinson',
    email: 'demi@untitledui.com',
    image: '',
  },
  {
    name: 'Drew Cano',
    email: 'drew@untitledui.com',
    image: 'https://mkorostoff.github.io/hundred-thousand-faces/img/m/18.jpg',
  },
];

const ShareSchemaModal = ({ open, handleClose, schemaId, containerStyle }: SingleModalProps) => {
  const [user] = useAuthState(auth);
  const dispatch = useAppDispatch();
  const [closeEvent, setCloseEvent] = useState<boolean>(false);
  const schemas = useAppSelector((state) => state.schemas.schemas);
  const activeSchema = schemas.filter((schema) => schema.id === schemaId)[0];
  const theme = useTheme();
  const colors = theme.palette;
  const updateUsersMutation = useMutation(
    () =>
      updateSchemaUsersApi({
        authId: user?.uid as string,
        schemaId: schemaId as string,
        users:
          (activeSchema &&
            activeSchema.users &&
            activeSchema.users.map((u) => {
              return {
                email: u.email,
                role: u.role,
              };
            })) ||
          [],
        isPublic: activeSchema.isPublic ? true : false,
        schema: activeSchema,
      }),
    {
      onSuccess: (data) => {
        dispatch(
          triggerSnack({ severity: 'success', message: 'Schema users updated successfully', hideDuration: 2000 })
        );
        handleClose(closeEvent as any);
      },
      onError: (error) => {
        dispatch(triggerSnack({ severity: 'error', message: 'Error updating schema users', hideDuration: 2000 }));
      },
    }
  );

  const handleShareUpdate = () => {
    updateUsersMutation.mutate();
  };

  return (
    <BaseModal open={open} handleClose={handleClose} containerStyle={containerStyle}>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={2.5}>
        <Icon
          style={{
            border: `1px solid ${colors.grey[200]}`,
            borderRadius: 10,
            width: 48,
            height: 48,
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            padding: '6px 0',
          }}
        >
          <ShareModalIcon color={colors.grey[700]} />
        </Icon>
        <IconButton onClick={handleClose}>
          <CancelIcon color={colors.grey[500]} />
        </IconButton>
      </Box>

      <Box component="div" mb={2.5}>
        <Typography
          id="modal-title"
          fontSize={18}
          fontWeight={600}
          color={colors.text.primary}
          style={{ marginBottom: 5 }}
        >
          Share with people
        </Typography>
        <Typography id="modal-description" fontSize={14} fontWeight={400} color={colors.grey[600]}>
          The following users have access to this project:
        </Typography>
      </Box>

      {/* Autocomplete input component to share schema to other users */}
      <AddUsers schemaId={schemaId} />

      {/* List of all shared users */}
      {activeSchema?.users?.length ? (
        <List sx={{ my: 1, height: '200px', maxHeight: '250px', overflowY: 'scroll' }}>
          {activeSchema?.users?.map((user) => (
            <SharedUser
              key={user.email}
              name={user.name}
              email={user.email}
              role={user.role}
              schemaId={schemaId}
              image=""
            />
          ))}
        </List>
      ) : (
        <Typography sx={{ textAlign: 'center', py: 4, color: colors.grey[400] }}>No users added yet</Typography>
      )}

      {/* Secondary Actions */}
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mt={1.5}>
        <FormControl sx={{ px: 1 }}>
          <FormControlLabel
            checked={activeSchema?.isPublic ? true : false}
            onChange={() => {
              dispatch(updateSchema({ ...activeSchema, isPublic: !activeSchema?.isPublic }));
              dispatch(setNewChanges({ schemaId, hasUnsavedChanges: true }));
            }}
            label={<Typography variant="subtitle1">Enable Public</Typography>}
            control={<CheckboxIcon />}
          />
        </FormControl>
        <IconButton
          sx={{
            '&:hover': {
              backgroundColor: 'transparent',
              transform: 'scale(1.03)',
            },
          }}
        >
          <CopyIcon />
          <Typography variant="subtitle1" marginLeft={1} fontWeight={600} fontSize={14} color="#333">
            Copy
          </Typography>
        </IconButton>
      </Box>

      {/* Buttons: Primary Actions */}
      <Box mt={3} display={'flex'} justifyContent={'space-evenly'} gap={2}>
        <Button type="secondary" onClick={handleClose} label="Cancel" width={'48%'} height={44} />
        <Button
          type="primary"
          isLoading={updateUsersMutation.isLoading}
          isLoadingText="Updating..."
          label="Done"
          width={'48%'}
          height={44}
          onClick={(e) => {
            setCloseEvent(e);
            handleShareUpdate();
          }}
        />
      </Box>
    </BaseModal>
  );
};

export default ShareSchemaModal;
