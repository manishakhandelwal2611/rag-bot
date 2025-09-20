import {
  Box,
  useTheme,
} from '@mui/material'
import { createChatStyles } from '../Chat.styles'

export default function TypingIndicator() {
  const theme = useTheme()
  const styles = createChatStyles(theme)

  // Define keyframes animation with unique name to avoid conflicts
  const animationId = `typingBounce-${Math.random().toString(36).substr(2, 9)}`
  
  const keyframes = `
    @keyframes ${animationId} {
      0%, 60%, 100% {
        transform: translateY(0) scale(0.8);
        opacity: 0.4;
      }
      30% {
        transform: translateY(-10px) scale(1.2);
        opacity: 1;
      }
    }
  `

  const dotStyle = {
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    animation: `${animationId} 1.5s infinite ease-in-out`,
    transform: 'scale(0.8)',
  }

  return (
    <>
      <style>{keyframes}</style>
      <Box sx={styles.typingIndicator}>
        <Box sx={styles.typingDots}>
          <Box sx={{ ...dotStyle, animationDelay: '0s' }} />
          <Box sx={{ ...dotStyle, animationDelay: '0.2s' }} />
          <Box sx={{ ...dotStyle, animationDelay: '0.4s' }} />
        </Box>
      </Box>
    </>
  )
}
