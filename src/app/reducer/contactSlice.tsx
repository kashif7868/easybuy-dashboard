import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the API endpoints
const API_URL = 'http://localhost:8000/api/contact';
const API_CONTACTS_URL = 'http://localhost:8000/api/contacts';

// Define types for the contact data and state
interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  updated_at: string;
}

interface ContactState {
  contacts: Contact[];
  contact: Contact | null;
  loading: boolean;
  error: string | null;
}

// Thunks for API requests

// Get all contacts
export const getAllContacts = createAsyncThunk<Contact[], void, { rejectValue: string }>(
  'contacts/getAllContacts',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(API_CONTACTS_URL);
      return data.contacts;  // Assuming API returns an object with 'contacts' array
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch contacts');
    }
  }
);

// Get a contact by ID
export const getContactById = createAsyncThunk<Contact, number, { rejectValue: string }>(
  'contacts/getContactById',
  async (contactId, thunkAPI) => {
    try {
      const { data } = await axios.get(`${API_URL}/${contactId}`);
      return data;  // Assuming API returns the contact object
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch contact by ID');
    }
  }
);

// Delete a contact
export const deleteContact = createAsyncThunk<number, number, { rejectValue: string }>(
  'contacts/deleteContact',
  async (contactId, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${contactId}`);
      return contactId;  // Return the contact ID that was deleted
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to delete contact');
    }
  }
);

// Initial state
const initialState: ContactState = {
  contacts: [],
  contact: null,
  loading: false,
  error: null,
};

// Contact slice
const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetching all contacts
    builder
      .addCase(getAllContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllContacts.fulfilled, (state, action: PayloadAction<Contact[]>) => {
        state.loading = false;
        state.contacts = action.payload;
      })
      .addCase(getAllContacts.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle fetching a contact by ID
    builder
      .addCase(getContactById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContactById.fulfilled, (state, action: PayloadAction<Contact>) => {
        state.loading = false;
        state.contact = action.payload;
      })
      .addCase(getContactById.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle deleting a contact
    builder
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.contacts = state.contacts.filter((contact) => contact.id !== action.payload);
      })
      .addCase(deleteContact.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default contactSlice.reducer;
