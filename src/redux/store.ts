import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { shopApi } from './shopApi';
import userReducer from './slices/UserSlice';
import messagesArrayReducer from './slices/MessagesArraySlice';

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['user'],
};

const rootReduser = combineReducers({
  [shopApi.reducerPath]: shopApi.reducer,
  user: userReducer,
  messagesArray: messagesArrayReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReduser);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          'messagesArray/addLoadingMessage',
          'messagesArray/updateProgressKeyInMessage',
        ],
        ignoredPaths: ['messagesArray.messagesArray'], // убрать ошибку сериализации состояния из-за File в объекте
      },
    }),
});

export const persistor = persistStore(store);
