import './index.css';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router-dom';

import { useMode } from './theme';
import Topbar from './scenes/global/Topbar';
import Sidebar from './scenes/global/Sidebar';
import Dashboard from './scenes/dashboard';
import MockData from './scenes/mockData';
import { useAppSelector } from './redux/hooks';

function App() {
  const [theme] = useMode();
  const tabs = useAppSelector((state) => state.appTabs.tabs);
  console.log(tabs);
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
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
