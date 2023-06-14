import './index.css';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router-dom';

import Dashboard from './pages/schema';
import MockData from './pages/mock-data';
import Datasources from './pages/datasources';
import EditSchema from './pages/edit-schema';
import routes from './routes';
import ShareSchema from './pages/share-schema';
import AuthenticateUser from './pages/auth';
import Layout from './components/global/Layout';
import { createTheme } from './theme';

function App() {
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
