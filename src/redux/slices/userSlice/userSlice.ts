import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'owner';
  // Add other user properties as needed
}

export interface UserState {
  currentUser: CurrentUser | null;
}

const initialState: UserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<CurrentUser | null>) {
      state.currentUser = action.payload;
    },
  },
});

export const { setCurrentUser } = userSlice.actions;
export default userSlice.reducer;
