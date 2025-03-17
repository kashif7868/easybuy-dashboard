import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define types for the small category data
interface SmallCategory {
  id: number;
  small_category_name: string;
  category_id: number;
  subcategory_id: number;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    category_name: string;
    image: string;
    created_at: string;
    updated_at: string;
  };
  subcategory: {
    id: number;
    subCategoryName: string;
    category_name: string;
    category_id: number;
    created_at: string;
    updated_at: string;
  };
}

// Define the state type for the small category slice
interface SmallCategoryState {
  smallCategories: SmallCategory[];
  currentSmallCategory: SmallCategory | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Async thunk to fetch all small categories
export const fetchSmallCategories = createAsyncThunk<SmallCategory[]>(
  'smallCategory/fetchSmallCategories',
  async () => {
    const response = await axios.get('http://localhost:8000/api/small-categories');
    return response.data;
  }
);

// Async thunk to fetch a small category by ID
export const fetchSmallCategoryById = createAsyncThunk<SmallCategory, number>(
  'smallCategory/fetchSmallCategoryById',
  async (smallCategoryId) => {
    const response = await axios.get(`http://localhost:8000/api/small-category/${smallCategoryId}`);
    return response.data;
  }
);

// Async thunk to create a new small category
export const createSmallCategory = createAsyncThunk<SmallCategory, FormData>(
  'smallCategory/createSmallCategory',
  async (formData) => {
    const response = await axios.post('http://localhost:8000/api/small-category', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

// Async thunk to update an existing small category
export const updateSmallCategory = createAsyncThunk<SmallCategory, { id: number; formData: FormData }>(
  'smallCategory/updateSmallCategory',
  async ({ id, formData }) => {
    const response = await axios.patch(`http://localhost:8000/api/small-category/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

// Async thunk to delete a small category
export const deleteSmallCategory = createAsyncThunk<void, number>(
  'smallCategory/deleteSmallCategory',
  async (id) => {
    await axios.delete(`http://localhost:8000/api/small-category/${id}`);
  }
);

// Initial state for the small category slice
const initialState: SmallCategoryState = {
  smallCategories: [],
  currentSmallCategory: null,
  status: 'idle',
  error: null,
};

// Create the small category slice
const smallCategorySlice = createSlice({
  name: 'smallCategory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handling fetch small categories
    builder
      .addCase(fetchSmallCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSmallCategories.fulfilled, (state, action: PayloadAction<SmallCategory[]>) => {
        state.status = 'succeeded';
        state.smallCategories = action.payload;
      })
      .addCase(fetchSmallCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });

    // Handling fetch small category by ID
    builder
      .addCase(fetchSmallCategoryById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSmallCategoryById.fulfilled, (state, action: PayloadAction<SmallCategory>) => {
        state.status = 'succeeded';
        state.currentSmallCategory = action.payload;
      })
      .addCase(fetchSmallCategoryById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });

    // Handling create small category
    builder
      .addCase(createSmallCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createSmallCategory.fulfilled, (state, action: PayloadAction<SmallCategory>) => {
        state.status = 'succeeded';
        state.smallCategories.push(action.payload);
      })
      .addCase(createSmallCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });

    // Handling update small category
    builder
      .addCase(updateSmallCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateSmallCategory.fulfilled, (state, action: PayloadAction<SmallCategory>) => {
        state.status = 'succeeded';
        const index = state.smallCategories.findIndex((smallCategory) => smallCategory.id === action.payload.id);
        if (index !== -1) {
          state.smallCategories[index] = action.payload;
        }
      })
      .addCase(updateSmallCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });

    // Handling delete small category
    builder
      .addCase(deleteSmallCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteSmallCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.smallCategories = state.smallCategories.filter(
          (smallCategory) => smallCategory.id !== action.meta.arg
        );
      })
      .addCase(deleteSmallCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

// Export selectors
export const selectSmallCategories = (state: { smallCategory: SmallCategoryState }) => state.smallCategory.smallCategories;
export const selectSmallCategoryStatus = (state: { smallCategory: SmallCategoryState }) => state.smallCategory.status;
export const selectSmallCategoryError = (state: { smallCategory: SmallCategoryState }) => state.smallCategory.error;
export const selectCurrentSmallCategory = (state: { smallCategory: SmallCategoryState }) => state.smallCategory.currentSmallCategory;

export default smallCategorySlice.reducer;
