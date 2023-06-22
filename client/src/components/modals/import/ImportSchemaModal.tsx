import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, IconButton } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useMutation } from 'react-query';
import { useAuthState } from 'react-firebase-hooks/auth';

import BaseModal, { SingleModalProps } from '../BaseModal';
import { CancelIcon } from '../../../images/icons/CancelIcon';
import Button from '../../global/Button';
import { ImportSchemaIcon } from '../../../images/icons/canvas-controls/ImportSchemaIcon';
import { importTables } from '../../../redux/slice/schemas';
import { useAppDispatch } from '../../../redux/hooks';
import { triggerSnack } from '../../../redux/slice/app';
import ImportSchemaModalForm from './ImportSchemaModalForm';
import { parsePgDump } from '../../../api/parse';
import { auth } from '../../../firebase.config';

const ImportSchemaModal = ({ open, handleClose, containerStyle, schemaId }: SingleModalProps) => {
  const [user] = useAuthState(auth);
  const [sql, setSql] = useState<any>();
  const [modalEvent, setModalEvent] = useState<string>('');
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const colors = theme.palette;
  const parsePgDumpMutation = useMutation((sql: string) => parsePgDump({ file: sql, userId: user?.uid as string }), {
    onSuccess: (data) => {
      dispatch(
        importTables({
          schemaId,
          tables: data.map((d: any) => {
            return {
              id: uuidv4(),
              name: d.name,
              columns: d.columns.map((c: any) => {
                return {
                  ...c,
                };
              }),
              foreignKeys: [
                ...d.foreignKeys.map((f: any) => {
                  return {
                    name: f.name,
                    column: f.column,
                    referenceTable: f.referenceTable,
                    referenceColumn: f.referenceColumn,
                    onUpdate: f.onUpdate,
                    onDelete: f.onDelete,
                  };
                }),
              ],
              indexes: [],
            };
          }),
        })
      );
      setSql('');
      dispatch(triggerSnack({ message: 'DB Schema Imported Successfully', severity: 'success', hideDuration: 2000 }));
      handleClose(modalEvent as any);
    },
    onError: (error) => {
      dispatch(triggerSnack({ message: 'Error Importing DB Schema', severity: 'error', hideDuration: 2000 }));
    },
  });

  // get sql string from either file or text input in ImportSchemaModalForm
  const getSqlString = (data: string) => {
    setSql(data);
  };

  const handleImport = async (e: any) => {
    parsePgDumpMutation.mutate(sql);
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
            setModalEvent(e);
            handleImport(e);
          }}
          label="Import Schema"
          height={44}
          isLoading={parsePgDumpMutation.isLoading}
          isLoadingText="Importing..."
        />
      </Box>
    </BaseModal>
  );
};

export default ImportSchemaModal;
