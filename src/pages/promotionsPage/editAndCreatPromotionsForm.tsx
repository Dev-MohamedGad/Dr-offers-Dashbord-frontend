import React, { useEffect, useState } from 'react';
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
  CFormSelect,
  CSpinner,
} from '@coreui/react-pro';
import { Formik, Field, Form } from 'formik';
import Swal from 'sweetalert2';
import { ActionsModalStateType } from 'types';
import { useSelector } from 'react-redux';
import { Developer, CreatePromotionDto } from 'src/types/promotion.type';



const EditAndCreatePromotionsForm = ({
  visible,
  setVisible,
  modalTitle,
  action,
  modalType,
  selectedItem,
}: ActionsModalStateType) => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loadingDevs, setLoadingDevs] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const token = useSelector((state: any) => state.auth.accessToken);

  useEffect(() => {
    setLoadingDevs(true);
    fetch(`${import.meta.env.VITE_API_URL}/developers` ,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then( (res) => {
        return res.json();

      })
      .then((data) => { 
        setDevelopers(data.data)})
      .catch(() => Swal.fire('Error', 'Failed to load developers', 'error'))
      .finally(() => setLoadingDevs(false));
  }, []);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/opportunities/signed-urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          original_name: file.name,
          size: file.size,
          mime_type: file.type,
        }),
      });
      if (!res.ok) throw new Error('Failed to get signed URL');
      const {data:signedUrl} = await res.json();
      // Step 2: Upload file to signed URL
      const {url:uploadUrl} = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });
      if (!uploadUrl) throw new Error('Failed to upload file');

      setFieldValue('photo', uploadUrl.split('?')[0]);
      setImagePreview(uploadUrl.split('?')[0]);
    } catch (err: any) {
      Swal.fire('Error', err.message || 'Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Set initial values for edit or create
  const initialValues: CreatePromotionDto = {
    name: selectedItem?.name || '',
    photo: selectedItem?.photo || '',
    developer_id: selectedItem?.developer?.id || 0
    
  };

  const onSubmit = async (values: typeof initialValues, { resetForm }: any) => {
    try {
      if (!values.name || !values.photo || !values.developer_id) {
        Swal.fire('Error', 'All fields are required');
        return;
      }
      // If editing, pass the id for PATCH
      if (modalType === 'edit' && selectedItem?.id) {
        await action({ id: selectedItem.id, ...values }).unwrap();
        Swal.fire('Success', 'Promotion updated successfully!', 'success');
      } else {
        await action(values).unwrap();
        Swal.fire('Success', 'Promotion created successfully!', 'success');
      }
      setVisible?.(false);
      resetForm();
      setImagePreview('');
    } catch (err: any) {
      Swal.fire('Error', err?.data?.message || 'Failed to save promotion', 'error');
    }
  };
  return (
    <CModal
      visible={visible}
      onClose={() => setVisible?.(false)}
      aria-labelledby="CreatePromotionForm"
    >
      <CModalHeader>
        <CModalTitle id="CreatePromotionForm">{modalTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <Formik initialValues={initialValues} enableReinitialize onSubmit={onSubmit}>
          {({ setFieldValue, values, isSubmitting }) => (
            <Form>
              <CInputGroup className="mb-3">
                <CInputGroupText>Name</CInputGroupText>
                <Field
                  as={CFormInput}
                  name="name"
                  placeholder="Promotion Name"
                  autoComplete="off"
                  required
                />
              </CInputGroup>

              <CInputGroup className="mb-3">
                <CInputGroupText>Developer</CInputGroupText>
                <Field
                  as={CFormSelect}
                  name="developer"
                  required
                  onChange={(e: any) => setFieldValue('developer_id', Number(e.target.value))}
                >
                  <option value={0}>Select Developer</option>
                  {loadingDevs ? (
                    <option disabled>Loading...</option>
                  ) : (
                    developers.map((dev) => (
                      <option key={dev.id} value={dev.id}>
                        {dev.name}
                      </option>
                    ))
                  )}
                </Field>
              </CInputGroup>

              <CInputGroup className="mb-3">
                <CInputGroupText>Photo</CInputGroupText>
                <CFormInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setFieldValue)}
                  disabled={uploading}
                />
                {uploading && <CSpinner size="sm" className="ms-2" />}
              </CInputGroup>
              {values.photo && (
                <div className="mb-3 text-center">
                  <img
                    src={values.photo}
                    alt="Promotion"
                    style={{ maxWidth: 200, maxHeight: 120, borderRadius: 8, border: '1px solid #eee' }}
                  />
                </div>
              )}

              <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible?.(false)} disabled={isSubmitting || uploading}>
                  Cancel
                </CButton>
                <CButton color="primary" type="submit" disabled={isSubmitting || uploading}>
                  {isSubmitting ? <CSpinner size="sm" /> : modalType === 'edit' ? 'Update Promotion' : 'Create Promotion'}
                </CButton>
              </CModalFooter>
            </Form>
          )}
        </Formik>
      </CModalBody>
    </CModal>
  );
};

export default EditAndCreatePromotionsForm;
