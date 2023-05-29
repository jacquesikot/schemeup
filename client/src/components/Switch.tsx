import { Box, Paper, Typography, styled } from '@mui/material';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

interface SwitchProps {
  value: string;
  setValue: (value: string) => void;
  badgeValue: number;
}

const Switch = ({ value, setValue, badgeValue }: SwitchProps) => {
  const handleChange = (event: React.MouseEvent<HTMLElement>, newValue: string) => {
    setValue(newValue);
  };

  const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
      margin: theme.spacing(0.5),
      border: 0,
      borderRadius: '6px',
      alignSelf: 'center',
      '&.Mui-disabled': {
        border: 0,
      },
      '&:not(:first-of-type)': {
        borderRadius: theme.shape.borderRadius,
      },
      '&:first-of-type': {
        borderRadius: theme.shape.borderRadius,
      },
      '&.MuiToggleButtonGroup-grouped:not(.Mui-selected)': {
        color: 'rgba(16, 24, 40, 0.6)',
      },
      '&.MuiToggleButtonGroup-grouped.Mui-selected': {
        backgroundColor: 'white',
        boxShadow: `0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)`,
        color: '#344054',
      },
    },
  }));
  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          backgroundColor: '#F9FAFB',
          height: '44px',
          display: 'flex',
          border: '1px solid #F2F4F7',
          borderRadius: '8px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <StyledToggleButtonGroup
          style={{
            width: '100%',
          }}
          size="small"
          value={value}
          onChange={handleChange}
          exclusive
        >
          <ToggleButton style={{ width: '50%', textTransform: 'none' }} value="Settings" aria-label="left aligned">
            <Typography fontWeight={600} fontSize={14}>
              Settings
            </Typography>
          </ToggleButton>

          <ToggleButton style={{ width: '50%', textTransform: 'none' }} value="AI" aria-label="right aligned">
            {badgeValue > 0 && (
              <Box
                style={{
                  position: 'absolute',
                  right: 0,
                  top: -10,
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: 'red',
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                }}
              >
                <Typography fontWeight={600} fontSize={12} color={'white'}>
                  {badgeValue}
                </Typography>
              </Box>
            )}
            <Typography fontWeight={600} fontSize={14}>
              AI Suggestions
            </Typography>
          </ToggleButton>
        </StyledToggleButtonGroup>
      </Paper>
    </Box>
  );
};

export default Switch;
