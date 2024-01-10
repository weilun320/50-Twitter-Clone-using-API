import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCommentsByPost = createAsyncThunk(
  "comments/fetchByPost",
  async (postId) => {
    try {
      const res = await fetch(`${process.env.BASE_URL}/comments/post/${postId}`);

      if (res.ok) {
        return res.json();
      }
      else {
        return [];
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState: { comments: [], loading: true },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCommentsByPost.fulfilled, (state, action) => {
      state.comments = action.payload;
      state.loading = false;
    });
  },
});

export default commentsSlice.reducer;