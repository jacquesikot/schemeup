import { InputBase } from "@mui/material";
import { styled } from "@mui/material/styles";


const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 6,
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
      borderColor: '#6941C6',
      boxShadow: '0 0 0 0.2rem rgba(105, 65, 198, 0.2)',
    },
  },
}));

export default BootstrapInput;