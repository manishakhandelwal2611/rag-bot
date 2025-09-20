export interface ThreadMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface ThreadDetails {
  id: string
  title: string
  created_at: string
  updated_at: string
  messages: ThreadMessage[]
}

export interface ThreadMessagesResponse {
  thread: ThreadDetails
  success: boolean
  message: string
  pagination?: {
    page: number
    page_size: number
    total_count: number
    total_pages: number
    has_next: boolean
    has_previous: boolean
  }
}
