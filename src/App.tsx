import React, { Suspense, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { CSpinner, useColorModes } from '@coreui/react-pro';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@coreui/coreui-pro/dist/css/coreui.min.css';
import './scss/style.scss';

import { State } from '@redux/slices/layout/layoutSlice';
import { initializeLanguage } from '@redux/slices/languageSlice/languageSlice';
import './App.css';
import { TokenStateType } from 'types';

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

const Login = React.lazy(() => import('./pages/auth/loginPage/loginPage.page'));

const App = () => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
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

  // Initialize language state from i18n
  useEffect(() => {
    dispatch(initializeLanguage(i18n.language));
  }, [dispatch, i18n.language]);

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
