import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

// Define types for Product and the related Category, Subcategory, and Small Category
interface Category {
  id: number;
  category_name: string;
  image: string;
  created_at: string;
  updated_at: string;
}

interface Subcategory {
  id: number;
  subCategoryName: string;
  category_name: string;
  category_id: number;
  created_at: string;
  updated_at: string;
}

interface SmallCategory {
  id: number;
  small_category_name: string;
  category_id: number;
  subcategory_id: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  discount_price: string;
  discount_percentage: string;
  rating: number;
  reviews: number;
  description: string;
  images: string;
  additional_images: string[];
  color: string;
  brand: string;
  meter: string;
  size: string;
  items_stock: number;
  category_id: number;
  subcategory_id: number;
  small_category_id: number;
  featured: boolean;
  deal_of_the_day: boolean;
  best_seller: boolean;
  top_offer_product: boolean;
  created_at: string;
  updated_at: string;
  category: Category;
  subcategory: Subcategory;
  small_category: SmallCategory;
}

interface ProductState {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
}

// Fetch all products
export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'product/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch a single product by ID
export const fetchProductById = createAsyncThunk<Product, number, { rejectValue: string }>(
  'product/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/product/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create a new product
export const createProduct = createAsyncThunk<Product, FormData, { rejectValue: string }>(
  'product/createProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/product`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      // Log the error response to the console for debugging
      console.error(error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// Update a product
export const updateProduct = createAsyncThunk<Product, { id: number; formData: FormData }, { rejectValue: string }>(
  'product/updateProduct',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${BASE_URL}/product/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk<void, number, { rejectValue: string }>(
  'product/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/product/${id}`);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState: ProductState = {
  products: [],
  product: null,
  loading: false,
  error: null,
};

// Create the product slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetch all products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle fetch single product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        const index = state.products.findIndex((product) => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload; // Update the product in the state
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((product) => product.id !== action.meta.arg); // Remove the deleted product
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export the reducer for the store
export default productSlice.reducer;

// Selectors for accessing the state
export const selectProducts = (state: { product: ProductState }) => state.product.products;
export const selectProductStatus = (state: { product: ProductState }) => state.product.loading;
export const selectProductError = (state: { product: ProductState }) => state.product.error;
