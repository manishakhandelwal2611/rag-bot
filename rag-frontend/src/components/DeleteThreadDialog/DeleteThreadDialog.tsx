import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material'
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'

interface DeleteThreadDialogProps {
  open: boolean
  threadTitle: string
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
}

export default function DeleteThreadDialog({
  open,
  threadTitle,
  onClose,
  onConfirm,
  isLoading = false
}: DeleteThreadDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteIcon color="error" />
          <Typography variant="h6">Delete Thread</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to delete this thread?
        </Typography>
        <Box
          sx={{
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Thread Title:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {threadTitle}
          </Typography>
        </Box>
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          This action cannot be undone. All messages in this thread will be permanently deleted.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={isLoading}
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={isLoading}
          startIcon={isLoading ? undefined : <DeleteIcon />}
          sx={{ minWidth: 100 }}
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
