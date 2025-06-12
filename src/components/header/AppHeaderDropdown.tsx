import React from 'react';
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react-pro';
import { cilSettings, cilUser, cilAccountLogout } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

import avatar2 from '@assets/avatars/2.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@redux/slices/authSlice/authSlice';
import { useNavigate } from 'react-router-dom';
import { UserState } from '@redux/slices/userSlice/userSlice';

const AppHeaderDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user: any = useSelector(
    (state: { user: UserState }) => state.user.currentUser
  );

  const Logout = () => {
    dispatch(logout());
    navigate('/login');
  };
  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle className="py-0" caret={false}>
        <CAvatar src={avatar2} size="md" status="success" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0">
        <CDropdownHeader className=" text-body-secondary fw-semibold my-2">
          {user?.name}
        </CDropdownHeader>
        <CDropdownHeader className="bg-body-secondary text-body-secondary fw-semibold my-2">
          Settings
        </CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>

        <CDropdownItem onClick={Logout} className="cursor-pointer">
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
