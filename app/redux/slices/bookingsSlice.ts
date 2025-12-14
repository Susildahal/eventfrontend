import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/app/config/axiosInstance';

interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  eventtype: string;
  numberofpeople: string;
  eventdate: string;
  numberofguests: string;
  budget: string;
  budgetrange: string;
  needs: string[];
  contactMethod: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface StatsData {
  totalCancelled: number;
  totalPending: number;
  totalCompleted: number;
  totalConfirmed: number;
}

interface BookingsState {
  items: Booking[];
  loading: boolean;
  error: string | null;
  stats: StatsData;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

const initialState: BookingsState = {
  items: [],
  loading: false,
  error: null,
  stats: {
    totalCancelled: 0,
    totalPending: 0,
    totalCompleted: 0,
    totalConfirmed: 0,
  },
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
};

// Async thunks
export const fetchBookings = createAsyncThunk(
  'bookings/fetch',
  async ({ page, limit, status }: { page: number; limit: number; status?: string }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (status) {
        params.append('status', status);
      }
      
      const response = await axiosInstance.get(`/bookings?${params.toString()}`);
      return {
        data: response.data.data || [],
        stats: response.data.stats || {
          totalCancelled: 0,
          totalPending: 0,
          totalCompleted: 0,
          totalConfirmed: 0,
        },
        pagination: response.data.pagination || { total: 0, page: 1, limit: 10 },
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch bookings');
    }
  }
);

export const updateBooking = createAsyncThunk(
  'bookings/update',
  async (
    { id, updates }: { id: string; updates: { status?: string; numberofpeople?: string; eventdate?: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/bookings/${id}`, updates);
      return { id, updates };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to update booking');
    }
  }
);

export const deleteBooking = createAsyncThunk(
  'bookings/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/bookings/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to delete booking');
    }
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    updateBookingStats: (state, action) => {
      state.stats = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.stats = action.payload.stats;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update booking
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item._id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload.updates };
          
          // Update stats based on status change
          if (action.payload.updates.status) {
            const oldStatus = state.items[index].status;
            const newStatus = action.payload.updates.status;
            
            // Decrement old status count
            if (oldStatus === 'Pending') state.stats.totalPending--;
            else if (oldStatus === 'Confirmed') state.stats.totalConfirmed--;
            else if (oldStatus === 'Completed') state.stats.totalCompleted--;
            else if (oldStatus === 'Cancelled') state.stats.totalCancelled--;
            
            // Increment new status count
            if (newStatus === 'Pending') state.stats.totalPending++;
            else if (newStatus === 'Confirmed') state.stats.totalConfirmed++;
            else if (newStatus === 'Completed') state.stats.totalCompleted++;
            else if (newStatus === 'Cancelled') state.stats.totalCancelled++;
          }
        }
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete booking
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false;
        const deletedBooking = state.items.find((item) => item._id === action.payload);
        if (deletedBooking) {
          // Update stats
          if (deletedBooking.status === 'Pending') state.stats.totalPending--;
          else if (deletedBooking.status === 'Confirmed') state.stats.totalConfirmed--;
          else if (deletedBooking.status === 'Completed') state.stats.totalCompleted--;
          else if (deletedBooking.status === 'Cancelled') state.stats.totalCancelled--;
        }
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.pagination.total--;
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateBookingStats } = bookingsSlice.actions;
export default bookingsSlice.reducer;
