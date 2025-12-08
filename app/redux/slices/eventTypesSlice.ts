import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/app/config/axiosInstance';

interface EventType {
  _id?: string;
  id?: string | number;
  name: string;
  createdAt?: Date;
}

interface EventTypesState {
  items: EventType[];
  loading: boolean;
  error: string | null;
}

const initialState: EventTypesState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk to fetch event types
export const fetchEventTypes = createAsyncThunk('eventTypes/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/eventtypes');
    return response.data.data || response.data || [];
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch event types');
  }
});
export const fetchEventTypeById = createAsyncThunk('eventTypes/fetchById', async (id: string, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/eventtypes/${id}`);
    return response.data.data
  }
    catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch event type');
  }
});

 export const updateEventType = createAsyncThunk('eventTypes/update', async (eventType: EventType, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/eventtypes/${eventType._id || eventType.id}`, eventType);
    return response.data.data
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to update event type');
  }
});
export const createEventType = createAsyncThunk('eventTypes/create', async (eventType: EventType, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/eventtypes', eventType);
    return response.data.data 
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to create event type');
  }
});

export const deleteEventType = createAsyncThunk('eventTypes/delete', async (id: string, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/eventtypes/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to delete event type');
  }
});


const eventTypesSlice = createSlice({
  name: 'eventTypes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEventTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
        .addCase(createEventType.fulfilled, (state, action) => {
        state.items.push(action.payload as EventType);
        })
        .addCase(updateEventType.fulfilled, (state, action) => {
        const index = state.items.findIndex(et => (et._id || et.id) === (action.payload as EventType)._id || (action.payload as EventType).id);
        if (index !== -1) {
          state.items[index] = action.payload as EventType;
        }
        })  
        .addCase(deleteEventType.fulfilled, (state, action) => {
          state.items = state.items.filter(et => (et._id || et.id) !== action.payload);
        });

  },
});

export default eventTypesSlice.reducer;
