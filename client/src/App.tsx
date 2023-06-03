import './index.css';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { Route, Routes, useLocation } from 'react-router-dom';

import { useMode } from './theme';
import { useAppSelector } from './redux/hooks';
import Topbar from './components/global/Topbar';
import Sidebar from './components/global/Sidebar';
import Dashboard from './pages/schema';
import MockData from './pages/mock-data';
import Datasources from './pages/datasources';
import EditSchema from './pages/edit-schema';
import BottomBar from './components/global/BottomBar';
import routes from './routes';
import ShareSchema from './pages/share-schema';

function App() {
  const [theme] = useMode();
  const location = useLocation();
  const tabs = useAppSelector((state) => state.appTabs.tabs);

  const shareUrl = location.pathname.includes(`${routes.SHARE_SCHEMA}`);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        {!shareUrl && <Sidebar />}
        <main className="content">
          {!shareUrl && <Topbar items={tabs} />}
          <Routes>
            <Route path={routes.HOME} element={<Dashboard />} />
            <Route path={routes.MOCK_DATA} element={<MockData />} />
            <Route path={routes.DATASOURCES} element={<Datasources />} />
            <Route path={routes.EDIT_SCHEMA + '/:id'} element={<EditSchema />} />
            <Route path={routes.SHARE_SCHEMA + '/:id'} element={<ShareSchema />} />
          </Routes>
        </main>
        <BottomBar />
      </div>
    </ThemeProvider>
  );
}

export default App;
