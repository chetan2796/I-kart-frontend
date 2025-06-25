import { configureStore } from '@reduxjs/toolkit'
import productReducer from './features/editProducts/editProductSlice'
import productListReducer from './features/editProducts/editProductListSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      product: productReducer,
      productList: productListReducer
    },
  })
}