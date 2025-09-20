import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { getThreads, getThreadMessages, deleteThread as deleteThreadApi } from '../../api/chatApi'
import type { ThreadMessagesResponse, ThreadMessage } from '../../types/thread'
import { showErrorSnackbar, setLoading } from '../global/actions'
import { GlobalFeature } from '../../types/global'

export interface Thread {
  id: string
  title: string
  created_at: string
  updated_at: string
  message_count: number
}

export interface ThreadsResponse {
  total_count: number
  page: number
  page_size: number
  total_pages: number
  has_next: boolean
  has_previous: boolean
  threads: Thread[]
}

export const THREADS_ACTIONS = {
  SET_THREADS: 'threads/setThreads',
  ADD_THREAD: 'threads/addThread',
  UPDATE_THREAD: 'threads/updateThread',
  DELETE_THREAD: 'threads/deleteThread',
  SET_SELECTED_THREAD_ID: 'threads/setSelectedThreadId',
  SET_THREAD_MESSAGES: 'threads/setThreadMessages',
  ADD_THREAD_MESSAGES: 'threads/addThreadMessages',
  ADD_MESSAGE_TO_THREAD: 'threads/addMessageToThread',
  REMOVE_TYPING_MESSAGE_FROM_THREAD: 'threads/removeTypingMessageFromThread',
  CLEAR_THREAD_MESSAGES: 'threads/clearThreadMessages',
} as const

// Async thunk for fetching threads
export const fetchThreads = createAsyncThunk(
  'threads/fetchThreads',
  async ({ page = 1, page_size = 10 }: { page?: number; page_size?: number }, { rejectWithValue, dispatch }) => {
    dispatch(setLoading({ feature: GlobalFeature.CHAT_HISTORY, isLoading: true }))
    try {
      const response = await getThreads(page, page_size)
      dispatch(setLoading({ feature: GlobalFeature.CHAT_HISTORY, isLoading: false }))
      return response.data
    } catch (error: any) {
      dispatch(setLoading({ feature: GlobalFeature.CHAT_HISTORY, isLoading: false }))
      dispatch(showErrorSnackbar(error, GlobalFeature.CHAT_HISTORY))
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Async thunk for fetching thread messages
export const fetchThreadMessages = createAsyncThunk(
  'threads/fetchThreadMessages',
  async ({ threadId, page = 1, page_size = 20 }: { threadId: string; page?: number; page_size?: number }, { rejectWithValue, dispatch }) => {
    dispatch(setLoading({ feature: GlobalFeature.MESSAGES, isLoading: true }))
    try {
      const response = await getThreadMessages(threadId, page, page_size)
      dispatch(setLoading({ feature: GlobalFeature.MESSAGES, isLoading: false }))
      return response.data
    } catch (error: any) {
      dispatch(setLoading({ feature: GlobalFeature.MESSAGES, isLoading: false }))
      dispatch(showErrorSnackbar(error, GlobalFeature.MESSAGES))
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Async thunk for deleting thread
export const deleteThreadThunk = createAsyncThunk(
  'threads/deleteThread',
  async (threadId: string, { rejectWithValue, dispatch }) => {
    dispatch(setLoading({ feature: GlobalFeature.DELETE_THREAD, isLoading: true }))
    try {
      const response = await deleteThreadApi(threadId)
      dispatch(setLoading({ feature: GlobalFeature.DELETE_THREAD, isLoading: false }))
      return { threadId, response: response.data }
    } catch (error: any) {
      dispatch(setLoading({ feature: GlobalFeature.DELETE_THREAD, isLoading: false }))
      dispatch(showErrorSnackbar(error, GlobalFeature.DELETE_THREAD))
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Regular actions
export const setThreads = createAction<ThreadsResponse>(THREADS_ACTIONS.SET_THREADS)
export const addThread = createAction<Thread>(THREADS_ACTIONS.ADD_THREAD)
export const updateThread = createAction<{ id: string; updates: Partial<Thread> }>(THREADS_ACTIONS.UPDATE_THREAD)
export const deleteThread = createAction<string>(THREADS_ACTIONS.DELETE_THREAD)
export const setSelectedThreadId = createAction<string | null>(THREADS_ACTIONS.SET_SELECTED_THREAD_ID)
export const setThreadMessages = createAction<ThreadMessagesResponse>(THREADS_ACTIONS.SET_THREAD_MESSAGES)
export const addThreadMessages = createAction<ThreadMessagesResponse>(THREADS_ACTIONS.ADD_THREAD_MESSAGES)
export const addMessageToThread = createAction<ThreadMessage>(THREADS_ACTIONS.ADD_MESSAGE_TO_THREAD)
export const removeTypingMessageFromThread = createAction(THREADS_ACTIONS.REMOVE_TYPING_MESSAGE_FROM_THREAD)
export const clearThreadMessages = createAction(THREADS_ACTIONS.CLEAR_THREAD_MESSAGES)
