import { InputAdornment, TextField, styled } from '@mui/material';
import InputSearchIcon from '../../images/icons/InputSeachIcon';

const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#A0AAB4',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#B2BAC2',
  },
  '& .MuiOutlinedInput-root': {
    color: '#667085',
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

interface MainSeachInputProps {
  placeholder?: string;
  width?: number | string;
  height?: number | string;
  value?: string;
  setValue?: (value: string) => void;
}

const MainSeachInput = ({ placeholder, width = 400, height = 44, value, setValue }: MainSeachInputProps) => {
  return (
    <StyledTextField
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <InputSearchIcon />
          </InputAdornment>
        ),
      }}
      value={value}
      onChange={(e) => setValue && setValue(e.target.value)}
      id="custom-css-outlined-input"
      placeholder={placeholder}
      style={{ width, borderRadius: 20 }}
    />
  );
};

export default MainSeachInput;
