import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define types for the subcategory data
interface SubCategory {
  id: number;
  subCategoryName: string;
  category_name: string;
  category_id: string;
  created_at: string;
  updated_at: string;
}

// Define the state type for the subcategory slice
interface SubCategoryState {
  subCategories: SubCategory[];
  currentSubCategory: SubCategory | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Async thunk to fetch all subcategories
export const fetchSubCategories = createAsyncThunk<SubCategory[]>(
  'subCategory/fetchSubCategories',
  async () => {
    const response = await axios.get('http://localhost:8000/api/subcategories');
    return response.data;
  }
);

// Async thunk to fetch subcategory by ID
export const fetchSubCategoryById = createAsyncThunk<SubCategory, number>(
  'subCategory/fetchSubCategoryById',
  async (subCategoryId) => {
    const response = await axios.get(`http://localhost:8000/api/subcategory/${subCategoryId}`);
    return response.data;
  }
);

// Async thunk to create a new subcategory
export const createSubCategory = createAsyncThunk<SubCategory, FormData>(
  'subCategory/createSubCategory',
  async (formData) => {
    const response = await axios.post('http://localhost:8000/api/subcategory', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

// Async thunk to update an existing subcategory
export const updateSubCategory = createAsyncThunk<SubCategory, { id: number; formData: FormData }>(
  'subCategory/updateSubCategory',
  async ({ id, formData }) => {
    const response = await axios.patch(`http://localhost:8000/api/subcategory/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

// Async thunk to delete a subcategory
export const deleteSubCategory = createAsyncThunk<void, number>(
  'subCategory/deleteSubCategory',
  async (id) => {
    await axios.delete(`http://localhost:8000/api/subcategory/${id}`);
  }
);

// Initial state for the subcategory slice
const initialState: SubCategoryState = {
  subCategories: [],
  currentSubCategory: null,
  status: 'idle',
  error: null,
};

// Create the subcategory slice
const subCategorySlice = createSlice({
  name: 'subCategory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handling fetch subcategories
    builder
      .addCase(fetchSubCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSubCategories.fulfilled, (state, action: PayloadAction<SubCategory[]>) => {
        state.status = 'succeeded';
        state.subCategories = action.payload;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });

    // Handling fetch subcategory by ID
    builder
      .addCase(fetchSubCategoryById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSubCategoryById.fulfilled, (state, action: PayloadAction<SubCategory>) => {
        state.status = 'succeeded';
        state.currentSubCategory = action.payload;
      })
      .addCase(fetchSubCategoryById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });

    // Handling create subcategory
    builder
      .addCase(createSubCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createSubCategory.fulfilled, (state, action: PayloadAction<SubCategory>) => {
        state.status = 'succeeded';
        state.subCategories.push(action.payload);
      })
      .addCase(createSubCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });

    // Handling update subcategory
    builder
      .addCase(updateSubCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateSubCategory.fulfilled, (state, action: PayloadAction<SubCategory>) => {
        state.status = 'succeeded';
        const index = state.subCategories.findIndex((subCategory) => subCategory.id === action.payload.id);
        if (index !== -1) {
          state.subCategories[index] = action.payload; // Update the subcategory in the state
        }
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });

    // Handling delete subcategory
    builder
      .addCase(deleteSubCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.subCategories = state.subCategories.filter(
          (subCategory) => subCategory.id !== action.meta.arg
        );
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

// Export selectors
export const selectSubCategories = (state: { subCategory: SubCategoryState }) => state.subCategory.subCategories;
export const selectSubCategoryStatus = (state: { subCategory: SubCategoryState }) => state.subCategory.status;
export const selectSubCategoryError = (state: { subCategory: SubCategoryState }) => state.subCategory.error;
export const selectCurrentSubCategory = (state: { subCategory: SubCategoryState }) => state.subCategory.currentSubCategory;

export default subCategorySlice.reducer;
