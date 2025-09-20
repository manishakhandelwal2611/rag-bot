import { createReducer } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Message } from '../../types/chat'
import { 
  addMessage, 
  removeTypingMessage, 
  clearMessages, 
  setCurrentChatId, 
  loadMessages, 
  sendMessageThunk 
} from './actions'

export interface ChatState {
  messages: Message[]
  currentChatId: string | null
}

const initialState: ChatState = {
  messages: [],
  currentChatId: null,
}

export const chatReducer = createReducer(initialState, (builder) => {
  builder
    // Handle async thunk actions
    .addCase(sendMessageThunk.fulfilled, (state, action) => {
      // Add bot response message
      const botMessage: Message = {
        id: Date.now().toString(),
        content: action.payload.answer || action.payload,
        isUser: false,
        timestamp: new Date().toISOString()
      }
      state.messages.push(botMessage)
      
      // Also add bot response to thread if we're in a thread context
      // This will be handled by the thunk itself when it dispatches addMessageToThread
    })
    .addCase(addMessage, (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload)
    })
    .addCase(removeTypingMessage, (state) => {
      state.messages = state.messages.filter(msg => !msg.isTyping)
    })
    .addCase(clearMessages, (state) => {
      state.messages = []
    })
    .addCase(setCurrentChatId, (state, action: PayloadAction<string | null>) => {
      state.currentChatId = action.payload
    })
    .addCase(loadMessages, (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload
    })
})
