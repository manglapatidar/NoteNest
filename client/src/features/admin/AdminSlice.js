import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from './AdminService';

const initialState = {
  stats: null,
  notes: [],
  pendingNotes: [],
  allNotes: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

export const getStats = createAsyncThunk('admin/getStats', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await adminService.getStats(token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getNotes = createAsyncThunk('admin/getNotes', async (status, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await adminService.getNotes(token, status);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getPendingNotes = createAsyncThunk('admin/getPendingNotes', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await adminService.getPendingNotes(token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getAllNotes = createAsyncThunk('admin/getAllNotes', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await adminService.getAllNotes(token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const approveNote = createAsyncThunk('admin/approveNote', async (noteId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    await adminService.approveNote(noteId, token);
    return noteId;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const rejectNote = createAsyncThunk('admin/rejectNote', async (noteId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    await adminService.rejectNote(noteId, token);
    return noteId;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteNote = createAsyncThunk('admin/deleteNote', async (noteId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    await adminService.deleteNote(noteId, token);
    return noteId;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // getStats
      .addCase(getStats.pending, (state) => { state.isLoading = true; })
      .addCase(getStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.stats = action.payload;
      })
      .addCase(getStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // getNotes
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

      // getPendingNotes
      .addCase(getPendingNotes.pending, (state) => { state.isLoading = true; })
      .addCase(getPendingNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.pendingNotes = action.payload;
      })
      .addCase(getPendingNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // getAllNotes
      .addCase(getAllNotes.pending, (state) => { state.isLoading = true; })
      .addCase(getAllNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.allNotes = action.payload;
      })
      .addCase(getAllNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // approveNote - remove from pendingNotes, update in allNotes
      .addCase(approveNote.pending, (state) => { state.isLoading = true; })
      .addCase(approveNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const id = action.payload;
        state.pendingNotes = state.pendingNotes.filter((n) => n._id !== id);
        const idx = state.allNotes.findIndex((n) => n._id === id);
        if (idx !== -1) state.allNotes[idx].status = 'Approved';
        const idx2 = state.notes.findIndex((n) => n._id === id);
        if (idx2 !== -1) state.notes[idx2].status = 'approved';
      })
      .addCase(approveNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // rejectNote - remove from pendingNotes, update in allNotes
      .addCase(rejectNote.pending, (state) => { state.isLoading = true; })
      .addCase(rejectNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const id = action.payload;
        state.pendingNotes = state.pendingNotes.filter((n) => n._id !== id);
        const idx = state.allNotes.findIndex((n) => n._id === id);
        if (idx !== -1) state.allNotes[idx].status = 'Rejected';
        const idx2 = state.notes.findIndex((n) => n._id === id);
        if (idx2 !== -1) state.notes[idx2].status = 'rejected';
      })
      .addCase(rejectNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // deleteNote - remove from all state arrays
      .addCase(deleteNote.pending, (state) => { state.isLoading = true; })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notes        = state.notes.filter((n) => n._id !== action.payload);
        state.pendingNotes = state.pendingNotes.filter((n) => n._id !== action.payload);
        state.allNotes     = state.allNotes.filter((n) => n._id !== action.payload);
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = adminSlice.actions;
export default adminSlice.reducer;