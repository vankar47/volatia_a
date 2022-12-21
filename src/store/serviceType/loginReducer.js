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
    loadingLoginData: (state, action) => {
      state.loading = action.payload;
    },
    saveLoginData: (state, action) => {
      state.list = action.payload;
    },
    errorLoginData: (state, action) => {
      state.loading = true;
      state.error = action.payload;
    },
  },
});

export default slice.reducer;
export const {loadingLoginData, saveLoginData, errorLoginData} = slice.actions;
