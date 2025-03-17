import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define types for the category data
interface Category {
  id: number;
  category_name: string;
  image: string;
  created_at: string;
  updated_at: string;
}

// Define the state type
interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Async thunk to fetch all categories
export const fetchCategories = createAsyncThunk<Category[]>(
  'category/fetchCategories',
  async () => {
    const response = await axios.get('http://localhost:8000/api/categories');
    return response.data;
  }
);

// Async thunk to fetch category by ID
export const fetchCategoryById = createAsyncThunk<Category, number>(
  'category/fetchCategoryById',
  async (categoryId) => {
    const response = await axios.get(`http://localhost:8000/api/category/${categoryId}`);
    return response.data;
  }
);

// Async thunk to create a new category
export const createCategory = createAsyncThunk<Category, FormData>(
  'category/createCategory',
  async (formData) => {
    const response = await axios.post('http://localhost:8000/api/category', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

// Async thunk to update an existing category
export const updateCategory = createAsyncThunk<Category, { id: number; formData: FormData }>(
  'category/updateCategory',
  async ({ id, formData }) => {
    const response = await axios.patch(`http://localhost:8000/api/category/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

// Async thunk to delete a category
export const deleteCategory = createAsyncThunk<void, number>(
  'category/deleteCategory',
  async (id) => {
    await axios.delete(`http://localhost:8000/api/category/${id}`);
  }
);

// Initial state for the category slice
const initialState: CategoryState = {
  categories: [],
  currentCategory: null,
  status: 'idle',
  error: null,
};

// Create the category slice
const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handling categories fetch
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });

    // Handling fetch category by ID
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategoryById.fulfilled, (state, action: PayloadAction<Category>) => {
        state.status = 'succeeded';
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });

    // Handling create category
    builder
      .addCase(createCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.status = 'succeeded';
        state.categories.push(action.payload); // Add the new category to the state
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });

    // Handling update category
    builder
      .addCase(updateCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.status = 'succeeded';
        const index = state.categories.findIndex((category) => category.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload; // Update the category in the state
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });

    // Handling delete category
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = state.categories.filter((category) => category.id !== action.meta.arg); // Remove the category from the state
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

// Export selectors to access categories, current category, status, and error
export const selectCategories = (state: { category: CategoryState }) => state.category.categories;
export const selectCategoryStatus = (state: { category: CategoryState }) => state.category.status;
export const selectCategoryError = (state: { category: CategoryState }) => state.category.error;
export const selectCurrentCategory = (state: { category: CategoryState }) => state.category.currentCategory;

export default categorySlice.reducer;
