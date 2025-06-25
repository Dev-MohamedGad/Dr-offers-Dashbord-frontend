import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from './baseQuery';
import userReducer from './slices/userSlice/userSlice';
import authSlice from './slices/authSlice/authSlice';
import layoutSlice from './slices/layout/layoutSlice';
import usersSlice from './slices/usersSlice/usersSlice';
import brandsSlice from './slices/brandsSlice/brandsSlice';

export const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  user: userReducer,
  auth: authSlice,
  layout: layoutSlice,
  users: usersSlice,
  brands: brandsSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
