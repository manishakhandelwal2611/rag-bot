import React from 'react'
import {
  Box,
  Paper,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material'
import {
  Add as AddIcon,
  History as HistoryIcon,
} from '@mui/icons-material'
import { createChatHistoryStyles } from '../ChatHistory.styles'

interface ChatHistoryHeaderProps {
  chatCount: number
  onNewChat?: () => void
}

export default function ChatHistoryHeader({ chatCount, onNewChat }: ChatHistoryHeaderProps) {
  const theme = useTheme()
  const styles = createChatHistoryStyles(theme)

  return (
    <Paper elevation={0} sx={styles.header}>
      <Box sx={styles.headerContent}>
        <Box sx={styles.headerTitle}>
          <HistoryIcon sx={styles.headerIcon} />
          <Typography variant="h6" sx={styles.headerText}>
            Chat History
          </Typography>
        </Box>
        <IconButton onClick={onNewChat} size="small" sx={styles.newChatButton}>
          <AddIcon />
        </IconButton>
      </Box>
      
      <Typography variant="body2" sx={styles.chatCount}>
        {chatCount} conversations
      </Typography>
    </Paper>
  )
}
