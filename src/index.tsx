import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { ProSidebarProvider } from "react-pro-sidebar";
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ProSidebarProvider>
            <App />
          </ProSidebarProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);