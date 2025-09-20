import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '../modules/auth/reducer'
import { chatReducer } from '../modules/chat/reducer'
import { chatHistoryReducer } from '../modules/chatHistory/reducer'
import { threadsReducer } from '../modules/threads/reducer'
import { globalReducer } from '../modules/global/reducer'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    chatHistory: chatHistoryReducer,
    threads: threadsReducer,
    global: globalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
