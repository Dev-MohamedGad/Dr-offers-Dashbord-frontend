import { useParams } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaSync } from 'react-icons/fa';
import { useGetOpportunityByIdQuery } from '@redux/slices/opportunitySlice/opportunitiesApiSlice';
import { Slide } from 'react-slideshow-image';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CAlert,
  CContainer,
  CRow,
  CCol,
  CButton,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react-pro';
import 'react-slideshow-image/dist/styles.css';
import '@coreui/coreui-pro/dist/css/coreui.min.css';
import { useState, useEffect } from 'react';
import InterestRequestsList from '@components/InterestRequestsList';
import ShareholdersList from '@components/ShareholdersList';
import InvestmentForm from '@components/InvestmentForm';
import EmptyState from '../../components/EmptyState';

const OpportunityDetails = () => {
  const { id } = useParams();
  const { data, isLoading, refetch } = useGetOpportunityByIdQuery(id);
  const [activeTab, setActiveTab] = useState(1);

  

  if (isLoading) {
    return (
      <CContainer className="d-flex align-items-center justify-content-center min-vh-100">
        <CSpinner color="primary" />
      </CContainer>
    );
  }

  if (!data?.data) {
    return (
      <EmptyState 
        title="No Data Available"
        description="The requested opportunity could not be found or is temporarily unavailable."
        imageSize={150}
      />
    );
  }

  const property = data.data;
  return (
    <CContainer fluid className="bg-light">
      <CCard className="mb-4 border-0 shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 className="m-0 h4">{property.title_en}</h1>
          
        </CCardHeader>

        <CCardBody>
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink
                active={activeTab === 1}
                onClick={() => {setActiveTab(1); refetch()}}
                style={{ cursor: 'pointer' }}
              >
                Property Details
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 2}
                onClick={() => {setActiveTab(2) }}
                style={{ cursor: 'pointer' }}
              >
                Interest Requests
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 3}
                onClick={() => setActiveTab(3)}
                style={{ cursor: 'pointer' }}
              >
                Share Owners
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 4}
                onClick={() => setActiveTab(4)}
                style={{ cursor: 'pointer' }}
              >
                Create Investment
              </CNavLink>
            </CNavItem>
          </CNav>

          <CTabContent className="pt-4">
            <CTabPane visible={activeTab === 1}>
              <CRow>
                <CCol lg={8}>
                  {property.media && property.media.length > 0 ? (
                    <Slide
                      autoplay={true}
                      duration={5000}
                      infinite={true}
                      indicators={true}
                      arrows={true}
                      pauseOnHover={true}
                      prevArrow={
                        <FaChevronLeft
                          className="text-white"
                          style={{ fontSize: '2rem' }}
                        />
                      }
                      nextArrow={
                        <FaChevronRight
                          className="text-white"
                          style={{ fontSize: '2rem' }}
                        />
                      }
                    >
                      {property.media.map((media: any, index: number) => (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            height: '500px',
                            width: '100%',
                          }}
                          className="eac flex items-center justify-center"
                          key={index}
                        >
                          <img
                            src={media.url}
                            alt={media.alt_text || 'Property Image'}
                          />
                        </div>
                      ))}
                    </Slide>
                  ) : (
                    <EmptyState 
                      title="No Images Available"
                      description="This property doesn't have any images uploaded yet."
                      imageSize={150}
                    />
                  )}
                </CCol>

                <CCol lg={4}>
                  <CCard className="h-100 border-0 shadow-sm">
                    <CCardHeader>
                      <h3 className="m-0 h5">Investment Details</h3>
                    </CCardHeader>
                    <CCardBody>
                      <div className="mb-4">
                        <dl className="row">
                          <dt className="col-sm-6">Available Shares:</dt>
                          <dd className="col-sm-6">
                            {property.available_shares}
                          </dd>

                        
                          <dt className="col-sm-6">Share Price:</dt>
                          <dd className="col-sm-6">
                            {property.share_price} {property.currency}
                          </dd>

                          <dt className="col-sm-6">Estimated Sales Range:</dt>
                          <dd className="col-sm-6">
                            {property.estimate_sales_range_start} -{' '}
                            {property.estimate_sales_range_end}{' '}
                            {property.currency}
                          </dd>

                          <dt className="col-sm-6">1-Year Return:</dt>
                          <dd className="col-sm-6">
                            {property.total_return_1_year}%
                          </dd>

                          <dt className="col-sm-6">5-Year Return:</dt>
                          <dd className="col-sm-6">
                            {property.total_return_5_years}%
                          </dd>
                        </dl>
                      </div>

                      <div className="d-grid gap-2">
                        <CButton
                          href={`https://wa.me/${property.cta_whatsapp_number}`}
                          color="success"
                          className="text-white"
                        >
                          Contact on WhatsApp
                        </CButton>
                        <CButton
                          href={`tel:${property.cta_phone_number}`}
                          color="primary"
                        >
                          Call Us Now
                        </CButton>
                        <CButton
                          href={`mailto:${property.cta_email}`}
                          color="warning"
                          className="text-white"
                        >
                          Send an Email
                        </CButton>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CTabPane>

            <CTabPane visible={activeTab === 2}>
              <InterestRequestsList id={id as string} />
            </CTabPane>

            <CTabPane visible={activeTab === 3}>
              <ShareholdersList id={id as string} />
            </CTabPane>

            <CTabPane visible={activeTab === 4}>
              <CCard className="border-0 shadow-sm">
                <CCardHeader>
                  <h3 className="m-0 h5">Create New Investment</h3>
                </CCardHeader>
                <CCardBody>
                  <InvestmentForm 
                    opportunityId={id as string} 
                  
                  />
                </CCardBody>
              </CCard>
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default OpportunityDetails;
