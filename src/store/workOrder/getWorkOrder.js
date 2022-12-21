import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  list: [],
  error: '',
};

const slice = createSlice({
  name: 'workOrder',
  initialState,
  reducers: {
    loadingGetWorkOrder: (state, action) => {
      state.loading = action.payload;
    },
    setGetWorkOrder: (state, action) => {
      state.list = action.payload;
    },
    getWorkOrderError: (state, action) => {
      state.loading = true;
      state.error = action.payload;
    },
  },
});

export default slice.reducer;
export const {
  loadingGetWorkOrder,
  setGetWorkOrder,
  getWorkOrderError,
} = slice.actions;
