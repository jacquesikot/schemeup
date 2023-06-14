import { useState } from 'react';
import { useFormik } from 'formik';
import {
  Box,
  FormControl,
  InputLabel,
  Typography,
  FormHelperText,
} from '@mui/material';
import Button from '../global/Button';
import BootstrapInput from '../global/BootstrapInput';
import { PageProps } from '../../pages/auth';
import { auth } from '../../firebase.config';
import { sendPasswordResetEmail } from 'firebase/auth';
import PulseLoader from 'react-spinners/PulseLoader';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { triggerSnack } from '../../redux/slice/app';
import SnackNotification from '../global/SnackNotification';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email'),
});

const ResetPassword = ({ flowSwitch }: PageProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const showSnack = useAppSelector(state => state.app.showSnack);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setIsLoading(true);
      sendPasswordResetEmail(auth, values.email)
        .then(() => {
          // Password reset email sent!
          dispatch(triggerSnack({ message: "Password reset email sent!", severity: "success", hideDuration: 3500 }));
          setIsLoading(false);
        })
        .catch((error) => {
          dispatch(triggerSnack({ message: error.message, severity: "error", hideDuration: 3500 }));
          setIsLoading(false);
        });
    }
  });

  return (
    <>
      <Box>
        <Typography variant="h2" fontWeight={600}>
          Reset Password
        </Typography>
        <Typography variant="subtitle1" my={1}>
          No worries! Let's help you get back access.
        </Typography>
      </Box>

      <Box component="form" mt={4}>
        <FormControl variant="standard" fullWidth error={formik.touched.email && Boolean(formik.errors.email)}>
          <InputLabel shrink htmlFor="email" sx={{ fontSize: 18, fontWeight: 600 }}>
            Email
          </InputLabel>
          <BootstrapInput
            placeholder="Enter your email"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            aria-describedby="email-error"
          />
          <FormHelperText id="email-error">{formik.touched.email && formik.errors.email}</FormHelperText>
        </FormControl>
      </Box>

      <Box component="div" display="flex" justifyContent="start" gap={1.8} mt={3}>
        <Button type="secondary" label="Return to Log In" onClick={flowSwitch.bind(null, 'login')} />
        <Button
          type="primary"
          label={isLoading ? '' : 'Send email'}
          onClick={formik.handleSubmit}
          icon={isLoading ? <PulseLoader size={10} color="#fff" /> : null}
        />
      </Box>
      {showSnack && <SnackNotification />}
    </>
  );
};

export default ResetPassword;
