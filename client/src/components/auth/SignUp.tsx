import { useState } from 'react';
import { useFormik } from 'formik';
import {
  Box,
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
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import PulseLoader from 'react-spinners/PulseLoader';
import * as yup from 'yup';
import { useAppDispatch } from '../../redux/hooks';
import { triggerSnack } from '../../redux/slice/app';

const validationSchema = yup.object({
  name: yup.string().required('Mandatory. Cannot be empty!'),
  email: yup.string().email('Enter a valid email').required('Mandatory. Cannot be empty!'),
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Mandatory. Cannot be empty!'),
});

const SignUp = ({ flowSwitch, googleAuthHandler }: PageProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setIsLoading(true);
      createUserWithEmailAndPassword(auth, values.email, values.password)
        .then(async (userCredential) => {
          // Set the user's display name
          console.log(values.name);
          await updateProfile(auth.currentUser as any, {
            displayName: values.name,
          });
          dispatch(triggerSnack({ message: 'Sign up successful!', severity: 'success', hideDuration: 3000 }));
        })

        .catch((error) => {
          console.log(error);
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
          Register
        </Typography>
        <Typography variant="subtitle1" my={1}>
          Hi! Please complete the form to setup your account.
        </Typography>
      </Box>

      <Box mt={4}>
        <FormControl variant="standard" fullWidth error={formik.touched.name && Boolean(formik.errors.name)}>
          <InputLabel shrink htmlFor="name" sx={{ fontSize: 18, fontWeight: 600 }}>
            Full name
          </InputLabel>
          <BootstrapInput
            placeholder="Enter your full name"
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            aria-describedby="name-error"
          />
          <FormHelperText id="name-error">{formik.touched.name && formik.errors.name}</FormHelperText>
        </FormControl>

        <FormControl
          variant="standard"
          sx={{ my: 2 }}
          fullWidth
          error={formik.touched.email && Boolean(formik.errors.email)}
        >
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

        <FormControl variant="standard" fullWidth error={formik.touched.password && Boolean(formik.errors.password)}>
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

      <Box component="div" display="flex" flexDirection="column" gap={1.8} mt={4}>
        <Button
          type="primary"
          label={isLoading ? '' : 'Sign up'}
          onClick={formik.handleSubmit}
          icon={isLoading ? <PulseLoader size={10} color="#fff" /> : null}
        />
        <Button type="secondary" icon={<GoogleIcon />} label="Sign in with Google" onClick={googleAuthHandler} />
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center" gap={0.5} mt={4}>
        <Typography>Already have an account?</Typography>
        <Link component="button" underline="none" sx={{ fontSize: 16 }} onClick={flowSwitch.bind(null, 'login')}>
          Log in
        </Link>
      </Box>
    </>
  );
};

export default SignUp;
