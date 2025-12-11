import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/app/config/axiosInstance';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: boolean | string;
  createdAt: string;
}

interface ContactsState {
  items: Contact[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

const initialState: ContactsState = {
  items: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
};


// Async thunks
export const fetchContacts = createAsyncThunk(
  'contacts/fetch',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/contactus', {
        params: { page, limit },
      });
      return {
        data: response.data.data || [],
        pagination: response.data.pagination || { total: 0 },
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch contacts');
    }
  }
);

export const updateContactStatus = createAsyncThunk(
  'contacts/updateStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/contactus/${id}`, { status });
      return { id, status };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to update contact status');
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/contactus/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to delete contact');
    }
  }
);

// Slice
const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination.total = action.payload.pagination.total;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateContactStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload.id);
        if (index !== -1) {
          state.items[index].status = action.payload.status;
        }
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      });
  },
});

export const { setPage, setLimit } = contactSlice.actions;
export default contactSlice.reducer;
