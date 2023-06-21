import { useState } from 'react';
import { Box, FormControl, FormControlLabel, Icon, IconButton, List, Typography } from '@mui/material';
import BaseModal, { SingleModalProps } from '../BaseModal';
import { CancelIcon } from '../../../images/icons/CancelIcon';
import ShareModalIcon from '../../../images/icons/modals/ShareModalIcon';
import SharedUser from './SharedUser';
import AddUsers from './AddUsers';
import Button from '../../global/Button';
import CopyIcon from '../../../images/icons/modals/CopyIcon';
import CheckboxIcon from '../../../images/icons/modals/CheckboxIcon';
import { useAppSelector } from '../../../redux/hooks';

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
    image: ''
  },
  {
    name: 'Drew Cano',
    email: 'drew@untitledui.com',
    image: 'https://mkorostoff.github.io/hundred-thousand-faces/img/m/18.jpg',
  },
];

const ShareSchemaModal = ({ open, handleClose, schemaId, containerStyle }: SingleModalProps) => {
  const [checked, setChecked] = useState<boolean>(false);
  const schemas = useAppSelector(state => state.schemas.schemas);
  const activeSchema = schemas.filter(schema => schema.id === schemaId)[0];
  console.log(activeSchema);

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
        <Typography id="modal-title" variant="h5" component="h2" fontWeight={700} fontSize={20}>
          Share with people
        </Typography>
        <Typography id="modal-description" variant="subtitle2" sx={{ mt: 0.7, fontWeight: 400, fontSize: 15 }}>
          The following users have access to this project:
        </Typography>
      </Box>

      {/* Autocomplete input component to share schema to other users */}
      <AddUsers schemaId={schemaId} />

      {/* List of all shared users */}
      {activeSchema?.users?.length ? 
        (<List sx={{ my: 1, maxHeight: "250px", overflowY: "scroll" }}>
          {activeSchema?.users?.map((user) => (
            <SharedUser key={user.email} name={user.name} email={user.email} role={user.role} schemaId={schemaId} image="" />
          ))}
        </List>) :
        (<Typography sx={{textAlign: "center", py: 4, color: "#aaa"}}>No users added yet</Typography>)}
        

      {/* Secondary Actions */}
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mt={1.5}>
        <FormControl sx={{ px: 1 }}>
          <FormControlLabel
            checked={checked}
            onChange={() => {
              setChecked((prevState) => !prevState);
            }}
            label={<Typography variant='subtitle1'>Enable Public</Typography>}
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
        <Button type="primary" label="Done" width={'48%'} height={44} />
      </Box>
    </BaseModal>
  );
};

export default ShareSchemaModal;
