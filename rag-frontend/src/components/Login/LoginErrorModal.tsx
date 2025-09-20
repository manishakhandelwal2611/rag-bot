import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material'
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'

interface LoginErrorModalProps {
  open: boolean
  onClose: () => void
  onRetry?: () => void
  error?: string
}

export default function LoginErrorModal({ 
  open, 
  onClose, 
  onRetry, 
  error = "Login failed. Please try again." 
}: LoginErrorModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <ErrorIcon color="error" sx={{ fontSize: 28 }} />
          <Typography variant="h6" component="span">
            Login Failed
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: 'center', py: 2 }}>
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
        >
          {error}
        </Alert>
        
        <Typography variant="body2" color="text.secondary">
          Please check your internet connection and try again. If the problem persists, 
          try refreshing the page or contact support.
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          Close
        </Button>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="contained"
            startIcon={<RefreshIcon />}
            sx={{ minWidth: 120 }}
          >
            Try Again
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
