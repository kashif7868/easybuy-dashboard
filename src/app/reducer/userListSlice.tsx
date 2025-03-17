import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Type for a single user
interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

// Type for the state
interface UserListState {
  users: User[];
  loading: boolean;
  error: string | null;
}

// Thunk for fetching users
export const fetchUsers = createAsyncThunk<User[]>(
  'users/fetchUsers',
  async () => {
    const response = await axios.get('http://localhost:8000/api/auth/users');
    // Map data to required format with sequential IDs
    const usersWithSequentialId = response.data.map((user: any, index: number) => ({
      id: index + 1,  // Sequential ID
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    }));
    return usersWithSequentialId;
  }
);

// Thunk for deleting a user
export const deleteUser = createAsyncThunk<number, number>(
  'users/deleteUser',
  async (userId) => {
    await axios.delete(`http://localhost:8000/api/auth/users/${userId}`);
    return userId;  // Return userId to remove from state
  }
);

// Thunk for updating a user
interface UpdateUserPayload {
  userId: number;
  userData: Partial<User>;
}

export const updateUser = createAsyncThunk<User, UpdateUserPayload>(
  'users/updateUser',
  async ({ userId, userData }) => {
    const { data } = await axios.patch(`http://localhost:8000/api/auth/users/${userId}`, userData);
    return data;  // Return the updated user data
  }
);

const userListSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  } as UserListState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load users';
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      // Update user
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });
  },
});

export default userListSlice.reducer;
