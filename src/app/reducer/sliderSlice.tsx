// src/app/reducer/sliderSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the types for the slider data and state
interface SliderImage {
  id: number;
  image: string;
  updated_at: string;
  created_at: string;
}

interface SliderState {
  images: SliderImage[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Async thunk to fetch all slider images
export const fetchSliderImages = createAsyncThunk<SliderImage[]>(
  'slider/fetchSliderImages',
  async () => {
    const response = await axios.get('http://localhost:8000/api/sliders');
    return response.data; // return the response data
  }
);

// Async thunk to fetch a slider image by ID
export const fetchSliderById = createAsyncThunk<SliderImage, number>(
  'slider/fetchSliderById',
  async (id) => {
    const response = await axios.get(`http://localhost:8000/api/slider/${id}`);
    return response.data;
  }
);

// Async thunk to create a new slider image using FormData
export const createSliderImage = createAsyncThunk<SliderImage, FormData>(
  'slider/createSliderImage',
  async (formData) => {
    const response = await axios.post('http://localhost:8000/api/slider', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);
// Async thunk to update a slider image using FormData (PATCH request)
export const updateSliderImage = createAsyncThunk<SliderImage, { id: number, formData: FormData }>(
  'slider/updateSliderImage',
  async ({ id, formData }) => {
    const response = await axios.patch(`http://localhost:8000/api/slider/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

// Async thunk to delete a slider image by ID
export const deleteSliderImage = createAsyncThunk<void, number>(
  'slider/deleteSliderImage',
  async (id) => {
    await axios.delete(`http://localhost:8000/api/slider/${id}`);
  }
);

// Initial state of the slider
const initialState: SliderState = {
  images: [],
  status: 'idle', // Can be 'idle', 'loading', 'succeeded', or 'failed'
  error: null,
};

// Create the slider slice
const sliderSlice = createSlice({
  name: 'slider',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSliderImages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSliderImages.fulfilled, (state, action: PayloadAction<SliderImage[]>) => {
        state.status = 'succeeded';
        state.images = action.payload; // Populate images with the fetched data
      })
      .addCase(fetchSliderImages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong'; // Store the error message if fetch fails
      })
      .addCase(fetchSliderById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSliderById.fulfilled, (state, action: PayloadAction<SliderImage>) => {
        state.status = 'succeeded';
        // Optionally, you can update a specific slider image here
      })
      .addCase(fetchSliderById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(createSliderImage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createSliderImage.fulfilled, (state, action: PayloadAction<SliderImage>) => {
        state.status = 'succeeded';
        state.images.push(action.payload); // Add the new image to the state
      })
      .addCase(createSliderImage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(deleteSliderImage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteSliderImage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Remove the deleted slider from the images list
        state.images = state.images.filter((image) => image.id !== action.meta.arg);
      })
      .addCase(deleteSliderImage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

// Export the selectors to get the slider data
export const selectSliderImages = (state: { slider: SliderState }) => state.slider.images;
export const selectSliderStatus = (state: { slider: SliderState }) => state.slider.status;
export const selectSliderError = (state: { slider: SliderState }) => state.slider.error;

export default sliderSlice.reducer;
