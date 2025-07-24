import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CRow,
  CCol,
  CBadge,
  CCardHeader,
  CProgress,
  CAlert,
  CSpinner,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTooltip,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { 
  cilArrowLeft, 
  cilPencil, 
  cilTrash, 
  cilDescription, 

  cilCalendar,
  cilCloudDownload,
  cilSpeedometer,
  cilBriefcase,
  cilCheckCircle,
  cilXCircle,
  cilClock,
  cilSettings,
  cilTag,
  cilDollar,
  cilImage,
  cilStar,
  cilInfo,
  cilShare,
  cilOptions,
  cilCopy,
  cilExternalLink,
} from '@coreui/icons';
import { useGetOfferByIdQuery } from '../../redux/slices/offersSlice/offersApiSlice';
import EmptyState from '@components/EmptyState';

import './offerDetails.css';

const OfferDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [imageModalVisible, setImageModalVisible] = useState(false);

  // Fetch offer details from API
  const { 
    data: offerResponse, 
    isLoading, 
    isError, 
    refetch 
  } = useGetOfferByIdQuery(Number(id));

  const offerData = offerResponse?.data;

  if (isLoading) {
    return (
      <CContainer className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinner color="primary" />
      </CContainer>
    );
  }

  if (isError) {
    return (
      <CContainer>
        <CAlert color="danger" className="d-flex align-items-center">
          <CIcon icon={cilXCircle} className="me-2" />
          <div>
            <strong>Error loading offer details</strong>
            <p className="mb-0">Please try again later or contact support if the problem persists.</p>
          </div>
        </CAlert>
      </CContainer>
    );
  }

  if (!offerData) {
    return (
      <CContainer>
        <EmptyState
          title="Offer Not Found"
          description="The offer you're looking for doesn't exist or may have been removed."
          actionButton={{
            text: "Back to Offers",
            onClick: () => navigate('/offers'),
            color: 'primary'
          }}
        />
      </CContainer>
    );
  }

  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    switch (status.toLowerCase()) {
      case 'active':
        return { 
          badge: <CBadge color="success-gradient" shape="rounded-pill" className="px-3 py-2">
            <CIcon icon={cilCheckCircle} size="sm" className="me-1" />
            {normalizedStatus}
          </CBadge>,
          color: '#28a745'
        };
      case 'pending':
        return { 
          badge: <CBadge color="warning-gradient" shape="rounded-pill" className="px-3 py-2">
            <CIcon icon={cilClock} size="sm" className="me-1" />
            {normalizedStatus}
          </CBadge>,
          color: '#ffc107'
        };
      case 'expired':
        return { 
          badge: <CBadge color="danger-gradient" shape="rounded-pill" className="px-3 py-2">
            <CIcon icon={cilXCircle} size="sm" className="me-1" />
            {normalizedStatus}
          </CBadge>,
          color: '#dc3545'
        };
      case 'inactive':
        return { 
          badge: <CBadge color="secondary" shape="rounded-pill" className="px-3 py-2">
            <CIcon icon={cilClock} size="sm" className="me-1" />
            {normalizedStatus}
          </CBadge>,
          color: '#6c757d'
        };
      default:
        return { 
          badge: <CBadge color="secondary" shape="rounded-pill" className="px-3 py-2">
            {normalizedStatus}
          </CBadge>,
          color: '#6c757d'
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'groceries':
        return cilBriefcase;
      case 'premium_fruits':
        return cilStar;
      case 'home_kitchen':
        return cilSettings;
      case 'fashion':
        return cilTag;
      case 'electronics':
        return cilSpeedometer;
      case 'beauty':
        return cilStar;
      case 'home_improvement':
        return cilSettings;
      case 'sports_toys_luggage':
        return cilBriefcase;
      default:
        return cilDescription;
    }
  };

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numAmount);
  };

  const calculateDiscount = (priceBefore: number, discountRate: number) => {
    const price = priceBefore;
    const discount = discountRate;
    return price - (price * discount / 100);
  };

  const getOfferCompleteness = () => {
    const fields = [
      offerData.title,
      offerData.image,
      offerData.category_type,
      offerData.price_before,
      offerData.discount_rate,
      offerData.brand_name,
      offerData.coupon
    ];
    const filledFields = fields.filter(field => field).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const statusConfig = getStatusConfig(offerData.status);
  const priceAfter = offerData.price_after || calculateDiscount(offerData.price_before, offerData.discount_rate);
  const savingsAmount = offerData.price_before - priceAfter;
  const categoryIcon = getCategoryIcon(offerData.category_type);
  const offerCompleteness = getOfferCompleteness();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
  };

  return (
    <CContainer fluid className="offer-details-container px-4">
      {/* Header Section */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <CButton 
                color="light" 
                onClick={() => navigate('/offers')}
                className="mb-2"
              >
                <CIcon icon={cilArrowLeft} className="me-2" />
                Back to Offers
              </CButton>
              <h1 className="h3 mb-0 text-primary fw-semibold">Offer Details</h1>
            </div>
            <div className="d-flex gap-2">
              <CButton 
                color="primary" 
                onClick={() => navigate(`/offers/edit/${offerData.id}`)}
              >
                <CIcon icon={cilPencil} className="me-2" />
                Edit Offer
              </CButton>
              <CDropdown variant="btn-group">
                <CDropdownToggle color="secondary" variant="outline">
                  <CIcon icon={cilOptions} />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem onClick={() => refetch()}>
                    <CIcon icon={cilSpeedometer} className="me-2" />
                    Refresh Data
                  </CDropdownItem>
                  {offerData.image && (
                    <CDropdownItem onClick={() => window.open(offerData.image, '_blank')}>
                      <CIcon icon={cilExternalLink} className="me-2" />
                      View Image
                    </CDropdownItem>
                  )}
                  <CDropdownDivider />
                  <CDropdownItem className="text-danger">
                    <CIcon icon={cilTrash} className="me-2" />
                    Delete Offer
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
          </div>
        </CCol>
      </CRow>

      {/* Main Offer Info Card */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <CCard className="border-0 shadow-sm offer-profile-header">
            <CCardBody className="p-4">
              <CRow className="align-items-center">
                <CCol xs="auto">
                  <div className="offer-image-container">
                    {offerData.image ? (
                      <CTooltip content="Click to view full image">
                        <div className="offer-image-wrapper" onClick={() => setImageModalVisible(true)} style={{ cursor: 'pointer' }}>
                          <img 
                            src={offerData.image} 
                            alt={offerData.title}
                            className="offer-image-main"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) {
                                fallback.style.display = 'flex';
                              }
                            }}
                          />
                          <div 
                            className="offer-image-fallback"
                            style={{ 
                              width: '120px', 
                              height: '120px', 
                              fontSize: '2.5rem',
                              display: 'none'
                            }}
                          >
                            <CIcon icon={cilImage} size="xxl" />
                          </div>
                        </div>
                      </CTooltip>
                    ) : (
                      <div className="offer-image-main offer-image-fallback">
                        <CIcon icon={cilImage} size="xxl" />
                      </div>
                    )}
                    <div className="offer-status-badge">
                      {statusConfig.badge}
                    </div>
                  </div>
                </CCol>
                <CCol>
                  <h2 className="mb-1 d-flex align-items-center">
                    {offerData.title} 
                    <CIcon icon={categoryIcon} className="ms-2 text-primary" size="lg" />
                  </h2>
                  <p className="text-medium-emphasis mb-3">
                    <CBadge color="primary-gradient" className="me-2">
                      {offerData.category_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </CBadge>
                    <span className="text-muted">ID: #{offerData.id}</span>
                  </p>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <CBadge 
                      color="success-gradient" 
                      shape="rounded-pill"
                      className="px-3 py-2"
                    >
                      <CIcon icon={cilTag} className="me-1" />
                      {offerData.discount_rate}% OFF
                    </CBadge>
                    <CBadge 
                      color="info-gradient" 
                      shape="rounded-pill"
                      className="px-3 py-2"
                    >
                      <CIcon icon={cilDollar} className="me-1" />
                      Save {formatCurrency(savingsAmount)}
                    </CBadge>
                    {offerData.brand_name && (
                      <CBadge color="warning-gradient" shape="rounded-pill" className="px-3 py-2">
                        <CIcon icon={cilBriefcase} className="me-1" />
                        {offerData.brand_name}
                      </CBadge>
                    )}
                  </div>
                  <div className="offer-progress">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="text-medium-emphasis">Offer Completeness</small>
                      <small className="text-medium-emphasis fw-semibold">{offerCompleteness}%</small>
                    </div>
                    <CProgress 
                      value={offerCompleteness} 
                      color={offerCompleteness > 75 ? 'success' : offerCompleteness > 50 ? 'warning' : 'danger'}
                      height={8}
                      className="mb-2"
                    />
                  </div>
                  {/* Pricing Info */}
                  <div className="pricing-info-inline mt-3">
                    <div className="price-item">
                      <span className="price-label">Original:</span>
                      <span className="price-value original">{formatCurrency(offerData.price_before)}</span>
                    </div>
                    <div className="price-item">
                      <span className="price-label">Final:</span>
                      <span className="price-value final">{formatCurrency(priceAfter)}</span>
                    </div>
                    {offerData.coupon && (
                      <div className="coupon-info">
                        <CBadge color="primary" className="coupon-badge">
                          <CIcon icon={cilTag} className="me-1" />
                          {offerData.coupon}
                        </CBadge>
                                                  <CButton 
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(offerData.coupon!)}
                            className="ms-2"
                          >
                            <CIcon icon={cilCopy} size="sm" />
                          </CButton>
                      </div>
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
                    active={activeTab === 'pricing'}
                    onClick={() => setActiveTab('pricing')}
                    style={{ cursor: 'pointer' }}
                  >
                    <CIcon icon={cilDollar} className="me-2" />
                    Pricing Details
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink 
                    active={activeTab === 'brand'}
                    onClick={() => setActiveTab('brand')}
                    style={{ cursor: 'pointer' }}
                  >
                    <CIcon icon={cilBriefcase} className="me-2" />
                    Brand Info
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
                      <h5 className="text-primary mb-3">Offer Information</h5>
                      <CTable responsive borderless className="mb-0">
                        <CTableBody>
                          <CTableRow>
                            <CTableDataCell className="text-medium-emphasis py-2">
                              <CIcon icon={cilTag} className="me-2" />
                              Title
                            </CTableDataCell>
                            <CTableDataCell className="fw-semibold py-2">{offerData.title}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell className="text-medium-emphasis py-2">
                              <CIcon icon={categoryIcon} className="me-2" />
                              Category
                            </CTableDataCell>
                            <CTableDataCell className="fw-semibold py-2">
                              {offerData.category_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell className="text-medium-emphasis py-2">
                              <CIcon icon={cilSpeedometer} className="me-2" />
                              Status
                            </CTableDataCell>
                            <CTableDataCell className="py-2">{statusConfig.badge}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell className="text-medium-emphasis py-2">
                              <CIcon icon={cilTag} className="me-2" />
                              Discount Rate
                            </CTableDataCell>
                            <CTableDataCell className="py-2">
                              <CBadge color="success" className="px-3">
                                {offerData.discount_rate}% OFF
                              </CBadge>
                            </CTableDataCell>
                          </CTableRow>
                          {offerData.coupon && (
                            <CTableRow>
                              <CTableDataCell className="text-medium-emphasis py-2">
                                <CIcon icon={cilTag} className="me-2" />
                                Coupon Code
                              </CTableDataCell>
                              <CTableDataCell className="py-2">
                                <div className="d-flex align-items-center">
                                  <CBadge color="primary" className="me-2">
                                    {offerData.coupon}
                                  </CBadge>
                                  <CButton 
                                    size="sm"
                                    variant="outline"
                                    color="primary"
                                    onClick={() => copyToClipboard(offerData.coupon!)}
                                  >
                                    <CIcon icon={cilCopy} className="me-1" />
                                    Copy
                                  </CButton>
                                </div>
                              </CTableDataCell>
                            </CTableRow>
                          )}
                        </CTableBody>
                      </CTable>
                    </CCol>
                    <CCol md={6} className="mb-4">
                      <h5 className="text-primary mb-3">Quick Stats</h5>
                      <CRow>
                        <CCol xs={6} className="mb-3">
                          <CCard className="text-center border-0 bg-light">
                            <CCardBody className="py-3">
                              <CIcon icon={cilDollar} size="xl" className="text-success mb-2" />
                              <div className="fw-bold">{formatCurrency(offerData.price_before)}</div>
                              <small className="text-muted">Original Price</small>
                            </CCardBody>
                          </CCard>
                        </CCol>
                        <CCol xs={6} className="mb-3">
                          <CCard className="text-center border-0 bg-light">
                            <CCardBody className="py-3">
                              <CIcon icon={cilTag} size="xl" className="text-danger mb-2" />
                              <div className="fw-bold">{offerData.discount_rate}%</div>
                              <small className="text-muted">Discount</small>
                            </CCardBody>
                          </CCard>
                        </CCol>
                        <CCol xs={6} className="mb-3">
                          <CCard className="text-center border-0 bg-light">
                            <CCardBody className="py-3">
                              <CIcon icon={cilStar} size="xl" className="text-primary mb-2" />
                              <div className="fw-bold">{formatCurrency(priceAfter)}</div>
                              <small className="text-muted">Final Price</small>
                            </CCardBody>
                          </CCard>
                        </CCol>
                        <CCol xs={6} className="mb-3">
                          <CCard className="text-center border-0 bg-light">
                            <CCardBody className="py-3">
                              <CIcon icon={cilCheckCircle} size="xl" className="text-info mb-2" />
                              <div className="fw-bold">{formatCurrency(savingsAmount)}</div>
                              <small className="text-muted">You Save</small>
                            </CCardBody>
                          </CCard>
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>
                </CTabPane>

                {/* Pricing Details Tab */}
                <CTabPane visible={activeTab === 'pricing'}>
                  <CRow>
                    <CCol md={8} className="mb-4">
                      <h5 className="text-primary mb-3">Pricing Breakdown</h5>
                      <div className="pricing-breakdown">
                        <div className="pricing-item">
                          <div className="pricing-header">
                            <span>Original Price</span>
                            <span className="pricing-value original-price">{formatCurrency(offerData.price_before)}</span>
                          </div>
                          <CProgress 
                            value={100}
                            color="secondary"
                            height={12}
                            className="pricing-progress"
                          />
                        </div>
                        <div className="pricing-item">
                          <div className="pricing-header">
                            <span>Discount ({offerData.discount_rate}%)</span>
                            <span className="pricing-value discount-amount">-{formatCurrency(savingsAmount)}</span>
                          </div>
                          <CProgress 
                            value={offerData.discount_rate}
                            color="danger"
                            height={12}
                            className="pricing-progress"
                          />
                        </div>
                        <div className="pricing-item final-pricing">
                          <div className="pricing-header">
                            <span>Final Price</span>
                            <span className="pricing-value final-price">{formatCurrency(priceAfter)}</span>
                          </div>
                          <CProgress 
                            value={((priceAfter / offerData.price_before) * 100)}
                            color="success"
                            height={12}
                            className="pricing-progress"
                          />
                        </div>
                      </div>

                      <div className="savings-highlight mt-4">
                        <CAlert color="success" className="savings-alert">
                          <CIcon icon={cilStar} className="me-2" />
                          <strong>Customer Savings: {formatCurrency(savingsAmount)}</strong>
                          <span className="ms-2">
                            ({offerData.discount_rate}% off original price)
                          </span>
                        </CAlert>
                      </div>
                    </CCol>
                    <CCol md={4}>
                      <h5 className="text-primary mb-3">Price Comparison</h5>
                      <CCard className="border-0 bg-light">
                        <CCardBody>
                          <div className="text-center">
                            <div className="mb-3">
                              <span className="text-decoration-line-through text-muted fs-4">
                                {formatCurrency(offerData.price_before)}
                              </span>
                            </div>
                            <div className="mb-3">
                              <span className="text-success fw-bold fs-2">
                                {formatCurrency(priceAfter)}
                              </span>
                            </div>
                            <CBadge color="success" className="px-4 py-2">
                              Save {formatCurrency(savingsAmount)}
                            </CBadge>
                          </div>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                </CTabPane>

                {/* Brand Info Tab */}
                <CTabPane visible={activeTab === 'brand'}>
                  <CRow>
                    <CCol md={6} className="mb-4">
                      <h5 className="text-primary mb-3">Brand Information</h5>
                      <CTable responsive borderless className="mb-0">
                        <CTableBody>
                          {offerData.brand_name && (
                            <CTableRow>
                              <CTableDataCell className="text-medium-emphasis py-2">
                                <CIcon icon={cilBriefcase} className="me-2" />
                                Brand Name
                              </CTableDataCell>
                              <CTableDataCell className="fw-semibold py-2">
                                <CBadge color="primary" className="px-3 py-2">
                                  {offerData.brand_name}
                                </CBadge>
                              </CTableDataCell>
                            </CTableRow>
                          )}
                          <CTableRow>
                            <CTableDataCell className="text-medium-emphasis py-2">
                              <CIcon icon={cilDescription} className="me-2" />
                              Category Type
                            </CTableDataCell>
                            <CTableDataCell className="fw-semibold py-2">
                              {offerData.category_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </CTableDataCell>
                          </CTableRow>
                          {offerData.coupon && (
                            <CTableRow>
                              <CTableDataCell className="text-medium-emphasis py-2">
                                <CIcon icon={cilTag} className="me-2" />
                                Coupon Code
                              </CTableDataCell>
                              <CTableDataCell className="py-2">
                                <div className="d-flex align-items-center">
                                  <code className="bg-light px-2 py-1 rounded me-2">
                                    {offerData.coupon}
                                  </code>
                                  <CButton 
                                    size="sm"
                                    variant="outline"
                                    color="primary"
                                    onClick={() => copyToClipboard(offerData.coupon!)}
                                  >
                                    <CIcon icon={cilCopy} />
                                  </CButton>
                                </div>
                              </CTableDataCell>
                            </CTableRow>
                          )}
                        </CTableBody>
                      </CTable>
                    </CCol>
                    <CCol md={6} className="mb-4">
                      {offerData.brand_name ? (
                        <div>
                          <h5 className="text-primary mb-3">Brand Actions</h5>
                          <div className="d-grid gap-2">
                            <CButton color="primary" variant="outline">
                              <CIcon icon={cilExternalLink} className="me-2" />
                              View Brand Details
                            </CButton>
                            <CButton color="secondary" variant="outline">
                              <CIcon icon={cilTag} className="me-2" />
                              View Other Offers
                            </CButton>
                          </div>
                        </div>
                      ) : (
                        <CAlert color="info">
                          <CIcon icon={cilInfo} className="me-2" />
                          No brand information available for this offer.
                        </CAlert>
                      )}
                    </CCol>
                  </CRow>
                </CTabPane>

                {/* System Info Tab */}
                <CTabPane visible={activeTab === 'system'}>
                  <CRow>
                    <CCol md={6} className="mb-4">
                      <h5 className="text-primary mb-3">Timestamps</h5>
                      <CTable responsive borderless className="mb-0">
                        <CTableBody>
                          <CTableRow>
                            <CTableDataCell className="text-medium-emphasis py-2">
                              <CIcon icon={cilCalendar} className="me-2" />
                              Created At
                            </CTableDataCell>
                            <CTableDataCell className="fw-semibold py-2">
                              {new Date(offerData.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </CTableDataCell>
                          </CTableRow>
                          {offerData.updated_at && (
                            <CTableRow>
                              <CTableDataCell className="text-medium-emphasis py-2">
                                <CIcon icon={cilCalendar} className="me-2" />
                                Last Updated
                              </CTableDataCell>
                              <CTableDataCell className="fw-semibold py-2">
                                {new Date(offerData.updated_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </CTableDataCell>
                            </CTableRow>
                          )}
                          {offerData.deleted_at && (
                            <CTableRow>
                              <CTableDataCell className="text-medium-emphasis py-2">
                                <CIcon icon={cilTrash} className="me-2" />
                                Deleted At
                              </CTableDataCell>
                              <CTableDataCell className="text-danger fw-semibold py-2">
                                {new Date(offerData.deleted_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </CTableDataCell>
                            </CTableRow>
                          )}
                        </CTableBody>
                      </CTable>
                    </CCol>
                    <CCol md={6} className="mb-4">
                      <h5 className="text-primary mb-3">System Actions</h5>
                      <div className="d-grid gap-2">
                        <CButton color="secondary" variant="outline" onClick={() => refetch()}>
                          <CIcon icon={cilSpeedometer} className="me-2" />
                          Refresh Data
                        </CButton>
                        <CButton color="info" variant="outline">
                          <CIcon icon={cilCloudDownload} className="me-2" />
                          Export Details
                        </CButton>
                        <CButton color="warning" variant="outline">
                          <CIcon icon={cilShare} className="me-2" />
                          Share Offer
                        </CButton>
                      </div>
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
        <CModalHeader>
          <CModalTitle>Offer Image - {offerData.title}</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center">
          {offerData.image && (
            <img
              src={offerData.image}
              alt={offerData.title}
              className="img-fluid rounded"
              style={{ maxHeight: '70vh', objectFit: 'contain' }}
            />
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setImageModalVisible(false)}>
            Close
          </CButton>
          {offerData.image && (
            <CButton color="primary" onClick={() => window.open(offerData.image, '_blank')}>
              <CIcon icon={cilExternalLink} className="me-2" />
              Open in New Tab
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default OfferDetails; 