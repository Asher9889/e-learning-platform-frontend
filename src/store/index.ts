// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '../features/auth/authSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
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
    // logout pe user null hoga — localStorage bhi clear ho jaayega
    if (!state.auth.isAuthenticated) {
      localStorage.removeItem("auth");
    } else {
      localStorage.setItem("auth", JSON.stringify(state.auth));
    }
  } catch {}
};

const appReducer = combineReducers({
  auth: authReducer,
});

// Root reducer — logout pe poora state reset
const rootReducer = (state: any, action: any) => {
  if (action.type === "auth/logout") {
    state = undefined; // poora Redux state wipe
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof appReducer>; // ← appReducer se lो, store se nahi
export type AppDispatch = typeof store.dispatch;