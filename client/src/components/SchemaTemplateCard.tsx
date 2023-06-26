import { Box, Button, IconButton, Typography } from '@mui/material';
import Cloud from '../images/icons/Cloud';
import schemaimgshot from '../images/schemaimgshot.png';
import { SchemaTemplateIcon } from '../images/icons/SchemaTemplateIcon';

const SchemaTemplateCard = () => {
  return (
    <Box
      sx={{
        height: '450px',
        width: '343px',
        borderRadius: 1,
        border: '1px solid  #EAECF0',

        px: '16px',
        position: 'relative',
      }}
    >
      <Box mt={'20px'} mb={'16px'}>
        <img src={schemaimgshot} alt="Schema Template" height={178} width={311} />
      </Box>
      <IconButton sx={{ position: 'absolute', top: '20px', right: '20px' }}>
        <SchemaTemplateIcon />
      </IconButton>

      <Box display={'flex'} justifyContent={'space-between'} color={'rgba(105, 65, 198, 1)'}>
        <Typography>Mobile</Typography>
        <Typography
          sx={{
            borderRadius: 1,
            backgroundColor: 'rgba(249, 245, 255, 1)',
            px: '8px',
          }}
        >
          32 tables
        </Typography>
      </Box>
      <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'} mb={'9px'}>
        <Typography
          sx={{
            fontSize: '18px',
            fontFamily: 'Inter',
            fontWeight: '500',
            lineHeight: '28px',
            color: 'rgba(16, 24, 40, 1)',
            mb: '16px',
          }}
        >
          Mobile Social Media Microservice
        </Typography>
        <Typography sx={{ fontSize: '14px', fontFamily: 'Inter', lineHeight: '20px' }}>
          This is a full scale template description to help users understand more about the features and use cases of
          these templates.
        </Typography>
      </Box>
      <Box display={'flex'} gap={'8px'} mb={'13px'}>
        <Typography
          sx={{
            borderRadius: 1,
            backgroundColor: 'rgba(242, 244, 247, 1)',
            px: '8px',
            color: 'rgba(52, 64, 84, 1)',
          }}
        >
          Beginner
        </Typography>
        <Typography
          sx={{
            borderRadius: 1,
            backgroundColor: 'rgba(254, 243, 242, 1)',
            px: '8px',
            color: 'rgba(180, 35, 24, 1)',
          }}
        >
          High Performance
        </Typography>
      </Box>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <Cloud />
          <Typography>1,200</Typography>
        </Box>
        <Button sx={{ textTransform: 'none' }}>Import Schema</Button>
      </Box>
    </Box>
  );
};

export default SchemaTemplateCard;
