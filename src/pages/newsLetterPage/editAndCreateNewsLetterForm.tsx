import TextError from '@components/Forms/TextError';
import { cilAt } from '@coreui/icons';
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
} from '@coreui/react-pro';
import Swal from 'sweetalert2';
import { useState } from 'react';

import { ActionsModalStateType } from 'types';
import { Field } from 'formik';
import { Form } from 'formik';
import { NewsletterSchema } from '@utils/ValidationSchema';
import { Formik } from 'formik';


const EditAndCreateNewsLetterForm = ({
  visible,
  setVisible,
  modalTitle,
  modalType,
  selectedItem,
  action,
}: ActionsModalStateType) => {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    email: selectedItem?.email || '',
  };

  type FormTypes = {
    email: string;
  };

  const onSubmit = async (values: FormTypes) => {
    try {
      setIsLoading(true);
      await action(values).unwrap();
      setVisible?.(false);
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: modalType === 'create' ? 'Successfully subscribed!' : 'Successfully updated subscription!',
        timer: 1500,
      });
    } catch (err) {
      console.error('Failed to handle newsletter:', err);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err instanceof Error ? err.message : 'Failed to process newsletter subscription',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CModal
      visible={visible}
      onClose={() => setVisible?.(false)}
      aria-labelledby="EditAndCreateNewsletterForm"
    >
      <CModalHeader>
        <CModalTitle id="EditAndCreateNewsletterForm">{modalTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <Formik
          validationSchema={NewsletterSchema}
          initialValues={initialValues}
          onSubmit={onSubmit}
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({ errors, touched, values }) => (
            <Form>
              <CInputGroup className="mb-2">
                <CInputGroupText className="bg-white text-secondary">
                  <CIcon icon={cilAt} />
                </CInputGroupText>
                <Field
                  name="email"
                  as={CFormInput}
                  placeholder="Enter email"
                  autoComplete="email"
                  type="email"
                  value={values.email}
                  disabled={isLoading}
                />
              </CInputGroup>
              {errors.email && touched.email ? <TextError name="email" /> : null}

              <CModalFooter>
                <CButton 
                  color="secondary" 
                  onClick={() => setVisible?.(false)}
                  disabled={isLoading}
                >
                  Close
                </CButton>
                <CButton 
                  color="primary" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    modalType === 'create' ? 'Add Subscription' : 'Save changes'
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

export default EditAndCreateNewsLetterForm;
