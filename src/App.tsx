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
import NewSchema from './pages/new-schema';

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
            <Route path="/schema/new/:name" element={<NewSchema />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
