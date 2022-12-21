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
    loadingLanguages: (state, action) => {
      state.loading = action.payload;
    },
    setLanguages: (state, action) => {
      state.list = action.payload;
    },
    languagesError: (state, action) => {
      state.loading = true;
      state.error = action.payload;
    },
  },
});

export default slice.reducer;
export const {loadingLanguages, setLanguages, languagesError} = slice.actions;
