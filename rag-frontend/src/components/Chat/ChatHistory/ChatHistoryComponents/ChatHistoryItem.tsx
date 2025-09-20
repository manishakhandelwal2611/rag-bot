import React from 'react'
import {
  Box,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material'
import {
  Chat as ChatIcon,
  Message as MessageIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { createChatHistoryStyles } from '../ChatHistory.styles'
import type { ChatHistoryItem as ChatHistoryItemType } from '../../../../types/chat'
import { formatChatHistoryTime } from '../../../../utils/dateUtils'
import { useAppDispatch } from '../../../../store/hooks'
import { fetchThreadMessages, setSelectedThreadId, deleteThreadThunk } from '../../../../modules/threads'
import DeleteThreadDialog from '../../../DeleteThreadDialog'

interface ChatHistoryItemProps {
  chat: ChatHistoryItemType
  onChatSelect?: (chatId: string) => void
}

export default function ChatHistoryItem({ chat, onChatSelect }: ChatHistoryItemProps) {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const styles = createChatHistoryStyles(theme)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)



  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteThreadThunk(chat.id))
      setShowDeleteDialog(false)
    } catch (error) {
      // Error is already handled by the global error system in the thunk
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
  }

  const handleThreadSelect = async () => {
    
    // Set selected thread ID
    dispatch(setSelectedThreadId(chat.id))
    
    // Fetch thread messages
    try {
      await dispatch(fetchThreadMessages({ threadId: chat.id }))
    } catch (error) {
      // Error is already handled by the global error system in the thunk
    }
    
    // Call the optional callback
    onChatSelect?.(chat.id)
  }

  // Extract message count from lastMessage string like "(5 messages)"
  const getMessageCount = (lastMessage: string) => {
    const match = lastMessage.match(/\((\d+) messages?\)/)
    return match ? parseInt(match[1]) : 0
  }

  const messageCount = getMessageCount(chat.lastMessage)

  return (
    <ListItem sx={styles.listItem}>
        <ListItemButton
          onClick={handleThreadSelect}
          selected={chat.isActive}
          sx={styles.listItemButton}
        >
        <ListItemIcon sx={styles.listItemIcon}>
          <Avatar
            sx={{
              ...styles.chatAvatar,
              ...(chat.isActive ? styles.activeChatAvatar : styles.inactiveChatAvatar),
            }}
          >
            <ChatIcon sx={styles.chatIcon} />
          </Avatar>
        </ListItemIcon>
        <ListItemText
          primary={
            <Box sx={styles.listItemText.primary}>
              <Typography
                variant="subtitle2"
                sx={{
                  ...styles.chatTitle,
                  ...(chat.isActive ? styles.activeChatTitle : styles.inactiveChatTitle),
                }}
                noWrap
              >
                {chat.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                {chat.isActive && (
                  <Chip
                    label="Active"
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={styles.activeChip}
                  />
                )}
              </Box>
            </Box>
          }
          secondary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
                <MessageIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                <Typography 
                  variant="body2" 
                  sx={{
                    ...styles.chatPreview,
                    color: 'text.secondary',
                    fontSize: '0.75rem'
                  }}
                  noWrap
                >
                  {messageCount > 0 ? `${messageCount} message${messageCount === 1 ? '' : 's'}` : 'No messages yet'}
                </Typography>
              </Box>
              <Typography 
                variant="caption" 
                sx={{
                  ...styles.chatTimestamp,
                  color: 'text.disabled',
                  fontSize: '0.7rem',
                  flexShrink: 0
                }}
              >
                {formatChatHistoryTime(chat.timestamp)}
              </Typography>
            </Box>
          }
        />
        <IconButton 
          size="small" 
          sx={{ ...styles.moreButton, color: 'error.main' }}
          onClick={handleDeleteClick}
          title="Delete thread"
        >
          <DeleteIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </ListItemButton>
      
      {/* Delete Confirmation Dialog */}
      <DeleteThreadDialog
        open={showDeleteDialog}
        threadTitle={chat.title}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </ListItem>
  )
}
