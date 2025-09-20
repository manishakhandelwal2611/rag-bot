import { createAction } from '@reduxjs/toolkit'
import { GlobalFeature, type FeatureValue } from '../../types/global'

// Action types
export const GLOBAL_ACTIONS = {
  SET_LOADING: 'global/setLoading',
  SET_ERROR: 'global/setError',
  CLEAR_ERROR: 'global/clearError',
  SHOW_SNACKBAR: 'global/showSnackbar',
  HIDE_SNACKBAR: 'global/hideSnackbar',
} as const

// Action creators
export const setLoading = createAction<{ feature: FeatureValue; isLoading: boolean }>(GLOBAL_ACTIONS.SET_LOADING)
export const setError = createAction<{ feature: FeatureValue; error: string | null }>(GLOBAL_ACTIONS.SET_ERROR)
export const clearError = createAction<FeatureValue>(GLOBAL_ACTIONS.CLEAR_ERROR)
export const showSnackbar = createAction<{ message: string; severity: 'error' | 'warning' | 'info' | 'success' }>(GLOBAL_ACTIONS.SHOW_SNACKBAR)
export const hideSnackbar = createAction(GLOBAL_ACTIONS.HIDE_SNACKBAR)

// Helper function to handle API errors
export const handleApiError = (error: any, feature: FeatureValue) => {
  const errorMessage = error?.response?.data?.message || 
                      error?.response?.data?.error || 
                      error?.message || 
                      'An unexpected error occurred'
  
  return {
    feature,
    error: errorMessage
  }
}

// Helper function to show error snackbar
export const showErrorSnackbar = (error: any, feature: FeatureValue) => {
  const errorMessage = error?.response?.data?.message || 
                      error?.response?.data?.error || 
                      error?.message || 
                      'An unexpected error occurred'
  
  return showSnackbar({
    message: `${feature}: ${errorMessage}`,
    severity: 'error'
  })
}
