import { ChangeEvent, useState } from 'react';
import { styled } from '@mui/material/styles';
import { InputLabel, MenuItem, FormControl, Select, Divider, TextField, Box, Typography, Link, Avatar } from '@mui/material';
import { FileUploader } from "react-drag-drop-files";
import PostgresIcon from '../../../images/icons/PostgresIcon';
import Mysql from '../../../images/icons/Mysql';
import Cloud from '../../../images/icons/Cloud';
import BootstrapInput from '../../global/BootstrapInput';
import ArrowDown from '../../../images/icons/ArrowDown';
import ArrowUp from '../../../images/icons/ArrowUp';

const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#A0AAB4',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#B2BAC2',
  },
  '& .MuiOutlinedInput-root': {
    color: '#667085',
    fontSize: 14,
    fontFamily: 'IBM Plex Mono',
    overflow: 'hidden',
    marginTop: 14,

    '& fieldset': {
      borderColor: '#E0E3E7',
      borderRadius: 8,
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6941C6',
    },
    '&.Mui-disabled': {
      backgroundColor: '#e5e5e5',
    },
    '&.Mui-disabled fieldset': {
      borderColor: '#d4d4d4',
    },
  },
});

const ImportSchemaModalForm = ({ getSql }: any) => {
  const [dbType, setDbType] = useState("postgres");
  const [inputType, setInputType] = useState<"fileInput" | "textField" | null>(null);
  const [fileContent, setFileContent] = useState<File | null>();
  const [textContent, setTextContent] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const fileTypes = ["SQL", "JSON", "DOCX", "PDF"];
  // Sets the disabled styling for fileInput ui
  let dynamicSkins; 
  if (inputType === "textField") {
    dynamicSkins = { cursor: "default", color: "#9ca3af", borderColor: "#d4d4d4", backgroundColor: "#e5e5e5" };
  } else {
    dynamicSkins = { cursor: "pointer" };
  };

  // Sets the internal parsing format for input
  const handleDbType = (event: { target: { value: string } }) => {
    setDbType(event.target.value);
  };

  //  Handles sql input from file
  const fileUploadHandler = (doc: File) => {
    setInputType("fileInput");
    setFileContent(doc);
    // process file from server and return the contents as a string.
    // getSql(fileContent);
  };

  // Handles sql input from text field
  const textInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setInputType("textField");
    setTextContent(event.target.value);
    getSql(textContent);

    if (!event.target.value) {
      setInputType(null);
    }
  };

  return (
    <Box>
      <FormControl sx={{ mt: 3 }} fullWidth variant="standard">
        <InputLabel shrink={false} sx={{ my: -2.5, fontWeight: 500, fontSize: 14 }} htmlFor="database-type">
          Database Type*
        </InputLabel>
        <Select
          id="database-type"
          value={dbType}
          onChange={handleDbType}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          input={<BootstrapInput />}
          IconComponent={open ? ArrowUp : ArrowDown}
          sx={{ width: "50%" }}
          SelectDisplayProps={{ style: {fontSize:16, fontWeight:450, }}}
        >
          <MenuItem value={"postgres"}>
            <PostgresIcon width={25} height={25} style={{ marginRight: 5 }} /> Postgres
          </MenuItem>
          <MenuItem value={"mysql"}>
            <Mysql width={25} height={25} style={{ marginRight: 5 }} /> MySQL
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth variant="standard">
        <FileUploader handleChange={fileUploadHandler} name="file" types={fileTypes} disabled={inputType === "textField"}>
          <Box sx={{ textAlign: "center", border: "1px solid #E0E3E7", borderRadius: "8px", py: 2, my: 2, ...dynamicSkins}}>
            <Avatar sx={{ mx: "auto", mb: 1, backgroundColor: "#F2F4F7" }}><Cloud color="#475467" /></Avatar>
            <Link fontWeight={600} sx={{ textDecoration: "none", color: `${inputType==="textField"? "#9ca3af" : "#6941C6"}` }}>Click to upload</Link>
            <Typography component="span"  fontWeight={400}> or drag and drop</Typography>
            <Typography variant="subtitle2" fontSize={12.5} fontWeight={400} mt={.5}>SQL, JSON (max. 20mb)</Typography>
          </Box>
        </FileUploader>
      </FormControl>

      <Divider sx={{ color: "GrayText", mx: -3 }}>OR</Divider>

      <FormControl fullWidth variant="standard" disabled={true}>
        <StyledTextField
          style={{ width: '100%' }}
          multiline
          rows={7}
          placeholder="Paste SQL DDL here..."
          value={textContent}
          onChange={textInputHandler}
          disabled={inputType === "fileInput"}
        />
      </FormControl>
    </Box>

  );
}

export default ImportSchemaModalForm;