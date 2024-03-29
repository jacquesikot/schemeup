import { Box, Modal } from '@mui/material';
import React from 'react';

export const appColors = {
  primary: '#6941C6',
  error: '#D92D20',
};

export interface BaseModalProps {
  open: boolean;
  handleClose: (event: Event | React.SyntheticEvent) => void;
  containerStyle?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface SingleModalProps extends BaseModalProps {
  schemaId: string;
}

const BaseModal = ({ open, handleClose, containerStyle, children }: BaseModalProps) => {
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
      <Box sx={{ ...containerStyle, paddingX: 3, paddingY: 2.5 }}>{children}</Box>
    </Modal>
  );
};

export default BaseModal;
