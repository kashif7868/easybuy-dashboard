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
}

interface ContactState {
  contacts: Contact[];
  contact: Contact | null;
  loading: boolean;
  error: string | null;
}

// Thunks for API requests
export const createContact = createAsyncThunk<Contact, Contact, { rejectValue: string }>(
  'contacts/createContact',
  async (contactData, thunkAPI) => {
    try {
      const { data } = await axios.post(API_URL, contactData);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to create contact');
    }
  }
);

export const getAllContacts = createAsyncThunk<Contact[], void, { rejectValue: string }>(
  'contacts/getAllContacts',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(API_CONTACTS_URL);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch contacts');
    }
  }
);

export const getContactById = createAsyncThunk<Contact, number, { rejectValue: string }>(
  'contacts/getContactById',
  async (contactId, thunkAPI) => {
    try {
      const { data } = await axios.get(`${API_URL}/${contactId}`);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch contact');
    }
  }
);

export const updateContact = createAsyncThunk<Contact, { contactId: number; updatedData: Partial<Contact> }, { rejectValue: string }>(
  'contacts/updateContact',
  async ({ contactId, updatedData }, thunkAPI) => {
    try {
      const { data } = await axios.patch(`${API_URL}/${contactId}`, updatedData);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to update contact');
    }
  }
);

export const deleteContact = createAsyncThunk<number, number, { rejectValue: string }>(
  'contacts/deleteContact',
  async (contactId, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${contactId}`);
      return contactId;
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
    builder
      // Handle creating a contact
      .addCase(createContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContact.fulfilled, (state, action: PayloadAction<Contact>) => {
        state.loading = false;
        state.contacts.push(action.payload);
      })
      .addCase(createContact.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetching all contacts
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
      })
      
      // Handle fetching a contact by ID
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
      })
      
      // Handle updating a contact
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContact.fulfilled, (state, action: PayloadAction<Contact>) => {
        state.loading = false;
        const index = state.contacts.findIndex(contact => contact.id === action.payload.id);
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
      })
      .addCase(updateContact.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle deleting a contact
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.contacts = state.contacts.filter(contact => contact.id !== action.payload);
      })
      .addCase(deleteContact.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default contactSlice.reducer;
