import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import routes from '../../routes';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import BottomBar from './BottomBar';
import { auth } from '../../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { setCurrentUser } from '../../redux/slice/user';
import SnackNotification from './SnackNotification';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tabs = useAppSelector((state) => state.appTabs.tabs);
  const showSnack = useAppSelector((state) => state.app.showSnack);
  const dispatch = useAppDispatch();

  const publicUrl = location.pathname.includes(`${routes.SHARE_SCHEMA}`);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log(user);
      const currentUser = {
        id: user.uid,
        name: user.displayName ? user.displayName : 'Anonymous',
        email: user.email ? user.email : '',
      };
      dispatch(setCurrentUser({ ...currentUser }));
    } else {
      // User is signed out
      return navigate(routes.AUTH);
    }
  });

  return (
    <div className="app">
      {!publicUrl && <Sidebar />}
      <main className="content">
        {!publicUrl && <Topbar items={tabs} />}
        {showSnack && <SnackNotification />}
        <Outlet />
      </main>
      <BottomBar />
    </div>
  );
};

export default Layout;
