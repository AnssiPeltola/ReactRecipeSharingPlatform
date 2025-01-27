import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import recipeReducer from "./recipeSlice";
import authReducer from "./authSlice";
import recipeSwiperReducer from "./Reducers/recipeSwiperSlice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    recipe: recipeReducer,
    auth: persistedAuthReducer,
    recipeSwiper: recipeSwiperReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/FLUSH",
          "recipe/setSelectedFile",
          "recipe/setPreviewUrl",
        ],
        ignoredPaths: ["recipe.selectedFile"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
