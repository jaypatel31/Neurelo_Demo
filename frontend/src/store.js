import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./StateSlice/loginSlice";
import userReducer from "./StateSlice/userSlice";
import categoryReducer from "./StateSlice/categorySlice";

export default configureStore({
    reducer: {
        login: loginReducer,
        user: userReducer,
        category: categoryReducer
    },
});