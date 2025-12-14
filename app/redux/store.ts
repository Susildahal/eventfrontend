import { configureStore } from '@reduxjs/toolkit';
import serviceTypesReducer from './slices/serviceTypesSlice';
import eventTypesReducer from './slices/eventTypesSlice';
import contactsReducer from './slices/contactSlice';
import profileReducer from './slices/profileSlicer'; 
import bookingsReducer from './slices/bookingsSlice';
import siteSettingsReducer from './slices/siteSettingsSlice';

const store = configureStore({
  reducer: {
    serviceTypes: serviceTypesReducer,
    eventTypes: eventTypesReducer,
    contacts: contactsReducer,
    profile: profileReducer,
    bookings: bookingsReducer,
    siteSettings: siteSettingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
