import { Modal, Box, Typography } from '@mui/material';

interface DeleteModalProps {
  open: boolean;
  handleClose: (event: Event | React.SyntheticEvent) => void;
  containerStyle: React.CSSProperties;
}

const DeleteModal = ({ open, handleClose, containerStyle }: DeleteModalProps) => {
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
      <Box sx={containerStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Text in a modal
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
      </Box>
    </Modal>
  );
};

export default DeleteModal;
