import { createAction } from '@reduxjs/toolkit'
import type { ChatHistoryItem } from '../../types/chat'

// Action types
export const CHAT_HISTORY_ACTIONS = {
  LOAD_CHAT_HISTORY: 'chatHistory/loadChatHistory',
  ADD_CHAT: 'chatHistory/addChat',
  UPDATE_CHAT: 'chatHistory/updateChat',
  DELETE_CHAT: 'chatHistory/deleteChat',
  SET_SELECTED_CHAT_ID: 'chatHistory/setSelectedChatId',
  SET_ACTIVE_CHAT: 'chatHistory/setActiveChat',
} as const

// Action creators
export const loadChatHistory = createAction<ChatHistoryItem[]>(CHAT_HISTORY_ACTIONS.LOAD_CHAT_HISTORY)
export const addChat = createAction<ChatHistoryItem>(CHAT_HISTORY_ACTIONS.ADD_CHAT)
export const updateChat = createAction<{ id: string; updates: Partial<ChatHistoryItem> }>(CHAT_HISTORY_ACTIONS.UPDATE_CHAT)
export const deleteChat = createAction<string>(CHAT_HISTORY_ACTIONS.DELETE_CHAT)
export const setSelectedChatId = createAction<string | null>(CHAT_HISTORY_ACTIONS.SET_SELECTED_CHAT_ID)
export const setActiveChat = createAction<string>(CHAT_HISTORY_ACTIONS.SET_ACTIVE_CHAT)
