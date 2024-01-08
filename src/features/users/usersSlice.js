import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Async thunk for fetching specific user's details
export const fetchUserDetails = createAsyncThunk(
  "users/fetchDetails",
  async (userId) => {
    const res = await fetch(`${process.env.BASE_URL}/profile/${userId}`);

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