import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import {
  Box,
  Button as MuiButton,
  FormControl,
  InputLabel,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Button from '../global/Button';
import BootstrapInput from '../global/BootstrapInput';
import GoogleIcon from '../../images/icons/GoogleIcon';
import { PageProps } from '../../pages/auth';
import { auth } from '../../firebase.config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import routes from '../../routes';
import PulseLoader from 'react-spinners/PulseLoader';
import * as yup from 'yup';
import { useAppDispatch } from '../../redux/hooks';
import { triggerSnack } from '../../redux/slice/app';

const validationSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Ooops! You need an email to sign in.'),
  password: yup.string().required('Please enter password to continue.'),
});

const SignIn = ({ flowSwitch, googleAuthHandler }: PageProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setIsLoading(true);
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then((userCredential) => {
          setIsLoading(false);
          navigate(routes.HOME);
          dispatch(triggerSnack({ message: 'Sign in successful', severity: 'success', hideDuration: 3000 }));
        })
        .catch((error) => {
          setIsLoading(false);

          let message = 'Auth Error!';

          switch (error.code) {
            case 'auth/email-already-in-use':
              message = 'This email is already in use.';
              break;
            case 'auth/invalid-email':
              message = 'The email address is badly formatted.';
              break;
            case 'auth/operation-not-allowed':
              message = 'Email/password accounts are not enabled.';
              break;
            case 'auth/weak-password':
              message = 'The password is too weak.';
              break;
            default:
              message = 'An unknown error occurred.';
          }

          dispatch(triggerSnack({ message, severity: 'error', hideDuration: 3000 }));
        });
    },
  });

  return (
    <>
      <Box>
        <Typography variant="h2" fontWeight={600}>
          Log in
        </Typography>
        <Typography variant="subtitle1" my={1}>
          Welcome back! Please enter your details.
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

        <FormControl
          variant="standard"
          sx={{ mt: 2 }}
          fullWidth
          error={formik.touched.password && Boolean(formik.errors.password)}
        >
          <InputLabel shrink htmlFor="password" sx={{ fontSize: 18, fontWeight: 600 }}>
            Password
          </InputLabel>
          <BootstrapInput
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            endAdornment={
              <InputAdornment position="end" sx={{ position: 'absolute', right: '12px' }}>
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setShowPassword((value) => !value);
                  }}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            aria-describedby="password-error"
          />
          <FormHelperText id="password-error">{formik.touched.password && formik.errors.password}</FormHelperText>
        </FormControl>
      </Box>

      {/* Secondary Actions */}
      <Box display={'flex'} justifyContent={'end'} alignItems={'center'} my={2}>
        <MuiButton sx={{ fontSize: 12 }} onClick={flowSwitch.bind(null, 'reset')}>
          Forgot password
        </MuiButton>
      </Box>

      <Box component="div" display="flex" flexDirection="column" gap={1.8}>
        <Button
          type="primary"
          label={'Sign in'}
          onClick={formik.handleSubmit}
          isLoading={isLoading}
          isLoadingText="Logging you in..."
        />
        <Button type="secondary" icon={<GoogleIcon />} label="Sign in with Google" onClick={googleAuthHandler} />
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center" gap={0.5} mt={4}>
        <Typography>Don't have an account yet?</Typography>
        <Link component="button" underline="none" sx={{ fontSize: 16 }} onClick={flowSwitch.bind(null, 'signup')}>
          {' '}
          Sign up
        </Link>
      </Box>
    </>
  );
};

export default SignIn;
