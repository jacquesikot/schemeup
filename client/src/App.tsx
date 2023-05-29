import './index.css';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router-dom';

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

function App() {
  const [theme] = useMode();
  const tabs = useAppSelector((state) => state.appTabs.tabs);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Sidebar />
        <main className="content">
          <Topbar items={tabs} />
          <Routes>
            <Route path={routes.HOME} element={<Dashboard />} />
            <Route path={routes.MOCK_DATA} element={<MockData />} />
            <Route path={routes.DATASOURCES} element={<Datasources />} />
            <Route path={routes.EDIT_SCHEMA + '/:id'} element={<EditSchema />} />
          </Routes>
        </main>
        <BottomBar />
      </div>
    </ThemeProvider>
  );
}

export default App;
