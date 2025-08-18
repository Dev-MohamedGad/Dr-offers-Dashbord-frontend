import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from './baseQuery';
import userReducer from './slices/userSlice/userSlice';
import authSlice from './slices/authSlice/authSlice';
import layoutSlice from './slices/layout/layoutSlice';
import usersSlice from './slices/usersSlice/usersSlice';
import brandsSlice from './slices/brandsSlice/brandsSlice';
import offersSlice from './slices/offersSlice/offersSlice';
import languageSlice from './slices/languageSlice/languageSlice';

export const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  user: userReducer,
  auth: authSlice,
  layout: layoutSlice,
  users: usersSlice,
  brands: brandsSlice,
  offers: offersSlice,
  language: languageSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
