import axios from 'axios'
import { API_BASE_URL } from '../constants'
import { getToken } from '../utils/tokenUtils'



// Axios instance with token support
const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

// Add a request interceptor to include token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)


export const sendMessage = (inputMessage: string, threadId?: string | null) => {
  const payload: { question: string; thread_id?: string } = { question: inputMessage }
  
  // Only include thread_id if it exists
  if (threadId) {
    payload.thread_id = threadId
  }
  
  return apiClient.post("/query", payload)
}


export const getChatHistory =  (userId: string) =>  apiClient.get(`/history/${userId}`)

// Threads API with pagination
export const getThreads = (page: number = 1, page_size: number = 10) => {
  return apiClient.get('chat/threads', {
    params: {
      page,
      page_size
    }
  })
}

// Get thread messages by ID
export const getThreadMessages = (threadId: string, page: number = 1, page_size: number = 20) => {
  return apiClient.get(`/chat/threads/${threadId}`, {
    params: {
      page,
      page_size
    }
  })
}

// Delete thread by ID
export const deleteThread = (threadId: string) => {
  return apiClient.delete(`/chat/threads/${threadId}`)
}


