import { useState } from 'react';
import DatePicker from 'react-datepicker';
import Swal from 'sweetalert2';
import { isSameDate } from '../utils/dateUtils';

interface BookingDatePickerProps {
  form: any;
  excludedDates?: Date[];
  setFieldValue?: (field: string, value: any) => void;
  disabled?: boolean;
}

const BookingDatePicker = ({
  form,
  excludedDates,
  setFieldValue,
  disabled,
}: BookingDatePickerProps) => {
  // Format the placeholder text based on selected dates
  let placeholderText = disabled
    ? 'Select a property first'
    : 'Select start and end dates';

  if (!disabled && (form.values.from || form.values.to)) {
    const fromStr = form.values.from
      ? form.values.from.toLocaleDateString()
      : '';
    const toStr = form.values.to ? form.values.to.toLocaleDateString() : '';

    if (fromStr && toStr) {
      placeholderText = `${fromStr} to ${toStr}`;
    } else if (fromStr) {
      placeholderText = `From: ${fromStr}`;
    }
  }

  return (
    <DatePicker
      wrapperClassName="date-picker-wrapper"
      selectsRange={true}
      startDate={form.values.from}
      endDate={form.values.to}
      excludeDates={excludedDates}
      onChange={(dates) => {
        const [start, end] = dates;

        // If only start date is selected or both dates are null, update normally
        if (!end || (!start && !end)) {
          setFieldValue && setFieldValue('from', start);
          setFieldValue && setFieldValue('to', end);
          return;
        }

        // Check if range contains any excluded dates
        let containsExcludedDate = false;
        const currentDate = start ? new Date(start) : new Date();
        while (currentDate <= end) {
          // Check if current date is in excluded dates
          const isExcluded = excludedDates?.some((excludedDate) =>
            isSameDate(currentDate, excludedDate)
          );

          if (isExcluded) {
            containsExcludedDate = true;
            break;
          }

          // Move to next day
          currentDate.setDate(currentDate.getDate() + 1);
        }

        if (containsExcludedDate) {
          // If range contains excluded dates, show error message
          Swal.fire({
            icon: 'error',
            title: 'Invalid Date Range',
            text: 'Your selection includes unavailable dates. Please select a valid range.',
          });
          // Reset the selection to just the start date
          setFieldValue && setFieldValue('from', start);
          setFieldValue && setFieldValue('to', null);
        } else {
          // Valid range - update normally
          setFieldValue && setFieldValue('from', start);
          setFieldValue && setFieldValue('to', end);
        }
      }}
      placeholderText={placeholderText}
      className="form-control"
      minDate={new Date()}
      dayClassName={(date) =>
        excludedDates?.some((excludedDate) => isSameDate(date, excludedDate))
          ? 'date-unavailable'
          : 'date-available'
      }
      disabled={disabled}
    />
  );
};

export default BookingDatePicker;
