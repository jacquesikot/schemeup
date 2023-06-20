import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, IconButton } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import BaseModal, { BaseModalProps } from '../BaseModal';
import { CancelIcon } from '../../../images/icons/CancelIcon';
import Button from '../../global/Button';
import { ImportSchemaIcon } from '../../../images/icons/canvas-controls/ImportSchemaIcon';
import parsePgDump from '../../../utils/parsers/parsePgDump';
import { importTables } from '../../../redux/slice/schemas';
import { useAppDispatch } from '../../../redux/hooks';
import { triggerSnack } from '../../../redux/slice/app';
import ImportSchemaModalForm from './ImportSchemaModalForm';

interface ImportModalProps extends BaseModalProps {
  schemaId: string;
}

const ImportSchemaModal = ({ open, handleClose, containerStyle, schemaId }: ImportModalProps) => {
  const [sql, setSql] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const colors = theme.palette;

  // get sql string from either file or text input in ImportSchemaModalForm
  const getSqlString = (data: string) => {
    setSql(data);
  };

  const handleImport = async () => {
    try {
      setIsLoading(true);
      const schemaData = await parsePgDump(sql);
      console.log(sql);
      const schema = JSON.parse(schemaData.body);
      dispatch(
        importTables({
          schemaId,
          tables: schema.data.map((d: any) => {
            return {
              id: uuidv4(),
              name: d.name,
              columns: d.columns.map((c: any) => {
                return {
                  ...c,
                };
              }),
              foreignKeys: [],
              indexes: [],
            };
          }),
        })
      );
      setIsLoading(false);
      dispatch(triggerSnack({ message: 'DB Schema Imported Successfully', severity: 'success', hideDuration: 2000 }));
    } catch (error) {
      setIsLoading(false);
      dispatch(triggerSnack({ message: 'Error Importing DB Schema', severity: 'error', hideDuration: 2000 }));
    }
  };

  return (
    <BaseModal open={open} handleClose={handleClose} containerStyle={containerStyle}>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <ImportSchemaIcon />
        <IconButton onClick={handleClose}>
          <CancelIcon color={colors.grey[500]} />
        </IconButton>
      </Box>
      <Box marginTop={1}>
        <Typography fontSize={18} fontWeight={600} color={colors.grey[800]}>
          Import Schema
        </Typography>
        <Typography fontSize={14} fontWeight={400} color={colors.grey[600]} lineHeight={'25px'} mt={0.7}>
          Select your schema and update the file or paste data
        </Typography>
      </Box>

      <ImportSchemaModalForm getSql={getSqlString} sql={sql} />

      <Box mt={3.5} display={'flex'} justifyContent={'flex-end'}>
        <Button type="secondary" onClick={handleClose} label="Cancel" height={44} style={{ marginRight: 10 }} />
        <Button
          type="primary"
          onClick={(e) => {
            handleImport();
            handleClose(e);
          }}
          label="Import Schema"
          height={44}
          isLoading={isLoading}
          isLoadingText="Importing..."
        />
      </Box>
    </BaseModal>
  );
};

export default ImportSchemaModal;
