import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  currentUser: unknown;
}

const initialState: UserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<unknown>) {
      state.currentUser = action.payload;
    },
  },
});

export const { setCurrentUser } = userSlice.actions;
export default userSlice.reducer;
