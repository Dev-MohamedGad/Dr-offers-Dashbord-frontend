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
  CFormTextarea,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import {
  cilSave,
  cilX,
  cilTag,
  cilDollar,
  cilCloudUpload,
  cilCheckCircle,
  cilWarning,
} from '@coreui/icons';
import { Offer, UpdateOfferDto, OfferStatus } from '../../types/offer.type';
import { useUpdateOfferMutation } from '../../redux/slices/offersSlice/offersApiSlice';
import { useUpdateUserImageMutation } from '../../redux/slices/usersSlice/usersApiSlice';
import Swal from 'sweetalert2';
import './EditOfferModal.css';

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

interface EditOfferModalProps {
  visible: boolean;
  onClose: () => void;
  offer: Offer;
  onSuccess: () => void;
}

interface FormData extends UpdateOfferDto {
  title: string;
  price_before: string;
  image: string;
  discount_rate: string;
  category_type: string;
  status: OfferStatus;
}

interface FormErrors {
  title?: string;
  price_before?: string;
  image?: string;
  discount_rate?: string;
  category_type?: string;
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

const statusOptions = [
  { value: OfferStatus.ACTIVE, label: 'Active', color: 'success' },
  { value: OfferStatus.PENDING, label: 'Pending', color: 'warning' },
  { value: OfferStatus.INACTIVE, label: 'Inactive', color: 'secondary' },
  { value: OfferStatus.EXPIRED, label: 'Expired', color: 'danger' }
];

const EditOfferModal: React.FC<EditOfferModalProps> = ({ 
  visible, 
  onClose, 
  offer, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    price_before: '',
    image: '',
    discount_rate: '',
    category_type: '',
    status: OfferStatus.PENDING,
  });
  
  const [originalData, setOriginalData] = useState<FormData>({
    title: '',
    price_before: '',
    image: '',
    discount_rate: '',
    category_type: '',
    status: OfferStatus.PENDING,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Redux mutations
  const [updateOffer] = useUpdateOfferMutation();
  const [updateUserImage] = useUpdateUserImageMutation();

  // Initialize form data when offer prop changes
  useEffect(() => {
    if (offer && visible) {
      const initialData = {
        title: offer.title || '',
        price_before: offer.price_before?.toString() || '',
        image: offer.image || '',
        discount_rate: offer.discount_rate?.toString() || '',
        category_type: offer.category_type || '',
        status: offer.status || OfferStatus.PENDING,
      };
      
      setFormData(initialData);
      setOriginalData(initialData); // Store original data for comparison
      setErrors({});
      setShowSuccess(false);
      setImageFile(null);
    }
  }, [offer, visible]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be at most 100 characters';
    }

    if (!formData.price_before.trim()) {
      newErrors.price_before = 'Price is required';
    } else if (isNaN(Number(formData.price_before)) || Number(formData.price_before) <= 0) {
      newErrors.price_before = 'Price must be a valid positive number';
    }

    if (!formData.discount_rate.trim()) {
      newErrors.discount_rate = 'Discount rate is required';
    } else if (isNaN(Number(formData.discount_rate)) || Number(formData.discount_rate) < 0 || Number(formData.discount_rate) > 100) {
      newErrors.discount_rate = 'Discount rate must be between 0 and 100';
    }

    if (!formData.category_type) {
      newErrors.category_type = 'Category is required';
    }

    if (!formData.image.trim() && !imageFile) {
      newErrors.image = 'Image is required';
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
      return;
    }

    setImageFile(file);
    setUploadingImage(true);
    setErrors(prev => ({ ...prev, image: undefined }));

    try {
      // Upload the image and get the URL
      const signedUrlResponse = await updateUserImage({
        original_name: file.name,
        size: file.size,
        mime_type: file.type,
      }).unwrap();

      const signedUrl = signedUrlResponse.data;

      // Upload file to S3 using signed URL
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }

      // Get public URL (remove query parameters)
      const publicUrl = uploadResponse.url.split('?')[0];
      
      // Update form with the new image URL
      setFormData(prev => ({ ...prev, image: publicUrl }));

    } catch (error: any) {
      console.error('Error uploading image:', error);
      setErrors(prev => ({ ...prev, image: 'Failed to upload image. Please try again.' }));
      setImageFile(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const getChangedFields = (): Partial<UpdateOfferDto> => {
    const changedFields: Partial<UpdateOfferDto> = {};
    
    if (formData.title !== originalData.title) {
      changedFields.title = formData.title;
    }
    if (formData.price_before !== originalData.price_before) {
      changedFields.price_before = formData.price_before;
    }
    if (formData.discount_rate !== originalData.discount_rate) {
      changedFields.discount_rate = formData.discount_rate;
    }
    if (formData.category_type !== originalData.category_type) {
      changedFields.category_type = formData.category_type;
    }
    if (formData.status !== originalData.status) {
      changedFields.status = formData.status;
    }
    if (formData.image !== originalData.image) {
      changedFields.image = formData.image;
    }
    
    return changedFields;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Get only the fields that have changed
      const updateData = getChangedFields();
      
      // If no fields have changed, just close the modal
      if (Object.keys(updateData).length === 0) {
        setErrors({ general: 'No changes detected' });
        setIsSubmitting(false);
        return;
      }

      // Call the update API
      await updateOffer({ id: offer.id, body: updateData }).unwrap();

      setShowSuccess(true);
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Offer Updated!',
        text: 'Your offer has been updated successfully',
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        onSuccess();
      }, 1500);

    } catch (error: any) {
      console.error('Failed to update offer:', error);
      
      let errorMessage = 'Failed to update offer. Please try again.';
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setErrors({});
      setShowSuccess(false);
      setImageFile(null);
      onClose();
    }
  };

  const hasChanges = () => {
    return Object.keys(getChangedFields()).length > 0 || imageFile !== null;
  };

  // Calculate discounted price
  const getDiscountedPrice = () => {
    if (formData.price_before && formData.discount_rate) {
      const price = parseFloat(formData.price_before);
      const discount = parseFloat(formData.discount_rate);
      if (!isNaN(price) && !isNaN(discount)) {
        return (price * (1 - discount / 100)).toFixed(2);
      }
    }
    return '0.00';
  };

  return (
    <CModal
      visible={visible}
      onClose={handleClose}
      size="lg"
      alignment="center"
      backdrop="static"
      keyboard={!isSubmitting}
      className="edit-offer-modal"
    >
      <CModalHeader>
        <CModalTitle className="d-flex align-items-center">
          <CIcon icon={cilTag} className="me-2" style={{ color: '#B44C43' }} />
          Edit Offer
        </CModalTitle>
      </CModalHeader>

      <CModalBody>
        {/* Success Alert */}
        {showSuccess && (
          <CAlert color="success" className="d-flex align-items-center mb-3">
            <CIcon icon={cilCheckCircle} className="me-2" />
            Offer updated successfully!
          </CAlert>
        )}

        {/* Error Alert */}
        {errors.general && (
          <CAlert color="danger" className="d-flex align-items-center mb-3">
            <CIcon icon={cilWarning} className="me-2" />
            {errors.general}
          </CAlert>
        )}

        <CForm onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <h6 className="text-primary mb-3">Basic Information</h6>
          
          <CRow className="mb-3">
            <CCol md={8}>
              <CFormLabel htmlFor="title" className="fw-semibold">
                Offer Title <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                invalid={!!errors.title}
                disabled={isSubmitting}
                placeholder="Enter offer title..."
              />
              {errors.title && (
                <div className="invalid-feedback d-block">{errors.title}</div>
              )}
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="status" className="fw-semibold">
                Status <span className="text-danger">*</span>
              </CFormLabel>
              <CFormSelect
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                disabled={isSubmitting}
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>

          {/* Pricing Information Section */}
          <h6 className="text-primary mb-3 mt-4">Pricing Information</h6>
          
          <CRow className="mb-3">
            <CCol md={4}>
              <CFormLabel htmlFor="price_before" className="fw-semibold">
                Original Price <span className="text-danger">*</span>
              </CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilDollar} />
                </CInputGroupText>
                <CFormInput
                  id="price_before"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price_before}
                  onChange={(e) => handleInputChange('price_before', e.target.value)}
                  invalid={!!errors.price_before}
                  disabled={isSubmitting}
                  placeholder="0.00"
                />
              </CInputGroup>
              {errors.price_before && (
                <div className="invalid-feedback d-block">{errors.price_before}</div>
              )}
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="discount_rate" className="fw-semibold">
                Discount Rate <span className="text-danger">*</span>
              </CFormLabel>
              <CInputGroup>
                <CFormInput
                  id="discount_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.discount_rate}
                  onChange={(e) => handleInputChange('discount_rate', e.target.value)}
                  invalid={!!errors.discount_rate}
                  disabled={isSubmitting}
                  placeholder="0"
                />
                <CInputGroupText>
                  %
                </CInputGroupText>
              </CInputGroup>
              {errors.discount_rate && (
                <div className="invalid-feedback d-block">{errors.discount_rate}</div>
              )}
            </CCol>
            <CCol md={4}>
              <CFormLabel className="fw-semibold">
                Final Price
              </CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilDollar} />
                </CInputGroupText>
                <CFormInput
                  value={getDiscountedPrice()}
                  disabled
                  className="bg-light"
                />
              </CInputGroup>
              <small className="text-muted">Calculated automatically</small>
            </CCol>
          </CRow>

          {/* Category Section */}
          <h6 className="text-primary mb-3 mt-4">Category</h6>
          
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="category_type" className="fw-semibold">
                Category <span className="text-danger">*</span>
              </CFormLabel>
              <CFormSelect
                id="category_type"
                value={formData.category_type}
                onChange={(e) => handleInputChange('category_type', e.target.value)}
                invalid={!!errors.category_type}
                disabled={isSubmitting}
              >
                <option value="">Select Category</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {getCategoryLabel(category)}
                  </option>
                ))}
              </CFormSelect>
              {errors.category_type && (
                <div className="invalid-feedback d-block">{errors.category_type}</div>
              )}
            </CCol>
          </CRow>

          {/* Image Section */}
          <h6 className="text-primary mb-3 mt-4">Image</h6>
          
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="image" className="fw-semibold">
                Image URL <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                invalid={!!errors.image}
                disabled={isSubmitting}
                placeholder="https://example.com/image.jpg"
              />
              {errors.image && (
                <div className="invalid-feedback d-block">{errors.image}</div>
              )}
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="imageFile" className="fw-semibold">
                Or Upload New Image
              </CFormLabel>
              <CFormInput
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isSubmitting || uploadingImage}
              />
              {uploadingImage && (
                <div className="mt-2">
                  <CSpinner size="sm" className="me-2" />
                  <small className="text-muted">Uploading...</small>
                </div>
              )}
              {imageFile && !uploadingImage && (
                <div className="mt-2">
                  <CBadge color="info">
                    <CIcon icon={cilCloudUpload} className="me-1" />
                    {imageFile.name}
                  </CBadge>
                </div>
              )}
              <small className="text-muted d-block mt-1">PNG, JPG up to 5MB</small>
            </CCol>
          </CRow>

          {/* Image Preview */}
          {formData.image && (
            <CRow className="mb-3">
              <CCol>
                <CFormLabel className="fw-semibold">Image Preview</CFormLabel>
                <div className="border rounded p-3 text-center bg-light">
                  <img
                    src={formData.image}
                    alt="Offer Preview"
                    className="img-thumbnail"
                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/src/assets/no-data-found.svg';
                    }}
                  />
                </div>
              </CCol>
            </CRow>
          )}
        </CForm>
      </CModalBody>

      <CModalFooter className="border-top">
        <div className="d-flex justify-content-between w-100 align-items-center">
          <div>
            {hasChanges() && (
              <small className="text-muted">
                <CIcon icon={cilWarning} className="me-1" />
                You have unsaved changes
              </small>
            )}
          </div>
          <div className="d-flex gap-2">
            <CButton
              color="secondary"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <CIcon icon={cilX} className="me-2" />
              Cancel
            </CButton>
            <CButton
              style={{ 
                backgroundColor: '#B44C43', 
                borderColor: '#B44C43',
                color: 'white'
              }}
              onClick={handleSubmit}
              disabled={isSubmitting || !hasChanges() || uploadingImage}
            >
              {isSubmitting ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Updating...
                </>
              ) : (
                <>
                  <CIcon icon={cilSave} className="me-2" />
                  Update Offer
                </>
              )}
            </CButton>
          </div>
        </div>
      </CModalFooter>
    </CModal>
  );
};

export default EditOfferModal; 