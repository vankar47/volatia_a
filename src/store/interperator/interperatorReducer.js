import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  list: [{name: '', label: ''}],
  error: '',
};

const slice = createSlice({
  name: 'workOrder',
  initialState,
  reducers: {
    loadingInterprator: (state, action) => {
      state.loading = action.payload;
    },
    setInterperator: (state, action) => {
      state.list = action.payload;
    },
    InterperatorError: (state, action) => {
      state.loading = true;
      state.error = action.payload;
    },
  },
});

export default slice.reducer;
export const {
  loadingInterprator,
  setInterperator,
  InterperatorError,
} = slice.actions;
