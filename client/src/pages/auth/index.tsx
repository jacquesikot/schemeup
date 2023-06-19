import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useMutation } from 'react-query';
import { Avatar, Box, Grid } from '@mui/material';

import { auth } from '../../firebase.config';
import SignIn from '../../components/auth/SignIn';
import SignUp from '../../components/auth/SignUp';
import SchemeupLogo from '../../images/schemeup_logo.png';
import ResetPassword from '../../components/auth/ResetPassword';
import { useAppDispatch } from '../../redux/hooks';
import { triggerSnack } from '../../redux/slice/app';
import { SignUpUserDto, signUp } from '../../api/auth';

type Pages = 'login' | 'signup' | 'reset';

export interface PageProps {
  flowSwitch: (page: Pages) => void;
  googleAuthHandler?: () => void;
}

const AuthenticateUser = () => {
  const [activePage, setActivePage] = useState<Pages>('login');
  const provider = new GoogleAuthProvider();
  const dispatch = useAppDispatch();
  const signUpMutation = useMutation((values: SignUpUserDto) => signUp(values));

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
        signUpMutation.mutate({
          fullName: result.user.displayName as string,
          email: result.user.email as string,
          authId: result.user.uid,
        });
        dispatch(triggerSnack({ message: 'Google Auth Success!', severity: 'success', hideDuration: 3000 }));
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
    <Grid container sx={{ height: '100%', alignItems: 'center' }}>
      <Grid item xs={12} lg={6} pt={2} pb={2}>
        <Box width="80%" maxWidth={400} mx="auto">
          <Avatar variant="square" alt="schemeup-logo" style={{ marginBottom: 20 }} src={SchemeupLogo}>
            Schemeup Logo
          </Avatar>

          {activePage === 'login' && <SignIn flowSwitch={flowSwitchHandler} googleAuthHandler={googleSignInHandler} />}
          {activePage === 'reset' && <ResetPassword flowSwitch={flowSwitchHandler} />}
          {activePage === 'signup' && <SignUp flowSwitch={flowSwitchHandler} googleAuthHandler={googleSignInHandler} />}
        </Box>
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
