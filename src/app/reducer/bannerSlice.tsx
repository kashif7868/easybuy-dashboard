import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define types for the banner data
interface Banner {
  id: number;
  image: string;
  category_name: string;
  subcategory_name: string;
  category_id: string;
  updated_at: string;
  created_at: string;
}

// Define types for the slice state
interface BannerState {
  banners: Banner[];
  selectedBanner: Banner | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Async thunk to fetch all banners
export const fetchBanners = createAsyncThunk<Banner[]>(
  'banner/fetchBanners',
  async () => {
    const response = await axios.get('http://localhost:8000/api/banners');
    return response.data; // Return the fetched data
  }
);

// Async thunk to fetch banner by ID
export const fetchBannerById = createAsyncThunk<Banner, number>(
  'banner/fetchBannerById',
  async (id) => {
    const response = await axios.get(`http://localhost:8000/api/banner/${id}`);
    return response.data; // Return the fetched data
  }
);

// Async thunk to create a new banner
export const createBanner = createAsyncThunk<Banner, FormData>(
  'banner/createBanner',
  async (formData) => {
    const response = await axios.post('http://localhost:8000/api/banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Return the created banner data
  }
);

// Async thunk to update an existing banner
export const updateBanner = createAsyncThunk<Banner, { id: number; formData: FormData }>(
  'banner/updateBanner',
  async ({ id, formData }) => {
    const response = await axios.patch(`http://localhost:8000/api/banner/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Return the updated banner data
  }
);

// Async thunk to delete a banner
export const deleteBanner = createAsyncThunk<void, number>(
  'banner/deleteBanner',
  async (id) => {
    await axios.delete(`http://localhost:8000/api/banner/${id}`);
  }
);

// Initial state for the banners
const initialState: BannerState = {
  banners: [],
  selectedBanner: null,
  status: 'idle',
  error: null,
};

// Create the banner slice
const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBanners.fulfilled, (state, action: PayloadAction<Banner[]>) => {
        state.status = 'succeeded';
        state.banners = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(fetchBannerById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBannerById.fulfilled, (state, action: PayloadAction<Banner>) => {
        state.status = 'succeeded';
        state.selectedBanner = action.payload;
      })
      .addCase(fetchBannerById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(createBanner.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createBanner.fulfilled, (state, action: PayloadAction<Banner>) => {
        state.status = 'succeeded';
        state.banners.push(action.payload); // Add the new banner to the state
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(updateBanner.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateBanner.fulfilled, (state, action: PayloadAction<Banner>) => {
        state.status = 'succeeded';
        const index = state.banners.findIndex(banner => banner.id === action.payload.id);
        if (index !== -1) {
          state.banners[index] = action.payload; // Update the banner in the state
        }
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(deleteBanner.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.banners = state.banners.filter(banner => banner.id !== action.meta.arg); // Remove the banner from state
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

// Export the selectors to get the banner data
export const selectBanners = (state: { banner: BannerState }) => state.banner.banners;
export const selectBannerStatus = (state: { banner: BannerState }) => state.banner.status;
export const selectBannerError = (state: { banner: BannerState }) => state.banner.error;
export const selectSelectedBanner = (state: { banner: BannerState }) => state.banner.selectedBanner;

export default bannerSlice.reducer;
