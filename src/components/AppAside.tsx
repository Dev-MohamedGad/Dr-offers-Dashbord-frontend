import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CAvatar,
  CCloseButton,
  CFormSwitch,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CListGroup,
  CListGroupItem,
  CSidebar,
  CSidebarHeader,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import {
  cibSkype,
  cilCalendar,
  cilHome,
  cilList,
  cilLocationPin,
  cilSettings,
  cilSpeech,
} from '@coreui/icons'

import avatar1 from '@assets/avatars/1.jpg'
import avatar2 from '@assets/avatars/2.jpg'
import avatar3 from '@assets/avatars/3.jpg'
import avatar4 from '@assets/avatars/4.jpg'
import avatar5 from '@assets/avatars/5.jpg'
import avatar6 from '@assets/avatars/6.jpg'
import avatar7 from '@assets/avatars/7.jpg'
import avatar8 from '@assets/avatars/8.jpg'

import { set, State } from '@redux/slices/layout/layoutSlice'

const AppAside = () => {
  const dispatch = useDispatch()
  const asideShow = useSelector((state : {layout:State})=>state.layout.asideShow)

  const [activeKey, setActiveKey] = useState(1)

  return (
    <CSidebar
      className="border-start"
      colorScheme="light"
      size="lg"
      overlaid
      placement="end"
      visible={asideShow}
      onVisibleChange={(visible) => {
        dispatch(set({ asideShow: visible }))
      }}
    >
      <CSidebarHeader className="p-0 position-relative">
        <CNav className="w-100" variant="underline-border">
          <CNavItem>
            <CNavLink
              href="#"
              active={activeKey === 1}
              onClick={(e) => {
                e.preventDefault()
                setActiveKey(1)
              }}
            >
              <CIcon icon={cilList} />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              href="#"
              active={activeKey === 2}
              onClick={(e) => {
                e.preventDefault()
                setActiveKey(2)
              }}
            >
              <CIcon icon={cilSpeech} />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              href="#"
              active={activeKey === 3}
              onClick={(e) => {
                e.preventDefault()
                setActiveKey(3)
              }}
            >
              <CIcon icon={cilSettings} />
            </CNavLink>
          </CNavItem>
        </CNav>
        <CCloseButton
          className="position-absolute top-50 end-0 translate-middle my-0"
          onClick={() => dispatch(set({ asideShow: false }))}
        />
      </CSidebarHeader>
      <CTabContent>
        <CTabPane visible={activeKey === 1}>
          <CListGroup flush>
            <CListGroupItem className="list-group-item border-start-4 border-start-secondary bg-body-secondary text-center fw-semibold text-body-secondary text-uppercase small">
              Today
            </CListGroupItem>
            <CListGroupItem href="#" className="border-start-4 border-start-warning">
              <CAvatar src={avatar7} size="lg" className="float-end" />
              <div>
                Meeting with <strong>Lucas</strong>
              </div>
              <small className="text-body-secondary me-3">
                <CIcon icon={cilCalendar} /> 1 - 3pm
              </small>
              <small className="text-body-secondary">
                <CIcon icon={cilLocationPin} /> Palo Alto, CA
              </small>
            </CListGroupItem>
            <CListGroupItem href="#" className="border-start-4 border-start-info">
              <CAvatar src={avatar4} size="lg" className="float-end" />
              <div>
                Skype with <strong>Megan</strong>
              </div>
              <small className="text-body-secondary me-3">
                <CIcon icon={cilCalendar} /> 4 - 5pm
              </small>
              <small className="text-body-secondary">
                <CIcon icon={cibSkype} /> On-line
              </small>
            </CListGroupItem>
            <CListGroupItem className="border-start-4 border-start-secondary bg-body-secondary text-center fw-semibold text-body-secondary text-uppercase small">
        Tomorrow
            </CListGroupItem>
            <CListGroupItem href="#" className="border-start-4 border-start-danger">
              <div>
                New UI Project - <strong>deadline</strong>
              </div>
              <small className="text-body-secondary me-3">
                <CIcon icon={cilCalendar} /> 10 - 11pm
              </small>
              <small className="text-body-secondary">
                <CIcon icon={cilHome} /> creativeLabs HQ
              </small>
              <div className="/avatars-stack mt-2">
                <CAvatar src={avatar2} size="sm" />
                <CAvatar src={avatar3} size="sm" />
                <CAvatar src={avatar4} size="sm" />
                <CAvatar src={avatar5} size="sm" />
                <CAvatar src={avatar6} size="sm" />
              </div>
            </CListGroupItem>
            <CListGroupItem href="#" className="border-start-4 border-start-success">
              <div>
                <strong>#10 Startups.Garden</strong> Meetup
              </div>
              <small className="text-body-secondary me-3">
                <CIcon icon={cilCalendar} /> 1 - 3pm
              </small>
              <small className="text-body-secondary">
                <CIcon icon={cilLocationPin} /> Palo Alto, CA
              </small>
            </CListGroupItem>
            <CListGroupItem href="#" className="border-start-4 border-start-primary border-bottom">
              <div>
                <strong>Team meeting</strong>
              </div>
              <small className="text-body-secondary me-3">
                <CIcon icon={cilCalendar} /> 4 - 6pm
              </small>
              <small className="text-body-secondary">
                <CIcon icon={cilHome} /> creativeLabs HQ
              </small>
              <div className="/avatars-stack mt-2">
                <CAvatar src={avatar2} size="sm" />
                <CAvatar src={avatar3} size="sm" />
                <CAvatar src={avatar4} size="sm" />
                <CAvatar src={avatar5} size="sm" />
                <CAvatar src={avatar6} size="sm" />
                <CAvatar src={avatar7} size="sm" />
                <CAvatar src={avatar8} size="sm" />
              </div>
            </CListGroupItem>
          </CListGroup>
        </CTabPane>
        <CTabPane className="p-3" visible={activeKey === 2}>
          <div className="d-flex">
            <CAvatar className="flex-shrink-0 my-3 me-3" size="md" src={avatar1} status="success" />
            <div style={{ minWidth: 0 }}>
              <div className="d-flex justify-content-between text-body-secondary small">
                <div>Jessica Williams</div>
                <div>Just now</div>
              </div>
              <div className="fw-semibold text-truncate">
                <span className="text-danger">!</span> Urgent: System Maintenance Tonight
              </div>
              <div className="small text-body-secondary mt-1">
                Attention team, we&#39;ll be conducting critical system maintenance tonight from 10
                PM to 2 AM. Plan accordingly...
              </div>
            </div>
          </div>
          <hr />
          <div className="d-flex">
            <CAvatar className="flex-shrink-0 my-3 me-3" size="md" src={avatar2} status="success" />
            <div style={{ minWidth: 0 }}>
              <div className="d-flex justify-content-between text-body-secondary small">
                <div>Richard Johnson</div>
                <div>5 minutes ago</div>
              </div>
              <div className="fw-semibold text-truncate">Social Media Campaign Launch</div>
              <div className="small text-body-secondary mt-1">
                Exciting news! Our new social media campaign goes live tomorrow. Brace yourselves
                for engagement...
              </div>
            </div>
          </div>
          <hr />
          <div className="d-flex">
            <CAvatar className="flex-shrink-0 my-3 me-3" size="md" src={avatar4} status="success" />
            <div style={{ minWidth: 0 }}>
              <div className="d-flex justify-content-between text-body-secondary small">
                <div>Angela Rodriguez</div>
                <div>1:52 PM</div>
              </div>
              <div className="fw-semibold text-truncate">
                <span className="text-danger">!</span> Project Update: Milestone Achieved
              </div>
              <div className="small text-body-secondary mt-1">
                Kudos on hitting sales targets last quarter! Let&#39;s keep the momentum. New goals,
                new victories ahead...
              </div>
            </div>
          </div>
          <hr />
          <div className="d-flex">
            <CAvatar className="flex-shrink-0 my-3 me-3" size="md" src={avatar5} status="success" />
            <div style={{ minWidth: 0 }}>
              <div className="d-flex justify-content-between text-body-secondary small">
                <div>Jane Lewis</div>
                <div>4:03 PM</div>
              </div>
              <div className="fw-semibold text-truncate">Inventory Checkpoint</div>
              <div className="small text-body-secondary mt-1">
                Team, it&#39;s time for our monthly inventory check. Accurate counts ensure smooth
                operations. Let&#39;s nail it...
              </div>
            </div>
          </div>
          <hr />
          <div className="d-flex">
            <CAvatar className="flex-shrink-0 my-3 me-3" size="md" src={avatar3} status="success" />
            <div style={{ minWidth: 0 }}>
              <div className="d-flex justify-content-between text-body-secondary small">
                <div>Ryan Miller</div>
                <div>3 days ago</div>
              </div>
              <div className="fw-semibold text-truncate">Customer Feedback Results</div>
              <div className="small text-body-secondary mt-1">
                Our latest customer feedback is in. Let&#39;s analyze and discuss improvements for
                an even better service...
              </div>
            </div>
          </div>
        </CTabPane>
        <CTabPane className="p-3" visible={activeKey === 3}>
          <h6>Settings</h6>
          <div>
            <div className="clearfix mt-4">
              <CFormSwitch size="lg" label="Option 1" id="Option1" defaultChecked />
            </div>
            <div>
              <small className="text-body-secondary">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </small>
            </div>
          </div>
          <div>
            <div className="clearfix mt-3">
              <CFormSwitch size="lg" label="Option 2" id="fOption2" />
            </div>
            <div>
              <small className="text-body-secondary">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </small>
            </div>
          </div>
          <div>
            <div className="clearfix mt-3">
              <CFormSwitch size="lg" label="Option 3" id="Option3" />
            </div>
          </div>
          <div>
            <div className="clearfix mt-3">
              <CFormSwitch size="lg" label="Option 4" id="Option4" defaultChecked />
            </div>
          </div>
        
       
        </CTabPane>
      </CTabContent>
    </CSidebar>
  )
}

export default AppAside
