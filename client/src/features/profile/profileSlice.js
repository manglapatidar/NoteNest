import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import profileService from './profileService';

const initialState = {
  myNotes: [],
  savedNotes: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const getMyNotes = createAsyncThunk('profile/getMyNotes', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await profileService.getMyNotes(token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getSavedNotes = createAsyncThunk('profile/getSavedNotes', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await profileService.getSavedNotes(token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    removeFromMyNotes: (state, action) => {
      state.myNotes = state.myNotes.filter((n) => n._id !== action.payload);
    },
    resetProfile: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyNotes.pending, (state) => { state.isLoading = true; })
      .addCase(getMyNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myNotes = action.payload;
      })
      .addCase(getMyNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getSavedNotes.pending, (state) => { state.isLoading = true; })
      .addCase(getSavedNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savedNotes = action.payload;
      })
      .addCase(getSavedNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { removeFromMyNotes, resetProfile } = profileSlice.actions;
export default profileSlice.reducer;