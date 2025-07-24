import { apiSlice } from "@redux/baseQuery";
import { 
  OffersResponse, 
  OfferFilters,
  OfferResponse,
  CreateOfferDto,
  UpdateOfferDto
} from "src/types/offer.type";

export const offersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllMyOffers: builder.query<OffersResponse, OfferFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        
        if (filters.category) {
          params.append('category', filters.category);
        }
        if (filters.status) {
          params.append('status', filters.status);
        }
        if (filters.brand_id) {
          params.append('brand_id', filters.brand_id.toString());
        }
        if (filters.min_discount) {
          params.append('min_discount', filters.min_discount.toString());
        }
        if (filters.max_price) {
          params.append('max_price', filters.max_price.toString());
        }
        if (filters.page) {
          params.append('page', filters.page.toString());
        }
        if (filters.perPage) {
          params.append('perPage', filters.perPage.toString());
        }

        return {
          url: `/offers/my-offers${params.toString() ? `?${params.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Offers'],
    }),

    getOfferById: builder.query<OfferResponse, number>({
      query: (id) => ({
        url: `/offers/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Offers', id }],
    }),

    createOffer: builder.mutation<OfferResponse, CreateOfferDto>({
      query: (body) => ({
        url: '/offers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Offers'],
    }),

    updateOffer: builder.mutation<OfferResponse, { id: number; body: UpdateOfferDto }>({
      query: ({ id, body }) => ({
        url: `/offers/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Offers'],
    }),

    deleteOffer: builder.mutation<void, number>({
      query: (id) => ({
        url: `/offers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Offers'],
    }),

    getAllOffers: builder.query<OffersResponse, OfferFilters>({
      query: (filters = {}) => {
        console.log('getAllOffers');
        return {
          url: `/offers`,
          method: 'GET',
          params: filters,
        };
      },
      providesTags: ['Offers'],
    }),

    approveOffer: builder.mutation<OfferResponse, { id: number; status: string; rejection_reason?: string }>({
      query: ({ id, status, rejection_reason }) => ({
        url: `/offers/admin/${id}/approve`,
        method: 'PATCH',
        body: rejection_reason ? { status, rejection_reason } : { status },
      }),
      invalidatesTags: ['Offers'],
    }),
  }),
});

export const { 
  useGetAllOffersQuery,
  useGetOfferByIdQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
  useGetAllMyOffersQuery,
  useApproveOfferMutation,
} = offersApiSlice; 