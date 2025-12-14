import axiosInstance from "@/app/config/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Profile {
  _id?: string;
  name: string;
  email: string;
  role?: string;
  address?: string;
  phone?: string;
  profilePicture?: string;
  status?: boolean;
}

interface ProfileState {
  data: Profile | null;
  loading: boolean;
  error: string | null;
}
const initialState: ProfileState = {
  data: null,
  loading: false,
  error: null,

};
export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users/me");
      const profile = response.data?.user ?? response.data?.data ?? response.data?.profile ?? response.data;
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch profile");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/update",
  async ({ userId, formData }: { userId: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/users/profile/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const updatedProfile = response.data?.data ;
      return updatedProfile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to update profile");
    }
  }
);

export const updatePassword = createAsyncThunk(
  "profile/updatePassword",
  async ({ userId, passwordData }: { userId: string; passwordData: { oldPassword: string; password: string } }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/users/updatepassword/${userId}`, passwordData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to update password");
    }
  }
);
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfile } = profileSlice.actions;

export default profileSlice.reducer;
