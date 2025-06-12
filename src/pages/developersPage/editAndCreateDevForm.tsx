import TextError from '@components/Forms/TextError';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CSpinner,
} from '@coreui/react-pro';
import { Formik, Field, Form } from 'formik';
import Swal from 'sweetalert2';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAddDeveloperMutation, useUpdateDeveloperMutation } from '@redux/slices/developersSlice/developersApiSlice';
import { FiUpload, FiX } from 'react-icons/fi';

const EditAndCreateUserForm = ({
  visible,
  setVisible,
  modalTitle,
  modalType,
  selectedItem,
}: any) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState(selectedItem?.photo || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = useSelector((state: any) => state.auth.accessToken);
  const [addDeveloper] = useAddDeveloperMutation();
  const [updateDeveloper] = useUpdateDeveloperMutation();

  const initialValues = {
    name: selectedItem?.name || '',
    photo: selectedItem?.photo || '',
  };
  type FormTypes = {
    name: string;
    photo: string;
  };

  // Handle file selection and upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      // 1. Request signed URL
      const apiBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiBase}/opportunities/signed-urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          original_name: file.name,
          size: file.size,
          mime_type: file.type,
        }),
      });
      if (!res.ok) throw new Error('Failed to get signed URL');
      const data = await res.json();
      const signedUrl = data.data;
      // 2. Upload file to S3
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error('Failed to upload image to S3');
      const publicUrl = uploadRes.url.split('?')[0];
      setUploadedUrl(publicUrl);
      setFieldValue('photo', publicUrl);
      setUploading(false);
      Swal.fire({
        icon: 'success',
        title: 'Image uploaded!',
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      setUploadError(err.message || 'Image upload failed');
      setUploading(false);
      Swal.fire({
        icon: 'error',
        title: 'Upload Error',
        text: err.message || 'Image upload failed',
      });
    }
  };

  const onSubmit = async (values: FormTypes) => {
    const id = selectedItem?.id;
    const body = {
      name: values.name,
      photo: uploadedUrl || values.photo,
    };
    try {
      if (modalType === 'create') {
        await addDeveloper(body).unwrap();
      } else {
        if (!id) throw new Error('Developer ID is not defined');
        await updateDeveloper({ id, body }).unwrap();
      }
      setVisible?.(false);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: modalType === 'create' ? 'Developer created successfully' : 'Developer updated successfully',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err instanceof Error ? err.message : 'Failed to save developer. Please try again.',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <CModal
      visible={visible}
      onClose={() => setVisible?.(false)}
      aria-labelledby="EditAndCreateUserForm"
      size="lg"
      className="developer-form-modal"
    >
      <CModalHeader className="border-bottom-0 pb-0">
        <CModalTitle id="EditAndCreateUserForm" className="h4">
          {modalTitle}
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="pt-4">
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="developer-form">
              <div className="form-group mb-4">
                <label htmlFor="name" className="form-label fw-medium mb-2">
                  Developer Name
                </label>
                <Field
                  name="name"
                  as={CFormInput}
                  placeholder="Enter developer name"
                  value={values.name}
                  className="form-control-lg"
                />
                {errors.name && touched.name && (
                  <div className="text-danger mt-1">
                    <TextError name="name" />
                  </div>
                )}
              </div>

              <div className="form-group mb-4">
                <label className="form-label fw-medium mb-2">Profile Photo</label>
                <div className="upload-container">
                  <div className="upload-area p-4 border rounded-3 text-center">
                    {uploadedUrl ? (
                      <div className="preview-container position-relative">
                        <img
                          src={uploadedUrl}
                          alt="Uploaded"
                          className="img-fluid rounded-3"
                          style={{ maxHeight: '200px' }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                          onClick={() => {
                            setUploadedUrl('');
                            setFieldValue('photo', '');
                          }}
                        >
                          <FiX />
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <FiUpload className="mb-2" style={{ fontSize: '2rem' }} />
                        <p className="mb-2">Drag and drop your image here, or click to browse</p>
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={e => handleFileChange(e, setFieldValue)}
                          disabled={uploading}
                          className="d-none"
                          id="photo-upload"
                        />
                        <CButton
                          color="primary"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                        >
                          {uploading ? (
                            <>
                              <CSpinner size="sm" className="me-2" />
                              Uploading...
                            </>
                          ) : (
                            'Choose File'
                          )}
                        </CButton>
                      </div>
                    )}
                  </div>
                  {uploadError && (
                    <div className="text-danger mt-2">
                      <small>{uploadError}</small>
                    </div>
                  )}
                </div>
              </div>

              <CModalFooter className="border-top-0 pt-0">
                <CButton
                  color="secondary"
                  onClick={() => setVisible?.(false)}
                  className="px-4"
                >
                  Cancel
                </CButton>
                <CButton
                  color="primary"
                  type="submit"
                  disabled={uploading}
                  className="px-4"
                >
                  {modalType === 'create' ? 'Create Developer' : 'Save Changes'}
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
