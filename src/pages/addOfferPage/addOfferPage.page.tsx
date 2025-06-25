import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CFormSelect,
  CRow,
  CSpinner,
  CAlert,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilSave, cilCloudUpload } from '@coreui/icons';
import Swal from 'sweetalert2';

const AddOfferPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceBefore: '',
    discountRate: '',
    category: '',
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Categories list
  const categories = [
    'Electronics',
    'Food & Beverages', 
    'Fashion',
    'Health & Fitness',
    'Beauty & Wellness',
    'Restaurant',
    'Travel',
    'Entertainment',
    'Home & Garden',
    'Sports',
    'Books & Education',
    'Automotive',
    'Services',
    'Others'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire('Error', 'Please select a valid image file', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire('Error', 'Image size should be less than 5MB', 'error');
      return;
    }

    setUploading(true);
    
    try {
      // Create preview
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      setFormData(prev => ({ ...prev, image: file }));
      
      Swal.fire({
        icon: 'success',
        title: 'Image selected!',
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire('Error', 'Failed to process image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.priceBefore) newErrors.priceBefore = 'Price before is required';
    if (!formData.discountRate) newErrors.discountRate = 'Discount rate is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.image) newErrors.image = 'Image is required';

    // Validate price
    if (formData.priceBefore && isNaN(Number(formData.priceBefore))) {
      newErrors.priceBefore = 'Please enter a valid price';
    }

    // Validate discount rate
    if (formData.discountRate) {
      const rate = Number(formData.discountRate);
      if (isNaN(rate) || rate < 0 || rate > 100) {
        newErrors.discountRate = 'Discount rate must be between 0 and 100';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDiscountedPrice = () => {
    const original = parseFloat(formData.priceBefore);
    const discount = parseFloat(formData.discountRate);
    
    if (!original || !discount) return 0;
    
    return original - (original * discount / 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message and redirect
      Swal.fire({
        icon: 'success',
        title: 'Offer Created!',
        text: 'Your offer has been created successfully',
        confirmButtonText: 'Go to Offers'
      }).then(() => {
        navigate('/offers');
      });
    } catch (error) {
      Swal.fire('Error', 'Failed to create offer. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        
        <h2 style={{ color: '#B44C43', fontWeight: 'bold' }}>Add Offer</h2>
      </div>

      <CForm onSubmit={handleSubmit}>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardBody>
                <CRow>
                  {/* Title */}
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="title">Title</CFormLabel>
                      <CFormInput
                        id="title"
                        placeholder="Offer title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        invalid={!!errors.title}
                      />
                      {errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
                    </div>
                  </CCol>

                  {/* Description */}
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="description">Description</CFormLabel>
                      <CFormTextarea
                        id="description"
                        rows={3}
                        placeholder="Offer description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        invalid={!!errors.description}
                      />
                      {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
                    </div>
                  </CCol>
                </CRow>

                <CRow>
                  {/* Price Before */}
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="priceBefore">Price Before</CFormLabel>
                      <CFormInput
                        id="priceBefore"
                        type="number"
                        placeholder="760 SAR"
                        value={formData.priceBefore}
                        onChange={(e) => handleInputChange('priceBefore', e.target.value)}
                        invalid={!!errors.priceBefore}
                      />
                      {errors.priceBefore && <div className="invalid-feedback d-block">{errors.priceBefore}</div>}
                    </div>
                  </CCol>

                  {/* Discount Rate */}
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="discountRate">Discount Rate</CFormLabel>
                      <CFormInput
                        id="discountRate"
                        type="number"
                        placeholder="30%"
                        value={formData.discountRate}
                        onChange={(e) => handleInputChange('discountRate', e.target.value)}
                        invalid={!!errors.discountRate}
                      />
                      {errors.discountRate && <div className="invalid-feedback d-block">{errors.discountRate}</div>}
                    </div>
                  </CCol>
                </CRow>

                <CRow>
                  {/* Category */}
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="category">Category</CFormLabel>
                      <CFormSelect
                        id="category"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        invalid={!!errors.category}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </CFormSelect>
                      {errors.category && <div className="invalid-feedback d-block">{errors.category}</div>}
                    </div>
                  </CCol>

                  {/* Price After Discount (calculated) */}
                  <CCol md={6}>
                    {formData.priceBefore && formData.discountRate && (
                      <div className="mb-3">
                        <CFormLabel>Price After Discount</CFormLabel>
                        <CFormInput
                          value={`${calculateDiscountedPrice().toFixed(2)} SAR`}
                          disabled
                          className="bg-light fw-bold text-success"
                        />
                      </div>
                    )}
                  </CCol>
                </CRow>

                {/* Image Upload - Full Width */}
                <CRow>
                  <CCol xs={12}>
                    <div className="mb-4">
                      <CFormLabel htmlFor="image">Image</CFormLabel>
                      <div 
                        className="border-2 border-dashed p-5 text-center"
                        style={{ 
                          borderColor: errors.image ? '#dc3545' : '#dee2e6',
                          borderRadius: '12px',
                          backgroundColor: '#f8f9fa',
                          minHeight: '300px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {imagePreview ? (
                          <div>
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{
                                maxWidth: '300px',
                                maxHeight: '200px',
                                borderRadius: '8px',
                                marginBottom: '1rem'
                              }}
                            />
                            <div>
                              <CButton
                                color="danger"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setImagePreview('');
                                  setFormData(prev => ({ ...prev, image: null }));
                                }}
                              >
                                Remove Image
                              </CButton>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <CIcon icon={cilCloudUpload} size="xxl" className="mb-3 text-muted" />
                            <div>
                              <input
                                type="file"
                                id="image-upload"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                              />
                              <CButton
                                color="primary"
                                size="lg"
                                onClick={() => document.getElementById('image-upload')?.click()}
                                disabled={uploading}
                                style={{ 
                                  backgroundColor: '#B44C43', 
                                  borderColor: '#B44C43',
                                  padding: '12px 30px'
                                }}
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
                            </div>
                            <p className="text-muted mt-3 mb-0">
                              Drag and drop an image here, or click to select<br/>
                              <small>PNG, JPG up to 5MB</small>
                            </p>
                          </div>
                        )}
                      </div>
                      {errors.image && <div className="text-danger small mt-2">{errors.image}</div>}
                    </div>
                  </CCol>
                </CRow>

                {/* Submit Buttons */}
                <CRow>
                  <CCol xs={12}>
                    <div className="d-flex gap-3 justify-content-center mt-4">
                      <CButton 
                        color="secondary" 
                        variant="outline"
                        size="lg"
                        onClick={() => navigate('/offers')}
                        disabled={isSubmitting}
                        style={{ minWidth: '150px' }}
                      >
                        Cancel
                      </CButton>
                      <CButton 
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        style={{ 
                          backgroundColor: '#B44C43', 
                          borderColor: '#B44C43',
                          minWidth: '150px'
                        }}
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
                    </div>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CForm>
    </CContainer>
  );
};

export default AddOfferPage; 