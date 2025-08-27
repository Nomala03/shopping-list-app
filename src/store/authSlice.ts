import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { loginUser, registerUser, updateUser } from "../api/authApi";
import type { LoginPayload, RegisterPayload, User } from "../types";

export interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const saved = localStorage.getItem("auth:user");
const initialState: AuthState = {
  user: saved ? (JSON.parse(saved) as User) : null,
  status: "idle",
  error: null,
};

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload: RegisterPayload, thunkAPI) => {
    try {
      const user = await registerUser(payload);
      return user;
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Registration failed";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, thunkAPI) => {
    try {
      const user = await loginUser(payload);
      return user;
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Login failed";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const updateProfileThunk = createAsyncThunk(
  "auth/updateProfile",
  async (
    {
      userId,
      updates,
    }: {
      userId: number;
      updates: Partial<Omit<User, "id">> & { password?: string };
    },
    thunkAPI
  ) => {
    try {
      const updated = await updateUser(userId, updates);
      return updated;
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Update failed";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem("auth:user");
    },
  },
  extraReducers: (builder) => {
    builder
      //Register
      .addCase(registerThunk.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(registerThunk.fulfilled, (s) => {
        s.status = "succeeded";
      })
      .addCase(registerThunk.rejected, (s, a) => {
        s.status = "failed";
        s.error = (a.payload as string) ?? "Registration failed";
      })
      //Login
      .addCase(loginThunk.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(loginThunk.fulfilled, (s, a: PayloadAction<User>) => {
        s.status = "succeeded";
        s.user = a.payload;
        localStorage.setItem("auth:user", JSON.stringify(a.payload));
      })
      .addCase(loginThunk.rejected, (s, a) => {
        s.status = "failed";
        s.error = (a.payload as string) ?? "Login failed";
      })
      //Update Profile
      .addCase(updateProfileThunk.fulfilled, (s, a: PayloadAction<User>) => {
        s.user = a.payload;
        localStorage.setItem("auth:user", JSON.stringify(a.payload));
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
