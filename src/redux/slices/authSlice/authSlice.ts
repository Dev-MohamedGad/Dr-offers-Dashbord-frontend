import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  accessToken?: string;
  refreshToken?: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  accessToken: undefined,
  refreshToken: undefined,
};

export const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.accessToken = undefined;
      state.refreshToken = undefined;
    },
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
});

export const { loginSuccess, logout, setTokens } = userSlice.actions;

export default userSlice.reducer;
