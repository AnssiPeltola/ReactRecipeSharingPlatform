import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../Types/types";

interface AuthState {
  isLoggedIn: boolean;
  sessionToken: string | null;
  user: User | null;
}

// Function to load the initial state from localStorage
const loadState = (): AuthState => {
  const sessionToken = localStorage.getItem("sessionToken");
  return {
    isLoggedIn: !!sessionToken,
    sessionToken,
    user: null,
  };
};

const initialState: AuthState = loadState();

export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (token: string) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/getUserDetails`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const { password, ...userWithoutPassword } = response.data;
    return userWithoutPassword;
  }
);

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
      state.user = null;
      localStorage.removeItem("sessionToken");
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
