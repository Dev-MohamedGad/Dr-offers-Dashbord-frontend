import { apiSlice } from '@redux/baseQuery';

export const opportunitiesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    opportunitiesList: builder.query({
      query: (params = {}) => {
        const { type, country, status, search_query, page, perPage } = params;
        const queryParams = new URLSearchParams();

        if (type) queryParams.append('type', type);
        if (country) queryParams.append('country', country);
        if (status) queryParams.append('status', status);
        if (search_query) queryParams.append('search_query', search_query);
        if (page) queryParams.append('page', page);
        if (perPage) queryParams.append('perPage', perPage);

        return {
          url: `/opportunities${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['opportunities'],
    }),

    opportunityDetails: builder.query({
      query: (id) => ({
        url: `/opportunities/${id}`,
        method: 'GET',
      }),
      providesTags: ['opportunityDetails'],
    }),
    addOpportunityApiSlice: builder.mutation({
      query: (opportunity) => {
        return {
          url: `/opportunities/${opportunity.typeOpportunity}`,
          method: 'POST',
          body: opportunity.body,
        };
      },
      invalidatesTags: ['opportunities'],
    }),
    removeOpportunityApiSlice: builder.mutation({
      query: (id) => ({
        url: `/opportunities/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['opportunities'],
    }),
    updateOpportunityApiSlice: builder.mutation({
      query: (opportunity) => {
        return {
          url: `/opportunities/${opportunity.typeOpportunity}/${opportunity.id}`,
          method: 'PATCH',
          body: opportunity.body,
        };
      },
      invalidatesTags: ['opportunities'],
    }),
    getOpportunityById: builder.query({
      query: (id) => ({
        url: `/opportunities/${id}`,
        method: 'GET',
      }),
      providesTags: ['opportunities'],
    }),
    getInterestRequests: builder.query({
      query: (id) => `/opportunities/${id}/interest-requests`,
      providesTags: ['Opportunities'],
    }),
    getShareowners: builder.query({
      query: (id) => `/opportunities/${id}/shareowners`,
      providesTags: ['Opportunities'],
    }),
    createInvestment: builder.mutation({
      query: (data) => ({
        url: '/investments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Opportunities'],
    }),
  }),
});

export const {
  useOpportunitiesListQuery,
  useAddOpportunityApiSliceMutation,
  useRemoveOpportunityApiSliceMutation,
  useUpdateOpportunityApiSliceMutation,
  useGetOpportunityByIdQuery,
  useGetInterestRequestsQuery,
  useGetShareownersQuery,
  useCreateInvestmentMutation,
} = opportunitiesApiSlice;
