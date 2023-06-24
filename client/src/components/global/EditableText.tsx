import { useState } from 'react';
import { Box, ButtonBase, TextField, Typography, styled } from '@mui/material';
import { CancelIcon } from '../../images/icons/CancelIcon';
import { TickIcon } from '../../images/icons/TickIcon';

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: number;
  fontColor?: string;
  disableEdit?: boolean;
}

const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#344054',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#B2BAC2',
  },
  '& .MuiOutlinedInput-root': {
    color: '#344054',
    fontSize: 16,
    height: 44,
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

const EditableText = ({
  value,
  onSave,
  fontFamily,
  fontSize = 14,
  fontWeight = 500,
  fontColor = '#000',
  disableEdit = false,
}: EditableTextProps) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [textValue, setTextValue] = useState<string>(value);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.value.replace(/\s/g, '_');
    setTextValue(updatedValue);
  };

  const handleSave = () => {
    onSave(textValue);
    setEditMode(false);
  };

  if (editMode) {
    return (
      <Box display={'flex'} alignItems={'center'}>
        <StyledTextField value={textValue} onChange={handleTextChange} />

        <Box display={'flex'} alignItems={'center'}>
          <ButtonBase onClick={() => setEditMode(false)} style={{ marginRight: 15, marginLeft: 10 }}>
            <CancelIcon />
          </ButtonBase>
          <ButtonBase onClick={handleSave}>
            <TickIcon />
          </ButtonBase>
        </Box>
      </Box>
    );
  } else {
    return (
      <ButtonBase
        onClick={disableEdit ? undefined : () => setEditMode(true)}
        disableTouchRipple
        sx={{
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#FFFFFF',
          },
          '&:active': {
            backgroundColor: '#FFF',
          },
        }}
      >
        <Box>
          <Typography fontSize={fontSize} fontWeight={fontWeight} color={fontColor}>
            {value}
          </Typography>
        </Box>
      </ButtonBase>
    );
  }
};

export default EditableText;
