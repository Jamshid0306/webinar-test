import { useNavigate } from "react-router-dom";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
interface AuthState {
  user: { phone_number: string; token: string; username: string } | null;
  isLoggedIn: boolean;
  error: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    data: { phone_number: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://0.0.0.0:8000/login",
        data
      );
      if (response.data.access_token) {
        localStorage.setItem("access", response.data.access_token);
      }
      return {
        phone_number: response.data.user.phone_number,
        username: response.data.user.username,
        token: response.data.access_token,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Server error");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    data: { phone_number: string; username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://0.0.0.0:8000/register",
        data
      );

      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Server error");
    }
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("access");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (
          state,
          action: PayloadAction<{
            phone_number: string;
            token: string;
            username: string;
          }>
        ) => {
          state.loading = false;
          state.user = action.payload;
          state.isLoggedIn = true;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (
          state,
          action: PayloadAction<{
            phone_number: string;
            token: string;
            username: string;
          }>
        ) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
