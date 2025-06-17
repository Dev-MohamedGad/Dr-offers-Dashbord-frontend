import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CRow,
  CCol,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft } from '@coreui/icons';

const OfferDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <CContainer fluid>
      <div className="mb-4">
        <CButton 
          color="primary" 
          variant="outline" 
          onClick={() => navigate('/offers')}
          className="mb-3"
        >
          <CIcon icon={cilArrowLeft} className="me-2" />
          Back to Offers
        </CButton>
        
        <h2 className="offers-title">Offer Details #{id}</h2>
      </div>

      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <h4>Offer Information</h4>
              <p>This is a placeholder for offer details. Offer ID: {id}</p>
              <p>Here you can display detailed information about the offer, edit forms, analytics, etc.</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default OfferDetails; 