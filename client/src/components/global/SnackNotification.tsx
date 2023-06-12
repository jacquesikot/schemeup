import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setShowSnack, setSnackPack } from '../../redux/slice/app';

export interface SnackbarMessage {
  message: string;
  severity: AlertColor;
  key: number;
}

export interface State {
  open: boolean;
  snackPack: readonly SnackbarMessage[];
  messageInfo?: SnackbarMessage;
}

const SnackNotification = () => {
  const dispatch = useAppDispatch();
  const snackPack = useAppSelector((state) => state.app.snackPack);
  const showSnack = useAppSelector((state) => state.app.showSnack);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(setShowSnack(false));
  };

  const handleExited = () => {
    dispatch(setSnackPack([]));
  };

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <div>
      <Snackbar
        key={snackPack && snackPack.length > 0 ? snackPack[0].key : undefined}
        open={showSnack}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
      >
        <Alert
          onClose={handleClose}
          severity={snackPack && snackPack.length > 0 ? snackPack[0].severity : 'success'}
          sx={{ width: '100%' }}
        >
          {snackPack && snackPack.length > 0 && snackPack[0].message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SnackNotification;
