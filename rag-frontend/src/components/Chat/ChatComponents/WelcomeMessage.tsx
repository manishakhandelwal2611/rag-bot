import {
  Box,
  Typography,
  Chip,
  useTheme,
  Avatar,
} from '@mui/material'
import { createChatStyles } from '../Chat.styles'
import { useAppSelector } from '../../../store'

interface WelcomeMessageProps {
  onSuggestionClick?: (suggestion: string) => void
}

const suggestions = [
  "What is RAG?",
  "How does AI work?",
  "Tell me about machine learning",
  "Explain neural networks"
]

export default function WelcomeMessage({ onSuggestionClick }: WelcomeMessageProps) {
  const theme = useTheme()
  const styles = createChatStyles(theme)
  const { user } = useAppSelector((state) => state.auth)
  return (
    <Box sx={{ ...styles.welcomeMessage, flex: 1, width: '100%' }}>
      <Avatar
        sx={{
          width: 80,
          height: 80,
          mb: 2,
          mx: 'auto',
        }}
        src='/src/assets/bot_cartoon.jpeg'
      >
        {/* <BotIcon sx={{ fontSize: 40 }} /> */}
      </Avatar>
      <Typography variant="h4" sx={styles.welcomeTitle}>
        Welcome {user?.name || ''}!
      </Typography>
      <Typography variant="body1" sx={styles.welcomeSubtitle}>
        Ask me anything and I'll help you find the information you need using advanced RAG technology.
      </Typography>
      <Box sx={styles.suggestionChips}>
        {suggestions.map((suggestion) => (
          <Chip
            key={suggestion}
            label={suggestion}
            onClick={() => onSuggestionClick?.(suggestion)}
            sx={styles.suggestionChip}
            variant="outlined"
          />
        ))}
      </Box>
    </Box>
  )
}
