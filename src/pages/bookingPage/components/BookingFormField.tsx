import { Field } from 'formik';
import { CFormInput, CInputGroup, CInputGroupText } from '@coreui/react-pro';
import TextError from '@components/Forms/TextError';
import BookingDatePicker from './BookingDatePicker';

interface BookingFormValues {
  from: Date | null;
  to: Date | null;
  property_id: string;
  customer_id: string;
}

interface BookingFormFieldProps {
  label: string;
  name: keyof BookingFormValues;
  type: 'date' | 'number' | 'select' | 'daterange';
  errors: any;
  touched: any;
  options?: { value: string; label: string }[];
  excludedDates?: Date[];
  setFieldValue?: (field: string, value: any) => void;
  onPropertyChange?: (propertyId: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const BookingFormField = ({
  label,
  name,
  type,
  errors,
  touched,
  options,
  excludedDates,
  setFieldValue,
  onPropertyChange,
  isLoading,
  disabled,
}: BookingFormFieldProps) => {
  // DateRange field type
  if (type === 'daterange') {
    return (
      <div className="booking-form-field">
        <label className="form-label">{label}</label>
        <div className="date-picker-container">
          <Field name={name}>
            {({ field, form }: any) => (
              <BookingDatePicker
                form={form}
                excludedDates={excludedDates}
                setFieldValue={setFieldValue}
                disabled={disabled}
              />
            )}
          </Field>
        </div>
        {errors.from && touched.from ? (
          <TextError name="from" />
        ) : errors.to && touched.to ? (
          <TextError name="to" />
        ) : (
          <div className="form-text text-muted mt-1">
            <i className="fas fa-info-circle me-1"></i>
            {disabled
              ? 'Please select a property to enable date selection'
              : 'Red dates are unavailable. Select available dates for your booking.'}
          </div>
        )}
      </div>
    );
  }

  // Select field type
  if (type === 'select') {
    return (
      <div className="booking-form-field">
        <label className="form-label">{label}</label>
        <CInputGroup className="form-input-group mb-2">
          <CInputGroupText className="field-label bg-white text-secondary">
            <i className="fas fa-building me-2"></i>
            {label}
          </CInputGroupText>
          <Field name={name}>
            {({ field, form }: any) => (
              <select
                {...field}
                className="form-select"
                onChange={(e) => {
                  field.onChange(e);
                  onPropertyChange && onPropertyChange(e.target.value);
                }}
                disabled={isLoading}
              >
                <option key="default" value="">
                  {isLoading ? 'Loading properties...' : 'Select a property'}
                </option>
                {options?.map((option, index) => (
                  <option key={`${option.value}-${index}`} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </Field>
          {isLoading && (
            <CInputGroupText className="field-label bg-white">
              <div
                className="spinner-border spinner-border-sm text-primary"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </CInputGroupText>
          )}
        </CInputGroup>
        {errors[name] && touched[name] ? (
          <TextError name={name} />
        ) : (
          <div className="form-text text-muted mt-1">
            <i className="fas fa-info-circle me-1"></i>
            {isLoading
              ? 'Loading available dates...'
              : 'Select a property to see available dates'}
          </div>
        )}
      </div>
    );
  }

  // Default input field type
  return (
    <div className="booking-form-field">
      <label className="form-label">{label}</label>
      <CInputGroup className="form-input-group mb-2">
        <CInputGroupText className="field-label bg-white text-secondary">
          <i className="fas fa-user me-2"></i>
          {label}
        </CInputGroupText>
        <Field name={name} as={CFormInput} type={type} />
      </CInputGroup>
      {errors[name] && touched[name] ? <TextError name={name} /> : null}
    </div>
  );
};

export default BookingFormField;
