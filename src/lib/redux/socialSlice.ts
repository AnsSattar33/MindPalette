import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Comment {
    id: string;
    content: string;
    authorId: string;
    postId: string;
    createdAt: string;
    updatedAt: string;
    author: {
        id: string;
        name: string;
        email: string;
        password?: string;
        role: string;
    };
}

interface Like {
    id: string;
    userId: string;
    postId: string;
}

interface SocialState {
    comments: Comment[];
    loading: boolean;
    error: string | null;
    refresh: boolean;
}

const initialState: SocialState = {
    comments: [],
    loading: false,
    error: null,
    refresh: false
}


export const getComments = createAsyncThunk<
    Comment[],                // ✅ The return type (e.g. a single Comment)
    string,                 // ✅ The argument type (postId)
    { rejectValue: string } // ✅ The thunk API options
>(
    'comments/getComments',
    async (id, thunkAPI) => {
        try {
            const response = await axios.get(`/api/dashboard/comments/${id}`);
            const comments = response.data.comments
            return comments as Comment[];
        } catch (error) {
            return thunkAPI.rejectWithValue('Network error');
        }
    }
);

export const createComment = createAsyncThunk<Comment, Partial<Comment>, { rejectValue: string }>('comments/createComment', async (commentData, thunkAPI) => {
    try {
        const response = await axios.post('/api/dashboard/comments', commentData);
        return response.data as Comment
    } catch (error) {
        return thunkAPI.rejectWithValue("An error occurred");
    }
})

export const deleteComment = createAsyncThunk<void, string, { rejectValue: string }>('comments/deleteComment', async (id, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/dashboard/comments?id=${id}`);
        return response.data as void
    } catch (error) {
        return thunkAPI.rejectWithValue("An error occurred");
    }
})

export const updateComment = createAsyncThunk<Comment, Partial<Comment>, { rejectValue: string }>('comments/updateComment', async (commentData, thunkAPI) => {
    try {
        const response = await axios.put(`/api/dashboard/comments?id=${commentData.id}`, commentData);
        return response.data as Comment
    } catch (error) {
        return thunkAPI.rejectWithValue("An error occurred");
    }
})

export const likePost = createAsyncThunk<
    Like,
    { id: string; userId?: string },
    { rejectValue: string }
>(
    'post/postLike',
    async ({ id, userId }, thunkAPI) => {
        try {
            console.log("its running socialSlice =", id, "userId = ", userId)
            const response = await axios.post(`/api/dashboard/like`, { id, userId });
            return response.data as Like;
        } catch (error) {
            return thunkAPI.rejectWithValue('An error occurred');
        }
    }
);

export const getLike = createAsyncThunk<
    Like[],
    string,
    { rejectValue: string }
>(
    'post/getLike',
    async (id, thunkAPI) => {
        try {
            const response = await axios.get(`/api/dashboard/like/${id}`);
            return response.data as Like[];
        } catch (error) {
            return thunkAPI.rejectWithValue('An error occurred');
        }
    }
);

export const socialSlice = createSlice({

    name: "social",
    initialState,
    reducers: {
        setRefresh: (state, action: PayloadAction<boolean>) => {
            state.refresh = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getComments.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getComments.fulfilled, (state, action) => {
            state.comments = action.payload;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getComments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
        builder.addCase(createComment.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createComment.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
        });
        builder.addCase(createComment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    }
})

export const { setRefresh } = socialSlice.actions;
export default socialSlice.reducer;