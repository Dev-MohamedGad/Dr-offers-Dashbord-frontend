import TextError from '@components/Forms/TextError';
import {
  cilUser, 
  cilLockLocked, 
  cilEnvelopeLetter, 
  cilPhone,
  cilLocationPin,
  cilGlobeAlt,
  cilLink,
  cilCamera,
  cilCloudUpload,
  cilWarning,
  cilCheckCircle
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormCheck,
  CFormSelect,
  CFormLabel,
  CRow,
  CCol,
  CSpinner,
  CAlert,
} from '@coreui/react-pro';
import { useUpdateUserApiSliceMutation, useUpdateUserImageMutation } from '@redux/slices/usersSlice/usersApiSlice';
import { EditUserSchema } from '@utils/ValidationSchema';
import { CreateUserSchema } from '@utils/ValidationSchema';
import { Formik, Field, Form } from 'formik';
import { ActionsModalStateType } from 'types';
import Swal from 'sweetalert2';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './editAndCreatUserForm.css';

const EditAndCreateUserForm = ({
  visible,
  setVisible,
  modalTitle,
  modalType,
  selectedItem,
  action,
}: ActionsModalStateType) => {
  const [updateUserApiSlice] = useUpdateUserApiSliceMutation();
  const [updateUserImage] = useUpdateUserImageMutation();
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(selectedItem?.image_url || '');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const token = useSelector((state: any) => state.auth.accessToken);

  const initialValues = {
    email: selectedItem?.email || '',
    name: selectedItem?.name || '',
    password: selectedItem?.password || '',
    address: selectedItem?.address || '',
    facebook_url: selectedItem?.facebook_url || '',
    instagram_url: selectedItem?.instagram_url || '',
    linkedin_url: selectedItem?.linkedin_url || '',
    whatsapp_number: selectedItem?.whatsapp_number || '',
    phone_number: selectedItem?.phone_number || '',
    image_url: selectedItem?.image_url || 'https://example.com/image.jpg',
    role: selectedItem?.role || 'visitor',
  };

  type FormTypes = {
    email: string;
    name: string;
    password: string;
    address: string;
    facebook_url: string;
    instagram_url: string;
    linkedin_url: string;
    whatsapp_number: string;
    phone_number: string;
    image_url: string;
    role: string;
  };

  interface FormErrors {
    email?: string;
    name?: string;
    password?: string;
    address?: string;
    facebook_url?: string;
    instagram_url?: string;
    linkedin_url?: string;
    whatsapp_number?: string;
    phone_number?: string;
    image_url?: string;
    role?: string;
    general?: string;
  }

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
      // Step 1: Get signed URL from users endpoint
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
      setFieldValue('image_url', publicUrl);
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

  const onSubmit = async (values: FormTypes) => {
    const id = selectedItem?.id;
    setErrors({}); // Clear any previous errors
    
    if (modalType === 'create') {
      // Use uploaded image URL if available, otherwise use the form value
      const finalImageUrl = uploadedImageUrl || values.image_url;
      
      const body = {
        email: values.email,
        name: values.name,
        password: values.password,
        address: values.address,
        facebook_url: values.facebook_url,
        instagram_url: values.instagram_url,
        linkedin_url: values.linkedin_url,
        whatsapp_number: values.whatsapp_number,
        phone_number: values.phone_number,
        image_url: finalImageUrl,
        role: values.role,
      };
      try {
        if (!action) {
          throw new Error('Action is not defined');
        }
        await action(body).unwrap();
        setVisible?.(false);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
      } catch (err: any) {
        console.error('Error creating user:', err);
        const errorMsg = err?.data?.message || err?.message || 'Failed to create user. Please try again.';
        setErrors(prev => ({ ...prev, general: errorMsg }));
      }
    } else {
      const finalImageUrl = uploadedImageUrl || values.image_url;
      
      const body = {
        name: values.name || undefined,
        email: values.email || undefined,
        password: values.password || undefined,
        address: values.address || undefined,
        facebook_url: values.facebook_url || undefined,
        instagram_url: values.instagram_url || undefined,
        linkedin_url: values.linkedin_url || undefined,
        whatsapp_number: values.whatsapp_number || undefined,
        phone_number: values.phone_number || undefined,
        image_url: finalImageUrl !== selectedItem?.image_url ? finalImageUrl : undefined,
        role: values.role || undefined,
      };

      try {
        if (!id) {
          throw new Error('User ID is not defined');
        }
        await updateUserApiSlice({ id, body }).unwrap();
        setVisible?.(false);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
      } catch (err: any) {
        console.error('Error updating user:', err);
        const errorMsg = err?.data?.message || err?.message || 'Failed to update user. Please try again.';
        setErrors(prev => ({ ...prev, general: errorMsg }));
      }
    }
  };

  return (
    <CModal
      visible={visible}
      onClose={() => setVisible?.(false)}
      aria-labelledby="EditAndCreateUserForm"
      size="lg"
    >
      <CModalHeader>
        <CModalTitle id="EditAndCreateUserForm">{modalTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {/* Success Alert */}
        {showSuccess && (
          <CAlert color="success" className="mb-4">
            <CIcon icon={cilCheckCircle} className="me-2" />
            {modalType === 'create' ? 'User created successfully!' : 'User updated successfully!'}
          </CAlert>
        )}

        {/* Error Alert */}
        {errors.general && (
          <CAlert color="danger" className="mb-4">
            <CIcon icon={cilWarning} className="me-2" />
            {errors.general}
          </CAlert>
        )}
        
        <Formik
          validationSchema={
            modalType === 'create' ? CreateUserSchema : EditUserSchema
          }
          initialValues={initialValues}
          onSubmit={onSubmit}
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form>
              {/* Profile Image Upload Section */}
              <div className="mb-4">
                <h6 className="text-primary mb-3">Profile Image</h6>
                <div className="image-upload-section">
                  <CRow>
                    <CCol md={6}>
                      <div className="upload-container p-4 border rounded text-center">
                        {imagePreview ? (
                          <div className="image-preview-container">
                            <img
                              src={imagePreview}
                              alt="Profile Preview"
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
                                  setFieldValue('image_url', 'https://example.com/image.jpg');
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
                            id="profile-image"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, setFieldValue)}
                            style={{ display: 'none' }}
                          />
                          <CButton
                            color="primary"
                            onClick={() => document.getElementById('profile-image')?.click()}
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
                              name="image_url"
                              as={CFormInput}
                              placeholder="https://example.com/image.jpg"
                              value={values.image_url}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFieldValue('image_url', e.target.value);
                                if (e.target.value && e.target.value !== 'https://example.com/image.jpg') {
                                  setImagePreview(e.target.value);
                                }
                              }}
                            />
                          </CInputGroup>
                          {errors.image_url && touched.image_url ? <TextError name="image_url" /> : null}
                        </div>
                      </div>
                    </CCol>
                  </CRow>
                </div>
              </div>

              {/* Basic Information */}
              <h6 className="text-primary mb-3">Basic Information</h6>
              
              <CRow>
                <CCol md={6}>
                  <CInputGroup className="mb-3">
                    <CInputGroupText className="bg-white text-secondary">
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <Field
                      name="name"
                      as={CFormInput}
                      placeholder="Full Name"
                      autoComplete="name"
                      value={values.name}
                    />
                  </CInputGroup>
                  {errors.name && touched.name ? <TextError name="name" /> : null}
                </CCol>

                <CCol md={6}>
                  <CInputGroup className="mb-3">
                    <CInputGroupText className="bg-white text-secondary">
                      <CIcon icon={cilEnvelopeLetter} />
                    </CInputGroupText>
                    <Field
                      name="email"
                      as={CFormInput}
                      placeholder="Email Address"
                      autoComplete="email"
                      type="email"
                      value={values.email}
                    />
                  </CInputGroup>
                  {errors.email && touched.email ? <TextError name="email" /> : null}
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6}>
                  <CInputGroup className="mb-3">
                    <CInputGroupText className="bg-white text-secondary">
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <Field
                      name="password"
                      as={CFormInput}
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={values.password}
                    />
                  </CInputGroup>
                  {errors.password && touched.password ? <TextError name="password" /> : null}
                </CCol>

              
              </CRow>

              {/* Contact Information */}
              <h6 className="text-primary mb-3 mt-4">Contact Information</h6>
              
              <CInputGroup className="mb-3">
                <CInputGroupText className="bg-white text-secondary">
                  <CIcon icon={cilLocationPin} />
                </CInputGroupText>
                <Field
                  name="address"
                  as={CFormInput}
                  placeholder="Address (e.g., 123 Main St, City, Country)"
                  value={values.address}
                />
              </CInputGroup>
              {errors.address && touched.address ? <TextError name="address" /> : null}

              <CRow>
                <CCol md={6}>
                  <CInputGroup className="mb-3">
                    <CInputGroupText className="bg-white text-secondary">
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <Field
                      name="phone_number"
                      as={CFormInput}
                      placeholder="Phone Number (+1234567890)"
                      autoComplete="tel"
                      value={values.phone_number}
                    />
                  </CInputGroup>
                  {errors.phone_number && touched.phone_number ? <TextError name="phone_number" /> : null}
                </CCol>

                <CCol md={6}>
                  <CInputGroup className="mb-3">
                    <CInputGroupText className="bg-white text-secondary">
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <Field
                      name="whatsapp_number"
                      as={CFormInput}
                      placeholder="WhatsApp Number (+1234567890)"
                      value={values.whatsapp_number}
                    />
                  </CInputGroup>
                  {errors.whatsapp_number && touched.whatsapp_number ? <TextError name="whatsapp_number" /> : null}
                </CCol>
              </CRow>

              {/* Social Media */}
              <h6 className="text-primary mb-3 mt-4">Social Media Links</h6>
              
              <CInputGroup className="mb-3">
                <CInputGroupText className="bg-white text-secondary">
                  <CIcon icon={cilGlobeAlt} />
                </CInputGroupText>
                <Field
                  name="facebook_url"
                  as={CFormInput}
                  placeholder="Facebook URL (https://facebook.com/username)"
                  type="url"
                  value={values.facebook_url}
                />
              </CInputGroup>
              {errors.facebook_url && touched.facebook_url ? <TextError name="facebook_url" /> : null}

              <CInputGroup className="mb-3">
                <CInputGroupText className="bg-white text-secondary">
                  <CIcon icon={cilGlobeAlt} />
                </CInputGroupText>
                <Field
                  name="instagram_url"
                  as={CFormInput}
                  placeholder="Instagram URL (https://instagram.com/username)"
                  type="url"
                  value={values.instagram_url}
                />
              </CInputGroup>
              {errors.instagram_url && touched.instagram_url ? <TextError name="instagram_url" /> : null}

              <CInputGroup className="mb-3">
                <CInputGroupText className="bg-white text-secondary">
                  <CIcon icon={cilLink} />
                </CInputGroupText>
                <Field
                  name="linkedin_url"
                  as={CFormInput}
                  placeholder="LinkedIn URL (https://linkedin.com/in/username)"
                  type="url"
                  value={values.linkedin_url}
                />
              </CInputGroup>
              {errors.linkedin_url && touched.linkedin_url ? <TextError name="linkedin_url" /> : null}

              {/* Account Settings */}
              <h6 className="text-primary mb-3 mt-4">Account Settings</h6>
              
              <CRow>
                <CCol md={12}>
                  <CFormLabel>User Role</CFormLabel>
                  <Field
                    name="role"
                    as={CFormSelect}
                    value={values.role}
                    className="mb-3"
                  >
                    <option value="visitor">Visitor</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </Field>
                  {errors.role && touched.role ? <TextError name="role" /> : null}
                </CCol>
              </CRow>

              <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible?.(false)}>
                  Close
                </CButton>
                <CButton color="primary" type="submit" disabled={uploading}>
                  {uploading ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Processing...
                    </>
                  ) : (
                    modalType === 'create' ? 'Create User' : 'Update User'
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

export default EditAndCreateUserForm;
