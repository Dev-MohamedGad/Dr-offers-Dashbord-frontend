import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CCol,
  CSpinner,
  CAlert,
  CInputGroup,
  CInputGroupText,
  CBadge,
  CTooltip,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import {
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
import { useUpdateBrandMutation, UpdateBrandRequest, Brand } from '../../redux/slices/brandsSlice';
import './EditBrandModal.css';

export enum CategoryType {
  GROCERIES = "groceries",
  PREMIUM_FRUITS = "premium_fruits",
  HOME_KITCHEN = "home_kitchen",
  FASHION = "fashion",
  ELECTRONICS = "electronics",
  BEAUTY = "beauty",
  HOME_IMPROVEMENT = "home_improvement",
  SPORTS_TOYS_LUGGAGE = "sports_toys_luggage",
}

interface EditBrandModalProps {
  visible: boolean;
  onClose: () => void;
  brand: Brand;
  onSuccess: () => void;
}

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

// Convert enum values to display labels
const getCategoryLabel = (category: CategoryType): string => {
  switch (category) {
    case CategoryType.GROCERIES:
      return 'Groceries';
    case CategoryType.PREMIUM_FRUITS:
      return 'Premium Fruits';
    case CategoryType.HOME_KITCHEN:
      return 'Home & Kitchen';
    case CategoryType.FASHION:
      return 'Fashion';
    case CategoryType.ELECTRONICS:
      return 'Electronics';
    case CategoryType.BEAUTY:
      return 'Beauty';
    case CategoryType.HOME_IMPROVEMENT:
      return 'Home Improvement';
    case CategoryType.SPORTS_TOYS_LUGGAGE:
      return 'Sports, Toys & Luggage';
    default:
      return category;
  }
};

const categoryOptions = Object.values(CategoryType);

const planOptions = [
  'free',
  'custom', 
  'other',
];

const statusOptions = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'rejected', label: 'Rejected', color: 'danger' }
];

const EditBrandModal: React.FC<EditBrandModalProps> = ({ 
  visible, 
  onClose, 
  brand, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState<FormData>({
    brand_name: '',
    status: 'pending',
    category_type: '',
    subscription_plan: '',
    owner_name: '',
  });
  
  const [originalData, setOriginalData] = useState<FormData>({
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

  const [updateBrand] = useUpdateBrandMutation();

  // Initialize form data when brand prop changes
  useEffect(() => {
    if (brand && visible) {
      const initialData = {
        brand_name: brand.brand_name || '',
        status: brand.status || 'pending',
        category_type: brand.category_type || '',
        subscription_plan: brand.subscription_plan || '',
        owner_name: brand.owner?.name || brand.owner_name || '',
      };
      
      setFormData(initialData);
      setOriginalData(initialData); // Store original data for comparison
      setErrors({});
      setShowSuccess(false);
      setBusinessDocsFile(null);
    }
  }, [brand, visible]);

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

  // Get only the changed fields
  const getChangedFields = (): Partial<UpdateBrandRequest> => {
    const changedFields: Partial<UpdateBrandRequest> = {};
    
    // Compare each field with original data
    if (formData.brand_name !== originalData.brand_name) {
      changedFields.brand_name = formData.brand_name;
    }
    
    if (formData.status !== originalData.status) {
      changedFields.status = formData.status;
    }
    
    if (formData.category_type !== originalData.category_type) {
      changedFields.category_type = formData.category_type;
    }
    
    if (formData.subscription_plan !== originalData.subscription_plan) {
      changedFields.subscription_plan = formData.subscription_plan;
    }
    

    
    return changedFields;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Get only changed fields
    const changedFields = getChangedFields();
    
    // Check if there are any changes or file upload
    if (Object.keys(changedFields).length === 0 && !businessDocsFile) {
      setErrors({ general: 'No changes detected. Please modify at least one field.' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Prepare update data with only changed fields
      const updateData: Partial<UpdateBrandRequest> = { ...changedFields };

      // If there's a file, we would need to handle file upload separately
      // For now, we'll just update the other fields
      if (businessDocsFile) {
        // In a real app, you'd upload the file first and get a URL
        // updateData.business_docs = uploadedFileUrl;
        console.log('File to upload:', businessDocsFile.name);
      }

      console.log('Sending only changed fields:', updateData);

      await updateBrand({ 
        id: brand.id, 
        body: updateData 
      }).unwrap();

      setShowSuccess(true);
      
      // Close modal and refresh data after a short delay
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess();
        onClose();
      }, 1500);

    } catch (error: any) {
      console.error('Update failed:', error);
      setErrors({ 
        general: error?.data?.message || 'Failed to update brand. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setErrors({});
      setShowSuccess(false);
      setBusinessDocsFile(null);
      onClose();
    }
  };

  const currentStatus = statusOptions.find(option => option.value === formData.status);

  return (
    <CModal
      visible={visible}
      onClose={handleClose}
      size="lg"
      className="edit-brand-modal"
      backdrop="static"
      keyboard={false}
    >
      <CModalHeader className="modal-header-custom">
        <CModalTitle className="modal-title-custom">
          <CIcon icon={cilBriefcase} className="me-2" />
          Edit Brand
        </CModalTitle>
        <div className="brand-status-info">
          <span className="brand-name-small">{brand.brand_name}</span>
          <CBadge 
            color={currentStatus?.color || 'secondary'} 
            className="status-badge-small"
          >
            {currentStatus?.label || formData.status}
          </CBadge>
        </div>
      </CModalHeader>

      <CModalBody className="modal-body-custom">
        {/* Success Alert */}
        {showSuccess && (
          <CAlert color="success" className="success-alert">
            <CIcon icon={cilCheckCircle} className="me-2" />
            Brand updated successfully!
          </CAlert>
        )}

        {/* Error Alert */}
        {errors.general && (
          <CAlert color="danger" className="error-alert">
            <CIcon icon={cilWarning} className="me-2" />
            {errors.general}
          </CAlert>
        )}

        <CForm onSubmit={handleSubmit}>
          <CRow className="g-3">
            {/* Brand Name */}
            <CCol md={6}>
              <div className="form-group-modal">
                <CFormLabel className="form-label-modal required">
                  <CIcon icon={cilBriefcase} className="me-2" />
                  Brand Name
                </CFormLabel>
                <CFormInput
                  type="text"
                  value={formData.brand_name}
                  onChange={(e) => handleInputChange('brand_name', e.target.value)}
                  className={`form-input-modal ${errors.brand_name ? 'is-invalid' : ''}`}
                  placeholder="Enter brand name"
                  disabled={isSubmitting}
                />
                {errors.brand_name && (
                  <div className="invalid-feedback">{errors.brand_name}</div>
                )}
              </div>
            </CCol>



            {/* Category */}
            <CCol md={6}>
              <div className="form-group-modal">
                <CFormLabel className="form-label-modal required">
                  <CIcon icon={cilDescription} className="me-2" />
                  Category
                </CFormLabel>
                <CFormSelect
                  value={formData.category_type}
                  onChange={(e) => handleInputChange('category_type', e.target.value)}
                  className={`form-input-modal ${errors.category_type ? 'is-invalid' : ''}`}
                  disabled={isSubmitting}
                >
                  <option value="">Select category</option>
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>
                      {getCategoryLabel(category as CategoryType)}
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
              <div className="form-group-modal">
                <CFormLabel className="form-label-modal required">
                  <CIcon icon={cilSettings} className="me-2" />
                  Subscription Plan
                </CFormLabel>
                <CFormSelect
                  value={formData.subscription_plan}
                  onChange={(e) => handleInputChange('subscription_plan', e.target.value)}
                  className={`form-input-modal ${errors.subscription_plan ? 'is-invalid' : ''}`}
                  disabled={isSubmitting}
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

            {/* Status */}
            <CCol md={6}>
              <div className="form-group-modal">
                <CFormLabel className="form-label-modal">
                  <CIcon icon={cilSettings} className="me-2" />
                  Status
                </CFormLabel>
                <CFormSelect
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as 'active' | 'pending' | 'rejected')}
                  className="form-input-modal"
                  disabled={isSubmitting}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </CFormSelect>
              </div>
            </CCol>

            {/* Business Documents */}
            <CCol md={6}>
              <div className="form-group-modal">
                <CFormLabel className="form-label-modal">
                  <CIcon icon={cilCloudUpload} className="me-2" />
                  Business Documents
                </CFormLabel>
                <CInputGroup>
                  <CFormInput
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="form-input-modal"
                    disabled={isSubmitting}
                  />
                  <CInputGroupText>
                    <CTooltip content="Upload PDF or image files (max 5MB)">
                      <CIcon icon={cilDescription} />
                    </CTooltip>
                  </CInputGroupText>
                </CInputGroup>
                {businessDocsFile && (
                  <div className="file-preview-modal">
                    <CIcon icon={cilDescription} className="me-2" />
                    {businessDocsFile.name}
                    <CBadge color="success" className="ms-2">Ready</CBadge>
                  </div>
                )}
              </div>
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>

      <CModalFooter className="modal-footer-custom">
        <CButton
          color="secondary"
          variant="outline"
          onClick={handleClose}
          disabled={isSubmitting}
          className="modal-button secondary"
        >
          <CIcon icon={cilX} className="me-2" />
          Cancel
        </CButton>
        <CButton
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="modal-button primary"
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
      </CModalFooter>
    </CModal>
  );
};

export default EditBrandModal; 