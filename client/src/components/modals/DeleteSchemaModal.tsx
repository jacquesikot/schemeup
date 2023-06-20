import { Box, Typography, IconButton } from '@mui/material';

import BaseModal, { SingleModalProps } from './BaseModal';
import { DeleteModalIcon } from '../../images/icons/DeleteModalIcon';
import { CancelIcon } from '../../images/icons/CancelIcon';
import Button from '../global/Button';

interface DeleteSchemaModalProps extends SingleModalProps {
  handleSchemaDelete: () => void;
}

const DeleteSchemaModal = ({
  open,
  handleClose,
  containerStyle,
  schemaId,
  handleSchemaDelete,
}: DeleteSchemaModalProps) => {
  return (
    <BaseModal open={open} handleClose={handleClose} containerStyle={containerStyle}>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <DeleteModalIcon />
        <IconButton onClick={handleClose}>
          <CancelIcon color={'#667085'} />
        </IconButton>
      </Box>
      <Box marginTop={2}>
        <Typography fontSize={18} fontWeight={600} color={'#101828'}>
          Delete Schema
        </Typography>
        <Typography fontSize={14} fontWeight={500} color={'#475467'} lineHeight={'25px'} mt={1}>
          Are you sure you want to delete this schema? This action cannot be undone.
        </Typography>
      </Box>

      <Box mt={3} display={'flex'} justifyContent={'space-between'}>
        <Button type="secondary" onClick={handleClose} label="Cancel" width={'45%'} height={44} />
        <Button
          type="error"
          onClick={(e) => {
            handleSchemaDelete();
            handleClose(e);
          }}
          label="Delete"
          width={'45%'}
          height={44}
        />
      </Box>
    </BaseModal>
  );
};

export default DeleteSchemaModal;
