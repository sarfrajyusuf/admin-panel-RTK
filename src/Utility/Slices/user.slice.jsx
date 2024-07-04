import { createSlice } from "@reduxjs/toolkit";

// Slice
const initialState = { users: null, profile: null };


const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    loginUserState: (state, action) => {
      state.users = action.payload;
    },
    userProfile: (state, action) => {
      state.profile = action.payload;
    },
    logoutState: (state) => {
      console.log("STATE =>")
      state.users = null;
    },
  },
});

export const { loginUserState, userProfile, logoutState } = userSlice.actions;

export default userSlice.reducer;
