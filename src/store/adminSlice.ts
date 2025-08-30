import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AdminState {
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  user: string | null;
}

const initialState: AdminState = {
  isLoggedIn: false,
  loading: false,
  error: null,
  user: null,
};
const url = import.meta.env.VITE_API_BASE_URL
// 🔥 login thunk
export const loginAdmin = createAsyncThunk(
  "admin/login",
  async ({ username, password }: { username: string; password: string }) => {
    const res = await axios.post(`${url}/tests`, {
      username,
      password,
    });
    return res.data; // { username: "...", token: "..." } bo‘lishi kerak
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.username; // backend qaytargan username
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      });
  },
});

export const { logout } = adminSlice.actions;
export default adminSlice.reducer;
