import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  list: [],
  error: '',
};

const slice = createSlice({
  name: 'recurringFrequencyTypes',
  initialState,
  reducers: {
    loadReccuringFrequecyTypes: (state, action) => {
      state.loading = action.payload;
    },
    setRecurringFrequecyTypes: (state, action) => {
      state.list = action.payload;
    },
    frequecyTypesError: (state, action) => {
      state.loading = true;
      state.error = action.payload;
    },
  },
});

export default slice.reducer;
export const {
  loadReccuringFrequecyTypes,
  setRecurringFrequecyTypes,
  frequecyTypesError,
} = slice.actions;
