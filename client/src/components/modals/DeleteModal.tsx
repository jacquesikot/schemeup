import BaseModal, { ModalProps } from './BaseModal';
import { Box, Typography, IconButton } from '@mui/material';
import { DeleteModalIcon } from '../../images/icons/DeleteModalIcon';
import { CancelIcon } from '../../images/icons/CancelIcon';
import Button from '../global/Button';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { deleteSchema, deleteTable } from '../../redux/slice/schemas';


const DeleteModal = ({ open, handleClose, containerStyle, itemId }: ModalProps) => {
  const dispatch = useAppDispatch();
  const schema = useAppSelector((state) => state.schemas.schemas.filter((s) => s.id === itemId))[0];
  const activeTableId = schema?.activeTable;
  const deleteType = activeTableId ? "table" : "schema";

  const handleDelete = (e: Event) => {
    if (deleteType === "schema") {
      dispatch(deleteSchema(schema.id));
    } else {
      dispatch(deleteTable({ schemaId: schema.id, tableId: activeTableId ? activeTableId : '' }));
    }

    handleClose(e)
  }

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
          Delete {deleteType} {schema?.title}
        </Typography>
        <Typography fontSize={14} fontWeight={500} color={'#475467'} lineHeight={'25px'} mt={1}>
          Are you sure you want to delete this schema? This action cannot be undone.
        </Typography>
      </Box>

      <Box mt={3} display={'flex'} justifyContent={'space-between'}>
        <Button type="secondary" onClick={handleClose} label="Cancel" width={'45%'} height={44} />
        <Button type="error" onClick={handleDelete} label="Delete" width={'45%'} height={44} />
      </Box>
    </BaseModal>
  );
};

export default DeleteModal;
