import { apiSlice } from "@redux/baseQuery"



export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: `/auth/login`,
          method: 'POST',
          body: {...credentials},    
      }),
    }),
  }),
})

export const { useLoginMutation } = authApiSlice