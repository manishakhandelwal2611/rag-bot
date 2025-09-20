import type { Theme } from "@mui/material/styles"

export const createChatHistoryStyles = (theme: Theme) => ({
  container: {
    width: '33.33%',
    minWidth: '280px', // Minimum width for chat history
    maxWidth: '400px', // Maximum width to prevent it from getting too wide
    flexShrink: 0, // Prevent shrinking below minimum width
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    position: 'relative',
    overflow: 'hidden',
    // Responsive behavior
    [theme.breakpoints.down('md')]: {
      minWidth: '250px',
      maxWidth: '300px',
    },
  },
  
  header: {
    p: 2,
    height: '100px !important',
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'relative',
    borderRadius: 0,
    flexShrink: 0, // Prevent header from shrinking
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

  scrollableContent: {
    flex: 1,
    overflow: 'auto',
    minHeight: '60px', // Allow flex item to shrink below content size
  },
  
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 2,
  },
  
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  
  headerIcon: {
    color: theme.palette.primary.main,
  },
  
  headerText: {
    fontWeight: 600,
  },
  
  newChatButton: {
    bgcolor: theme.palette.primary.main,
    color: 'white',
    '&:hover': {
      bgcolor: theme.palette.primary.dark,
    },
  },
  
  chatCount: {
    color: 'text.secondary',
  },
  
  chatList: {
    flex: 1,
    overflow: 'auto',
  },
  
  list: {
    p: 0,
  },
  
  listItem: {
    padding: 0,
  },
  
  listItemButton: {
    p: 2,
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main + '10',
      borderRight: `3px solid ${theme.palette.primary.main}`,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  
  listItemIcon: {
    minWidth: 40,
  },
  
  chatAvatar: {
    width: 32,
    height: 32,
  },
  
  activeChatAvatar: {
    bgcolor: theme.palette.primary.main,
  },
  
  inactiveChatAvatar: {
    bgcolor: theme.palette.grey[400],
  },
  
  chatIcon: {
    fontSize: 'small',
  },
  
  listItemText: {
    primary: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      mb: 0.5,
    },
  },
  
  chatTitle: {
    fontWeight: 500,
  },
  
  activeChatTitle: {
    fontWeight: 600,
    color: theme.palette.primary.main,
  },
  
  inactiveChatTitle: {
    color: theme.palette.text.primary,
  },
  
  activeChip: {
    height: 20,
    fontSize: '0.7rem',
  },
  
  chatPreview: {
    color: theme.palette.text.secondary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    mb: 0.5,
  },
  
  chatTimestamp: {
    color: 'text.secondary',
  },
  
  moreButton: {
    ml: 1,
  },
  
  moreIcon: {
    fontSize: 'small',
  },
  
  divider: {
    // Default Material UI divider styling
  },
  
  footer: {
    p: 2,
    height: '120px !important',
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
    flexShrink: 0, // Prevent footer from shrinking
  },
  
  logoutButton: {
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 500,
    py: 1.5,
    '&:hover': {
      backgroundColor: theme.palette.error.light,
      color: theme.palette.error.contrastText,
    },
  },
})
