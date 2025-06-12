import React, { Suspense, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';

import { CSpinner, useColorModes } from '@coreui/react-pro';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@coreui/coreui-pro/dist/css/coreui.min.css';
import './scss/style.scss';

import { State } from '@redux/slices/layout/layoutSlice';
import './App.css';
import { TokenStateType } from 'types';

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

const Login = React.lazy(() => import('./pages/auth/loginPage/loginPage.page'));

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes(
    'coreui-pro-react-admin-template-theme-modern'
  );
  const storedTheme = useSelector(
    (state: { layout: State }) => state.layout.theme
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
    let theme = urlParams.get('theme');

    if (theme !== null && theme.match(/^[A-Za-z0-9\s]+/)) {
      theme = theme.match(/^[A-Za-z0-9\s]+/)![0];
    }

    if (theme) {
      setColorMode(theme);
    }

    if (isColorModeSet()) {
      return;
    }

    setColorMode(storedTheme);
  }, []);
  const token = useSelector((state: TokenStateType) => state.auth.accessToken);
  return (
    <Router>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        {!token ? (
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="/" element={<Navigate to="login" />} />
            <Route path="*" element={<Navigate to="login" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="*" element={<DefaultLayout />} />
          </Routes>
        )}
      </Suspense>
    </Router>
  );
};

export default App;
