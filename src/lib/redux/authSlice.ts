import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios"
import { log } from "console";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

type UserResponse = {
    user: User;
    token: string;
}

interface AuthSatate {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthSatate = {
    user: null,
    token: null,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk<UserResponse, { email: string, password: string }, { rejectValue: string }>('auth/loginUser', async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
        const response = await axios.post('/api/auth/login', { email, password });
        return { user: response.data.user, token: response.data.token };
    } catch (error) {
        return thunkAPI.rejectWithValue("An error occurred");
    }
});

const authSlice = createSlice({

    name: "auth",
    initialState,
    reducers: {

        logoutUser: (state) => {
            state.user = null;
            state.token = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    }

});

export const { logoutUser } = authSlice.actions;

export default authSlice.reducer;