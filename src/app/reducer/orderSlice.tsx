import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface UserDetails {
  name: string;
  mobile: string;
  email: string;
  country: string;
  province: string;
  city: string;
  postalCode: string;
  apartment: string;
  address: string;
  shipToDifferentAddress: boolean;
  deliveryAddress: string | null;
}

interface CartItem {
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
  qty: number;
  selectedSize: string;
  total: number;
}

interface Order {
  id: number;
  orderId: string;
  userDetails: UserDetails;
  cart: CartItem[];
  paymentMethod: string;
  selectedBank: string;
  subtotal: string;
  deliveryCharges: string;
  grandTotal: string;
  status: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

interface Metrics {
  customersCount: number;
  ordersCount: number;
  totalSales: string;
  status: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  metrics: Metrics | null; // New field to hold metrics
}

// Async thunk to fetch all orders
export const fetchOrders = createAsyncThunk<Order[]>(
  'order/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8000/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch metrics
export const fetchMetrics = createAsyncThunk<Metrics>(
  'order/fetchMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8000/api/metrics');
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch an order by its ID
export const fetchOrderById = createAsyncThunk<Order, string>(
  'order/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8000/api/order/${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order by ID');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to delete an order by its ID
export const deleteOrder = createAsyncThunk<void, string>(
  'order/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8000/api/order/${orderId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete order');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update the status of an order
export const updateOrderStatus = createAsyncThunk<void, { orderId: string; status: string }>(
  'order/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8000/api/order/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    currentOrder: null,
    status: 'idle',
    error: null,
    metrics: null, // Initialize metrics as null
  } as OrderState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action: PayloadAction<string>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handle fetch order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action: PayloadAction<string>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handle delete order
      .addCase(deleteOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = state.orders.filter(order => order.orderId !== action.meta.arg);
      })
      .addCase(deleteOrder.rejected, (state, action: PayloadAction<string>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handle update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateOrderStatus.fulfilled, (state) => {
        state.status = 'succeeded';
        // Update order status locally if necessary
      })
      .addCase(updateOrderStatus.rejected, (state, action: PayloadAction<string>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handle fetch metrics
      .addCase(fetchMetrics.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMetrics.fulfilled, (state, action: PayloadAction<Metrics>) => {
        state.status = 'succeeded';
        state.metrics = action.payload;
      })
      .addCase(fetchMetrics.rejected, (state, action: PayloadAction<string>) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
