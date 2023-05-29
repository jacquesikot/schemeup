import { TableCheckboxTick } from '../../images/icons/canvas-controls/TableCheckboxTick';
import { Box, ButtonBase } from '@mui/material';

interface TableCheckboxProps {
  checked: boolean;
  onChange?: () => void;
}

const TableCheckbox = ({ checked, onChange }: TableCheckboxProps) => {
  return (
    <ButtonBase onClick={onChange}>
      <Box
        style={{
          width: 12,
          height: 12,
          border: `1.5px solid #D0D5DD`,
          borderColor: checked ? '#7F56D9' : '#D0D5DD',
          borderRadius: 4,
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          backgroundColor: '#FFF',
        }}
      >
        {checked && <TableCheckboxTick />}
      </Box>
    </ButtonBase>
  );
};

export default TableCheckbox;
