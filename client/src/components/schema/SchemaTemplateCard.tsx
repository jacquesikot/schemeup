import { Box, Button, IconButton, Typography } from '@mui/material';
import Cloud from '../../images/icons/Cloud';
import SchemaCapture from '../../images/schemaimgshot.png';
import { SchemaTemplateIcon } from '../../images/icons/SchemaTemplateIcon';

const SchemaTemplateCard = () => {
  return (
    <Box
      sx={{
        height: '460px',
        width: '360px',
        borderRadius: 1,
        border: '1px solid #EAECF0',
        padding: '16px',
        position: 'relative',
      }}
    >
      <Box>
        <img src={SchemaCapture} alt="Schema Template" height={"auto"} width={"100%"} />
      </Box>
      <IconButton sx={{ position: 'absolute', top: '20px', right: '20px' }}>
        <SchemaTemplateIcon />
      </IconButton>

      <Box mt={'8px'} mb={'4px'} display={'flex'} justifyContent={'space-between'} alignItems={"center"} color={'rgba(105, 65, 198, 1)'}>
        <Typography fontWeight={600} >Mobile</Typography>
        <Typography
          sx={{
            borderRadius: 1,
            px: '10px',
            my: "auto",
            fontSize: 14,
            fontWeight: 500,
            backgroundColor: 'rgba(249, 245, 255, 1)',
          }}
        >
          32 tables
        </Typography>
      </Box>
      <Box>
        <Typography variant='subtitle1' fontSize={20} mb={2}>
          Mobile Social Media Microservice
        </Typography>
        <Typography variant='body2'>
          This is a full scale template description to help users understand more about the features and use cases of
          these templates.
        </Typography>
      </Box>
      <Box display={'flex'} gap={'8px'} my={'8px'}>
        <Typography
          sx={{
            borderRadius: 1,
            px: '10px',
            my: "auto",
            fontSize: 14,
            fontWeight: 500,
            color: 'rgba(52, 64, 84, 1)',
            backgroundColor: 'rgba(242, 244, 247, 1)',
          }}
        >
          Beginner
        </Typography>
        <Typography
          sx={{
            borderRadius: 1,
            px: '10px',
            my: "auto",
            fontSize: 14,
            fontWeight: 500,
            color: 'rgba(180, 35, 24, 1)',
            backgroundColor: 'rgba(254, 243, 242, 1)',
          }}
        >
          High Performance
        </Typography>
      </Box>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap={.8} pt={1} sx={{color: '#98A2B3'}}>
          <Cloud />
          <Typography fontSize={14.5} fontWeight={600}>1,200</Typography>
        </Box>
        <Button sx={{ textTransform: 'none', fontWeight: 600, fontSize: 15 }}>Import Schema</Button>
      </Box>
    </Box>
  );
};

export default SchemaTemplateCard;
