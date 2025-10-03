import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";

interface Post {
    id: string;
    title: string;
    content: string;
    authorId: string;
    slug: string;
    tags: string[];
    image?: string;
    published: boolean;
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

interface PreviewPost {
    title: string;
    description?: string;
    content: string;
    image?: string | Blob;
    tags: string[];
}

type PostsResponse = {
    posts: Post[];
}

interface PostState {
    posts: Post[];
    loading: boolean;
    error: string | null;
    previewPost?: PreviewPost | null;
}

const initialState: PostState = {
    posts: [],
    loading: false,
    error: null,
    previewPost: null,
};


export const getPosts = createAsyncThunk<PostsResponse, void, { rejectValue: string }>('posts/getPosts', async (_, thunkAPI) => {
    try {
        const response = await axios.get('/api/dashboard/posts/new');
        return { posts: response.data.posts };
    } catch (error) {
        return thunkAPI.rejectWithValue("An error occurred");
    }
});



const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {

        setPostPreview: (state, action: PayloadAction<PreviewPost>) => {
            state.previewPost = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getPosts.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getPosts.fulfilled, (state, action) => {
            state.posts = action.payload.posts;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getPosts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    }
});
export const { setPostPreview } = postSlice.actions;
export default postSlice.reducer;