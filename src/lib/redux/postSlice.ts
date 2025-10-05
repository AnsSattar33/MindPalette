import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";

interface Post {
    id: string;
    title: string;
    description?: string;
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
    imageFile?: File | null;
    tags: string[];
}

type PostsResponse = {
    posts: Post[];
}

type PostEditable = {
    id: string;
    isEditing: boolean;
}

interface PostState {
    posts: Post[];
    loading: boolean;
    error: string | null;
    previewPost?: PreviewPost | null;
    isEditing?: boolean;
}

interface CreatePostResponse {
    title: string;
    content: string;
    description?: string;
    tags: string[];
    image?: string;
    published: boolean;
}
const initialState: PostState = {
    posts: [],
    loading: false,
    error: null,
    previewPost: null,
    isEditing: false,
};


export const getPosts = createAsyncThunk<PostsResponse, void, { rejectValue: string }>('posts/getPosts', async (_, thunkAPI) => {
    try {
        const response = await axios.get('/api/dashboard/posts/new');
        return { posts: response.data.posts };
    } catch (error) {
        return thunkAPI.rejectWithValue("An error occurred");
    }
});

export const savePost = createAsyncThunk<CreatePostResponse, Partial<Post>, { rejectValue: string }>('posts/savePost', async (postData, thunkAPI) => {
    try {
        const response = await axios.post('/api/dashboard/posts/new', postData);
        return response.data;
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
        },

        isPostEditing: (state, action: PayloadAction<boolean>) => {
            state.isEditing = action.payload;
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
        builder.addCase(savePost.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(savePost.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
        });
        builder.addCase(savePost.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    }
});
export const { setPostPreview, isPostEditing } = postSlice.actions;
export default postSlice.reducer;