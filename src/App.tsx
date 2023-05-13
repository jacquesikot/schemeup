import './index.css';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router-dom';

import { useMode } from './theme';
import Topbar from './components/global/Topbar';
import Sidebar from './components/global/Sidebar';
import Dashboard from './pages/schema';
import MockData from './pages/mock-data';
import { useAppSelector } from './redux/hooks';
import Datasources from './pages/datasources';

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
            <Route path="/" element={<Dashboard />} />
            <Route path="/mock-data" element={<MockData />} />
            <Route path="/datasources" element={<Datasources />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
