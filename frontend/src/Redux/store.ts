import { configureStore } from "@reduxjs/toolkit";
import recipeReducer from "./recipeSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    recipe: recipeReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
