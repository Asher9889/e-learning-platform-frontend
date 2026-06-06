// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '../features/auth/authSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

const loadState = (): { auth: any } | undefined => {
  try {
    const serialized = localStorage.getItem("auth");
    return serialized ? { auth: JSON.parse(serialized) } : undefined;
  } catch {
    return undefined;
  }
};

const saveState = (state: RootState) => {
  try {
    localStorage.setItem("auth", JSON.stringify(state.auth));
  } catch {}
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;