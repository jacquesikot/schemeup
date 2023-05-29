import { Modal, Box, Typography, IconButton } from '@mui/material';

import { DeleteModalIcon } from '../../images/icons/DeleteModalIcon';
import { CancelIcon } from '../../images/icons/CancelIcon';
import Button from './Button';

interface DeleteModalProps {
  open: boolean;
  handleClose: (event: Event | React.SyntheticEvent) => void;
  handleDelete: (event: Event | React.SyntheticEvent) => void;
  containerStyle: React.CSSProperties;
  title: string;
  body: string;
}

const DeleteModal = ({ open, handleClose, handleDelete, containerStyle, title, body }: DeleteModalProps) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        style={{
          ...containerStyle,
        }}
      >
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
          <DeleteModalIcon />
          <IconButton onClick={handleClose}>
            <CancelIcon color={'#667085'} />
          </IconButton>
        </Box>
        <Box marginTop={2}>
          <Typography fontSize={18} fontWeight={600} color={'#101828'}>
            {title}
          </Typography>
          <Typography fontSize={14} fontWeight={500} color={'#475467'} lineHeight={'25px'} mt={1}>
            {body}
          </Typography>
        </Box>

        <Box mt={3} display={'flex'} justifyContent={'space-between'}>
          <Button type="secondary" onClick={handleClose} label="Cancel" width={'45%'} height={44} />
          <Button type="error" onClick={handleDelete} label="Delete" width={'45%'} height={44} />
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteModal;
