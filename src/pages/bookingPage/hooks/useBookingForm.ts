import { useState, useEffect } from 'react';
import { usePropertyBookingsQuery } from '@redux/slices/booking/bookingapiSlice';
import { processBookingData } from '../utils/dateUtils';
import { showErrorAlert } from '../utils/alertUtils';

export interface BookingFormValues {
  from: Date | null;
  to: Date | null;
  property_id: string;
  customer_id: string;
}

export const useBookingForm = (selectedItem: any ,showInfoNote: boolean, setShowInfoNote: (showInfoNote: boolean) => void) => {
  console.log("selectedItem", showInfoNote);
  const [excludedDates, setExcludedDates] = useState<Date[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>(
    selectedItem?.property_id || ''
  );

  // Initialize form values
  const initialValues: BookingFormValues = {
    from: selectedItem?.from ? new Date(selectedItem.from) : null,
    to: selectedItem?.to ? new Date(selectedItem.to) : null,
    property_id: selectedItem?.property_id || '',
    customer_id: selectedItem?.customer_id || '',
  };

  const {
    data: propertyBookings,
    isLoading,
    isFetching,
    error,
  } = usePropertyBookingsQuery(selectedProperty, {
    skip: !selectedProperty, // Skip the query if no property is selected
  });

  // Process booking data when available
  useEffect(() => {
    if (propertyBookings) {
      let filteredBookings = propertyBookings.data.filter((booking: any) => booking.status !== 'cancelled');
      const bookedDates = processBookingData(filteredBookings);
      if (!showInfoNote) {
        setExcludedDates([]);
      }
      setExcludedDates(bookedDates);

    }
  }, [propertyBookings]);

  // Show error if API query fails
  useEffect(() => {
    if (error) {
      showErrorAlert(
        'Failed to fetch property availability. Please try again.'
      );
    }
  }, [error]);

  // Handle property selection change
  const handlePropertyChange = (propertyId: string) => {
    setSelectedProperty(propertyId);
    setShowInfoNote(true);
    // The query will automatically run when selectedProperty changes
  };

  return {
    excludedDates,
    selectedProperty,
    initialValues,
    isLoading,
    isFetching,
    handlePropertyChange,
  };
};
