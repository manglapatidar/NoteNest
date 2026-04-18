// src/features/auth/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

//  get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
    user: user ? user : null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
};

// SLICE
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // logout
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("user");
        },

        // reset state
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
        },
    },

    extraReducers: (builder) => {
        builder
            // LOGIN pending
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })

            // LOGIN success
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })

            // LOGIN error
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })

      .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
        .addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        })
        .addCase(register.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            state.user = null;
        })
},
});


// LOGIN THUNK
export const login = createAsyncThunk( "auth/login", async (userData, thunkAPI) => {
        try {
            return await authService.login(userData);
        } catch (error) {
             let message = error?.response?.data?.message
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// REGISTER
export const register = createAsyncThunk("auth/register",async (userData, thunkAPI) => {
        try {
            return await authService.register(userData);
        } catch (error) {
            let message = error?.response?.data?.message
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const { logout, reset } = authSlice.actions;
export default authSlice.reducer;