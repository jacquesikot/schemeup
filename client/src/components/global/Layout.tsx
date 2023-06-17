import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import routes from '../../routes';
import { useAppSelector } from '../../redux/hooks';
import BottomBar from './BottomBar';

const Layout = () => {
  const location = useLocation();
  const tabs = useAppSelector((state) => state.appTabs.tabs);

  const publicUrl = location.pathname.includes(`${routes.SHARE_SCHEMA}`);

  return (
    <div className="app">
      {!publicUrl && <Sidebar />}
      <main className="content">
        {!publicUrl && <Topbar items={tabs} />}
        <Outlet />
      </main>
      <BottomBar />
    </div>
  );
};

export default Layout;
