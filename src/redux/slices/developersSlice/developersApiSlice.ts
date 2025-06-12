import { apiSlice } from "@redux/baseQuery"
import { BaseQueryFn } from "@reduxjs/toolkit/query"
import { EndpointBuilder } from "@reduxjs/toolkit/query"
import { Developer, ResponseDeveloper, ResponseDevelopers, CreateDeveloperDto, UpdateDeveloperDto } from "src/types/developer.type"



export const developersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder:EndpointBuilder<BaseQueryFn, string, string>) => ({
    developerList: builder.query<ResponseDevelopers, void>({
      query: () => ({
        url: `/developers`,
        method: 'GET',
      }),
      providesTags: ['DeveloperList'],
    }),
    developerDetails: builder.query<ResponseDeveloper, number>({
      query: (id: number) => ({
        url: `/developers/${id}`,
        method: 'GET',
      }),
      providesTags: ['DeveloperDetails'],
    }),
    addDeveloper: builder.mutation<Developer, CreateDeveloperDto>({
      query: (developer: CreateDeveloperDto) => ({
        url: `/developers`,
        method: 'POST',
        body: { ...developer },
      }),
      invalidatesTags: ['DeveloperList'],
    }),
    updateDeveloper: builder.mutation<Developer, { id: number; body: UpdateDeveloperDto }>({
      query: ({ id, body }: { id: number; body: UpdateDeveloperDto }) => ({
        url: `/developers/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['DeveloperList', 'DeveloperDetails'],
    }),
    deleteDeveloper: builder.mutation<Developer, number>({
      query: (id: number) => ({
        url: `/developers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DeveloperList'],
    }),
  }),
})

export const {
  useDeveloperListQuery,
  useDeveloperDetailsQuery,
  useAddDeveloperMutation,
  useUpdateDeveloperMutation,
  useDeleteDeveloperMutation,
} = developersApiSlice