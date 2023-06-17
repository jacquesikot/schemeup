import './index.css';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { Route, Routes, useNavigate } from 'react-router-dom';

import Dashboard from './pages/schema';
import MockData from './pages/mock-data';
import Datasources from './pages/datasources';
import EditSchema from './pages/edit-schema';
import routes from './routes';
import ShareSchema from './pages/share-schema';
import AuthenticateUser from './pages/auth';
import Layout from './components/global/Layout';
import { createTheme } from './theme';
import SnackNotification from './components/global/SnackNotification';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.config';
import { setCurrentUser } from './redux/slice/user';

function App() {
  const theme = createTheme();
  const showSnack = useAppSelector((state) => state.app.showSnack);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const currentUser = {
        id: user.uid,
        name: user.displayName ? user.displayName : 'Anonymous',
        email: user.email ? user.email : '',
        photoUrl: user.photoURL ? user.photoURL : '',
      };
      dispatch(setCurrentUser({ ...currentUser }));
    } else {
      // User is signed out
      return navigate(routes.AUTH);
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showSnack && <SnackNotification />}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path={routes.HOME} element={<Dashboard />} />
          <Route path={routes.MOCK_DATA} element={<MockData />} />
          <Route path={routes.DATASOURCES} element={<Datasources />} />
          <Route path={routes.EDIT_SCHEMA + '/:id'} element={<EditSchema />} />
          <Route path={routes.SHARE_SCHEMA + '/:id'} element={<ShareSchema />} />
        </Route>
        <Route path={routes.AUTH} element={<AuthenticateUser />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
