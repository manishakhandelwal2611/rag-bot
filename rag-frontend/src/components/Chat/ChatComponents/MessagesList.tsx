import React from 'react'
import {
  Box,
  Fade,
  useTheme,
  CircularProgress,
  Typography,
} from '@mui/material'
import { createChatStyles } from '../Chat.styles'
import type { Message } from '../../../types/chat'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

interface MessagesListProps {
  messages: Message[]
  userPicture?: string
  onCopyMessage?: (content: string) => void
  isLoading?: boolean
}

export default function MessagesList({ messages, userPicture, onCopyMessage, isLoading }: MessagesListProps) {
  const theme = useTheme()
  const styles = createChatStyles(theme)

  if (isLoading && messages.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%', 
        width: '100%',
        flexDirection: 'column', 
        gap: 2,
        flex: 1
      }}>
        <CircularProgress size={24} />
        <Typography variant="body2" color="text.secondary">
          Loading messages...
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ ...styles.messagesList, flex: 1, width: '100%' }}>
      {messages.map((message) => (
        <Fade in key={message.id}>
          <Box>
            {message.isTyping ? (
              <TypingIndicator />
            ) : (
              <MessageBubble
                message={message}
                userPicture={userPicture}
                onCopy={onCopyMessage}
              />
            )}
          </Box>
        </Fade>
      ))}
    </Box>
  )
}
