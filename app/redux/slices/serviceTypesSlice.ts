import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/app/config/axiosInstance';

interface ServiceType {
  _id?: string;
  id?: string | number;
  name: string;
  createdAt?: Date;
}

interface ServiceTypesState {
  items: ServiceType[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceTypesState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchServiceTypes = createAsyncThunk('serviceTypes/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/servicetypes');
    return response.data.data || response.data || [];
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch service types');
  }
});

export const addServiceType = createAsyncThunk('serviceTypes/add', async (name: string, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/servicetypes', { name });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to add service type');
  }
});

export const updateServiceType = createAsyncThunk('serviceTypes/update', async ({ id, name }: { id: string; name: string }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/servicetypes/${id}`, { name });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to update service type');
  }
});

export const deleteServiceType = createAsyncThunk('serviceTypes/delete', async (id: string, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/servicetypes/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to delete service type');
  }
});

// Slice
const serviceTypesSlice = createSlice({
  name: 'serviceTypes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchServiceTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addServiceType.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateServiceType.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteServiceType.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export default serviceTypesSlice.reducer;