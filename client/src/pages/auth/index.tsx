import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase.config';
import SignIn from '../../components/auth/SignIn';
import SignUp from '../../components/auth/SignUp';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import SchemeupLogo from '../../images/schemup_logo.png';
import { useNavigate } from 'react-router-dom';
import routes from '../../routes';
import ResetPassword from '../../components/auth/ResetPassword';
import { useAppDispatch } from '../../redux/hooks';
import { triggerSnack } from '../../redux/slice/app';

type Pages = 'login' | 'signup' | 'reset';

export interface PageProps {
  flowSwitch: (page: Pages) => void;
  googleAuthHandler?: () => void;
}

const AuthenticateUser = () => {
  const [activePage, setActivePage] = useState<Pages>('login');
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const currentYear = new Date().getFullYear();
  const dispatch = useAppDispatch();

  const flowSwitchHandler = (page: Pages) => {
    switch (page) {
      case 'signup':
        setActivePage('signup');
        break;
      case 'reset':
        setActivePage('reset');
        break;
      default:
        setActivePage('login');
    }
  };

  const googleSignInHandler = async () => {
    await signInWithPopup(auth, provider)
      .then((result) => {
        dispatch(triggerSnack({ message: 'Google Auth Success!', severity: 'success', hideDuration: 3000 }));
        return navigate(routes.HOME);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log({ errorCode, errorMessage, email, credential });

        dispatch(triggerSnack({ message: 'Google Auth Error!', severity: 'error', hideDuration: 3000 }));
      });
  };

  return (
    <Grid container>
      <Grid item xs={12} lg={6}>
        <Box width="80%" maxWidth={600} mx="auto" mt={5} p={7} sx={{}}>
          <Avatar
            variant="rounded"
            alt="schemeup-logo"
            src={SchemeupLogo}
            sx={{ backgroundColor: 'lightgray', padding: 1, marginBottom: 10 }}
          >
            Schemeup Logo
          </Avatar>
          {activePage === 'login' && <SignIn flowSwitch={flowSwitchHandler} googleAuthHandler={googleSignInHandler} />}
          {activePage === 'reset' && <ResetPassword flowSwitch={flowSwitchHandler} />}
          {activePage === 'signup' && <SignUp flowSwitch={flowSwitchHandler} googleAuthHandler={googleSignInHandler} />}
        </Box>
        <Typography sx={{ position: 'absolute', bottom: 15, left: 25 }}>
          <img
            alt="schemeup logo"
            src={SchemeupLogo}
            width={12}
            height={12}
            style={{ marginRight: 6, color: 'gray' }}
          />
          Schemeup {currentYear}
        </Typography>
      </Grid>
      <Grid item xs={0} lg={6}>
        <Box
          display="flex"
          justifyContent="right"
          sx={{
            backgroundColor: '#7F56D9',
            width: '100%',
            height: '100vh',
          }}
        ></Box>
      </Grid>
    </Grid>
  );
};

export default AuthenticateUser;
