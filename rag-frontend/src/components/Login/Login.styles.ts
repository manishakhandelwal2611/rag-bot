import type { Theme } from "@mui/material/styles";

export const createLoginStyles = (theme: Theme) => ({
  container: {
    height: '100vh',
    display: 'flex',
  },
  
  leftSide: {
    flex: 2, // Bigger left side (2/3 of the screen)
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  
  leftSideMobile: {
    display: 'none', // Hidden on mobile
  },
  
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)
    `,
  },
  
  leftContent: {
    textAlign: 'center',
    zIndex: 1,
    maxWidth: 500,
  },
  
  botAvatar: {
    width: 150,
    height: 150,
    bgcolor: 'rgba(255,255,255,0.2)',
    mb: 4,
    mx: 'auto',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255,255,255,0.3)',
  },
  
  botIcon: {
    fontSize: 80,
    color: 'white',
  },
  
  mainTitle: {
    color: 'white',
    fontWeight: 700,
    mb: 3,
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    fontSize: '3.5rem',
  },
  
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    mb: 5,
    fontWeight: 300,
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
    fontSize: '1.3rem',
  },
  
  featureChipsContainer: {
    display: 'flex',
    gap: 2,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  
  featureChip: {
    bgcolor: 'rgba(255,255,255,0.2)',
    color: 'white',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.3)',
    fontSize: '0.9rem',
    height: 36,
    '& .MuiChip-icon': {
      color: 'white',
    },
  },
  
  rightSide: {
    flex: 1, // Smaller right side (1/3 of the screen)
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
    p: 3,
  },
  
  loginContainer: {
    maxWidth: 400,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loginPaper: {
    p: 4,
    textAlign: 'center',
    borderRadius: 8,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  },
  
  mobileLogo: {
    mb: 4,
  },
  
  mobileAvatar: {
    width: 80,
    height: 80,
    bgcolor: theme.palette.primary.main,
    mb: 2,
    mx: 'auto',
  },
  
  mobileBotIcon: {
    fontSize: 40,
  },
  
  mobileTitle: {
    fontWeight: 700,
  },
  
  mobileSubtitle: {
    color: 'text.secondary',
  },
  
  welcomeTitle: {
    fontWeight: 600,
    mb: 1,
    color: theme.palette.text.primary,
  },
  
  welcomeSubtitle: {
    color: 'text.secondary',
    mb: 4,
    lineHeight: 1.6,
  },
  
  googleLoginContainer: {
    display: 'flex',
    justifyContent: 'center',
    mb: 3,
  },
  
  termsText: {
    display: 'block',
    mt: 2,
    color: 'text.secondary',
    fontSize: '0.75rem',
    lineHeight: 1.4,
  },
})
