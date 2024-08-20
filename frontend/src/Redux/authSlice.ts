import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  isLoggedIn: boolean;
  sessionToken: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  sessionToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.sessionToken = action.payload.sessionToken;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.sessionToken = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
