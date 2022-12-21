import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  list: [{label: '', value: ''}],
  error: '',
};

const slice = createSlice({
  name: 'workOrder',
  initialState,
  reducers: {
    loadingServices: (state, action) => {
      state.loading = action.payload;
    },
    setServices: (state, action) => {
      state.list = action.payload;
    },
    ServicesError: (state, action) => {
      state.loading = true;
      state.error = action.payload;
    },
  },
});

export default slice.reducer;
export const {loadingServices, setServices, ServicesError} = slice.actions;
