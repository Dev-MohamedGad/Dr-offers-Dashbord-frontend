import { apiSlice } from "@redux/baseQuery"



export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    usersList: builder.query({
      query: ({ page = 1, perPage = 10 }) => ({
        url: `/users?page=${page}&perPage=${perPage}`,    
        method: 'GET',
      }),
      providesTags: ['users']
    }),
    userDetails: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
    }),
    updateUserImage: builder.mutation({
      query: (body) => ({
        url: `/users/signed-urls`,
        method: 'POST',
        body: {...body},
      }),
    }),
    addUserApiSlice: builder.mutation({
      query: (user) => ({
        url: `/users`,
        method: 'POST',
        body: {...user},
      }),
      invalidatesTags : ['users']
    }),
    removeUserApiSlice: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags : ['users']
    }),
    updateUserApiSlice: builder.mutation({
      query: ({id , body}) => ({
        url: `/users/${Number(id)}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags : ['users']
    }),
  }),
})

export const { useUsersListQuery, useUserDetailsQuery , useAddUserApiSliceMutation, useRemoveUserApiSliceMutation, useUpdateUserApiSliceMutation, useUpdateUserImageMutation } = usersApiSlice