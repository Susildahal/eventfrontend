import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/app/config/axiosInstance';

interface SocialMedia {
  name: string;
  url: string;
  icon?: string;
}

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  phone: string;
  email: string;
  address: string;
  bookingEmail: string;
  socialMedia: Record<string, SocialMedia>;
  updatedAt?: string;
}

interface SiteSettingsState {
  data: SiteSettings | null;
  loading: boolean;
  error: string | null;
}

const initialState: SiteSettingsState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchSiteSettings = createAsyncThunk(
  'siteSettings/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/settings');
      return response.data?.data ?? response.data ?? null;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch site settings');
    }
  }
);

export const updateSiteSettings = createAsyncThunk(
  'siteSettings/update',
  async (settings: SiteSettings, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/settings', settings);
      return response.data?.data ?? response.data ?? settings;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to update site settings');
    }
  }
);

export const createSiteSettings = createAsyncThunk(
  'siteSettings/create',
  async (settings: SiteSettings, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/settings', settings);
      return response.data?.data ?? response.data ?? settings;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to create site settings');
    }
  }
);

const siteSettingsSlice = createSlice({
  name: 'siteSettings',
  initialState,
  reducers: {
    clearSiteSettings: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch site settings
      .addCase(fetchSiteSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSiteSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSiteSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update site settings
      .addCase(updateSiteSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSiteSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateSiteSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create site settings
      .addCase(createSiteSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSiteSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createSiteSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSiteSettings } = siteSettingsSlice.actions;
export default siteSettingsSlice.reducer;
