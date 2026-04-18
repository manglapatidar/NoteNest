import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import noteService from './noteService';

const initialState = {
  notes: [],
  note: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

export const getNotes = createAsyncThunk('notes/getAll', async (_, thunkAPI) => {
  try {
    return await noteService.getNotes();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getNoteById = createAsyncThunk('notes/getById', async (id, thunkAPI) => {
  try {
    return await noteService.getNoteById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createNote = createAsyncThunk('notes/create', async (formData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await noteService.createNote(formData, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const toggleSaveNote = createAsyncThunk('notes/toggleSave', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await noteService.toggleSaveNote(id, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteNote = createAsyncThunk('notes/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await noteService.deleteNote(id, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateNoteFile = createAsyncThunk('notes/update', async ({ id, formData }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await noteService.updateNoteFile(id, formData, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    resetNote: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearNote: (state) => {
      state.note = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotes.pending, (state) => { state.isLoading = true; })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notes = action.payload;
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getNoteById.pending, (state) => { state.isLoading = true; })
      .addCase(getNoteById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.note = action.payload;
      })
      .addCase(getNoteById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(createNote.pending, (state) => { state.isLoading = true; })
      .addCase(createNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notes.push(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(toggleSaveNote.fulfilled, (state, action) => {
        const idx = state.notes.findIndex((n) => n._id === action.payload._id);
        if (idx !== -1) state.notes[idx] = action.payload;
        if (state.note?._id === action.payload._id) state.note = action.payload;
      })

      .addCase(deleteNote.pending, (state) => { state.isLoading = true; })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notes = state.notes.filter((n) => n._id !== action.payload);
        if (state.note?._id === action.payload) state.note = null;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(updateNoteFile.pending, (state) => { state.isLoading = true; })
      .addCase(updateNoteFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const idx = state.notes.findIndex((n) => n._id === action.payload._id);
        if (idx !== -1) state.notes[idx] = action.payload;
        if (state.note?._id === action.payload._id) state.note = action.payload;
      })
      .addCase(updateNoteFile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetNote, clearNote } = noteSlice.actions;
export default noteSlice.reducer;