import { apiSlice } from '@redux/baseQuery';

export const professionalsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    professionalList: builder.query({
      query: () => ({
        url: `/professional`,
        method: 'GET',
      }),
      providesTags: ['ProfessionalList'],
    }),
    professionalDetails: builder.query({
      query: (id) => ({
        url: `/professional/${id}`,
        method: 'GET',
      }),
      providesTags: ['ProfessionalList'],
    }),
    addProfessional: builder.mutation({
      query: (area) => ({
        url: `/professional`,
        method: 'POST',
        body: { ...area },
      }),
      invalidatesTags: ['ProfessionalList'],
    }),
    removeProfessional: builder.mutation({
      query: (id) => ({
        url: `/professional/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProfessionalList'],
    }),
    updateProfessional: builder.mutation({
      query: ({ id, body }) => ({
        url: `/professional/${Number(id)}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['ProfessionalList'],
    }),
  }),
});

export const {
  useProfessionalListQuery,
  useProfessionalDetailsQuery,
  useAddProfessionalMutation,
  useRemoveProfessionalMutation,
  useUpdateProfessionalMutation,
} = professionalsApiSlice;
