import { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react-pro';
import { Formik, Form } from 'formik';
import { CreateBookingSchema } from '@utils/ValidationSchema';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/datePicker.css';
import './styles/bookingForm.css';

import { ActionsModalStateType } from 'types';
import { BOOKING_FIELDS } from './constants/formFields';
import BookingFormField from './components/BookingFormField';
import BookingDurationInfo from './components/BookingDurationInfo';
import { showLoadingModal, showSuccessAlert, showErrorAlert, confirmModalClose } from './utils/alertUtils';
import { useBookingForm } from './hooks/useBookingForm';

const CreateBookingForm = ({
  visible,
  setVisible,
  modalTitle,
  selectedItem,
  idProperty,
  nameProperty,
  action,
}: ActionsModalStateType) => {
  const [showInfoNote, setShowInfoNote] = useState(false);
  const {
    excludedDates,
    selectedProperty,
    initialValues,
    isLoading,
    isFetching,
    handlePropertyChange,
  } = useBookingForm(selectedItem,showInfoNote,setShowInfoNote);


  const handleSubmit = async (values: any) => {
    if (!values.from || !values.to) {
      await showErrorAlert('Please select valid date range');
      return;
    }

    const body = {
      from: values.from.toLocaleDateString('en-CA'),
      to: values.to.toLocaleDateString('en-CA'),
      property_id: Number(values.property_id),
      customer_id: Number(values.customer_id),
    };

    try {
      showLoadingModal();

      await action(body)
        .unwrap()
        .then((res: any) => {
          showSuccessAlert(res.message);
          setVisible?.(false);
        });
    } catch (error: any) {
      await showErrorAlert(
        error.data?.message || 'Something went wrong! Please try again.'
      );
    }
  };

  const handleModalClose = () => {
    setShowInfoNote(false);
    confirmModalClose(setVisible || (() => {}));
    setShowInfoNote(false);
  };

  return (
    <>
      <CModal
        visible={visible}
        onClose={handleModalClose}
        aria-labelledby="EditAndCreateBookingForm"
        className="booking-modal"
      >
        <CModalHeader>
          <CModalTitle id="EditAndCreateBookingForm">
            <i className="fas fa-calendar-check me-2 "></i>
            {modalTitle}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="booking-form-container">
            {(isLoading || isFetching) && selectedProperty && (
              <div className="loading-overlay text-center mb-3 position-relative">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 mb-0 fw-medium">
                  Loading property availability...
                </p>
              </div>
            )}

            <Formik
              validationSchema={CreateBookingSchema}
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validateOnChange={false}
              validateOnBlur={true}
            >
              {({ errors, touched, setFieldValue, values }) => (
                <Form>
                  { showInfoNote && (
                    <div className="alert alert-info mb-4">
                      <i className="fas fa-info-circle me-2"></i>
                      This property has {excludedDates.length} booked day(s).
                      These dates are shown in red and cannot be selected.
                    </div>
                  )}

                  {BOOKING_FIELDS(idProperty, nameProperty).map(
                    (field, index) => (
                      <BookingFormField
                        key={index}
                        {...field}
                        errors={errors}
                        touched={touched}
                        excludedDates={excludedDates}
                        setFieldValue={setFieldValue}
                        onPropertyChange={
                          field.name === 'property_id'
                            ? handlePropertyChange
                            : undefined
                        }
                        isLoading={
                          field.name === 'property_id'
                            ? isLoading || isFetching
                            : undefined
                        }
                        disabled={field.name === 'from' && !values.property_id}
                      />
                    )
                  )}

                  {values.from &&
                    values.to &&
                    <BookingDurationInfo from={values.from} to={values.to} />}

                  <CModalFooter className="px-0 pb-0">
                    <CButton
                      color="secondary"
                      className="submit-btn me-2"
                      onClick={handleModalClose}
                    >
                      <i className="fas fa-times me-1"></i>
                      Cancel
                    </CButton>
                    <CButton
                      color="primary"
                      type="submit"
                      className="submit-btn"
                    >
                      <i className="fas fa-save me-1"></i>
                      Save Booking
                    </CButton>
                  </CModalFooter>
                </Form>
              )}
            </Formik>
          </div>
        </CModalBody>
      </CModal>
    </>
  );
};

export default CreateBookingForm;
