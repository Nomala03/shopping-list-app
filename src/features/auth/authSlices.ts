import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  id?: number;
  email: string;
  password: string;
  name: string;
  surname: string;
  cellphone: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isAuthenticated: !!localStorage.getItem("user")
};

export const registerUser = createAsyncThunk("auth/register", async (user: User) => {
  const res = await axios.post("http://localhost:5000/users", user);
  return res.data;
});

export const loginUser = createAsyncThunk("auth/login", async (credentials: { email: string; password: string }) => {
  const res = await axios.get(`http://localhost:5000/users?email=${credentials.email}`);
  const user = res.data[0];
  if (!user) throw new Error("User not found");
  return user;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    }
  },
  extraReducers: builder => {
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
