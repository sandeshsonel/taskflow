import authReducer from '@/store/slices/authSlice'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // slices you want to persist
}

const rootReducer = combineReducers({
  auth: authReducer,
  // add more slices here
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist uses non-serializable values
    }),
})

export const persistor = persistStore(store)
// Inferred types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
