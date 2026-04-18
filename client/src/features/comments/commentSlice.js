import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commentService from './commentService';

const initialState = {
  comments: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const getComments = createAsyncThunk('comments/get', async (noteId, thunkAPI) => {
  try {
    return await commentService.getComments(noteId);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const postComment = createAsyncThunk('comments/post', async ({ noteId, text }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await commentService.postComment(noteId, text, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteComment = createAsyncThunk('comments/delete', async (commentId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await commentService.deleteComment(commentId, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    resetComments: (state) => {
      state.comments = [];
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComments.pending, (state) => { state.isLoading = true; })
      .addCase(getComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload.comment);
      })
      .addCase(postComment.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetComments } = commentSlice.actions;
export default commentSlice.reducer;