//store.ts

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistStore,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import userSlice from "./Slices/user.slice";
import { loginAPI } from "./Services/UserLoginAPI";
// import toastSlice from "./Slices/toast.slice";
import { transactionsAPI } from "./Services/TransactionsAPI";
import { swapcoinsAPI } from "./Services/SwapcoinAPI";
import { swapTransactionAPI } from "./Services/SwapTransactionAPI";
import { userListAPI } from "./Services/UserListAPI";
import { userDataList } from "./Services/UserDataListAPI";
import { tokenManagementAPI } from "./Services/TokenManagmentAPI";
import { addTokenAPI } from "./Services/AddTokenAPI";
import { referralListAPI } from "./Services/ReferralApi";
const persistConfig = { key: "root", storage };

const appReducer = combineReducers({
  user: userSlice,
  // toast: toastSlice,
  [loginAPI.reducerPath]: loginAPI.reducer,
  [transactionsAPI.reducerPath]: transactionsAPI.reducer,
  [swapcoinsAPI.reducerPath]: swapcoinsAPI.reducer,
  [swapTransactionAPI.reducerPath]: swapTransactionAPI.reducer,
  [userListAPI.reducerPath]: userListAPI.reducer,
  [userDataList.reducerPath]: userDataList.reducer,
  [tokenManagementAPI.reducerPath]: tokenManagementAPI.reducer,
  [addTokenAPI.reducerPath]: addTokenAPI.reducer,
  [referralListAPI.reducerPath]: referralListAPI.reducer,
  
});

const persistedReducer = persistReducer(persistConfig, appReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      loginAPI.middleware,
      transactionsAPI.middleware,
      swapcoinsAPI.middleware,
      swapTransactionAPI.middleware,
      userListAPI.middleware,
      userDataList.middleware,
      tokenManagementAPI.middleware,
      addTokenAPI.middleware,
      referralListAPI.middleware,
    ),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
