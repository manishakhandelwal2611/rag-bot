import { useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GOOGLE_CLIENT_ID } from './constants'
import { store } from './store'
import { theme } from './styles/theme'
import Chat from './components/Chat'
import Login from './components/Login'
import LoadingScreen from './components/LoadingScreen'
import GlobalSnackbar from './components/GlobalSnackbar'
import { useAppSelector, useAppDispatch } from './store/hooks'
import { setToken, setInitialized } from './modules/auth'

const clientId = GOOGLE_CLIENT_ID

export const AppContent = () => {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, isInitialized } = useAppSelector((state) => state.auth)

  // Initialize auth state from localStorage on app mount
  useEffect(() => {
    const token = localStorage.getItem("chat_user")
    if (token) {
      dispatch(setToken(token))
    }
    // Mark as initialized regardless of whether token exists
    dispatch(setInitialized(true))
  }, [dispatch])

  // Show loading screen while initializing
  if (!isInitialized) {
    return <LoadingScreen message="Initializing..." />
  }

  return (
    <>
      {isAuthenticated && user ? <Chat /> : <Login />}
      <GlobalSnackbar />
    </>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GoogleOAuthProvider clientId={clientId}>
          <AppContent />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </Provider>
  )
}
