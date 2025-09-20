import { useEffect } from 'react'
import { Snackbar, Alert, AlertTitle } from '@mui/material'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { hideSnackbar } from '../../modules/global'

export default function GlobalSnackbar() {
  const dispatch = useAppDispatch()
  const { snackbar } = useAppSelector((state) => state.global)

  const handleClose = () => {
    dispatch(hideSnackbar())
  }

  // Auto-hide snackbar after 6 seconds for error messages
  useEffect(() => {
    if (snackbar.isOpen && snackbar.severity === 'error') {
      const timer = setTimeout(() => {
        handleClose()
      }, 6000)
      
      return () => clearTimeout(timer)
    }
  }, [snackbar.isOpen, snackbar.severity])

  return (
    <Snackbar
      open={snackbar.isOpen}
      autoHideDuration={snackbar.severity === 'error' ? 6000 : 4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 8 }} // Account for header height
    >
      <Alert
        onClose={handleClose}
        severity={snackbar.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {snackbar.severity === 'error' && <AlertTitle>Error</AlertTitle>}
        {snackbar.message}
      </Alert>
    </Snackbar>
  )
}
