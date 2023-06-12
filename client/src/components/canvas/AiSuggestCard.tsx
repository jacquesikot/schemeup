import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface AiSuggestCardProps {
  title: string;
  body: string;
}

const AiSuggestCard = ({ title, body }: AiSuggestCardProps) => {
  const theme = useTheme();
  const colors = theme.palette;
  const returnStatus = () => {
    if (title === 'high') {
      return {
        color: colors.error.main,
        text: 'High',
      };
    }
    if (title === 'medium') {
      return {
        color: colors.warning.main,
        text: 'Medium',
      };
    }
    if (title === 'low') {
      return {
        color: colors.success.main,
        text: 'Low',
      };
    }
    return {
      color: colors.success.main,
      text: 'Low',
    };
  };
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      width={'100%'}
      border={1}
      borderRadius={'8px'}
      mb={1}
      p={'10px'}
      borderColor={returnStatus()?.color}
    >
      <Typography fontWeight={500} fontSize={16} color={returnStatus().color}>
        {returnStatus()?.text}
      </Typography>
      <Typography fontWeight={400} fontSize={16} color={colors.grey[900]}>
        {body}
      </Typography>
    </Box>
  );
};

export default AiSuggestCard;
