import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  list: [{name: '', id: ''}],
  error: '',
};

const slice = createSlice({
  name: 'workOrder',
  initialState,
  reducers: {
    loadingWorkOrder: (state, action) => {
      state.loading = action.payload;
    },
    setWorkOrder: (state, action) => {
      state.list = action.payload;
    },
    workOrderError: (state, action) => {
      state.loading = true;
      state.error = action.payload;
    },
  },
});

export default slice.reducer;
export const {loadingWorkOrder, setWorkOrder, workOrderError} = slice.actions;
