import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  list: '',
  error: '',
};

const slice = createSlice({
  name: 'workOrder',
  initialState,
  reducers: {
    loadingAssignData: (state, action) => {
      state.loading = action.payload;
    },
    setAssignData: (state, action) => {
      state.list = action.payload;
    },
    AssignDataError: (state, action) => {
      state.loading = true;
      state.error = action.payload;
    },
  },
});

export default slice.reducer;
export const {
  loadingAssignData,
  setAssignData,
  AssignDataError,
} = slice.actions;
