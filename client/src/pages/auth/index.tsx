import { useState } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase.config';
import SignIn from '../../components/auth/SignIn';
import SignUp from '../../components/auth/SignUp';
import { Box, Grid, Typography } from '@mui/material';
import SchemeupLogo from '../../images/schemup_logo.png';
import { useNavigate } from 'react-router-dom';
import routes from '../../routes';
import { setCurrentUser } from '../../redux/slice/user';
import { useAppDispatch } from '../../redux/hooks';

type Pages = 'login' | 'signup' | 'reset';

export interface PageProps {
  flowSwitch: (page: Pages) => void;
  googleAuthHandler: () => void;
}

const AuthenticateUser = () => {
  const [activePage, setActivePage] = useState<Pages>('login');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const currentYear = new Date().getFullYear();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log(user);
      const currentUser = {
        id: user.uid,
        name: user.displayName ? user.displayName : 'Anonymous',
        email: user.email ? user.email : '',
      };
      dispatch(setCurrentUser({ ...currentUser }));
      return navigate(routes.HOME);
    }
  });

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
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(token, user);
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
      });
  };

  return (
    <Grid container>
      <Grid item xs={6}>
        <Box width="60%" mx="auto" mt={5} p={7} sx={{}}>
          {activePage === 'login' && <SignIn flowSwitch={flowSwitchHandler} googleAuthHandler={googleSignInHandler} />}
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
      <Grid item xs={6}>
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
