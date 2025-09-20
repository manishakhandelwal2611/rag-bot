import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { Message } from '../../types/chat'
import { sendMessage } from '../../api/chatApi'
import { showErrorSnackbar, setLoading } from '../global/actions'
import { GlobalFeature } from '../../types/global'

// Action types
export const CHAT_ACTIONS = {
  ADD_MESSAGE: 'chat/addMessage',
  REMOVE_TYPING_MESSAGE: 'chat/removeTypingMessage',
  CLEAR_MESSAGES: 'chat/clearMessages',
  SET_CURRENT_CHAT_ID: 'chat/setCurrentChatId',
  LOAD_MESSAGES: 'chat/loadMessages',
} as const

// Action creators
export const addMessage = createAction<Message>(CHAT_ACTIONS.ADD_MESSAGE)
export const removeTypingMessage = createAction(CHAT_ACTIONS.REMOVE_TYPING_MESSAGE)
export const clearMessages = createAction(CHAT_ACTIONS.CLEAR_MESSAGES)
export const setCurrentChatId = createAction<string | null>(CHAT_ACTIONS.SET_CURRENT_CHAT_ID)
export const loadMessages = createAction<Message[]>(CHAT_ACTIONS.LOAD_MESSAGES)

// Async thunk for sending messages
export const sendMessageThunk = createAsyncThunk(
  'chat/sendMessage',
  async (inputMessage: string, { rejectWithValue, getState, dispatch }) => {
    dispatch(setLoading({ feature: GlobalFeature.CHAT_MESSAGE, isLoading: true }))
    try {
      // Get the current state to access thread_id
      const state = getState() as any
      const threadId = state.threads?.selectedThreadId || null
      
      const response = await sendMessage(inputMessage, threadId)
      
      // If a new thread was created (response contains thread_id and we didn't have one before)
      if (response.data.thread_id && !threadId) {
        
        // Import the threads actions dynamically to avoid circular dependency
        const { addThread, setSelectedThreadId, setThreadMessages } = await import('../threads/actions')
        
        // Create a new thread object from the response
        const newThread = {
          id: response.data.thread_id,
          title: inputMessage.length > 50 ? inputMessage.substring(0, 50) + '...' : inputMessage,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          message_count: 2 // User message + bot response
        }
        
        // Add the new thread to the threads list
        dispatch(addThread(newThread))
        
        // Set this as the selected thread
        dispatch(setSelectedThreadId(response.data.thread_id))
        
        // Clear regular chat messages since we're now in thread mode
        dispatch(clearMessages())
        
        // Initialize the currentThread with the new thread and the user message that was just sent
        // This ensures the user message appears in the thread when we switch to thread mode
        const userMessage = {
          id: Date.now().toString(),
          content: inputMessage,
          role: 'user' as const,
          timestamp: new Date().toISOString()
        }
        
        dispatch(setThreadMessages({
          thread: {
            ...newThread,
            messages: [userMessage]
          },
          success: true,
          message: 'Thread created successfully',
          pagination: {
            page: 1,
            page_size: 20,
            total_count: 1,
            total_pages: 1,
            has_next: false,
            has_previous: false
          }
        }))
      }
      
      // If we're in a thread context, add the bot response to the thread
      if (threadId || response.data.thread_id) {
        
        // Import the threads actions dynamically to avoid circular dependency
        const { addMessageToThread } = await import('../threads/actions')
        
        // Create bot response message for thread
        const botResponse = {
          id: Date.now().toString(),
          content: response.data.answer || response.data,
          role: 'assistant' as const,
          timestamp: new Date().toISOString()
        }
        
        // Add bot response to thread
        dispatch(addMessageToThread(botResponse))
      }
      
      dispatch(setLoading({ feature: GlobalFeature.CHAT_MESSAGE, isLoading: false }))
      return response.data
    } catch (error: any) {
      dispatch(setLoading({ feature: GlobalFeature.CHAT_MESSAGE, isLoading: false }))
      dispatch(showErrorSnackbar(error, GlobalFeature.CHAT_MESSAGE))
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)
