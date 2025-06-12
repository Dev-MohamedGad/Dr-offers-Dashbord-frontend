import React, { useEffect, useRef } from 'react';
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  useColorModes,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilContrast, cilMenu, cilMoon, cilSun } from '@coreui/icons';

import { AppHeaderDropdown } from './header/index';
import classNames from 'classnames';
import { set, State } from '@redux/slices/layout/layoutSlice';
import { useDispatch, useSelector } from 'react-redux';

const AppHeader = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { colorMode, setColorMode } = useColorModes(
    'coreui-pro-react-admin-template-theme-modern'
  );
  const sidebarShow = useSelector(
    (state: { layout: State }) => state.layout.sidebarShow
  );

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle(
          'shadow-sm',
          document.documentElement.scrollTop > 0
        );
    });
  }, []);

  return (
    <CHeader position="sticky" className="p-0 mb-4" ref={headerRef}>
      <CContainer className="px-4" fluid>
        <CHeaderToggler
          className="d-lg-none"
          onClick={() => dispatch(set({ sidebarShow: !sidebarShow }))}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <CHeaderNav className="d-none d-md-flex ms-auto"></CHeaderNav>
        <CHeaderNav className="ms-auto ms-md-0">
          <li className="py-1 nav-item">
            <div className="mx-2 text-opacity-75 vr h-100 text-body"></div>
          </li>

          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>

            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="py-1 nav-item">
            <div className="mx-2 text-opacity-75 vr h-100 text-body"></div>
          </li>

          <AppHeaderDropdown />
        </CHeaderNav>
        {/* <CHeaderToggler
          onClick={() => dispatch(set({ asideShow: !asideShow }))}
          style={{ marginInlineEnd: '-12px' }}
        >
          <CIcon icon={cilApplicationsSettings} size="lg" />
        </CHeaderToggler> */}
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;
