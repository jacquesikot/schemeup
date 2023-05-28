// import Button from '../global/Button';
import BaseModal, { ModalProps } from './BaseModal';
import { Button, Box, Typography, Grid, IconButton, Avatar } from '@mui/material';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import CodeBoxIcon from '../../images/icons/CodeBoxIcon';
import UploadSchemaModalForm from './UploadSchemaModalForm';

const UploadSchemaModal = ({ open, handleClose, containerStyle }: ModalProps) => {
  const uploadSchemaHandler = (e: any) => {
    console.log(e);
  }

  return (
    <BaseModal open={open} handleClose={handleClose} >
      <Box sx={{ ...containerStyle, paddingX: 3, paddingY: 2.5, borderRadius: 3, }}>
        <Grid container direction={"row"} justifyContent={"space-between"} alignItems={"top"}>
          <Grid item>
          <Avatar sx={{ mb: 2, backgroundColor: "#D1FADF", border: "6px solid #ECFDF3", "&:hover": { backgroundColor: "#FEE4E2" } }}>
              <CodeBoxIcon />
            </Avatar>
          </Grid>
          <Grid item>
            <IconButton onClick={handleClose}>
              <ClearRoundedIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Typography id="modal-title" variant="h5" component="h2" fontWeight={600}>
          Import Schema
        </Typography>
        <Typography id="modal-description" variant="subtitle2" sx={{ mt: 0.5, mb: 0.4 }}>
          Select your schema type and upload file or paste data
        </Typography>

        <UploadSchemaModalForm />

        <Grid container spacing={2} direction="row" justifyContent="flex-end" sx={{ mt: 0.8, padding: "0 2px" }}>
          <Grid item xs={4}>
            <Button variant={"outlined"} fullWidth={true} size={"large"} style={{ color: "#344054", borderColor: "#D0D5DD", borderRadius: "10px", textTransform: "capitalize", fontSize: "13.5px", fontWeight: 600, padding: "11px 0" }} onClick={handleClose}>Cancel</Button>
          </Grid>
          <Grid item xs={5}>
            <Button variant={"contained"} color={"primary"} fullWidth={true} size={"large"} style={{ borderRadius: "10px", textTransform: "capitalize", fontSize: "13.5px", padding: "11px 0" }} onClick={uploadSchemaHandler}>import schema</Button>
          </Grid>
        </Grid>
      </Box>
    </BaseModal>
  );
};

export default UploadSchemaModal;
