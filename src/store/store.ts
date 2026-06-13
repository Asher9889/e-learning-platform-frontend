import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import liveClassReducer from './slices/liveClass.slice';
import uploadReducer from '../features/upload/store/upload.slice';

export const store = configureStore({
  reducer: {
   auth: authReducer,
   liveClass: liveClassReducer,
   upload: uploadReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
