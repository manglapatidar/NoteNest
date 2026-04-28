import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import adminReducer from "../features/admin/AdminSlice";
import noteReducer from "../features/notes/noteSlice";
import commentReducer from "../features/comments/commentSlice";
import ratingReducer from "../features/rating/ratingSlice";
import profileReducer from "../features/profile/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    notes: noteReducer,
    comments: commentReducer,
    rating: ratingReducer,
    profile: profileReducer,
  },
});