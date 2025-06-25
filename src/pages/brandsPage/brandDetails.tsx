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
  CListGroup,
  CListGroupItem,
  CProgress,
  CTooltip,
  CAlert,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { 
  cilArrowLeft, 
  cilPencil, 
  cilTrash, 
  cilDescription, 
  cilUser, 
  cilCalendar,
  cilCloudDownload,
  cilZoom,
  cilCursor,
  cilPeople,
  cilSpeedometer,
  cilChartLine,
  cilBriefcase,
  cilCheckCircle,
  cilXCircle,
  cilClock,
  cilSettings,
} from '@coreui/icons';
import { useGetBrandDetailsQuery } from '../../redux/slices/brandsSlice';

import './brandDetails.css';

// Skeleton loader component
const SkeletonLoader: React.FC = () => (
  <CContainer fluid className="px-4">
    <div className="skeleton-header mb-4">
      <div className="skeleton skeleton-button" style={{ width: '120px', height: '36px' }} />
      <div className="skeleton skeleton-title" style={{ width: '300px', height: '40px', marginTop: '16px' }} />
      <div className="skeleton skeleton-subtitle" style={{ width: '150px', height: '20px', marginTop: '8px' }} />
    </div>
    <CRow className="g-4">
      <CCol lg={8}>
        <div className="skeleton skeleton-card" style={{ height: '250px', marginBottom: '24px' }} />
        <div className="skeleton skeleton-card" style={{ height: '300px' }} />
      </CCol>
      <CCol lg={4}>
        <div className="skeleton skeleton-card" style={{ height: '180px', marginBottom: '24px' }} />
        <div className="skeleton skeleton-card" style={{ height: '200px' }} />
      </CCol>
    </CRow>
  </CContainer>
);

// Performance metric card component
const MetricCard: React.FC<{
  icon: any;
  value: number | string;
  label: string;
  color: string;
}> = ({ icon, value, label, color }) => (
  <div className="metric-card">
    <div className="metric-icon" style={{ backgroundColor: `${color}15` }}>
      <CIcon icon={icon} size="xl" style={{ color }} />
    </div>
    <div className="metric-content">
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
    </div>
  </div>
);

const BrandDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();


  // Fetch brand details from API without tracking views (admin interface)
  const { 
    data: brandResponse, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetBrandDetailsQuery({ 
    id: Number(id), 
  });

  const brandData = brandResponse?.data;

  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    switch (status.toLowerCase()) {
      case 'active':
        return { 
          badge: <CBadge color="success" shape="rounded-pill" className="status-badge active">
            <CIcon icon={cilCheckCircle} size="sm" className="me-1" />
            {normalizedStatus}
          </CBadge>,
          color: '#28a745'
        };
      case 'pending':
        return { 
          badge: <CBadge color="warning" shape="rounded-pill" className="status-badge pending">
            <CIcon icon={cilClock} size="sm" className="me-1" />
            {normalizedStatus}
          </CBadge>,
          color: '#ffc107'
        };
      case 'rejected':
        return { 
          badge: <CBadge color="danger" shape="rounded-pill" className="status-badge rejected">
            <CIcon icon={cilXCircle} size="sm" className="me-1" />
            {normalizedStatus}
          </CBadge>,
          color: '#dc3545'
        };
      default:
        return { 
          badge: <CBadge color="secondary" shape="rounded-pill" className="status-badge">
            {normalizedStatus}
          </CBadge>,
          color: '#6c757d'
        };
    }
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (isError || !brandData) {
    return (
      <CContainer fluid className="px-4">
        <div className="error-state">
          <img 
            src="/src/assets/no-data-found.svg" 
            alt="Error" 
            className="error-illustration"
          />
          <h5 className="error-title">Unable to Load Brand Details</h5>
          <p className="error-message">
            {error && 'data' in error ? error.data as string : 'Brand not found or an error occurred'}
          </p>
          <CButton 
            color="primary" 
            onClick={() => navigate('/brands')}
            className="error-button"
          >
            <CIcon icon={cilArrowLeft} className="me-2" />
            Back to Brands
          </CButton>
        </div>
      </CContainer>
    );
  }

  const statusConfig = getStatusConfig(brandData.status);
  const ctrPercentage = brandData.views > 0 ? ((brandData.clicks / brandData.views) * 100).toFixed(2) : '0';

  return (
    <CContainer fluid className="px-4 brand-details-container">
      {/* Enhanced Header */}
      <div className="brand-header">
        <CButton 
          color="light" 
          onClick={() => navigate('/brands')}
          className="back-button"
        >
          <CIcon icon={cilArrowLeft} className="me-2" />
          Back to Brands
        </CButton>
        
        <div className="brand-header-content">
          <div className="brand-info">
            <h1 className="brand-name">
              {brandData.brand_name}
            </h1>
            <div className="brand-meta">
              <span className="brand-id">ID: #{brandData.id}</span>
              {statusConfig.badge}
            </div>
          </div>
          
          <div className="brand-actions">
            {/* Edit button removed */}
          </div>
        </div>
      </div>

      {/* Key Metrics Section - Only API Available Data */}
      <div className="metrics-section">
        <CRow className="g-3">
          <CCol xs={12} sm={6} lg={4}>
            <MetricCard
              icon={cilZoom}
              value={brandData.views.toLocaleString()}
              label="Total Views"
              color="#B44C43"
            />
          </CCol>
          <CCol xs={12} sm={6} lg={4}>
            <MetricCard
              icon={cilCursor}
              value={brandData.clicks.toLocaleString()}
              label="Total Clicks"
              color="#28a745"
            />
          </CCol>
          <CCol xs={12} sm={6} lg={4}>
            <MetricCard
              icon={cilPeople}
              value={brandData.visitors.toLocaleString()}
              label="Unique Visitors"
              color="#17a2b8"
            />
          </CCol>
       
        </CRow>
      </div>

      <CRow className="g-4">
        {/* Left Column - Brand Information */}
        <CCol lg={8}>
          {/* Overview Card */}
          <CCard className="detail-card overview-card">
            <CCardHeader className="card-header-custom">
              <div className="header-content">
                <CIcon icon={cilBriefcase} className="header-icon" />
                <h5 className="header-title">Brand Overview</h5>
              </div>
            </CCardHeader>
            <CCardBody className="card-body-custom">
              <div className="info-grid">
                {(brandData.owner?.name || brandData.owner_name) && (
                  <div className="info-item">
                    <div className="info-icon">
                      <CIcon icon={cilUser} />
                    </div>
                    <div className="info-content">
                      <div className="info-label">Owner</div>
                      <div className="info-value">{brandData.owner?.name || brandData.owner_name}</div>
                    </div>
                  </div>
                )}
                <div className="info-item">
                  <div className="info-icon">
                    <CIcon icon={cilDescription} />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Category</div>
                    <div className="info-value">{brandData.category_type}</div>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">
                    <CIcon icon={cilCalendar} />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Created Date</div>
                    <div className="info-value">
                      {new Date(brandData.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                {brandData.updated_at && (
                  <div className="info-item">
                    <div className="info-icon">
                      <CIcon icon={cilCalendar} />
                    </div>
                    <div className="info-content">
                      <div className="info-label">Last Updated</div>
                      <div className="info-value">
                        {new Date(brandData.updated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                )}
                <div className="info-item">
                  <div className="info-icon">
                    <CIcon icon={cilSettings} />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Subscription Plan</div>
                    <div className="info-value">
                      <CBadge className="plan-badge">
                        {brandData.subscription_plan}
                      </CBadge>
                    </div>
                  </div>
                </div>
              </div>
            </CCardBody>
          </CCard>

          {/* Performance Analytics Card */}
          <CCard className="detail-card analytics-card">
            <CCardHeader className="card-header-custom">
              <div className="header-content">
                <CIcon icon={cilChartLine} className="header-icon" />
                <h5 className="header-title">Performance Analytics</h5>
              </div>
              <CButton color="light" size="sm" className="export-button">
                <CIcon icon={cilCloudDownload} className="me-2" />
                Export
              </CButton>
            </CCardHeader>
            <CCardBody className="card-body-custom">
              <div className="analytics-content">
                <div className="conversion-funnel">
                  <h6 className="section-subtitle">Engagement Metrics</h6>
                  <div className="funnel-item">
                    <div className="funnel-header">
                      <span>Views</span>
                      <span className="funnel-value">{brandData.views.toLocaleString()}</span>
                    </div>
                    <CProgress 
                      value={100}
                      color="primary"
                      height={8}
                      className="funnel-progress"
                    />
                  </div>
                  <div className="funnel-item">
                    <div className="funnel-header">
                      <span>Clicks</span>
                      <span className="funnel-value">{brandData.clicks.toLocaleString()}</span>
                    </div>
                    <CProgress 
                      value={brandData.views > 0 ? (brandData.clicks / brandData.views) * 100 : 0}
                      color="success"
                      height={8}
                      className="funnel-progress"
                    />
                  </div>
                  <div className="funnel-item">
                    <div className="funnel-header">
                      <span>Unique Visitors</span>
                      <span className="funnel-value">{brandData.visitors.toLocaleString()}</span>
                    </div>
                    <CProgress 
                      value={brandData.views > 0 ? (brandData.visitors / brandData.views) * 100 : 0}
                      color="info"
                      height={8}
                      className="funnel-progress"
                    />
                  </div>
                </div>

                <div className="performance-insights">
                  <h6 className="section-subtitle">Key Insights</h6>
                  <CAlert color="light" className="insight-alert">
                    <CIcon icon={cilChartLine} className="me-2" />
                    Click-through rate: {ctrPercentage}% 
                    {brandData.views > 0 && (
                      <span className="ms-2">
                        ({brandData.clicks} clicks from {brandData.views.toLocaleString()} views)
                      </span>
                    )}
                  </CAlert>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Right Column - Status & Documents */}
        <CCol lg={4}>
          {/* Quick Stats Card */}
          <CCard className="detail-card stats-card">
            <CCardHeader className="card-header-custom">
              <div className="header-content">
                <CIcon icon={cilSpeedometer} className="header-icon" />
                <h5 className="header-title">Brand Status</h5>
              </div>
            </CCardHeader>
            <CCardBody className="card-body-custom">
              <div className="quick-stats">
                <div className="stat-item">
                  <span className="stat-label">Status</span>
                  <span className="stat-value">{statusConfig.badge}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Subscription Plan</span>
                  <span className="stat-value">
                    <CBadge className="plan-badge premium">
                      {brandData.subscription_plan}
                    </CBadge>
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Category</span>
                  <span className="stat-value">{brandData.category_type}</span>
                </div>
                {brandData.deleted_at && (
                  <div className="stat-item">
                    <span className="stat-label">Deleted At</span>
                    <span className="stat-value text-danger">
                      {new Date(brandData.deleted_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CCardBody>
          </CCard>

          {/* Documents Card */}
          <CCard className="detail-card documents-card">
            <CCardHeader className="card-header-custom">
              <div className="header-content">
                <CIcon icon={cilDescription} className="header-icon" />
                <h5 className="header-title">Business Documents</h5>
              </div>
            </CCardHeader>
            <CCardBody className="card-body-custom p-0">
              {brandData.business_docs ? (
                <CListGroup flush className="documents-list">
                  <CListGroupItem className="document-item">
                    <div className="document-info">
                      <div className="document-icon">
                        <CIcon icon={cilDescription} />
                      </div>
                      <div className="document-details">
                        <div className="document-name">Business Document</div>
                        <div className="document-meta">Available for download</div>
                      </div>
                    </div>
                    <div className="document-actions">
                      <CTooltip content="View Document">
                        <CButton 
                          size="sm" 
                          color="light"
                          onClick={() => window.open(brandData.business_docs, '_blank')}
                          className="document-button"
                        >
                          <CIcon icon={cilZoom} />
                        </CButton>
                      </CTooltip>
                      <CTooltip content="Download">
                        <CButton 
                          size="sm" 
                          color="light"
                          className="document-button"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = brandData.business_docs!;
                            link.download = `${brandData.brand_name}_business_document`;
                            link.click();
                          }}
                        >
                          <CIcon icon={cilCloudDownload} />
                        </CButton>
                      </CTooltip>
                    </div>
                  </CListGroupItem>
                </CListGroup>
              ) : (
                <div className="empty-documents">
                  <CIcon icon={cilDescription} size="3xl" className="empty-icon" />
                  <div className="empty-text">No business documents available</div>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>


    </CContainer>
  );
};

export default BrandDetails; 