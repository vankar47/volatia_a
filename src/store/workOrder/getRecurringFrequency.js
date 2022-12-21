import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  list: [],
  error: '',
};

const slice = createSlice({
  name: 'recurringFrequency',
  initialState,
  reducers: {
    loadReccuringFrequecy: (state, action) => {
      state.loading = action.payload;
    },
    setRecurringFrequecy: (state, action) => {
      state.list = action.payload;
    },
    frequecyError: (state, action) => {
      state.loading = true;
      state.error = action.payload;
    },
  },
});

export default slice.reducer;
export const {
  loadReccuringFrequecy,
  setRecurringFrequecy,
  frequecyError,
} = slice.actions;
