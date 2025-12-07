import { configureStore } from '@reduxjs/toolkit';
import serviceTypesReducer from './slices/serviceTypesSlice';

const store = configureStore({
  reducer: {
    serviceTypes: serviceTypesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;