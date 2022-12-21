import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  list: [],
  error: '',
};

const slice = createSlice({
  name: 'getClientComments',
  initialState,
  reducers: {
    loadClientComment: (state, action) => {
      state.loading = action.payload;
    },
    setClientComment: (state, action) => {
      state.list = action.payload;
    },
    clientCommentError: (state, action) => {
      state.loading = true;
      state.error = action.payload;
    },
  },
});

export default slice.reducer;
export const {
  loadClientComment,
  setClientComment,
  clientCommentError,
} = slice.actions;
