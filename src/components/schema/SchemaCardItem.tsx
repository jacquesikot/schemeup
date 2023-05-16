import { Box, IconButton, Typography } from '@mui/material';
import SchemaCardIcon from '../../images/icons/schema/SchemaCardIcon';
import ThreeDotsV from '../../images/icons/ThreeDotsV';

interface SchemaCardItemProps {
  title: string;
  description: string;
  noOfTables: string;
}

const SchemaCardItem = ({ title, description, noOfTables }: SchemaCardItemProps) => {
  return (
    <Box width={343} height={174} border={1} borderRadius={'12px'} borderColor={'#EAECF0'}>
      <Box
        borderBottom={1}
        borderColor={'#EAECF0'}
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        p={'14px'}
      >
        <Box display={'flex'} alignItems={'center'}>
          <SchemaCardIcon />

          <Typography fontSize={16} fontWeight={500} marginLeft={'14px'}>
            {title}
          </Typography>
        </Box>

        <IconButton>
          <ThreeDotsV />
        </IconButton>
      </Box>

      <Box pl={'14px'} pr={'14px'} pb={'14px'} pt={'5px'}>
        <Box display={'flex'} alignItems={'flex-end'}>
          <Typography fontSize={30} fontWeight={600} color={'#344054'} mr={0.5}>
            {noOfTables}
          </Typography>
          <Typography mb={1}>tables</Typography>
        </Box>

        <Typography fontSize={'14px'} color={'#475467'}>
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default SchemaCardItem;
