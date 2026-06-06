import type { IAuthState, IUserState } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: IAuthState = {
  user:  null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    loginSuccess: (state, action: PayloadAction<IUserState>) => {
      console.log(state,"Login successful, user data:", action); 
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;