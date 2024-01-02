import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BASE_URL = "https://twitter-api-weilun9320.sigma-school-full-stack.repl.co";

// Async thunk for fetching a user's posts
export const fetchPostsByUser = createAsyncThunk(
  "posts/fetchByUser",
  async (userId) => {
    const res = await fetch(`${BASE_URL}/posts/user/${userId}`);

    return res.json();
  }
);

// Slice
const postsSlice = createSlice({
  name: "posts",
  initialState: { posts: [], loading: true },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPostsByUser.fulfilled, (state, action) => {
      state.posts = action.payload;
      state.loading = false;
    });
  },
});

export default postsSlice.reducer;