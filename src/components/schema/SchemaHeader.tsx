import { Box, Typography } from '@mui/material';
import Button from '../global/Button';
import TopBarPlus from '../../images/icons/Plus';
import SchemaButtonUpload from '../../images/icons/schema/SchemaButtonUpload';

const SchemaHeader = () => {
  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      height={'96px'}
      width={'100%'}
      borderBottom={1}
      borderColor={'#EAECF0'}
      pl={2}
      pr={2}
    >
      <Box>
        <Box display={'flex'} alignItems={'center'}>
          <Typography fontSize={18} color={'#101828'} fontWeight={600}>
            All Schemas
          </Typography>
          <Box
            ml={1}
            display={'flex'}
            pl={1}
            pr={1}
            bgcolor={'#F9F5FF'}
            height={22}
            justifyContent={'center'}
            alignItems={'center'}
            borderRadius={16}
          >
            <Typography color={'#6941C6'} fontWeight={500} fontSize={12}>
              10 schemas
            </Typography>
          </Box>
        </Box>

        <Typography fontSize={14} color={'#475467'}>
          Manage and export your schemas
        </Typography>
      </Box>

      <Box display={'flex'} width={'20%'} justifyContent={'space-between'}>
        <Button label={'Upload'} type={'secondary'} icon={<SchemaButtonUpload />} />
        <Button label={'New Schema'} type={'primary'} icon={<TopBarPlus color="#FFF" />} />
      </Box>
    </Box>
  );
};

export default SchemaHeader;
