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
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import {
  cilSave,
  cilX,
  cilDescription,
  cilTag,
  cilDollar,
  cilCalculator,
  cilCloudUpload,
  cilCheckCircle,
  cilWarning,
  cilDrop,
  cilCamera,
  cilLink,
} from '@coreui/icons';
import { Formik, Field, Form } from 'formik';
import { CreateOfferSchema } from '@utils/ValidationSchema';
import { useCreateOfferMutation } from '../../redux/slices/offersSlice/offersApiSlice';
import { useGetAllBrandsQuery } from '../../redux/slices/brandsSlice/brandsApiSlice';
import { useUpdateUserImageMutation } from '../../redux/slices/usersSlice/usersApiSlice';
import { CreateOfferDto } from '../../types/offer.type';
import TextError from '@components/Forms/TextError';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import './EditOfferModal.css';
import './AddOfferModal.css';

interface AddOfferModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData extends CreateOfferDto {
  title: string;
  price_before: string;
  image: string;
  discount_rate: string;
  category_type: string;
  brand_id?: number;
}

interface FormErrors {
  title?: string;
  price_before?: string;
  image?: string;
  discount_rate?: string;
  category_type?: string;
  brand_id?: string;
  general?: string;
}

const categoryOptions = [
  { value: 'groceries', label: 'Groceries' },
  { value: 'premium_fruits', label: 'Premium Fruits' },
  { value: 'home_kitchen', label: 'Home & Kitchen' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'home_improvement', label: 'Home Improvement' },
  { value: 'sports_toys_luggage', label: 'Sports & Toys' },
];

const AddOfferModal: React.FC<AddOfferModalProps> = ({ 
  visible, 
  onClose, 
  onSuccess 
}) => {
  const [createOffer] = useCreateOfferMutation();
  const [updateUserImage] = useUpdateUserImageMutation();
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

  // Get token from Redux store
  const token = useSelector((state: any) => state.auth.accessToken);

  // Fetch brands for dropdown
  const { 
    data: brandsResponse, 
    isLoading: brandsLoading, 
    isError: brandsError 
  } = useGetAllBrandsQuery({status: 'active'});

  const initialValues: FormData = {
    title: '',
    price_before: '',
    image: '',
    discount_rate: '',
    category_type: '',
    brand_id: undefined,
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!visible) {
      setErrors({});
      setShowSuccess(false);
      setImagePreview('');
      setUploadedImageUrl('');
    }
  }, [visible]);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, general: 'Please select a valid image file' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, general: 'Image size should be less than 5MB' }));
      return;
    }

    setUploading(true);
    setErrors({}); // Clear any previous errors
    
    try {
      // Step 1: Get signed URL from users endpoint (like in user form)
      const signedUrlResponse = await updateUserImage({
        original_name: file.name,
        size: file.size,
        mime_type: file.type,
      }).unwrap();

      const signedUrl = signedUrlResponse.data;

      // Step 2: Upload file to S3 using signed URL
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }

      // Step 3: Get public URL (remove query parameters)
      const publicUrl = uploadResponse.url.split('?')[0];
      
      // Update form field and preview
      setFieldValue('image', publicUrl);
      setUploadedImageUrl(publicUrl);
      setImagePreview(publicUrl);

      Swal.fire({
        icon: 'success',
        title: 'Image uploaded successfully!',
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (error: any) {
      console.error('Error uploading image:', error);
      setErrors(prev => ({ ...prev, general: error.message || 'Failed to upload image. Please try again.' }));
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: FormData) => {
    setErrors({}); // Clear any previous errors
    
    // Debug: Log the form values being submitted
    console.log('Submitting offer with values:', values);
    console.log('Brand ID being sent:', values.brand_id);
    console.log('Image URL:', uploadedImageUrl || values.image);
    
    try {
      // Use uploaded image URL if available, otherwise use the form value
      const finalImageUrl = uploadedImageUrl || values.image;
      
      const offerData = {
        title: values.title,
        price_before: values.price_before,
        image: finalImageUrl,
        discount_rate: values.discount_rate,
        category_type: values.category_type,
        brand_id: values.brand_id,
      };
      
      console.log('Final offer data to API:', offerData);
      
      await createOffer(offerData).unwrap();

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        onSuccess();
      }, 2000);

      Swal.fire({
        icon: 'success',
        title: 'Offer Created!',
        text: 'Your offer has been created successfully',
        timer: 2000,
        showConfirmButton: false,
      });

    } catch (err: any) {
      console.error('Error creating offer:', err);
      const errorMsg = err?.data?.message || err?.message || 'Failed to create offer. Please try again.';
      setErrors(prev => ({ ...prev, general: errorMsg }));
    }
  };

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      size="lg"
      className="edit-brand-modal"
      backdrop="static"
      keyboard={false}
    >
      <CModalHeader className="modal-header-custom">
        <CModalTitle className="modal-title-custom">
          <CIcon icon={cilTag} className="me-2" />
          Add New Offer
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="modal-body-custom">
        {/* Success Alert */}
        {showSuccess && (
          <CAlert color="success" className="success-alert">
            <CIcon icon={cilCheckCircle} className="me-2" />
            Offer created successfully!
          </CAlert>
        )}

        {/* Error Alert */}
        {errors.general && (
          <CAlert color="danger" className="error-alert">
            <CIcon icon={cilWarning} className="me-2" />
            {errors.general}
          </CAlert>
        )}

        <Formik
          validationSchema={CreateOfferSchema}
          initialValues={initialValues}
          onSubmit={onSubmit}
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({ errors: formikErrors, touched, values, setFieldValue, isSubmitting }) => (
            <Form>
              {/* Offer Image Upload Section - User Form Style */}
              <div className="mb-4">
                <h6 className="text-primary mb-3">Offer Image</h6>
                <div className="image-upload-section">
                  <CRow>
                    <CCol md={6}>
                      <div className="upload-container p-4 border rounded text-center">
                        {imagePreview ? (
                          <div className="image-preview-container">
                            <img
                              src={imagePreview}
                              alt="Offer Preview"
                              className="img-thumbnail mb-3"
                              style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                            />
                            <div>
                              <CButton
                                color="secondary"
                                size="sm"
                                onClick={() => {
                                  setImagePreview('');
                                  setUploadedImageUrl('');
                                  setFieldValue('image', '');
                                }}
                              >
                                Remove Image
                              </CButton>
                            </div>
                          </div>
                        ) : (
                          <div className="upload-placeholder">
                            <CIcon icon={cilCamera} size="xxl" className="mb-3 text-muted" />
                            <p className="text-muted mb-3">No image selected</p>
                          </div>
                        )}
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <div className="upload-controls">
                        <div className="mb-3">
                          <input
                            type="file"
                            id="offer-image"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, setFieldValue)}
                            style={{ display: 'none' }}
                          />
                          <CButton
                            color="primary"
                            onClick={() => document.getElementById('offer-image')?.click()}
                            disabled={uploading}
                            className="w-100 mb-2"
                          >
                            {uploading ? (
                              <>
                                <CSpinner size="sm" className="me-2" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <CIcon icon={cilCloudUpload} className="me-2" />
                                Upload Image
                              </>
                            )}
                          </CButton>
                          <small className="text-muted d-block">
                            PNG, JPG up to 5MB
                          </small>
                        </div>
                        
                        <div>
                          <CFormLabel>Or enter image URL manually:</CFormLabel>
                          <CInputGroup>
                            <CInputGroupText>
                              <CIcon icon={cilLink} />
                            </CInputGroupText>
                            <Field
                              name="image"
                              as={CFormInput}
                              placeholder="https://example.com/image.jpg"
                              value={values.image}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFieldValue('image', e.target.value);
                                if (e.target.value && e.target.value !== '') {
                                  setImagePreview(e.target.value);
                                }
                              }}
                            />
                          </CInputGroup>
                          {formikErrors.image && touched.image ? <TextError name="image" /> : null}
                        </div>
                      </div>
                    </CCol>
                  </CRow>
                </div>
              </div>

              {/* Basic Information */}
              <h6 className="text-primary mb-3">Basic Information</h6>
              
              <CRow>
                <CCol md={12}>
                  <div className="form-group-modal">
                    <CFormLabel className="form-label-modal required">
                      <CIcon icon={cilDescription} className="me-2" />
                      Offer Title
                    </CFormLabel>
                    <Field
                      name="title"
                      as={CFormInput}
                      placeholder="Enter offer title..."
                      value={values.title}
                      className={`form-input-modal ${formikErrors.title && touched.title ? 'is-invalid' : ''}`}
                      disabled={isSubmitting}
                    />
                    {formikErrors.title && touched.title ? <TextError name="title" /> : null}
                  </div>
                </CCol>
              </CRow>

              {/* Pricing Information */}
              <h6 className="text-primary mb-3 mt-4">Pricing Information</h6>
              
              <CRow>
                <CCol md={6}>
                  <div className="form-group-modal">
                    <CFormLabel className="form-label-modal required">
                      <CIcon icon={cilDollar} className="me-2" />
                      Original Price ($)
                    </CFormLabel>
                    <CInputGroup>
                      <CInputGroupText>$</CInputGroupText>
                      <Field
                        name="price_before"
                        as={CFormInput}
                        placeholder="0.00"
                        value={values.price_before}
                        className={`form-input-modal ${formikErrors.price_before && touched.price_before ? 'is-invalid' : ''}`}
                        disabled={isSubmitting}
                        type="number"
                        step="0.01"
                        min="0"
                      />
                    </CInputGroup>
                    {formikErrors.price_before && touched.price_before ? <TextError name="price_before" /> : null}
                  </div>
                </CCol>

                <CCol md={6}>
                  <div className="form-group-modal">
                    <CFormLabel className="form-label-modal required">
                      <CIcon icon={cilCalculator} className="me-2" />
                      Discount Rate (%)
                    </CFormLabel>
                    <CInputGroup>
                      <Field
                        name="discount_rate"
                        as={CFormInput}
                        placeholder="0"
                        value={values.discount_rate}
                        className={`form-input-modal ${formikErrors.discount_rate && touched.discount_rate ? 'is-invalid' : ''}`}
                        disabled={isSubmitting}
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                      />
                      <CInputGroupText>%</CInputGroupText>
                    </CInputGroup>
                                          {formikErrors.discount_rate && touched.discount_rate ? <TextError name="discount_rate" /> : null}
                      {/* Show calculated final price */}
                      {values.price_before && values.discount_rate && (
                        <small className="text-muted mt-1 d-block">
                          Final price: ${(parseFloat(values.price_before) * (1 - parseFloat(values.discount_rate) / 100)).toFixed(2)}
                        </small>
                      )}
                  </div>
                </CCol>
              </CRow>

              {/* Category and Brand */}
              <h6 className="text-primary mb-3 mt-4">Category & Brand</h6>
              
              <CRow>
                <CCol md={6}>
                  <div className="form-group-modal">
                    <CFormLabel className="form-label-modal required">
                      <CIcon icon={cilDrop} className="me-2" />
                      Category
                    </CFormLabel>
                    <Field
                      name="category_type"
                      as={CFormSelect}
                      value={values.category_type}
                      className={`form-input-modal ${formikErrors.category_type && touched.category_type ? 'is-invalid' : ''}`}
                      disabled={isSubmitting}
                    >
                      <option value="">Select category</option>
                      {categoryOptions.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </Field>
                    {formikErrors.category_type && touched.category_type ? <TextError name="category_type" /> : null}
                  </div>
                </CCol>

                <CCol md={6}>
                  <div className="form-group-modal">
                    <CFormLabel className="form-label-modal">
                      <CIcon icon={cilDescription} className="me-2" />
                      Brand (Optional)
                    </CFormLabel>
                    <Field
                      name="brand_id"
                      as={CFormSelect}
                      value={values.brand_id || ''}
                      className={`form-input-modal ${formikErrors.brand_id && touched.brand_id ? 'is-invalid' : ''}`}
                      disabled={isSubmitting || brandsLoading}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const value = e.target.value;
                        setFieldValue('brand_id', value ? parseInt(value, 10) : undefined);
                        console.log('Selected brand ID:', value ? parseInt(value, 10) : undefined);
                      }}
                    >
                      <option value="">Select brand</option>
                      {brandsResponse?.data?.data && brandsResponse.data.data.length > 0 ? (
                        brandsResponse.data.data.map((brand: any) => (
                          <option key={brand.id} value={brand.id}>
                            {brand.brand_name} - {brand.category_type}
                          </option>
                        ))
                      ) : (
                        !brandsLoading && (
                          <option disabled>No brands available</option>
                        )
                      )}
                    </Field>
                    {brandsLoading && (
                      <small className="text-muted">Loading brands...</small>
                    )}
                    {brandsError && (
                      <small className="text-danger">Failed to load brands. Please try again.</small>
                    )}
                    {!brandsLoading && !brandsError && brandsResponse?.data?.data?.length === 0 && (
                      <small className="text-warning">No active brands found</small>
                    )}
                    {formikErrors.brand_id && touched.brand_id ? <TextError name="brand_id" /> : null}
                  </div>
                </CCol>
              </CRow>

              <CModalFooter className="modal-footer-custom">
                <CButton
                  color="secondary"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="modal-button"
                >
                  <CIcon icon={cilX} className="me-2" />
                  Cancel
                </CButton>
                <CButton
                  type="submit"
                  color="primary"
                  disabled={isSubmitting || uploading}
                  className="modal-button"
                  style={{ backgroundColor: '#B44C43', borderColor: '#B44C43' }}
                >
                  {isSubmitting ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilSave} className="me-2" />
                      Create Offer
                    </>
                  )}
                </CButton>
              </CModalFooter>
            </Form>
          )}
        </Formik>
      </CModalBody>
    </CModal>
  );
};

export default AddOfferModal; 