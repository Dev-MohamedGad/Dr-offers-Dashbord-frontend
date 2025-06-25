import { useUserDetailsQuery } from '@redux/slices/usersSlice/usersApiSlice';
import moment from 'moment';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CAlert,
  CBadge,
  CButton,
  CAvatar,
  CContainer,
  CTooltip,
  CProgress,
  CButtonGroup,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import {
  cilUser,
  cilEnvelopeClosed,
  cilPhone,
  cilBriefcase,
  cilLocationPin,
  cilCalendar,
  cilCheckCircle,
  cilXCircle,
  cilClock,
  cilPencil,
  cilArrowLeft,
  cilTrash,
  cilShare,
  cilOptions,
  cilInfo,
  cilContact,
  cilSettings,
  cilBell,
  cilVolumeHigh,
  cilLanguage
} from '@coreui/icons';
import EmptyState from '@components/EmptyState';
import './userDetails.css';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useUserDetailsQuery(id);
  const user = data?.data;
  const [activeTab, setActiveTab] = React.useState('overview');
  const [imageModalVisible, setImageModalVisible] = React.useState(false);

  if (isLoading) {
    return (
      <CContainer className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinner color="primary" />
      </CContainer>
    );
  }

  if (error) {
    return (
      <CContainer>
        <CAlert color="danger" className="d-flex align-items-center">
          <CIcon icon={cilXCircle} className="me-2" />
          <div>
            <strong>Error loading user details</strong>
            <p className="mb-0">Please try again later or contact support if the problem persists.</p>
          </div>
        </CAlert>
      </CContainer>
    );
  }

  if (!user) {
    return (
      <CContainer>
        <EmptyState
          title="User Not Found"
          description="The user you're looking for doesn't exist or may have been removed."
          actionButton={{
            text: "Back to Users",
            onClick: () => navigate('/users'),
            color: 'primary'
          }}
        />
      </CContainer>
    );
  }

  const getGenderIcon = (gender: string) => {
    return gender?.toLowerCase() === 'male' ? '👨' : gender?.toLowerCase() === 'female' ? '👩' : '🧑';
  };

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const getProfileCompleteness = () => {
    const fields = [
      user.name,
      user.email,
      user.phone_number,
      user.country,
      user.gender,
      user.image_url,
      user.facebook_url,
      user.instagram_url
    ];
    const filledFields = fields.filter(field => field).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const profileCompleteness = getProfileCompleteness();

  return (
    <CContainer fluid className="user-details-container px-4">
      {/* Header Section */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <CButton 
                color="light" 
                onClick={() => navigate('/users')}
                className="mb-2"
              >
                <CIcon icon={cilArrowLeft} className="me-2" />
                Back to Users
              </CButton>
              <h1 className="h3 mb-0 text-primary fw-semibold">User Profile</h1>
            </div>
            <CButton color="primary" variant="outline" size="sm">
              <CIcon icon={cilPencil} className="me-1" />
              Edit
            </CButton>
          </div>
        </CCol>
      </CRow>

      {/* Main User Info Card */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <CCard className="border-0 shadow-sm user-profile-header">
            <CCardBody className="p-4">
              <CRow className="align-items-center">
                <CCol xs="auto">
                  <div className="user-avatar-container">
                    {user.image_url ? (
                      <CTooltip content="Click to view full image">
                        <div className="user-image-wrapper" onClick={() => setImageModalVisible(true)} style={{ cursor: 'pointer' }}>
                          <img 
                            src={user.image_url} 
                            alt={user.name}
                            className="user-avatar-image"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) {
                                fallback.style.display = 'flex';
                              }
                            }}
                          />
                        <CAvatar 
                          size="xl" 
                          color="primary"
                          textColor="white"
                          className="user-avatar-fallback"
                          style={{ 
                            width: '120px', 
                            height: '120px', 
                            fontSize: '2.5rem',
                            display: 'none'
                          }}
                        >
                          {getInitials(user.name)}
                                                  </CAvatar>
                        </div>
                      </CTooltip>
                    ) : (
                      <CAvatar 
                        size="xl" 
                        color="primary"
                        textColor="white"
                        className="user-avatar-main"
                        style={{ width: '120px', height: '120px', fontSize: '2.5rem' }}
                      >
                        {getInitials(user.name)}
                      </CAvatar>
                    )}
                    <div className="user-avatar-badge">
                      <CBadge 
                        color={user.is_active ? 'success' : 'danger'} 
                        className="status-indicator"
                      >
                        {user.is_active ? '●' : '●'}
                      </CBadge>
                    </div>
                  </div>
                </CCol>
                <CCol>
                  <h2 className="mb-1 d-flex align-items-center">
                    {user.name} 
                    <span className="ms-2" style={{ fontSize: '1.5rem' }}>{getGenderIcon(user.gender)}</span>
                  </h2>
                  <p className="text-medium-emphasis mb-3">
                    <CBadge color="primary-gradient" className="me-2">{user.role || 'visitor'}</CBadge>
                    <span className="text-muted">ID: #{user.id}</span>
                  </p>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <CBadge 
                      color={user.is_active ? 'success-gradient' : 'danger-gradient'} 
                      shape="rounded-pill"
                      className="px-3 py-2"
                    >
                      <CIcon icon={user.is_active ? cilCheckCircle : cilXCircle} className="me-1" />
                      {user.is_active ? 'Active' : 'Inactive'}
                    </CBadge>
                    {user.is_phone_verified && (
                      <CBadge color="success-gradient" shape="rounded-pill" className="px-3 py-2">
                        <CIcon icon={cilPhone} className="me-1" />
                        Phone Verified
                      </CBadge>
                    )}
                    {user.is_email_verified && (
                      <CBadge color="info-gradient" shape="rounded-pill" className="px-3 py-2">
                        <CIcon icon={cilEnvelopeClosed} className="me-1" />
                        Email Verified
                      </CBadge>
                    )}
                  </div>
                  <div className="profile-progress">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="text-medium-emphasis">Profile Completeness</small>
                      <small className="text-medium-emphasis fw-semibold">{profileCompleteness}%</small>
                    </div>
                    <CProgress 
                      value={profileCompleteness} 
                      color={profileCompleteness > 75 ? 'success' : profileCompleteness > 50 ? 'warning' : 'danger'}
                      height={8}
                      className="mb-2"
                    />
                  </div>
                  {/* Social Media Icons */}
                  <div className="social-icons-inline mt-3">
                    {user.facebook_url && (
                      <CTooltip content="Facebook Profile">
                        <CButton 
                          color="primary" 
                          variant="ghost"
                          size="sm"
                          href={user.facebook_url} 
                          target="_blank"
                          className="p-2 me-2"
                        >
                          <i className="fab fa-facebook-f"></i>
                        </CButton>
                      </CTooltip>
                    )}
                    {user.instagram_url && (
                      <CTooltip content="Instagram Profile">
                        <CButton 
                          color="danger" 
                          variant="ghost"
                          size="sm"
                          href={user.instagram_url} 
                          target="_blank"
                          className="p-2 me-2"
                        >
                          <i className="fab fa-instagram"></i>
                        </CButton>
                      </CTooltip>
                    )}
                    {user.linkedin_url && (
                      <CTooltip content="LinkedIn Profile">
                        <CButton 
                          color="info" 
                          variant="ghost"
                          size="sm"
                          href={user.linkedin_url} 
                          target="_blank"
                          className="p-2 me-2"
                        >
                          <i className="fab fa-linkedin-in"></i>
                        </CButton>
                      </CTooltip>
                    )}
                    {user.whatsapp_number && (
                      <CTooltip content="WhatsApp Chat">
                        <CButton 
                          color="success" 
                          variant="ghost"
                          size="sm"
                          href={`https://wa.me/${user.whatsapp_number}`} 
                          target="_blank"
                          className="p-2"
                        >
                          <i className="fab fa-whatsapp"></i>
                        </CButton>
                      </CTooltip>
                    )}
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Tabbed Content */}
      <CRow>
        <CCol xs={12}>
          <CCard className="border-0 shadow-sm">
            <CCardHeader className="bg-transparent border-0 pt-4 pb-0">
              <CNav variant="underline-border" className="card-header-tabs">
                <CNavItem>
                  <CNavLink 
                    active={activeTab === 'overview'}
                    onClick={() => setActiveTab('overview')}
                    style={{ cursor: 'pointer' }}
                  >
                    <CIcon icon={cilInfo} className="me-2" />
                    Overview
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink 
                    active={activeTab === 'contact'}
                    onClick={() => setActiveTab('contact')}
                    style={{ cursor: 'pointer' }}
                  >
                    <CIcon icon={cilContact} className="me-2" />
                    Contact Info
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink 
                    active={activeTab === 'preferences'}
                    onClick={() => setActiveTab('preferences')}
                    style={{ cursor: 'pointer' }}
                  >
                    <CIcon icon={cilSettings} className="me-2" />
                    Preferences
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink 
                    active={activeTab === 'system'}
                    onClick={() => setActiveTab('system')}
                    style={{ cursor: 'pointer' }}
                  >
                    <CIcon icon={cilClock} className="me-2" />
                    System Info
                  </CNavLink>
                </CNavItem>
              </CNav>
            </CCardHeader>
            <CCardBody className="pt-4">
              <CTabContent>
                {/* Overview Tab */}
                <CTabPane visible={activeTab === 'overview'}>
                  <CRow>
                    <CCol md={6} className="mb-4">
                      <h5 className="text-primary mb-3">Personal Information</h5>
                      <CTable responsive borderless className="mb-0">
                        <CTableBody>
                          <CTableRow>
                            <CTableDataCell className="text-medium-emphasis py-2">
                              <CIcon icon={cilUser} className="me-2" />
                              Full Name
                            </CTableDataCell>
                            <CTableDataCell className="fw-semibold py-2">{user.name}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell className="text-medium-emphasis py-2">
                              <CIcon icon={cilUser} className="me-2" />
                              Gender
                            </CTableDataCell>
                            <CTableDataCell className="fw-semibold py-2">{user.gender || 'Not specified'}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell className="text-medium-emphasis py-2">
                              <CIcon icon={cilLocationPin} className="me-2" />
                              Country
                            </CTableDataCell>
                            <CTableDataCell className="fw-semibold py-2">{user.country || 'Not specified'}</CTableDataCell>
                          </CTableRow>
                          {user.brand_name && (
                            <CTableRow>
                              <CTableDataCell className="text-medium-emphasis py-2">
                                <CIcon icon={cilBriefcase} className="me-2" />
                                Brand
                              </CTableDataCell>
                              <CTableDataCell className="fw-semibold py-2">{user.brand_name}</CTableDataCell>
                            </CTableRow>
                          )}
                        </CTableBody>
                      </CTable>
                    </CCol>
                    <CCol md={6} className="mb-4">
                      <h5 className="text-primary mb-3">Account Status</h5>
                      <div className="d-flex flex-column gap-3">
                        <div className="status-card p-3 rounded" style={{ backgroundColor: 'var(--cui-gray-100)' }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <small className="text-medium-emphasis">Account Status</small>
                              <p className="mb-0 fw-semibold">{user.is_active ? 'Active' : 'Inactive'}</p>
                            </div>
                            <CIcon 
                              icon={user.is_active ? cilCheckCircle : cilXCircle} 
                              size="xl" 
                              className={user.is_active ? 'text-success' : 'text-danger'}
                            />
                          </div>
                        </div>
                        <div className="status-card p-3 rounded" style={{ backgroundColor: 'var(--cui-gray-100)' }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <small className="text-medium-emphasis">Email Verification</small>
                              <p className="mb-0 fw-semibold">{user.is_email_verified ? 'Verified' : 'Not Verified'}</p>
                            </div>
                            <CIcon 
                              icon={user.is_email_verified ? cilCheckCircle : cilXCircle} 
                              size="xl" 
                              className={user.is_email_verified ? 'text-info' : 'text-warning'}
                            />
                          </div>
                        </div>
                        <div className="status-card p-3 rounded" style={{ backgroundColor: 'var(--cui-gray-100)' }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <small className="text-medium-emphasis">Phone Verification</small>
                              <p className="mb-0 fw-semibold">{user.is_phone_verified ? 'Verified' : 'Not Verified'}</p>
                            </div>
                            <CIcon 
                              icon={user.is_phone_verified ? cilCheckCircle : cilXCircle} 
                              size="xl" 
                              className={user.is_phone_verified ? 'text-success' : 'text-warning'}
                            />
                          </div>
                        </div>
                      </div>
                    </CCol>
                  </CRow>
                </CTabPane>

                {/* Contact Tab */}
                <CTabPane visible={activeTab === 'contact'}>
                  <CRow>
                    <CCol md={8}>
                      <CTable responsive borderless>
                        <CTableBody>
                          <CTableRow>
                            <CTableDataCell className="text-medium-emphasis py-3" width="30%">
                              <CIcon icon={cilEnvelopeClosed} className="me-2" />
                              Email
                            </CTableDataCell>
                            <CTableDataCell className="fw-semibold py-3">
                              <a href={`mailto:${user.email}`} className="text-decoration-none">
                                {user.email}
                              </a>
                              {user.is_email_verified && (
                                <CBadge color="success" className="ms-2">Verified</CBadge>
                              )}
                            </CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell className="text-medium-emphasis py-3">
                              <CIcon icon={cilPhone} className="me-2" />
                              Phone Number
                            </CTableDataCell>
                            <CTableDataCell className="fw-semibold py-3">
                              {user.phone_number ? (
                                <>
                                  <a href={`tel:${user.phone_number}`} className="text-decoration-none">
                                    {user.phone_number}
                                  </a>
                                  {user.is_phone_verified && (
                                    <CBadge color="success" className="ms-2">Verified</CBadge>
                                  )}
                                </>
                              ) : (
                                <span className="text-muted">Not provided</span>
                              )}
                            </CTableDataCell>
                          </CTableRow>
                          {user.address && (
                            <CTableRow>
                              <CTableDataCell className="text-medium-emphasis py-3">
                                <CIcon icon={cilLocationPin} className="me-2" />
                                Address
                              </CTableDataCell>
                              <CTableDataCell className="fw-semibold py-3">{user.address}</CTableDataCell>
                            </CTableRow>
                          )}
                        </CTableBody>
                      </CTable>
                    </CCol>
                  </CRow>
                </CTabPane>

                {/* Preferences Tab */}
                <CTabPane visible={activeTab === 'preferences'}>
                  <CRow>
                    <CCol md={8}>
                      {user.preferences ? (
                        <div>
                          <h5 className="text-primary mb-3">User Preferences</h5>
                          <CTable responsive borderless>
                            <CTableBody>
                              <CTableRow>
                                <CTableDataCell className="text-medium-emphasis py-3" width="30%">
                                  <CIcon icon={cilVolumeHigh} className="me-2" />
                                  Sound Effects
                                </CTableDataCell>
                                <CTableDataCell className="fw-semibold py-3">
                                  <CBadge color={user.preferences.soundEffects ? 'success' : 'secondary'}>
                                    {user.preferences.soundEffects ? 'Enabled' : 'Disabled'}
                                  </CBadge>
                                </CTableDataCell>
                              </CTableRow>
                              <CTableRow>
                                <CTableDataCell className="text-medium-emphasis py-3">
                                  <CIcon icon={cilBell} className="me-2" />
                                  Notifications
                                </CTableDataCell>
                                <CTableDataCell className="fw-semibold py-3">
                                  <CBadge color={user.preferences.notifications ? 'success' : 'secondary'}>
                                    {user.preferences.notifications ? 'Enabled' : 'Disabled'}
                                  </CBadge>
                                </CTableDataCell>
                              </CTableRow>
                              <CTableRow>
                                <CTableDataCell className="text-medium-emphasis py-3">
                                  <CIcon icon={cilLanguage} className="me-2" />
                                  Language
                                </CTableDataCell>
                                <CTableDataCell className="fw-semibold py-3">
                                  <CBadge color="info">{user.preferences.language?.toUpperCase() || 'EN'}</CBadge>
                                </CTableDataCell>
                              </CTableRow>
                            </CTableBody>
                          </CTable>
                        </div>
                      ) : (
                        <CAlert color="info" className="d-flex align-items-center">
                          <CIcon icon={cilInfo} className="me-2" />
                          No preferences data available
                        </CAlert>
                      )}
                    </CCol>
                  </CRow>
                </CTabPane>

                {/* System Info Tab */}
                <CTabPane visible={activeTab === 'system'}>
                  <CRow>
                    <CCol md={8}>
                      <CTable responsive borderless>
                        <CTableBody>
                          <CTableRow>
                            <CTableDataCell className="text-medium-emphasis py-3" width="30%">
                              <CIcon icon={cilUser} className="me-2" />
                              User ID
                            </CTableDataCell>
                            <CTableDataCell className="fw-semibold py-3">#{user.id}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell className="text-medium-emphasis py-3">
                              <CIcon icon={cilUser} className="me-2" />
                              Role
                            </CTableDataCell>
                            <CTableDataCell className="fw-semibold py-3">
                              <CBadge color="primary">{user.role || 'visitor'}</CBadge>
                            </CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell className="text-medium-emphasis py-3">
                              <CIcon icon={cilClock} className="me-2" />
                              Created At
                            </CTableDataCell>
                            <CTableDataCell className="fw-semibold py-3">
                              {moment(user.created_at).format('MMMM Do YYYY, h:mm:ss a')}
                            </CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell className="text-medium-emphasis py-3">
                              <CIcon icon={cilClock} className="me-2" />
                              Last Updated
                            </CTableDataCell>
                            <CTableDataCell className="fw-semibold py-3">
                              {moment(user.updated_at).format('MMMM Do YYYY, h:mm:ss a')}
                            </CTableDataCell>
                          </CTableRow>
                        </CTableBody>
                      </CTable>
                    </CCol>
                  </CRow>
                </CTabPane>
              </CTabContent>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Image Modal */}
      <CModal visible={imageModalVisible} onClose={() => setImageModalVisible(false)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Profile Picture - {user.name}</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center p-4">
          {user.image_url && (
            <img 
              src={user.image_url} 
              alt={user.name}
              className="img-fluid rounded"
              style={{ maxHeight: '70vh', objectFit: 'contain' }}
            />
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setImageModalVisible(false)}>
            Close
          </CButton>
          {user.image_url && (
            <CButton 
              color="primary" 
              href={user.image_url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              View Full Size
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default UserDetails;
