import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { InputLabel, MenuItem, FormControl, Select, InputBase, Divider, TextField, Box, IconButton, Typography, Link, Icon, Avatar } from '@mui/material';
import PostgresIcon from '../../images/icons/PostgresIcon';
import MongoDbIcon from '../../images/icons/MongoDbIcon';
import MySql from '../../images/icons/MySql';
import { FileUploader } from "react-drag-drop-files";
import UploadCloud from '../../images/icons/UploadCloud';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 14,
    fontWeight: 600,
    padding: '10px 26px 10px 12px',
    display: "flex",
    alignItems: "center",
    gap: 0,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}));

// interface File {
//   [prop: string]: string;
// }

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

const ImportSchemaModalForm = () => {
  const [dbType, setDbType] = useState("postgres");
  const [file, setFile] = useState<File | null>();
  const fileTypes = ["SQL", "JSON"];

  const handleDbTypeChange = (event: { target: { value: string } }) => {
    setDbType(event.target.value);
  };

  const handleFileUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setFile((event.target as HTMLInputElement)?.files[0]);
  }

  return (
  <>
    <FormControl sx={{ mt: 3 }} fullWidth variant="standard">
      <InputLabel shrink={false} sx={{ my: -2.5, fontWeight: 600, fontSize: 12 }} htmlFor="database-type">
        Database Type*
      </InputLabel>
      <Select
        id="database-type"
        value={dbType}
        onChange={handleDbTypeChange}
        input={<BootstrapInput />}
        sx={{ width: "50%" }}
      >
        <MenuItem value={"postgres"}>
          <PostgresIcon width={25} height={25} style={{ marginRight: 5 }} /> Postgres
        </MenuItem>
        <MenuItem value={"mongodb"}>
          <MongoDbIcon width={25} height={25} style={{ marginRight: 5 }} /> MongoDB
        </MenuItem>
        <MenuItem value={"mysql"}>
          <MySql width={25} height={25} style={{ marginRight: 5 }} /> MySQL
        </MenuItem>
      </Select>
    </FormControl>

    <FormControl fullWidth variant="standard">
      <FileUploader handleChange={handleFileUploadChange} name="file" types={fileTypes}>
        <Box sx={{ textAlign: "center", border: "1px solid #D0D5DD", borderRadius: "4px", py: 2, my: 2, cursor: "pointer" }}>
          <Avatar sx={{ mx: "auto", mb: 1, backgroundColor: "#F2F4F7" }}><UploadCloud color="#475467" /></Avatar>
          <Link fontWeight={600} sx={{ textDecoration: "none" }}>Click to upload</Link>
          <Typography component="span"> or drag and drop</Typography>
          <Typography variant="subtitle1" fontSize={12}>SQL, JSON (max 20mb)</Typography>
        </Box>
      </FileUploader>

      <Divider sx={{ color: "GrayText", mx: -3 }}>OR</Divider>

      <TextField
        id="outlined-multiline-static"
        label="Paste SQL DDL or Mongo objects"
        placeholder="Paste SQL DDL or Mongo objects"
        multiline
        fullWidth
        rows={5}
        sx={{ my: 1.5 }}
      />
    </FormControl>
  </>

  );
}

export default ImportSchemaModalForm;