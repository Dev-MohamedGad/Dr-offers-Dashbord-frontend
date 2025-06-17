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

const BrandDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <CContainer fluid>
      <div className="mb-4">
        <CButton 
          color="primary" 
          variant="outline" 
          onClick={() => navigate('/brands')}
          className="mb-3"
        >
          <CIcon icon={cilArrowLeft} className="me-2" />
          Back to Brands
        </CButton>
        
        <h2 className="brands-title">Brand Details #{id}</h2>
      </div>

      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <h4>Brand Information</h4>
              <p>This is a placeholder for brand details. Brand ID: {id}</p>
              <p>Here you can display detailed information about the brand, edit forms, analytics, etc.</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default BrandDetails; 