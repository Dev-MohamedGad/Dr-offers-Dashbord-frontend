import React from 'react';
import ReactDOM from 'react-dom/client';
import './scss/style.scss';

import './index.css';
import 'core-js';
// TODO Remove comment when you complete TODOs in fonts.css
import './fonts.css';
import App from './App';
import { Provider } from 'react-redux';
import store, { Persistor } from './redux';
import { PersistGate } from 'redux-persist/integration/react';
import './i18n'; // Initialize i18n

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={Persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
