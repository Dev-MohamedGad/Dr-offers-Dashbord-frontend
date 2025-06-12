import React from 'react'
import {
  CBadge,
  CDropdown,
 
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,

} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import {
  cilBasket,
  cilBell,
  cilChartPie,
  
  cilUserFollow,
  cilUserUnfollow,
} from '@coreui/icons'

const AppHeaderDropdownNotif = () => {
  const itemsCount = 5
  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle caret={false}>
        <span className="d-inline-block my-1 mx-2 position-relative">
          <CIcon icon={cilBell} size="lg" />
          <CBadge color="danger" position="top-end" shape="rounded-circle" className="p-1">
            <span className="visually-hidden">{itemsCount} new alerts</span>
          </CBadge>
        </span>
      </CDropdownToggle>
      <CDropdownMenu className="py-0">
       
        <CDropdownItem>
          <CIcon icon={cilUserFollow} className="me-2 text-success" /> New user registered
        </CDropdownItem>
        <CDropdownItem>
          <CIcon icon={cilUserUnfollow} className="me-2 text-danger" /> User deleted
        </CDropdownItem>
        <CDropdownItem>
          <CIcon icon={cilChartPie} className="me-2 text-info" /> Sales report is ready
        </CDropdownItem>
        <CDropdownItem>
          <CIcon icon={cilBasket} className="me-2 text-primary" /> New client
        </CDropdownItem>
        
       
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdownNotif
