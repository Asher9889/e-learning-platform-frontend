import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import liveClassReducer from '@/features/live-class/store/liveClass.slice';

export const store = configureStore({
  reducer: {
   auth: authReducer,
   liveClass: liveClassReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;