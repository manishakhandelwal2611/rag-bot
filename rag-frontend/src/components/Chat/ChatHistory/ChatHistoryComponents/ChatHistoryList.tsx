import React from 'react'
import {
  Box,
  List,
  Divider,
  useTheme,
} from '@mui/material'
import { createChatHistoryStyles } from '../ChatHistory.styles'
import type { ChatHistoryItem } from '../../../../types/chat'
import ChatHistoryItem from './ChatHistoryItem'

interface ChatHistoryListProps {
  chatHistory: ChatHistoryItem[]
  onChatSelect?: (chatId: string) => void
}

export default function ChatHistoryList({ chatHistory, onChatSelect }: ChatHistoryListProps) {
  const theme = useTheme()
  const styles = createChatHistoryStyles(theme)

  return (
    <Box sx={styles.chatList}>
      <List sx={styles.list}>
        {chatHistory.map((chat, index) => (
          <React.Fragment key={chat.id}>
            <ChatHistoryItem
              chat={chat}
              onChatSelect={onChatSelect}
            />
            {index < chatHistory.length - 1 && <Divider sx={styles.divider} />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  )
}
