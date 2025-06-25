import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CSpinner,
  CAlert,
  CInputGroup,
  CInputGroupText,
  CBadge,
  CTooltip,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import {
  cilArrowLeft,
  cilSave,
  cilX,
  cilDescription,
  cilUser,
  cilBriefcase,
  cilSettings,
  cilCloudUpload,
  cilCheckCircle,
  cilWarning,
} from '@coreui/icons';
import { useGetBrandDetailsQuery, useUpdateBrandMutation, UpdateBrandRequest } from '../../redux/slices/brandsSlice';
import './editBrandForm.css';

interface FormData extends UpdateBrandRequest {
  brand_name: string;
  status: 'active' | 'pending' | 'rejected';
  category_type: string;
  subscription_plan: string;
  owner_name: string;
}

interface FormErrors {
  brand_name?: string;
  category_type?: string;
  subscription_plan?: string;
  owner_name?: string;
  general?: string;
}

const categoryOptions = [
  'Restaurant',
  'Electronics',
  'Fashion',
  'Health & Fitness',
  'Beauty & Wellness',
  'Food & Beverages',
  'Automotive',
  'Real Estate',
  'Education',
  'Travel & Tourism',
  'Technology',
  'Other'
];

const planOptions = [
  'Basic',
  'Premium',
  'Enterprise',
  'Pro',
  'Standard'
];

const statusOptions = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'rejected', label: 'Rejected', color: 'danger' }
];

const EditBrandForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    brand_name: '',
    status: 'pending',
    category_type: '',
    subscription_plan: '',
    owner_name: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [businessDocsFile, setBusinessDocsFile] = useState<File | null>(null);

  // API hooks
  const { 
    data: brandResponse, 
    isLoading, 
    isError, 
    error 
  } = useGetBrandDetailsQuery({ 
    id: Number(id), 
  });
  
  const [updateBrand] = useUpdateBrandMutation();

  // Initialize form data when brand data is loaded
  useEffect(() => {
    if (brandResponse?.data) {
      const brand = brandResponse.data;
      setFormData({
        brand_name: brand.brand_name || '',
        status: brand.status || 'pending',
        category_type: brand.category_type || '',
        subscription_plan: brand.subscription_plan || '',
        owner_name: brand.owner?.name || brand.owner_name || '',
      });
    }
  }, [brandResponse]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.brand_name.trim()) {
      newErrors.brand_name = 'Brand name is required';
    } else if (formData.brand_name.length < 2) {
      newErrors.brand_name = 'Brand name must be at least 2 characters';
    }

    if (!formData.category_type) {
      newErrors.category_type = 'Category is required';
    }

    if (!formData.subscription_plan) {
      newErrors.subscription_plan = 'Subscription plan is required';
    }

    if (!formData.owner_name.trim()) {
      newErrors.owner_name = 'Owner name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ 
          ...prev, 
          general: 'Please upload a PDF or image file (JPG, PNG)' 
        }));
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ 
          ...prev, 
          general: 'File size must be less than 5MB' 
        }));
        return;
      }
      
      setBusinessDocsFile(file);
      setErrors(prev => ({ ...prev, general: undefined }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Prepare update data
      const updateData: UpdateBrandRequest = {
        brand_name: formData.brand_name,
        status: formData.status,
        category_type: formData.category_type,
        subscription_plan: formData.subscription_plan,
        owner_name: formData.owner_name,
      };

      // If there's a file, we would need to handle file upload separately
      // For now, we'll just update the other fields
      if (businessDocsFile) {
        // In a real app, you'd upload the file first and get a URL
        // updateData.business_docs = uploadedFileUrl;
        console.log('File to upload:', businessDocsFile.name);
      }

      await updateBrand({ 
        id: Number(id), 
        body: updateData 
      }).unwrap();

      setShowSuccess(true);
      setTimeout(() => {
        navigate(`/brands/${id}`);
      }, 2000);

    } catch (error: any) {
      console.error('Update failed:', error);
      setErrors({ 
        general: error?.data?.message || 'Failed to update brand. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <CContainer fluid className="px-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <CSpinner color="primary" />
        </div>
      </CContainer>
    );
  }

  if (isError || !brandResponse?.data) {
    return (
      <CContainer fluid className="px-4">
        <div className="error-state">
          <CIcon icon={cilWarning} size="3xl" className="error-icon" />
          <h5 className="error-title">Unable to Load Brand</h5>
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

  const currentStatus = statusOptions.find(option => option.value === formData.status);

  return (
    <CContainer fluid className="px-4 edit-brand-container">
      {/* Header */}
      <div className="edit-brand-header">
        <CButton 
          color="light" 
          onClick={() => navigate(`/brands/${id}`)}
          className="back-button"
        >
          <CIcon icon={cilArrowLeft} className="me-2" />
          Back to Brand Details
        </CButton>
        
        <div className="header-content">
          <h1 className="page-title">Edit Brand</h1>
          <div className="brand-info">
            <span className="brand-name">{brandResponse.data.brand_name}</span>
            <CBadge 
              color={currentStatus?.color || 'secondary'} 
              className="status-badge"
            >
              {currentStatus?.label || formData.status}
            </CBadge>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {showSuccess && (
        <CAlert color="success" className="success-alert">
          <CIcon icon={cilCheckCircle} className="me-2" />
          Brand updated successfully! Redirecting to brand details...
        </CAlert>
      )}

      {/* Error Alert */}
      {errors.general && (
        <CAlert color="danger" className="error-alert">
          <CIcon icon={cilWarning} className="me-2" />
          {errors.general}
        </CAlert>
      )}

      <CRow className="g-4">
        <CCol lg={8}>
          {/* Main Form Card */}
          <CCard className="form-card">
            <CCardHeader className="form-card-header">
              <div className="header-content">
                <CIcon icon={cilBriefcase} className="header-icon" />
                <h5 className="header-title">Brand Information</h5>
              </div>
            </CCardHeader>
            <CCardBody className="form-card-body">
              <CForm onSubmit={handleSubmit}>
                <CRow className="g-4">
                  {/* Brand Name */}
                  <CCol md={6}>
                    <div className="form-group">
                      <CFormLabel className="form-label required">
                        <CIcon icon={cilBriefcase} className="me-2" />
                        Brand Name
                      </CFormLabel>
                      <CFormInput
                        type="text"
                        value={formData.brand_name}
                        onChange={(e) => handleInputChange('brand_name', e.target.value)}
                        className={`form-input ${errors.brand_name ? 'is-invalid' : ''}`}
                        placeholder="Enter brand name"
                      />
                      {errors.brand_name && (
                        <div className="invalid-feedback">{errors.brand_name}</div>
                      )}
                    </div>
                  </CCol>

                  {/* Owner Name */}
                  <CCol md={6}>
                    <div className="form-group">
                      <CFormLabel className="form-label required">
                        <CIcon icon={cilUser} className="me-2" />
                        Owner Name
                      </CFormLabel>
                      <CFormInput
                        type="text"
                        value={formData.owner_name}
                        onChange={(e) => handleInputChange('owner_name', e.target.value)}
                        className={`form-input ${errors.owner_name ? 'is-invalid' : ''}`}
                        placeholder="Enter owner name"
                      />
                      {errors.owner_name && (
                        <div className="invalid-feedback">{errors.owner_name}</div>
                      )}
                    </div>
                  </CCol>

                  {/* Category */}
                  <CCol md={6}>
                    <div className="form-group">
                      <CFormLabel className="form-label required">
                        <CIcon icon={cilDescription} className="me-2" />
                        Category
                      </CFormLabel>
                      <CFormSelect
                        value={formData.category_type}
                        onChange={(e) => handleInputChange('category_type', e.target.value)}
                        className={`form-input ${errors.category_type ? 'is-invalid' : ''}`}
                      >
                        <option value="">Select category</option>
                        {categoryOptions.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </CFormSelect>
                      {errors.category_type && (
                        <div className="invalid-feedback">{errors.category_type}</div>
                      )}
                    </div>
                  </CCol>

                  {/* Subscription Plan */}
                  <CCol md={6}>
                    <div className="form-group">
                      <CFormLabel className="form-label required">
                        <CIcon icon={cilSettings} className="me-2" />
                        Subscription Plan
                      </CFormLabel>
                      <CFormSelect
                        value={formData.subscription_plan}
                        onChange={(e) => handleInputChange('subscription_plan', e.target.value)}
                        className={`form-input ${errors.subscription_plan ? 'is-invalid' : ''}`}
                      >
                        <option value="">Select plan</option>
                        {planOptions.map(plan => (
                          <option key={plan} value={plan}>
                            {plan}
                          </option>
                        ))}
                      </CFormSelect>
                      {errors.subscription_plan && (
                        <div className="invalid-feedback">{errors.subscription_plan}</div>
                      )}
                    </div>
                  </CCol>

                  {/* Business Documents */}
                  <CCol xs={12}>
                    <div className="form-group">
                      <CFormLabel className="form-label">
                        <CIcon icon={cilCloudUpload} className="me-2" />
                        Business Documents
                      </CFormLabel>
                      <CInputGroup>
                        <CFormInput
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="form-input"
                        />
                        <CInputGroupText>
                          <CTooltip content="Upload PDF or image files (max 5MB)">
                            <CIcon icon={cilDescription} />
                          </CTooltip>
                        </CInputGroupText>
                      </CInputGroup>
                      <div className="form-help-text">
                        Upload business license, registration, or other relevant documents
                      </div>
                      {businessDocsFile && (
                        <div className="file-preview">
                          <CIcon icon={cilDescription} className="me-2" />
                          {businessDocsFile.name}
                          <CBadge color="success" className="ms-2">Ready to upload</CBadge>
                        </div>
                      )}
                    </div>
                  </CCol>
                </CRow>

                {/* Form Actions */}
                <div className="form-actions">
                  <CButton
                    type="button"
                    color="secondary"
                    variant="outline"
                    onClick={() => navigate(`/brands/${id}`)}
                    disabled={isSubmitting}
                    className="action-button secondary"
                  >
                    <CIcon icon={cilX} className="me-2" />
                    Cancel
                  </CButton>
                  <CButton
                    type="submit"
                    color="primary"
                    disabled={isSubmitting}
                    className="action-button primary"
                  >
                    {isSubmitting ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CIcon icon={cilSave} className="me-2" />
                        Update Brand
                      </>
                    )}
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Status Management Sidebar */}
        <CCol lg={4}>
          <CCard className="status-card">
            <CCardHeader className="form-card-header">
              <div className="header-content">
                <CIcon icon={cilSettings} className="header-icon" />
                <h5 className="header-title">Status Management</h5>
              </div>
            </CCardHeader>
            <CCardBody className="form-card-body">
              <div className="form-group">
                <CFormLabel className="form-label">Brand Status</CFormLabel>
                <div className="status-options">
                  {statusOptions.map(option => (
                    <div
                      key={option.value}
                      className={`status-option ${formData.status === option.value ? 'active' : ''}`}
                      onClick={() => handleInputChange('status', option.value)}
                    >
                      <CBadge color={option.color} className="status-badge">
                        {option.label}
                      </CBadge>
                      <div className="status-description">
                        {option.value === 'active' && 'Brand is live and visible to customers'}
                        {option.value === 'pending' && 'Brand is awaiting approval'}
                        {option.value === 'rejected' && 'Brand has been rejected and is not visible'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Brand Stats */}
              <div className="brand-stats">
                <h6 className="stats-title">Current Statistics</h6>
                <div className="stat-item">
                  <span className="stat-label">Views</span>
                  <span className="stat-value">{brandResponse.data.views.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Clicks</span>
                  <span className="stat-value">{brandResponse.data.clicks.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Visitors</span>
                  <span className="stat-value">{brandResponse.data.visitors.toLocaleString()}</span>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default EditBrandForm; 