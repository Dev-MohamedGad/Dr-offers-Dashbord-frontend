import { apiSlice } from "@redux/baseQuery";

export interface Owner {
  name: string;
}

export interface Brand {
  id: number;
  brand_name: string;
  status: 'active' | 'pending' | 'rejected';
  business_docs?: string;
  clicks: number;
  category_type: string;
  subscription_plan: string;
  visitors: number;
  views: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  owner?: Owner;
  owner_name?: string;
}

export interface UpdateBrandRequest {
  brand_name?: string;
  status?: 'active' | 'pending' | 'rejected';
  business_docs?: string;
  category_type?: string;
  subscription_plan?: string;
  owner_name?: string;
}

export interface BrandsResponse {
  data: {
    data: Brand[];
  };
}

export const brandsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBrands: builder.query<BrandsResponse, { page?: number; limit?: number; status?: string }>({
      query: (params = {}) => ({
        url: '/brands',
        method: 'GET',
        params,
      }),
      providesTags: ['Brands'],
    }),
    
    getBrandDetails: builder.query<{ data: Brand }, { id: number }>({
      query: ({ id, }) => ({
        url: `/brands/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, { id }) => [{ type: 'Brands', id }],
    }),
    
    addBrand: builder.mutation<any, Partial<Brand>>({
      query: (brand) => ({
        url: '/brands',
        method: 'POST',
        body: { ...brand },
      }),
      invalidatesTags: ['Brands']
    }),
    
    updateBrand: builder.mutation<{ data: Brand }, { id: number; body: UpdateBrandRequest }>({
      query: ({ id, body }) => ({
        url: `/brands/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Brands',
        { type: 'Brands', id }
      ]
    }),
    
    deleteBrand: builder.mutation<any, number>({
      query: (id) => ({
        url: `/brands/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Brands']
    }),
  }),
});

export const { 
  useGetAllBrandsQuery,
  useGetBrandDetailsQuery, 
  useAddBrandMutation, 
  useUpdateBrandMutation, 
  useDeleteBrandMutation 
} = brandsApiSlice; 