import type { Theme } from "@mui/material/styles"

export const createChatStyles = (theme: Theme) => ({
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    flex: 1, // Take up remaining space
    minWidth: '500px', // Minimum width for chat UI
    width: '100%', // Ensure it takes full width
    position: 'relative',
    overflow: 'hidden',
    // Responsive behavior
    [theme.breakpoints.down('md')]: {
      minWidth: '300px',
    },
  },
  
  header: {
    p: 2,
    height: '100px !important',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'relative',
    borderRadius: 0,
    width: 'auto',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100vw',
      right: '-100vw',
      bottom: 0,
      backgroundColor: theme.palette.background.paper,
      zIndex: -1,
    },
  },
  
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  
  userAvatar: {
    width: 40,
    height: 40,
  },
  
  headerText: {
    display: 'flex',
    flexDirection: 'column',
  },
  
  headerTitle: {
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  
  headerSubtitle: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
  
  headerActions: {
    display: 'flex',
    gap: 1,
  },
  
  actionButton: {
    minWidth: 40,
    height: 40,
  },
  
  messagesContainer: {
    flex: 1,
    overflow: 'auto',
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    position: 'relative',
    minHeight: 0, // Allow flex item to shrink below content size
    width: '100%', // Ensure full width
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100vw',
      right: '-100vw',
      bottom: 0,
      background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
      zIndex: -1,
    },
  },
  
  messagesList: {
    maxWidth: '100%',
    width: '100%',
  },
  
  welcomeMessage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    gap: 3,
  },
  
  welcomeIcon: {
    fontSize: 80,
    color: theme.palette.primary.main,
  },
  
  welcomeTitle: {
    fontWeight: 700,
    color: theme.palette.text.primary,
  },
  
  welcomeSubtitle: {
    color: theme.palette.text.secondary,
    maxWidth: 400,
    lineHeight: 1.6,
  },
  
  suggestionChips: {
    display: 'flex',
    gap: 1,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  
  suggestionChip: {
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    },
  },
  
  messageContainer: {
    display: 'flex',
    gap: 2,
    mb: 3,
  },
  
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  
  messageAvatar: {
    width: 36,
    height: 36,
    flexShrink: 0,
  },
  
  userMessageAvatar: {
    bgcolor: theme.palette.primary.main,
  },
  
  botMessageAvatar: {
    bgcolor: theme.palette.secondary.main,
  },
  
  messageBubble: {
    maxWidth: '70%',
    p: 2,
    borderRadius: 0,
    position: 'relative',
  },
  
  userMessageBubble: {
    bgcolor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderBottomRightRadius: 0,
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      right: '-20px',
      bottom: 0,
      width: 0,
      height: 0,
      borderLeft: `20px solid ${theme.palette.primary.main}`,
      borderTop: '20px solid transparent',
    },
  },
  
  botMessageBubble: {
    bgcolor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderBottomLeftRadius: 0,
    boxShadow: theme.shadows[2],
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      left: '-20px',
      bottom: 0,
      width: 0,
      height: 0,
      borderRight: `20px solid ${theme.palette.background.paper}`,
      borderTop: '20px solid transparent',
    },
  },
  
  messageText: {
    mb: 1,
    lineHeight: 1.5,
    wordBreak: 'break-word',
  },
  
  messageMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mt: 1,
  },
  
  messageTimestamp: {
    fontSize: '0.75rem',
    opacity: 0.7,
  },
  
  messageActions: {
    display: 'flex',
    gap: 0.5,
  },
  
  messageActionButton: {
    minWidth: 32,
    height: 32,
    p: 0.5,
  },
  
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  
  typingDots: {
    display: 'flex',
    gap: 0.75,
    p: 2.5,
    bgcolor: theme.palette.background.paper,
    borderRadius: 0,
    borderBottomLeftRadius: 0,
    boxShadow: theme.shadows[2],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  
  typingDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    bgcolor: theme.palette.primary.main,
    animation: 'typingBounce 1.5s infinite ease-in-out',
    transform: 'scale(0.8)',
    '&:nth-of-type(1)': {
      animationDelay: '0s',
    },
    '&:nth-of-type(2)': {
      animationDelay: '0.2s',
    },
    '&:nth-of-type(3)': {
      animationDelay: '0.4s',
    },
  },
  
  inputContainer: {
    p: 2,
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100vw',
      right: '-100vw',
      bottom: 0,
      backgroundColor: theme.palette.background.paper,
      zIndex: -1,
    },
  },
  
  inputWrapper: {
    maxWidth: '100%',
    display: 'flex',
    gap: 1,
    alignItems: 'flex-end',
  },
  
  messageInput: {
    flex: 1,
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
      backgroundColor: theme.palette.background.default,
      '&:hover': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
        },
      },
      '&.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
      },
    },
    '& .MuiInputBase-input': {
      resize: 'none',
      '&::-webkit-scrollbar': {
        width: '6px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background: theme.palette.divider,
        borderRadius: '0px',
      },
    },
  },
  
  inputActions: {
    display: 'flex',
    gap: 1,
    alignItems: 'center',
  },
  
  attachButton: {
    minWidth: 40,
    height: 40,
    borderRadius: '50%',
    bgcolor: theme.palette.background.default,
    '&:hover': {
      bgcolor: theme.palette.action.hover,
    },
  },
  
  sendButton: {
    minWidth: 40,
    height: 40,
    borderRadius: '50%',
    bgcolor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    position: 'relative',
    overflow: 'visible',
    '&:hover': {
      bgcolor: theme.palette.primary.dark,
      transform: 'scale(1.1)',
      boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
    },
    '&:disabled': {
      bgcolor: theme.palette.action.disabled,
      color: theme.palette.action.disabled,
      transform: 'none',
      boxShadow: 'none',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-2px',
      left: '-2px',
      right: '-2px',
      bottom: '-2px',
      borderRadius: '50%',
      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
      zIndex: -1,
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
    '&:hover::before': {
      opacity: 0.3,
    },
  },
  
  inputFooter: {
    textAlign: 'center',
    mt: 1,
  },
  
  inputHint: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
  },
  
  // Animation keyframes
  '@keyframes typingBounce': {
    '0%, 60%, 100%': {
      transform: 'translateY(0) scale(0.8)',
      opacity: 0.4,
    },
    '30%': {
      transform: 'translateY(-10px) scale(1.2)',
      opacity: 1,
    },
  },
})
