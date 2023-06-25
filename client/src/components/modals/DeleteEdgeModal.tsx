import { Box, Typography, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import BaseModal, { SingleModalProps } from './BaseModal';
import { DeleteModalIcon } from '../../images/icons/DeleteModalIcon';
import { CancelIcon } from '../../images/icons/CancelIcon';
import Button from '../global/Button';
import { useAppDispatch } from '../../redux/hooks';
import { triggerSnack } from '../../redux/slice/app';

interface DeleteEdgeModalProps extends SingleModalProps {
  handleEdgeDelete: () => void;
}

const DeleteEdgeModal = ({ open, handleClose, containerStyle, schemaId, handleEdgeDelete }: DeleteEdgeModalProps) => {
  const theme = useTheme();
  const colors = theme.palette;
  const dispatch = useAppDispatch();
  return (
    <BaseModal open={open} handleClose={handleClose} containerStyle={containerStyle}>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <DeleteModalIcon />
        <IconButton onClick={handleClose}>
          <CancelIcon color={colors.grey[600]} />
        </IconButton>
      </Box>
      <Box marginTop={2}>
        <Typography fontSize={18} fontWeight={600} color={colors.grey[900]}>
          Delete Table
        </Typography>
        <Typography fontSize={14} fontWeight={500} color={colors.grey[600]} lineHeight={'25px'} mt={1}>
          Are you sure you want to delete this relationship? This action cannot be undone.
        </Typography>
      </Box>

      <Box mt={3} display={'flex'} justifyContent={'space-between'}>
        <Button type="secondary" onClick={handleClose} label="Cancel" width={'45%'} height={44} />
        <Button
          type="error"
          onClick={(e) => {
            handleEdgeDelete();
            handleClose(e);
            dispatch(
              triggerSnack({ severity: 'success', message: 'Relationship deleted successfully', hideDuration: 3000 })
            );
          }}
          label="Delete"
          width={'45%'}
          height={44}
        />
      </Box>
    </BaseModal>
  );
};

export default DeleteEdgeModal;
