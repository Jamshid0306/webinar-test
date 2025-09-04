// testSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

type Question = {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_a_score: number;
  option_b_score: number;
  option_c_score: number;
  option_d_score: number;
  bussiness?: { id: number; types: string };
};


interface TestState {
  options: { types: string; id: number }[];
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
      const res = await axios.get(`${API_BASE_URL}/businesses`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Server error");
    }
  }
);

export const submitSelection = createAsyncThunk(
  "test/submitSelection",
  async (payload: { businessId: number }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/tests/?business_id=${payload.businessId}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

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
