import { configureStore } from '@reduxjs/toolkit'
import productReducer from './features/editProducts/editProductSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      product: productReducer,
    },
  })
}