import { configureStore } from '@reduxjs/toolkit';
import serviceTypesReducer from './slices/serviceTypesSlice';
import eventTypesReducer from './slices/eventTypesSlice';

const store = configureStore({
  reducer: {
    serviceTypes: serviceTypesReducer,
    eventTypes: eventTypesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
