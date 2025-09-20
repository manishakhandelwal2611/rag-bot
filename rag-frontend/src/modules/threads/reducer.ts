import { createReducer } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { 
  type Thread, 
  type ThreadsResponse,
  setThreads,
  addThread,
  updateThread,
  deleteThread,
  setSelectedThreadId,
  setThreadMessages,
  addThreadMessages,
  addMessageToThread,
  removeTypingMessageFromThread,
  clearThreadMessages,
  fetchThreads,
  fetchThreadMessages,
  deleteThreadThunk
} from './actions'
import type { ThreadMessagesResponse, ThreadMessage } from '../../types/thread'

export interface ThreadsState {
  threads: Thread[]
  pagination: {
    page: number
    page_size: number
    total_count: number
    total_pages: number
    has_next: boolean
    has_previous: boolean
  }
  selectedThreadId: string | null
  currentThread: {
    id: string | null
    title: string
    messages: ThreadMessage[]
    pagination: {
      page: number
      page_size: number
      total_count: number
      total_pages: number
      has_next: boolean
      has_previous: boolean
    }
  }
}

const initialState: ThreadsState = {
  threads: [],
  pagination: {
    page: 0,
    page_size: 0,
    total_count: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
  },
  selectedThreadId: null,
  currentThread: {
    id: null,
    title: '',
    messages: [],
    pagination: {
      page: 0,
      page_size: 0,
      total_count: 0,
      total_pages: 0,
      has_next: false,
      has_previous: false,
    }
  },
}

export const threadsReducer = createReducer(initialState, (builder) => {
  builder
    // Handle async thunk actions
    .addCase(fetchThreads.fulfilled, (state, action: PayloadAction<ThreadsResponse>) => {
      state.threads = action.payload.threads
      state.pagination = {
        page: action.payload.page,
        page_size: action.payload.page_size,
        total_count: action.payload.total_count,
        total_pages: action.payload.total_pages,
        has_next: action.payload.has_next,
        has_previous: action.payload.has_previous,
      }
    })
    .addCase(fetchThreadMessages.fulfilled, (state, action: PayloadAction<ThreadMessagesResponse>) => {
      state.currentThread = {
        id: action.payload.thread.id,
        title: action.payload.thread.title,
        messages: action.payload.thread.messages,
        pagination: action.payload.pagination || {
          page: 1,
          page_size: 20,
          total_count: action.payload.thread.messages.length,
          total_pages: 1,
          has_next: false,
          has_previous: false,
        }
      }
      state.selectedThreadId = action.payload.thread.id
    })
    .addCase(deleteThreadThunk.fulfilled, (state, action) => {
      // Remove the deleted thread from the list
      state.threads = state.threads.filter(thread => thread.id !== action.payload.threadId)
      state.pagination.total_count -= 1
      
      // If the deleted thread was currently selected, clear the selection
      if (state.selectedThreadId === action.payload.threadId) {
        state.selectedThreadId = null
        state.currentThread = {
          id: null,
          title: '',
          messages: [],
          pagination: {
            page: 0,
            page_size: 0,
            total_count: 0,
            total_pages: 0,
            has_next: false,
            has_previous: false,
          }
        }
      }
    })
    
    // Handle regular actions
    .addCase(setThreads, (state, action: PayloadAction<ThreadsResponse>) => {
      state.threads = action.payload.threads
      state.pagination = {
        page: action.payload.page,
        page_size: action.payload.page_size,
        total_count: action.payload.total_count,
        total_pages: action.payload.total_pages,
        has_next: action.payload.has_next,
        has_previous: action.payload.has_previous,
      }
    })
    .addCase(addThread, (state, action: PayloadAction<Thread>) => {
      state.threads.unshift(action.payload)
      state.pagination.total_count += 1
    })
    .addCase(updateThread, (state, action: PayloadAction<{ id: string; updates: Partial<Thread> }>) => {
      const { id, updates } = action.payload
      const threadIndex = state.threads.findIndex(thread => thread.id === id)
      if (threadIndex !== -1) {
        state.threads[threadIndex] = { ...state.threads[threadIndex], ...updates }
      }
    })
    .addCase(deleteThread, (state, action: PayloadAction<string>) => {
      state.threads = state.threads.filter(thread => thread.id !== action.payload)
      state.pagination.total_count -= 1
    })
    .addCase(setSelectedThreadId, (state, action: PayloadAction<string | null>) => {
      state.selectedThreadId = action.payload
    })
    .addCase(setThreadMessages, (state, action: PayloadAction<ThreadMessagesResponse>) => {
      state.currentThread = {
        id: action.payload.thread.id,
        title: action.payload.thread.title,
        messages: action.payload.thread.messages,
        pagination: action.payload.pagination || {
          page: 1,
          page_size: 20,
          total_count: action.payload.thread.messages.length,
          total_pages: 1,
          has_next: false,
          has_previous: false,
        }
      }
      state.selectedThreadId = action.payload.thread.id
    })
    .addCase(addThreadMessages, (state, action: PayloadAction<ThreadMessagesResponse>) => {
      // Add new messages to existing ones (for pagination)
      state.currentThread.messages = [...action.payload.thread.messages, ...state.currentThread.messages]
      if (action.payload.pagination) {
        state.currentThread.pagination = action.payload.pagination
      }
    })
    .addCase(addMessageToThread, (state, action: PayloadAction<ThreadMessage>) => {
      // Add a single message to the current thread
      if (state.currentThread.id) {
        state.currentThread.messages.push(action.payload)
        state.currentThread.pagination.total_count += 1
      }
    })
    .addCase(removeTypingMessageFromThread, (state) => {
      // Remove typing indicator from thread messages
      if (state.currentThread.id) {
        state.currentThread.messages = state.currentThread.messages.filter(msg => !msg.id.startsWith('typing-'))
      }
    })
    .addCase(clearThreadMessages, (state) => {
      state.currentThread = {
        id: null,
        title: '',
        messages: [],
        pagination: {
          page: 0,
          page_size: 0,
          total_count: 0,
          total_pages: 0,
          has_next: false,
          has_previous: false,
        }
      }
      state.selectedThreadId = null
    })
})
