import { useEffect } from 'react'
import {
  Box,
  useTheme,
  CircularProgress,
  Typography,
} from '@mui/material'
import { createChatHistoryStyles } from './ChatHistory.styles'
import {
  ChatHistoryHeader,
  ChatHistoryList,
  ChatHistoryFooter,
} from './ChatHistoryComponents'
import { useAppSelector, useAppDispatch } from '../../../store/hooks'
import { fetchThreads } from '../../../modules/threads'
import { GlobalFeature } from '../../../types/global'

interface ChatHistoryProps {
  onChatSelect?: (chatId: string) => void
  onNewChat?: () => void
}

export default function ChatHistory({ onChatSelect, onNewChat }: ChatHistoryProps) {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { threads, pagination, selectedThreadId } = useAppSelector((state) => state.threads)
  const { loading, errors } = useAppSelector((state) => state.global)
  const styles = createChatHistoryStyles(theme)

  // Fetch threads on component mount
  useEffect(() => {
    dispatch(fetchThreads({ page: 1, page_size: 10 }))
  }, [dispatch])


  const handleLoadMore = () => {
    if (pagination.has_next) {
      dispatch(fetchThreads({ page: pagination.page + 1, page_size: pagination.page_size }))
    }
  }

  // Convert threads to chat history format for compatibility
  const chatHistory = threads.map(thread => ({
    id: thread.id,
    title: thread.title,
    lastMessage: `(${thread.message_count} messages)`,
    timestamp: thread.updated_at,
    isActive: selectedThreadId === thread.id,
    messageCount: thread.message_count,
  }))

  return (
    <Box sx={styles.container}>
      {/* Header */}
      <ChatHistoryHeader
        chatCount={pagination.total_count}
        onNewChat={onNewChat}
      />

      {/* Scrollable Content Area */}
      <Box sx={styles.scrollableContent}>
        {/* Loading State */}
        {loading[GlobalFeature.CHAT_HISTORY] && threads.length === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {/* Error State */}
        {errors[GlobalFeature.CHAT_HISTORY] && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="error">
              {errors[GlobalFeature.CHAT_HISTORY]}
            </Typography>
          </Box>
        )}

      {/* Chat List */}
        {threads.length > 0 && (
          <ChatHistoryList
            chatHistory={chatHistory}
            onChatSelect={onChatSelect}
          />
        )}

        {/* Load More Button */}
        {pagination.has_next && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography
                          variant="body2"
              color="primary" 
              sx={{ cursor: 'pointer' }}
              onClick={handleLoadMore}
            >
              Load More ({pagination.total_count - threads.length} remaining)
                        </Typography>
                      </Box>
        )}
      </Box>

      {/* Fixed Footer */}
      <ChatHistoryFooter />
    </Box>
  )
}