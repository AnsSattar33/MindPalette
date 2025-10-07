import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import postSlice from './postSlice';
import socialSlice from './socialSlice';
export const store = configureStore({
    reducer: {
        auth: authSlice,
        posts: postSlice,
        social: socialSlice
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;