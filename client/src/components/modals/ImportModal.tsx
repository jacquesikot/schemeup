import { useState } from 'react';
import BaseModal, { ModalProps } from './BaseModal';
import { Box, Typography, IconButton, styled, TextField } from '@mui/material';
import { CancelIcon } from '../../images/icons/CancelIcon';
import Button from '../global/Button';
import { ImportSchemaIcon } from '../../images/icons/canvas-controls/ImportSchemaIcon';
// import parseDumpToTables from '../../utils/parseDumpToTable';


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
    // height: 200,
    maxHeight: 600,
    fontFamily: 'IBM Plex Mono',

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
  },
});

const ImportModal = ({ open, handleClose, containerStyle }: ModalProps) => {
  const [sql, setSql] = useState<string>('');

  const handleImport = () => {
    // const schema = parseDumpToTables(sql);
    // console.log('schema', schema);
  };

  return (
    <BaseModal open={open} handleClose={handleClose} containerStyle={containerStyle}>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <ImportSchemaIcon />
        <IconButton onClick={handleClose}>
          <CancelIcon color={'#667085'} />
        </IconButton>
      </Box>
      <Box marginTop={1} marginBottom={2.5}>
        <Typography fontSize={18} fontWeight={600} color={'#101828'}>
          Import Schema
        </Typography>
        <Typography fontSize={14} fontWeight={400} color={'#475467'} lineHeight={'25px'} mt={.7}>
          Select your schema and update the file or paste data
        </Typography>
      </Box>

      <StyledTextField
        style={{ width: '100%', overflow: 'hidden' }}
        multiline
        placeholder="Paste SQL DDL here.."
        value={sql}
        onChange={(e) => setSql(e.target.value)}
      />

      <Box mt={3.5} display={'flex'} justifyContent={'flex-end'}>
        <Button
          type="secondary"
          onClick={handleClose}
          label="Cancel"
          width={'25%'}
          height={44}
          style={{ marginRight: 10 }}
        />
        <Button type="primary" onClick={handleImport} label="Import Schema" width={'40%'} height={44} />
      </Box>
    </BaseModal>
  );
};

export default ImportModal;
