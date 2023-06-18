import { useLocation, Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

import Sidebar from './Sidebar';
import Topbar from './Topbar';
import routes from '../../routes';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import BottomBar from './BottomBar';
import { useEffect } from 'react';
import { auth } from '../../firebase.config';
import { setCurrentUser } from '../../redux/slice/user';
import Dashboard from '../../pages/schema';
import MockData from '../../pages/mock-data';
import Datasources from '../../pages/datasources';
import EditSchema from '../../pages/edit-schema';
import ShareSchema from '../../pages/share-schema';
import AuthenticateUser from '../../pages/auth';
import SnackNotification from './SnackNotification';

const Layout = () => {
  const location = useLocation();
  const tabs = useAppSelector((state) => state.appTabs.tabs);
  const dispatch = useAppDispatch();
  const showSnack = useAppSelector((state) => state.app.showSnack);

  const publicUrl = location.pathname.includes(`${routes.SHARE_SCHEMA}`);

  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      const currentUser = {
        id: user.uid,
        name: user.displayName ? user.displayName : 'Anonymous',
        email: user.email ? user.email : '',
      };
      dispatch(setCurrentUser({ ...currentUser }));
    }
  }, [user, dispatch]);

  if (loading) {
    return null;
  }

  return (
    <>
      {showSnack && <SnackNotification />}

      {user ? (
        <div className="app">
          {!publicUrl && <Sidebar />}
          <BottomBar />
          <main className="content">
            {!publicUrl && <Topbar items={tabs} />}
            <Routes>
              <Route path={routes.HOME} element={<Dashboard />} />
              <Route path={routes.MOCK_DATA} element={<MockData />} />
              <Route path={routes.DATASOURCES} element={<Datasources />} />
              <Route path={routes.EDIT_SCHEMA + '/:id'} element={<EditSchema />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="*" element={<AuthenticateUser />} />
          <Route path={routes.SHARE_SCHEMA + '/:id'} element={<ShareSchema />} />
        </Routes>
      )}
    </>
  );
};

export default Layout;
