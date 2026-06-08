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
    authenticated: ( state, action: PayloadAction<IUserState>) => {
      state.user = action.payload;
      state.status = AUTH_STATUS.AUTHENTICATED;
    },

    unauthenticated: ( state) => {
      state.user = null;
      state.status = AUTH_STATUS.UNAUTHENTICATED;
    },

    logout: ( state) => {
      state.user = null;
      state.status = AUTH_STATUS.UNAUTHENTICATED;
    },
  }
});

export const {
  authenticated,
  unauthenticated,
  logout,
} = authSlice.actions;

export default authSlice.reducer;