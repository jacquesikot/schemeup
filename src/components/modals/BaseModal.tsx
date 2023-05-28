import { Modal } from '@mui/material';
import React from 'react';

export interface ModalProps {
  open: boolean;
  handleClose: (event: Event | React.SyntheticEvent) => void;
  containerStyle?: React.CSSProperties;
  itemId?: string;
  children?: React.ReactNode;
}

const BaseModal = ({ open, handleClose, children }: ModalProps) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <>{children}</>
    </Modal>
  );
};

export default BaseModal;