import { useRef } from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import Chat from './Chat'
import ChatHistory from './ChatHistory/ChatHistory'

export default function ChatLayout() {
  const chatRef = useRef<{ handleNewChat: () => void }>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleChatSelect = (_chatId: string) => {
    // TODO: Implement chat selection logic
  }

  const handleNewChat = () => {
    // Call the Chat component's handleNewChat function
    chatRef.current?.handleNewChat()
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh',
      minWidth: isMobile ? '320px' : '800px', // Responsive minimum width
      width: '100%', // Ensure it takes full width
      overflow: 'hidden',
      flex: 1,
    }}>
      <ChatHistory onChatSelect={handleChatSelect} onNewChat={handleNewChat} />
      <Chat ref={chatRef} />
    </Box>
  )
}
