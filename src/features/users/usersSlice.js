import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BASE_URL = "https://b8b50c4b-de8f-426c-ad74-875a697d35e4-00-ppgcvyyh91fa.teams.replit.dev";

// Async thunk for fetching specific user's details
export const fetchUserDetails = createAsyncThunk(
  "users/fetchDetails",
  async (userId) => {
    const res = await fetch(`${BASE_URL}/profile/${userId}`);

    return res.json();
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: { userDetails: null, loading: true },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserDetails.fulfilled, (state, action) => {
      state.userDetails = action.payload;
      state.loading = false;
    });
  },
});

export default usersSlice.reducer;