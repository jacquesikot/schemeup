import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, FormControl, InputLabel, Typography, Link, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '../global/Button';
import BootstrapInput from '../global/BootstrapInput';
import GoogleIcon from '../../images/icons/GoogleIcon';
import { PageProps } from '../../pages/auth';
import { auth } from '../../firebase.config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import routes from '../../routes';
import PulseLoader from 'react-spinners/PulseLoader';

interface User {
  [prop: string]: string;
}

const SignUp = ({ flowSwitch, googleAuthHandler }: PageProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState<User>({});
  const navigate = useNavigate();

  const createAccountHandler = () => {
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
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
          Register
        </Typography>
        <Typography variant="subtitle1" my={1}>
          Hi! Please complete the form to setup your account.
        </Typography>
      </Box>

      <Box component="form" mt={4}>
        <FormControl variant="standard" fullWidth>
          <InputLabel shrink htmlFor="name" sx={{ fontSize: 18, fontWeight: 600 }}>
            Full name
          </InputLabel>
          <BootstrapInput
            placeholder="Enter your full name"
            id="name"
            onChange={(e) => {
              setNewUser((user) => ({ ...user, name: e.target.value }));
            }}
          />
        </FormControl>

        <FormControl variant="standard" sx={{ my: 2 }} fullWidth>
          <InputLabel shrink htmlFor="email" sx={{ fontSize: 18, fontWeight: 600 }}>
            Email
          </InputLabel>
          <BootstrapInput
            placeholder="Enter your email"
            id="email"
            onChange={(e) => {
              setNewUser((user) => ({ ...user, email: e.target.value }));
            }}
          />
        </FormControl>

        <FormControl variant="standard" fullWidth>
          <InputLabel shrink htmlFor="password" sx={{ fontSize: 18, fontWeight: 600 }}>
            Password
          </InputLabel>
          <BootstrapInput
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            id="password"
            onChange={(e) => {
              setNewUser((user) => ({ ...user, password: e.target.value }));
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

      <Box component="div" display="flex" flexDirection="column" gap={1.8} mt={4}>
        <Button
          type="primary"
          label={isLoading ? '' : 'Sign up'}
          onClick={createAccountHandler}
          icon={isLoading ? <PulseLoader size={10} color="#fff" /> : null}
        />
        <Button type="secondary" icon={<GoogleIcon />} label="Sign in with Google" onClick={googleAuthHandler} />
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center" gap={0.5} mt={4}>
        <Typography>Already have an account?</Typography>
        <Link component="button" underline="none" sx={{ fontSize: 14 }} onClick={flowSwitch.bind(null, 'login')}>
          Log in
        </Link>
      </Box>
    </>
  );
};

export default SignUp;
