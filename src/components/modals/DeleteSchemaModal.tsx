import BaseModal, { ModalProps } from './BaseModal';
import { Button, Box, Typography, Grid, IconButton, Avatar } from '@mui/material';
import TrashCanIcon from '../../images/icons/TrashCanIcon';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { deleteSchema } from '../../redux/slice/schemas';

const DeleteSchemaModal = ({ open, handleClose, containerStyle, itemId }: ModalProps) => {
  const schemas = useAppSelector((state) => state.schemas.schemas);
  const dispatch = useAppDispatch()

  const [activeSchema] = schemas.filter((schema) => schema.id === itemId);

  const deleteSchemaHandler = (e: Event | React.SyntheticEvent) => {
    console.log(itemId);

    if (itemId) {
      dispatch(deleteSchema(itemId));
      handleClose(e);
    }
  }

  return (
    <BaseModal open={open} handleClose={handleClose} >
      <Box sx={{ ...containerStyle, paddingX: 3, paddingY: 2.5, borderRadius: 3, }}>
        <Grid container direction={"row"} justifyContent={"space-between"} alignItems={"top"}>
          <Grid item>
            <Avatar sx={{ mb: 2, color: "#D92D20", backgroundColor: "#FEE4E2", border: "6px solid #FEF3F2", "&:hover": { backgroundColor: "#FEE4E2" } }}>
              <TrashCanIcon />
            </Avatar>
          </Grid>
          <Grid item>
            <IconButton onClick={handleClose}>
              <ClearRoundedIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Typography id="modal-title" variant="h5" component="h2" fontWeight={600}>
          Delete {activeSchema ? activeSchema.title : "this schema"}
        </Typography>
        <Typography id="modal-description" sx={{ mt: 1 }}>
          Are you sure you want to delete this schema? This action cannot be undone.
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2, padding: "0 2px" }}>
          <Grid item xs={6}>
            <Button variant={"outlined"} fullWidth={true} size={"large"} style={{ color: "#344054", borderColor: "#D0D5DD", borderRadius: "10px", textTransform: "capitalize", fontSize: "13.5px", fontWeight: 600, padding: "11px 0" }} onClick={handleClose}>Cancel</Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant={"contained"} fullWidth={true} size={"large"} style={{ backgroundColor: "#D92D20", borderRadius: "10px", textTransform: "capitalize", fontSize: "13.5px", padding: "11px 0" }} onClick={deleteSchemaHandler}>Delete</Button>
          </Grid>
        </Grid>
      </Box>
    </BaseModal>
  );
};

export default DeleteSchemaModal;
