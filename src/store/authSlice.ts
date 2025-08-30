import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  user: { phone_number: string; token?: string; fullname?: string; age?: string } | null;
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 🔹 Faqat login (o‘zgartirmadik)
export const loginUser = createAsyncThunk(
  "/register",
  async (
    data: { phone_number: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, data);
      if (response.data.access_token) {
        localStorage.setItem("access", response.data.access_token);
      }
      return {
        phone_number: response.data.user.phone_number,
        fullname: response.data.user.fullname,
        age: response.data.user.age,
        token: response.data.access_token,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Server error");
    }
  }
);

// 🔹 Yangi: faqat fullname, age, phone_number yuboradigan ro‘yxatdan o‘tish
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    data: { fullname: string; age: string; phone_number: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
      // Agar token bo‘lsa localStorage saqlash (ixtiyoriy)
      if (response.data.access_token) {
        localStorage.setItem("access", response.data.access_token);
      }
      return {
        phone_number: response.data.user.phone_number,
        fullname: response.data.user.fullname,
        age: response.data.user.age,
        token: response.data.access_token,
      };
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
      // LOGIN
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
            token?: string;
            fullname?: string;
            age?: string;
          }>
        ) => {
          state.loading = false;
          state.user = action.payload;
          state.isLoggedIn = !!action.payload.token;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // REGISTER
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
            token?: string;
            fullname?: string;
            age?: string;
          }>
        ) => {
          state.loading = false;
          state.user = action.payload;
          state.isLoggedIn = !!action.payload.token;
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
