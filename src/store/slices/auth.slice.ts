import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AUTH_STATUS, type IAuthState } from "../../constants/auth/auth.constant";
import type { IUserState } from "../../constants/user/user.constant";

const initialState: IAuthState = {
  user: null,
  status: AUTH_STATUS.CHECKING,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    authenticated: (state) => {
      state.status = AUTH_STATUS.AUTHENTICATED;
    },

    authChecking: (state) => {
      state.status = AUTH_STATUS.CHECKING;
    },

    unauthenticated: ( state) => {
      state.user = null;
      state.status = AUTH_STATUS.UNAUTHENTICATED;
    },

    logout: ( state) => {
      state.user = null;
      state.status = AUTH_STATUS.UNAUTHENTICATED;
    },

    setUser: (state, action: PayloadAction<IUserState | null>) => {
      state.user = action.payload;
    }
  }
});

export const {
  authenticated,
  unauthenticated,
  logout,
  setUser,
  authChecking
} = authSlice.actions;

export default authSlice.reducer;