// Date comparison utility
export const isSameDate = (date1: Date, date2: Date) =>
  date1.getDate() === date2.getDate() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getFullYear() === date2.getFullYear();

// Process booking data to get excluded dates
export const processBookingData = (bookingsData: any) => {
  const bookedDates: Date[] = [];

  // Check the data structure and extract bookings
  const bookingsArray = Array.isArray(bookingsData)
    ? bookingsData
    : bookingsData.data || bookingsData.bookings || [];

  // Process each booking to get all booked dates
  bookingsArray.forEach((booking: any) => {
    const start = new Date(booking.from);
    const end = new Date(booking.to);

    // Generate all dates between start and end (inclusive)
    const currentDate = new Date(start);
    while (currentDate <= end) {
      bookedDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return bookedDates;
};
