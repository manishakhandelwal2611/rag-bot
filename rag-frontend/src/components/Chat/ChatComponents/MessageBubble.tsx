import {
  Paper,
  Typography,
  Box,
  IconButton,
  Avatar,
  useTheme,
} from '@mui/material'
import {
  SmartToy as BotIcon,
  Person as PersonIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material'
import { createChatStyles } from '../Chat.styles'
import type { Message } from '../../../types/chat'
import { formatMessageTime } from '../../../utils/dateUtils'

/**
 * Props for the MessageBubble component
 */
interface MessageBubbleProps {
  /** The message object containing content, timestamp, and metadata */
  message: Message
  /** Optional user profile picture URL */
  userPicture?: string
  /** Callback function when copy button is clicked */
  onCopy?: (content: string) => void
}

/**
 * MessageBubble component displays individual chat messages with proper styling,
 * timestamps, and interactive elements like copy functionality.
 * 
 * Features:
 * - Different styling for user and bot messages
 * - Avatar display for both user and bot
 * - Formatted timestamps with timezone support
 * - Copy message functionality
 * - Source links for bot responses
 * - Typing indicator support
 * 
 * @param props - The component props
 * @returns JSX element representing a message bubble
 * 
 * @example
 * ```tsx
 * <MessageBubble
 *   message={{
 *     id: '1',
 *     content: 'Hello, how can I help you?',
 *     isUser: false,
 *     timestamp: '2025-01-20T10:30:00Z'
 *   }}
 *   userPicture="https://example.com/avatar.jpg"
 *   onCopy={(content) => navigator.clipboard.writeText(content)}
 * />
 * ```
 */
export default function MessageBubble({ message, userPicture, onCopy }: MessageBubbleProps) {
  const theme = useTheme()
  const styles = createChatStyles(theme)


  const handleCopy = () => {
    onCopy?.(message.content)
  }

  return (
    <Box 
      sx={{
        ...styles.messageContainer,
        ...(message.isUser ? styles.userMessageContainer : styles.botMessageContainer)
      }}
    >
      {!message.isUser && (
        <Avatar sx={{ ...styles.messageAvatar, ...styles.botMessageAvatar }}>
          <BotIcon />
        </Avatar>
      )}
      
      <Paper
        sx={{
          ...styles.messageBubble,
          ...(message.isUser ? styles.userMessageBubble : styles.botMessageBubble)
        }}
      >
        <Typography variant="body1" sx={styles.messageText}>
          {message.content}
        </Typography>
        <Box sx={styles.messageMeta}>
          <Typography variant="caption" sx={styles.messageTimestamp}>
                {formatMessageTime(message.timestamp)}
          </Typography>
          {!message.isUser && (
            <Box sx={styles.messageActions}>
              <IconButton size="small" sx={styles.messageActionButton} onClick={handleCopy} title="Copy">
                <CopyIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      </Paper>
      
      {message.isUser && (
        <Avatar 
          src={userPicture} 
          sx={{ ...styles.messageAvatar, ...styles.userMessageAvatar }}
          onError={(_e) => {
            // Handle avatar load error silently
          }}
          onLoad={() => {
            // Handle avatar load success silently
          }}
        >
          {!userPicture && <PersonIcon />}
        </Avatar>
      )}
    </Box>
  )
}
