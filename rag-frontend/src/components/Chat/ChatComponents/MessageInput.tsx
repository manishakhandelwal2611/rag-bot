import React, { useRef } from 'react'
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material'
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material'
import { createChatStyles } from '../Chat.styles'

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onAttach?: () => void
  disabled?: boolean
  placeholder?: string
}

export default function MessageInput({ 
  value, 
  onChange, 
  onSend, 
  onAttach, 
  disabled = false,
  placeholder = "Ask me anything..."
}: MessageInputProps) {
  const theme = useTheme()
  const styles = createChatStyles(theme)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <Paper elevation={2} sx={styles.inputContainer}>
      <Box sx={styles.inputWrapper}>
        <TextField
          inputRef={textareaRef}
          fullWidth
          multiline
          maxRows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          variant="outlined"
          sx={styles.messageInput}
        />
        <Box sx={styles.inputActions}>
          <IconButton sx={styles.attachButton} onClick={onAttach} title="Attach file">
            <AttachFileIcon />
          </IconButton>
          <IconButton
            onClick={onSend}
            disabled={!value.trim() || disabled}
            sx={styles.sendButton}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
      <Box sx={styles.inputFooter}>
        <Typography variant="caption" sx={styles.inputHint}>
          Press Enter to send, Shift+Enter for new line
        </Typography>
      </Box>
    </Paper>
  )
}
