import { createSlice } from "@reduxjs/toolkit";

const initialState = { toast: {} };
const toastSlice = createSlice({
  name: "toast",
  initialState: initialState,
  reducers: {
    toastState: (state, action) => {
      state.toast = action.payload;
    },
  },
});

export const { toastState } = toastSlice.actions;

export default toastSlice.reducer;
