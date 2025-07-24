import { logout, setTokens } from '@redux/slices/authSlice/authSlice';
import {
  BaseQueryApi,
  createApi,
  FetchArgs,
} from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '.';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'https://www.test.com/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }: { getState: () => RootState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (!headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (
  args: FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: { token: (api.getState() as RootState).auth.refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      api.dispatch(setTokens(refreshResult.data));

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: 'api',
  tagTypes: ['Brands', 'users', 'Offers', 'OfferAnalytics', 'promotions', 'DeveloperList', 'DeveloperDetails'],
  endpoints: () => ({}),
});
