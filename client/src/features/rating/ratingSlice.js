import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ratingService from './ratingService';

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

export const rateNote = createAsyncThunk('rating/rate', async ({ noteId, rating }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await ratingService.rateNote(noteId, rating, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const ratingSlice = createSlice({
  name: 'rating',
  initialState,
  reducers: {
    resetRating: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(rateNote.pending, (state) => { state.isLoading = true; })
      .addCase(rateNote.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(rateNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetRating } = ratingSlice.actions;
export default ratingSlice.reducer;