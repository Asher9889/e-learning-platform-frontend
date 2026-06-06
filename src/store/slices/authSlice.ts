import type { AuthState } from '@/types/user';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
// User ka type define karein

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Ye raha loginSuccess action
    loginSuccess: (state, action: PayloadAction<any>) => {
        console.log(state,"Login successful, user data:", action); // Debugging ke liye
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