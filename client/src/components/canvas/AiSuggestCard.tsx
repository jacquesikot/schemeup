import { Box, Typography } from '@mui/material';
import React from 'react';

interface AiSuggestCardProps {
  title: string;
  body: string;
}

const AiSuggestCard = ({ title, body }: AiSuggestCardProps) => {
  const returnStatus = () => {
    if (title === 'high') {
      return {
        color: '#F04438',
        text: 'High',
      };
    }
    if (title === 'medium') {
      return {
        color: '#FDC04F',
        text: 'Medium',
      };
    }
    if (title === 'low') {
      return {
        color: '#076839',
        text: 'Low',
      };
    }
    return {
      color: '#076839',
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
      <Typography fontWeight={400} fontSize={16} color={'#101828'}>
        {body}
      </Typography>
    </Box>
  );
};

export default AiSuggestCard;
