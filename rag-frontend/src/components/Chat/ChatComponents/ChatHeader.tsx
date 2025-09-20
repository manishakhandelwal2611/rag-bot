import {
  Box,
  Paper,
  Typography,
  Avatar,
  useTheme,
} from '@mui/material'
import {
  SmartToy as BotIcon,
} from '@mui/icons-material'
import { createChatStyles } from '../Chat.styles'



export default function ChatHeader() {
  const theme = useTheme()
  const styles = createChatStyles(theme)

  return (
    <Paper elevation={1} sx={styles.header}>
      <Box sx={styles.userInfo}>
        <Avatar 
          src="/src/assets/bot.png"
          sx={styles.userAvatar}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        >
          <BotIcon sx={{ color: 'white' }} />
        </Avatar>
        <Box sx={styles.headerText}>
          <Typography variant="h6" sx={styles.headerTitle}>
            RAG Chat bot
          </Typography>
          <Typography variant="body2" sx={styles.headerSubtitle}>
            AI-powered assistant
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}
