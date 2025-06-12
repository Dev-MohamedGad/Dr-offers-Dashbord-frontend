import { apiSlice } from "@redux/baseQuery"
import { EndpointBuilder } from "@reduxjs/toolkit/query"
import { BaseQueryFn } from "@reduxjs/toolkit/query"
import { CreatePromotionDto, Promotion, UpdatePromotionDto } from "src/types/promotion.type"

export const promotionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder:EndpointBuilder<BaseQueryFn, string, string>
  ) => ({
    promotionsList: builder.query<Promotion[], void>({
      query: () => ({
        url: `/promotions`,
        method: 'GET',
      }),
      
      providesTags: ['promotions']
    }),
    promotionDetails: builder.query<Promotion, number>({
      query: (id:number) => ({
        url: `/promotions/${id}`,
        method: 'GET',
      }),
      providesTags: ['promotions']
    }),
    addPromotion: builder.mutation<Promotion, CreatePromotionDto>({
      query: (promotion:CreatePromotionDto) => ({
        url: `/promotions`,
        method: 'POST',
        body: { ...promotion },
      }),
      invalidatesTags: ['promotions']
    }),
    removePromotion: builder.mutation<void, number>({
      query: (id:number) => ({
        url: `/promotions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['promotions']
    }),
    updatePromotion: builder.mutation<Promotion, { id: number; body: UpdatePromotionDto }>({
      query: ({ id, body }: { id: number; body: UpdatePromotionDto }) => ({
        url: `/promotions/${Number(id)}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['promotions']
    }),
  }),
})

export const {
  usePromotionsListQuery,
  usePromotionDetailsQuery,
  useAddPromotionMutation,
  useRemovePromotionMutation,
  useUpdatePromotionMutation
} = promotionsApiSlice