import { configureStore } from '@reduxjs/toolkit';
import alertSlice from './alertSlice';
import loadingSlice from './loadingSlice';

export const store = configureStore({
  reducer: {
    loading: loadingSlice,
    alert: alertSlice
  },
});
