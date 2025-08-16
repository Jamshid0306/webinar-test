import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Question {
  id: number;
  question: string;
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
}

interface TestState {
  options: { types: string; id: number; name: string }[];
  selected: number | null;
  questions: Question[];
  answers: { [key: number]: string };
  loading: boolean;
  error: string | null;
}

const initialState: TestState = {
  options: [],
  selected: null,
  questions: [],
  answers: {},
  loading: false,
  error: null,
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchOptions = createAsyncThunk(
  "test/fetchOptions",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get(`${API_BASE_URL}/bussiness-options`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      console.log("fetchOptions response:", res.data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Server error");
    }
  }
);

export const submitSelection = createAsyncThunk(
  "test/submitSelection",
  async (id: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get(`${API_BASE_URL}/test/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Server error");
    }
  }
);

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<number>) => {
      state.selected = action.payload;
    },
    setAnswer: (
      state,
      action: PayloadAction<{ id: number; answer: string }>
    ) => {
      state.answers[action.payload.id] = action.payload.answer;
    },
    resetTest: (state) => {
      state.selected = null;
      state.questions = [];
      state.answers = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.options = action.payload;
      })
      .addCase(fetchOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(submitSelection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitSelection.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(submitSelection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelected, setAnswer, resetTest } = testSlice.actions;
export default testSlice.reducer;
