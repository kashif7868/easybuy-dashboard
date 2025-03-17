import { configureStore } from "@reduxjs/toolkit";
import sliderReducer from './reducer/sliderSlice';
import bannerReducer from './reducer/bannerSlice';
import categoryReducer from './reducer/categorySlice';
import subCategoryReducer from './reducer/subCategorySlice';
import smallCategoryReducer from './reducer/smallCategorySlice';
import productReducer from './reducer/productSlice'; 
import orderReducer from './reducer/orderSlice';
import userListReducer from "./reducer/userListSlice";
const store = configureStore({
  reducer: {
    slider: sliderReducer,
    banner: bannerReducer,
    category: categoryReducer,
    subCategory: subCategoryReducer,
    smallCategory: smallCategoryReducer,
    product: productReducer,
    order: orderReducer,
    users: userListReducer
  },
});

export default store;
