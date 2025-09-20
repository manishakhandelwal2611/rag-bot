import { createReducer } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ChatHistoryItem } from '../../types/chat'
import { CHAT_HISTORY_ACTIONS } from './actions'

export interface ChatHistoryState {
  chats: ChatHistoryItem[]
  selectedChatId: string | null
}

const initialState: ChatHistoryState = {
  chats: [],
  selectedChatId: null,
}

export const chatHistoryReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(CHAT_HISTORY_ACTIONS.LOAD_CHAT_HISTORY, (state, action: PayloadAction<ChatHistoryItem[]>) => {
      state.chats = action.payload
    })
    .addCase(CHAT_HISTORY_ACTIONS.ADD_CHAT, (state, action: PayloadAction<ChatHistoryItem>) => {
      state.chats.unshift(action.payload)
    })
    .addCase(CHAT_HISTORY_ACTIONS.UPDATE_CHAT, (state, action: PayloadAction<{ id: string; updates: Partial<ChatHistoryItem> }>) => {
      const { id, updates } = action.payload
      const chatIndex = state.chats.findIndex(chat => chat.id === id)
      if (chatIndex !== -1) {
        state.chats[chatIndex] = { ...state.chats[chatIndex], ...updates }
      }
    })
    .addCase(CHAT_HISTORY_ACTIONS.DELETE_CHAT, (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter(chat => chat.id !== action.payload)
    })
    .addCase(CHAT_HISTORY_ACTIONS.SET_SELECTED_CHAT_ID, (state, action: PayloadAction<string | null>) => {
      state.selectedChatId = action.payload
    })
    .addCase(CHAT_HISTORY_ACTIONS.SET_ACTIVE_CHAT, (state, action: PayloadAction<string>) => {
      // Set all chats to inactive first
      state.chats.forEach(chat => {
        chat.isActive = false
      })
      // Set the selected chat as active
      const chatIndex = state.chats.findIndex(chat => chat.id === action.payload)
      if (chatIndex !== -1) {
        state.chats[chatIndex].isActive = true
      }
    })
})
