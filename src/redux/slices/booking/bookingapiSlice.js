import { apiSlice } from '@redux/baseQuery';

export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    bookingList: builder.query({
      query: (params = {}) => {
        const { status, property_id, customer_id } = params;
        const queryParams = new URLSearchParams();

        if (status) queryParams.append('status', status);
        if (property_id) queryParams.append('property_id', property_id);
        if (customer_id) queryParams.append('customer_id', customer_id);

        return {
          url: `/bookings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['BookingList'],
    }),
    bookingDetails: builder.query({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: 'GET',
      }),
      providesTags: ['BookingDetails'],
    }),
    addBooking: builder.mutation({
      query: (booking) => ({
        url: `/bookings`,
        method: 'POST',
        body: { ...booking },
      }),
      invalidatesTags: ['BookingList'],
    }),
    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: ['BookingList'],
    }),
    updateBooking: builder.mutation({
      query: ({ id, body }) => ({
        url: `/bookings/${Number(id)}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['BookingList'],
    }),
    propertyBookings: builder.query({
      query: (propertyId) => ({
        url: `/bookings/property/${propertyId}`,
        method: 'GET',
      }),
      providesTags: ['BookingList'],
    }),
  }),
});

export const {
  useBookingListQuery,
  useBookingDetailsQuery,
  useAddBookingMutation,
  useCancelBookingMutation,
  useUpdateBookingMutation,
  usePropertyBookingsQuery,
} = bookingApiSlice;
