import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { SuggestionInfoIcon } from '../../images/icons/SuggestionInfoIcon';

interface SolutionProps {
  header: string;
  body: string;
  onPressLearnMore: () => void;
  onPressFixNow: () => void;
}

interface AiSuggestCardProps {
  question: string;
  onPressInfo: () => void;
  solutions: SolutionProps[];
  severity: 'high' | 'medium' | 'low';
}

const AiSuggestCard = ({ question, solutions, severity }: AiSuggestCardProps) => {
  const theme = useTheme();
  const colors = theme.palette;
  return (
    <Box
      sx={{
        border: `1px solid ${
          severity === 'high'
            ? `${colors.error.main}`
            : severity === 'medium'
            ? `${colors.warning.main}`
            : `${colors.success.main}`
        }`,
        borderRadius: 1,
        p: 2,
        mb: '18px',
      }}
    >
      <Box display={'flex'} justifyContent={'space-between'} p={0}>
        <Typography sx={{ fontWeight: 500, fontSize: 14, color: colors.grey[800] }}>{question}</Typography>
        {/* <SuggestionInfoIcon /> */}
      </Box>
      {solutions.map((s) => (
        <Box
          sx={{
            bgcolor: colors.grey[50],
            my: '13px',
            p: 1,
            borderRadius: '8px',
            fontSize: 14,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* <Typography sx={{ fontWeight: 600 }}>{s.header}</Typography> */}
            <Typography fontSize={14} color={colors.grey[700]}>
              {s.body}
            </Typography>
            {/* <Box
              sx={{
                fontWeight: 600,
                p: '0',
              }}
            >
              <Button sx={{ color: 'rgba(45, 48, 53, 1)' }} size="small" onClick={s.onPressFixNow}>
                Fix Now
              </Button>
              <Button sx={{ color: 'rgba(45, 48, 53, 1)' }} size="small" onClick={s.onPressLearnMore}>
                Learn More
              </Button>
            </Box> */}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default AiSuggestCard;
