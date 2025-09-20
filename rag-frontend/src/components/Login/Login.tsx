import React, { useState } from "react"
import {
  Box,
  Paper,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
} from "@mui/material"
import {
  SmartToy as BotIcon,
  Psychology as PsychologyIcon,
  AutoAwesome as SparkleIcon,
  Chat as ChatIcon,
} from "@mui/icons-material"
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google"
import { createLoginStyles } from "./Login.styles"
import LoginErrorModal from "./LoginErrorModal"
import { useAppDispatch } from "../../store/hooks"
import { setToken } from "../../modules/auth"
import { setError } from "../../modules/global"

export default function Login() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dispatch = useAppDispatch()
  const styles = createLoginStyles(theme)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const onSuccess = (credentialResponse: CredentialResponse) => {
    // credentialResponse.credential is the Google ID token JWT
    // For simplicity, store token directly you may decode it for user info if needed
    dispatch(setToken(credentialResponse.credential || ''))
  }

  const onError = (error?: any) => {
    const errorMessage = "Google login failed. Please try again or check your internet connection."
    setErrorMessage(errorMessage)
    setShowErrorModal(true)
    dispatch(setError({ feature: "auth", error: errorMessage }))
  }

  const handleCloseErrorModal = () => {
    setShowErrorModal(false)
    setErrorMessage("")
  }

  const handleRetryLogin = () => {
    setShowErrorModal(false)
    setErrorMessage("")
    // The GoogleLogin component will handle the retry automatically
  }

  return (
    <Box sx={styles.container}>
      {/* Left Side - Chatbot Image/Illustration (Bigger) */}
      <Box
        sx={{
          ...styles.leftSide,
          ...(isMobile && styles.leftSideMobile)
        }}
      >
        {/* Background Pattern */}
        <Box sx={styles.backgroundPattern} />
        
        {/* Main Content */}
        <Box sx={styles.leftContent}>
          {/* Bot Avatar */}
          <Avatar sx={styles.botAvatar}>
            <BotIcon sx={styles.botIcon} />
          </Avatar>

          <Typography
            variant="h2"
            sx={styles.mainTitle}
          >
            RAG Chat bot
          </Typography>

          <Typography
            variant="h5"
            sx={styles.subtitle}
          >
            Your AI-powered RAG assistant
          </Typography>

          {/* Feature Chips */}
          <Box sx={styles.featureChipsContainer}>
            <Chip
              icon={<PsychologyIcon />}
              label="Intelligent"
              sx={styles.featureChip}
            />
            <Chip
              icon={<SparkleIcon />}
              label="RAG-powered"
              sx={styles.featureChip}
            />
            <Chip
              icon={<ChatIcon />}
              label="Conversational"
              sx={styles.featureChip}
            />
          </Box>
        </Box>
      </Box>

      {/* Right Side - Login Form (Smaller, Centered) */}
      <Box sx={styles.rightSide}>
        <Container sx={styles.loginContainer}>
          <Paper sx={styles.loginPaper}>
            {/* Mobile Logo */}
            {isMobile && (
              <Box sx={styles.mobileLogo}>
                <Avatar sx={styles.mobileAvatar}>
                  <BotIcon sx={styles.mobileBotIcon} />
                </Avatar>
                <Typography variant="h4" gutterBottom sx={styles.mobileTitle}>
                  RAG Chat bot
                </Typography>
                <Typography variant="body1" sx={styles.mobileSubtitle}>
                  Your AI-powered RAG assistant
                </Typography>
              </Box>
            )}

            <Typography
              variant="h4"
              gutterBottom
              sx={styles.welcomeTitle}
            >
              Welcome Back
            </Typography>

            <Typography
              variant="body1"
              sx={styles.welcomeSubtitle}
            >
              Sign in to continue your conversation with our AI assistant
            </Typography>

            {/* Google Login Button */}
            <Box sx={styles.googleLoginContainer}>
              <GoogleLogin
                onSuccess={onSuccess}
                onError={onError}
                theme="outline"
                size="large"
                width="280"
                text="signin_with"
                shape="rectangular"
              />
            </Box>

            <Typography
              variant="caption"
              sx={styles.termsText}
            >
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* Error Modal */}
      <LoginErrorModal
        open={showErrorModal}
        onClose={handleCloseErrorModal}
        onRetry={handleRetryLogin}
        error={errorMessage}
      />
    </Box>
  )
}
