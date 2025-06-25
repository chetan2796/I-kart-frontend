// src/store/slices/productSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedProductList: [],
};

const productListSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSelectedProductList: (state, action) => {
      state.selectedProductList.push(action.payload);
    },
  },
});

export const { setSelectedProductList } = productListSlice.actions;
export default productListSlice.reducer;
