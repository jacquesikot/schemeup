import { useState } from 'react';
import { Box, FormControl, FormControlLabel, Icon, IconButton, List, Typography } from '@mui/material';
import BaseModal, { BaseModalProps } from '../BaseModal';
import { CancelIcon } from '../../../images/icons/CancelIcon';
import ShareModalIcon from '../../../images/icons/modals/ShareModalIcon';
import SharedUser from './SharedUser';
import AddUsers from './AddUsers';
import Button from '../../global/Button';
import CopyIcon from '../../../images/icons/modals/CopyIcon';
import CheckboxIcon from '../../../images/icons/modals/CheckboxIcon';

// Can be managed with state for all users who have access to schema
const DUMMY_SHARED_USERS = [
  {
    name: 'Candice Wu',
    email: 'cane@untitledui.com',
    image: 'https://mkorostoff.github.io/hundred-thousand-faces/img/f/4.jpg',
  },
  { name: 'Demi Wikinson', email: 'demi@untitledui.com', image: '' },
  {
    name: 'Drew Cano',
    email: 'drew@untitledui.com',
    image: 'https://mkorostoff.github.io/hundred-thousand-faces/img/m/18.jpg',
  },
];

const ShareSchemaModal = ({ open, handleClose, containerStyle }: BaseModalProps) => {
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <BaseModal open={open} handleClose={handleClose} containerStyle={containerStyle}>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={2.5}>
        <Icon
          style={{
            border: '1px solid #EAECF0',
            borderRadius: 10,
            width: 40,
            height: 40,
            textAlign: 'center',
            padding: '6px 0',
          }}
        >
          <ShareModalIcon color={'#344054'} />
        </Icon>
        <IconButton onClick={handleClose}>
          <CancelIcon color="#667085" />
        </IconButton>
      </Box>

      <Box component="div" mb={2.5}>
        <Typography id="modal-title" variant="h5" component="h2" fontWeight={700} fontSize={18}>
          Share with people
        </Typography>
        <Typography id="modal-description" sx={{ mt: 0.7 }}>
          The following users have access to this project:
        </Typography>
      </Box>

      {/* Autocomplete input component to share schema to other users */}
      <AddUsers />
      {/* List of all shared users */}
      <List sx={{ mb: 1 }}>
        {DUMMY_SHARED_USERS.map((user) => (
          <SharedUser key={user.email} name={user.name} email={user.email} image={user.image} />
        ))}
      </List>

      {/* Secondary Actions */}
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <FormControl sx={{ px: 1 }}>
          <FormControlLabel
            checked={checked}
            onChange={() => {
              setChecked((prevState) => !prevState);
            }}
            label={'Enable Public'}
            control={<CheckboxIcon />}
          />
        </FormControl>
        <IconButton
          sx={{
            '&:hover': {
              backgroundColor: 'transparent',
              color: '#6941C6',
              transform: 'scale(1.03)',
            },
          }}
        >
          <CopyIcon color="#667085" />
          <Typography variant="subtitle2" mx={0.5} fontWeight={700} fontSize={14}>
            Copy
          </Typography>
        </IconButton>
      </Box>

      {/* Buttons: Primary Actions */}
      <Box mt={3} display={'flex'} justifyContent={'space-evenly'} gap={2}>
        <Button type="secondary" onClick={handleClose} label="Cancel" width={'48%'} height={44} />
        <Button type="primary" label="Update Schema" width={'48%'} height={44} />
      </Box>
    </BaseModal>
  );
};

export default ShareSchemaModal;
