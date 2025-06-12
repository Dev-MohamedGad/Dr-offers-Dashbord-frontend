import { apiSlice } from "@redux/baseQuery"



export const branchesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

   branchDetails: builder.query({
      query: (id) => ({
        url: `/branch/${id}`,
        method: 'GET',  
      }),
    }),
    addBranchApiSlice: builder.mutation({
      query: (branch) => ({
        url: `/branch`,
        method: 'POST',
        body: {...branch},
      }),
      invalidatesTags : ['saloonDetails']
    }),
    removeBranchApiSlice: builder.mutation({
      query: (id) => ({
        url: `/branch/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags : ['saloonDetails']
    }),
    updateBranchApiSlice: builder.mutation({
      query: ({id , body}) => ({
        url: `/branch/${Number(id)}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags : ['saloonDetails']
    }),
  }),
})

export const { useBranchDetailsQuery , useAddBranchApiSliceMutation, useRemoveBranchApiSliceMutation, useUpdateBranchApiSliceMutation } = branchesApiSlice