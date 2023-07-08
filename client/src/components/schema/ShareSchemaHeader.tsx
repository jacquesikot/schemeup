import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import EditableText from '../global/EditableText';
import Button from '../global/Button';


export default function ShareSchemaHeader() {
  const { id } = useParams<{ id: string }>();
  const schema = useAppSelector((state) => state.schemas.schemas.filter((s) => s.id === id))[0];

  return (
    <Box
      bgcolor={'white'}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      height={'69px'}
      pl={'24px'}
      pr={'24px'}
      borderBottom={1}
      borderColor={'#EAECF0'}
      width={'100%'}
    >
      {/* SCHEMA TITLE */}
      <Box display={'flex'} alignItems={'center'}>
        <EditableText
          fontSize={18}
          fontColor={'#101828'}
          fontWeight={500}
          value={schema.title}
          onSave={(e) => {
            // const updatedSchema = { ...schema, title: e };
          }}
        />
        <Box
          height={'22px'}
          width={'77px'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          bgcolor={'#F9F5FF'}
          borderRadius={16}
          ml={2}
        >
          <Typography fontSize={12} color={'#6941C6'} fontWeight={500}>
            {schema.tables && schema.tables.length > 0 ? `${schema.tables.length} Tables` : 'No Tables'}
          </Typography>
        </Box>
      </Box>
      
      {/* ACTION BUTTONS */}
      <Box display={"flex"} justifyContent={"space-evenly"} sx={{gap:2}}>
        <Button type='secondary' label='Edit Schema' />
        <Button type='primary' label='Download Schema' />
      </Box>
      
    </Box>
  );
}
