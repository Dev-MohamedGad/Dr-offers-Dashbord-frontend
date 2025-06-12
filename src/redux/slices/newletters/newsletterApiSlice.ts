import { apiSlice } from "@redux/baseQuery";

interface Newsletter {
  id: number;
  email: string;
  created_at: string;
  deleted_at: string | null;
}

interface NewsletterResponse {
  data: Newsletter[];
}

export const newsletterApiSlice = apiSlice.enhanceEndpoints({
  addTagTypes: ['Newsletter']
}).injectEndpoints({
  endpoints: (builder) => ({
    newsletterList: builder.query<NewsletterResponse, void>({
      query: () => ({
        url: `/newsletter`,    
        method: 'GET',         
      }),
      providesTags: ['Newsletter']
    }),
  
    addNewsletter: builder.mutation<Newsletter, Partial<Newsletter>>({
      query: (data) => ({
        url: `/newsletter`,
        method: 'POST',
        body: {...data},
      }),
      invalidatesTags: ['Newsletter']
    }),
    removeNewsletter: builder.mutation<void, string>({
      query: (email: string) => ({
        url: `/newsletter`,
        method: 'DELETE',
        body: {email}
      }),
      invalidatesTags: ['Newsletter']
    }),
    updateNewsletter: builder.mutation<Newsletter, {id: number; body: Partial<Newsletter>}>({
      query: ({id, body}) => ({
        url: `/newsletter/${Number(id)}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Newsletter']
    }),
  }),
});

export const { 
  useNewsletterListQuery,
  useAddNewsletterMutation,
  useRemoveNewsletterMutation,
  useUpdateNewsletterMutation
} = newsletterApiSlice;