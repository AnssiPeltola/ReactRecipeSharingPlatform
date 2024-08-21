import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  sessionToken: string | null;
}

// Function to load the initial state from localStorage
const loadState = (): AuthState => {
  const sessionToken = localStorage.getItem("sessionToken");
  return {
    isLoggedIn: !!sessionToken,
    sessionToken,
  };
};

const initialState: AuthState = loadState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.sessionToken = action.payload.sessionToken;
      localStorage.setItem("sessionToken", action.payload.sessionToken);
    },
    logout(state) {
      state.isLoggedIn = false;
      state.sessionToken = null;
      localStorage.removeItem("sessionToken");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
