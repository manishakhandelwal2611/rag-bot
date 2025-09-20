import {
  Box,
  Button,
  useTheme,
} from '@mui/material'
import {
  Logout as LogoutIcon,
} from '@mui/icons-material'
import { createChatHistoryStyles } from '../ChatHistory.styles'
import { useAppDispatch } from '../../../../store/hooks'
import { logout } from '../../../../modules/auth'

export default function ChatHistoryFooter() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const styles = createChatHistoryStyles(theme)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <Box sx={styles.footer}>
      <Button
        variant="outlined"
        color="error"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        sx={styles.logoutButton}
        fullWidth
      >
        Logout
      </Button>
    </Box>
  )
}
