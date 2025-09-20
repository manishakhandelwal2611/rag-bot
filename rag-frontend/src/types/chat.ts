export interface ChatHistoryItem {
  id: string
  title: string
  lastMessage: string
  timestamp: string // ISO string format
  isActive: boolean
  messageCount: number
}

export interface ChatHistoryData {
  chats: ChatHistoryItem[]
}

export interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: string // ISO string format for Redux serialization
  isTyping?: boolean
  sources?: Array<{
    title: string
    url: string
    snippet: string
    confidence: number
  }>
  confidence?: number
}
