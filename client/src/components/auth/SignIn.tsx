import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button as MuiButton,
  FormControl,
  FormControlLabel,
  InputLabel,
  Typography,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '../global/Button';
import BootstrapInput from '../global/BootstrapInput';
import CheckboxIcon from '../../images/icons/modals/CheckboxIcon';
import GoogleIcon from '../../images/icons/GoogleIcon';
import { PageProps } from '../../pages/auth';
import { auth } from '../../firebase.config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import routes from '../../routes';
import PulseLoader from 'react-spinners/PulseLoader';

interface UserInfo {
  email: string;
  password: string;
}

const SignIn = ({ flowSwitch, googleAuthHandler }: PageProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [staySigned, setStaySigned] = useState<boolean>(false);
  const [enteredDetails, setEnteredDetails] = useState<UserInfo>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const signInHandler = () => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, enteredDetails.email, enteredDetails.password)
      .then((userCredential) => {
        navigate(routes.HOME);
      })
      .catch((error) => {
        setIsLoading(false);
      });
    setIsLoading(false);
  };

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
        <FormControl variant="standard" fullWidth>
          <InputLabel shrink htmlFor="email" sx={{ fontSize: 18, fontWeight: 600 }}>
            Email
          </InputLabel>
          <BootstrapInput
            placeholder="Enter your email"
            id="email"
            onChange={(e) => {
              setEnteredDetails((user) => ({ ...user, email: e.target.value }));
            }}
          />
        </FormControl>

        <FormControl variant="standard" sx={{ mt: 2 }} fullWidth>
          <InputLabel shrink htmlFor="password" sx={{ fontSize: 18, fontWeight: 600 }}>
            Password
          </InputLabel>
          <BootstrapInput
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            id="password"
            onChange={(e) => {
              setEnteredDetails((user) => ({ ...user, password: e.target.value }));
            }}
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
          />
        </FormControl>
      </Box>

      {/* Secondary Actions */}
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} my={2}>
        <FormControl sx={{ px: 1 }}>
          <FormControlLabel
            checked={staySigned}
            onChange={() => {
              setStaySigned((value) => !value);
            }}
            label={'Remember for 30 days'}
            control={<CheckboxIcon />}
            sx={{
              fontWeight: 600,
            }}
          />
        </FormControl>

        <MuiButton>Forgot password</MuiButton>
      </Box>

      <Box component="div" display="flex" flexDirection="column" gap={1.8}>
        <Button
          type="primary"
          label={isLoading ? '' : 'Sign in'}
          onClick={signInHandler}
          icon={isLoading ? <PulseLoader size={10} color="#fff" /> : null}
        />
        <Button type="secondary" icon={<GoogleIcon />} label="Sign in with Google" onClick={googleAuthHandler} />
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center" gap={0.5} mt={4}>
        <Typography>Don't have an account yet?</Typography>
        <Link component="button" underline="none" sx={{ fontSize: 14 }} onClick={flowSwitch.bind(null, 'signup')}>
          {' '}
          Sign up
        </Link>
      </Box>
    </>
  );
};

export default SignIn;
