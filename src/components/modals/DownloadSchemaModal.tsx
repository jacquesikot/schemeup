// import Button from '../global/Button';
import BaseModal, { ModalProps } from './BaseModal';
import { Button, Box, Typography, Grid, IconButton, Avatar } from '@mui/material';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import DownloadCloud from '../../images/icons/DownloadCloud';
import DownloadSchemaModalForm from './DownloadSchemaModalForm';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useState } from 'react';

const DownloadSchemaModal = ({ open, handleClose, containerStyle, itemId }: ModalProps) => {
  const schemas = useAppSelector((state) => state.schemas.schemas);
  const { selectedFormat } = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  const downloadSchemaHandler = (e: any) => {
    const activeSchema = schemas.filter((schema) => schema.id === itemId);

    if (selectedFormat === "CSV") {
      console.log(activeSchema);
    } else {
      console.log("We can't produce this format yet!")
    }
  }

  return (
    <BaseModal open={open} handleClose={handleClose} >
      <Box sx={{ ...containerStyle, paddingX: 3, paddingY: 2.5, borderRadius: 3, }}>
        <Grid container direction={"row"} justifyContent={"space-between"} alignItems={"top"}>
          <Grid item>
            <Avatar sx={{ mb: 2, color: "#344054", backgroundColor: "#FFFFFF", border: "1px solid #EAECF0", borderRadius: "6px", "&:hover": { backgroundColor: "#FFFFFF" } }}>
              <DownloadCloud />
            </Avatar>
          </Grid>
          <Grid item>
            <IconButton onClick={handleClose}>
              <ClearRoundedIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Typography id="modal-title" variant="h5" component="h2" fontWeight={600}>
          Download Schema
        </Typography>
        <Typography id="modal-description" variant="subtitle1" sx={{ mt: 0.5, mb: 0.4 }}>
          Choose download format
        </Typography>

        <DownloadSchemaModalForm />

        <Grid container spacing={2} sx={{ mt: 0.8, padding: "0 2px" }}>
          <Grid item xs={6}>
            <Button variant={"outlined"} fullWidth={true} size={"large"} style={{ color: "#344054", borderColor: "#D0D5DD", borderRadius: "10px", textTransform: "capitalize", fontSize: "13.5px", fontWeight: 600, padding: "11px 0" }} onClick={handleClose}>Cancel</Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant={"contained"} color={"primary"} fullWidth={true} size={"large"} style={{ borderRadius: "10px", textTransform: "capitalize", fontSize: "13.5px", padding: "11px 0" }} onClick={downloadSchemaHandler}>confirm</Button>
          </Grid>
        </Grid>
      </Box>
    </BaseModal>
  );
};

export default DownloadSchemaModal;
